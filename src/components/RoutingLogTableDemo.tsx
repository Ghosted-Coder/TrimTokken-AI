import { DataTable, type DataTableColumn, type DataTableQuickFilterOption } from './ui/data-table';
import { RoutingStats } from './ui/routing-stats';
import type { RoutingDecision } from '../types';

type Tier = 'cheap' | 'mid' | 'premium';

interface RoutingLogTableDemoProps {
  queries: RoutingDecision[];
}

const TIER_STYLES: Record<Tier, string> = {
  cheap: 'text-emerald-300',
  mid: 'text-amber-300',
  premium: 'text-rose-300',
};

function getTier(tier: RoutingDecision['routedModel']['tier']): Tier {
  if (tier === 'FRONTIER') return 'premium';
  if (tier === 'MID') return 'mid';
  return 'cheap';
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime())
    ? timestamp
    : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const tierOptions: DataTableQuickFilterOption[] = [
  { value: 'cheap', label: 'Cheap' },
  { value: 'mid', label: 'Mid' },
  { value: 'premium', label: 'Premium' },
];

const columns: DataTableColumn<RoutingDecision>[] = [
  {
    id: 'timestamp',
    header: 'Time',
    sortable: true,
    value: (row) => Date.parse(row.timestamp) || row.timestamp,
    cell: (row) => <span className="tabular-nums">{formatTime(row.timestamp)}</span>,
  },
  {
    id: 'prompt',
    header: 'Query',
    sortable: true,
    value: (row) => row.prompt,
    cell: (row) => <span className="block max-w-sm truncate" title={row.prompt}>{row.prompt}</span>,
  },
  {
    id: 'model',
    header: 'Routed to',
    sortable: true,
    value: (row) => row.routedModel.name,
    cell: (row) => <span className="font-mono text-xs" style={{ color: row.routedModel.color }}>{row.routedModel.name}</span>,
  },
  {
    id: 'tokens',
    header: 'Tokens',
    sortable: true,
    numeric: true,
    hideBelow: 'md',
    value: (row) => row.inputTokens + row.outputTokens,
    cell: (row) => <span className="tabular-nums">{(row.inputTokens + row.outputTokens).toLocaleString()}</span>,
  },
  {
    id: 'cost',
    header: 'Cost',
    sortable: true,
    numeric: true,
    value: (row) => row.realizedCost,
    cell: (row) => <span className="font-mono text-xs">${row.realizedCost.toFixed(5)}</span>,
  },
  {
    id: 'tier',
    header: 'Tier',
    sortable: true,
    value: (row) => getTier(row.routedModel.tier),
    cell: (row) => {
      const tier = getTier(row.routedModel.tier);
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium capitalize ${TIER_STYLES[tier]}`}>
          <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
          {tier}
        </span>
      );
    },
  },
];

export function RoutingLogTableDemo({ queries }: RoutingLogTableDemoProps) {
  const totalCost = queries.reduce((sum, query) => sum + query.realizedCost, 0);
  const naiveCost = queries.reduce((sum, query) => sum + query.naiveCost, 0);
  const avgLatencyMs = queries.length
    ? queries.reduce((sum, query) => sum + query.latencyMs, 0) / queries.length
    : 0;
  const premiumPct = queries.length
    ? (queries.filter((query) => query.routedModel.tier === 'FRONTIER').length / queries.length) * 100
    : 0;

  return (
    <section className="mx-auto w-full max-w-7xl space-y-5 px-4 py-8 sm:px-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Routing Log Table</h1>
        <p className="mt-1 text-sm text-[#b9ccb2]">
          Search, filter, sort, and page through the current routing history.
        </p>
      </div>

      <RoutingStats
        totalRequests={queries.length}
        totalCost={totalCost}
        naiveCost={naiveCost}
        avgLatencyMs={avgLatencyMs}
        premiumPct={premiumPct}
      />

      <DataTable
        data={queries}
        columns={columns}
        rowId={(row) => row.id}
        rowLabel={(row) => `${row.prompt} at ${formatTime(row.timestamp)}`}
        caption="Current routing history, newest first."
        variant="panel"
        density="compact"
        searchable
        searchPlaceholder="Search queries or models"
        searchText={(row) => `${row.prompt} ${row.routedModel.name} ${row.complexity}`}
        quickFilter={{
          columnId: 'tier',
          label: 'Filter by tier',
          getValue: (row) => getTier(row.routedModel.tier),
          options: tierOptions,
          allLabel: 'All tiers',
        }}
        defaultSort={{ columnId: 'timestamp', direction: 'desc' }}
        pageSize={8}
        resizableColumns
        pinFirstColumn
        stickyHeader
        maxHeight={520}
      />
    </section>
  );
}

export default RoutingLogTableDemo;
