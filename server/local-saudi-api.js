import { Router } from 'express';
import { saudiLeagueScraper } from './saudi-league-scraper.js';
import { liveScoreAPI } from './live-score-api.js';

// نظام APIs محلي للدوري السعودي
export class LocalSaudiAPI {
  constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  setupRoutes() {
    // المباريات المباشرة (مع Live-score API)
    this.router.get('/api/local/matches/live', async (req, res) => {
      try {
        // محاولة الحصول من Live-score API أولاً
        let matches = await liveScoreAPI.getLiveMatches();
        
        // إذا لم تنجح، استخدم البيانات المحلية
        if (!matches || matches.length === 0) {
          console.log('استخدام البيانات المحلية للمباريات المباشرة');
          const localMatches = await saudiLeagueScraper.getMatchesFromSaudiLeague();
          matches = localMatches.filter(match => match.status === 'live');
        }
        
        res.json(matches);
      } catch (error) {
        console.error('خطأ في جلب المباريات المباشرة:', error.message);
        // استخدام البيانات المحلية كاحتياطي
        try {
          const localMatches = await saudiLeagueScraper.getMatchesFromSaudiLeague();
          const liveMatches = localMatches.filter(match => match.status === 'live');
          res.json(liveMatches);
        } catch (localError) {
          res.status(500).json({ error: 'فشل في جلب المباريات المباشرة' });
        }
      }
    });

    // جميع المباريات (مع Live-score API)
    this.router.get('/api/local/matches', async (req, res) => {
      try {
        // محاولة الحصول من Live-score API أولاً
        let matches = await liveScoreAPI.getAllMatches();
        
        // إذا لم تنجح، استخدم البيانات المحلية
        if (!matches || matches.length === 0) {
          console.log('استخدام البيانات المحلية لجميع المباريات');
          matches = await saudiLeagueScraper.getMatchesFromSaudiLeague();
        }
        
        res.json(matches);
      } catch (error) {
        console.error('خطأ في جلب جميع المباريات:', error.message);
        // استخدام البيانات المحلية كاحتياطي
        try {
          const localMatches = await saudiLeagueScraper.getMatchesFromSaudiLeague();
          res.json(localMatches);
        } catch (localError) {
          res.status(500).json({ error: 'فشل في جلب المباريات' });
        }
      }
    });

    // ترتيب الفرق (مع Live-score API)
    this.router.get('/api/local/standings', async (req, res) => {
      try {
        // محاولة الحصول من Live-score API أولاً
        let standings = await liveScoreAPI.getStandings();
        
        // إذا لم تنجح، استخدم البيانات المحلية
        if (!standings || standings.length === 0) {
          console.log('استخدام البيانات المحلية لترتيب الفرق');
          standings = await saudiLeagueScraper.getStandings();
        }
        
        res.json(standings);
      } catch (error) {
        console.error('خطأ في جلب ترتيب الفرق:', error.message);
        // استخدام البيانات المحلية كاحتياطي
        try {
          const localStandings = await saudiLeagueScraper.getStandings();
          res.json(localStandings);
        } catch (localError) {
          res.status(500).json({ error: 'فشل في جلب ترتيب الفرق' });
        }
      }
    });

    // إحصائيات اللاعبين
    this.router.get('/api/local/players/stats', async (req, res) => {
      try {
        const players = await saudiLeagueScraper.getPlayerStats();
        res.json(players);
      } catch (error) {
        res.status(500).json({ error: 'فشل في جلب إحصائيات اللاعبين' });
      }
    });

    // الهدافين (مع Live-score API)
    this.router.get('/api/local/players/top-scorers', async (req, res) => {
      try {
        // محاولة الحصول من Live-score API أولاً
        let topScorers = await liveScoreAPI.getTopScorers();
        
        // إذا لم تنجح، استخدم البيانات المحلية
        if (!topScorers || topScorers.length === 0) {
          console.log('استخدام البيانات المحلية للهدافين');
          const players = await saudiLeagueScraper.getPlayerStats();
          topScorers = players
            .sort((a, b) => b.goals - a.goals)
            .slice(0, 10)
            .map((player, index) => ({
              rank: index + 1,
              player: {
                name: player.name,
                team: player.team
              },
              goals: player.goals,
              assists: player.assists
            }));
        }
        
        res.json(topScorers);
      } catch (error) {
        console.error('خطأ في جلب الهدافين:', error.message);
        // استخدام البيانات المحلية كاحتياطي
        try {
          const players = await saudiLeagueScraper.getPlayerStats();
          const topScorers = players
            .sort((a, b) => b.goals - a.goals)
            .slice(0, 10)
            .map((player, index) => ({
              rank: index + 1,
              player: {
                name: player.name,
                team: player.team
              },
              goals: player.goals,
              assists: player.assists
            }));
          res.json(topScorers);
        } catch (localError) {
          res.status(500).json({ error: 'فشل في جلب الهدافين' });
        }
      }
    });

    // الممررين
    this.router.get('/api/local/players/top-assists', async (req, res) => {
      try {
        const players = await saudiLeagueScraper.getPlayerStats();
        const topAssists = players
          .sort((a, b) => b.assists - a.assists)
          .slice(0, 10)
          .map((player, index) => ({
            rank: index + 1,
            player: {
              name: player.name,
              team: player.team
            },
            assists: player.assists,
            goals: player.goals
          }));
        res.json(topAssists);
      } catch (error) {
        res.status(500).json({ error: 'فشل في جلب الممررين' });
      }
    });

    // الأخبار
    this.router.get('/api/local/news', async (req, res) => {
      try {
        const news = await saudiLeagueScraper.getNews();
        res.json(news);
      } catch (error) {
        res.status(500).json({ error: 'فشل في جلب الأخبار' });
      }
    });

    // إحصائيات الفريق
    this.router.get('/api/local/teams/:teamName/stats', async (req, res) => {
      try {
        const { teamName } = req.params;
        const standings = await saudiLeagueScraper.getStandings();
        const teamStats = standings.find(team => 
          team.team.toLowerCase().includes(teamName.toLowerCase())
        );
        
        if (teamStats) {
          res.json(teamStats);
        } else {
          res.status(404).json({ error: 'لم يتم العثور على الفريق' });
        }
      } catch (error) {
        res.status(500).json({ error: 'فشل في جلب إحصائيات الفريق' });
      }
    });

    // مباريات الفريق
    this.router.get('/api/local/teams/:teamName/matches', async (req, res) => {
      try {
        const { teamName } = req.params;
        const matches = await saudiLeagueScraper.getMatchesFromSaudiLeague();
        const teamMatches = matches.filter(match => 
          match.homeTeam.toLowerCase().includes(teamName.toLowerCase()) ||
          match.awayTeam.toLowerCase().includes(teamName.toLowerCase())
        );
        res.json(teamMatches);
      } catch (error) {
        res.status(500).json({ error: 'فشل في جلب مباريات الفريق' });
      }
    });

    // معلومات الدوري
    this.router.get('/api/local/league/info', async (req, res) => {
      try {
        const leagueInfo = {
          name: "الدوري السعودي للمحترفين",
          season: "2024/2025",
          country: "السعودية",
          totalTeams: 18,
          currentRound: 15,
          lastUpdated: new Date().toISOString(),
          description: "الدوري السعودي للمحترفين هو أعلى مستوى لكرة القدم في المملكة العربية السعودية"
        };
        res.json(leagueInfo);
      } catch (error) {
        res.status(500).json({ error: 'فشل في جلب معلومات الدوري' });
      }
    });

    // إحصائيات الدوري
    this.router.get('/api/local/league/stats', async (req, res) => {
      try {
        const standings = await saudiLeagueScraper.getStandings();
        const players = await saudiLeagueScraper.getPlayerStats();
        
        const leagueStats = {
          totalMatches: standings.reduce((sum, team) => sum + team.played, 0) / 2,
          totalGoals: players.reduce((sum, player) => sum + player.goals, 0),
          totalAssists: players.reduce((sum, player) => sum + player.assists, 0),
          averageGoalsPerMatch: 0,
          topScorer: players.sort((a, b) => b.goals - a.goals)[0],
          topAssist: players.sort((a, b) => b.assists - a.assists)[0],
          leadingTeam: standings[0]
        };
        
        if (leagueStats.totalMatches > 0) {
          leagueStats.averageGoalsPerMatch = (leagueStats.totalGoals / leagueStats.totalMatches).toFixed(2);
        }
        
        res.json(leagueStats);
      } catch (error) {
        res.status(500).json({ error: 'فشل في جلب إحصائيات الدوري' });
      }
    });

    // تفاصيل مباراة (Live-score API)
    this.router.get('/api/local/matches/:id/details', async (req, res) => {
      try {
        const matchId = req.params.id;
        const matchDetails = await liveScoreAPI.getMatchDetails(matchId);
        
        if (matchDetails) {
          res.json(matchDetails);
        } else {
          res.status(404).json({ error: 'لم يتم العثور على تفاصيل المباراة' });
        }
      } catch (error) {
        console.error('خطأ في جلب تفاصيل المباراة:', error.message);
        res.status(500).json({ error: 'فشل في جلب تفاصيل المباراة' });
      }
    });

    // إحصائيات الفريق (Live-score API)
    this.router.get('/api/local/teams/:teamId/statistics', async (req, res) => {
      try {
        const teamId = req.params.teamId;
        const teamStats = await liveScoreAPI.getTeamStats(teamId);
        
        if (teamStats) {
          res.json(teamStats);
        } else {
          res.status(404).json({ error: 'لم يتم العثور على إحصائيات الفريق' });
        }
      } catch (error) {
        console.error('خطأ في جلب إحصائيات الفريق:', error.message);
        res.status(500).json({ error: 'فشل في جلب إحصائيات الفريق' });
      }
    });

    // اختبار Live-score API
    this.router.get('/api/local/test-livescore', async (req, res) => {
      try {
        const isWorking = await liveScoreAPI.testConnection();
        res.json({ 
          working: isWorking, 
          message: isWorking ? 'Live-score API يعمل بشكل صحيح' : 'Live-score API لا يعمل'
        });
      } catch (error) {
        res.json({ 
          working: false, 
          message: 'خطأ في اختبار Live-score API',
          error: error.message 
        });
      }
    });
  }

  getRouter() {
    return this.router;
  }
}

// إنشاء instance من الكلاس
export const localSaudiAPI = new LocalSaudiAPI(); 