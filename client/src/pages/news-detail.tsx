import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import type { News } from "@shared/schema";
import { NEWS_CATEGORIES } from "@/lib/constants";

export default function NewsDetail() {
  const { id } = useParams();
  const { t } = useLanguage();

  const { data: news, isLoading } = useQuery<News>({
    queryKey: [`/api/news/${id}`],
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      breaking: "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400",
      transfer: "bg-saudi-red-100 text-saudi-red dark:bg-saudi-red-900/20 dark:text-saudi-red-light",
      match: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
      analysis: "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    };

    return categoryConfig[category as keyof typeof categoryConfig] || "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {t("newsNotFound", { ar: "الخبر غير موجود", en: "News not found" })}
        </h1>
        <Link href="/news">
          <Button>
            <ArrowRight className="w-4 h-4 mr-2" />
            {t("backToNews", { ar: "العودة للأخبار", en: "Back to News" })}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link href="/news">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowRight className="w-4 h-4 mr-2" />
            {t("backToNews", { ar: "العودة للأخبار", en: "Back to News" })}
          </Button>
        </Link>

        <div className="flex items-center space-x-reverse space-x-2 mb-4">
          <Badge className={getCategoryBadge(news.category)}>
            {t(
              news.category,
              NEWS_CATEGORIES[news.category as keyof typeof NEWS_CATEGORIES] || {
                ar: news.category,
                en: news.category,
              }
            )}
          </Badge>
          {news.isBreaking && (
            <Badge variant="destructive" className="bg-red-600 text-white animate-pulse">
              <i className="fas fa-bolt mr-1" />
              {t("breaking", { ar: "عاجل", en: "Breaking" })}
            </Badge>
          )}
        </div>

        <h1 className="text-2xl lg:text-3xl font-bold text-foreground dark:text-foreground font-tajawal leading-tight mb-4">
          {news.titleAr}
        </h1>

        <div className="flex items-center text-sm text-muted-foreground dark:text-muted-foreground mb-6">
          <i className="fas fa-calendar-alt mr-2" />
          {formatDate(news.publishedAt!)}
          {news.views && news.views > 0 && (
            <>
              <i className="fas fa-eye mr-2 ml-4" />
              {news.views} {t("views", { ar: "مشاهدة", en: "views" })}
            </>
          )}
        </div>
      </div>

      {/* Featured Image */}
      {news.imageUrl && (
        <Card className="mb-6 overflow-hidden">
          <div className="h-64 lg:h-96">
            <img
              src={news.imageUrl}
              alt={news.titleAr}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='central' text-anchor='middle' font-family='Arial, sans-serif' font-size='18' fill='%23666'%3E%D8%B5%D9%88%D8%B1%D8%A9 %D8%A7%D9%84%D8%AE%D8%A8%D8%B1%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
        </Card>
      )}

      {/* Content */}
      <Card>
        <CardContent className="p-6">
          {news.summary && (
            <div className="p-4 bg-saudi-red-50 dark:bg-saudi-red-900/10 border-r-4 border-saudi-red rounded-lg mb-6">
              <h3 className="font-semibold text-saudi-red dark:text-saudi-red-light mb-2">
                {t("summary", { ar: "ملخص الخبر", en: "News Summary" })}
              </h3>
              <p className="text-foreground dark:text-foreground leading-relaxed">
                {news.summary}
              </p>
            </div>
          )}

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="text-foreground dark:text-foreground leading-relaxed whitespace-pre-line">
              {news.contentAr}
            </div>
          </div>

          {news.tags && news.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-border dark:border-border">
              <h4 className="font-semibold text-foreground dark:text-foreground mb-3">
                {t("tags", { ar: "العلامات", en: "Tags" })}
              </h4>
              <div className="flex flex-wrap gap-2">
                {news.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Related News */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground dark:text-foreground font-tajawal mb-4">
            {t("relatedNews", { ar: "أخبار ذات صلة", en: "Related News" })}
          </h3>
          <div className="text-muted-foreground dark:text-muted-foreground">
            {t("comingSoon", { ar: "قريباً", en: "Coming Soon" })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}