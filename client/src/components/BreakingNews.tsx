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
    <div className="bg-gradient-to-r from-saudi-red to-saudi-red-light text-white py-2 overflow-hidden">
      <div className="flex items-center">
        <div className="bg-white text-saudi-red px-3 py-1 rounded-r-full text-sm font-bold flex-shrink-0 mr-4">
          {t("breaking", { ar: "عاجل", en: "Breaking" })}
        </div>
        <div className="whitespace-nowrap animate-scroll">
          <span className="text-sm">{newsText}</span>
        </div>
      </div>
    </div>
  );
}
