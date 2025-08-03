# دليل المساهمة

شكراً لاهتمامك بالمساهمة في مشروع كسره! 🎉

## كيفية المساهمة

### 1. إعداد البيئة المحلية

```bash
# استنساخ المشروع
git clone https://github.com/your-username/korasaudi.git
cd korasaudi

# تثبيت التبعيات
npm install

# إعداد قاعدة البيانات
createdb korasaudi
cp env.example .env
npm run setup
```

### 2. اختيار مهمة

- 🔥 **مهام عاجلة:** تحسينات الأمان والأداء
- 🚀 **ميزات جديدة:** إضافة وظائف جديدة
- 🐛 **إصلاح الأخطاء:** معالجة المشاكل الموجودة
- 📝 **تحسينات الوثائق:** تحديث README والوثائق

### 3. إنشاء Branch

```bash
# إنشاء branch جديد
git checkout -b feature/your-feature-name

# أو لإصلاح خطأ
git checkout -b fix/your-bug-description
```

### 4. التطوير

- اتبع معايير الكود الموجودة
- اكتب اختبارات للميزات الجديدة
- تأكد من عمل جميع الاختبارات

### 5. الـ Commit

```bash
# إضافة التغييرات
git add .

# إنشاء commit وصفي
git commit -m "feat: إضافة ميزة البحث المتقدم"
git commit -m "fix: إصلاح مشكلة تسجيل الدخول"
git commit -m "docs: تحديث دليل المستخدم"
```

### 6. الـ Push وفتح Pull Request

```bash
# رفع التغييرات
git push origin feature/your-feature-name
```

ثم افتح Pull Request على GitHub.

## معايير الكود

### TypeScript
- استخدم TypeScript لجميع الملفات الجديدة
- حدد أنواع البيانات بوضوح
- تجنب استخدام `any`

### React
- استخدم Functional Components مع Hooks
- اتبع مبادئ React Best Practices
- استخدم TypeScript للـ Props

### CSS/Styling
- استخدم Tailwind CSS
- اتبع نظام الألوان المحدد
- تأكد من التجاوب مع جميع الأجهزة

### Backend
- استخدم Express.js مع TypeScript
- اتبع REST API conventions
- اكتب validation للـ inputs

## هيكل المشروع

```
KoraSaudi/
├── client/                 # Frontend
│   ├── src/
│   │   ├── components/     # مكونات قابلة لإعادة الاستخدام
│   │   ├── pages/         # صفحات التطبيق
│   │   ├── hooks/         # Custom Hooks
│   │   ├── lib/           # مكتبات مساعدة
│   │   └── ui/            # مكونات UI الأساسية
├── server/                # Backend
│   ├── routes.ts          # مسارات API
│   ├── storage.ts         # طبقة قاعدة البيانات
│   ├── auth.ts            # نظام المصادقة
│   └── seed.ts            # البيانات الأولية
└── shared/                # الكود المشترك
    └── schema.ts          # مخطط قاعدة البيانات
```

## إرشادات الـ Commit

استخدم prefixes واضحة:

- `feat:` ميزة جديدة
- `fix:` إصلاح خطأ
- `docs:` تحديث الوثائق
- `style:` تحسينات التصميم
- `refactor:` إعادة هيكلة الكود
- `test:` إضافة أو تحديث الاختبارات
- `chore:` مهام الصيانة

## اختبار التغييرات

```bash
# تشغيل الاختبارات
npm test

# فحص أنواع TypeScript
npm run type-check

# بناء المشروع
npm run build
```

## إرشادات Pull Request

1. **عنوان واضح:** وصف مختصر للتغيير
2. **وصف مفصل:** شرح التغييرات والسبب
3. **اختبارات:** تأكد من عمل جميع الاختبارات
4. **لقطات شاشة:** إذا كانت التغييرات مرئية
5. **مراجعة الكود:** اطلب مراجعة من المطورين

## التواصل

- 📧 **البريد الإلكتروني:** dev@kasra.com
- 💬 **Discord:** [رابط Discord]
- 🐛 **GitHub Issues:** للإبلاغ عن الأخطاء
- 💡 **GitHub Discussions:** للمناقشات والأفكار

## شكراً لك! 🙏

كل مساهمة، مهما كانت صغيرة، تساعد في تحسين المشروع. شكراً لوقتك وجهدك! 