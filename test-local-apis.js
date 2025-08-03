// ملف اختبار APIs المحلية للدوري السعودي
// تشغيل: node test-local-apis.js

import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

// اختبار APIs المحلية
async function testLocalAPIs() {
  console.log("🚀 بدء اختبار APIs المحلية للدوري السعودي...\n");
  
  const tests = [
    {
      name: "المباريات المباشرة",
      url: "/api/local/matches/live",
      method: "GET"
    },
    {
      name: "جميع المباريات",
      url: "/api/local/matches",
      method: "GET"
    },
    {
      name: "ترتيب الفرق",
      url: "/api/local/standings",
      method: "GET"
    },
    {
      name: "إحصائيات اللاعبين",
      url: "/api/local/players/stats",
      method: "GET"
    },
    {
      name: "الهدافين",
      url: "/api/local/players/top-scorers",
      method: "GET"
    },
    {
      name: "الممررين",
      url: "/api/local/players/top-assists",
      method: "GET"
    },
    {
      name: "الأخبار",
      url: "/api/local/news",
      method: "GET"
    },
    {
      name: "معلومات الدوري",
      url: "/api/local/league/info",
      method: "GET"
    },
    {
      name: "إحصائيات الدوري",
      url: "/api/local/league/stats",
      method: "GET"
    },
    {
      name: "إحصائيات الهلال",
      url: "/api/local/teams/الهلال/stats",
      method: "GET"
    },
    {
      name: "مباريات النصر",
      url: "/api/local/teams/النصر/matches",
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
        timeout: 10000
      });

      console.log(`✅ ${test.name}: نجح!`);
      console.log(`   📊 عدد النتائج: ${Array.isArray(response.data) ? response.data.length : 1}`);
      
      if (Array.isArray(response.data) && response.data.length > 0) {
        console.log(`   📝 مثال:`, JSON.stringify(response.data[0], null, 2).slice(0, 200) + "...");
      } else if (typeof response.data === 'object') {
        console.log(`   📝 مثال:`, JSON.stringify(response.data, null, 2).slice(0, 200) + "...");
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
  console.log("=".repeat(50));
  
  const successful = results.filter(r => r.status === 'success').length;
  const failed = results.filter(r => r.status === 'error').length;
  
  results.forEach(result => {
    const icon = result.status === 'success' ? '✅' : '❌';
    console.log(`${icon} ${result.name}`);
  });
  
  console.log("=".repeat(50));
  console.log(`🎯 النجاح: ${successful}/${results.length} (${Math.round(successful/results.length*100)}%)`);
  console.log(`❌ الفشل: ${failed}/${results.length}`);
  
  if (successful > 0) {
    console.log("\n🎉 يمكنك الآن استخدام APIs المحلية للدوري السعودي!");
    console.log("\n📝 أمثلة للاستخدام:");
    console.log("1. المباريات المباشرة: GET /api/local/matches/live");
    console.log("2. ترتيب الفرق: GET /api/local/standings");
    console.log("3. الهدافين: GET /api/local/players/top-scorers");
    console.log("4. الأخبار: GET /api/local/news");
  } else {
    console.log("\n⚠️  تأكد من تشغيل الخادم أولاً:");
    console.log("npm run dev");
  }
}

// تشغيل الاختبارات
testLocalAPIs().catch(console.error); 