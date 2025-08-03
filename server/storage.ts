import { 
  teams, players, matches, transfers, news, users, userSessions, permissions, userPermissions, auditLogs, files, fileCategories, fileTags, fileTagRelations,
  type Team, type Player, type Match, type Transfer, type News, type User, type UserSession, type Permission, type UserPermission, type AuditLog, type File, type FileCategory, type FileTag,
  type InsertTeam, type InsertPlayer, type InsertMatch, type InsertTransfer, type InsertNews, type InsertUser, type InsertUserSession, type InsertPermission, type InsertUserPermission, type InsertAuditLog, type InsertFile,
  type MatchWithTeams, type TransferWithDetails, type PlayerWithTeam
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql, or } from "drizzle-orm";

export interface IStorage {
  // Users & Authentication
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
  updateUserLastLogin(id: string): Promise<void>;
  deleteUser(id: string): Promise<void>;

  // Sessions
  createUserSession(session: InsertUserSession): Promise<UserSession>;
  getUserSession(token: string): Promise<UserSession | undefined>;
  deleteUserSession(token: string): Promise<void>;
  deleteExpiredSessions(): Promise<void>;

  // Permissions
  getPermissions(): Promise<Permission[]>;
  getUserPermissions(userId: string): Promise<Permission[]>;
  createPermission(permission: InsertPermission): Promise<Permission>;
  assignPermissionToUser(userId: string, permissionId: string): Promise<void>;
  removePermissionFromUser(userId: string, permissionId: string): Promise<void>;

  // Audit Logs
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  getAuditLogs(limit?: number, offset?: number): Promise<AuditLog[]>;
  getAuditLogsByUser(userId: string, limit?: number): Promise<AuditLog[]>;

  // Files
  createFile(file: InsertFile): Promise<File>;
  getFile(id: string): Promise<File | undefined>;
  getFiles(limit?: number, offset?: number): Promise<File[]>;
  getFilesByUser(userId: string): Promise<File[]>;
  updateFile(id: string, data: Partial<File>): Promise<File>;
  deleteFile(id: string): Promise<void>;

  // File Categories
  createFileCategory(category: any): Promise<FileCategory>;
  getFileCategories(): Promise<FileCategory[]>;
  updateFileCategory(id: string, data: Partial<FileCategory>): Promise<FileCategory>;
  deleteFileCategory(id: string): Promise<void>;

  // File Tags
  createFileTag(tag: any): Promise<FileTag>;
  getFileTags(): Promise<FileTag[]>;
  updateFileTag(id: string, data: Partial<FileTag>): Promise<FileTag>;
  deleteFileTag(id: string): Promise<void>;
  assignTagToFile(fileId: string, tagId: string): Promise<void>;
  removeTagFromFile(fileId: string, tagId: string): Promise<void>;

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
  getNews(id: string): Promise<News | undefined>;
  getBreakingNews(): Promise<News[]>;
  getLatestNews(limit?: number): Promise<News[]>;
  getFeaturedNews(): Promise<News | undefined>;
  getNewsByCategory(category: string, limit?: number): Promise<News[]>;
  createNews(news: InsertNews): Promise<News>;
  incrementNewsViews(newsId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Users & Authentication
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return user;
  }

  async updateUserLastLogin(id: string): Promise<void> {
    await db.update(users).set({ lastLogin: new Date() }).where(eq(users.id, id));
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  // Sessions
  async createUserSession(session: InsertUserSession): Promise<UserSession> {
    const [newSession] = await db.insert(userSessions).values(session).returning();
    return newSession;
  }

  async getUserSession(token: string): Promise<UserSession | undefined> {
    const [session] = await db.select().from(userSessions).where(eq(userSessions.token, token));
    return session || undefined;
  }

  async deleteUserSession(token: string): Promise<void> {
    await db.delete(userSessions).where(eq(userSessions.token, token));
  }

  async deleteExpiredSessions(): Promise<void> {
    await db.delete(userSessions).where(lte(userSessions.expiresAt, new Date()));
  }

  // Permissions
  async getPermissions(): Promise<Permission[]> {
    return await db.select().from(permissions).orderBy(permissions.name);
  }

  async getUserPermissions(userId: string): Promise<Permission[]> {
    const results = await db
      .select()
      .from(userPermissions)
      .leftJoin(permissions, eq(userPermissions.permissionId, permissions.id))
      .where(eq(userPermissions.userId, userId));
    
    return results.map(result => result.permissions).filter(Boolean);
  }

  async createPermission(permission: InsertPermission): Promise<Permission> {
    const [newPermission] = await db.insert(permissions).values(permission).returning();
    return newPermission;
  }

  async assignPermissionToUser(userId: string, permissionId: string): Promise<void> {
    await db.insert(userPermissions).values({ userId, permissionId });
  }

  async removePermissionFromUser(userId: string, permissionId: string): Promise<void> {
    await db.delete(userPermissions).where(and(
      eq(userPermissions.userId, userId),
      eq(userPermissions.permissionId, permissionId)
    ));
  }

  // Audit Logs
  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const [newLog] = await db.insert(auditLogs).values(log).returning();
    return newLog;
  }

  async getAuditLogs(limit = 100, offset = 0): Promise<AuditLog[]> {
    return await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getAuditLogsByUser(userId: string, limit = 50): Promise<AuditLog[]> {
    return await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.userId, userId))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit);
  }

  // Files
  async createFile(file: InsertFile): Promise<File> {
    const [newFile] = await db.insert(files).values(file).returning();
    return newFile;
  }

  async getFile(id: string): Promise<File | undefined> {
    const [file] = await db.select().from(files).where(eq(files.id, id));
    return file || undefined;
  }

  async getFiles(limit = 50, offset = 0): Promise<File[]> {
    return await db
      .select()
      .from(files)
      .orderBy(desc(files.uploadedAt))
      .limit(limit)
      .offset(offset);
  }

  async getFilesByUser(userId: string): Promise<File[]> {
    return await db
      .select()
      .from(files)
      .where(eq(files.uploadedBy, userId))
      .orderBy(desc(files.uploadedAt));
  }

  async updateFile(id: string, data: Partial<File>): Promise<File> {
    const [file] = await db.update(files).set(data).where(eq(files.id, id)).returning();
    return file;
  }

  async deleteFile(id: string): Promise<void> {
    await db.delete(files).where(eq(files.id, id));
  }

  // File Categories
  async createFileCategory(category: any): Promise<FileCategory> {
    const [newCategory] = await db.insert(fileCategories).values(category).returning();
    return newCategory;
  }

  async getFileCategories(): Promise<FileCategory[]> {
    return await db.select().from(fileCategories).orderBy(fileCategories.name);
  }

  async updateFileCategory(id: string, data: Partial<FileCategory>): Promise<FileCategory> {
    const [category] = await db.update(fileCategories).set(data).where(eq(fileCategories.id, id)).returning();
    return category;
  }

  async deleteFileCategory(id: string): Promise<void> {
    await db.delete(fileCategories).where(eq(fileCategories.id, id));
  }

  // File Tags
  async createFileTag(tag: any): Promise<FileTag> {
    const [newTag] = await db.insert(fileTags).values(tag).returning();
    return newTag;
  }

  async getFileTags(): Promise<FileTag[]> {
    return await db.select().from(fileTags).orderBy(fileTags.name);
  }

  async updateFileTag(id: string, data: Partial<FileTag>): Promise<FileTag> {
    const [tag] = await db.update(fileTags).set(data).where(eq(fileTags.id, id)).returning();
    return tag;
  }

  async deleteFileTag(id: string): Promise<void> {
    await db.delete(fileTags).where(eq(fileTags.id, id));
  }

  async assignTagToFile(fileId: string, tagId: string): Promise<void> {
    await db.insert(fileTagRelations).values({ fileId, tagId });
  }

  async removeTagFromFile(fileId: string, tagId: string): Promise<void> {
    await db.delete(fileTagRelations).where(and(
      eq(fileTagRelations.fileId, fileId),
      eq(fileTagRelations.tagId, tagId)
    ));
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

    const matchesData = await db
      .select()
      .from(matches)
      .where(and(
        gte(matches.matchDate, today),
        lte(matches.matchDate, tomorrow)
      ))
      .orderBy(matches.matchDate);

    const result: MatchWithTeams[] = [];
    for (const match of matchesData) {
      const homeTeam = await db.select().from(teams).where(eq(teams.id, match.homeTeamId)).then(t => t[0]);
      const awayTeam = await db.select().from(teams).where(eq(teams.id, match.awayTeamId)).then(t => t[0]);
      
      if (homeTeam && awayTeam) {
        result.push({
          ...match,
          homeTeam,
          awayTeam
        });
      }
    }
    
    return result;
  }

  async getLiveMatches(): Promise<MatchWithTeams[]> {
    const matchesData = await db
      .select()
      .from(matches)
      .where(eq(matches.status, 'live'))
      .orderBy(matches.matchDate);

    const result: MatchWithTeams[] = [];
    for (const match of matchesData) {
      const homeTeam = await db.select().from(teams).where(eq(teams.id, match.homeTeamId)).then(t => t[0]);
      const awayTeam = await db.select().from(teams).where(eq(teams.id, match.awayTeamId)).then(t => t[0]);
      
      if (homeTeam && awayTeam) {
        result.push({
          ...match,
          homeTeam,
          awayTeam
        });
      }
    }
    
    return result;
  }

  async getUpcomingMatches(limit = 10): Promise<MatchWithTeams[]> {
    const now = new Date();
    
    const matchesData = await db
      .select()
      .from(matches)
      .where(and(
        gte(matches.matchDate, now),
        eq(matches.status, 'scheduled')
      ))
      .orderBy(matches.matchDate)
      .limit(limit);

    const result: MatchWithTeams[] = [];
    for (const match of matchesData) {
      const homeTeam = await db.select().from(teams).where(eq(teams.id, match.homeTeamId)).then(t => t[0]);
      const awayTeam = await db.select().from(teams).where(eq(teams.id, match.awayTeamId)).then(t => t[0]);
      
      if (homeTeam && awayTeam) {
        result.push({
          ...match,
          homeTeam,
          awayTeam
        });
      }
    }
    
    return result;
  }

  async getRecentMatches(limit = 10): Promise<MatchWithTeams[]> {
    const now = new Date();
    
    const matchesData = await db
      .select()
      .from(matches)
      .where(and(
        lte(matches.matchDate, now),
        eq(matches.status, 'completed')
      ))
      .orderBy(desc(matches.matchDate))
      .limit(limit);

    const result: MatchWithTeams[] = [];
    for (const match of matchesData) {
      const homeTeam = await db.select().from(teams).where(eq(teams.id, match.homeTeamId)).then(t => t[0]);
      const awayTeam = await db.select().from(teams).where(eq(teams.id, match.awayTeamId)).then(t => t[0]);
      
      if (homeTeam && awayTeam) {
        result.push({
          ...match,
          homeTeam,
          awayTeam
        });
      }
    }
    
    return result;
  }

  async getMatch(id: string): Promise<MatchWithTeams | undefined> {
    const matchData = await db
      .select()
      .from(matches)
      .where(eq(matches.id, id))
      .then(m => m[0]);
      
    if (!matchData) return undefined;
    
    const homeTeam = await db.select().from(teams).where(eq(teams.id, matchData.homeTeamId)).then(t => t[0]);
    const awayTeam = await db.select().from(teams).where(eq(teams.id, matchData.awayTeamId)).then(t => t[0]);
    
    if (!homeTeam || !awayTeam) return undefined;
    
    return {
      ...matchData,
      homeTeam,
      awayTeam
    };
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
      
      // Handle case where we have separate homeTeam and awayTeam fields
      if (result.homeTeam) {
        match.homeTeam = result.homeTeam;
      }
      if (result.awayTeam) {
        match.awayTeam = result.awayTeam;
      }
      
      // Fallback to the old logic
      if (result.teams) {
        if (result.teams.id === result.matches.homeTeamId) {
          match.homeTeam = result.teams;
        } else if (result.teams.id === result.matches.awayTeamId) {
          match.awayTeam = result.teams;
        }
      }
    });
    
    return Array.from(matchesMap.values());
  }

  // Transfers
  async getRecentTransfers(limit = 10): Promise<TransferWithDetails[]> {
    const transfersData = await db
      .select()
      .from(transfers)
      .orderBy(desc(transfers.announcedAt))
      .limit(limit);

    const result: TransferWithDetails[] = [];
    for (const transfer of transfersData) {
      const player = await db.select().from(players).where(eq(players.id, transfer.playerId)).then(p => p[0]);
      const fromTeam = transfer.fromTeamId ? await db.select().from(teams).where(eq(teams.id, transfer.fromTeamId)).then(t => t[0]) : undefined;
      const toTeam = transfer.toTeamId ? await db.select().from(teams).where(eq(teams.id, transfer.toTeamId)).then(t => t[0]) : undefined;
      
      if (player) {
        result.push({
          ...transfer,
          player,
          fromTeam,
          toTeam
        });
      }
    }
    
    return result;
  }

  async getTransfersByStatus(status: string): Promise<TransferWithDetails[]> {
    const transfersData = await db
      .select()
      .from(transfers)
      .where(eq(transfers.status, status))
      .orderBy(desc(transfers.announcedAt));

    const result: TransferWithDetails[] = [];
    for (const transfer of transfersData) {
      const player = await db.select().from(players).where(eq(players.id, transfer.playerId)).then(p => p[0]);
      const fromTeam = transfer.fromTeamId ? await db.select().from(teams).where(eq(teams.id, transfer.fromTeamId)).then(t => t[0]) : undefined;
      const toTeam = transfer.toTeamId ? await db.select().from(teams).where(eq(teams.id, transfer.toTeamId)).then(t => t[0]) : undefined;
      
      if (player) {
        result.push({
          ...transfer,
          player,
          fromTeam,
          toTeam
        });
      }
    }
    
    return result;
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
  async getNews(id: string): Promise<News | undefined> {
    const [newsItem] = await db.select().from(news).where(eq(news.id, id));
    return newsItem || undefined;
  }

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
