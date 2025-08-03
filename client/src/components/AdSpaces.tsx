import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent } from "@/components/ui/card";

interface AdSpaceProps {
  position: "banner" | "sidebar" | "inline" | "bottom";
  size?: "small" | "medium" | "large";
}

export function AdSpace({ position, size = "medium" }: AdSpaceProps) {
  const { t } = useLanguage();

  const getAdSize = () => {
    switch (size) {
      case "small":
        return "h-20";
      case "large":
        return "h-64";
      default:
        return "h-32";
    }
  };

  const getAdText = () => {
    switch (position) {
      case "banner":
        return { ar: "مساحة إعلانية - بانر علوي", en: "Ad Space - Top Banner" };
      case "sidebar":
        return { ar: "مساحة إعلانية - جانبية", en: "Ad Space - Sidebar" };
      case "inline":
        return { ar: "مساحة إعلانية - داخل المحتوى", en: "Ad Space - Inline" };
      case "bottom":
        return { ar: "مساحة إعلانية - سفلية", en: "Ad Space - Bottom" };
      default:
        return { ar: "مساحة إعلانية", en: "Advertisement Space" };
    }
  };

  return (
    <Card className={`${getAdSize()} mb-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-600`}>
      <CardContent className="h-full flex items-center justify-center p-4">
        <div className="text-center">
          <i className="fas fa-ad text-gray-400 text-2xl mb-2" />
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            {t("adSpace", getAdText())}
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
            {size === "small" && "320x90"}
            {size === "medium" && "728x90"}
            {size === "large" && "300x250"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function BannerAd() {
  return <AdSpace position="banner" size="medium" />;
}

export function SidebarAd() {
  return <AdSpace position="sidebar" size="large" />;
}

export function InlineAd() {
  return <AdSpace position="inline" size="small" />;
}

export function BottomAd() {
  return <AdSpace position="bottom" size="medium" />;
}