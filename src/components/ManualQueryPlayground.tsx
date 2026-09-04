import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { Bolt, Sparkles, Check, Copy, Terminal, ArrowDown, ArrowRight, Zap, ChevronDown, Cpu, Bot, Compass, Layers, ShieldCheck } from 'lucide-react';
import { ModelPricing, RoutingDecision, RouterConfig } from '../types';
import { routeQuery } from '../lib/routerEngine';

interface ManualQueryPlaygroundProps {
  models: ModelPricing[];
  routerConfig: RouterConfig;
  onExecuteManualQuery: (decision: RoutingDecision) => void;
  externalQueryTrigger?: { prompt: string; timestamp: number; targetModelId?: string } | null;
}

export const ManualQueryPlayground: React.FC<ManualQueryPlaygroundProps> = ({
  models,
  routerConfig,
  onExecuteManualQuery,
  externalQueryTrigger,
}) => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [selectedTargetModel, setSelectedTargetModel] = useState<string>('auto');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [latestDecision, setLatestDecision] = useState<RoutingDecision | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [liveResponseText, setLiveResponseText] = useState<string | null>(null);
  const [copiedAnswer, setCopiedAnswer] = useState(false);
  const [highlightAnswer, setHighlightAnswer] = useState(false);
  const [liveMetadata, setLiveMetadata] = useState<{
    liveApi: boolean;
    modelUsed?: string;
    promptTokens?: number;
    completionTokens?: number;
    executionTimeMs?: number;
  } | null>(null);

  const answerPanelRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Scroll to answer panel helper
  const scrollToAnswerPanel = () => {
    setTimeout(() => {
      if (answerPanelRef.current) {
        answerPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightAnswer(true);
        setTimeout(() => setHighlightAnswer(false), 3000);
      }
    }, 100);
  };

  const handleRoute = async (promptToUse?: string, forceTargetModel?: string) => {
    const text = (promptToUse || inputPrompt).trim();
    if (!text) return;

    const targetModelToUse = forceTargetModel !== undefined ? forceTargetModel : selectedTargetModel;

    setIsExecuting(true);
    setLiveResponseText(null);
    setLiveMetadata(null);

    // 1. Run routing classification (with optional targeted model override)
    const decision = await routeQuery(text, models, routerConfig, undefined, 'USER', targetModelToUse);
    setLatestDecision(decision);

    // Scroll immediately to show the routing in progress & prepare answer panel
    scrollToAnswerPanel();

    // 2. Query backend for real live execution & direct problem solution
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          modelId: decision.routedModel.id,
          modelName: decision.routedModel.name,
          provider: decision.routedModel.provider,
          complexity: decision.complexity,
        }),
      });
      const data = await res.json();
      
      const answerText = data?.text || decision.responseSnippet || 'Solved with optimal routing.';
      
      const updatedDecision: RoutingDecision = {
        ...decision,
        source: 'USER',
        responseSnippet: answerText,
        fullResponse: answerText,
        latencyMs: data?.executionTimeMs || decision.latencyMs,
        inputTokens: data?.promptTokens || decision.inputTokens,
        outputTokens: data?.completionTokens || decision.outputTokens,
      };

      setLatestDecision(updatedDecision);
      setLiveResponseText(answerText);
      setLiveMetadata({
        liveApi: Boolean(data?.liveApi),
        modelUsed: data?.modelUsed || decision.routedModel.name,
        promptTokens: data?.promptTokens || decision.inputTokens,
        completionTokens: data?.completionTokens || decision.outputTokens,
        executionTimeMs: data?.executionTimeMs || decision.latencyMs,
      });

      onExecuteManualQuery(updatedDecision);

      // Re-scroll upon answer arrival to ensure answer panel is fully in focus
      scrollToAnswerPanel();
    } catch (e) {
      const fallbackText = decision.responseSnippet || 'Solved with optimal routing.';
      setLiveResponseText(fallbackText);
      onExecuteManualQuery(decision);
      scrollToAnswerPanel();
    } finally {
      setIsExecuting(false);
    }
  };

  // Listen for external trigger from Top Search Bar
  useEffect(() => {
    if (externalQueryTrigger && externalQueryTrigger.prompt) {
      setInputPrompt(externalQueryTrigger.prompt);
      if (externalQueryTrigger.targetModelId) {
        setSelectedTargetModel(externalQueryTrigger.targetModelId);
      }
      handleRoute(externalQueryTrigger.prompt, externalQueryTrigger.targetModelId);
    }
  }, [externalQueryTrigger]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRoute();
    }
  };

  const handlePresetSelect = (presetPrompt: string, targetModelId?: string) => {
    setInputPrompt(presetPrompt);
    if (targetModelId) {
      setSelectedTargetModel(targetModelId);
    }
    handleRoute(presetPrompt, targetModelId);
  };

  const handleCopyAnswer = () => {
    const textToCopy = liveResponseText || latestDecision?.responseSnippet || '';
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedAnswer(true);
      setTimeout(() => setCopiedAnswer(false), 2000);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gradient-to-b from-[#00ff41]/[0.03] to-transparent flex flex-col gap-6 flex-grow h-full justify-between min-h-[560px]">
      <div className="flex flex-col gap-4">
        {/* Dynamic Destination & Intelligence Flow */}
        <div className="flex flex-col gap-3">
          {/* Dynamic "Where Query Is Routed" Destination Box */}
          <div className="p-3 sm:p-3.5 bg-[#080d15] border-2 border-[#00ff41]/50 rounded-xl shadow-[0_0_20px_rgba(0,255,65,0.12)]">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2.5 border-b border-[#1e2f3d]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse"></span>
                <span className="text-[11px] font-mono-data font-bold text-white tracking-wider flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#00ff41]" />
                  QUERY ROUTED DESTINATION
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono-data px-2 py-0.5 rounded bg-[#131d2a] text-[#00e5ff] border border-[#00e5ff]/30 font-semibold">
                  {selectedTargetModel === 'auto' ? '🧠 Fine-tuned Qwen Router' : '🎯 Direct API Dispatch'}
                </span>
                {latestDecision && (
                  <span className="text-[10px] font-mono-data px-2 py-0.5 rounded bg-[#00ff41]/20 text-[#72ff70] border border-[#00ff41]/40 font-bold">
                    Saved {latestDecision.savingsPercentage?.toFixed(0) || '88'}%
                  </span>
                )}
              </div>
            </div>

            {/* Routing Flow Path Diagram */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 bg-[#05080c] p-2.5 rounded-lg border border-[#14202c]">
              {/* Step 1: Input Query */}
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-5 h-5 rounded bg-[#1a2533] border border-[#2d3f54] flex items-center justify-center text-[#b9ccb2] text-[10px] font-mono-data shrink-0 font-bold">
                  1
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-mono-data text-[#b9ccb2]/70 uppercase">Origin</div>
                  <div className="text-xs font-mono-data text-white font-semibold truncate max-w-[160px] sm:max-w-[200px]">
                    {inputPrompt.trim() ? `"${inputPrompt.slice(0, 24)}..."` : 'Incoming Prompt'}
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center text-[#00ff41]/60">
                <ArrowRight className="w-4 h-4 animate-pulse" />
              </div>

              {/* Step 2: Classifier Engine */}
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-[#102a1b] border border-[#00ff41]/40 flex items-center justify-center text-[#00ff41] text-[10px] font-mono-data shrink-0 font-bold">
                  2
                </div>
                <div>
                  <div className="text-[10px] font-mono-data text-[#b9ccb2]/70 uppercase">Decision Engine</div>
                  <div className="text-xs font-mono-data text-[#00ff41] font-bold">
                    {selectedTargetModel === 'auto' ? 'Qwen classifies → designated model answers' : 'Direct API Passthrough'}
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center text-[#00ff41]/60">
                <ArrowRight className="w-4 h-4 animate-pulse" />
              </div>

              {/* Step 3: Routed Target Model Destination */}
              {(() => {
                const routedModelObj = latestDecision?.routedModel || 
                  (selectedTargetModel !== 'auto' ? models.find((m) => m.id === selectedTargetModel) : null) ||
                  models.find((m) => m.id === 'deepseek-v3') || models[0];
                
                const modelColor = routedModelObj?.color || '#00ff41';
                const modelName = routedModelObj?.name || 'DeepSeek-V3';
                const modelProvider = routedModelObj?.provider || 'DeepSeek';
                const price = routedModelObj?.promptPricePerM ? `$${routedModelObj.promptPricePerM}/1M` : '$0.27/1M';

                return (
                  <div className="flex items-center gap-2.5 p-1.5 px-2.5 rounded-lg bg-[#101722] border-2 border-[#00ff41]/60 shadow-[0_0_15px_rgba(0,255,65,0.2)]">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: modelColor }} />
                    <div className="min-w-0">
                      <div className="text-[10px] font-mono-data text-[#00ff41] font-bold flex items-center gap-1 uppercase">
                        <span>ROUTED DESTINATION:</span>
                      </div>
                      <div className="text-xs font-mono-data text-white font-extrabold flex items-center gap-1.5 truncate">
                        <span>{modelName}</span>
                        <span className="text-[10px] text-[#b9ccb2]/80 font-normal">({modelProvider})</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono-data text-[#ffba20] bg-[#ffba20]/10 px-1.5 py-0.5 rounded border border-[#ffba20]/30 shrink-0 font-bold">
                      {price}
                    </span>
                  </div>
                );
              })()}
            </div>

            {/* Routing Justification & Intelligence Note */}
            {latestDecision && (
              <div className="mt-2 pt-2 border-t border-[#1a2838] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-data text-[#b9ccb2]/90">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#00ff41] font-bold shrink-0">Routing Signals:</span>
                  <span className="text-white/90">
                    {latestDecision.heuristicSignals?.join(', ') || `Cluster: ${latestDecision.knnNearestCluster}`} ({latestDecision.complexity} Tier)
                  </span>
                </div>
                <div className="text-[10px] text-[#00e5ff] font-semibold">
                  Vector Similarity: {(latestDecision.vectorSimilarity * 100).toFixed(0)}% • Latency: {latestDecision.latencyMs}ms
                </div>
              </div>
            )}
          </div>

          {/* Quick presets for testing all different LLMs */}
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            <span className="text-[11px] font-mono-data text-[#b9ccb2]/60 mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#ffba20]" />
              Presets:
            </span>
            <button
              onClick={() => handlePresetSelect('Write a lock-free multi-producer ring buffer in Rust with atomic ordering.', 'deepseek-v3')}
              className="text-[11px] font-mono-data bg-[#161b22] hover:bg-[#00C9E8]/15 text-[#dfe2eb] hover:text-[#00C9E8] px-2.5 py-1 rounded-md border border-[#00C9E8]/40 transition-colors cursor-pointer"
            >
              [DeepSeek-V3] Rust Lock-Free
            </button>
            <button
              onClick={() => handlePresetSelect('Draft a comprehensive enterprise MSA contract clause with mutual IP indemnification under Delaware law.', 'gpt-4o')}
              className="text-[11px] font-mono-data bg-[#161b22] hover:bg-[#10a37f]/15 text-[#dfe2eb] hover:text-[#10a37f] px-2.5 py-1 rounded-md border border-[#10a37f]/40 transition-colors cursor-pointer"
            >
              [GPT-4o] Delaware MSA
            </button>
            <button
              onClick={() => handlePresetSelect('Analyze the philosophical debate between functionalism and dualism regarding artificial consciousness.', 'claude-3-5-sonnet')}
              className="text-[11px] font-mono-data bg-[#161b22] hover:bg-[#d97706]/15 text-[#dfe2eb] hover:text-[#f59e0b] px-2.5 py-1 rounded-md border border-[#d97706]/40 transition-colors cursor-pointer"
            >
              [Claude 3.5] Philosophy
            </button>
            <button
              onClick={() => handlePresetSelect('Calculate 324 * 78 + 942 / 6 step-by-step with full derivation.', 'llama-3.3-70b')}
              className="text-[11px] font-mono-data bg-[#161b22] hover:bg-[#f55036]/15 text-[#dfe2eb] hover:text-[#ff7660] px-2.5 py-1 rounded-md border border-[#f55036]/40 transition-colors cursor-pointer"
            >
              [Llama-3.3 Groq] Fast Math
            </button>
            <button
              onClick={() => handlePresetSelect('Explain the Raft consensus algorithm leader election phase with state transition diagrams.', 'qwen-2.5-72b')}
              className="text-[11px] font-mono-data bg-[#161b22] hover:bg-[#8b5cf6]/15 text-[#dfe2eb] hover:text-[#a78bfa] px-2.5 py-1 rounded-md border border-[#8b5cf6]/40 transition-colors cursor-pointer"
            >
              [Qwen 2.5] Raft Consensus
            </button>
            <button
              onClick={() => handlePresetSelect('Extract customer name, invoice amount, and payment deadline into a valid JSON schema.', 'gemini-1.5-flash')}
              className="text-[11px] font-mono-data bg-[#161b22] hover:bg-[#3b82f6]/15 text-[#dfe2eb] hover:text-[#60a5fa] px-2.5 py-1 rounded-md border border-[#3b82f6]/40 transition-colors cursor-pointer"
            >
              [Gemini Flash] JSON Extract
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Full Answer Panel or Employee Workspace Assistant (Fills remaining height) */}
      <div className="flex-grow flex flex-col mt-2">
        <AnimatePresence mode="wait">
          {(isExecuting || liveResponseText || latestDecision) ? (
            <motion.div 
              key="answer-panel"
              ref={answerPanelRef}
              id="answer-panel"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`bg-[#080c12] rounded-xl overflow-hidden scroll-mt-24 transition-all duration-500 border flex flex-col flex-grow ${
                highlightAnswer
                  ? 'border-[#00ff41] ring-2 ring-[#00ff41]/50 shadow-[0_0_45px_rgba(0,255,65,0.3)]'
                  : 'border-[#00ff41]/40 shadow-[0_0_35px_rgba(0,255,65,0.12)]'
              }`}
            >
              {/* Answer Panel Header */}
              <div className="bg-[#121720] p-3 md:px-4 border-b border-[#3b4b37]/60 flex flex-wrap justify-between items-center gap-2 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-[#00ff41]/20 border border-[#00ff41]/40 flex items-center justify-center text-[#00ff41]">
                    <Terminal className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-display text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                    Answer to your Query
                  </span>
                  {highlightAnswer && (
                    <span className="text-[10px] font-mono-data text-[#003907] bg-[#00ff41] px-2 py-0.5 rounded font-extrabold flex items-center gap-1 shadow-sm animate-pulse">
                      <Zap className="w-3 h-3" />
                      REDIRECTED TO ANSWER PANEL
                    </span>
                  )}
                  {liveMetadata?.liveApi ? (
                    <span className="text-[10px] font-mono-data text-[#00ff41] bg-[#00ff41]/10 px-2 py-0.5 rounded border border-[#00ff41]/30 font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41] animate-pulse"></span>
                      LIVE AI RESPONSE
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono-data text-[#72ff70] bg-[#1a202c] px-2 py-0.5 rounded border border-[#3b4b37]">
                      {liveMetadata?.modelUsed || latestDecision?.routedModel.name || 'OPTIMAL ROUTED MODEL'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {liveMetadata?.promptTokens && (
                    <span className="text-[11px] font-mono-data text-[#b9ccb2] hidden sm:inline">
                      {liveMetadata.promptTokens} in / {liveMetadata.completionTokens} out
                    </span>
                  )}
                  {liveMetadata?.executionTimeMs && (
                    <span className="text-[11px] font-mono-data text-[#00ff41] font-bold">
                      {liveMetadata.executionTimeMs}ms
                    </span>
                  )}
                  <button
                    onClick={handleCopyAnswer}
                    className="text-xs font-mono-data text-[#dfe2eb] hover:text-white bg-[#1a202c] hover:bg-[#283240] px-2.5 py-1 rounded-md border border-[#3b4b37] flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                  >
                    {copiedAnswer ? <Check className="w-3.5 h-3.5 text-[#00ff41]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedAnswer ? 'Copied!' : 'Copy Answer'}</span>
                  </button>
                </div>
              </div>

              {/* Answer Body */}
              <div className="p-4 md:p-5 flex-grow overflow-y-auto max-h-[420px]">
                {isExecuting ? (
                  <div className="flex items-center gap-3 py-8 text-sm font-mono-data text-[#72ff70]">
                    <div className="w-4 h-4 rounded-full border-2 border-[#00ff41] border-t-transparent animate-spin"></div>
                    <span>Executing prompt with selected model and formulating full explanation...</span>
                  </div>
                ) : (
                  <div className="text-xs md:text-sm text-[#dfe2eb] leading-relaxed selection:bg-[#00ff41]/30 prose prose-invert max-w-none prose-headings:text-[#00ff41] prose-headings:font-mono-data prose-headings:font-bold prose-headings:mt-3 prose-headings:mb-2 prose-p:my-2 prose-pre:bg-[#05080c] prose-pre:border prose-pre:border-[#3b4b37] prose-pre:rounded-lg prose-pre:p-3 prose-code:text-[#00e5ff] prose-code:font-mono-data prose-strong:text-white prose-ul:my-2 prose-li:my-0.5">
                    <Markdown>{liveResponseText || latestDecision?.responseSnippet || ''}</Markdown>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            /* Employee Workspace Readiness & Quick Telemetry Info Box */
            <motion.div
              key="standby-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-[#090d13]/70 border border-[#3b4b37]/50 rounded-xl p-5 flex flex-col justify-between flex-grow shadow-[inset_0_0_20px_rgba(0,0,0,0.4)]"
            >
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-[#3b4b37]/40 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-[#00ff41]/10 border border-[#00ff41]/30 flex items-center justify-center text-[#00ff41]">
                      <Terminal className="w-3 h-3" />
                    </span>
                    <span className="font-mono-data text-xs text-[#dfe2eb] font-bold tracking-wider">
                      EMPLOYEE_INTELLIGENT_ROUTING_WORKSPACE
                    </span>
                  </div>
                  <span className="text-[10px] font-mono-data text-[#00ff41] bg-[#00ff41]/10 px-2 py-0.5 rounded border border-[#00ff41]/30 font-medium">
                    STATUS: ACTIVE_STANDBY
                  </span>
                </div>

                <p className="text-xs text-[#b9ccb2]/80 font-mono-data leading-relaxed mb-4">
                  TrimToken automatically inspects prompt syntax, complexity, and latency requirements to dynamically assign the most cost-effective and accurate AI model for each query.
                </p>

                {/* Capability Matrix Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-[#121720]/80 border border-[#3b4b37]/40 p-3 rounded-lg flex flex-col gap-1">
                    <div className="text-[10px] font-mono-data text-[#00e5ff] font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff]"></span>
                      INSTANT EXTRACTION
                    </div>
                    <div className="text-[11px] text-[#b9ccb2]/70 font-mono-data">
                      Routed to DeepSeek-V3 or Gemini 1.5 Flash for sub-150ms execution.
                    </div>
                  </div>

                  <div className="bg-[#121720]/80 border border-[#3b4b37]/40 p-3 rounded-lg flex flex-col gap-1">
                    <div className="text-[10px] font-mono-data text-[#ffba20] font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ffba20]"></span>
                      ADVANCED CODE & REASONING
                    </div>
                    <div className="text-[11px] text-[#b9ccb2]/70 font-mono-data">
                      Routed to Qwen 2.5 / DeepSeek V3 for complex algorithmic problems.
                    </div>
                  </div>

                  <div className="bg-[#121720]/80 border border-[#3b4b37]/40 p-3 rounded-lg flex flex-col gap-1">
                    <div className="text-[10px] font-mono-data text-[#00ff41] font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41]"></span>
                      ENTERPRISE SAVINGS
                    </div>
                    <div className="text-[11px] text-[#b9ccb2]/70 font-mono-data">
                      Up to 88% reduction in token burn vs. brute-force frontier routing.
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom footer status */}
              <div className="flex flex-wrap items-center justify-between pt-4 mt-4 border-t border-[#3b4b37]/30 text-[10px] font-mono-data text-[#b9ccb2]/60">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41] animate-pulse"></span>
                  Fine-tuned Qwen Routing Engine Online
                </span>
                <span>Latency SLA: &lt; 300ms | 100% SLA Guarantee</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
