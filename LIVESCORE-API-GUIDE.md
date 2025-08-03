# 🏆 دليل Live-score API للدوري السعودي

## 🎯 الحل الأمثل مع Live-score API

تم دمج [Live-score API](https://live-score-api.com/) مع النظام المحلي لتوفير بيانات حقيقية للدوري السعودي!

### المفاتيح المكونة:
- **API Key**: `LG0YynJ1aEAj0IDD`
- **API Secret**: `oq3tbm8mQRvbOWiADiybGidQXNaXwOBV`

## 🚀 البدء السريع

### 1. تشغيل الخادم
```bash
npm run dev
```

### 2. اختبار Live-score API
```bash
node test-livescore-api.js
```

## 📊 APIs المتوفرة

### المباريات (Live-score API)
```http
GET /api/local/matches/live          # المباريات المباشرة
GET /api/local/matches               # جميع المباريات
GET /api/local/matches/:id/details   # تفاصيل مباراة
```

### ترتيب الفرق (Live-score API)
```http
GET /api/local/standings             # ترتيب الفرق
```

### اللاعبين (Live-score API)
```http
GET /api/local/players/top-scorers   # الهدافين
GET /api/local/players/top-assists   # الممررين
```

### الفرق (Live-score API)
```http
GET /api/local/teams/:teamId/statistics  # إحصائيات الفريق
```

### الدوري (محلي)
```http
GET /api/local/league/info           # معلومات الدوري
GET /api/local/league/stats          # إحصائيات الدوري
```

### الأخبار (محلية)
```http
GET /api/local/news                  # أخبار الدوري
```

### اختبار API
```http
GET /api/local/test-livescore        # اختبار Live-score API
```

## 🎮 أمثلة الاستخدام

### 1. الحصول على المباريات المباشرة
```javascript
const response = await fetch('/api/local/matches/live');
const liveMatches = await response.json();
console.log('المباريات المباشرة:', liveMatches);

// مثال للنتيجة:
// [
//   {
//     id: "12345",
//     homeTeam: { name: "الهلال", score: 2, logo: "..." },
//     awayTeam: { name: "النصر", score: 1, logo: "..." },
//     status: "live",
//     time: "65'",
//     date: "2024-12-20",
//     league: "الدوري السعودي للمحترفين",
//     venue: "ملعب الملك فهد"
//   }
// ]
```

### 2. الحصول على ترتيب الفرق
```javascript
const response = await fetch('/api/local/standings');
const standings = await response.json();
console.log('ترتيب الفرق:', standings);

// مثال للنتيجة:
// [
//   {
//     position: 1,
//     team: "الهلال",
//     points: 45,
//     played: 15,
//     won: 14,
//     drawn: 3,
//     lost: 0,
//     goalsFor: 42,
//     goalsAgainst: 8,
//     goalDifference: 34
//   }
// ]
```

### 3. الحصول على الهدافين
```javascript
const response = await fetch('/api/local/players/top-scorers');
const topScorers = await response.json();
console.log('الهدافين:', topScorers);

// مثال للنتيجة:
// [
//   {
//     rank: 1,
//     player: {
//       name: "كريستيانو رونالدو",
//       team: "النصر",
//       photo: "..."
//     },
//     goals: 18,
//     assists: 8,
//     matches: 15
//   }
// ]
```

### 4. الحصول على تفاصيل مباراة
```javascript
const matchId = "12345";
const response = await fetch(`/api/local/matches/${matchId}/details`);
const matchDetails = await response.json();
console.log('تفاصيل المباراة:', matchDetails);
```

### 5. الحصول على إحصائيات الفريق
```javascript
const teamId = "team_123";
const response = await fetch(`/api/local/teams/${teamId}/statistics`);
const teamStats = await response.json();
console.log('إحصائيات الفريق:', teamStats);
```

## 📱 استخدام في React

### في المكونات
```tsx
import { useQuery } from "@tanstack/react-query";

// المباريات المباشرة
const { data: liveMatches, isLoading } = useQuery({
  queryKey: ["/api/local/matches/live"],
  staleTime: 30 * 1000, // 30 ثانية للمباريات المباشرة
});

// ترتيب الفرق
const { data: standings } = useQuery({
  queryKey: ["/api/local/standings"],
  staleTime: 5 * 60 * 1000, // 5 دقائق
});

// الهدافين
const { data: topScorers } = useQuery({
  queryKey: ["/api/local/players/top-scorers"],
  staleTime: 10 * 60 * 1000, // 10 دقائق
});

// تفاصيل مباراة
const { data: matchDetails } = useQuery({
  queryKey: [`/api/local/matches/${matchId}/details`],
  enabled: !!matchId,
});
```

## 🎯 البيانات المتوفرة من Live-score API

### المباريات
- ✅ معرف المباراة الفريد
- ✅ الفريق المضيف (الاسم، النتيجة، الشعار)
- ✅ الفريق الضيف (الاسم، النتيجة، الشعار)
- ✅ حالة المباراة (مباشر، منتهي، مجدول)
- ✅ الوقت الحالي للمباراة المباشرة
- ✅ التاريخ والوقت
- ✅ اسم الدوري
- ✅ الملعب

### ترتيب الفرق
- ✅ المركز في الترتيب
- ✅ اسم الفريق
- ✅ النقاط
- ✅ عدد المباريات
- ✅ الانتصارات
- ✅ التعادلات
- ✅ الخسائر
- ✅ الأهداف المسجلة
- ✅ الأهداف المستلمة
- ✅ فارق الأهداف

### اللاعبين
- ✅ الترتيب
- ✅ اسم اللاعب
- ✅ الفريق
- ✅ صورة اللاعب
- ✅ عدد الأهداف
- ✅ عدد التمريرات
- ✅ عدد المباريات

### تفاصيل المباراة
- ✅ جميع بيانات المباراة الأساسية
- ✅ أحداث المباراة (أهداف، بطاقات، تبديلات)
- ✅ إحصائيات المباراة
- ✅ تشكيلات الفريقين

## 🔧 نظام الاحتياطي

النظام يعمل بنظام ذكي:

1. **محاولة Live-score API أولاً**: يحاول الحصول على البيانات من Live-score API
2. **البيانات المحلية كاحتياطي**: إذا فشل Live-score API، يستخدم البيانات المحلية
3. **معالجة الأخطاء**: يعرض رسائل خطأ واضحة في حالة فشل كلا المصدرين

## 🚨 ملاحظات مهمة

1. **Live-score API حقيقي**: البيانات من مصدر حقيقي وموثوق
2. **نظام احتياطي**: يعمل حتى لو فشل Live-score API
3. **تحديث تلقائي**: البيانات تتحدث تلقائياً
4. **دعم الدوري السعودي**: مخصص للدوري السعودي
5. **لا حدود للاستخدام**: يمكنك استخدامه بدون قيود

## 🆘 استكشاف الأخطاء

### مشكلة: "Live-score API لا يعمل"
```bash
# اختبر الاتصال
curl http://localhost:5000/api/local/test-livescore
```

### مشكلة: "لا توجد مباريات مباشرة"
- قد لا تكون هناك مباريات مباشرة حالياً
- النظام سيستخدم البيانات المحلية كاحتياطي

### مشكلة: "خطأ في الاتصال"
```bash
# تأكد من تشغيل الخادم
npm run dev

# اختبر APIs
node test-livescore-api.js
```

## 📞 المساعدة

إذا احتجت مساعدة:
1. راجع هذا الدليل
2. اختبر APIs باستخدام `node test-livescore-api.js`
3. تحقق من سجلات الخادم
4. راجع [وثائق Live-score API](https://live-score-api.com/)

## 🎉 الميزات الجديدة

### ✅ Live-score API Integration
- بيانات حقيقية من Live-score API
- نظام احتياطي للبيانات المحلية
- معالجة أخطاء متقدمة

### ✅ APIs محسنة
- تفاصيل المباريات المتقدمة
- إحصائيات الفرق التفصيلية
- اختبار الاتصال

### ✅ أداء محسن
- تخزين مؤقت ذكي
- استجابة سريعة
- موثوقية عالية

---

**🎉 الآن يمكنك استخدام بيانات الدوري السعودي الحقيقية من Live-score API!** 