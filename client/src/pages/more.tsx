import { useLanguage } from "@/hooks/useLanguage";
import { useDarkMode } from "@/hooks/useDarkMode";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Link } from "wouter";

export default function More() {
  const { t, language, toggleLanguage } = useLanguage();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [notifications, setNotifications] = useState(true);

  const menuItems = [
    {
      icon: "fas fa-cog",
      titleAr: "لوحة التحكم",
      titleEn: "Admin Panel",
      href: "/admin"
    },
    {
      icon: "fas fa-star",
      titleAr: "المفضلة",
      titleEn: "Favorites",
      action: () => alert(t("comingSoon", { ar: "قريباً", en: "Coming Soon" }))
    },
    {
      icon: "fas fa-book",
      titleAr: "دليل المستخدم", 
      titleEn: "User Guide",
      href: "/user-guide"
    },
    {
      icon: "fas fa-download",
      titleAr: "التحميلات",
      titleEn: "Downloads",
      action: () => alert(t("comingSoon", { ar: "قريباً", en: "Coming Soon" }))
    },
    {
      icon: "fas fa-chart-bar",
      titleAr: "الإحصائيات",
      titleEn: "Statistics",
      action: () => alert(t("comingSoon", { ar: "قريباً", en: "Coming Soon" }))
    },
    {
      icon: "fas fa-users",
      titleAr: "حول التطبيق",
      titleEn: "About App",
      action: () => alert(t("aboutApp", { ar: "تطبيق كسره للأخبار الرياضية السعودية", en: "Kasra Saudi Sports News App" }))
    },
    {
      icon: "fas fa-envelope",
      titleAr: "تواصل معنا",
      titleEn: "Contact Us",
      action: () => window.open("mailto:info@kasra.com", "_blank")
    },
    {
      icon: "fas fa-share-alt",
      titleAr: "مشاركة التطبيق",
      titleEn: "Share App",
      action: () => {
        if (navigator.share) {
          navigator.share({
            title: t("appName", { ar: "كسره", en: "Kasrah" }),
            text: t("shareText", { ar: "تطبيق كسره لأخبار كرة القدم السعودية", en: "Kasrah - Saudi Football News App" }),
            url: window.location.origin
          });
        } else {
          navigator.clipboard.writeText(window.location.origin);
          alert(t("linkCopied", { ar: "تم نسخ الرابط", en: "Link copied" }));
        }
      }
    }
  ];

  return (
    <div className="px-4 py-6 bg-background dark:bg-background">
      <h1 className="text-2xl font-bold text-foreground dark:text-foreground font-tajawal mb-6">
        {t("more", { ar: "المزيد", en: "More" })}
      </h1>

      {/* App Settings */}
      <Card className="mb-6 bg-card dark:bg-card border-border dark:border-border">
        <CardContent className="p-4">
          <h2 className="font-semibold text-foreground dark:text-foreground font-tajawal mb-4">
            {t("appSettings", { ar: "إعدادات التطبيق", en: "App Settings" })}
          </h2>

          <div className="space-y-4">
            {/* Language Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-reverse space-x-3">
                <i className="fas fa-globe text-saudi-red" />
                <span className="text-foreground dark:text-foreground">
                  {t("language", { ar: "اللغة", en: "Language" })}
                </span>
              </div>
              <div className="flex items-center space-x-reverse space-x-2">
                <Badge variant="outline" className="text-sm">
                  {language === "ar" ? "العربية" : "English"}
                </Badge>
                <Button variant="ghost" size="sm" onClick={toggleLanguage}>
                  {t("switch", { ar: "تغيير", en: "Switch" })}
                </Button>
              </div>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-reverse space-x-3">
                <i className="fas fa-bell text-saudi-red" />
                <span className="text-foreground dark:text-foreground">
                  {t("notifications", { ar: "الإشعارات", en: "Notifications" })}
                </span>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-reverse space-x-3">
                <i className="fas fa-moon text-saudi-red" />
                <span className="text-foreground dark:text-foreground">
                  {t("darkMode", { ar: "الوضع الليلي", en: "Dark Mode" })}
                </span>
              </div>
              <Switch
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Menu Items */}
      <Card className="mb-6 bg-card dark:bg-card border-border dark:border-border">
        <CardContent className="p-4">
          <h2 className="font-semibold text-foreground dark:text-foreground font-tajawal mb-4">
            {t("menu", { ar: "القائمة", en: "Menu" })}
          </h2>

          <div className="space-y-2">
            {menuItems.map((item, index) => {
              if (item.href) {
                return (
                  <Link key={index} href={item.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start p-3 h-auto hover:bg-saudi-red-50 dark:hover:bg-saudi-red-900/20"
                    >
                      <div className="flex items-center space-x-reverse space-x-3 w-full">
                        <i className={`${item.icon} text-saudi-red`} />
                        <span className="text-foreground dark:text-foreground text-right flex-1">
                          {t(item.titleAr, { ar: item.titleAr, en: item.titleEn })}
                        </span>
                        <i className="fas fa-chevron-left text-muted-foreground dark:text-muted-foreground text-xs" />
                      </div>
                    </Button>
                  </Link>
                );
              }
              
              return (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start p-3 h-auto hover:bg-saudi-red-50 dark:hover:bg-saudi-red-900/20"
                  onClick={item.action}
                >
                  <div className="flex items-center space-x-reverse space-x-3 w-full">
                    <i className={`${item.icon} text-saudi-red`} />
                    <span className="text-foreground dark:text-foreground text-right flex-1">
                      {t(item.titleAr, { ar: item.titleAr, en: item.titleEn })}
                    </span>
                    <i className="fas fa-chevron-left text-muted-foreground dark:text-muted-foreground text-xs" />
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card className="mb-6 bg-card dark:bg-card border-border dark:border-border">
        <CardContent className="p-4">
          <h2 className="font-semibold text-foreground dark:text-foreground font-tajawal mb-4">
            {t("followUs", { ar: "تابعنا", en: "Follow Us" })}
          </h2>

          <div className="flex justify-center space-x-reverse space-x-4">
            <Button variant="outline" size="icon" className="rounded-full">
              <i className="fab fa-twitter text-blue-500" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <i className="fab fa-instagram text-pink-500" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <i className="fab fa-youtube text-red-500" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <i className="fab fa-telegram text-blue-400" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card className="bg-card dark:bg-card border-border dark:border-border">
        <CardContent className="p-4 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-saudi-red to-saudi-red-dark rounded-2xl flex items-center justify-center mx-auto mb-3">
            <i className="fas fa-futbol text-white text-2xl" />
          </div>
          <h3 className="font-semibold text-foreground dark:text-foreground font-tajawal mb-1">
            {t("appName", { ar: "كسره", en: "Kasrah" })}
          </h3>
          <p className="text-muted-foreground dark:text-muted-foreground text-sm mb-3">
            {t("appDescription", { ar: "موقعك الأول لأخبار كرة القدم السعودية", en: "Your first source for Saudi football news" })}
          </p>
          <Badge variant="outline">
            {t("version", { ar: "الإصدار 1.0.0", en: "Version 1.0.0" })}
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}