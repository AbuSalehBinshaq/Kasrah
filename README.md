# كرة السعودية - KoraSaudi

تطبيق شامل لكرة القدم السعودية مع دعم APIs خارجية متعددة للحصول على بيانات حية ومحدثة.

## 🌟 الميزات الجديدة - New Features

### 📊 APIs خارجية متعددة المصادر
- **API-Football**: المصدر الرئيسي للمباريات المباشرة والإحصائيات
- **Football-Data.org**: مصدر احتياطي لترتيب الفرق وبيانات اللاعبين
- **LiveScore API**: بيانات المباريات المباشرة البديلة
- **Sofascore API**: إحصائيات مفصلة للمباريات
- **ScoreBat API**: الأخبار والفيديوهات
- **RapidAPI**: تجميع الأخبار من مصادر متعددة

### ⚽ إحصائيات متقدمة
- **الهدافين**: ترتيب الهدافين مع إحصائيات مفصلة
- **الممررين**: ترتيب الممررين وأدائهم
- **تحليل أداء الفرق**: إحصائيات الفورم والإصابات
- **توقعات المباريات**: احتمالات الفوز والنتائج المتوقعة
- **إحصائيات المواجهات المباشرة**: تاريخ المواجهات بين الفرق

### 📰 أخبار وتحديثات
- **أخبار حية**: من مصادر متعددة
- **تحديثات فورية**: للمباريات والإحصائيات
- **تجربة مستخدم محسنة**: واجهة حديثة وسهلة الاستخدام

## 🚀 البدء السريع - Quick Start

### المتطلبات - Prerequisites
- Node.js 18+
- PostgreSQL
- مفاتيح APIs (اختيارية)

### التثبيت - Installation

```bash
# استنساخ المشروع
git clone https://github.com/your-username/korasaudi.git
cd korasaudi

# تثبيت التبعيات
npm install

# إعداد البيئة
cp env.example .env
# تحرير .env وإضافة مفاتيح APIs (اختياري)

# إعداد قاعدة البيانات
npm run setup

# تشغيل التطبيق
npm run dev
```

### إعداد APIs الخارجية (اختياري)

1. **API-Football**:
   - اذهب إلى [RapidAPI](https://rapidapi.com/api-sports/api/api-football/)
   - سجل حساب جديد واحصل على المفتاح
   - أضف المفتاح إلى `API_FOOTBALL_KEY` في ملف `.env`

2. **Football-Data.org**:
   - اذهب إلى [Football-Data.org](https://www.football-data.org/)
   - سجل حساب جديد واحصل على المفتاح المجاني
   - أضف المفتاح إلى `FOOTBALL_DATA_KEY` في ملف `.env`

3. **APIs أخرى** (اختيارية):
   - أضف مفاتيح APIs الأخرى حسب الحاجة
   - راجع [دليل APIs الخارجية](EXTERNAL-APIS-GUIDE.md) للمزيد من التفاصيل

## 📱 الميزات - Features

### 🏠 الصفحة الرئيسية
- **المباريات المباشرة**: عرض المباريات الحالية مع النتائج المباشرة
- **مباريات اليوم**: جدول مباريات اليوم
- **الإحصائيات المتقدمة**: الهدافين والممررين والأخبار
- **النقلات الحديثة**: آخر النقلات في الدوري السعودي
- **الأخبار**: آخر الأخبار والتحديثات

### ⚽ المباريات
- **تفاصيل شاملة**: إحصائيات مفصلة لكل مباراة
- **الأحداث المباشرة**: أهداف، بطاقات، تبديلات
- **التوقعات**: احتمالات الفوز والنتائج المتوقعة
- **الإحصائيات**: مقارنة إحصائيات الفريقين

### 👥 اللاعبين
- **إحصائيات مفصلة**: أهداف، تمريرات، مباريات
- **معلومات شخصية**: العمر، الجنسية، المركز
- **الأداء**: تحليل أداء اللاعب عبر المواسم

### 🏆 الفرق
- **ترتيب الدوري**: جدول ترتيب الفرق
- **إحصائيات الفريق**: الفورم، الإصابات، الأداء
- **تاريخ المواجهات**: إحصائيات المواجهات المباشرة

### 📊 الإحصائيات
- **الهدافين**: ترتيب الهدافين مع التفاصيل
- **الممررين**: ترتيب الممررين وأدائهم
- **تحليل الأداء**: إحصائيات متقدمة للفرق واللاعبين

## 🛠️ التقنيات المستخدمة - Tech Stack

### Frontend
- **React 18** مع TypeScript
- **Tailwind CSS** للتصميم
- **Radix UI** للمكونات
- **React Query** لإدارة الحالة
- **Wouter** للتنقل

### Backend
- **Node.js** مع Express
- **TypeScript** للبرمجة
- **PostgreSQL** لقاعدة البيانات
- **Drizzle ORM** لإدارة قاعدة البيانات
- **JWT** للمصادقة

### APIs الخارجية
- **API-Football**: المصدر الرئيسي
- **Football-Data.org**: مصدر احتياطي
- **LiveScore API**: بيانات مباشرة
- **Sofascore API**: إحصائيات مفصلة
- **ScoreBat API**: الأخبار
- **RapidAPI**: تجميع الأخبار

## 📁 هيكل المشروع - Project Structure

```
KoraSaudi/
├── client/                 # Frontend React App
│   ├── src/
│   │   ├── components/     # React Components
│   │   ├── pages/         # Page Components
│   │   ├── hooks/         # Custom Hooks
│   │   └── utils/         # Utility Functions
├── server/                # Backend Express App
│   ├── routes/           # API Routes
│   ├── external-apis.ts  # External APIs Integration
│   └── db.ts            # Database Configuration
├── shared/               # Shared Types & Schemas
└── docs/                # Documentation
```

## 🔧 النقاط النهائية - API Endpoints

### APIs المحلية
```http
GET /api/matches/live          # المباريات المباشرة
GET /api/matches/today         # مباريات اليوم
GET /api/players               # قائمة اللاعبين
GET /api/teams                 # قائمة الفرق
GET /api/news                  # الأخبار
```

### APIs الخارجية
```http
GET /api/external/matches/live              # مباريات مباشرة من مصادر خارجية
GET /api/external/leagues/203/top-scorers   # الهدافين
GET /api/external/leagues/203/top-assists   # الممررين
GET /api/external/teams/:id/stats           # إحصائيات الفريق
GET /api/external/teams/:id/form            # تحليل أداء الفريق
GET /api/external/news                      # الأخبار من مصادر متعددة
```

## 🎨 التصميم - Design

- **تصميم متجاوب**: يعمل على جميع الأجهزة
- **واجهة عربية**: دعم كامل للغة العربية
- **ألوان السعودية**: استخدام ألوان العلم السعودي
- **تجربة مستخدم محسنة**: واجهة سهلة الاستخدام

## 🔒 الأمان - Security

- **مصادقة JWT**: نظام مصادقة آمن
- **حماية البيانات**: تشفير كلمات المرور
- **مفاتيح APIs آمنة**: استخدام متغيرات البيئة
- **تخزين مؤقت ذكي**: تقليل الطلبات غير الضرورية

## 📈 الأداء - Performance

- **تخزين مؤقت ذكي**: 5 دقائق للبيانات العامة، 30 ثانية للمباريات المباشرة
- **تحميل تدريجي**: تحميل البيانات عند الحاجة
- **تحسين الصور**: ضغط وتحسين الصور
- **تحسين الشبكة**: تقليل حجم الطلبات

## 🚀 النشر - Deployment

### Vercel (Frontend)
```bash
npm run build
vercel --prod
```

### Railway/Heroku (Backend)
```bash
npm run build
npm start
```

## 🤝 المساهمة - Contributing

1. Fork المشروع
2. أنشئ فرع جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى الفرع (`git push origin feature/amazing-feature`)
5. افتح Pull Request

## 📝 الترخيص - License

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## 📞 الدعم - Support

- **التوثيق**: راجع [دليل APIs الخارجية](EXTERNAL-APIS-GUIDE.md)
- **المشاكل**: افتح [Issue](https://github.com/your-username/korasaudi/issues)
- **الأسئلة**: راجع [الأسئلة الشائعة](FAQ.md)

## 🙏 الشكر - Acknowledgments

- [API-Football](https://www.api-football.com/) للبيانات المباشرة
- [Football-Data.org](https://www.football-data.org/) للبيانات الاحتياطية
- [RapidAPI](https://rapidapi.com/) لمنصة APIs
- جميع المصادر الأخرى التي توفر بيانات كرة القدم

---

**كرة السعودية** - تطبيق شامل لكرة القدم السعودية مع دعم APIs خارجية متعددة 🏆⚽ 