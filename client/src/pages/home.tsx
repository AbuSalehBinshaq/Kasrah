import { LiveMatches } from "@/components/LiveMatches";
import { RecentTransfers } from "@/components/RecentTransfers";
import { LatestNews } from "@/components/LatestNews";
import { PlayerStats } from "@/components/PlayerStats";
import { BannerAd, InlineAd } from "@/components/AdSpaces";

export default function Home() {
  return (
    <div className="animate-fade-in">
      <BannerAd />
      <LiveMatches />
      <InlineAd />
      <RecentTransfers />
      <InlineAd />
      <LatestNews />
      <PlayerStats />
    </div>
  );
}
