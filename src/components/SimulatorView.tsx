import React from 'react';
import { Play, Pause, Zap, Layers, RefreshCw, Sparkles, Activity, ShieldCheck } from 'lucide-react';
import { RouterConfig, RoutingDecision, ModelPricing } from '../types';

interface SimulatorViewProps {
  config: RouterConfig;
  onChangeConfig: (newConfig: Partial<RouterConfig>) => void;
  onTriggerBurst: (count: number) => void;
  recentQueries: RoutingDecision[];
  models: ModelPricing[];
  totalQueries: number;
}

export const SimulatorView: React.FC<SimulatorViewProps> = ({
  config,
  onChangeConfig,
  onTriggerBurst,
  recentQueries,
  models,
  totalQueries
}) => {
  const scenarios = [
    {
      id: 'mixed',
      title: 'Mixed Enterprise Traffic',
      desc: 'Standard multi-department corporate distribution: 40% Simple, 25% Extraction, 15% Reasoning, 15% Code, 5% Complex.',
      badge: 'BALANCED'
    },
    {
      id: 'ecommerce_support',
      title: 'Customer Support & Helpdesk',
      desc: 'High volume of tier-1 repetitive questions, returns, shipping lookups: 80% Simple, 15% Extraction, 5% Escalation.',
      badge: '78% SAVINGS'
    },
    {
      id: 'developer_copilot',
      title: 'Developer Assistant & DevOps',
      desc: 'Heavy coding queries, stack traces, lock-free algorithms, infrastructure: 60% Code, 25% Complex, 15% Reasoning.',
      badge: 'CODE HEAVY'
    },
    {
      id: 'legal_finance',
      title: 'Legal & Financial Analysis',
      desc: 'Contract indemnification, SOC2 compliance, earnings transcript analysis: 50% Complex, 35% Reasoning, 15% Extraction.',
      badge: 'FRONTIER DEFENSE'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel rounded-xl p-6 border border-[#00ff41]/30 bg-gradient-to-r from-[#142018] via-[#1c2026] to-[#10141a]">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-lg bg-[#00ff41]/15 border border-[#00ff41]/40 flex items-center justify-center text-[#00ff41]">
              <Activity className="w-6 h-6" />
            </span>
            <div>
              <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
                Enterprise Traffic Simulator Studio
              </h2>
              <p className="text-xs font-mono-data text-[#b9ccb2]">
                Stress-test fine-tuned Qwen routing against real-world domain traffic patterns.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onChangeConfig({ isSimulating: !config.isSimulating })}
              className={`px-4 py-2.5 rounded-lg text-xs font-mono-data font-bold flex items-center gap-2 transition-all cursor-pointer ${
                config.isSimulating
                  ? 'bg-[#ff5555]/20 text-[#ff8888] border border-[#ff5555]/50 hover:bg-[#ff5555]/30'
                  : 'bg-[#00ff41] text-[#003907] hover:bg-[#72ff70] shadow-[0_0_15px_rgba(0,255,65,0.3)]'
              }`}
            >
              {config.isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{config.isSimulating ? 'PAUSE TRAFFIC STREAM' : 'START CONTINUOUS STREAM'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Generator Controls */}
        <div className="lg:col-span-7 glass-panel rounded-xl p-6 border border-[#3b4b37]/60 space-y-6">
          {/* Rate Controller */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-mono-data font-bold text-[#00ff41] tracking-wider uppercase">
                TRAFFIC RATE SPEED (INTERVAL: {config.simulationSpeedMs}ms)
              </label>
              <span className="text-xs font-mono-data text-[#72ff70] bg-[#00ff41]/10 px-2 py-0.5 rounded border border-[#00ff41]/30">
                ~{(1000 / config.simulationSpeedMs).toFixed(1)} req / sec
              </span>
            </div>
            <input
              type="range"
              min="250"
              max="4000"
              step="250"
              value={config.simulationSpeedMs}
              onChange={(e) => onChangeConfig({ simulationSpeedMs: parseInt(e.target.value) })}
              className="w-full h-2 bg-[#10141a] rounded-lg appearance-none cursor-pointer accent-[#00ff41]"
            />
            <div className="flex justify-between text-[10px] font-mono-data text-[#b9ccb2]/70 mt-1.5">
              <span>Fast Burst (250ms)</span>
              <span>Normal (1500ms)</span>
              <span>Slow Scan (4000ms)</span>
            </div>
          </div>

          {/* Scenario Presets */}
          <div className="border-t border-[#3b4b37]/40 pt-5">
            <label className="block text-xs font-mono-data font-bold text-[#00ff41] tracking-wider uppercase mb-3">
              ENTERPRISE SCENARIO PROFILE
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {scenarios.map((sc) => (
                <div
                  key={sc.id}
                  onClick={() => onChangeConfig({ scenario: sc.id as any })}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    config.scenario === sc.id
                      ? 'bg-[#00ff41]/10 border-[#00ff41] text-white shadow-[0_0_15px_rgba(0,255,65,0.1)]'
                      : 'bg-[#181c22] border-[#3b4b37]/50 text-[#b9ccb2] hover:border-[#3b4b37]'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono-data text-xs font-bold text-white">
                      {sc.title}
                    </span>
                    <span className="text-[10px] font-mono-data bg-[#353940] px-1.5 py-0.5 rounded text-[#00ff41]">
                      {sc.badge}
                    </span>
                  </div>
                  <p className="text-[11px] font-body text-[#b9ccb2]/80 leading-relaxed">
                    {sc.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Burst Triggers */}
          <div className="border-t border-[#3b4b37]/40 pt-5 flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono-data text-[#b9ccb2] font-semibold mr-1">
              Trigger Instant Batch Load:
            </span>
            <button
              onClick={() => onTriggerBurst(10)}
              className="px-3 py-1.5 rounded bg-[#181c22] border border-[#3b4b37] hover:border-[#00ff41] text-xs font-mono-data text-white transition-colors cursor-pointer"
            >
              +10 Queries
            </button>
            <button
              onClick={() => onTriggerBurst(25)}
              className="px-3 py-1.5 rounded bg-[#181c22] border border-[#00ff41]/40 hover:bg-[#00ff41]/10 text-xs font-mono-data text-[#00ff41] font-bold transition-colors cursor-pointer"
            >
              +25 Queries
            </button>
            <button
              onClick={() => onTriggerBurst(50)}
              className="px-3 py-1.5 rounded bg-[#00ff41]/15 border border-[#00ff41] text-xs font-mono-data text-[#72ff70] font-bold hover:bg-[#00ff41]/25 transition-colors cursor-pointer"
            >
              +50 Burst Test
            </button>
          </div>
        </div>

        {/* Right Column: Live Stream Ticker Preview */}
        <div className="lg:col-span-5 glass-panel rounded-xl p-6 border border-[#3b4b37]/60 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#00ff41]" />
                Recent Simulated Dispatches
              </h3>
              <span className="text-[11px] font-mono-data text-[#00ff41] bg-[#00ff41]/10 px-2 py-0.5 rounded border border-[#00ff41]/30">
                {totalQueries} processed
              </span>
            </div>

            <div className="space-y-2 font-mono-data text-xs max-h-[380px] overflow-y-auto pr-1">
              {recentQueries.slice(0, 7).map((q) => (
                <div key={q.id} className="bg-[#10141a] p-2.5 rounded-lg border border-[#3b4b37]/40 flex flex-col gap-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-[#b9ccb2]">{q.timestamp}</span>
                    <span className="text-[#00ff41] font-bold">+{q.savingsPercentage.toFixed(1)}% Saved</span>
                  </div>
                  <div className="truncate text-white text-[11px]">
                    "{q.prompt}"
                  </div>
                  <div className="flex justify-between items-center text-[10px] pt-1 border-t border-[#3b4b37]/20">
                    <span className="text-[#b9ccb2]">Routed: <strong className="text-[#00e5ff]">{q.routedModel.name}</strong></span>
                    <span className="text-[#b9ccb2]">{q.latencyMs}ms</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] font-mono-data text-[#b9ccb2]/70 bg-[#14181f] p-3 rounded-lg border border-[#3b4b37]/30">
            Average routing overhead: <strong className="text-[#00ff41]">0.8ms</strong> (k-NN lookup runs completely in-memory on edge gateway).
          </div>
        </div>
      </div>
    </div>
  );
};
