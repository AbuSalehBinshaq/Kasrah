import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function AdminPanel() {
  const { t } = useLanguage();

  const adminSections = [
    {
      title: { ar: "إدارة الأخبار", en: "News Management" },
      description: { ar: "إضافة وتعديل وحذف الأخبار", en: "Add, edit and delete news" },
      icon: "fas fa-newspaper",
      color: "bg-blue-500",
      route: "/admin/news"
    },
    {
      title: { ar: "إدارة المباريات", en: "Matches Management" },
      description: { ar: "إضافة المباريات وتحديث النتائج", en: "Add matches and update results" },
      icon: "fas fa-futbol",
      color: "bg-green-500",
      route: "/admin/matches"
    },
    {
      title: { ar: "إدارة الانتقالات", en: "Transfers Management" },
      description: { ar: "إضافة وتعديل الانتقالات", en: "Add and edit transfers" },
      icon: "fas fa-exchange-alt",
      color: "bg-purple-500",
      route: "/admin/transfers"
    },
    {
      title: { ar: "إدارة الفرق", en: "Teams Management" },
      description: { ar: "إضافة وتعديل بيانات الفرق", en: "Add and edit teams data" },
      icon: "fas fa-users",
      color: "bg-orange-500",
      route: "/admin/teams"
    },
    {
      title: { ar: "إدارة اللاعبين", en: "Players Management" },
      description: { ar: "إضافة وتعديل بيانات اللاعبين", en: "Add and edit players data" },
      icon: "fas fa-user",
      color: "bg-indigo-500",
      route: "/admin/players"
    },
    {
      title: { ar: "إدارة الإعلانات", en: "Ads Management" },
      description: { ar: "إضافة وتعديل الإعلانات", en: "Add and edit advertisements" },
      icon: "fas fa-ad",
      color: "bg-red-500",
      route: "/admin/ads"
    },
    {
      title: { ar: "الإحصائيات", en: "Statistics" },
      description: { ar: "عرض إحصائيات الموقع", en: "View site statistics" },
      icon: "fas fa-chart-bar",
      color: "bg-teal-500",
      route: "/admin/stats"
    },
    {
      title: { ar: "إعدادات الموقع", en: "Site Settings" },
      description: { ar: "إعدادات عامة للموقع", en: "General site settings" },
      icon: "fas fa-cog",
      color: "bg-gray-500",
      route: "/admin/settings"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-tajawal">
                {t("adminPanel", { ar: "لوحة التحكم الإدارية", en: "Admin Panel" })}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {t("adminDescription", { ar: "إدارة محتوى الموقع بسهولة", en: "Manage site content easily" })}
              </p>
            </div>
            <Link href="/">
              <Button variant="outline">
                <i className="fas fa-home mr-2" />
                {t("backToSite", { ar: "العودة للموقع", en: "Back to Site" })}
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <i className="fas fa-newspaper text-white" />
                </div>
                <div className="mr-4">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">127</p>
                  <p className="text-gray-600 dark:text-gray-400">{t("totalNews", { ar: "إجمالي الأخبار", en: "Total News" })}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <i className="fas fa-futbol text-white" />
                </div>
                <div className="mr-4">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">45</p>
                  <p className="text-gray-600 dark:text-gray-400">{t("totalMatches", { ar: "إجمالي المباريات", en: "Total Matches" })}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <i className="fas fa-exchange-alt text-white" />
                </div>
                <div className="mr-4">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">23</p>
                  <p className="text-gray-600 dark:text-gray-400">{t("totalTransfers", { ar: "إجمالي الانتقالات", en: "Total Transfers" })}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <i className="fas fa-users text-white" />
                </div>
                <div className="mr-4">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">1.2K</p>
                  <p className="text-gray-600 dark:text-gray-400">{t("totalVisitors", { ar: "إجمالي الزوار", en: "Total Visitors" })}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section, index) => (
            <Link key={index} href={section.route}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center space-x-reverse space-x-4">
                    <div className={`w-12 h-12 ${section.color} rounded-lg flex items-center justify-center`}>
                      <i className={`${section.icon} text-white text-xl`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {t(section.title.ar, section.title)}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t(section.description.ar, section.description)}
                  </p>
                  <div className="mt-4">
                    <Badge variant="secondary">
                      {t("manage", { ar: "إدارة", en: "Manage" })}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>
              {t("recentActivity", { ar: "النشاط الأخير", en: "Recent Activity" })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-reverse space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <i className="fas fa-plus text-white text-xs" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{t("newsAdded", { ar: "تم إضافة خبر جديد", en: "New news added" })}</p>
                  <p className="text-sm text-gray-500">{t("timeAgo", { ar: "منذ 5 دقائق", en: "5 minutes ago" })}</p>
                </div>
              </div>

              <div className="flex items-center space-x-reverse space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <i className="fas fa-edit text-white text-xs" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{t("matchUpdated", { ar: "تم تحديث نتيجة مباراة", en: "Match result updated" })}</p>
                  <p className="text-sm text-gray-500">{t("timeAgo2", { ar: "منذ 15 دقيقة", en: "15 minutes ago" })}</p>
                </div>
              </div>

              <div className="flex items-center space-x-reverse space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <i className="fas fa-user-plus text-white text-xs" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{t("playerAdded", { ar: "تم إضافة لاعب جديد", en: "New player added" })}</p>
                  <p className="text-sm text-gray-500">{t("timeAgo3", { ar: "منذ ساعة", en: "1 hour ago" })}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}