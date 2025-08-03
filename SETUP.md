# دليل إعداد المشروع

## المتطلبات الأساسية

- Node.js 18 أو أحدث
- PostgreSQL 12 أو أحدث
- npm أو yarn

## خطوات الإعداد

### 1. تثبيت التبعيات
```bash
npm install
```

### 2. إعداد قاعدة البيانات

#### خيار أ: تثبيت PostgreSQL محلياً
1. قم بتحميل وتثبيت PostgreSQL من [الموقع الرسمي](https://www.postgresql.org/download/)
2. أنشئ قاعدة بيانات جديدة:
```sql
CREATE DATABASE korasaudi;
CREATE USER test WITH PASSWORD 'test';
GRANT ALL PRIVILEGES ON DATABASE korasaudi TO test;
```

#### خيار ب: استخدام خدمة سحابية
يمكنك استخدام خدمات مثل:
- [Neon](https://neon.tech) (مجاني)
- [Supabase](https://supabase.com) (مجاني)
- [Railway](https://railway.app) (مجاني)

### 3. إعداد متغيرات البيئة

أنشئ ملف `.env` في المجلد الرئيسي:
```env
DATABASE_URL=postgresql://test:test@localhost:5432/korasaudi
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### 4. تحديث قاعدة البيانات
```bash
npm run db:push
```

### 5. إضافة البيانات الأولية
```bash
npm run seed
```

### 6. تشغيل المشروع
```bash
npm run dev
```

## بيانات تسجيل الدخول الافتراضية

بعد تشغيل البذور:
- **اسم المستخدم:** admin
- **كلمة المرور:** admin123
- **البريد الإلكتروني:** admin@kasra.com

## استكشاف الأخطاء

### مشكلة في الاتصال بقاعدة البيانات
تأكد من:
1. تشغيل خدمة PostgreSQL
2. صحة بيانات الاتصال في ملف `.env`
3. وجود قاعدة البيانات `korasaudi`

### مشكلة في التبعيات
```bash
rm -rf node_modules package-lock.json
npm install
```

### مشكلة في البناء
```bash
npm run build
```

## النشر

### للتطوير المحلي
```bash
npm run dev
```

### للإنتاج
```bash
npm run build
npm start
```

## المسارات الرئيسية

- **الموقع:** http://localhost:5000
- **لوحة التحكم:** http://localhost:5000/admin
- **تسجيل دخول الإدارة:** http://localhost:5000/admin/login 