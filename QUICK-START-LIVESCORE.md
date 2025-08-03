# 🚀 دليل سريع لاستخدام Live-score API

## 🎯 الحل النهائي للدوري السعودي

تم دمج [Live-score API](https://live-score-api.com/) مع النظام لتوفير بيانات حقيقية للدوري السعودي!

## 🔑 المفاتيح المكونة

- **API Key**: `LG0YynJ1aEAj0IDD`
- **API Secret**: `oq3tbm8mQRvbOWiADiybGidQXNaXwOBV`

## 🧪 اختبار سريع

### 1. اختبار مباشر من المتصفح
افتح الملف `test-livescore-direct.html` في المتصفح لاختبار API مباشرة:

```bash
# افتح الملف في المتصفح
start test-livescore-direct.html
```

### 2. اختبار من الخادم
```bash
# تشغيل الخادم
npm run dev

# اختبار APIs
node test-livescore-api.js
```

## 📊 APIs المتوفرة

### المباريات
```http
GET /api/local/matches/live          # المباريات المباشرة
GET /api/local/matches               # جميع المباريات
GET /api/local/matches/:id/details   # تفاصيل مباراة
```

### ترتيب الفرق
```http
GET /api/local/standings             # ترتيب الفرق
```

### اللاعبين
```http
GET /api/local/players/top-scorers   # الهدافين
GET /api/local/players/top-assists   # الممررين
```

### الفرق
```http
GET /api/local/teams/:teamId/statistics  # إحصائيات الفريق
```

## 🎮 أمثلة الاستخدام

### JavaScript
```javascript
// المباريات المباشرة
const response = await fetch('/api/local/matches/live');
const liveMatches = await response.json();

// ترتيب الفرق
const standings = await fetch('/api/local/standings').then(r => r.json());

// الهدافين
const topScorers = await fetch('/api/local/players/top-scorers').then(r => r.json());
```

### React
```tsx
import { useQuery } from "@tanstack/react-query";

const { data: liveMatches } = useQuery({
  queryKey: ["/api/local/matches/live"],
  staleTime: 30 * 1000, // 30 ثانية
});
```

## 🔧 نظام الاحتياطي

النظام يعمل بنظام ذكي:
1. **Live-score API أولاً**: يحاول الحصول على البيانات الحقيقية
2. **البيانات المحلية كاحتياطي**: إذا فشل API، يستخدم البيانات المحلية
3. **معالجة الأخطاء**: يعرض رسائل واضحة

## 🎯 البيانات المتوفرة

### ✅ المباريات
- معرف المباراة الفريد
- الفريق المضيف والضيف
- النتائج والأوقات
- حالة المباراة (مباشر/منتهي/مجدول)
- الملعب والتاريخ

### ✅ ترتيب الفرق
- المركز في الترتيب
- النقاط والمباريات
- الانتصارات والتعادلات والخسائر
- الأهداف المسجلة والمستلمة

### ✅ اللاعبين
- الهدافين والممررين
- صور اللاعبين
- إحصائيات مفصلة

## 🚨 ملاحظات مهمة

1. **بيانات حقيقية**: من Live-score API
2. **نظام احتياطي**: يعمل حتى لو فشل API
3. **تحديث تلقائي**: البيانات تتحدث تلقائياً
4. **دعم الدوري السعودي**: مخصص للدوري السعودي
5. **لا حدود للاستخدام**: بدون قيود

## 🆘 استكشاف الأخطاء

### مشكلة: "API لا يعمل"
1. تأكد من صحة المفاتيح
2. تحقق من اتصال الإنترنت
3. استخدم البيانات المحلية كاحتياطي

### مشكلة: "لا توجد مباريات"
- قد لا تكون هناك مباريات مباشرة حالياً
- النظام سيستخدم البيانات المحلية

## 📞 المساعدة

إذا احتجت مساعدة:
1. راجع `LIVESCORE-API-GUIDE.md`
2. اختبر API باستخدام `test-livescore-direct.html`
3. راجع [وثائق Live-score API](https://live-score-api.com/)

---

**🎉 الآن يمكنك استخدام بيانات الدوري السعودي الحقيقية!** 