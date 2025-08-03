import axios from "axios";
import { Router } from "express";
import { authenticateToken } from "./auth";

// External API Integration with Multiple Sources
export class ExternalAPIManager {
  private router: Router;
  private apiKeys: { [key: string]: string };
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.router = Router();
    this.apiKeys = {
      apiFootball: process.env.API_FOOTBALL_KEY || "",
      footballData: process.env.FOOTBALL_DATA_KEY || "",
      liveScore: process.env.LIVE_SCORE_KEY || "",
      sofascore: process.env.SOFASCORE_KEY || "",
      // إضافة APIs جديدة
      scoreBat: process.env.SCOREBAT_KEY || "",
      apiSports: process.env.API_SPORTS_KEY || "",
      rapidApi: process.env.RAPID_API_KEY || "",
    };
    this.setupRoutes();
  }

  private setupRoutes() {
    // Live Matches - Enhanced with multiple sources
    this.router.get("/api/external/matches/live", async (req, res) => {
      try {
        const matches = await this.getLiveMatchesEnhanced();
        res.json(matches);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch live matches" });
      }
    });

    // Match Details with enhanced statistics
    this.router.get("/api/external/matches/:id", async (req, res) => {
      try {
        const match = await this.getMatchDetailsEnhanced(req.params.id);
        res.json(match);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch match details" });
      }
    });

    // Enhanced Team Statistics
    this.router.get("/api/external/teams/:id/stats", async (req, res) => {
      try {
        const stats = await this.getTeamStatsEnhanced(req.params.id);
        res.json(stats);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch team statistics" });
      }
    });

    // Enhanced Player Statistics
    this.router.get("/api/external/players/:id/stats", async (req, res) => {
      try {
        const stats = await this.getPlayerStatsEnhanced(req.params.id);
        res.json(stats);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch player statistics" });
      }
    });

    // League Standings with multiple sources
    this.router.get("/api/external/leagues/:id/standings", async (req, res) => {
      try {
        const standings = await this.getLeagueStandingsEnhanced(req.params.id);
        res.json(standings);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch league standings" });
      }
    });

    // Recent Transfers with enhanced data
    this.router.get("/api/external/transfers/recent", async (req, res) => {
      try {
        const transfers = await this.getRecentTransfersEnhanced();
        res.json(transfers);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch recent transfers" });
      }
    });

    // Enhanced Search Teams
    this.router.get("/api/external/search/teams", async (req, res) => {
      try {
        const { query } = req.query;
        if (!query) {
          return res.status(400).json({ error: "Query parameter required" });
        }
        const teams = await this.searchTeamsEnhanced(query as string);
        res.json(teams);
      } catch (error) {
        res.status(500).json({ error: "Failed to search teams" });
      }
    });

    // Enhanced Search Players
    this.router.get("/api/external/search/players", async (req, res) => {
      try {
        const { query } = req.query;
        if (!query) {
          return res.status(400).json({ error: "Query parameter required" });
        }
        const players = await this.searchPlayersEnhanced(query as string);
        res.json(players);
      } catch (error) {
        res.status(500).json({ error: "Failed to search players" });
      }
    });

    // Match Statistics with detailed analysis
    this.router.get("/api/external/matches/:id/statistics", async (req, res) => {
      try {
        const stats = await this.getMatchStatisticsEnhanced(req.params.id);
        res.json(stats);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch match statistics" });
      }
    });

    // Team Matches with enhanced filtering
    this.router.get("/api/external/teams/:id/matches", async (req, res) => {
      try {
        const { season, status, limit } = req.query;
        const matches = await this.getTeamMatchesEnhanced(req.params.id, {
          season: season as string,
          status: status as string,
          limit: limit ? parseInt(limit as string) : 10,
        });
        res.json(matches);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch team matches" });
      }
    });

    // New: Head to Head Statistics
    this.router.get("/api/external/teams/:team1/h2h/:team2", async (req, res) => {
      try {
        const h2h = await this.getHeadToHeadStats(req.params.team1, req.params.team2);
        res.json(h2h);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch head to head statistics" });
      }
    });

    // New: League Top Scorers
    this.router.get("/api/external/leagues/:id/top-scorers", async (req, res) => {
      try {
        const scorers = await this.getTopScorers(req.params.id);
        res.json(scorers);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch top scorers" });
      }
    });

    // New: League Top Assists
    this.router.get("/api/external/leagues/:id/top-assists", async (req, res) => {
      try {
        const assists = await this.getTopAssists(req.params.id);
        res.json(assists);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch top assists" });
      }
    });

    // New: Match Predictions
    this.router.get("/api/external/matches/:id/predictions", async (req, res) => {
      try {
        const predictions = await this.getMatchPredictions(req.params.id);
        res.json(predictions);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch match predictions" });
      }
    });

    // New: Team Form Analysis
    this.router.get("/api/external/teams/:id/form", async (req, res) => {
      try {
        const form = await this.getTeamFormAnalysis(req.params.id);
        res.json(form);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch team form analysis" });
      }
    });

    // New: Injury Reports
    this.router.get("/api/external/teams/:id/injuries", async (req, res) => {
      try {
        const injuries = await this.getTeamInjuries(req.params.id);
        res.json(injuries);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch team injuries" });
      }
    });

    // New: News and Updates
    this.router.get("/api/external/news", async (req, res) => {
      try {
        const { league, team, limit } = req.query;
        const news = await this.getFootballNews({
          league: league as string,
          team: team as string,
          limit: limit ? parseInt(limit as string) : 20,
        });
        res.json(news);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch football news" });
      }
    });
  }

  // Cache management
  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // Enhanced Live Matches with multiple sources
  private async getLiveMatchesEnhanced() {
    const cacheKey = "live_matches_enhanced";
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      // Try API-Football first
      const apiFootballMatches = await this.getLiveMatchesFromAPIFootball();
      
      // Try Football-Data as backup
      const footballDataMatches = await this.getLiveMatchesFromFootballData();
      
      // Merge and deduplicate matches
      const allMatches = [...apiFootballMatches, ...footballDataMatches];
      const uniqueMatches = this.deduplicateMatches(allMatches);
      
      this.setCachedData(cacheKey, uniqueMatches);
      return uniqueMatches;
    } catch (error) {
      console.error("Enhanced live matches error:", error);
      return [];
    }
  }

  private async getLiveMatchesFromAPIFootball() {
    if (!this.apiKeys.apiFootball) return [];
    
    try {
      const response = await axios.get("https://v3.football.api-sports.io/fixtures", {
        headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
          "x-rapidapi-key": this.apiKeys.apiFootball,
        },
        params: {
          live: "all",
          league: "203", // Saudi Pro League
        },
      });

      return this.formatLiveMatches(response.data.response);
    } catch (error) {
      console.error("API-Football live matches error:", error);
      return [];
    }
  }

  private async getLiveMatchesFromFootballData() {
    if (!this.apiKeys.footballData) return [];
    
    try {
      const response = await axios.get("https://api.football-data.org/v4/matches", {
        headers: {
          "X-Auth-Token": this.apiKeys.footballData,
        },
        params: {
          status: "LIVE",
          competitions: "203", // Saudi Pro League
        },
      });

      return this.formatFootballDataMatches(response.data.matches);
    } catch (error) {
      console.error("Football-Data live matches error:", error);
      return [];
    }
  }

  // Enhanced Match Details
  private async getMatchDetailsEnhanced(matchId: string) {
    const cacheKey = `match_details_${matchId}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      // Get basic match details
      const matchDetails = await this.getMatchDetails(matchId);
      
      // Get enhanced statistics
      const statistics = await this.getMatchStatistics(matchId);
      
      // Get predictions
      const predictions = await this.getMatchPredictions(matchId);
      
      const enhancedMatch = {
        ...matchDetails,
        statistics,
        predictions,
        lastUpdated: new Date().toISOString(),
      };

      this.setCachedData(cacheKey, enhancedMatch);
      return enhancedMatch;
    } catch (error) {
      console.error("Enhanced match details error:", error);
      return null;
    }
  }

  // Enhanced Team Statistics
  private async getTeamStatsEnhanced(teamId: string) {
    const cacheKey = `team_stats_${teamId}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const basicStats = await this.getTeamStats(teamId);
      const formAnalysis = await this.getTeamFormAnalysis(teamId);
      const injuries = await this.getTeamInjuries(teamId);
      
      const enhancedStats = {
        ...basicStats,
        form: formAnalysis,
        injuries,
        lastUpdated: new Date().toISOString(),
      };

      this.setCachedData(cacheKey, enhancedStats);
      return enhancedStats;
    } catch (error) {
      console.error("Enhanced team stats error:", error);
      return null;
    }
  }

  // Enhanced Player Statistics
  private async getPlayerStatsEnhanced(playerId: string) {
    const cacheKey = `player_stats_${playerId}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const basicStats = await this.getPlayerStats(playerId);
      
      // Get additional player data from multiple sources
      const additionalStats = await this.getPlayerAdditionalStats(playerId);
      
      const enhancedStats = {
        ...basicStats,
        ...additionalStats,
        lastUpdated: new Date().toISOString(),
      };

      this.setCachedData(cacheKey, enhancedStats);
      return enhancedStats;
    } catch (error) {
      console.error("Enhanced player stats error:", error);
      return null;
    }
  }

  // New: Head to Head Statistics
  private async getHeadToHeadStats(team1Id: string, team2Id: string) {
    const cacheKey = `h2h_${team1Id}_${team2Id}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get("https://v3.football.api-sports.io/fixtures/headtohead", {
        headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
          "x-rapidapi-key": this.apiKeys.apiFootball,
        },
        params: {
          h2h: `${team1Id}-${team2Id}`,
          league: "203",
        },
      });

      const h2hData = this.formatHeadToHeadStats(response.data.response);
      this.setCachedData(cacheKey, h2hData);
      return h2hData;
    } catch (error) {
      console.error("Head to head stats error:", error);
      return null;
    }
  }

  // New: Top Scorers
  private async getTopScorers(leagueId: string) {
    const cacheKey = `top_scorers_${leagueId}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get("https://v3.football.api-sports.io/players/topscorers", {
        headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
          "x-rapidapi-key": this.apiKeys.apiFootball,
        },
        params: {
          league: leagueId,
          season: "2024",
        },
      });

      const scorers = this.formatTopScorers(response.data.response);
      this.setCachedData(cacheKey, scorers);
      return scorers;
    } catch (error) {
      console.error("Top scorers error:", error);
      return [];
    }
  }

  // New: Top Assists
  private async getTopAssists(leagueId: string) {
    const cacheKey = `top_assists_${leagueId}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get("https://v3.football.api-sports.io/players/topassists", {
        headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
          "x-rapidapi-key": this.apiKeys.apiFootball,
        },
        params: {
          league: leagueId,
          season: "2024",
        },
      });

      const assists = this.formatTopAssists(response.data.response);
      this.setCachedData(cacheKey, assists);
      return assists;
    } catch (error) {
      console.error("Top assists error:", error);
      return [];
    }
  }

  // New: Match Predictions
  private async getMatchPredictions(matchId: string) {
    const cacheKey = `predictions_${matchId}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get("https://v3.football.api-sports.io/predictions", {
        headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
          "x-rapidapi-key": this.apiKeys.apiFootball,
        },
        params: {
          fixture: matchId,
        },
      });

      const predictions = this.formatPredictions(response.data.response[0]);
      this.setCachedData(cacheKey, predictions);
      return predictions;
    } catch (error) {
      console.error("Match predictions error:", error);
      return null;
    }
  }

  // New: Team Form Analysis
  private async getTeamFormAnalysis(teamId: string) {
    const cacheKey = `team_form_${teamId}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get("https://v3.football.api-sports.io/fixtures", {
        headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
          "x-rapidapi-key": this.apiKeys.apiFootball,
        },
        params: {
          team: teamId,
          league: "203",
          season: "2024",
          last: "10",
        },
      });

      const form = this.analyzeTeamForm(response.data.response);
      this.setCachedData(cacheKey, form);
      return form;
    } catch (error) {
      console.error("Team form analysis error:", error);
      return null;
    }
  }

  // New: Team Injuries
  private async getTeamInjuries(teamId: string) {
    const cacheKey = `team_injuries_${teamId}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get("https://v3.football.api-sports.io/injuries", {
        headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
          "x-rapidapi-key": this.apiKeys.apiFootball,
        },
        params: {
          team: teamId,
          league: "203",
          season: "2024",
        },
      });

      const injuries = this.formatInjuries(response.data.response);
      this.setCachedData(cacheKey, injuries);
      return injuries;
    } catch (error) {
      console.error("Team injuries error:", error);
      return [];
    }
  }

  // New: Football News
  private async getFootballNews(options: { league?: string; team?: string; limit?: number }) {
    const cacheKey = `news_${options.league || 'all'}_${options.team || 'all'}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      // Try multiple news sources
      const newsSources = [
        this.getNewsFromScoreBat(options),
        this.getNewsFromRapidAPI(options),
      ];

      const allNews = await Promise.allSettled(newsSources);
      const validNews = allNews
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<any>).value)
        .flat();

      // Sort by date and limit
      const sortedNews = validNews
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, options.limit || 20);

      this.setCachedData(cacheKey, sortedNews);
      return sortedNews;
    } catch (error) {
      console.error("Football news error:", error);
      return [];
    }
  }

  // Helper methods for new features
  private deduplicateMatches(matches: any[]): any[] {
    const seen = new Set();
    return matches.filter(match => {
      const key = `${match.homeTeam.id}-${match.awayTeam.id}-${match.date}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private formatFootballDataMatches(matches: any[]): any[] {
    return matches.map(match => ({
      id: match.id,
      date: match.utcDate,
      status: match.status,
      elapsed: match.minute,
      homeTeam: {
        id: match.homeTeam.id,
        name: match.homeTeam.name,
        logo: match.homeTeam.crest,
        score: match.score.fullTime.home,
      },
      awayTeam: {
        id: match.awayTeam.id,
        name: match.awayTeam.name,
        logo: match.awayTeam.crest,
        score: match.score.fullTime.away,
      },
      league: {
        id: match.competition.id,
        name: match.competition.name,
        logo: match.competition.emblem,
      },
      venue: match.venue,
    }));
  }

  private formatHeadToHeadStats(data: any) {
    return {
      totalMatches: data.length,
      homeWins: data.filter((m: any) => m.teams.home.winner).length,
      awayWins: data.filter((m: any) => m.teams.away.winner).length,
      draws: data.filter((m: any) => !m.teams.home.winner && !m.teams.away.winner).length,
      matches: data.map((match: any) => this.formatMatchDetails(match)),
    };
  }

  private formatTopScorers(scorers: any[]) {
    return scorers.map((scorer, index) => ({
      rank: index + 1,
      player: {
        id: scorer.player.id,
        name: scorer.player.name,
        photo: scorer.player.photo,
        nationality: scorer.player.nationality,
      },
      team: scorer.statistics[0]?.team,
      goals: scorer.statistics[0]?.statistics?.Goals || 0,
      assists: scorer.statistics[0]?.statistics?.Assists || 0,
      matches: scorer.statistics[0]?.statistics?.Appearences || 0,
    }));
  }

  private formatTopAssists(assists: any[]) {
    return assists.map((assist, index) => ({
      rank: index + 1,
      player: {
        id: assist.player.id,
        name: assist.player.name,
        photo: assist.player.photo,
        nationality: assist.player.nationality,
      },
      team: assist.statistics[0]?.team,
      assists: assist.statistics[0]?.statistics?.Assists || 0,
      goals: assist.statistics[0]?.statistics?.Goals || 0,
      matches: assist.statistics[0]?.statistics?.Appearences || 0,
    }));
  }

  private formatPredictions(prediction: any) {
    if (!prediction) return null;

    return {
      homeWin: prediction.predictions?.winner?.id === prediction.teams.home.id,
      awayWin: prediction.predictions?.winner?.id === prediction.teams.away.id,
      draw: !prediction.predictions?.winner,
      homeWinPercentage: prediction.predictions?.percent?.home,
      awayWinPercentage: prediction.predictions?.percent?.away,
      drawPercentage: prediction.predictions?.percent?.draw,
      advice: prediction.predictions?.advice,
      goals: prediction.predictions?.goals,
      underOver: prediction.predictions?.under_over,
    };
  }

  private analyzeTeamForm(matches: any[]) {
    const form = matches.map(match => {
      const isHome = match.teams.home.id === match.fixture.id;
      const teamScore = isHome ? match.goals.home : match.goals.away;
      const opponentScore = isHome ? match.goals.away : match.goals.home;
      
      if (teamScore > opponentScore) return 'W';
      if (teamScore < opponentScore) return 'L';
      return 'D';
    });

    const wins = form.filter(result => result === 'W').length;
    const draws = form.filter(result => result === 'D').length;
    const losses = form.filter(result => result === 'L').length;

    return {
      form: form.join(''),
      wins,
      draws,
      losses,
      points: wins * 3 + draws,
      winRate: (wins / form.length) * 100,
      lastFive: form.slice(-5),
    };
  }

  private formatInjuries(injuries: any[]) {
    return injuries.map(injury => ({
      player: {
        id: injury.player.id,
        name: injury.player.name,
        photo: injury.player.photo,
      },
      team: injury.team,
      type: injury.player.type,
      reason: injury.player.reason,
    }));
  }

  private async getNewsFromScoreBat(options: { league?: string; team?: string; limit?: number }) {
    if (!this.apiKeys.scoreBat) return [];

    try {
      const response = await axios.get("https://www.scorebat.com/video-api/v3/feed/", {
        headers: {
          "token": this.apiKeys.scoreBat,
        },
        params: {
          competition: options.league,
          team: options.team,
        },
      });

      return response.data.response.map((item: any) => ({
        title: item.title,
        description: item.competition,
        date: item.date,
        url: item.url,
        thumbnail: item.thumbnail,
        source: 'ScoreBat',
      }));
    } catch (error) {
      console.error("ScoreBat news error:", error);
      return [];
    }
  }

  private async getNewsFromRapidAPI(options: { league?: string; team?: string; limit?: number }) {
    if (!this.apiKeys.rapidApi) return [];

    try {
      const response = await axios.get("https://football-news-aggregator.p.rapidapi.com/news", {
        headers: {
          "X-RapidAPI-Key": this.apiKeys.rapidApi,
          "X-RapidAPI-Host": "football-news-aggregator.p.rapidapi.com",
        },
        params: {
          league: options.league,
          team: options.team,
          limit: options.limit,
        },
      });

      return response.data.articles.map((article: any) => ({
        title: article.title,
        description: article.description,
        date: article.publishedAt,
        url: article.url,
        thumbnail: article.urlToImage,
        source: article.source.name,
      }));
    } catch (error) {
      console.error("RapidAPI news error:", error);
      return [];
    }
  }

  private async getPlayerAdditionalStats(playerId: string) {
    // Get additional player statistics from multiple sources
    try {
      const [apiFootballStats, footballDataStats] = await Promise.allSettled([
        this.getPlayerStatsFromAPIFootball(playerId),
        this.getPlayerStatsFromFootballData(playerId),
      ]);

      const stats = {};
      
      if (apiFootballStats.status === 'fulfilled') {
        Object.assign(stats, apiFootballStats.value);
      }
      
      if (footballDataStats.status === 'fulfilled') {
        Object.assign(stats, footballDataStats.value);
      }

      return stats;
    } catch (error) {
      console.error("Additional player stats error:", error);
      return {};
    }
  }

  private async getPlayerStatsFromAPIFootball(playerId: string) {
    if (!this.apiKeys.apiFootball) return {};

    try {
      const response = await axios.get(`https://v3.football.api-sports.io/players`, {
        headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
          "x-rapidapi-key": this.apiKeys.apiFootball,
        },
        params: {
          id: playerId,
          league: "203",
          season: "2024",
        },
      });

      const player = response.data.response[0];
      return {
        position: player.statistics[0]?.statistics?.Position,
        height: player.player.height,
        weight: player.player.weight,
        nationality: player.player.nationality,
        birthDate: player.player.birth.date,
        birthPlace: player.player.birth.place,
      };
    } catch (error) {
      console.error("API-Football player stats error:", error);
      return {};
    }
  }

  private async getPlayerStatsFromFootballData(playerId: string) {
    if (!this.apiKeys.footballData) return {};

    try {
      const response = await axios.get(`https://api.football-data.org/v4/persons/${playerId}`, {
        headers: {
          "X-Auth-Token": this.apiKeys.footballData,
        },
      });

      const player = response.data;
      return {
        firstName: player.firstName,
        lastName: player.lastName,
        dateOfBirth: player.dateOfBirth,
        nationality: player.nationality,
        position: player.position,
        shirtNumber: player.shirtNumber,
        lastUpdated: player.lastUpdated,
      };
    } catch (error) {
      console.error("Football-Data player stats error:", error);
      return {};
    }
  }

  // Enhanced methods for existing functionality
  private async getLeagueStandingsEnhanced(leagueId: string) {
    const cacheKey = `standings_${leagueId}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const standings = await this.getLeagueStandings(leagueId);
      this.setCachedData(cacheKey, standings);
      return standings;
    } catch (error) {
      console.error("Enhanced standings error:", error);
      return [];
    }
  }

  private async getRecentTransfersEnhanced() {
    const cacheKey = "recent_transfers_enhanced";
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const transfers = await this.getRecentTransfers();
      this.setCachedData(cacheKey, transfers);
      return transfers;
    } catch (error) {
      console.error("Enhanced transfers error:", error);
      return [];
    }
  }

  private async searchTeamsEnhanced(query: string) {
    const cacheKey = `search_teams_${query}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const teams = await this.searchTeams(query);
      this.setCachedData(cacheKey, teams);
      return teams;
    } catch (error) {
      console.error("Enhanced team search error:", error);
      return [];
    }
  }

  private async searchPlayersEnhanced(query: string) {
    const cacheKey = `search_players_${query}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const players = await this.searchPlayers(query);
      this.setCachedData(cacheKey, players);
      return players;
    } catch (error) {
      console.error("Enhanced player search error:", error);
      return [];
    }
  }

  private async getMatchStatisticsEnhanced(matchId: string) {
    const cacheKey = `match_stats_${matchId}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const stats = await this.getMatchStatistics(matchId);
      this.setCachedData(cacheKey, stats);
      return stats;
    } catch (error) {
      console.error("Enhanced match statistics error:", error);
      return null;
    }
  }

  private async getTeamMatchesEnhanced(teamId: string, options: { season?: string; status?: string; limit?: number }) {
    const cacheKey = `team_matches_${teamId}_${options.season}_${options.status}_${options.limit}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const matches = await this.getTeamMatches(teamId, options);
      const limitedMatches = options.limit ? matches.slice(0, options.limit) : matches;
      this.setCachedData(cacheKey, limitedMatches);
      return limitedMatches;
    } catch (error) {
      console.error("Enhanced team matches error:", error);
      return [];
    }
  }

  // Original API methods (kept for compatibility)
  private async getLiveMatches() {
    try {
      const response = await axios.get("https://v3.football.api-sports.io/fixtures", {
        headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
          "x-rapidapi-key": this.apiKeys.apiFootball,
        },
        params: {
          live: "all",
          league: "203", // Saudi Pro League
        },
      });

      return this.formatLiveMatches(response.data.response);
    } catch (error) {
      console.error("API-Football error:", error);
      return [];
    }
  }

  private async getMatchDetails(matchId: string) {
    try {
      const response = await axios.get(`https://v3.football.api-sports.io/fixtures`, {
        headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
          "x-rapidapi-key": this.apiKeys.apiFootball,
        },
        params: {
          id: matchId,
        },
      });

      return this.formatMatchDetails(response.data.response[0]);
    } catch (error) {
      console.error("API-Football error:", error);
      return null;
    }
  }

  private async getTeamStats(teamId: string) {
    try {
      const response = await axios.get(`https://v3.football.api-sports.io/teams/statistics`, {
        headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
          "x-rapidapi-key": this.apiKeys.apiFootball,
        },
        params: {
          team: teamId,
          league: "203",
          season: "2024",
        },
      });

      return this.formatTeamStats(response.data.response);
    } catch (error) {
      console.error("API-Football error:", error);
      return null;
    }
  }

  private async getPlayerStats(playerId: string) {
    try {
      const response = await axios.get(`https://v3.football.api-sports.io/players`, {
        headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
          "x-rapidapi-key": this.apiKeys.apiFootball,
        },
        params: {
          id: playerId,
          league: "203",
          season: "2024",
        },
      });

      return this.formatPlayerStats(response.data.response[0]);
    } catch (error) {
      console.error("API-Football error:", error);
      return null;
    }
  }

  // Football-Data.org Integration (Backup)
  private async getLeagueStandings(leagueId: string) {
    try {
      const response = await axios.get(`https://api.football-data.org/v4/competitions/${leagueId}/standings`, {
        headers: {
          "X-Auth-Token": this.apiKeys.footballData,
        },
      });

      return this.formatStandings(response.data.standings[0].table);
    } catch (error) {
      console.error("Football-Data error:", error);
      return [];
    }
  }

  private async getRecentTransfers() {
    try {
      const response = await axios.get("https://v3.football.api-sports.io/transfers", {
        headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
          "x-rapidapi-key": this.apiKeys.apiFootball,
        },
        params: {
          league: "203",
          season: "2024",
        },
      });

      return this.formatTransfers(response.data.response);
    } catch (error) {
      console.error("API-Football error:", error);
      return [];
    }
  }

  private async searchTeams(query: string) {
    try {
      const response = await axios.get("https://v3.football.api-sports.io/teams", {
        headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
          "x-rapidapi-key": this.apiKeys.apiFootball,
        },
        params: {
          search: query,
          league: "203",
        },
      });

      return this.formatTeams(response.data.response);
    } catch (error) {
      console.error("API-Football error:", error);
      return [];
    }
  }

  private async searchPlayers(query: string) {
    try {
      const response = await axios.get("https://v3.football.api-sports.io/players", {
        headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
          "x-rapidapi-key": this.apiKeys.apiFootball,
        },
        params: {
          search: query,
          league: "203",
        },
      });

      return this.formatPlayers(response.data.response);
    } catch (error) {
      console.error("API-Football error:", error);
      return [];
    }
  }

  private async getMatchStatistics(matchId: string) {
    try {
      const response = await axios.get(`https://v3.football.api-sports.io/fixtures/statistics`, {
        headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
          "x-rapidapi-key": this.apiKeys.apiFootball,
        },
        params: {
          fixture: matchId,
        },
      });

      return this.formatMatchStatistics(response.data.response);
    } catch (error) {
      console.error("API-Football error:", error);
      return null;
    }
  }

  private async getTeamMatches(teamId: string, options: { season?: string; status?: string }) {
    try {
      const response = await axios.get(`https://v3.football.api-sports.io/fixtures`, {
        headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
          "x-rapidapi-key": this.apiKeys.apiFootball,
        },
        params: {
          team: teamId,
          league: "203",
          season: options.season || "2024",
          status: options.status || "FT",
        },
      });

      return this.formatTeamMatches(response.data.response);
    } catch (error) {
      console.error("API-Football error:", error);
      return [];
    }
  }

  // Data Formatting Methods
  private formatLiveMatches(matches: any[]) {
    return matches.map(match => ({
      id: match.fixture.id,
      date: match.fixture.date,
      status: match.fixture.status.short,
      elapsed: match.fixture.status.elapsed,
      homeTeam: {
        id: match.teams.home.id,
        name: match.teams.home.name,
        logo: match.teams.home.logo,
        score: match.goals.home,
      },
      awayTeam: {
        id: match.teams.away.id,
        name: match.teams.away.name,
        logo: match.teams.away.logo,
        score: match.goals.away,
      },
      league: {
        id: match.league.id,
        name: match.league.name,
        logo: match.league.logo,
      },
      venue: match.fixture.venue?.name,
    }));
  }

  private formatMatchDetails(match: any) {
    if (!match) return null;

    return {
      id: match.fixture.id,
      date: match.fixture.date,
      status: match.fixture.status.short,
      elapsed: match.fixture.status.elapsed,
      homeTeam: {
        id: match.teams.home.id,
        name: match.teams.home.name,
        logo: match.teams.home.logo,
        score: match.goals.home,
        winner: match.teams.home.winner,
      },
      awayTeam: {
        id: match.teams.away.id,
        name: match.teams.away.name,
        logo: match.teams.away.logo,
        score: match.goals.away,
        winner: match.teams.away.winner,
      },
      league: {
        id: match.league.id,
        name: match.league.name,
        logo: match.league.logo,
        round: match.league.round,
      },
      venue: match.fixture.venue?.name,
      referee: match.fixture.referee,
      events: match.events?.map((event: any) => ({
        time: event.time,
        type: event.type,
        detail: event.detail,
        player: event.player,
        team: event.team,
      })),
    };
  }

  private formatTeamStats(stats: any) {
    if (!stats) return null;

    return {
      league: stats.league,
      team: stats.team,
      form: stats.form,
      fixtures: {
        played: stats.fixtures.played,
        wins: stats.fixtures.wins,
        draws: stats.fixtures.draws,
        loses: stats.fixtures.loses,
      },
      goals: {
        for: stats.goals.for,
        against: stats.goals.against,
        difference: stats.goals.for - stats.goals.against,
      },
      cleanSheets: stats.clean_sheet,
      failedToScore: stats.failed_to_score,
      biggest: stats.biggest,
    };
  }

  private formatPlayerStats(player: any) {
    if (!player) return null;

    return {
      id: player.player.id,
      name: player.player.name,
      age: player.player.age,
      nationality: player.player.nationality,
      height: player.player.height,
      weight: player.player.weight,
      photo: player.player.photo,
      team: player.statistics[0]?.team,
      league: player.statistics[0]?.league,
      statistics: player.statistics[0]?.statistics,
    };
  }

  private formatStandings(standings: any[]) {
    return standings.map((team, index) => ({
      position: team.position,
      team: {
        id: team.team.id,
        name: team.team.name,
        logo: team.team.crest,
      },
      playedGames: team.playedGames,
      won: team.won,
      draw: team.draw,
      lost: team.lost,
      points: team.points,
      goalsFor: team.goalsFor,
      goalsAgainst: team.goalsAgainst,
      goalDifference: team.goalDifference,
    }));
  }

  private formatTransfers(transfers: any[]) {
    return transfers.map(transfer => ({
      player: {
        id: transfer.player.id,
        name: transfer.player.name,
        photo: transfer.player.photo,
      },
      from: transfer.transfer.from,
      to: transfer.transfer.to,
      date: transfer.transfer.date,
      type: transfer.transfer.type,
      amount: transfer.transfer.amount,
    }));
  }

  private formatTeams(teams: any[]) {
    return teams.map(team => ({
      id: team.team.id,
      name: team.team.name,
      logo: team.team.logo,
      founded: team.team.founded,
      country: team.team.country,
      venue: team.venue?.name,
    }));
  }

  private formatPlayers(players: any[]) {
    return players.map(player => ({
      id: player.player.id,
      name: player.player.name,
      age: player.player.age,
      nationality: player.player.nationality,
      height: player.player.height,
      weight: player.player.weight,
      photo: player.player.photo,
      team: player.statistics[0]?.team,
    }));
  }

  private formatMatchStatistics(stats: any[]) {
    if (!stats || stats.length < 2) return null;

    return {
      home: stats[0].statistics,
      away: stats[1].statistics,
    };
  }

  private formatTeamMatches(matches: any[]) {
    return matches.map(match => ({
      id: match.fixture.id,
      date: match.fixture.date,
      status: match.fixture.status.short,
      homeTeam: {
        id: match.teams.home.id,
        name: match.teams.home.name,
        logo: match.teams.home.logo,
        score: match.goals.home,
      },
      awayTeam: {
        id: match.teams.away.id,
        name: match.teams.away.name,
        logo: match.teams.away.logo,
        score: match.goals.away,
      },
      league: {
        id: match.league.id,
        name: match.league.name,
        logo: match.league.logo,
      },
    }));
  }

  public getRouter(): Router {
    return this.router;
  }
}

// Create and export the external API manager
export const externalAPIManager = new ExternalAPIManager(); 