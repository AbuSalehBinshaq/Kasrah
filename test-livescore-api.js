// ملف اختبار Live-score API للدوري السعودي
// تشغيل: node test-livescore-api.js

import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

// اختبار Live-score API
async function testLiveScoreAPI() {
  console.log("🚀 بدء اختبار Live-score API للدوري السعودي...\n");
  
  const tests = [
    {
      name: "اختبار الاتصال بـ Live-score API",
      url: "/api/local/test-livescore",
      method: "GET"
    },
    {
      name: "المباريات المباشرة (Live-score)",
      url: "/api/local/matches/live",
      method: "GET"
    },
    {
      name: "جميع المباريات (Live-score)",
      url: "/api/local/matches",
      method: "GET"
    },
    {
      name: "ترتيب الفرق (Live-score)",
      url: "/api/local/standings",
      method: "GET"
    },
    {
      name: "الهدافين (Live-score)",
      url: "/api/local/players/top-scorers",
      method: "GET"
    },
    {
      name: "الممررين (Live-score)",
      url: "/api/local/players/top-assists",
      method: "GET"
    },
    {
      name: "الأخبار (محلية)",
      url: "/api/local/news",
      method: "GET"
    },
    {
      name: "معلومات الدوري (محلية)",
      url: "/api/local/league/info",
      method: "GET"
    },
    {
      name: "إحصائيات الدوري (محلية)",
      url: "/api/local/league/stats",
      method: "GET"
    }
  ];

  const results = [];

  for (const test of tests) {
    try {
      console.log(`🔍 اختبار: ${test.name}...`);
      
      const response = await axios({
        method: test.method,
        url: `${BASE_URL}${test.url}`,
        timeout: 15000
      });

      console.log(`✅ ${test.name}: نجح!`);
      
      if (test.name.includes('Live-score')) {
        console.log(`   📊 عدد النتائج: ${Array.isArray(response.data) ? response.data.length : 1}`);
        
        if (Array.isArray(response.data) && response.data.length > 0) {
          const firstItem = response.data[0];
          if (firstItem.homeTeam && firstItem.awayTeam) {
            console.log(`   ⚽ مثال: ${firstItem.homeTeam.name} vs ${firstItem.awayTeam.name}`);
            if (firstItem.status === 'live') {
              console.log(`   🔴 حالة: مباشر`);
            }
          }
        }
      } else {
        console.log(`   📝 نوع البيانات: ${typeof response.data}`);
        if (typeof response.data === 'object' && response.data !== null) {
          console.log(`   📊 عدد الخصائص: ${Object.keys(response.data).length}`);
        }
      }
      
      results.push({ name: test.name, status: 'success', data: response.data });
    } catch (error) {
      console.log(`❌ ${test.name}: فشل!`);
      console.log(`   🔍 الخطأ:`, error.response?.data?.error || error.message);
      results.push({ name: test.name, status: 'error', error: error.message });
    }
    
    console.log(""); // سطر فارغ للفصل
  }

  // عرض النتائج النهائية
  console.log("📊 النتائج النهائية:");
  console.log("=".repeat(60));
  
  const successful = results.filter(r => r.status === 'success').length;
  const failed = results.filter(r => r.status === 'error').length;
  
  results.forEach(result => {
    const icon = result.status === 'success' ? '✅' : '❌';
    const type = result.name.includes('Live-score') ? '[Live-score]' : '[محلي]';
    console.log(`${icon} ${type} ${result.name}`);
  });
  
  console.log("=".repeat(60));
  console.log(`🎯 النجاح: ${successful}/${results.length} (${Math.round(successful/results.length*100)}%)`);
  console.log(`❌ الفشل: ${failed}/${results.length}`);
  
  // تحليل النتائج
  const liveScoreTests = results.filter(r => r.name.includes('Live-score'));
  const localTests = results.filter(r => !r.name.includes('Live-score'));
  
  const liveScoreSuccess = liveScoreTests.filter(r => r.status === 'success').length;
  const localSuccess = localTests.filter(r => r.status === 'success').length;
  
  console.log(`\n📈 تحليل النتائج:`);
  console.log(`   Live-score API: ${liveScoreSuccess}/${liveScoreTests.length} (${Math.round(liveScoreSuccess/liveScoreTests.length*100)}%)`);
  console.log(`   APIs المحلية: ${localSuccess}/${localTests.length} (${Math.round(localSuccess/localTests.length*100)}%)`);
  
  if (successful > 0) {
    console.log("\n🎉 يمكنك الآن استخدام APIs المحسنة للدوري السعودي!");
    console.log("\n📝 الميزات الجديدة:");
    console.log("✅ Live-score API للمباريات المباشرة");
    console.log("✅ Live-score API لترتيب الفرق");
    console.log("✅ Live-score API للهدافين");
    console.log("✅ نظام احتياطي للبيانات المحلية");
    console.log("✅ تفاصيل المباريات المتقدمة");
    console.log("✅ إحصائيات الفرق التفصيلية");
    
    console.log("\n🔗 أمثلة للاستخدام:");
    console.log("1. المباريات المباشرة: GET /api/local/matches/live");
    console.log("2. ترتيب الفرق: GET /api/local/standings");
    console.log("3. الهدافين: GET /api/local/players/top-scorers");
    console.log("4. تفاصيل مباراة: GET /api/local/matches/{id}/details");
    console.log("5. إحصائيات فريق: GET /api/local/teams/{teamId}/statistics");
  } else {
    console.log("\n⚠️  تأكد من تشغيل الخادم أولاً:");
    console.log("npm run dev");
  }
}

// تشغيل الاختبارات
testLiveScoreAPI().catch(console.error); 