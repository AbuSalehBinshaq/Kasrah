import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import type { PlayerWithTeam } from "@shared/schema";

export default function PlayerDetail() {
  const { id } = useParams();
  const { t } = useLanguage();

  const { data: player, isLoading } = useQuery<PlayerWithTeam>({
    queryKey: [`/api/players/${id}`],
  });

  const formatCurrency = (amount: string | null) => {
    if (!amount) return "غير محدد";
    const num = parseFloat(amount);
    if (num >= 1000000) {
      return `€${(num / 1000000).toFixed(1)}M`;
    }
    return `€${num.toLocaleString()}`;
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

  if (!player) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {t("playerNotFound", { ar: "اللاعب غير موجود", en: "Player not found" })}
        </h1>
        <Link href="/admin/players">
          <Button>
            <ArrowRight className="w-4 h-4 mr-2" />
            {t("backToPlayers", { ar: "العودة للاعبين", en: "Back to Players" })}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link href="/admin/players">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowRight className="w-4 h-4 mr-2" />
            {t("backToPlayers", { ar: "العودة للاعبين", en: "Back to Players" })}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Player Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 bg-gradient-to-br from-saudi-red to-saudi-red-dark">
                {player.photoUrl ? (
                  <img
                    src={player.photoUrl}
                    alt={player.nameAr}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 128 128'%3E%3Crect width='128' height='128' fill='%23C8102E'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='central' text-anchor='middle' font-family='Arial, sans-serif' font-size='48' fill='white'%3E" + player.nameAr.slice(0, 2) + "%3C/text%3E%3C/svg%3E";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-bold text-3xl">
                    {player.nameAr.slice(0, 2)}
                  </div>
                )}
              </div>

              <h1 className="text-2xl font-bold text-foreground dark:text-foreground font-tajawal mb-2">
                {player.nameAr}
              </h1>
              
              {player.nameEn && (
                <p className="text-muted-foreground dark:text-muted-foreground mb-4">
                  {player.nameEn}
                </p>
              )}

              <div className="space-y-2">
                <Badge className="bg-saudi-red text-white">
                  {player.position}
                </Badge>
                
                {player.team && (
                  <div className="text-sm text-muted-foreground dark:text-muted-foreground">
                    <i className="fas fa-users mr-2" />
                    {player.team.nameAr}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Player Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-user mr-2 text-saudi-red" />
                {t("basicInfo", { ar: "المعلومات الأساسية", en: "Basic Information" })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {player.age && (
                  <div>
                    <span className="font-medium text-muted-foreground dark:text-muted-foreground">
                      {t("age", { ar: "العمر", en: "Age" })}:
                    </span>
                    <span className="mr-2 text-foreground dark:text-foreground">
                      {player.age} {t("years", { ar: "سنة", en: "years" })}
                    </span>
                  </div>
                )}

                {player.nationality && (
                  <div>
                    <span className="font-medium text-muted-foreground dark:text-muted-foreground">
                      {t("nationality", { ar: "الجنسية", en: "Nationality" })}:
                    </span>
                    <span className="mr-2 text-foreground dark:text-foreground">
                      {player.nationality}
                    </span>
                  </div>
                )}

                <div>
                  <span className="font-medium text-muted-foreground dark:text-muted-foreground">
                    {t("position", { ar: "المركز", en: "Position" })}:
                  </span>
                  <span className="mr-2 text-foreground dark:text-foreground">
                    {player.position}
                  </span>
                </div>

                {player.marketValue && (
                  <div>
                    <span className="font-medium text-muted-foreground dark:text-muted-foreground">
                      {t("marketValue", { ar: "القيمة السوقية", en: "Market Value" })}:
                    </span>
                    <span className="mr-2 text-saudi-red font-bold">
                      {formatCurrency(player.marketValue)}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-chart-bar mr-2 text-saudi-red" />
                {t("statistics", { ar: "الإحصائيات", en: "Statistics" })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-saudi-red-50 dark:bg-saudi-red-900/10 rounded-lg">
                  <div className="text-2xl font-bold text-saudi-red mb-1">
                    {player.goals || 0}
                  </div>
                  <div className="text-sm text-muted-foreground dark:text-muted-foreground">
                    {t("goals", { ar: "أهداف", en: "Goals" })}
                  </div>
                </div>

                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {player.assists || 0}
                  </div>
                  <div className="text-sm text-muted-foreground dark:text-muted-foreground">
                    {t("assists", { ar: "تمريرات حاسمة", en: "Assists" })}
                  </div>
                </div>

                <div className="text-center p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {player.appearances || 0}
                  </div>
                  <div className="text-sm text-muted-foreground dark:text-muted-foreground">
                    {t("appearances", { ar: "مشاركات", en: "Appearances" })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-history mr-2 text-saudi-red" />
                {t("recentActivity", { ar: "النشاط الأخير", en: "Recent Activity" })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground dark:text-muted-foreground">
                {t("comingSoon", { ar: "قريباً - آخر المباريات والأهداف", en: "Coming Soon - Recent matches and goals" })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}