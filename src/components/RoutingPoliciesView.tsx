import React from 'react';
import { Sliders, Cpu, Gauge, Zap, CheckCircle2, ShieldAlert } from 'lucide-react';
import { RouterConfig, ModelPricing } from '../types';

interface RoutingPoliciesViewProps {
  config: RouterConfig;
  onChangeConfig: (newConfig: Partial<RouterConfig>) => void;
  models: ModelPricing[];
}

export const RoutingPoliciesView: React.FC<RoutingPoliciesViewProps> = ({
  config,
  onChangeConfig,
  models,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel rounded-xl p-6 border border-[#00ff41]/30 bg-[#142018]/80">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-9 h-9 rounded-lg bg-[#00ff41]/15 border border-[#00ff41]/40 flex items-center justify-center text-[#00ff41]">
            <Sliders className="w-5 h-5" />
          </span>
          <div>
            <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
              Routing Policies & Cost-Spectrum Pareto Tuning
            </h2>
            <p className="text-xs font-mono-data text-[#b9ccb2]">
              Configuring live trade-offs between frontier quality and per-token financial optimization.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sliders & Controls */}
        <div className="lg:col-span-7 glass-panel rounded-xl p-6 border border-[#3b4b37]/60 space-y-6">
          {/* Strategy Picker */}
          <div>
            <label className="block text-xs font-mono-data font-bold text-[#00ff41] tracking-wider uppercase mb-2">
              ROUTING STRATEGY ALGORITHM
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: 'qwen_finetuned',
                  name: 'Fine-tuned Qwen Router (Active)',
                  desc: 'Your locally trained Qwen model classifies the prompt and selects the designated provider. It never answers the user question.'
                }
              ].map((strat) => (
                <div
                  key={strat.id}
                  onClick={() => onChangeConfig({ routingStrategy: strat.id as any })}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    config.routingStrategy === strat.id
                      ? 'bg-[#00ff41]/10 border-[#00ff41] text-white shadow-[0_0_15px_rgba(0,255,65,0.1)]'
                      : 'bg-[#181c22] border-[#3b4b37]/50 text-[#b9ccb2] hover:border-[#3b4b37]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono-data text-xs font-bold text-white">
                      {strat.name}
                    </span>
                    {config.routingStrategy === strat.id && (
                      <CheckCircle2 className="w-4 h-4 text-[#00ff41]" />
                    )}
                  </div>
                  <p className="text-[11px] font-body text-[#b9ccb2]/80 leading-relaxed">
                    {strat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Pareto Sensitivity Slider */}
          <div className="border-t border-[#3b4b37]/40 pt-5">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-mono-data font-bold text-[#00ff41] tracking-wider uppercase flex items-center gap-1.5">
                <Gauge className="w-4 h-4" />
                COST SENSITIVITY WEIGHT (λ = {config.costSensitivity.toFixed(2)})
              </label>
              <span className="text-xs font-mono-data text-[#72ff70] bg-[#00ff41]/10 px-2 py-0.5 rounded border border-[#00ff41]/30">
                {config.costSensitivity > 0.7 ? 'Aggressive Savings' : config.costSensitivity < 0.4 ? 'Prioritize Quality' : 'Balanced Pareto Optimal'}
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={config.costSensitivity}
              onChange={(e) => onChangeConfig({ costSensitivity: parseFloat(e.target.value) })}
              className="w-full h-2 bg-[#10141a] rounded-lg appearance-none cursor-pointer accent-[#00ff41]"
            />
            <div className="flex justify-between text-[10px] font-mono-data text-[#b9ccb2]/70 mt-1.5">
              <span>0.0 (Pure Quality Focus)</span>
              <span>0.50 (Balanced)</span>
              <span>1.0 (Maximum Dollar Savings)</span>
            </div>
          </div>

          {/* Baseline Frontier Model Picker */}
          <div className="border-t border-[#3b4b37]/40 pt-5">
            <label className="block text-xs font-mono-data font-bold text-[#00ff41] tracking-wider uppercase mb-2">
              NAIVE BASELINE COMPARISON MODEL
            </label>
            <select
              value={config.frontierBaselineModelId}
              onChange={(e) => onChangeConfig({ frontierBaselineModelId: e.target.value })}
              className="w-full bg-[#10141a] border border-[#3b4b37] rounded-lg p-3 font-mono-data text-xs text-white focus:outline-none focus:border-[#00ff41]"
            >
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.provider}) — ${m.promptPricePerM.toFixed(2)}/M in, ${m.completionPricePerM.toFixed(2)}/M out
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Column: Routing Spectrum Radar / Map */}
        <div className="lg:col-span-5 glass-panel rounded-xl p-6 border border-[#3b4b37]/60 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-display text-base font-bold text-white mb-1 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-[#00ff41]" />
              Complexity Spectrum Mapping
            </h3>
            <p className="text-xs font-mono-data text-[#b9ccb2] mb-4">
              Projected model dispatch distribution under current λ={config.costSensitivity.toFixed(2)} weights:
            </p>

            <div className="space-y-3 font-mono-data text-xs">
              {[
                { type: 'SIMPLE (Translations / FAQs)', model: 'Llama-3-8B ($0.15/M)', pct: config.costSensitivity > 0.5 ? 98 : 85, color: '#00ff41' },
                { type: 'EXTRACTION (JSON / OCR / Regex)', model: 'Gemini 3.7 Flash / Llama-3', pct: 92, color: '#72ff70' },
                { type: 'REASONING (Analysis / Logic)', model: 'Qwen 2.5 72B / DeepSeek', pct: config.costSensitivity > 0.6 ? 88 : 75, color: '#00C9E8' },
                { type: 'CODE (Python / Rust / Debug)', model: 'Qwen 2.5 Coder / DeepSeek-V3', pct: 92, color: '#ffba20' },
                { type: 'COMPLEX (Contracts / Proofs)', model: 'GPT-4o / Claude 3.5 Sonnet', pct: 96, color: '#ff5555' }
              ].map((tier, idx) => (
                <div key={idx} className="bg-[#10141a] p-3 rounded-lg border border-[#3b4b37]/40">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-white">{tier.type}</span>
                    <span className="text-[11px]" style={{ color: tier.color }}>{tier.pct}% Accuracy</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-[#b9ccb2] mb-1.5">
                    <span>Routed to: <strong className="text-white">{tier.model}</strong></span>
                  </div>
                  <div className="w-full bg-[#1c2026] h-1.5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${tier.pct}%`, backgroundColor: tier.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#00ff41]/5 border border-[#00ff41]/20 p-3 rounded-lg text-[11px] font-mono-data text-[#72ff70] flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-[#00ff41] shrink-0 mt-0.5" />
            <span>
              Zero hallucinations on routing: If dynamic price of frontier model drops below threshold, router automatically escalates borderline queries for safety.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
