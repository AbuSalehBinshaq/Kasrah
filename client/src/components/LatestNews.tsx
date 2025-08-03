import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { News } from "@shared/schema";
import { NEWS_CATEGORIES } from "@/lib/constants";

export function LatestNews() {
  const { t } = useLanguage();

  const { data: featuredNews } = useQuery<News>({
    queryKey: ["/api/news/featured"],
  });

  const { data: latestNews } = useQuery<News[]>({
    queryKey: ["/api/news/latest"],
  });

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return t("minutesAgo", { ar: `منذ ${diffInMinutes} دقيقة`, en: `${diffInMinutes} minutes ago` });
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return t("hoursAgo", { ar: `منذ ${diffInHours} ساعة`, en: `${diffInHours} hours ago` });
    }

    const diffInDays = Math.floor(diffInHours / 24);
    return t("daysAgo", { ar: `منذ ${diffInDays} يوم`, en: `${diffInDays} days ago` });
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      breaking: "bg-red-100 text-red-600",
      transfer: "bg-saudi-red-100 text-saudi-red",
      match: "bg-blue-100 text-blue-600",
      analysis: "bg-green-100 text-green-600",
    };

    return categoryConfig[category as keyof typeof categoryConfig] || "bg-gray-100 text-gray-600";
  };

  return (
    <section className="px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 font-tajawal">
          {t("latestNews", { ar: "آخر الأخبار", en: "Latest News" })}
        </h2>
        <Button variant="ghost" size="sm" className="text-saudi-red">
          {t("viewAll", { ar: "عرض الكل", en: "View All" })}
        </Button>
      </div>

      {/* Featured News */}
      {featuredNews && (
        <Card className="shadow-lg overflow-hidden mb-4">
          <div className="h-48 overflow-hidden bg-gradient-to-br from-saudi-red to-saudi-red-dark">
            {featuredNews.imageUrl ? (
              <img
                src={featuredNews.imageUrl}
                alt={featuredNews.titleAr}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                <i className="fas fa-newspaper text-4xl opacity-50" />
              </div>
            )}
          </div>

          <CardContent className="p-4">
            <div className="flex items-center space-x-reverse space-x-2 mb-2">
              <Badge className={getCategoryBadge(featuredNews.category)}>
                {t(
                  featuredNews.category,
                  NEWS_CATEGORIES[featuredNews.category as keyof typeof NEWS_CATEGORIES] || {
                    ar: featuredNews.category,
                    en: featuredNews.category,
                  }
                )}
              </Badge>
              <span className="text-gray-500 text-xs">
                {formatTimeAgo(featuredNews.publishedAt)}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2 leading-tight">
              {featuredNews.titleAr}
            </h3>
            {featuredNews.summary && (
              <p className="text-gray-600 text-sm leading-relaxed">
                {featuredNews.summary}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* News Grid */}
      {latestNews && latestNews.length > 0 ? (
        <div className="space-y-4">
          {latestNews
            .filter((news) => news.id !== featuredNews?.id)
            .slice(0, 5)
            .map((news) => (
              <Card key={news.id} className="shadow-sm">
                <CardContent className="p-4 flex space-x-reverse space-x-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-saudi-red to-saudi-red-dark">
                    {news.imageUrl ? (
                      <img
                        src={news.imageUrl}
                        alt={news.titleAr}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white">
                        <i className="fas fa-newspaper text-lg opacity-50" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-reverse space-x-2 mb-1">
                      <Badge className={getCategoryBadge(news.category)} variant="secondary">
                        {t(
                          news.category,
                          NEWS_CATEGORIES[news.category as keyof typeof NEWS_CATEGORIES] || {
                            ar: news.category,
                            en: news.category,
                          }
                        )}
                      </Badge>
                      <span className="text-gray-400 text-xs">
                        {formatTimeAgo(news.publishedAt)}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
                      {news.titleAr}
                    </h4>
                    {news.summary && (
                      <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
                        {news.summary}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      ) : (
        <Card className="shadow-sm">
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">
              {t("noNews", { ar: "لا توجد أخبار حديثة", en: "No recent news" })}
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
