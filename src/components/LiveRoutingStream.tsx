import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { Router, Check, ChevronDown, ChevronUp, Sparkles, Trash2, HelpCircle, ArrowRight, CornerDownRight, Zap, Loader2 } from 'lucide-react';
import { RoutingDecision, QueryComplexity, ModelPricing, RouterConfig } from '../types';
import { routeQuery } from '../lib/routerEngine';
import { RoutingStats } from './ui/routing-stats';

interface LiveRoutingStreamProps {
  queries: RoutingDecision[];
  searchTerm: string;
  isSimulating: boolean;
  onClearQueries?: () => void;
  onExecutePresetQuery?: (decision: RoutingDecision) => void;
  models?: ModelPricing[];
  routerConfig?: RouterConfig;
}

type SortColumn = 'timestamp' | 'prompt' | 'complexity' | 'model' | 'tier' | 'tokens' | 'cost' | 'savings' | 'latency';

export const LiveRoutingStream: React.FC<LiveRoutingStreamProps> = ({
  queries,
  searchTerm,
  isSimulating,
  onClearQueries,
  onExecutePresetQuery,
  models,
  routerConfig
}) => {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [presetExecuting, setPresetExecuting] = useState(false);
  const [sortColumn, setSortColumn] = useState<SortColumn>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filter queries using the global search field.
  const filteredQueries = queries.filter((q) => {
    const matchesSearch =
      !searchTerm ||
      q.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.routedModel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.complexity.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const sortedQueries = [...filteredQueries].sort((a, b) => {
    const values: Record<SortColumn, [string | number, string | number]> = {
      timestamp: [Date.parse(a.timestamp) || a.timestamp, Date.parse(b.timestamp) || b.timestamp],
      prompt: [a.prompt.toLowerCase(), b.prompt.toLowerCase()],
      complexity: [a.complexity, b.complexity],
      model: [a.routedModel.name.toLowerCase(), b.routedModel.name.toLowerCase()],
      tier: [
        ['ULTRA_CHEAP', 'EDGE', 'MID', 'FRONTIER'].indexOf(a.routedModel.tier),
        ['ULTRA_CHEAP', 'EDGE', 'MID', 'FRONTIER'].indexOf(b.routedModel.tier),
      ],
      tokens: [a.inputTokens + a.outputTokens, b.inputTokens + b.outputTokens],
      cost: [a.realizedCost, b.realizedCost],
      savings: [a.savingsPercentage, b.savingsPercentage],
      latency: [a.latencyMs, b.latencyMs],
    };
    const [left, right] = values[sortColumn];
    const comparison = typeof left === 'number' && typeof right === 'number'
      ? left - right
      : String(left).localeCompare(String(right));
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(direction => direction === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection(column === 'timestamp' ? 'desc' : 'asc');
    }
  };

  const renderSortHeader = (label: string, column: SortColumn, className = '') => (
    <th
      aria-sort={sortColumn === column ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
      className={`px-4 py-3 ${className}`}
    >
      <button
        type="button"
        onClick={() => handleSort(column)}
        className="inline-flex items-center gap-1 hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#00ff41]"
      >
        {label}
        {sortColumn === column && (
          sortDirection === 'asc'
            ? <ChevronUp className="h-3 w-3" aria-hidden="true" />
            : <ChevronDown className="h-3 w-3" aria-hidden="true" />
        )}
      </button>
    </th>
  );

  const hasSearch = Boolean(searchTerm);
  const totalCost = queries.reduce((sum, query) => sum + query.realizedCost, 0);
  const naiveCost = queries.reduce((sum, query) => sum + query.naiveCost, 0);
  const avgLatencyMs = queries.length
    ? queries.reduce((sum, query) => sum + query.latencyMs, 0) / queries.length
    : 0;
  const premiumPct = queries.length
    ? (queries.filter((query) => query.routedModel.tier === 'FRONTIER').length / queries.length) * 100
    : 0;

  const getComplexityBadge = (complexity: QueryComplexity) => {
    switch (complexity) {
      case 'SIMPLE':
        return (
          <span className="bg-[#353940] text-[#00ff41] px-2 py-0.5 rounded text-[11px] font-mono-data border border-[#00ff41]/30 font-semibold">
            SIMPLE
          </span>
        );
      case 'EXTRACTION':
        return (
          <span className="bg-[#00ff41]/10 text-[#72ff70] px-2 py-0.5 rounded text-[11px] font-mono-data border border-[#72ff70]/30 font-semibold">
            EXTRACTION
          </span>
        );
      case 'REASONING':
        return (
          <span className="bg-[#abc7ff]/15 text-[#abc7ff] px-2 py-0.5 rounded text-[11px] font-mono-data border border-[#abc7ff]/30 font-semibold">
            REASONING
          </span>
        );
      case 'CODE':
        return (
          <span className="bg-[#ffba20]/15 text-[#ffba20] px-2 py-0.5 rounded text-[11px] font-mono-data border border-[#ffba20]/30 font-semibold">
            CODE
          </span>
        );
      case 'COMPLEX':
        return (
          <span className="bg-[#93000a]/30 text-[#ffb4ab] px-2 py-0.5 rounded text-[11px] font-mono-data border border-[#93000a]/50 font-semibold">
            COMPLEX
          </span>
        );
      default:
        return (
          <span className="bg-[#353940] text-[#dfe2eb] px-2 py-0.5 rounded text-[11px] font-mono-data border border-[#3b4b37]">
            {complexity}
          </span>
        );
    }
  };

  const handleQuickPreset = async (presetText: string) => {
    if (!onExecutePresetQuery || !models || !routerConfig) return;
    setPresetExecuting(true);
    try {
      const decision = await routeQuery(presetText, models, routerConfig, undefined, 'USER');
      
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: presetText,
          modelId: decision.routedModel.id,
          modelName: decision.routedModel.name,
          provider: decision.routedModel.provider,
          complexity: decision.complexity,
        }),
      });
      const data = await res.json();
      const answer = data?.text || decision.responseSnippet || 'Solved with optimal routing.';

      const finalDecision: RoutingDecision = {
        ...decision,
        source: 'USER',
        responseSnippet: answer,
        fullResponse: answer,
        latencyMs: data?.executionTimeMs || decision.latencyMs,
        inputTokens: data?.promptTokens || decision.inputTokens,
        outputTokens: data?.completionTokens || decision.outputTokens,
      };

      onExecutePresetQuery(finalDecision);
    } catch (e) {
      const decision = await routeQuery(presetText, models, routerConfig, undefined, 'USER');
      onExecutePresetQuery(decision);
    } finally {
      setPresetExecuting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <RoutingStats
        totalRequests={queries.length}
        totalCost={totalCost}
        naiveCost={naiveCost}
        avgLatencyMs={avgLatencyMs}
        premiumPct={premiumPct}
      />

      {/* Header Bar */}
      <div className="p-4 border-b border-[#3b4b37]/50 flex flex-wrap justify-between items-center bg-[#181c22]/60 gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-base md:text-lg font-semibold text-[#dfe2eb] flex items-center gap-2">
            <span className="w-7 h-7 rounded-md bg-[#00e639]/10 border border-[#00e639]/30 flex items-center justify-center text-[#00ff41]">
              <Router className="w-4 h-4" />
            </span>
            Simultaneous Live Routing Stream
          </h2>

          <div className="flex items-center gap-2">
            <span className="font-mono-data text-[11px] text-[#00ff41] bg-[#00ff41]/10 px-2 py-0.5 rounded border border-[#00ff41]/30 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse"></span>
              {queries.length} TOTAL QUERIES
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Clear History Button */}
          {queries.length > 0 && onClearQueries && (
            <button
              onClick={onClearQueries}
              className="text-xs font-mono-data text-[#b9ccb2] hover:text-[#ff8888] bg-[#1c2026] hover:bg-[#ff5555]/10 px-2.5 py-1 rounded border border-[#3b4b37]/50 hover:border-[#ff5555]/30 flex items-center gap-1 transition-colors cursor-pointer"
              title="Clear all asked questions"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto flex-grow max-h-[520px] overflow-y-auto">
        {filteredQueries.length === 0 ? (
          <div className="py-12 px-6 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-xl bg-[#00ff41]/10 border border-[#00ff41]/30 flex items-center justify-center text-[#00ff41] mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-mono-data text-sm font-bold text-white mb-1">
              No matching queries found
            </h3>
            <p className="font-body text-xs text-[#b9ccb2]/70 max-w-md mb-5 leading-relaxed">
              {hasSearch
                ? 'Try clearing the search in the top navigation or entering a different query.'
                : 'Run a query in the Manual Query box above to start building your routing history.'}
            </p>
          </div>
        ) : (
          <>
          <div className="md:hidden space-y-2 p-3">
            {sortedQueries.map((q) => {
              const isExpanded = expandedRowId === q.id;
              const isUser = q.source === 'USER';
              return (
                <article
                  key={q.id}
                  className={`rounded-lg border p-3 ${isExpanded ? 'border-[#00ff41]/50 bg-[#00ff41]/[0.04]' : 'border-[#3b4b37]/40 bg-[#0b1119]'}`}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedRowId(isExpanded ? null : q.id)}
                    className="w-full text-left"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${isUser ? 'bg-[#00ff41]/20 text-[#00ff41]' : 'bg-[#00e5ff]/10 text-[#00e5ff]'}`}>
                            {isUser ? 'YOU' : 'BENCHMARK'}
                          </span>
                          <span className="text-[10px] text-[#869683]">{q.timestamp}</span>
                        </div>
                        <p className="text-xs text-white truncate">"{q.prompt}"</p>
                      </div>
                      <ChevronDown className={`w-4 h-4 shrink-0 text-[#b9ccb2] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {getComplexityBadge(q.complexity)}
                      <span className="text-[10px] font-bold" style={{ color: q.routedModel.color }}>{q.routedModel.name}</span>
                      <span className="ml-auto text-[10px] text-[#00ff41]">{q.latencyMs}ms</span>
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-[#3b4b37]/40 grid grid-cols-2 gap-2 text-[10px]">
                      <div><span className="text-[#869683] block">SIMILARITY</span><strong className="text-[#00e5ff]">{(q.vectorSimilarity * 100).toFixed(1)}%</strong></div>
                      <div><span className="text-[#869683] block">SAVED</span><strong className="text-[#00ff41]">{q.savingsPercentage.toFixed(1)}%</strong></div>
                      <div><span className="text-[#869683] block">ROUTED COST</span><strong className="text-[#ffba20]">${q.realizedCost.toFixed(5)}</strong></div>
                      <div><span className="text-[#869683] block">TOKENS</span><strong className="text-white">{q.inputTokens} / {q.outputTokens}</strong></div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
          <table className="hidden min-w-[1240px] md:table w-full table-fixed text-left font-mono-data text-xs">
            <colgroup>
              <col className="w-[150px]" />
              <col className="w-[30%]" />
              <col className="w-[118px]" />
              <col className="w-[150px]" />
              <col className="w-[92px]" />
              <col className="w-[86px]" />
              <col className="w-[100px]" />
              <col className="w-[125px]" />
              <col className="w-[125px]" />
            </colgroup>
            <thead className="text-[11px] text-[#b9ccb2] bg-[#10141a]/90 sticky top-0 z-10 border-b border-[#3b4b37]/60 backdrop-blur-md">
              <tr>
                {renderSortHeader('ORIGIN / TIME', 'timestamp')}
                {renderSortHeader('PROMPT / QUESTION', 'prompt', 'w-2/5')}
                {renderSortHeader('COMPLEXITY', 'complexity')}
                {renderSortHeader('ROUTED TO', 'model')}
                {renderSortHeader('TIER', 'tier')}
                {renderSortHeader('TOKENS', 'tokens', 'text-right')}
                {renderSortHeader('COST', 'cost', 'text-right')}
                {renderSortHeader('SAVINGS', 'savings')}
                {renderSortHeader('STATUS / LATENCY', 'latency', 'text-right')}
              </tr>
            </thead>
            <tbody className="text-[#dfe2eb] divide-y divide-[#3b4b37]/20">
              {sortedQueries.map((q) => {
                const isExpanded = expandedRowId === q.id;
                const isUser = q.source === 'USER';

                return (
                  <React.Fragment key={q.id}>
                    <tr
                      onClick={() => setExpandedRowId(isExpanded ? null : q.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          setExpandedRowId(isExpanded ? null : q.id);
                        }
                      }}
                      tabIndex={0}
                      aria-expanded={isExpanded}
                      aria-label={`View routing details for ${q.prompt}`}
                      className={`hover:bg-[#353940]/25 transition-colors cursor-pointer ${
                        isExpanded ? 'bg-[#00ff41]/[0.04]' : isUser ? 'bg-[#00ff41]/[0.02]' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-[#b9ccb2] text-[11px]">
                        <div className="flex flex-col items-start gap-1">
                          {isUser ? (
                            <span className="bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/40 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider">
                              YOU
                            </span>
                          ) : (
                            <span className="bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30 px-1.5 py-0.5 rounded text-[9px] font-medium tracking-wider">
                              BENCHMARK
                            </span>
                          )}
                          <span className="whitespace-nowrap text-[10px] text-[#869683]">{q.timestamp}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#dfe2eb]/90 font-medium">
                        <span className="block truncate" title={q.prompt}>
                          "{q.prompt}"
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {getComplexityBadge(q.complexity)}
                      </td>
                      <td className="px-4 py-3">
                        <span 
                          className="font-bold flex items-center gap-1.5"
                          style={{ color: q.routedModel.color }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: q.routedModel.color }}></span>
                          {q.routedModel.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[10px] text-[#b9ccb2]">
                        {q.routedModel.tier.replace('_', ' ')}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-[#b9ccb2]">
                        {(q.inputTokens + q.outputTokens).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-[#ffba20]">
                        ${q.realizedCost.toFixed(5)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[#00ff41] font-semibold text-[11px] bg-[#00ff41]/10 px-1.5 py-0.5 rounded border border-[#00ff41]/20">
                          +{q.savingsPercentage.toFixed(1)}% (${(q.costSaved * 1000).toFixed(2)}m)
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-[#00ff41] font-mono-data text-xs">
                        <span className="inline-flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-[#00ff41]" />
                          {q.latencyMs}ms
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5 text-[#b9ccb2] ml-1" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-[#b9ccb2] ml-1" />
                          )}
                        </span>
                      </td>
                    </tr>

                    {/* Expanded Drawer Details */}
                    {isExpanded && (
                      <tr className="bg-[#0a0e14]/90">
                        <td colSpan={9} className="p-4 border-y border-[#00ff41]/20">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono-data">
                            {/* Col 1: Routing Justification */}
                            <div className="bg-[#14181f] p-3 rounded border border-[#3b4b37]/40 flex flex-col gap-1.5">
                              <span className="text-[10px] text-[#00ff41] uppercase tracking-wider font-bold">
                                k-NN Vector & Heuristics
                              </span>
                              <div className="text-[11px] text-[#b9ccb2]">
                                Nearest Cluster: <span className="text-white">{q.knnNearestCluster}</span> (Sim: {(q.vectorSimilarity * 100).toFixed(1)}%)
                              </div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {q.heuristicSignals.map((sig, idx) => (
                                  <span key={idx} className="text-[10px] bg-[#1c2026] text-[#72ff70] px-1.5 py-0.5 rounded border border-[#3b4b37]/50">
                                    {sig}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Col 2: Token & Cost Breakdown */}
                            <div className="bg-[#14181f] p-3 rounded border border-[#3b4b37]/40 flex flex-col gap-1.5">
                              <span className="text-[10px] text-[#ffba20] uppercase tracking-wider font-bold">
                                Token & Cost Delta
                              </span>
                              <div className="text-[11px] text-[#b9ccb2] flex justify-between">
                                <span>Input / Output Tokens:</span>
                                <span className="text-white font-semibold">{q.inputTokens} / {q.outputTokens}</span>
                              </div>
                              <div className="text-[11px] text-[#b9ccb2] flex justify-between">
                                <span>Naive Baseline Cost ({q.naiveModel}):</span>
                                <span className="text-[#ffba20] font-semibold">${q.naiveCost.toFixed(5)}</span>
                              </div>
                              <div className="text-[11px] text-[#b9ccb2] flex justify-between">
                                <span>Routed Cost ({q.routedModel.name}):</span>
                                <span className="text-[#00e5ff] font-semibold">${q.realizedCost.toFixed(5)}</span>
                              </div>
                            </div>

                            {/* Col 3: Actual Solution Output Preview */}
                            <div className="bg-[#14181f] p-3 rounded border border-[#3b4b37]/40 flex flex-col gap-1.5">
                              <span className="text-[10px] text-[#00e5ff] uppercase tracking-wider font-bold">
                                Actual Answer Output
                              </span>
                              <div className="text-[11px] font-body text-[#dfe2eb]/90 overflow-y-auto max-h-36 bg-[#0a0e14] p-2.5 rounded border border-[#3b4b37]/30 prose prose-invert prose-p:my-1 prose-headings:text-[#00ff41] prose-headings:my-1 prose-pre:my-1 prose-pre:p-2 prose-code:text-[#00e5ff] text-xs">
                                <Markdown>{q.fullResponse || q.responseSnippet || 'Processing...'}</Markdown>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
          </>
        )}
      </div>
    </div>
  );
};
