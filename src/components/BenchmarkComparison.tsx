import React from 'react';
import { motion } from 'motion/react';
import { Award, Zap, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

export const BenchmarkComparison: React.FC = () => {
  const benchmarkRows = [
    {
      domain: 'Routine Classification & Extraction',
      naiveApproach: 'GPT-4o ($12.50 / M tok)',
      neuralApproach: 'Llama 3 8B / Gemini 3.1 Lite ($0.20 / M tok)',
      qualityRetention: '99.4%',
      costReduction: '-98.4%',
      latencyAdvantage: '3.4x Faster',
    },
    {
      domain: 'Conversational Dialogue & Q&A',
      naiveApproach: 'Claude 3.5 Sonnet ($18.00 / M tok)',
      neuralApproach: 'Gemini 3.6 Flash ($0.50 / M tok)',
      qualityRetention: '98.1%',
      costReduction: '-97.2%',
      latencyAdvantage: '2.8x Faster',
    },
    {
      domain: 'Technical Logic & Multi-Lingual Reasoning',
      naiveApproach: 'GPT-4o ($12.50 / M tok)',
      neuralApproach: 'Qwen 2.5 72B ($0.35 / M tok)',
      qualityRetention: '99.1%',
      costReduction: '-97.2%',
      latencyAdvantage: '2.6x Faster',
    },
    {
      domain: 'Full-Stack Code Synthesis & Debugging',
      naiveApproach: 'Claude 3.5 Sonnet ($18.00 / M tok)',
      neuralApproach: 'Qwen 2.5 Coder / DeepSeek-V3 ($0.20 / M tok)',
      qualityRetention: '98.7%',
      costReduction: '-98.9%',
      latencyAdvantage: '3.1x Faster',
    },
    {
      domain: 'Complex Code Synthesis & Architecture',
      naiveApproach: 'GPT-4o ($12.50 / M tok)',
      neuralApproach: 'Frontier Tier Routed ($12.50 / M tok)',
      qualityRetention: '100.0%',
      costReduction: '0.0% (Frontier Preserved)',
      latencyAdvantage: '1.0x (Optimal Depth)',
    },
    {
      domain: 'Multi-Step Mathematical Logic',
      naiveApproach: 'GPT-4o Only',
      neuralApproach: 'k-NN Dynamic Tier Spectrum',
      qualityRetention: '97.8%',
      costReduction: '-71.5%',
      latencyAdvantage: '2.1x Faster',
    },
  ];

  return (
    <section id="benchmarks" className="py-14 border-t border-[#3b4b37]/50 relative">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#72ff70]/10 border border-[#00ff41]/30 text-xs font-mono-data text-[#72ff70] mb-3">
          <Award className="w-3.5 h-3.5 text-[#00ff41]" />
          QUALITY RETENTION BENCHMARKS
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#dfe2eb] mb-3">
          Zero Quality Sacrifice Across Standard Suites
        </h2>
        <p className="font-body text-sm sm:text-base text-[#b9ccb2]">
          Frontier accuracy preserved on complex reasoning tasks while routine queries are routed by LangChain LLM at commodity inference prices.
        </p>
      </div>

      <div className="max-w-5xl mx-auto glass-panel rounded-2xl overflow-hidden border border-[#3b4b37]/70 shadow-lg bg-[#14181f]/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-data border-collapse">
            <thead>
              <tr className="bg-[#10141a] text-[#b9ccb2] border-b border-[#3b4b37]/60">
                <th className="py-3.5 px-4 font-semibold">WORKLOAD DOMAIN</th>
                <th className="py-3.5 px-4 font-semibold">NAIVE APPROACH</th>
                <th className="py-3.5 px-4 font-semibold">LANGCHAIN LLM ROUTER</th>
                <th className="py-3.5 px-4 font-semibold text-center">QUALITY RETENTION</th>
                <th className="py-3.5 px-4 font-semibold text-right">COST DELTA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3b4b37]/40 text-[#dfe2eb]">
              {benchmarkRows.map((row, idx) => (
                <tr key={row.domain} className="hover:bg-[#1c222b]/50 transition-colors">
                  <td className="py-4 px-4 font-bold text-white flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41]"></span>
                    {row.domain}
                  </td>
                  <td className="py-4 px-4 text-[#ffba20]">{row.naiveApproach}</td>
                  <td className="py-4 px-4 text-[#00e5ff]">{row.neuralApproach}</td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[#00ff41] bg-[#00ff41]/10 px-2 py-0.5 rounded border border-[#00ff41]/30 font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      {row.qualityRetention}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right font-bold text-[#72ff70] glow-text-green">
                    {row.costReduction}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
