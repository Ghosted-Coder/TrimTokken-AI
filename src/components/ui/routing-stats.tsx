interface RoutingStatsProps {
  totalRequests: number;
  totalCost: number;
  naiveCost: number;
  avgLatencyMs: number;
  premiumPct: number;
}

function formatUsd(value: number): string {
  return `$${value.toFixed(4)}`;
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <SkiperLift className="h-full">
      <div className="h-full rounded-2xl border border-[#3b4b37]/60 bg-[#10141a] p-4 transition-colors hover:border-[#72ff70]/40">
      <p className="text-xs font-medium text-[#869683]">{label}</p>
      <p className="mt-1 text-2xl font-medium text-[#dfe2eb] tabular-nums">{value}</p>
      {sub && (
        <p className="mt-1 text-xs text-emerald-300 tabular-nums">{sub}</p>
      )}
      </div>
    </SkiperLift>
  );
}

export function RoutingStats({
  totalRequests,
  totalCost,
  naiveCost,
  avgLatencyMs,
  premiumPct,
}: RoutingStatsProps) {
  const saved = naiveCost - totalCost;
  const savedPct = naiveCost > 0 ? (saved / naiveCost) * 100 : 0;

  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-3 sm:grid-cols-4">
      <StatCard label="Requests routed" value={totalRequests.toLocaleString()} />
      <StatCard
        label="Total cost"
        value={formatUsd(totalCost)}
        sub={`vs ${formatUsd(naiveCost)} naive`}
      />
      <StatCard
        label="Cost saved"
        value={`${savedPct.toFixed(0)}%`}
        sub={formatUsd(saved)}
      />
      <StatCard
        label="Avg latency"
        value={`${Math.round(avgLatencyMs)}ms`}
        sub={`${premiumPct.toFixed(0)}% premium`}
      />
    </div>
  );
}

export default RoutingStats;
import { SkiperLift } from "./skiper-ui/skiper-motion";
