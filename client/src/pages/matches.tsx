import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { MatchWithTeams } from "@shared/schema";

export default function Matches() {
  const { t } = useLanguage();

  const { data: liveMatches } = useQuery<MatchWithTeams[]>({
    queryKey: ["/api/matches/live"],
  });

  const { data: upcomingMatches } = useQuery<MatchWithTeams[]>({
    queryKey: ["/api/matches/upcoming"],
  });

  const { data: recentMatches } = useQuery<MatchWithTeams[]>({
    queryKey: ["/api/matches/recent"],
  });

  const formatMatchDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatMatchTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("ar-SA", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderMatch = (match: MatchWithTeams) => (
    <Card key={match.id} className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Badge
            variant={match.status === "live" ? "destructive" : "secondary"}
            className={match.status === "live" ? "bg-red-100 text-red-600" : ""}
          >
            {match.status === "live"
              ? t("live", { ar: "مباشر", en: "Live" })
              : match.status === "completed"
              ? t("completed", { ar: "انتهت", en: "Completed" })
              : t("scheduled", { ar: "مجدولة", en: "Scheduled" })}
          </Badge>
          <span className="text-gray-500 text-sm">{match.league}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-reverse space-x-3 flex-1">
            <div className="text-center">
              <div className="w-10 h-10 bg-gradient-to-br from-saudi-red to-saudi-red-dark rounded-full flex items-center justify-center text-white text-xs font-bold mb-1">
                {match.homeTeam.nameAr.slice(0, 2)}
              </div>
              <span className="text-xs text-gray-600">{match.homeTeam.nameAr}</span>
            </div>
          </div>

          <div className="text-center mx-4">
            {match.status === "completed" || match.status === "live" ? (
              <>
                <div className="text-xl font-bold text-gray-900">
                  {match.homeScore ?? 0} - {match.awayScore ?? 0}
                </div>
                {match.status === "live" && (
                  <div className="text-xs text-saudi-red font-medium">
                    {match.currentTime}'
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="text-sm font-medium text-gray-900">
                  {formatMatchTime(match.matchDate)}
                </div>
                <div className="text-xs text-gray-500">
                  {formatMatchDate(match.matchDate)}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center space-x-reverse space-x-3 flex-1 justify-end">
            <div className="text-center">
              <div className="w-10 h-10 bg-gradient-to-br from-saudi-red to-saudi-red-dark rounded-full flex items-center justify-center text-white text-xs font-bold mb-1">
                {match.awayTeam.nameAr.slice(0, 2)}
              </div>
              <span className="text-xs text-gray-600">{match.awayTeam.nameAr}</span>
            </div>
          </div>
        </div>

        {match.venue && (
          <div className="mt-3 text-center text-xs text-gray-500">
            {match.venue}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 font-tajawal mb-6">
        {t("matches", { ar: "المباريات", en: "Matches" })}
      </h1>

      <Tabs defaultValue="live" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="live">
            {t("live", { ar: "مباشر", en: "Live" })}
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            {t("upcoming", { ar: "القادمة", en: "Upcoming" })}
          </TabsTrigger>
          <TabsTrigger value="recent">
            {t("recent", { ar: "النتائج", en: "Recent" })}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="mt-6">
          {liveMatches && liveMatches.length > 0 ? (
            liveMatches.map(renderMatch)
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-500">
                  {t("noLiveMatches", { ar: "لا توجد مباريات مباشرة", en: "No live matches" })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
          {upcomingMatches && upcomingMatches.length > 0 ? (
            upcomingMatches.map(renderMatch)
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-500">
                  {t("noUpcomingMatches", { ar: "لا توجد مباريات قادمة", en: "No upcoming matches" })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="recent" className="mt-6">
          {recentMatches && recentMatches.length > 0 ? (
            recentMatches.map(renderMatch)
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-500">
                  {t("noRecentMatches", { ar: "لا توجد نتائج حديثة", en: "No recent matches" })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
