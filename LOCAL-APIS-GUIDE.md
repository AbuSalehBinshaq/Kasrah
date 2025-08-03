# 🏆 دليل APIs المحلية للدوري السعودي

## 🎯 الحل البديل بدون بطاقة بنكية

هذا النظام يوفر APIs محلية للدوري السعودي بدون الحاجة لبطاقة بنكية أو APIs خارجية!

## 🚀 البدء السريع

### 1. تشغيل الخادم
```bash
npm run dev
```

### 2. اختبار APIs
```bash
node test-local-apis.js
```

## 📊 APIs المتوفرة

### المباريات
```http
GET /api/local/matches/live          # المباريات المباشرة
GET /api/local/matches               # جميع المباريات
```

### ترتيب الفرق
```http
GET /api/local/standings             # ترتيب الفرق
```

### اللاعبين
```http
GET /api/local/players/stats         # إحصائيات اللاعبين
GET /api/local/players/top-scorers   # الهدافين
GET /api/local/players/top-assists   # الممررين
```

### الفرق
```http
GET /api/local/teams/:teamName/stats    # إحصائيات الفريق
GET /api/local/teams/:teamName/matches  # مباريات الفريق
```

### الدوري
```http
GET /api/local/league/info           # معلومات الدوري
GET /api/local/league/stats          # إحصائيات الدوري
```

### الأخبار
```http
GET /api/local/news                  # أخبار الدوري
```

## 🎮 أمثلة الاستخدام

### 1. الحصول على المباريات المباشرة
```javascript
const response = await fetch('/api/local/matches/live');
const liveMatches = await response.json();
console.log('المباريات المباشرة:', liveMatches);
```

### 2. الحصول على ترتيب الفرق
```javascript
const response = await fetch('/api/local/standings');
const standings = await response.json();
console.log('ترتيب الفرق:', standings);
```

### 3. الحصول على الهدافين
```javascript
const response = await fetch('/api/local/players/top-scorers');
const topScorers = await response.json();
console.log('الهدافين:', topScorers);
```

### 4. الحصول على إحصائيات الهلال
```javascript
const response = await fetch('/api/local/teams/الهلال/stats');
const alHilalStats = await response.json();
console.log('إحصائيات الهلال:', alHilalStats);
```

## 📱 استخدام في React

### في المكونات
```tsx
import { useQuery } from "@tanstack/react-query";

// المباريات المباشرة
const { data: liveMatches } = useQuery({
  queryKey: ["/api/local/matches/live"],
});

// ترتيب الفرق
const { data: standings } = useQuery({
  queryKey: ["/api/local/standings"],
});

// الهدافين
const { data: topScorers } = useQuery({
  queryKey: ["/api/local/players/top-scorers"],
});
```

## 🎯 البيانات المتوفرة

### المباريات
- ✅ الفريق المضيف
- ✅ الفريق الضيف
- ✅ النتيجة
- ✅ التاريخ
- ✅ الحالة (مباشر، منتهي، مجدول)

### ترتيب الفرق
- ✅ المركز
- ✅ اسم الفريق
- ✅ النقاط
- ✅ عدد المباريات

### اللاعبين
- ✅ اسم اللاعب
- ✅ الفريق
- ✅ عدد الأهداف
- ✅ عدد التمريرات

### الأخبار
- ✅ العنوان
- ✅ الوصف
- ✅ التاريخ
- ✅ المصدر

## 🔧 التخصيص

### إضافة بيانات جديدة
يمكنك تعديل ملف `saudi-league-scraper.js` لإضافة:
- بيانات أكثر تفصيلاً
- مصادر بيانات إضافية
- تحديث البيانات تلقائياً

### إضافة APIs جديدة
يمكنك إضافة نقاط نهائية جديدة في `local-saudi-api.js`:
```javascript
// مثال: إضافة API للاعبين حسب الفريق
this.router.get('/api/local/teams/:teamName/players', async (req, res) => {
  // الكود هنا
});
```

## 🚨 ملاحظات مهمة

1. **البيانات وهمية**: البيانات الحالية هي بيانات وهمية للاختبار
2. **التحديث اليدوي**: يمكنك تحديث البيانات يدوياً في الكود
3. **لا تحتاج مفاتيح**: هذا النظام يعمل بدون مفاتيح APIs
4. **مجاني بالكامل**: لا توجد رسوم أو حدود للاستخدام

## 🆘 استكشاف الأخطاء

### مشكلة: "Cannot connect to server"
```bash
# تأكد من تشغيل الخادم
npm run dev
```

### مشكلة: "API not found"
```bash
# تأكد من صحة المسار
# راجع قائمة APIs أعلاه
```

### مشكلة: "No data returned"
- البيانات وهمية للاختبار
- يمكنك تعديل البيانات في `saudi-league-scraper.js`

## 📞 المساعدة

إذا احتجت مساعدة:
1. راجع هذا الدليل
2. اختبر APIs باستخدام `node test-local-apis.js`
3. تحقق من سجلات الخادم

---

**🎉 الآن يمكنك استخدام بيانات الدوري السعودي بدون بطاقة بنكية!** 