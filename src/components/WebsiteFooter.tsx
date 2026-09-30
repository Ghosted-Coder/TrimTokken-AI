import React from 'react';
import { Activity, ArrowUpRight } from 'lucide-react';
import { TrimTokenLogo } from './TrimTokenLogo';
import { Skiper40 } from './ui/skiper-ui/skiper40';

interface WebsiteFooterProps {
  onNavigateTab: (tab: 'dashboard' | 'simulator' | 'policies' | 'analytics' | 'python' | 'docs' | 'routing-log') => void;
}

export const WebsiteFooter: React.FC<WebsiteFooterProps> = ({ onNavigateTab }) => {
  return (
    <footer className="mt-20 border-t border-[#3b4b37]/60 bg-[#0c1015]/95 backdrop-blur-lg pt-12 pb-10 text-xs font-mono-data text-[#b9ccb2]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-[#101b2b] border border-[#00C9E8]/40 flex items-center justify-center p-1 shadow-[0_0_15px_rgba(0,201,232,0.2)]">
                <TrimTokenLogo size="xs" variant="icon-only" />
              </div>
              <span className="font-display text-base font-bold text-white tracking-tight flex items-center gap-1">
                <span>TrimToken</span>
                <span className="text-[#00e5ff]">AI</span>
              </span>
            </div>
            <p className="font-body text-xs text-[#b9ccb2]/80 leading-relaxed mb-4">
              Autonomous cost-spectrum gateway and Pareto-optimal router for high-scale enterprise LLM traffic.
            </p>
            <div className="flex items-center gap-2 text-[10px] text-[#00e5ff] bg-[#00e5ff]/10 px-2.5 py-1 rounded-full border border-[#00e5ff]/30 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-pulse"></span>
              DEMO GATEWAY STATUS: ONLINE
            </div>
          </div>

          {/* Col 2: Platform Modules */}
          <div>
            <h4 className="font-bold text-[#dfe2eb] uppercase tracking-wider mb-3">
              PLATFORM_MODULES
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateTab('dashboard')}
                  className="hover:text-[#00ff41] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Interactive Playground & Stream
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('simulator')}
                  className="hover:text-[#00ff41] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Traffic Burst Simulator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('policies')}
                  className="hover:text-[#00ff41] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Pareto Threshold Tuning
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('analytics')}
                  className="hover:text-[#00ff41] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Cost & Latency Analytics
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('routing-log')}
                  className="hover:text-[#00e5ff] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Routing Log Table Demo
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Developer Resources */}
          <div>
            <h4 className="font-bold text-[#dfe2eb] uppercase tracking-wider mb-3">
              DEVELOPER_RESOURCES
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateTab('docs')}
                  className="hover:text-[#00e5ff] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  OpenAI Drop-In Proxy Specs <ArrowUpRight className="w-3 h-3 text-[#00e5ff]" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('python')}
                  className="hover:text-[#00e5ff] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Python Lightweight SDK MVP
                </button>
              </li>
              <li>
                <a
                  href="#roi-calculator"
                  className="hover:text-[#ffba20] transition-colors flex items-center gap-1"
                >
                  Enterprise ROI Calculator
                </a>
              </li>
              <li>
                <a
                  href="#architecture"
                  className="hover:text-[#00ff41] transition-colors flex items-center gap-1"
                >
                  k-NN Routing Architecture
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Quickstart Command */}
          <div>
            <h4 className="font-bold text-[#dfe2eb] uppercase tracking-wider mb-3">
              QUICKSTART_PROXY
            </h4>
            <div className="bg-[#14181f] p-3 rounded-lg border border-[#3b4b37]/70 mb-2">
              <span className="text-[10px] text-[#b9ccb2]/60 block mb-1"># Shell installation</span>
              <code className="text-[#00ff41] text-[11px] block">
                pip install trimtoken-ai
              </code>
            </div>
            <p className="text-[10px] text-[#b9ccb2]/70">
              Compatible with OpenAI-compatible clients that support a custom base URL.
            </p>
          </div>
        </div>

        <div className="mb-8 border-y border-[#3b4b37]/40 py-5">
          <div className="mb-3 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-[#869683]">
            QUICK_NAVIGATION // HOVER_TO_EXPLORE
          </div>
          <Skiper40 />
        </div>

        <div className="pt-6 border-t border-[#3b4b37]/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-[#b9ccb2]/60">
          <div>
            © 2026 TrimToken AI Technologies. MIT Licensed Open Core.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-[#00ff41]" /> Demo environment
            </span>
            <span>•</span>
            <span>Zero Data Logging Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
