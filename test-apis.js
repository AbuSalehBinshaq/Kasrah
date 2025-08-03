// ملف اختبار APIs الدوري السعودي
// تشغيل: node test-apis.js

import axios from 'axios';

// إعدادات الدوري السعودي
const SAUDI_LEAGUE_ID = "203"; // معرف الدوري السعودي في API-Football
const SEASON = "2024";

// اختبار API-Football
async function testAPIFootball() {
  console.log("🔍 اختبار API-Football...");
  
  try {
    const response = await axios.get("https://v3.football.api-sports.io/fixtures", {
      headers: {
        "x-rapidapi-host": "v3.football.api-sports.io",
        "x-rapidapi-key": process.env.API_FOOTBALL_KEY || "YOUR_KEY_HERE",
      },
      params: {
        league: SAUDI_LEAGUE_ID,
        season: SEASON,
        last: "5", // آخر 5 مباريات
      },
    });

    console.log("✅ API-Football يعمل!");
    console.log(`📊 عدد المباريات: ${response.data.response.length}`);
    
    if (response.data.response.length > 0) {
      const match = response.data.response[0];
      console.log(`⚽ مثال: ${match.teams.home.name} vs ${match.teams.away.name}`);
      console.log(`📅 التاريخ: ${match.fixture.date}`);
    }
    
    return true;
  } catch (error) {
    console.log("❌ خطأ في API-Football:");
    console.log(error.response?.data || error.message);
    return false;
  }
}

// اختبار Football-Data.org
async function testFootballData() {
  console.log("\n🔍 اختبار Football-Data.org...");
  
  try {
    const response = await axios.get(`https://api.football-data.org/v4/competitions/${SAUDI_LEAGUE_ID}/standings`, {
      headers: {
        "X-Auth-Token": process.env.FOOTBALL_DATA_KEY || "YOUR_KEY_HERE",
      },
    });

    console.log("✅ Football-Data.org يعمل!");
    console.log(`📊 عدد الفرق: ${response.data.standings[0]?.table?.length || 0}`);
    
    if (response.data.standings[0]?.table?.length > 0) {
      const team = response.data.standings[0].table[0];
      console.log(`🏆 المتصدر: ${team.team.name}`);
    }
    
    return true;
  } catch (error) {
    console.log("❌ خطأ في Football-Data.org:");
    console.log(error.response?.data || error.message);
    return false;
  }
}

// اختبار LiveScore API
async function testLiveScore() {
  console.log("\n🔍 اختبار LiveScore API...");
  
  try {
    const response = await axios.get("https://livescore6.p.rapidapi.com/matches/v2/list-live", {
      headers: {
        "X-RapidAPI-Key": process.env.LIVE_SCORE_KEY || "YOUR_KEY_HERE",
        "X-RapidAPI-Host": "livescore6.p.rapidapi.com",
      },
      params: {
        Category: "soccer",
        Ccode: "sa", // رمز السعودية
      },
    });

    console.log("✅ LiveScore API يعمل!");
    console.log(`📊 عدد المباريات المباشرة: ${response.data?.data?.match?.length || 0}`);
    
    return true;
  } catch (error) {
    console.log("❌ خطأ في LiveScore API:");
    console.log(error.response?.data || error.message);
    return false;
  }
}

// اختبار شامل
async function runAllTests() {
  console.log("🚀 بدء اختبار APIs الدوري السعودي...\n");
  
  const results = {
    apiFootball: await testAPIFootball(),
    footballData: await testFootballData(),
    liveScore: await testLiveScore(),
  };
  
  console.log("\n📊 نتائج الاختبار:");
  console.log(`API-Football: ${results.apiFootball ? "✅" : "❌"}`);
  console.log(`Football-Data.org: ${results.footballData ? "✅" : "❌"}`);
  console.log(`LiveScore: ${results.liveScore ? "✅" : "❌"}`);
  
  const workingAPIs = Object.values(results).filter(Boolean).length;
  console.log(`\n🎯 عدد APIs العاملة: ${workingAPIs}/3`);
  
  if (workingAPIs === 0) {
    console.log("\n⚠️  لا توجد APIs عاملة. تأكد من:");
    console.log("1. إضافة المفاتيح الصحيحة في ملف .env");
    console.log("2. الحصول على المفاتيح من المواقع المذكورة");
    console.log("3. التأكد من صحة المفاتيح");
  } else {
    console.log("\n🎉 يمكنك الآن استخدام التطبيق مع APIs العاملة!");
  }
}

// تشغيل الاختبارات
runAllTests().catch(console.error); 