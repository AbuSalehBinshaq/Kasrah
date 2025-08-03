import { LiveMatches } from "@/components/LiveMatches";
import { RecentTransfers } from "@/components/RecentTransfers";
import { LatestNews } from "@/components/LatestNews";
import { PlayerStats } from "@/components/PlayerStats";

export default function Home() {
  return (
    <div className="animate-fade-in">
      <LiveMatches />
      <RecentTransfers />
      <LatestNews />
      <PlayerStats />
    </div>
  );
}
