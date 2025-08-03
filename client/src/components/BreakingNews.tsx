import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/useLanguage";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useEffect } from "react";
import type { News } from "@shared/schema";

export function BreakingNews() {
  const { t } = useLanguage();
  const { subscribe } = useWebSocket("");

  const { data: breakingNews, refetch } = useQuery<News[]>({
    queryKey: ["/api/news/breaking"],
  });

  useEffect(() => {
    const unsubscribe = subscribe("breakingNews", () => {
      refetch();
    });

    return unsubscribe;
  }, [subscribe, refetch]);

  if (!breakingNews || breakingNews.length === 0) {
    return null;
  }

  const newsText = breakingNews.map(news => news.titleAr).join(" • ");

  return (
    <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 dark:from-red-700 dark:via-red-600 dark:to-red-700 text-white py-3 overflow-hidden shadow-lg">
      <div className="flex items-center">
        <div className="bg-white dark:bg-gray-900 text-red-600 dark:text-red-400 px-4 py-1.5 rounded-r-full text-sm font-bold flex-shrink-0 mr-4 shadow-md animate-pulse">
          <i className="fas fa-bolt mr-1" />
          {t("breaking", { ar: "🔴 عاجل", en: "🔴 Breaking" })}
        </div>
        <div className="whitespace-nowrap animate-scroll">
          <span className="text-sm font-medium drop-shadow-sm">{newsText}</span>
        </div>
      </div>
    </div>
  );
}
