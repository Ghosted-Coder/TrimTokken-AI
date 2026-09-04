import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { Router, Check, ChevronDown, ChevronUp, Filter, Search, Sparkles, Trash2, HelpCircle, ArrowRight, CornerDownRight, Zap, Loader2 } from 'lucide-react';
import { RoutingDecision, QueryComplexity, ModelPricing, RouterConfig } from '../types';
import { routeQuery } from '../lib/routerEngine';

interface LiveRoutingStreamProps {
  queries: RoutingDecision[];
  searchTerm: string;
  isSimulating: boolean;
  onClearQueries?: () => void;
  onExecutePresetQuery?: (decision: RoutingDecision) => void;
  models?: ModelPricing[];
  routerConfig?: RouterConfig;
}

export const LiveRoutingStream: React.FC<LiveRoutingStreamProps> = ({
  queries,
  searchTerm,
  isSimulating,
  onClearQueries,
  onExecutePresetQuery,
  models,
  routerConfig
}) => {
  const [selectedComplexityFilter, setSelectedComplexityFilter] = useState<string>('ALL');
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<'ALL' | 'USER' | 'BENCHMARK'>('ALL');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [presetExecuting, setPresetExecuting] = useState(false);

  // Filter queries based on search term, complexity, and source (User vs Benchmark)
  const filteredQueries = queries.filter((q) => {
    const matchesSearch =
      !searchTerm ||
      q.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.routedModel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.complexity.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesComplexity =
      selectedComplexityFilter === 'ALL' || q.complexity === selectedComplexityFilter;

    const matchesSource =
      selectedSourceFilter === 'ALL' ||
      (selectedSourceFilter === 'USER' && q.source === 'USER') ||
      (selectedSourceFilter === 'BENCHMARK' && q.source !== 'USER');

    return matchesSearch && matchesComplexity && matchesSource;
  });

  const userQueryCount = queries.filter((q) => q.source === 'USER').length;
  const benchmarkQueryCount = queries.filter((q) => q.source !== 'USER').length;

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
            {userQueryCount > 0 && (
              <span className="font-mono-data text-[11px] text-[#72ff70] bg-[#00ff41]/15 px-2 py-0.5 rounded border border-[#00ff41]/30">
                {userQueryCount} YOURS
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Source Filter (All / Yours / Benchmarks) */}
          <div className="flex items-center gap-1 bg-[#10141a] p-0.5 rounded-lg border border-[#3b4b37]/60 text-xs font-mono-data">
            <button
              onClick={() => setSelectedSourceFilter('ALL')}
              className={`px-2 py-0.5 rounded text-[10px] tracking-wider transition-all cursor-pointer ${
                selectedSourceFilter === 'ALL'
                  ? 'bg-[#00ff41] text-[#003907] font-bold'
                  : 'text-[#b9ccb2] hover:text-white'
              }`}
            >
              ALL
            </button>
            <button
              onClick={() => setSelectedSourceFilter('USER')}
              className={`px-2 py-0.5 rounded text-[10px] tracking-wider transition-all cursor-pointer ${
                selectedSourceFilter === 'USER'
                  ? 'bg-[#00ff41] text-[#003907] font-bold'
                  : 'text-[#b9ccb2] hover:text-white'
              }`}
            >
              MY QUESTIONS ({userQueryCount})
            </button>
            <button
              onClick={() => setSelectedSourceFilter('BENCHMARK')}
              className={`px-2 py-0.5 rounded text-[10px] tracking-wider transition-all cursor-pointer ${
                selectedSourceFilter === 'BENCHMARK'
                  ? 'bg-[#00e5ff] text-[#003740] font-bold'
                  : 'text-[#b9ccb2] hover:text-white'
              }`}
            >
              BENCHMARKS ({benchmarkQueryCount})
            </button>
          </div>

          {/* Complexity Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto text-xs font-mono-data">
            {['ALL', 'SIMPLE', 'EXTRACTION', 'REASONING', 'CODE', 'COMPLEX'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedComplexityFilter(cat)}
                className={`px-2 py-1 rounded text-[10px] tracking-wider transition-all cursor-pointer ${
                  selectedComplexityFilter === cat
                    ? 'bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/40 font-bold'
                    : 'bg-[#1c2026] text-[#b9ccb2] border border-[#3b4b37]/40 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

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
              No matching queries found in current filter
            </h3>
            <p className="font-body text-xs text-[#b9ccb2]/70 max-w-md mb-5 leading-relaxed">
              Try switching the origin filter or typing a problem in the Manual Query box above.
            </p>
          </div>
        ) : (
          <table className="w-full text-left font-mono-data text-xs whitespace-nowrap">
            <thead className="text-[11px] text-[#b9ccb2] bg-[#10141a]/90 sticky top-0 z-10 border-b border-[#3b4b37]/60 backdrop-blur-md">
              <tr>
                <th className="px-4 py-3">ORIGIN / TIME</th>
                <th className="px-4 py-3 w-2/5">PROMPT / QUESTION</th>
                <th className="px-4 py-3">COMPLEXITY</th>
                <th className="px-4 py-3">ROUTED_TO</th>
                <th className="px-4 py-3">SAVINGS</th>
                <th className="px-4 py-3 text-right">STATUS / LATENCY</th>
              </tr>
            </thead>
            <tbody className="text-[#dfe2eb] divide-y divide-[#3b4b37]/20">
              {filteredQueries.map((q) => {
                const isExpanded = expandedRowId === q.id;
                const isUser = q.source === 'USER';

                return (
                  <React.Fragment key={q.id}>
                    <tr
                      onClick={() => setExpandedRowId(isExpanded ? null : q.id)}
                      className={`hover:bg-[#353940]/25 transition-colors cursor-pointer ${
                        isExpanded ? 'bg-[#00ff41]/[0.04]' : isUser ? 'bg-[#00ff41]/[0.02]' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-[#b9ccb2] text-[11px]">
                        <div className="flex items-center gap-1.5">
                          {isUser ? (
                            <span className="bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/40 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider">
                              YOU
                            </span>
                          ) : (
                            <span className="bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30 px-1.5 py-0.5 rounded text-[9px] font-medium tracking-wider">
                              REPLICA
                            </span>
                          )}
                          <span>{q.timestamp}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 truncate max-w-xs text-[#dfe2eb]/90 font-medium">
                        "{q.prompt}"
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
                        <td colSpan={6} className="p-4 border-y border-[#00ff41]/20">
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
        )}
      </div>
    </div>
  );
};
