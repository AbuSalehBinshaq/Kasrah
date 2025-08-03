# دليل استخدام APIs الخارجية - External APIs Guide

## نظرة عامة - Overview

هذا الدليل يوضح كيفية استخدام APIs الخارجية المختلفة للحصول على بيانات المباريات والإحصائيات في تطبيق كرة السعودية.

## المصادر المدعومة - Supported Sources

### 1. API-Football (المصدر الرئيسي)
- **الرابط**: https://v3.football.api-sports.io/
- **الاستخدام**: المباريات المباشرة، الإحصائيات، تفاصيل اللاعبين
- **المفتاح**: `API_FOOTBALL_KEY`

### 2. Football-Data.org (مصدر احتياطي)
- **الرابط**: https://www.football-data.org/
- **الاستخدام**: ترتيب الفرق، بيانات اللاعبين
- **المفتاح**: `FOOTBALL_DATA_KEY`

### 3. LiveScore API
- **الاستخدام**: بيانات المباريات المباشرة البديلة
- **المفتاح**: `LIVE_SCORE_KEY`

### 4. Sofascore API
- **الاستخدام**: إحصائيات مفصلة للمباريات
- **المفتاح**: `SOFASCORE_KEY`

### 5. ScoreBat API
- **الاستخدام**: الأخبار والفيديوهات
- **المفتاح**: `SCOREBAT_KEY`

### 6. RapidAPI
- **الاستخدام**: تجميع الأخبار
- **المفتاح**: `RAPID_API_KEY`

## إعداد البيئة - Environment Setup

### 1. إضافة المفاتيح إلى ملف .env

```bash
# External APIs Configuration
API_FOOTBALL_KEY=your_api_football_key_here
FOOTBALL_DATA_KEY=your_football_data_key_here
LIVE_SCORE_KEY=your_livescore_key_here
SOFASCORE_KEY=your_sofascore_key_here
SCOREBAT_KEY=your_scorebat_key_here
API_SPORTS_KEY=your_api_sports_key_here
RAPID_API_KEY=your_rapid_api_key_here
```

### 2. الحصول على المفاتيح

#### API-Football
1. اذهب إلى https://rapidapi.com/api-sports/api/api-football/
2. سجل حساب جديد
3. اشترك في الخطة المجانية أو المدفوعة
4. انسخ المفتاح

#### Football-Data.org
1. اذهب إلى https://www.football-data.org/
2. سجل حساب جديد
3. احصل على المفتاح المجاني

## النقاط النهائية المتاحة - Available Endpoints

### المباريات - Matches

#### المباريات المباشرة
```http
GET /api/external/matches/live
```

#### تفاصيل المباراة
```http
GET /api/external/matches/:id
```

#### إحصائيات المباراة
```http
GET /api/external/matches/:id/statistics
```

#### توقعات المباراة
```http
GET /api/external/matches/:id/predictions
```

### الفرق - Teams

#### إحصائيات الفريق
```http
GET /api/external/teams/:id/stats
```

#### مباريات الفريق
```http
GET /api/external/teams/:id/matches?season=2024&status=FT&limit=10
```

#### تحليل أداء الفريق
```http
GET /api/external/teams/:id/form
```

#### إصابات الفريق
```http
GET /api/external/teams/:id/injuries
```

### اللاعبين - Players

#### إحصائيات اللاعب
```http
GET /api/external/players/:id/stats
```

#### البحث عن اللاعبين
```http
GET /api/external/search/players?query=player_name
```

### الدوري - League

#### ترتيب الدوري
```http
GET /api/external/leagues/:id/standings
```

#### الهدافين
```http
GET /api/external/leagues/:id/top-scorers
```

#### الممررين
```http
GET /api/external/leagues/:id/top-assists
```

### الإحصائيات المتقدمة - Advanced Statistics

#### إحصائيات المواجهات المباشرة
```http
GET /api/external/teams/:team1/h2h/:team2
```

#### النقلات الحديثة
```http
GET /api/external/transfers/recent
```

#### البحث عن الفرق
```http
GET /api/external/search/teams?query=team_name
```

#### الأخبار
```http
GET /api/external/news?league=203&team=team_id&limit=20
```

## استخدام المكونات - Using Components

### 1. مكون الإحصائيات المتقدمة

```tsx
import { AdvancedStats } from "@/components/AdvancedStats";

// في الصفحة
<AdvancedStats />
```

### 2. مكون تفاصيل المباراة المحسنة

```tsx
import { EnhancedMatchDetails } from "@/components/EnhancedMatchDetails";

// في صفحة تفاصيل المباراة
<EnhancedMatchDetails matchId="123" />
```

### 3. استخدام React Query

```tsx
import { useQuery } from "@tanstack/react-query";

const { data: liveMatches, isLoading } = useQuery({
  queryKey: ["/api/external/matches/live"],
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

## التخزين المؤقت - Caching

النظام يستخدم تخزين مؤقت ذكي:
- **مدة التخزين**: 5 دقائق للبيانات العامة
- **مدة التخزين للمباريات المباشرة**: 30 ثانية
- **التحديث التلقائي**: عند انتهاء صلاحية البيانات

## معالجة الأخطاء - Error Handling

النظام يتعامل مع الأخطاء بشكل ذكي:
- **المصادر المتعددة**: إذا فشل مصدر، يحاول المصدر التالي
- **البيانات الاحتياطية**: يعرض بيانات محلية إذا فشلت جميع المصادر
- **التسجيل**: يسجل جميع الأخطاء للتشخيص

## أمثلة الاستخدام - Usage Examples

### 1. الحصول على المباريات المباشرة

```tsx
const { data: liveMatches } = useQuery({
  queryKey: ["/api/external/matches/live"],
});

if (liveMatches) {
  liveMatches.forEach(match => {
    console.log(`${match.homeTeam.name} vs ${match.awayTeam.name}`);
  });
}
```

### 2. الحصول على الهدافين

```tsx
const { data: topScorers } = useQuery({
  queryKey: ["/api/external/leagues/203/top-scorers"],
});

if (topScorers) {
  topScorers.slice(0, 5).forEach(scorer => {
    console.log(`${scorer.player.name}: ${scorer.goals} goals`);
  });
}
```

### 3. الحصول على الأخبار

```tsx
const { data: news } = useQuery({
  queryKey: ["/api/external/news"],
  queryFn: () => fetch("/api/external/news?league=203&limit=10").then(res => res.json()),
});

if (news) {
  news.forEach(item => {
    console.log(`${item.title} - ${item.source}`);
  });
}
```

## إعدادات الأداء - Performance Settings

### 1. تحسين الاستعلامات

```tsx
// استخدام staleTime لتقليل الطلبات
const { data } = useQuery({
  queryKey: ["/api/external/matches/live"],
  staleTime: 30 * 1000, // 30 seconds
  refetchInterval: 60 * 1000, // 1 minute
});
```

### 2. التحميل التدريجي

```tsx
// تحميل البيانات عند الحاجة
const { data, isLoading, error } = useQuery({
  queryKey: ["/api/external/teams/123/stats"],
  enabled: !!teamId, // تحميل فقط عند وجود teamId
});
```

## استكشاف الأخطاء - Troubleshooting

### 1. مشاكل المفاتيح

```bash
# تأكد من صحة المفاتيح
echo $API_FOOTBALL_KEY
echo $FOOTBALL_DATA_KEY
```

### 2. مشاكل الشبكة

```bash
# اختبار الاتصال
curl -H "x-rapidapi-key: YOUR_KEY" \
     -H "x-rapidapi-host: v3.football.api-sports.io" \
     "https://v3.football.api-sports.io/fixtures?live=all&league=203"
```

### 3. مشاكل التخزين المؤقت

```tsx
// مسح التخزين المؤقت يدوياً
queryClient.invalidateQueries({ queryKey: ["/api/external/matches/live"] });
```

## أفضل الممارسات - Best Practices

### 1. إدارة المفاتيح
- لا تشارك المفاتيح في الكود
- استخدم متغيرات البيئة
- راجع حدود الاستخدام بانتظام

### 2. معالجة البيانات
- تحقق من صحة البيانات قبل العرض
- استخدم قيم افتراضية للبيانات المفقودة
- اعرض رسائل خطأ واضحة للمستخدم

### 3. الأداء
- استخدم التخزين المؤقت بحكمة
- قلل عدد الطلبات غير الضرورية
- استخدم التحميل التدريجي للبيانات الكبيرة

## التطوير المستقبلي - Future Development

### الميزات المخططة
- [ ] دعم المزيد من المصادر
- [ ] تحليلات متقدمة
- [ ] توقعات ذكية
- [ ] إشعارات فورية
- [ ] تصدير البيانات

### التحسينات المقترحة
- [ ] تحسين التخزين المؤقت
- [ ] إضافة WebSocket للتحديثات الفورية
- [ ] تحسين معالجة الأخطاء
- [ ] إضافة واجهة إدارة للمفاتيح

## الدعم والمساعدة - Support

إذا واجهت أي مشاكل أو لديك أسئلة:

1. راجع هذا الدليل
2. تحقق من سجلات الأخطاء
3. اختبر المفاتيح يدوياً
4. راجع وثائق APIs الرسمية

## المراجع - References

- [API-Football Documentation](https://www.api-football.com/documentation-v3)
- [Football-Data.org API](https://www.football-data.org/documentation)
- [React Query Documentation](https://tanstack.com/query/latest)
- [RapidAPI Documentation](https://rapidapi.com/docs) 