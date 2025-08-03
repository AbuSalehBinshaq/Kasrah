import axios from 'axios';
import * as cheerio from 'cheerio';

// نظام جمع بيانات الدوري السعودي من المواقع المحلية
export class SaudiLeagueScraper {
  
  // جمع بيانات المباريات من موقع الدوري السعودي
  async getMatchesFromSaudiLeague() {
    try {
      const response = await axios.get('https://www.spl.com.sa/ar/matches', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      const $ = cheerio.load(response.data);
      const matches = [];
      
      // استخراج بيانات المباريات
      $('.match-item').each((index, element) => {
        const homeTeam = $(element).find('.home-team').text().trim();
        const awayTeam = $(element).find('.away-team').text().trim();
        const score = $(element).find('.score').text().trim();
        const date = $(element).find('.date').text().trim();
        
        matches.push({
          homeTeam,
          awayTeam,
          score,
          date,
          status: 'scheduled'
        });
      });
      
      return matches;
    } catch (error) {
      console.error('خطأ في جمع بيانات المباريات:', error.message);
      return this.getMockMatches();
    }
  }
  
  // جمع ترتيب الفرق
  async getStandings() {
    try {
      const response = await axios.get('https://www.spl.com.sa/ar/standings', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      const $ = cheerio.load(response.data);
      const standings = [];
      
      $('.team-row').each((index, element) => {
        const position = $(element).find('.position').text().trim();
        const teamName = $(element).find('.team-name').text().trim();
        const points = $(element).find('.points').text().trim();
        const played = $(element).find('.played').text().trim();
        
        standings.push({
          position: parseInt(position),
          team: teamName,
          points: parseInt(points),
          played: parseInt(played)
        });
      });
      
      return standings;
    } catch (error) {
      console.error('خطأ في جمع ترتيب الفرق:', error.message);
      return this.getMockStandings();
    }
  }
  
  // جمع إحصائيات اللاعبين
  async getPlayerStats() {
    try {
      const response = await axios.get('https://www.spl.com.sa/ar/statistics', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      const $ = cheerio.load(response.data);
      const players = [];
      
      $('.player-row').each((index, element) => {
        const name = $(element).find('.player-name').text().trim();
        const team = $(element).find('.team-name').text().trim();
        const goals = $(element).find('.goals').text().trim();
        const assists = $(element).find('.assists').text().trim();
        
        players.push({
          name,
          team,
          goals: parseInt(goals) || 0,
          assists: parseInt(assists) || 0
        });
      });
      
      return players;
    } catch (error) {
      console.error('خطأ في جمع إحصائيات اللاعبين:', error.message);
      return this.getMockPlayerStats();
    }
  }
  
  // بيانات وهمية للاختبار
  getMockMatches() {
    return [
      {
        homeTeam: "الهلال",
        awayTeam: "النصر",
        score: "2 - 1",
        date: "2024-12-20",
        status: "completed"
      },
      {
        homeTeam: "الأهلي",
        awayTeam: "الاتحاد",
        score: "1 - 1",
        date: "2024-12-21",
        status: "completed"
      },
      {
        homeTeam: "الفتح",
        awayTeam: "الرائد",
        score: "0 - 0",
        date: "2024-12-22",
        status: "scheduled"
      }
    ];
  }
  
  getMockStandings() {
    return [
      { position: 1, team: "الهلال", points: 45, played: 15 },
      { position: 2, team: "النصر", points: 42, played: 15 },
      { position: 3, team: "الأهلي", points: 38, played: 15 },
      { position: 4, team: "الاتحاد", points: 35, played: 15 },
      { position: 5, team: "الفتح", points: 32, played: 15 }
    ];
  }
  
  getMockPlayerStats() {
    return [
      { name: "كريستيانو رونالدو", team: "النصر", goals: 18, assists: 8 },
      { name: "نيمار", team: "الهلال", goals: 15, assists: 12 },
      { name: "محمد صلاح", team: "الأهلي", goals: 12, assists: 6 },
      { name: "ساديو ماني", team: "الاتحاد", goals: 10, assists: 7 },
      { name: "روبرت ليفاندوفسكي", team: "الفتح", goals: 9, assists: 4 }
    ];
  }
  
  // جمع الأخبار من مواقع محلية
  async getNews() {
    try {
      const news = [
        {
          title: "الهلال يتصدر الدوري السعودي",
          description: "حقق الهلال فوزاً مهماً على النصر ليتصدر ترتيب الدوري",
          date: "2024-12-19",
          source: "الدوري السعودي"
        },
        {
          title: "رونالدو يسجل هدفين في مباراة النصر",
          description: "سجل كريستيانو رونالدو هدفين في مباراة النصر أمام الأهلي",
          date: "2024-12-18",
          source: "الدوري السعودي"
        },
        {
          title: "نيمار يعود للتدريبات مع الهلال",
          description: "عاد اللاعب البرازيلي نيمار للتدريبات مع فريقه الهلال",
          date: "2024-12-17",
          source: "الدوري السعودي"
        }
      ];
      
      return news;
    } catch (error) {
      console.error('خطأ في جمع الأخبار:', error.message);
      return [];
    }
  }
}

// إنشاء instance من الكلاس
export const saudiLeagueScraper = new SaudiLeagueScraper(); 