import { 
  teams, players, matches, transfers, news, users,
  type Team, type Player, type Match, type Transfer, type News, type User,
  type InsertTeam, type InsertPlayer, type InsertMatch, type InsertTransfer, type InsertNews, type InsertUser,
  type MatchWithTeams, type TransferWithDetails, type PlayerWithTeam
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql, or } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Teams
  getTeams(): Promise<Team[]>;
  getTeam(id: string): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;

  // Players
  getPlayers(): Promise<PlayerWithTeam[]>;
  getPlayer(id: string): Promise<PlayerWithTeam | undefined>;
  getPlayersByTeam(teamId: string): Promise<PlayerWithTeam[]>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayerStats(playerId: string, stats: { goals?: number; assists?: number; appearances?: number }): Promise<void>;

  // Matches
  getTodayMatches(): Promise<MatchWithTeams[]>;
  getLiveMatches(): Promise<MatchWithTeams[]>;
  getUpcomingMatches(limit?: number): Promise<MatchWithTeams[]>;
  getRecentMatches(limit?: number): Promise<MatchWithTeams[]>;
  getMatch(id: string): Promise<MatchWithTeams | undefined>;
  createMatch(match: InsertMatch): Promise<Match>;
  updateMatchScore(matchId: string, homeScore: number, awayScore: number, currentTime?: number): Promise<void>;
  updateMatchStatus(matchId: string, status: string): Promise<void>;

  // Transfers
  getRecentTransfers(limit?: number): Promise<TransferWithDetails[]>;
  getTransfersByStatus(status: string): Promise<TransferWithDetails[]>;
  createTransfer(transfer: InsertTransfer): Promise<Transfer>;

  // News
  getBreakingNews(): Promise<News[]>;
  getLatestNews(limit?: number): Promise<News[]>;
  getFeaturedNews(): Promise<News | undefined>;
  getNewsByCategory(category: string, limit?: number): Promise<News[]>;
  createNews(news: InsertNews): Promise<News>;
  incrementNewsViews(newsId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Teams
  async getTeams(): Promise<Team[]> {
    return await db.select().from(teams).orderBy(teams.nameAr);
  }

  async getTeam(id: string): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team || undefined;
  }

  async createTeam(team: InsertTeam): Promise<Team> {
    const [newTeam] = await db.insert(teams).values(team).returning();
    return newTeam;
  }

  // Players
  async getPlayers(): Promise<PlayerWithTeam[]> {
    return await db
      .select()
      .from(players)
      .leftJoin(teams, eq(players.teamId, teams.id))
      .then(results => 
        results.map(result => ({
          ...result.players,
          team: result.teams || undefined
        }))
      );
  }

  async getPlayer(id: string): Promise<PlayerWithTeam | undefined> {
    const [result] = await db
      .select()
      .from(players)
      .leftJoin(teams, eq(players.teamId, teams.id))
      .where(eq(players.id, id));
    
    if (!result) return undefined;
    
    return {
      ...result.players,
      team: result.teams || undefined
    };
  }

  async getPlayersByTeam(teamId: string): Promise<PlayerWithTeam[]> {
    return await db
      .select()
      .from(players)
      .leftJoin(teams, eq(players.teamId, teams.id))
      .where(eq(players.teamId, teamId))
      .then(results => 
        results.map(result => ({
          ...result.players,
          team: result.teams || undefined
        }))
      );
  }

  async createPlayer(player: InsertPlayer): Promise<Player> {
    const [newPlayer] = await db.insert(players).values(player).returning();
    return newPlayer;
  }

  async updatePlayerStats(playerId: string, stats: { goals?: number; assists?: number; appearances?: number }): Promise<void> {
    await db.update(players).set(stats).where(eq(players.id, playerId));
  }

  // Matches
  async getTodayMatches(): Promise<MatchWithTeams[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await db
      .select()
      .from(matches)
      .innerJoin(teams, eq(matches.homeTeamId, teams.id))
      .innerJoin(teams, eq(matches.awayTeamId, teams.id))
      .where(and(
        gte(matches.matchDate, today),
        lte(matches.matchDate, tomorrow)
      ))
      .orderBy(matches.matchDate)
      .then(this.formatMatchesWithTeams);
  }

  async getLiveMatches(): Promise<MatchWithTeams[]> {
    return await db
      .select()
      .from(matches)
      .innerJoin(teams, eq(matches.homeTeamId, teams.id))
      .innerJoin(teams, eq(matches.awayTeamId, teams.id))
      .where(eq(matches.status, 'live'))
      .orderBy(matches.matchDate)
      .then(this.formatMatchesWithTeams);
  }

  async getUpcomingMatches(limit = 10): Promise<MatchWithTeams[]> {
    const now = new Date();
    
    return await db
      .select()
      .from(matches)
      .innerJoin(teams, eq(matches.homeTeamId, teams.id))
      .innerJoin(teams, eq(matches.awayTeamId, teams.id))
      .where(and(
        gte(matches.matchDate, now),
        eq(matches.status, 'scheduled')
      ))
      .orderBy(matches.matchDate)
      .limit(limit)
      .then(this.formatMatchesWithTeams);
  }

  async getRecentMatches(limit = 10): Promise<MatchWithTeams[]> {
    const now = new Date();
    
    return await db
      .select()
      .from(matches)
      .innerJoin(teams, eq(matches.homeTeamId, teams.id))
      .innerJoin(teams, eq(matches.awayTeamId, teams.id))
      .where(and(
        lte(matches.matchDate, now),
        eq(matches.status, 'completed')
      ))
      .orderBy(desc(matches.matchDate))
      .limit(limit)
      .then(this.formatMatchesWithTeams);
  }

  async getMatch(id: string): Promise<MatchWithTeams | undefined> {
    const [result] = await db
      .select()
      .from(matches)
      .innerJoin(teams, eq(matches.homeTeamId, teams.id))
      .innerJoin(teams, eq(matches.awayTeamId, teams.id))
      .where(eq(matches.id, id))
      .then(this.formatMatchesWithTeams);
    
    return result || undefined;
  }

  async createMatch(match: InsertMatch): Promise<Match> {
    const [newMatch] = await db.insert(matches).values(match).returning();
    return newMatch;
  }

  async updateMatchScore(matchId: string, homeScore: number, awayScore: number, currentTime?: number): Promise<void> {
    const updateData: any = { homeScore, awayScore };
    if (currentTime !== undefined) {
      updateData.currentTime = currentTime;
    }
    
    await db.update(matches).set(updateData).where(eq(matches.id, matchId));
  }

  async updateMatchStatus(matchId: string, status: string): Promise<void> {
    await db.update(matches).set({ status }).where(eq(matches.id, matchId));
  }

  private formatMatchesWithTeams(results: any[]): MatchWithTeams[] {
    const matchesMap = new Map<string, MatchWithTeams>();
    
    results.forEach(result => {
      const matchId = result.matches.id;
      
      if (!matchesMap.has(matchId)) {
        matchesMap.set(matchId, {
          ...result.matches,
          homeTeam: {} as Team,
          awayTeam: {} as Team
        });
      }
      
      const match = matchesMap.get(matchId)!;
      
      if (result.teams.id === result.matches.homeTeamId) {
        match.homeTeam = result.teams;
      } else if (result.teams.id === result.matches.awayTeamId) {
        match.awayTeam = result.teams;
      }
    });
    
    return Array.from(matchesMap.values());
  }

  // Transfers
  async getRecentTransfers(limit = 10): Promise<TransferWithDetails[]> {
    return await db
      .select()
      .from(transfers)
      .innerJoin(players, eq(transfers.playerId, players.id))
      .leftJoin(teams, eq(transfers.fromTeamId, teams.id))
      .leftJoin(teams, eq(transfers.toTeamId, teams.id))
      .orderBy(desc(transfers.announcedAt))
      .limit(limit)
      .then(this.formatTransfersWithDetails);
  }

  async getTransfersByStatus(status: string): Promise<TransferWithDetails[]> {
    return await db
      .select()
      .from(transfers)
      .innerJoin(players, eq(transfers.playerId, players.id))
      .leftJoin(teams, eq(transfers.fromTeamId, teams.id))
      .leftJoin(teams, eq(transfers.toTeamId, teams.id))
      .where(eq(transfers.status, status))
      .orderBy(desc(transfers.announcedAt))
      .then(this.formatTransfersWithDetails);
  }

  async createTransfer(transfer: InsertTransfer): Promise<Transfer> {
    const [newTransfer] = await db.insert(transfers).values(transfer).returning();
    return newTransfer;
  }

  private formatTransfersWithDetails(results: any[]): TransferWithDetails[] {
    const transfersMap = new Map<string, TransferWithDetails>();
    
    results.forEach(result => {
      const transferId = result.transfers.id;
      
      if (!transfersMap.has(transferId)) {
        transfersMap.set(transferId, {
          ...result.transfers,
          player: result.players,
          fromTeam: undefined,
          toTeam: undefined
        });
      }
      
      const transfer = transfersMap.get(transferId)!;
      
      if (result.teams && result.teams.id === result.transfers.fromTeamId) {
        transfer.fromTeam = result.teams;
      } else if (result.teams && result.teams.id === result.transfers.toTeamId) {
        transfer.toTeam = result.teams;
      }
    });
    
    return Array.from(transfersMap.values());
  }

  // News
  async getBreakingNews(): Promise<News[]> {
    return await db
      .select()
      .from(news)
      .where(eq(news.isBreaking, true))
      .orderBy(desc(news.publishedAt))
      .limit(5);
  }

  async getLatestNews(limit = 20): Promise<News[]> {
    return await db
      .select()
      .from(news)
      .orderBy(desc(news.publishedAt))
      .limit(limit);
  }

  async getFeaturedNews(): Promise<News | undefined> {
    const [featured] = await db
      .select()
      .from(news)
      .where(eq(news.priority, 5))
      .orderBy(desc(news.publishedAt))
      .limit(1);
    
    return featured || undefined;
  }

  async getNewsByCategory(category: string, limit = 10): Promise<News[]> {
    return await db
      .select()
      .from(news)
      .where(eq(news.category, category))
      .orderBy(desc(news.publishedAt))
      .limit(limit);
  }

  async createNews(newsItem: InsertNews): Promise<News> {
    const [newNews] = await db.insert(news).values(newsItem).returning();
    return newNews;
  }

  async incrementNewsViews(newsId: string): Promise<void> {
    await db
      .update(news)
      .set({ views: sql`${news.views} + 1` })
      .where(eq(news.id, newsId));
  }
}

export const storage = new DatabaseStorage();
