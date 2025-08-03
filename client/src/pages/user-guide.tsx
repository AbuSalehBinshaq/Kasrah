import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { ArrowRight, Home, Calendar, Repeat, Newspaper, Settings, User, Eye } from "lucide-react";

export default function UserGuide() {
  const { t } = useLanguage();

  const sections = [
    {
      title: { ar: "البدء السريع", en: "Quick Start" },
      icon: "fas fa-rocket",
      color: "text-green-600",
      items: [
        { ar: "افتح التطبيق وستجد الصفحة الرئيسية مع آخر الأخبار", en: "Open the app to find the homepage with latest news" },
        { ar: "استخدم التنقل السفلي للوصول للأقسام المختلفة", en: "Use bottom navigation to access different sections" },
        { ar: "اضغط على أيقونة اللغة لتغيير اللغة", en: "Tap language icon to switch language" },
        { ar: "فعّل الوضع الليلي من قائمة المزيد", en: "Enable dark mode from More menu" }
      ]
    },
    {
      title: { ar: "تصفح الأخبار", en: "Browse News" },
      icon: "fas fa-newspaper",
      color: "text-blue-600",
      items: [
        { ar: "اضغط على أي خبر لعرض التفاصيل كاملة", en: "Tap any news item to view full details" },
        { ar: "تابع الأخبار العاجلة في الشريط المتحرك", en: "Follow breaking news in the scrolling ticker" },
        { ar: "استخدم التبويبات لتصفح أخبار مختلفة (عاجل، انتقالات، مباريات)", en: "Use tabs to browse different news (Breaking, Transfers, Matches)" },
        { ar: "شارك الأخبار مع الأصدقاء", en: "Share news with friends" }
      ]
    },
    {
      title: { ar: "متابعة المباريات", en: "Follow Matches" },
      icon: "fas fa-futbol",
      color: "text-saudi-red",
      items: [
        { ar: "شاهد المباريات المباشرة مع النتائج الحية", en: "Watch live matches with real-time scores" },
        { ar: "تابع مباريات اليوم والمباريات القادمة", en: "Follow today's and upcoming matches" },
        { ar: "اعرض تفاصيل المباراة مع الأحداث والإحصائيات", en: "View match details with events and statistics" },
        { ar: "احصل على تنبيهات للمباريات المهمة", en: "Get notifications for important matches" }
      ]
    },
    {
      title: { ar: "تتبع الانتقالات", en: "Track Transfers" },
      icon: "fas fa-exchange-alt",
      color: "text-purple-600",
      items: [
        { ar: "تابع آخر انتقالات اللاعبين", en: "Follow latest player transfers" },
        { ar: "شاهد قيم الصفقات والتفاصيل", en: "View deal values and details" },
        { ar: "فلتر الانتقالات حسب الحالة (مؤكد، إشاعة)", en: "Filter transfers by status (Confirmed, Rumor)" },
        { ar: "احصل على تنبيهات للصفقات الكبرى", en: "Get alerts for major deals" }
      ]
    },
    {
      title: { ar: "إحصائيات اللاعبين", en: "Player Statistics" },
      icon: "fas fa-chart-bar",
      color: "text-orange-600",
      items: [
        { ar: "اضغط على أي لاعب لعرض ملفه الشخصي", en: "Tap any player to view their profile" },
        { ar: "شاهد الإحصائيات والأهداف", en: "View statistics and goals" },
        { ar: "تابع أداء اللاعبين المفضلين", en: "Follow your favorite players' performance" },
        { ar: "قارن بين اللاعبين", en: "Compare between players" }
      ]
    }
  ];

  const adminSections = [
    {
      title: { ar: "لوحة التحكم الإدارية", en: "Admin Dashboard" },
      icon: "fas fa-cog",
      color: "text-red-600",
      items: [
        { ar: "ادخل لـ /admin للوصول للوحة التحكم", en: "Go to /admin to access admin panel" },
        { ar: "أضف وعدّل الأخبار من قسم إدارة الأخبار", en: "Add and edit news from News Management" },
        { ar: "حدّث نتائج المباريات والنتائج المباشرة", en: "Update match results and live scores" },
        { ar: "أضف انتقالات جديدة وحدّث البيانات", en: "Add new transfers and update data" },
        { ar: "إدارة الفرق واللاعبين والإحصائيات", en: "Manage teams, players and statistics" }
      ]
    },
    {
      title: { ar: "إضافة الأخبار", en: "Adding News" },
      icon: "fas fa-plus-circle",
      color: "text-green-600",
      items: [
        { ar: "املأ العنوان باللغة العربية (مطلوب)", en: "Fill Arabic title (required)" },
        { ar: "اختر التصنيف المناسب (عاجل، انتقالات، مباريات، تحليل)", en: "Choose appropriate category (Breaking, Transfer, Match, Analysis)" },
        { ar: "اكتب محتوى الخبر بالتفصيل", en: "Write detailed news content" },
        { ar: "أضف رابط الصورة إن وجد", en: "Add image URL if available" },
        { ar: "حدد الأولوية وفعّل الخبر العاجل إذا لزم", en: "Set priority and enable breaking news if needed" }
      ]
    },
    {
      title: { ar: "إدارة المباريات", en: "Match Management" },
      icon: "fas fa-calendar-plus",
      color: "text-blue-600",
      items: [
        { ar: "أضف مباريات جديدة مع تحديد الفرق والتوقيت", en: "Add new matches with teams and timing" },
        { ar: "حدّث النتائج المباشرة أثناء المباراة", en: "Update live scores during matches" },
        { ar: "غيّر حالة المباراة (مجدولة، مباشرة، منتهية)", en: "Change match status (Scheduled, Live, Completed)" },
        { ar: "أضف أحداث المباراة (أهداف، كروت، تبديلات)", en: "Add match events (Goals, Cards, Substitutions)" }
      ]
    }
  ];

  const features = [
    {
      icon: <Home className="w-5 h-5" />,
      title: { ar: "الصفحة الرئيسية", en: "Homepage" },
      description: { ar: "أحدث الأخبار والمباريات المباشرة", en: "Latest news and live matches" }
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      title: { ar: "المباريات", en: "Matches" },
      description: { ar: "مباريات اليوم والقادمة والنتائج", en: "Today's, upcoming matches and results" }
    },
    {
      icon: <Repeat className="w-5 h-5" />,
      title: { ar: "الانتقالات", en: "Transfers" },
      description: { ar: "آخر صفقات الانتقالات", en: "Latest transfer deals" }
    },
    {
      icon: <Newspaper className="w-5 h-5" />,
      title: { ar: "الأخبار", en: "News" },
      description: { ar: "جميع الأخبار الرياضية", en: "All sports news" }
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: { ar: "المزيد", en: "More" },
      description: { ar: "الإعدادات ولوحة التحكم", en: "Settings and admin panel" }
    }
  ];

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <Link href="/more">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowRight className="w-4 h-4 mr-2" />
            {t("backToMore", { ar: "العودة للمزيد", en: "Back to More" })}
          </Button>
        </Link>
        
        <div className="w-16 h-16 bg-gradient-to-br from-saudi-red to-saudi-red-dark rounded-2xl flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-book text-white text-2xl" />
        </div>
        
        <h1 className="text-3xl font-bold text-foreground font-tajawal mb-2">
          {t("userGuide", { ar: "دليل المستخدم", en: "User Guide" })}
        </h1>
        
        <p className="text-muted-foreground">
          {t("guideDescription", { ar: "دليل شامل لاستخدام تطبيق كسره لأخبار كرة القدم السعودية", en: "Complete guide to using Kasra Saudi Football News app" })}
        </p>
      </div>

      {/* App Features Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="w-5 h-5 mr-2 text-saudi-red" />
            {t("appOverview", { ar: "نظرة عامة على التطبيق", en: "App Overview" })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-reverse space-x-3 p-3 bg-muted rounded-lg">
                <div className="text-saudi-red">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-medium text-foreground">
                    {t(feature.title.ar, feature.title)}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {t(feature.description.ar, feature.description)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Sections */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground font-tajawal mb-6">
          {t("userSections", { ar: "أقسام المستخدم", en: "User Sections" })}
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sections.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className={`${section.icon} mr-2 ${section.color}`} />
                  {t(section.title.ar, section.title)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start space-x-reverse space-x-3">
                      <div className="w-2 h-2 bg-saudi-red rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-foreground leading-relaxed">
                        {t(item.ar, { ar: item.ar, en: item.en })}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator className="my-8" />

      {/* Admin Sections */}
      <div>
        <h2 className="text-2xl font-bold text-foreground font-tajawal mb-6">
          {t("adminSections", { ar: "أقسام الإدارة", en: "Admin Sections" })}
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {adminSections.map((section, index) => (
            <Card key={index} className="border-saudi-red/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className={`${section.icon} mr-2 ${section.color}`} />
                  {t(section.title.ar, section.title)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start space-x-reverse space-x-3">
                      <div className="w-2 h-2 bg-saudi-red rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-foreground leading-relaxed">
                        {t(item.ar, { ar: item.ar, en: item.en })}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Tips */}
      <Card className="mt-8 bg-saudi-red-50 dark:bg-saudi-red-900/10 border-saudi-red/20">
        <CardHeader>
          <CardTitle className="flex items-center text-saudi-red">
            <i className="fas fa-lightbulb mr-2" />
            {t("quickTips", { ar: "نصائح سريعة", en: "Quick Tips" })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-foreground mb-2">
                {t("performanceTips", { ar: "نصائح الأداء", en: "Performance Tips" })}
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• {t("tip1", { ar: "حدّث التطبيق دورياً للحصول على أحدث الميزات", en: "Update the app regularly for latest features" })}</li>
                <li>• {t("tip2", { ar: "فعّل الإشعارات لتلقي أحدث الأخبار", en: "Enable notifications for latest news" })}</li>
                <li>• {t("tip3", { ar: "استخدم الوضع الليلي لتجربة أفضل في الليل", en: "Use dark mode for better night experience" })}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">
                {t("navigationTips", { ar: "نصائح التنقل", en: "Navigation Tips" })}
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• {t("tip4", { ar: "اسحب لأسفل لتحديث المحتوى", en: "Pull down to refresh content" })}</li>
                <li>• {t("tip5", { ar: "اضغط مطولاً على الأخبار للمشاركة", en: "Long press news to share" })}</li>
                <li>• {t("tip6", { ar: "استخدم البحث للعثور على أخبار محددة", en: "Use search to find specific news" })}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="fas fa-headset mr-2 text-saudi-red" />
            {t("support", { ar: "الدعم والمساعدة", en: "Support & Help" })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {t("supportDescription", { ar: "إذا واجهت أي مشكلة أو كان لديك اقتراح، لا تتردد في التواصل معنا", en: "If you face any issues or have suggestions, don't hesitate to contact us" })}
          </p>
          <div className="flex space-x-reverse space-x-4">
            <Button variant="outline" onClick={() => window.open("mailto:support@kasra.com")}>
              <i className="fas fa-envelope mr-2" />
              {t("emailSupport", { ar: "البريد الإلكتروني", en: "Email Support" })}
            </Button>
            <Button variant="outline" onClick={() => window.open("https://wa.me/966123456789")}>
              <i className="fab fa-whatsapp mr-2" />
              {t("whatsappSupport", { ar: "واتساب", en: "WhatsApp" })}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}