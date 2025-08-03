import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

interface MatchDetails {
  id: number;
  date: string;
  status: string;
  elapsed: number;
  homeTeam: {
    id: number;
    name: string;
    logo: string;
    score: number;
    winner: boolean;
  };
  awayTeam: {
    id: number;
    name: string;
    logo: string;
    score: number;
    winner: boolean;
  };
  league: {
    id: number;
    name: string;
    logo: string;
    round: string;
  };
  venue: string;
  referee: string;
  events: Array<{
    time: number;
    type: string;
    detail: string;
    player: string;
    team: string;
  }>;
  statistics: {
    home: any;
    away: any;
  };
  predictions: {
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
  };
  lastUpdated: string;
}

interface Props {
  matchId: string;
}

export function EnhancedMatchDetails({ matchId }: Props) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: matchDetails, isLoading } = useQuery<MatchDetails>({
    queryKey: [`/api/external/matches/${matchId}`],
    staleTime: 30 * 1000, // 30 seconds for live matches
  });

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "Goal": return "⚽";
      case "Card": return "🟨";
      case "subst": return "🔄";
      case "Var": return "📺";
      default: return "⚽";
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "Goal": return "text-green-600";
      case "Card": return "text-yellow-600";
      case "subst": return "text-blue-600";
      case "Var": return "text-purple-600";
      default: return "text-gray-600";
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!matchDetails) {
    return (
      <div className="p-4 text-center text-gray-500">
        {t("matchNotFound", { ar: "لم يتم العثور على المباراة", en: "Match not found" })}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Match Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src={matchDetails.league.logo}
                alt={matchDetails.league.name}
                className="w-8 h-8"
              />
              <div>
                <h2 className="text-lg font-bold">{matchDetails.league.name}</h2>
                <p className="text-sm text-gray-600">{matchDetails.league.round}</p>
              </div>
            </div>
            <Badge variant={matchDetails.status === "LIVE" ? "destructive" : "secondary"}>
              {matchDetails.status === "LIVE" ? t("live", { ar: "مباشر", en: "LIVE" }) : matchDetails.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-center flex-1">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden bg-gradient-to-br from-saudi-red to-saudi-red-dark">
                {matchDetails.homeTeam.logo ? (
                  <img
                    src={matchDetails.homeTeam.logo}
                    alt={matchDetails.homeTeam.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-bold">
                    {matchDetails.homeTeam.name.slice(0, 2)}
                  </div>
                )}
              </div>
              <h3 className="font-semibold">{matchDetails.homeTeam.name}</h3>
            </div>

            <div className="text-center mx-8">
              <div className="text-4xl font-bold text-gray-900">
                {matchDetails.homeTeam.score} - {matchDetails.awayTeam.score}
              </div>
              {matchDetails.status === "LIVE" && (
                <div className="text-sm text-red-600 font-medium">
                  {matchDetails.elapsed}'
                </div>
              )}
              <div className="text-sm text-gray-500">
                {formatTime(matchDetails.date)}
              </div>
            </div>

            <div className="text-center flex-1">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden bg-gradient-to-br from-saudi-red to-saudi-red-dark">
                {matchDetails.awayTeam.logo ? (
                  <img
                    src={matchDetails.awayTeam.logo}
                    alt={matchDetails.awayTeam.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-bold">
                    {matchDetails.awayTeam.name.slice(0, 2)}
                  </div>
                )}
              </div>
              <h3 className="font-semibold">{matchDetails.awayTeam.name}</h3>
            </div>
          </div>

          {matchDetails.venue && (
            <div className="text-center text-sm text-gray-600">
              📍 {matchDetails.venue}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            {t("overview", { ar: "نظرة عامة", en: "Overview" })}
          </TabsTrigger>
          <TabsTrigger value="events">
            {t("events", { ar: "الأحداث", en: "Events" })}
          </TabsTrigger>
          <TabsTrigger value="statistics">
            {t("statistics", { ar: "الإحصائيات", en: "Statistics" })}
          </TabsTrigger>
          <TabsTrigger value="predictions">
            {t("predictions", { ar: "التوقعات", en: "Predictions" })}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("matchOverview", { ar: "نظرة عامة على المباراة", en: "Match Overview" })}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-saudi-red">{matchDetails.homeTeam.score}</div>
                  <div className="text-sm text-gray-600">{t("goals", { ar: "أهداف", en: "Goals" })}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-saudi-red">{matchDetails.awayTeam.score}</div>
                  <div className="text-sm text-gray-600">{t("goals", { ar: "أهداف", en: "Goals" })}</div>
                </div>
              </div>

              {matchDetails.events && matchDetails.events.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">{t("keyEvents", { ar: "الأحداث المهمة", en: "Key Events" })}</h4>
                  <div className="space-y-2">
                    {matchDetails.events.slice(0, 5).map((event, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <span className={getEventColor(event.type)}>{getEventIcon(event.type)}</span>
                        <span className="font-medium">{event.minute}'</span>
                        <span>{event.player}</span>
                        <span className="text-gray-500">- {event.detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("matchEvents", { ar: "أحداث المباراة", en: "Match Events" })}</CardTitle>
            </CardHeader>
            <CardContent>
              {matchDetails.events && matchDetails.events.length > 0 ? (
                <div className="space-y-4">
                  {matchDetails.events.map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className={getEventColor(event.type)}>{getEventIcon(event.type)}</span>
                        <div>
                          <div className="font-medium">{event.player}</div>
                          <div className="text-sm text-gray-600">{event.detail}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{event.minute}'</div>
                        <div className="text-xs text-gray-500">{event.team}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {t("noEvents", { ar: "لا توجد أحداث مسجلة", en: "No events recorded" })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("matchStatistics", { ar: "إحصائيات المباراة", en: "Match Statistics" })}</CardTitle>
            </CardHeader>
            <CardContent>
              {matchDetails.statistics ? (
                <div className="space-y-6">
                  {Object.entries(matchDetails.statistics.home).map(([key, homeValue]) => {
                    const awayValue = matchDetails.statistics.away[key];
                    const total = Number(homeValue) + Number(awayValue);
                    const homePercentage = total > 0 ? (Number(homeValue) / total) * 100 : 50;
                    const awayPercentage = 100 - homePercentage;

                    return (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                          <span>{matchDetails.homeTeam.name}</span>
                          <span>{matchDetails.awayTeam.name}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex-1 text-right">
                            <span className="font-bold">{homeValue}</span>
                          </div>
                          <div className="flex-1 flex space-x-2">
                            <Progress value={homePercentage} className="flex-1" />
                            <Progress value={awayPercentage} className="flex-1" />
                          </div>
                          <div className="flex-1 text-left">
                            <span className="font-bold">{awayValue}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 text-center capitalize">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {t("noStatistics", { ar: "لا توجد إحصائيات متوفرة", en: "No statistics available" })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("matchPredictions", { ar: "توقعات المباراة", en: "Match Predictions" })}</CardTitle>
            </CardHeader>
            <CardContent>
              {matchDetails.predictions ? (
                <div className="space-y-6">
                  {/* Win Probability */}
                  <div>
                    <h4 className="font-semibold mb-3">{t("winProbability", { ar: "احتمالية الفوز", en: "Win Probability" })}</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>{matchDetails.homeTeam.name}</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={matchDetails.predictions.homeWinPercentage} className="w-32" />
                          <span className="font-bold">{matchDetails.predictions.homeWinPercentage}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{t("draw", { ar: "تعادل", en: "Draw" })}</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={matchDetails.predictions.drawPercentage} className="w-32" />
                          <span className="font-bold">{matchDetails.predictions.drawPercentage}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{matchDetails.awayTeam.name}</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={matchDetails.predictions.awayWinPercentage} className="w-32" />
                          <span className="font-bold">{matchDetails.predictions.awayWinPercentage}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Predicted Score */}
                  <div>
                    <h4 className="font-semibold mb-3">{t("predictedScore", { ar: "النتيجة المتوقعة", en: "Predicted Score" })}</h4>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-saudi-red">
                        {matchDetails.predictions.goals.home} - {matchDetails.predictions.goals.away}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {t("predictedGoals", { ar: "أهداف متوقعة", en: "Predicted Goals" })}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Betting Advice */}
                  {matchDetails.predictions.advice && (
                    <div>
                      <h4 className="font-semibold mb-3">{t("bettingAdvice", { ar: "نصيحة المراهنة", en: "Betting Advice" })}</h4>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">{matchDetails.predictions.advice}</p>
                      </div>
                    </div>
                  )}

                  {/* Over/Under */}
                  {matchDetails.predictions.underOver && (
                    <div>
                      <h4 className="font-semibold mb-3">{t("overUnder", { ar: "أكثر/أقل", en: "Over/Under" })}</h4>
                      <Badge variant="outline" className="text-lg px-4 py-2">
                        {matchDetails.predictions.underOver}
                      </Badge>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {t("noPredictions", { ar: "لا توجد توقعات متوفرة", en: "No predictions available" })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Last Updated */}
      <div className="text-center text-xs text-gray-500">
        {t("lastUpdated", { ar: "آخر تحديث", en: "Last updated" })}: {formatTime(matchDetails.lastUpdated)}
      </div>
    </div>
  );
} 