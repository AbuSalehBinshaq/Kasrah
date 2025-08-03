import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import type { TransferWithDetails } from "@shared/schema";
import { TRANSFER_STATUS } from "@/lib/constants";

export default function Transfers() {
  const { t } = useLanguage();

  const { data: allTransfers } = useQuery<TransferWithDetails[]>({
    queryKey: ["/api/transfers/recent"],
  });

  const { data: confirmedTransfers } = useQuery<TransferWithDetails[]>({
    queryKey: ["/api/transfers/status/confirmed"],
  });

  const { data: rumorTransfers } = useQuery<TransferWithDetails[]>({
    queryKey: ["/api/transfers/status/rumor"],
  });

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      month: "short",
      day: "numeric",
    });
  };

  const renderTransfer = (transfer: TransferWithDetails) => (
    <Card key={transfer.id} className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center space-x-reverse space-x-4">
          {/* Player Photo */}
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
              <span>
                {transfer.fromTeam?.nameAr || t("freeAgent", { ar: "لاعب حر", en: "Free Agent" })}
              </span>
              <ArrowLeft className="mx-2 h-4 w-4 text-saudi-red" />
              <span>
                {transfer.toTeam?.nameAr || t("unknown", { ar: "غير معروف", en: "Unknown" })}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-reverse space-x-2">
                <Badge className={getStatusBadge(transfer.status)}>
                  {t(
                    transfer.status,
                    TRANSFER_STATUS[transfer.status as keyof typeof TRANSFER_STATUS] || {
                      ar: transfer.status,
                      en: transfer.status,
                    }
                  )}
                </Badge>
                <span className="text-xs text-gray-500">
                  {formatDate(transfer.announcedAt!)}
                </span>
              </div>
              
              {transfer.transferFee && (
                <span className="text-sm font-bold text-saudi-red">
                  {formatCurrency(transfer.transferFee)}
                </span>
              )}
            </div>

            {transfer.player.position && (
              <div className="mt-2 text-xs text-gray-500">
                {t("position", { ar: "المركز", en: "Position" })}: {transfer.player.position}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 font-tajawal mb-6">
        {t("transfers", { ar: "الانتقالات", en: "Transfers" })}
      </h1>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            {t("all", { ar: "الكل", en: "All" })}
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            {t("confirmed", { ar: "مؤكد", en: "Confirmed" })}
          </TabsTrigger>
          <TabsTrigger value="rumors">
            {t("rumors", { ar: "إشاعات", en: "Rumors" })}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {allTransfers && allTransfers.length > 0 ? (
            allTransfers.map(renderTransfer)
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-500">
                  {t("noTransfers", { ar: "لا توجد انتقالات", en: "No transfers" })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="confirmed" className="mt-6">
          {confirmedTransfers && confirmedTransfers.length > 0 ? (
            confirmedTransfers.map(renderTransfer)
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-500">
                  {t("noConfirmedTransfers", { ar: "لا توجد انتقالات مؤكدة", en: "No confirmed transfers" })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="rumors" className="mt-6">
          {rumorTransfers && rumorTransfers.length > 0 ? (
            rumorTransfers.map(renderTransfer)
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-500">
                  {t("noRumors", { ar: "لا توجد إشاعات", en: "No rumors" })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
