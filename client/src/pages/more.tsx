import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function More() {
  const { t, language, toggleLanguage } = useLanguage();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const menuItems = [
    {
      icon: "fas fa-cog",
      titleAr: "الإعدادات",
      titleEn: "Settings",
      action: () => console.log("Settings")
    },
    {
      icon: "fas fa-star",
      titleAr: "المفضلة",
      titleEn: "Favorites",
      action: () => console.log("Favorites")
    },
    {
      icon: "fas fa-download",
      titleAr: "التحميلات",
      titleEn: "Downloads",
      action: () => console.log("Downloads")
    },
    {
      icon: "fas fa-chart-bar",
      titleAr: "الإحصائيات",
      titleEn: "Statistics",
      action: () => console.log("Statistics")
    },
    {
      icon: "fas fa-users",
      titleAr: "حول التطبيق",
      titleEn: "About App",
      action: () => console.log("About")
    },
    {
      icon: "fas fa-envelope",
      titleAr: "تواصل معنا",
      titleEn: "Contact Us",
      action: () => console.log("Contact")
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
        }
      }
    }
  ];

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 font-tajawal mb-6">
        {t("more", { ar: "المزيد", en: "More" })}
      </h1>

      {/* App Settings */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <h2 className="font-semibold text-gray-900 font-tajawal mb-4">
            {t("appSettings", { ar: "إعدادات التطبيق", en: "App Settings" })}
          </h2>

          <div className="space-y-4">
            {/* Language Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-reverse space-x-3">
                <i className="fas fa-globe text-saudi-red" />
                <span className="text-gray-900">
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
                <span className="text-gray-900">
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
                <span className="text-gray-900">
                  {t("darkMode", { ar: "الوضع الليلي", en: "Dark Mode" })}
                </span>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Menu Items */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <h2 className="font-semibold text-gray-900 font-tajawal mb-4">
            {t("menu", { ar: "القائمة", en: "Menu" })}
          </h2>

          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start p-3 h-auto hover:bg-saudi-red-50"
                onClick={item.action}
              >
                <div className="flex items-center space-x-reverse space-x-3 w-full">
                  <i className={`${item.icon} text-saudi-red`} />
                  <span className="text-gray-900 text-right flex-1">
                    {t(item.titleAr, { ar: item.titleAr, en: item.titleEn })}
                  </span>
                  <i className="fas fa-chevron-left text-gray-400 text-xs" />
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <h2 className="font-semibold text-gray-900 font-tajawal mb-4">
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
      <Card>
        <CardContent className="p-4 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-saudi-red to-saudi-red-dark rounded-2xl flex items-center justify-center mx-auto mb-3">
            <i className="fas fa-futbol text-white text-2xl" />
          </div>
          <h3 className="font-semibold text-gray-900 font-tajawal mb-1">
            {t("appName", { ar: "كسره", en: "Kasrah" })}
          </h3>
          <p className="text-gray-500 text-sm mb-3">
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
