import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

interface TopScorer {
  rank: number;
  player: {
    id: number;
    name: string;
    photo: string;
    nationality: string;
  };
  team: {
    id: number;
    name: string;
    logo: string;
  };
  goals: number;
  assists: number;
  matches: number;
}

interface TopAssist {
  rank: number;
  player: {
    id: number;
    name: string;
    photo: string;
    nationality: string;
  };
  team: {
    id: number;
    name: string;
    logo: string;
  };
  assists: number;
  goals: number;
  matches: number;
}

interface TeamForm {
  form: string;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  winRate: number;
  lastFive: string[];
}

interface MatchPrediction {
  homeWin: boolean;
  awayWin: boolean;
  draw: boolean;
  homeWinPercentage: number;
  awayWinPercentage: number;
  drawPercentage: number;
  advice: string;
  goals: {
    home: number;
    away: number;
  };
  underOver: string;
}

export function AdvancedStats() {
  const { t } = useLanguage();
  const [selectedLeague] = useState("203"); // Saudi Pro League

  // Fetch top scorers
  const { data: topScorers, isLoading: scorersLoading } = useQuery<TopScorer[]>({
    queryKey: [`/api/external/leagues/${selectedLeague}/top-scorers`],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch top assists
  const { data: topAssists, isLoading: assistsLoading } = useQuery<TopAssist[]>({
    queryKey: [`/api/external/leagues/${selectedLeague}/top-assists`],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch recent news
  const { data: news, isLoading: newsLoading } = useQuery<any[]>({
    queryKey: ["/api/external/news"],
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const getFormColor = (result: string) => {
    switch (result) {
      case 'W': return 'bg-green-500';
      case 'D': return 'bg-yellow-500';
      case 'L': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const getFormText = (result: string) => {
    switch (result) {
      case 'W': return t("win", { ar: "فوز", en: "W" });
      case 'D': return t("draw", { ar: "تعادل", en: "D" });
      case 'L': return t("loss", { ar: "خسارة", en: "L" });
      default: return result;
    }
  };

  return (
    <section className="px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 font-tajawal mb-2">
          {t("advancedStats", { ar: "الإحصائيات المتقدمة", en: "Advanced Statistics" })}
        </h2>
        <p className="text-gray-600">
          {t("advancedStatsDesc", { 
            ar: "إحصائيات مفصلة من مصادر متعددة", 
            en: "Detailed statistics from multiple sources" 
          })}
        </p>
      </div>

      <Tabs defaultValue="scorers" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scorers">
            {t("topScorers", { ar: "الهدافين", en: "Top Scorers" })}
          </TabsTrigger>
          <TabsTrigger value="assists">
            {t("topAssists", { ar: "الممررين", en: "Top Assists" })}
          </TabsTrigger>
          <TabsTrigger value="news">
            {t("news", { ar: "الأخبار", en: "News" })}
          </TabsTrigger>
          <TabsTrigger value="predictions">
            {t("predictions", { ar: "التوقعات", en: "Predictions" })}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scorers" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">⚽</span>
                {t("topScorers", { ar: "الهدافين", en: "Top Scorers" })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {scorersLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 animate-pulse">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="w-12 h-8 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : topScorers && topScorers.length > 0 ? (
                <div className="space-y-4">
                  {topScorers.slice(0, 10).map((scorer, index) => (
                    <div
                      key={scorer.player.id}
                      className={`flex items-center space-x-4 p-4 rounded-lg transition-colors ${
                        index === 0
                          ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200"
                          : index === 1
                          ? "bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200"
                          : index === 2
                          ? "bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="text-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            index === 0 ? "bg-yellow-500" :
                            index === 1 ? "bg-gray-500" :
                            index === 2 ? "bg-orange-500" : "bg-saudi-red"
                          }`}>
                            {scorer.rank}
                          </div>
                        </div>
                        
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-saudi-red to-saudi-red-dark">
                          {scorer.player.photo ? (
                            <img
                              src={scorer.player.photo}
                              alt={scorer.player.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                              {scorer.player.name.slice(0, 2)}
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{scorer.player.name}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>{scorer.team.name}</span>
                            <span>•</span>
                            <span>{scorer.player.nationality}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-2xl font-bold text-saudi-red">{scorer.goals}</div>
                        <div className="text-xs text-gray-500">
                          {t("goals", { ar: "أهداف", en: "Goals" })}
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-700">{scorer.assists}</div>
                        <div className="text-xs text-gray-500">
                          {t("assists", { ar: "تمريرات", en: "Assists" })}
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-600">{scorer.matches}</div>
                        <div className="text-xs text-gray-500">
                          {t("matches", { ar: "مباريات", en: "Matches" })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {t("noData", { ar: "لا توجد بيانات متوفرة", en: "No data available" })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assists" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                {t("topAssists", { ar: "الممررين", en: "Top Assists" })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {assistsLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 animate-pulse">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="w-12 h-8 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : topAssists && topAssists.length > 0 ? (
                <div className="space-y-4">
                  {topAssists.slice(0, 10).map((assist, index) => (
                    <div
                      key={assist.player.id}
                      className={`flex items-center space-x-4 p-4 rounded-lg transition-colors ${
                        index === 0
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200"
                          : index === 1
                          ? "bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200"
                          : index === 2
                          ? "bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="text-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            index === 0 ? "bg-blue-500" :
                            index === 1 ? "bg-gray-500" :
                            index === 2 ? "bg-indigo-500" : "bg-saudi-red"
                          }`}>
                            {assist.rank}
                          </div>
                        </div>
                        
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-saudi-red to-saudi-red-dark">
                          {assist.player.photo ? (
                            <img
                              src={assist.player.photo}
                              alt={assist.player.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                              {assist.player.name.slice(0, 2)}
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{assist.player.name}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>{assist.team.name}</span>
                            <span>•</span>
                            <span>{assist.player.nationality}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{assist.assists}</div>
                        <div className="text-xs text-gray-500">
                          {t("assists", { ar: "تمريرات", en: "Assists" })}
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-700">{assist.goals}</div>
                        <div className="text-xs text-gray-500">
                          {t("goals", { ar: "أهداف", en: "Goals" })}
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-600">{assist.matches}</div>
                        <div className="text-xs text-gray-500">
                          {t("matches", { ar: "مباريات", en: "Matches" })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {t("noData", { ar: "لا توجد بيانات متوفرة", en: "No data available" })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📰</span>
                {t("latestNews", { ar: "آخر الأخبار", en: "Latest News" })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {newsLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="space-y-2 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : news && news.length > 0 ? (
                <div className="space-y-4">
                  {news.slice(0, 10).map((item, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4">
                        {item.thumbnail && (
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                            {item.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{new Date(item.date).toLocaleDateString()}</span>
                            <Badge variant="outline">{item.source}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {t("noNews", { ar: "لا توجد أخبار متوفرة", en: "No news available" })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🔮</span>
                {t("matchPredictions", { ar: "توقعات المباريات", en: "Match Predictions" })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p className="mb-4">
                  {t("predictionsComingSoon", { 
                    ar: "سيتم إضافة توقعات المباريات قريباً", 
                    en: "Match predictions will be available soon" 
                  })}
                </p>
                <Button variant="outline" disabled>
                  {t("comingSoon", { ar: "قريباً", en: "Coming Soon" })}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
} 