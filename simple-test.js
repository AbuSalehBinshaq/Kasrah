// اختبار بسيط للخادم
import axios from 'axios';

async function testServer() {
  console.log("🔍 اختبار الخادم...");
  
  try {
    // اختبار الاتصال الأساسي
    const response = await axios.get('http://localhost:5000', { timeout: 5000 });
    console.log("✅ الخادم يعمل!");
    console.log("📄 الصفحة الرئيسية:", response.status);
  } catch (error) {
    console.log("❌ الخادم لا يعمل!");
    console.log("🔍 الخطأ:", error.message);
    
    // محاولة منافذ أخرى
    const ports = [3000, 5000, 8000, 8080];
    for (const port of ports) {
      try {
        const response = await axios.get(`http://localhost:${port}`, { timeout: 2000 });
        console.log(`✅ الخادم يعمل على المنفذ ${port}!`);
        break;
      } catch (err) {
        console.log(`❌ المنفذ ${port}: لا يعمل`);
      }
    }
  }
}

testServer().catch(console.error); 