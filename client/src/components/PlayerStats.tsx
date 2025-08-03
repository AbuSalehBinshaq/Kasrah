import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { PlayerWithTeam } from "@shared/schema";

export function PlayerStats() {
  const { t } = useLanguage();

  const { data: players } = useQuery<PlayerWithTeam[]>({
    queryKey: ["/api/players"],
  });

  // Get top players by goals
  const topPlayers = players
    ?.filter((player) => player.goals && player.goals > 0)
    .sort((a, b) => (b.goals || 0) - (a.goals || 0))
    .slice(0, 5) || [];

  return (
    <section className="px-4 py-6 bg-gradient-to-br from-saudi-red-50 to-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 font-tajawal">
          {t("weeklyStars", { ar: "نجوم الأسبوع", en: "Weekly Stars" })}
        </h2>
        <Button variant="ghost" size="sm" className="text-saudi-red">
          {t("viewAll", { ar: "عرض الكل", en: "View All" })}
        </Button>
      </div>

      {topPlayers.length > 0 ? (
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <div className="space-y-4">
              {topPlayers.map((player, index) => (
                <div
                  key={player.id}
                  className={`flex items-center space-x-reverse space-x-4 p-3 rounded-xl ${
                    index === 0
                      ? "bg-gradient-to-r from-saudi-red-50 to-transparent border-2 border-saudi-red"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-saudi-red to-saudi-red-dark">
                    {player.photoUrl ? (
                      <img
                        src={player.photoUrl}
                        alt={player.nameAr}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                        {player.nameAr.slice(0, 2)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{player.nameAr}</h4>
                    <p className="text-sm text-gray-600">
                      {player.team?.nameAr} - {player.position}
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="text-lg font-bold text-saudi-red">{player.goals}</div>
                    <div className="text-xs text-gray-500">
                      {t("goals", { ar: "أهداف", en: "Goals" })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">
              {t("noStats", { ar: "لا توجد إحصائيات متوفرة", en: "No statistics available" })}
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
