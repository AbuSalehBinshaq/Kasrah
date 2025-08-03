import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { News } from "@shared/schema";
import { NEWS_CATEGORIES } from "@/lib/constants";

export default function NewsPage() {
  const { t } = useLanguage();

  const { data: latestNews } = useQuery<News[]>({
    queryKey: ["/api/news/latest"],
  });

  const { data: breakingNews } = useQuery<News[]>({
    queryKey: ["/api/news/breaking"],
  });

  const { data: transferNews } = useQuery<News[]>({
    queryKey: ["/api/news/category/transfer"],
  });

  const { data: matchNews } = useQuery<News[]>({
    queryKey: ["/api/news/category/match"],
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

  const renderNewsItem = (news: News) => (
    <Card key={news.id} className="mb-4">
      <CardContent className="p-4">
        <div className="flex space-x-reverse space-x-4">
          {/* News Image */}
          <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-saudi-red to-saudi-red-dark">
            {news.imageUrl ? (
              <img
                src={news.imageUrl}
                alt={news.titleAr}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                <i className="fas fa-newspaper text-xl opacity-50" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-reverse space-x-2 mb-2">
              <Badge className={getCategoryBadge(news.category)}>
                {t(
                  news.category,
                  NEWS_CATEGORIES[news.category as keyof typeof NEWS_CATEGORIES] || {
                    ar: news.category,
                    en: news.category,
                  }
                )}
              </Badge>
              <span className="text-gray-500 text-xs">
                {formatTimeAgo(news.publishedAt)}
              </span>
              {news.views && news.views > 0 && (
                <span className="text-gray-400 text-xs">
                  {news.views} {t("views", { ar: "مشاهدة", en: "views" })}
                </span>
              )}
            </div>

            <h3 className="font-semibold text-gray-900 mb-2 leading-tight">
              {news.titleAr}
            </h3>

            {news.summary && (
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                {news.summary}
              </p>
            )}

            {news.isBreaking && (
              <div className="mt-2">
                <Badge variant="destructive" className="bg-red-100 text-red-600">
                  {t("breaking", { ar: "عاجل", en: "Breaking" })}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 font-tajawal mb-6">
        {t("news", { ar: "الأخبار", en: "News" })}
      </h1>

      <Tabs defaultValue="latest" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="latest">
            {t("latest", { ar: "الأحدث", en: "Latest" })}
          </TabsTrigger>
          <TabsTrigger value="breaking">
            {t("breaking", { ar: "عاجل", en: "Breaking" })}
          </TabsTrigger>
          <TabsTrigger value="transfers">
            {t("transfers", { ar: "انتقالات", en: "Transfers" })}
          </TabsTrigger>
          <TabsTrigger value="matches">
            {t("matches", { ar: "مباريات", en: "Matches" })}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="latest" className="mt-6">
          {latestNews && latestNews.length > 0 ? (
            latestNews.map(renderNewsItem)
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-500">
                  {t("noNews", { ar: "لا توجد أخبار", en: "No news available" })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="breaking" className="mt-6">
          {breakingNews && breakingNews.length > 0 ? (
            breakingNews.map(renderNewsItem)
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-500">
                  {t("noBreakingNews", { ar: "لا توجد أخبار عاجلة", en: "No breaking news" })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="transfers" className="mt-6">
          {transferNews && transferNews.length > 0 ? (
            transferNews.map(renderNewsItem)
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-500">
                  {t("noTransferNews", { ar: "لا توجد أخبار انتقالات", en: "No transfer news" })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="matches" className="mt-6">
          {matchNews && matchNews.length > 0 ? (
            matchNews.map(renderNewsItem)
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-500">
                  {t("noMatchNews", { ar: "لا توجد أخبار مباريات", en: "No match news" })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
