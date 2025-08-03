import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/useLanguage";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { TransferWithDetails } from "@shared/schema";
import { TRANSFER_STATUS } from "@/lib/constants";

export function RecentTransfers() {
  const { t } = useLanguage();
  const { subscribe } = useWebSocket("");

  const { data: transfers, refetch } = useQuery<TransferWithDetails[]>({
    queryKey: ["/api/transfers/recent"],
  });

  useEffect(() => {
    const unsubscribe = subscribe("newTransfer", () => {
      refetch();
    });

    return unsubscribe;
  }, [subscribe, refetch]);

  const formatCurrency = (amount: string | null) => {
    if (!amount) return "";
    const num = parseFloat(amount);
    if (num >= 1000000) {
      return `€${(num / 1000000).toFixed(1)}M`;
    }
    return `€${num.toLocaleString()}`;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: "bg-saudi-red-100 text-saudi-red",
      rumor: "bg-yellow-100 text-yellow-600",
      completed: "bg-green-100 text-green-600",
    };

    return statusConfig[status as keyof typeof statusConfig] || "bg-gray-100 text-gray-600";
  };

  return (
    <section className="px-4 py-6 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 font-tajawal">
          {t("recentTransfers", { ar: "آخر الانتقالات", en: "Recent Transfers" })}
        </h2>
        <Button variant="ghost" size="sm" className="text-saudi-red">
          {t("viewAll", { ar: "عرض الكل", en: "View All" })}
        </Button>
      </div>

      {transfers && transfers.length > 0 ? (
        <div className="space-y-4">
          {transfers.slice(0, 5).map((transfer) => (
            <Card key={transfer.id} className="bg-gray-50 border-none">
              <CardContent className="p-4">
                <div className="flex items-center space-x-reverse space-x-4">
                  {/* Player Photo Placeholder */}
                  <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-saudi-red to-saudi-red-dark">
                    {transfer.player.photoUrl ? (
                      <img
                        src={transfer.player.photoUrl}
                        alt={transfer.player.nameAr}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                        {transfer.player.nameAr.slice(0, 2)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {transfer.player.nameAr}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <span>{transfer.fromTeam?.nameAr || t("unknown", { ar: "غير معروف", en: "Unknown" })}</span>
                      <ArrowLeft className="mx-2 h-4 w-4 text-saudi-red" />
                      <span>{transfer.toTeam?.nameAr || t("unknown", { ar: "غير معروف", en: "Unknown" })}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className={getStatusBadge(transfer.status)}>
                        {t(
                          transfer.status,
                          TRANSFER_STATUS[transfer.status as keyof typeof TRANSFER_STATUS] || {
                            ar: transfer.status,
                            en: transfer.status,
                          }
                        )}
                      </Badge>
                      {transfer.transferFee && (
                        <span className="text-sm font-bold text-saudi-red">
                          {formatCurrency(transfer.transferFee)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-gray-50">
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">
              {t("noTransfers", { ar: "لا توجد انتقالات حديثة", en: "No recent transfers" })}
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
