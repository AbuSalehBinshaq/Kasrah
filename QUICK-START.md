# البدء السريع - كسره

## البدء في 5 دقائق

### 1. تثبيت التبعيات
```bash
npm install
```

### 2. إعداد قاعدة البيانات
```bash
# تثبيت PostgreSQL (إذا لم يكن مثبتاً)
# Windows: https://www.postgresql.org/download/windows/
# macOS: brew install postgresql
# Ubuntu: sudo apt install postgresql

# إنشاء قاعدة البيانات
createdb korasaudi
```

### 3. إعداد البيئة
```bash
# نسخ ملف البيئة
cp env.example .env

# تعديل DATABASE_URL في ملف .env إذا لزم الأمر
```

### 4. تشغيل المشروع
```bash
# إعداد قاعدة البيانات والبيانات الأولية
npm run setup

# تشغيل المشروع
npm run dev
```

### 5. الوصول للموقع
- **الموقع:** http://localhost:5000
- **لوحة التحكم:** http://localhost:5000/admin
- **تسجيل دخول:** admin / admin123

## استكشاف الأخطاء الشائعة

### خطأ في قاعدة البيانات
```bash
# تأكد من تشغيل PostgreSQL
# Windows: services.msc -> PostgreSQL
# macOS: brew services start postgresql
# Ubuntu: sudo systemctl start postgresql
```

### خطأ في التبعيات
```bash
rm -rf node_modules package-lock.json
npm install
```

### خطأ في البناء
```bash
npm run clean
npm run build
```

## الميزات المتاحة

### للمستخدمين:
- ✅ أخبار كرة القدم
- ✅ المباريات المباشرة
- ✅ الانتقالات
- ✅ إحصائيات اللاعبين
- ✅ الوضع الليلي
- ✅ دعم العربية والإنجليزية

### للمديرين:
- ✅ نظام مصادقة آمن
- ✅ إدارة الأخبار
- ✅ إدارة المباريات
- ✅ إدارة الملفات
- ✅ لوحة تحكم متقدمة

## الخطوات التالية

1. **تخصيص المحتوى:** تعديل البيانات في `server/seed.ts`
2. **إضافة ميزات:** تطوير ميزات جديدة
3. **النشر:** نشر الموقع على الإنترنت
4. **التطبيق:** تحويل الموقع إلى تطبيق موبايل

## الدعم

- 📖 [دليل الإعداد المفصل](./SETUP.md)
- 📖 [الوثائق الكاملة](./README.md)
- 🐛 [الإبلاغ عن الأخطاء](https://github.com/your-repo/issues) 