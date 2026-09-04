import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, DollarSign, TrendingDown, ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Building, Landmark, FileSpreadsheet, Briefcase } from 'lucide-react';
import confetti from 'canvas-confetti';

export const RoiCalculator: React.FC = () => {
  const [monthlyQueries, setMonthlyQueries] = useState<number>(1000000); // 1M queries/month
  const [avgInputTokens, setAvgInputTokens] = useState<number>(650);
  const [avgOutputTokens, setAvgOutputTokens] = useState<number>(350);
  const [savingsRatio, setSavingsRatio] = useState<number>(0.72); // 72% realistic savings with Pareto routing
  const [activeTier, setActiveTier] = useState<'mid' | 'enterprise' | 'scale'>('enterprise');

  // Enterprise Tier presets
  const applyTierPreset = (tier: 'mid' | 'enterprise' | 'scale') => {
    setActiveTier(tier);
    if (tier === 'mid') {
      setMonthlyQueries(250000);
      setAvgInputTokens(450);
      setAvgOutputTokens(250);
    } else if (tier === 'enterprise') {
      setMonthlyQueries(1500000);
      setAvgInputTokens(800);
      setAvgOutputTokens(400);
    } else if (tier === 'scale') {
      setMonthlyQueries(6000000);
      setAvgInputTokens(1200);
      setAvgOutputTokens(600);
    }
  };

  // Pricing assumptions:
  // Baseline GPT-4o: $2.50 / M input, $10.00 / M output
  // Blended LangChain LLM Router: ~32% of baseline cost
  const naiveMonthlyInputCost = (monthlyQueries * avgInputTokens / 1_000_000) * 2.50;
  const naiveMonthlyOutputCost = (monthlyQueries * avgOutputTokens / 1_000_000) * 10.00;
  const naiveTotalMonthlySpend = naiveMonthlyInputCost + naiveMonthlyOutputCost;

  const neuralMonthlySpend = naiveTotalMonthlySpend * (1 - savingsRatio);
  const monthlySavings = naiveTotalMonthlySpend - neuralMonthlySpend;
  const annualSavings = monthlySavings * 12;
  const quarterlySavings = monthlySavings * 3;

  const handleCelebrate = () => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const formatMoney = (val: number) => {
    return '$' + Math.round(val).toLocaleString('en-US');
  };

  return (
    <section id="roi-calculator" className="py-12 border-t border-[#3b4b37]/50 relative">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#00ff41]/10 border border-[#00ff41]/30 text-xs font-mono-data text-[#00ff41] mb-3 shadow-[0_0_15px_rgba(0,255,65,0.15)]">
          <Landmark className="w-3.5 h-3.5" />
          ENTERPRISE FP&A BUDGET MODELING & FORECASTING
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#dfe2eb] mb-3">
          Corporate AI Budget ROI & Savings Calculator
        </h2>
        <p className="font-body text-sm sm:text-base text-[#b9ccb2]">
          Quantify how much your corporate engineering budget is retained by triaging workloads across dynamic Pareto frontier pricing.
        </p>

        {/* Enterprise Company Size Preset Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
          <span className="text-xs font-mono-data text-[#b9ccb2] mr-1 flex items-center gap-1">
            <Building className="w-3.5 h-3.5 text-[#00ff41]" /> Company Profile:
          </span>
          <button
            onClick={() => applyTierPreset('mid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono-data transition-all cursor-pointer border ${
              activeTier === 'mid'
                ? 'bg-[#00ff41]/15 text-[#00ff41] border-[#00ff41]/60 font-bold shadow-[0_0_12px_rgba(0,255,65,0.2)]'
                : 'bg-[#14181f] text-[#b9ccb2] border-[#3b4b37]/60 hover:text-white'
            }`}
          >
            Growth Stage (250k req/mo)
          </button>
          <button
            onClick={() => applyTierPreset('enterprise')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono-data transition-all cursor-pointer border ${
              activeTier === 'enterprise'
                ? 'bg-[#00ff41]/15 text-[#00ff41] border-[#00ff41]/60 font-bold shadow-[0_0_12px_rgba(0,255,65,0.2)]'
                : 'bg-[#14181f] text-[#b9ccb2] border-[#3b4b37]/60 hover:text-white'
            }`}
          >
            Mid-Market / Enterprise (1.5M req/mo)
          </button>
          <button
            onClick={() => applyTierPreset('scale')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono-data transition-all cursor-pointer border ${
              activeTier === 'scale'
                ? 'bg-[#00ff41]/15 text-[#00ff41] border-[#00ff41]/60 font-bold shadow-[0_0_12px_rgba(0,255,65,0.2)]'
                : 'bg-[#14181f] text-[#b9ccb2] border-[#3b4b37]/60 hover:text-white'
            }`}
          >
            Global Scale / Fortune 500 (6M+ req/mo)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto items-center">
        {/* Controls Column (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 sm:p-8 border border-[#3b4b37]/70 bg-[#14181f]/80 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
          <div className="space-y-6">
            {/* Control 1: Monthly Query Volume */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-mono-data text-[#dfe2eb] font-semibold flex items-center gap-1.5">
                  <span>MONTHLY ENTERPRISE QUERY VOLUME</span>
                </label>
                <span className="text-sm font-mono-data font-bold text-[#00ff41] bg-[#00ff41]/10 px-2.5 py-0.5 rounded border border-[#00ff41]/30">
                  {monthlyQueries.toLocaleString()} calls / mo
                </span>
              </div>
              <input
                type="range"
                min="50000"
                max="10000000"
                step="50000"
                value={monthlyQueries}
                onChange={(e) => {
                  setMonthlyQueries(Number(e.target.value));
                  setActiveTier('enterprise');
                }}
                className="w-full h-2 bg-[#1c2026] rounded-lg appearance-none cursor-pointer accent-[#00ff41]"
              />
              <div className="flex justify-between text-[10px] font-mono-data text-[#b9ccb2]/60 mt-1">
                <span>50k (Startup)</span>
                <span>1.5M (Enterprise)</span>
                <span>10M (Global Scale)</span>
              </div>
            </div>

            {/* Control 2: Average Input Tokens */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-mono-data text-[#dfe2eb] font-semibold">
                  AVG. INPUT TOKENS / PROMPT (INGESTION)
                </label>
                <span className="text-xs font-mono-data font-bold text-[#00e5ff] bg-[#00e5ff]/10 px-2 py-0.5 rounded border border-[#00e5ff]/30">
                  {avgInputTokens.toLocaleString()} tokens
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="4000"
                step="50"
                value={avgInputTokens}
                onChange={(e) => setAvgInputTokens(Number(e.target.value))}
                className="w-full h-2 bg-[#1c2026] rounded-lg appearance-none cursor-pointer accent-[#00e5ff]"
              />
            </div>

            {/* Control 3: Average Output Tokens */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-mono-data text-[#dfe2eb] font-semibold">
                  AVG. OUTPUT TOKENS / COMPLETION (GENERATION)
                </label>
                <span className="text-xs font-mono-data font-bold text-[#ffba20] bg-[#ffba20]/10 px-2 py-0.5 rounded border border-[#ffba20]/30">
                  {avgOutputTokens.toLocaleString()} tokens
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="2000"
                step="50"
                value={avgOutputTokens}
                onChange={(e) => setAvgOutputTokens(Number(e.target.value))}
                className="w-full h-2 bg-[#1c2026] rounded-lg appearance-none cursor-pointer accent-[#ffba20]"
              />
            </div>

            {/* Routing Aggressiveness Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-mono-data text-[#dfe2eb] font-semibold">
                  TARGET RETENTION THRESHOLD (ROUTER EFFICIENCY)
                </label>
                <span className="text-xs font-mono-data font-bold text-[#00ff41] bg-[#00ff41]/10 px-2 py-0.5 rounded border border-[#00ff41]/30">
                  {(savingsRatio * 100).toFixed(0)}% Preserved Budget
                </span>
              </div>
              <input
                type="range"
                min="0.40"
                max="0.85"
                step="0.01"
                value={savingsRatio}
                onChange={(e) => setSavingsRatio(Number(e.target.value))}
                className="w-full h-2 bg-[#1c2026] rounded-lg appearance-none cursor-pointer accent-[#00ff41]"
              />
              <div className="flex justify-between text-[10px] font-mono-data text-[#b9ccb2]/60 mt-1">
                <span>Conservative (40%)</span>
                <span>Balanced Production (72%)</span>
                <span>Aggressive Pareto (85%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Card Column (5 cols) */}
        <div className="lg:col-span-5">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="rounded-2xl p-6 sm:p-8 bg-gradient-to-b from-[#102216]/95 via-[#0b1016]/95 to-[#102216]/95 border-2 border-[#00ff41]/50 shadow-[0_0_40px_rgba(0,255,65,0.18)] flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-mono-data text-[#72ff70] font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#00ff41]" />
                  PROJECTED ANNUAL RETAINED BUDGET
                </span>
                <span className="text-[10px] font-mono-data bg-[#00ff41]/15 text-[#00ff41] px-2 py-0.5 rounded border border-[#00ff41]/30 font-bold">
                  FP&A VERIFIED
                </span>
              </div>

              <div className="font-display text-4xl sm:text-5xl font-extrabold text-[#00ff41] glow-text-green tracking-tight mb-2">
                {formatMoney(annualSavings)}
                <span className="text-xs font-mono-data text-[#b9ccb2] block font-normal mt-1">
                  / year retained in company treasury
                </span>
              </div>

              <div className="space-y-2.5 my-6 pt-4 border-t border-[#3b4b37]/50 font-mono-data text-xs">
                <div className="flex justify-between text-[#b9ccb2]">
                  <span>Naive Unmanaged Frontier Spend:</span>
                  <span className="text-[#ffba20] font-bold">{formatMoney(naiveTotalMonthlySpend)} / mo</span>
                </div>
                <div className="flex justify-between text-[#b9ccb2]">
                  <span>With LangChain LLM Router:</span>
                  <span className="text-[#00e5ff] font-bold">{formatMoney(neuralMonthlySpend)} / mo</span>
                </div>
                <div className="flex justify-between text-[#dfe2eb] font-bold pt-2 border-t border-[#3b4b37]/40">
                  <span>Quarterly FP&A Surplus:</span>
                  <span className="text-[#00ff41] glow-text-green">+{formatMoney(quarterlySavings)} / Qtr</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCelebrate}
              className="w-full py-3.5 rounded-xl bg-[#00ff41] text-[#003907] font-mono-data font-extrabold text-xs tracking-wider hover:bg-[#72ff70] active:scale-95 transition-all shadow-[0_0_20px_rgba(0,255,65,0.3)] flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Briefcase className="w-4 h-4" />
              LOCK IN ENTERPRISE ALLOCATION
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

