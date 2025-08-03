import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowRight, Calendar, MapPin, Clock, Users } from "lucide-react";
import type { MatchWithTeams } from "@shared/schema";

export default function MatchDetail() {
  const { t } = useLanguage();
  const { id } = useParams();

  const { data: match, isLoading } = useQuery<MatchWithTeams>({
    queryKey: [`/api/matches/${id}`],
  });

  const formatTime = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleTimeString("ar-SA", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString("ar-SA", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      live: { color: "bg-red-500 text-white", text: { ar: "مباشر", en: "Live" } },
      completed: { color: "bg-gray-500 text-white", text: { ar: "انتهت", en: "Completed" } },
      scheduled: { color: "bg-blue-500 text-white", text: { ar: "مجدولة", en: "Scheduled" } },
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled;
  };

  const getTeamLogo = (teamName: string) => {
    return (
      <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-lg font-bold bg-gradient-to-br from-saudi-red to-saudi-red-dark">
        {teamName.slice(0, 3)}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="p-4 max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-foreground">
          {t("matchNotFound", { ar: "المباراة غير موجودة", en: "Match not found" })}
        </h1>
      </div>
    );
  }

  const statusBadge = getStatusBadge(match.status);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowRight className="w-4 h-4 mr-2" />
            {t("backToHome", { ar: "العودة للرئيسية", en: "Back to Home" })}
          </Button>
        </Link>
        
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground font-tajawal">
            {t("matchDetails", { ar: "تفاصيل المباراة", en: "Match Details" })}
          </h1>
          <Badge className={statusBadge.color}>
            {t(statusBadge.text.ar, statusBadge.text)}
          </Badge>
        </div>
      </div>

      {/* Match Info */}
      <Card className="mb-6">
        <CardContent className="p-6">
          {/* Teams and Score */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-center flex-1">
              {getTeamLogo(match.homeTeam.nameAr)}
              <h2 className="text-xl font-bold text-foreground mt-3 font-tajawal">
                {match.homeTeam.nameAr}
              </h2>
              <p className="text-muted-foreground text-sm">
                {match.homeTeam.nameEn}
              </p>
            </div>

            <div className="text-center mx-8">
              {match.status === "completed" || match.status === "live" ? (
                <div className="text-4xl font-bold text-saudi-red">
                  {match.homeScore ?? 0} - {match.awayScore ?? 0}
                </div>
              ) : (
                <div className="text-2xl font-bold text-muted-foreground">
                  {t("vs", { ar: "ضد", en: "VS" })}
                </div>
              )}
              
              {match.status === "live" && match.currentTime && (
                <div className="text-saudi-red font-medium mt-2">
                  {match.currentTime}'
                </div>
              )}
              
              {match.status === "scheduled" && (
                <div className="text-muted-foreground mt-2">
                  {formatTime(match.matchDate)}
                </div>
              )}
            </div>

            <div className="text-center flex-1">
              {getTeamLogo(match.awayTeam.nameAr)}
              <h2 className="text-xl font-bold text-foreground mt-3 font-tajawal">
                {match.awayTeam.nameAr}
              </h2>
              <p className="text-muted-foreground text-sm">
                {match.awayTeam.nameEn}
              </p>
            </div>
          </div>

          {/* Match Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-border">
            <div className="flex items-center space-x-reverse space-x-2">
              <Calendar className="w-5 h-5 text-saudi-red" />
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("date", { ar: "التاريخ", en: "Date" })}
                </p>
                <p className="font-medium text-foreground">
                  {formatDate(match.matchDate)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-reverse space-x-2">
              <MapPin className="w-5 h-5 text-saudi-red" />
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("venue", { ar: "الملعب", en: "Venue" })}
                </p>
                <p className="font-medium text-foreground">
                  {match.venue || t("tbd", { ar: "سيحدد لاحقاً", en: "TBD" })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-reverse space-x-2">
              <Users className="w-5 h-5 text-saudi-red" />
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("league", { ar: "البطولة", en: "League" })}
                </p>
                <p className="font-medium text-foreground">
                  {match.league || t("friendlyMatch", { ar: "مباراة ودية", en: "Friendly Match" })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Match Events */}
      {match.events && Array.isArray(match.events) && match.events.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-saudi-red" />
              {t("matchEvents", { ar: "أحداث المباراة", en: "Match Events" })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {match.events.map((event: any, index: number) => (
                <div key={index} className="flex items-center space-x-reverse space-x-4 p-3 bg-muted rounded-lg">
                  <div className="w-12 h-12 bg-saudi-red text-white rounded-full flex items-center justify-center font-bold">
                    {event.minute}'
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {event.type} - {event.player}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {event.team}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}