import { LiveMatches } from "@/components/LiveMatches";
import { RecentTransfers } from "@/components/RecentTransfers";
import { LatestNews } from "@/components/LatestNews";
import { PlayerStats } from "@/components/PlayerStats";
import { AdvancedStats } from "@/components/AdvancedStats";
import { BannerAd, InlineAd } from "@/components/AdSpaces";

export default function Home() {
  return (
    <div className="animate-fade-in">
      <BannerAd />
      <LiveMatches />
      <InlineAd />
      <RecentTransfers />
      <InlineAd />
      <AdvancedStats />
      <InlineAd />
      <LatestNews />
      <PlayerStats />
    </div>
  );
}
