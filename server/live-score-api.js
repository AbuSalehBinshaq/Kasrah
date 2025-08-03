import axios from 'axios';
import crypto from 'crypto';

// نظام Live-score API للدوري السعودي
export class LiveScoreAPI {
  constructor() {
    this.apiKey = 'LG0YynJ1aEAj0IDD';
    this.apiSecret = 'oq3tbm8mQRvbOWiADiybGidQXNaXwOBV';
    this.baseURL = 'https://live-score-api.com/api/v1';
  }

  // إنشاء توقيع للطلب
  createSignature(endpoint, timestamp) {
    const message = `${endpoint}${timestamp}`;
    return crypto.createHmac('sha256', this.apiSecret).update(message).digest('hex');
  }

  // إرسال طلب إلى API
  async makeRequest(endpoint, params = {}) {
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const signature = this.createSignature(endpoint, timestamp);
      
      const response = await axios.get(`${this.baseURL}${endpoint}`, {
        params: {
          ...params,
          key: this.apiKey,
          t: timestamp,
          s: signature
        },
        timeout: 10000
      });

      return response.data;
    } catch (error) {
      console.error(`خطأ في Live-score API (${endpoint}):`, error.message);
      throw error;
    }
  }

  // الحصول على المباريات المباشرة للدوري السعودي
  async getLiveMatches() {
    try {
      const data = await this.makeRequest('/scores/live.json', {
        country: 'sa', // السعودية
        league: 'saudi-pro-league'
      });

      return this.formatLiveMatches(data);
    } catch (error) {
      console.error('خطأ في جلب المباريات المباشرة:', error.message);
      return [];
    }
  }

  // الحصول على جميع المباريات للدوري السعودي
  async getAllMatches() {
    try {
      const data = await this.makeRequest('/scores.json', {
        country: 'sa',
        league: 'saudi-pro-league'
      });

      return this.formatMatches(data);
    } catch (error) {
      console.error('خطأ في جلب جميع المباريات:', error.message);
      return [];
    }
  }

  // الحصول على ترتيب الفرق
  async getStandings() {
    try {
      const data = await this.makeRequest('/standings.json', {
        country: 'sa',
        league: 'saudi-pro-league'
      });

      return this.formatStandings(data);
    } catch (error) {
      console.error('خطأ في جلب ترتيب الفرق:', error.message);
      return [];
    }
  }

  // الحصول على الهدافين
  async getTopScorers() {
    try {
      const data = await this.makeRequest('/topscorers.json', {
        country: 'sa',
        league: 'saudi-pro-league'
      });

      return this.formatTopScorers(data);
    } catch (error) {
      console.error('خطأ في جلب الهدافين:', error.message);
      return [];
    }
  }

  // الحصول على تفاصيل مباراة
  async getMatchDetails(matchId) {
    try {
      const data = await this.makeRequest(`/scores/detail.json`, {
        id: matchId
      });

      return this.formatMatchDetails(data);
    } catch (error) {
      console.error('خطأ في جلب تفاصيل المباراة:', error.message);
      return null;
    }
  }

  // الحصول على إحصائيات الفريق
  async getTeamStats(teamId) {
    try {
      const data = await this.makeRequest('/teams/statistics.json', {
        id: teamId
      });

      return this.formatTeamStats(data);
    } catch (error) {
      console.error('خطأ في جلب إحصائيات الفريق:', error.message);
      return null;
    }
  }

  // تنسيق المباريات المباشرة
  formatLiveMatches(data) {
    if (!data || !data.data || !data.data.match) {
      return [];
    }

    return data.data.match.map(match => ({
      id: match.id,
      homeTeam: {
        name: match.home_name,
        score: match.score_home,
        logo: match.home_logo
      },
      awayTeam: {
        name: match.away_name,
        score: match.score_away,
        logo: match.away_logo
      },
      status: 'live',
      time: match.time,
      date: match.date,
      league: match.league_name,
      venue: match.venue
    }));
  }

  // تنسيق جميع المباريات
  formatMatches(data) {
    if (!data || !data.data || !data.data.match) {
      return [];
    }

    return data.data.match.map(match => ({
      id: match.id,
      homeTeam: {
        name: match.home_name,
        score: match.score_home,
        logo: match.home_logo
      },
      awayTeam: {
        name: match.away_name,
        score: match.score_away,
        logo: match.away_logo
      },
      status: match.status,
      time: match.time,
      date: match.date,
      league: match.league_name,
      venue: match.venue
    }));
  }

  // تنسيق ترتيب الفرق
  formatStandings(data) {
    if (!data || !data.data || !data.data.table) {
      return [];
    }

    return data.data.table.map((team, index) => ({
      position: index + 1,
      team: team.team_name,
      points: team.points,
      played: team.played,
      won: team.won,
      drawn: team.drawn,
      lost: team.lost,
      goalsFor: team.goals_for,
      goalsAgainst: team.goals_against,
      goalDifference: team.goal_difference
    }));
  }

  // تنسيق الهدافين
  formatTopScorers(data) {
    if (!data || !data.data || !data.data.topscorers) {
      return [];
    }

    return data.data.topscorers.map((scorer, index) => ({
      rank: index + 1,
      player: {
        name: scorer.player_name,
        team: scorer.team_name,
        photo: scorer.player_photo
      },
      goals: scorer.goals,
      assists: scorer.assists || 0,
      matches: scorer.matches
    }));
  }

  // تنسيق تفاصيل المباراة
  formatMatchDetails(data) {
    if (!data || !data.data || !data.data.match) {
      return null;
    }

    const match = data.data.match[0];
    return {
      id: match.id,
      homeTeam: {
        name: match.home_name,
        score: match.score_home,
        logo: match.home_logo
      },
      awayTeam: {
        name: match.away_name,
        score: match.score_away,
        logo: match.away_logo
      },
      status: match.status,
      time: match.time,
      date: match.date,
      league: match.league_name,
      venue: match.venue,
      events: match.events || [],
      statistics: match.statistics || {},
      lineups: match.lineups || {}
    };
  }

  // تنسيق إحصائيات الفريق
  formatTeamStats(data) {
    if (!data || !data.data || !data.data.statistics) {
      return null;
    }

    const stats = data.data.statistics;
    return {
      team: stats.team_name,
      matches: stats.matches,
      wins: stats.wins,
      draws: stats.draws,
      losses: stats.losses,
      goalsFor: stats.goals_for,
      goalsAgainst: stats.goals_against,
      points: stats.points,
      position: stats.position
    };
  }

  // اختبار الاتصال
  async testConnection() {
    try {
      const data = await this.makeRequest('/scores/live.json', {
        country: 'sa'
      });
      
      console.log('✅ Live-score API يعمل بشكل صحيح!');
      console.log(`📊 عدد المباريات المباشرة: ${data.data?.match?.length || 0}`);
      
      return true;
    } catch (error) {
      console.error('❌ خطأ في الاتصال بـ Live-score API:', error.message);
      return false;
    }
  }
}

// إنشاء instance من الكلاس
export const liveScoreAPI = new LiveScoreAPI(); 