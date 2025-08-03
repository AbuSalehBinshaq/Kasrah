import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/useLanguage";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MatchWithTeams } from "@shared/schema";

export function LiveMatches() {
  const { t } = useLanguage();
  const { subscribe } = useWebSocket("");

  const { data: liveMatches, refetch: refetchLive } = useQuery<MatchWithTeams[]>({
    queryKey: ["/api/matches/live"],
  });

  const { data: todayMatches, refetch: refetchToday } = useQuery<MatchWithTeams[]>({
    queryKey: ["/api/matches/today"],
  });

  useEffect(() => {
    const unsubscribeScore = subscribe("scoreUpdate", () => {
      refetchLive();
      refetchToday();
    });

    const unsubscribeStatus = subscribe("statusUpdate", () => {
      refetchLive();
      refetchToday();
    });

    return () => {
      unsubscribeScore();
      unsubscribeStatus();
    };
  }, [subscribe, refetchLive, refetchToday]);

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("ar-SA", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTeamLogo = (teamName: string) => {
    // Create a simple logo based on team name
    return (
      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xs font-bold bg-gradient-to-br from-saudi-red to-saudi-red-dark">
        {teamName.slice(0, 3)}
      </div>
    );
  };

  return (
    <section className="px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 font-tajawal flex items-center">
          <span className="w-3 h-3 bg-saudi-red rounded-full ml-2 live-pulse"></span>
          {t("liveMatches", { ar: "المباريات المباشرة", en: "Live Matches" })}
        </h2>
        <Button variant="ghost" size="sm" className="text-saudi-red">
          {t("viewAll", { ar: "عرض الكل", en: "View All" })}
        </Button>
      </div>

      {/* Live Matches */}
      {liveMatches && liveMatches.length > 0 && (
        <div className="space-y-4 mb-4">
          {liveMatches.map((match) => (
            <Card key={match.id} className="shadow-lg border border-gray-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="destructive" className="bg-red-100 text-red-600">
                    {t("live", { ar: "مباشر", en: "Live" })}
                  </Badge>
                  <span className="text-gray-500 text-sm">{match.league}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-reverse space-x-3 flex-1">
                    <div className="text-center">
                      {getTeamLogo(match.homeTeam.nameAr)}
                      <span className="text-xs text-gray-600 mt-1 block">
                        {match.homeTeam.nameAr}
                      </span>
                    </div>
                  </div>

                  <div className="text-center mx-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {match.homeScore ?? 0} - {match.awayScore ?? 0}
                    </div>
                    <div className="text-xs text-saudi-red font-medium">
                      {match.currentTime}'
                    </div>
                  </div>

                  <div className="flex items-center space-x-reverse space-x-3 flex-1 justify-end">
                    <div className="text-center">
                      {getTeamLogo(match.awayTeam.nameAr)}
                      <span className="text-xs text-gray-600 mt-1 block">
                        {match.awayTeam.nameAr}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Match Events */}
                {match.events && Array.isArray(match.events) && match.events.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="space-y-2">
                      {match.events.slice(0, 3).map((event: any, index: number) => (
                        <div key={index} className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">
                            {event.minute}' {event.type} - {event.player}
                          </span>
                          <div className="w-2 h-2 bg-saudi-red rounded-full"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Today's Matches */}
      {todayMatches && todayMatches.length > 0 && (
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3 font-tajawal">
              {t("todayMatches", { ar: "مباريات اليوم", en: "Today's Matches" })}
            </h3>

            <div className="space-y-3">
              {todayMatches
                .filter((match) => match.status !== "live")
                .slice(0, 3)
                .map((match) => (
                  <div
                    key={match.id}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center space-x-reverse space-x-3">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-saudi-red to-saudi-red-dark rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {match.homeTeam.nameAr.slice(0, 2)}
                        </div>
                      </div>
                      <span className="text-sm text-gray-900">
                        {match.homeTeam.nameAr}
                      </span>
                    </div>

                    <div className="text-center">
                      {match.status === "completed" ? (
                        <div className="text-sm font-medium text-gray-900">
                          {match.homeScore} - {match.awayScore}
                        </div>
                      ) : (
                        <>
                          <div className="text-sm font-medium text-gray-900">
                            {formatTime(match.matchDate)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {t("today", { ar: "اليوم", en: "Today" })}
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex items-center space-x-reverse space-x-3">
                      <span className="text-sm text-gray-900">
                        {match.awayTeam.nameAr}
                      </span>
                      <div className="text-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-saudi-red to-saudi-red-dark rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {match.awayTeam.nameAr.slice(0, 2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {(!liveMatches || liveMatches.length === 0) &&
        (!todayMatches || todayMatches.length === 0) && (
          <Card className="shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="text-gray-500">
                {t("noMatches", { ar: "لا توجد مباريات اليوم", en: "No matches today" })}
              </div>
            </CardContent>
          </Card>
        )}
    </section>
  );
}
