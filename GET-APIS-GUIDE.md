# 🚀 دليل سريع للحصول على APIs الدوري السعودي

## 🎯 الخيار الأفضل: API-Football

### 1. الحصول على المفتاح (5 دقائق)

1. **اذهب إلى**: https://rapidapi.com/api-sports/api/api-football/
2. **اضغط على**: "Subscribe to Test"
3. **اختر**: الخطة المجانية (100 requests/day)
4. **سجل حساب جديد** (اسم، بريد إلكتروني، كلمة مرور)
5. **انسخ المفتاح** من لوحة التحكم

### 2. المفتاح سيبدو مثل هذا:
```
x-rapidapi-key: 1234567890abcdef1234567890abcdef
```

### 3. اختبار سريع:
```bash
curl -H "x-rapidapi-key: YOUR_KEY" \
     -H "x-rapidapi-host: v3.football.api-sports.io" \
     "https://v3.football.api-sports.io/fixtures?league=203&season=2024"
```

## 🆓 الخيار المجاني: Football-Data.org

### 1. الحصول على المفتاح (3 دقائق)

1. **اذهب إلى**: https://www.football-data.org/
2. **اضغط على**: "Get API Key"
3. **سجل حساب جديد**
4. **احصل على المفتاح المجاني** (10 requests/minute)

### 2. المفتاح سيبدو مثل هذا:
```
X-Auth-Token: 1234567890abcdef1234567890abcdef
```

## 📱 إعداد المشروع

### 1. إنشاء ملف .env
```bash
# انسخ ملف env.example
cp env.example .env

# أضف المفاتيح
API_FOOTBALL_KEY=your_api_football_key_here
FOOTBALL_DATA_KEY=your_football_data_key_here
```

### 2. اختبار APIs
```bash
# تشغيل اختبار APIs
node test-apis.js
```

### 3. تشغيل التطبيق
```bash
npm run dev
```

## 🎮 أمثلة سريعة

### المباريات المباشرة
```javascript
// API-Football
const response = await axios.get("https://v3.football.api-sports.io/fixtures", {
  headers: {
    "x-rapidapi-host": "v3.football.api-sports.io",
    "x-rapidapi-key": "YOUR_KEY",
  },
  params: {
    live: "all",
    league: "203", // الدوري السعودي
  },
});
```

### ترتيب الفرق
```javascript
// Football-Data.org
const response = await axios.get("https://api.football-data.org/v4/competitions/203/standings", {
  headers: {
    "X-Auth-Token": "YOUR_KEY",
  },
});
```

### الهدافين
```javascript
// API-Football
const response = await axios.get("https://v3.football.api-sports.io/players/topscorers", {
  headers: {
    "x-rapidapi-host": "v3.football.api-sports.io",
    "x-rapidapi-key": "YOUR_KEY",
  },
  params: {
    league: "203",
    season: "2024",
  },
});
```

## 📊 البيانات المتوفرة

### API-Football يوفر:
- ✅ المباريات المباشرة
- ✅ نتائج المباريات
- ✅ ترتيب الفرق
- ✅ الهدافين والممررين
- ✅ إحصائيات اللاعبين
- ✅ تفاصيل الفرق
- ✅ النقلات
- ✅ الأخبار

### Football-Data.org يوفر:
- ✅ ترتيب الفرق
- ✅ نتائج المباريات
- ✅ تفاصيل الفرق
- ✅ بيانات اللاعبين

## 💰 الأسعار

### API-Football:
- **مجاني**: 100 requests/day
- **مدفوع**: من $10/شهر (1000 requests/day)

### Football-Data.org:
- **مجاني**: 10 requests/minute
- **مدفوع**: من €20/شهر (unlimited)

## 🚨 نصائح مهمة

1. **ابدأ بالمجاني**: جرب الخطة المجانية أولاً
2. **احفظ المفاتيح**: لا تشارك المفاتيح مع أحد
3. **راقب الاستخدام**: تجنب تجاوز الحدود
4. **اختبر أولاً**: استخدم ملف test-apis.js للاختبار

## 🆘 إذا واجهت مشاكل

### مشكلة: "API key not found"
- تأكد من نسخ المفتاح بشكل صحيح
- تأكد من إضافة المفتاح في ملف .env

### مشكلة: "Rate limit exceeded"
- انتظر قليلاً قبل إرسال طلب جديد
- فكر في الترقية للخطة المدفوعة

### مشكلة: "No data returned"
- تأكد من صحة معرف الدوري (203 للدوري السعودي)
- تأكد من صحة الموسم (2024)

## 📞 المساعدة

إذا احتجت مساعدة:
1. راجع [دليل APIs الخارجية](EXTERNAL-APIS-GUIDE.md)
2. اختبر APIs باستخدام `node test-apis.js`
3. راجع وثائق APIs الرسمية

---

**🎉 الآن يمكنك الحصول على بيانات الدوري السعودي بسهولة!** 