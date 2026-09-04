import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Zap, Network, ShieldCheck, ArrowRight, Layers, Database, Lock } from 'lucide-react';

export const ArchitectureSection: React.FC = () => {
  const pillars = [
    {
      icon: Cpu,
      title: 'Fine-tuned Qwen Routing Classifier',
      tag: '< 1.2ms LATENCY',
      color: '#00ff41',
      borderColor: 'border-[#00ff41]/30',
      bgColor: 'bg-[#00ff41]/10',
      description:
        'Your locally trained Qwen model evaluates each incoming question, returns only a destination model and routing reason, and never generates the user-facing answer.',
      badge: 'Qwen LoRA Adapter • Routing Only',
    },
    {
      icon: Layers,
      title: 'Dynamic Pareto Arbitrage',
      tag: 'PRICE-AWARE',
      color: '#ffba20',
      borderColor: 'border-[#ffba20]/30',
      bgColor: 'bg-[#ffba20]/10',
      description:
        'Continuously tracks live provider pricing changes across OpenAI, Anthropic, Google, and Meta models to automatically re-weight traffic toward the most cost-efficient candidate meeting target accuracy.',
      badge: 'Real-time Matrix Updates',
    },
    {
      icon: Network,
      title: 'Resilient Failover Mesh',
      tag: '99.99% UPSTREAM SLA',
      color: '#00e5ff',
      borderColor: 'border-[#00e5ff]/30',
      bgColor: 'bg-[#00e5ff]/10',
      description:
        'Upstream 503 high-demand or 429 rate-limit spikes trigger microsecond cascading failover to secondary model candidates or synthetic grounders without dropping client connections.',
      badge: 'Zero User Disruption',
    },
    {
      icon: Lock,
      title: '1-Line OpenAI Drop-in Proxy',
      tag: 'ZERO REFACTOR',
      color: '#a855f7',
      borderColor: 'border-[#a855f7]/30',
      bgColor: 'bg-[#a855f7]/10',
      description:
        'Standard OpenAI-compatible REST format. Simply swap `base_url="https://api.trimtoken.ai/v1"` into your existing LangChain, LlamaIndex, or raw client codebases.',
      badge: 'OpenAI / Anthropic Compatible',
    },
  ];

  return (
    <section id="architecture" className="py-14 border-t border-[#3b4b37]/50 relative">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-xs font-mono-data text-[#00e5ff] mb-3">
          <Network className="w-3.5 h-3.5" />
          SYSTEM ARCHITECTURE
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#dfe2eb] mb-3">
          Built for Production-Grade Throughput
        </h2>
        <p className="font-body text-sm sm:text-base text-[#b9ccb2]">
          How TrimToken AI achieves sub-millisecond dispatching, dynamic price optimization, and resilient multi-cloud execution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <motion.div
              key={pillar.title}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="glass-panel rounded-2xl p-6 sm:p-7 border border-[#3b4b37]/60 bg-[#14181f]/70 flex flex-col justify-between hover:border-[#b9ccb2]/40 transition-all shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl ${pillar.bgColor} border ${pillar.borderColor} flex items-center justify-center`} style={{ color: pillar.color }}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono-data font-bold px-2 py-0.5 rounded border" style={{ color: pillar.color, borderColor: pillar.color + '40', backgroundColor: pillar.color + '15' }}>
                    {pillar.tag}
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold text-[#dfe2eb] mb-2">
                  {pillar.title}
                </h3>
                <p className="font-body text-xs sm:text-sm text-[#b9ccb2] leading-relaxed mb-4">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#3b4b37]/40 flex items-center justify-between">
                <span className="text-[11px] font-mono-data text-[#dfe2eb]/80 font-medium">
                  {pillar.badge}
                </span>
                <span className="text-xs font-mono-data font-bold" style={{ color: pillar.color }}>
                  0{idx + 1}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
