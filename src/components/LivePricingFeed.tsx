import React from 'react';
import { DollarSign, Bolt, Sparkles, Sliders, TrendingDown, ArrowDownRight } from 'lucide-react';
import { ModelPricing } from '../types';

interface LivePricingFeedProps {
  models: ModelPricing[];
  onOpenManageProviders: () => void;
  onSimulatePriceDrop: () => void;
  isGpt4oSlashed: boolean;
}

export const LivePricingFeed: React.FC<LivePricingFeedProps> = ({
  models,
  onOpenManageProviders,
  onSimulatePriceDrop,
  isGpt4oSlashed
}) => {
  return (
    <div className="glass-panel rounded-xl p-3 md:p-4 flex flex-col h-full border border-[#3b4b37]/60 bg-[#1c2026]/40">
      {/* Header */}
      <div className="border-b border-[#3b4b37]/50 pb-3 mb-3.5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-md bg-[#ffba20]/10 border border-[#ffba20]/30 flex items-center justify-center text-[#ffba20]">
            <span className="material-symbols-outlined text-sm">price_change</span>
          </span>
          <div>
            <h2 className="font-display text-sm md:text-base font-bold text-[#dfe2eb]">
              Live Pricing Feed
            </h2>
            <div className="text-[10px] font-mono-data text-[#b9ccb2]">
              DYNAMIC API COST MATRIX
            </div>
          </div>
        </div>
        <span className="font-mono-data text-[10px] text-[#00ff41] bg-[#00ff41]/10 px-2 py-0.5 rounded border border-[#00ff41]/30 font-semibold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41] animate-pulse"></span>
          k-NN LOOKUP
        </span>
      </div>

      {/* Interactive Hackathon Price Cut Simulator Banner */}
      <div className="mb-3 bg-gradient-to-r from-[#142018] to-[#1c2026] p-2.5 rounded-lg border border-[#00ff41]/30">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-mono-data text-[#72ff70] font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#00ff41]" />
            LIVE STAGE DEMO:
          </span>
          {isGpt4oSlashed && (
            <span className="text-[10px] font-mono-data text-[#00ff41] bg-[#00ff41]/20 px-1.5 py-0.5 rounded animate-pulse">
              50% CUT ACTIVE
            </span>
          )}
        </div>
        <p className="text-[10px] font-body text-[#b9ccb2]/90 mb-2">
          Simulate OpenAI slashing GPT-4o prices mid-hackathon to see neural routing recalculate thresholds in real time!
        </p>
        <button
          onClick={onSimulatePriceDrop}
          className={`w-full py-2 px-3 rounded text-xs font-mono-data font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            isGpt4oSlashed
              ? 'bg-[#353940] text-[#ffba20] border border-[#ffba20]/40 hover:bg-[#353940]/80'
              : 'bg-[#ffba20] text-[#271900] hover:bg-[#ffe082] shadow-[0_0_15px_rgba(254,183,0,0.3)]'
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          {isGpt4oSlashed ? 'RESTORE ORIGINAL PRICING' : '⚡ SIMULATE 50% PRICE CUT ON GPT-4o'}
        </button>
      </div>

      {/* Models Price Table */}
      {models.every((model) => !model.active) && (
        <div className="mb-3 rounded-lg border border-[#ffba20]/40 bg-[#ffba20]/10 p-3 text-[11px] font-mono-data text-[#ffda72]" role="status">
          No providers are active. Enable a provider or configure an API key before sending live traffic.
        </div>
      )}
      <ul className="space-y-2 font-mono-data text-[11px] flex-grow overflow-y-auto max-h-[340px] pr-1">
        {models.map((model) => {
          const isLlama = model.id === 'llama-3-8b';
          const isSlashed = model.id === 'gpt-4o' && isGpt4oSlashed;
          const isActive = model.active;

          return (
            <li
              key={model.id}
              className={`flex justify-between items-center p-2 rounded-lg border transition-all ${
                !isActive
                  ? 'opacity-40 bg-[#181c22]/30 border-[#3b4b37]/20 grayscale-[0.5]'
                  : isLlama
                  ? 'bg-[#00ff41]/[0.06] border-[#00ff41]/40 shadow-[0_0_15px_rgba(0,255,65,0.08)]'
                  : isSlashed
                  ? 'bg-[#ffba20]/[0.08] border-[#ffba20]/40'
                  : 'bg-[#181c22]/70 border-[#3b4b37]/40 hover:border-[#3b4b37]/80'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: isActive ? model.color : '#666' }}
                ></span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-[#dfe2eb] block">
                      {model.name}
                    </span>
                    {!isActive && (
                      <span className="text-[9px] font-mono-data bg-[#242b35] text-[#b9ccb2]/60 px-1 py-0.2 rounded border border-[#3b4b37]/30">
                        DISABLED
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#b9ccb2]/70 flex items-center gap-1.5">
                    {model.provider} • {model.latencyAvgMs}ms
                    <span className={`inline-flex items-center gap-1 ${!isActive ? 'text-[#869683]' : model.hasKey === false ? 'text-[#ffba20]' : 'text-[#00ff41]'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${!isActive ? 'bg-[#869683]' : model.hasKey === false ? 'bg-[#ffba20]' : 'bg-[#00ff41]'}`} />
                      {!isActive ? 'OFFLINE' : model.hasKey === false ? 'NO KEY' : 'ONLINE'}
                    </span>
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`font-bold ${
                    !isActive
                      ? 'text-[#b9ccb2]/40'
                      : isLlama
                      ? 'text-[#00ff41] glow-text-green text-sm'
                      : isSlashed
                      ? 'text-[#ffba20] text-sm'
                      : 'text-[#dfe2eb]'
                  }`}
                >
                  ${model.promptPricePerM.toFixed(2)}/M
                </div>
                <div className="text-[10px] text-[#b9ccb2]/60">
                  out: ${model.completionPricePerM.toFixed(2)}/M
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Footer Buttons */}
      <div className="mt-4 pt-3 border-t border-[#3b4b37]/40 flex flex-col gap-2">
        <button
          onClick={onOpenManageProviders}
          className="w-full bg-[#00ff41] text-[#003907] font-mono-data text-xs py-2.5 rounded-lg hover:bg-[#72ff70] active:scale-95 transition-all font-bold tracking-wider cursor-pointer shadow-[0_0_15px_rgba(0,255,65,0.2)] flex items-center justify-center gap-1.5"
        >
          <Sliders className="w-3.5 h-3.5" />
          MANAGE PROVIDERS & RATES
        </button>
      </div>
    </div>
  );
};
