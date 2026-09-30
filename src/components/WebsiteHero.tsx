import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, DollarSign, Terminal, Search, Play, Users, Cpu, ChevronDown, Check, X } from 'lucide-react';
import { TrimTokenLogo } from './TrimTokenLogo';
import { ModelPricing } from '../types';

interface WebsiteHeroProps {
  onExplorePlayground: () => void;
  onExploreRoi: () => void;
  onExploreDocs: () => void;
  onExecuteQuery?: (prompt: string, targetModelId?: string) => void;
  percentRetained: number;
  totalSaved: number;
  onReplayIntro?: () => void;
  isAdmin?: boolean;
  models?: ModelPricing[];
}

export const WebsiteHero: React.FC<WebsiteHeroProps> = ({
  onExplorePlayground,
  onExploreRoi,
  onExploreDocs,
  onExecuteQuery,
  percentRetained,
  totalSaved,
  onReplayIntro,
  isAdmin = false,
  models = [],
}) => {
  const [heroPrompt, setHeroPrompt] = useState('');
  const [selectedTargetModel, setSelectedTargetModel] = useState<string>('auto');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isStickyDropdownOpen, setIsStickyDropdownOpen] = useState<boolean>(false);
  const [isStickyActive, setIsStickyActive] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const stickyDropdownRef = useRef<HTMLDivElement>(null);
  const heroFormContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const stickyInputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll listener to activate sticky searchbar when hero search scrolls out of view
  useEffect(() => {
    const handleScroll = () => {
      if (heroFormContainerRef.current) {
        const rect = heroFormContainerRef.current.getBoundingClientRect();
        // Activate sticky search once the hero search bar passes header
        const threshold = isAdmin && window.innerWidth < 1536 ? 108 : 64;
        const shouldBeSticky = rect.bottom < threshold;
        setIsStickyActive(shouldBeSticky);
      } else {
        setIsStickyActive(window.scrollY > 280);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAdmin]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (stickyDropdownRef.current && !stickyDropdownRef.current.contains(event.target as Node)) {
        setIsStickyDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleHeroSubmit = (e?: React.FormEvent, forceModelId?: string) => {
    if (e) e.preventDefault();
    const q = heroPrompt.trim();
    const modelToUse = forceModelId !== undefined ? forceModelId : selectedTargetModel;
    if (!q) {
      onExplorePlayground();
      return;
    }
    if (onExecuteQuery) {
      onExecuteQuery(q, modelToUse);
    } else {
      onExplorePlayground();
    }
  };

  const handlePresetClick = (sample: string) => {
    setHeroPrompt(sample);
    if (onExecuteQuery) {
      onExecuteQuery(sample, selectedTargetModel);
    }
  };

  const resizePrompt = (element: HTMLTextAreaElement, maxHeight: number) => {
    element.style.height = 'auto';
    element.style.height = `${Math.min(element.scrollHeight, maxHeight)}px`;
    element.style.overflowY = element.scrollHeight > maxHeight ? 'auto' : 'hidden';
  };

  useEffect(() => {
    if (inputRef.current) resizePrompt(inputRef.current, 240);
    if (stickyInputRef.current) resizePrompt(stickyInputRef.current, 160);
  }, [heroPrompt]);

  const handlePromptKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      handleHeroSubmit();
    }
  };

  return (
    <section className="relative pt-4 pb-16 sm:pb-24">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#00e5ff]/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-5xl mx-auto text-center relative z-30">
        {/* Compliance & Trust Badges with TrimToken Logo */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101924]/90 border border-[#00C9E8]/40 mb-5 shadow-[0_0_25px_rgba(0,201,232,0.2)]">
          <div className="flex items-center gap-2">
            <TrimTokenLogo size="xs" variant="icon-only" />
            <span className="text-xs font-mono-data font-bold text-white tracking-wide">
              TRIMTOKEN <span className="text-[#00e5ff]">AI</span> GATEWAY v1.0
            </span>
          </div>
          <span className="text-[#2a3e52]">|</span>
          <span className="text-xs font-mono-data text-[#b9ccb2] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00e5ff]" /> 1-Line Drop-in Proxy
          </span>
          {onReplayIntro && (
            <>
              <span className="text-[#2a3e52]">|</span>
              <button
                onClick={onReplayIntro}
                className="text-xs font-mono-data text-[#00e5ff] hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                title="Play Opening Intro Animation"
              >
                <Play className="w-3 h-3 fill-current" /> Watch Intro
              </button>
            </>
          )}
        </div>

        {/* For Employee / Standard Users: Prominent Quick-Launch Search & Query Bar */}
        {!isAdmin ? (
          <>
            <div className="max-w-6xl mx-auto mb-8 px-2" ref={heroFormContainerRef}>
              {/* Quick Model Selector Pills in Hero */}
              <div className="flex flex-wrap items-center justify-center gap-2 p-2 bg-[#060a10]/95 border border-[#1e2f3d] rounded-2xl mb-4 shadow-[0_0_25px_rgba(0,0,0,0.6)]">
                <span className="text-xs font-mono-data text-[#b9ccb2]/80 px-2 uppercase font-bold tracking-wide">
                  Target LLM:
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedTargetModel('auto')}
                  className={`text-xs font-mono-data px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    selectedTargetModel === 'auto'
                      ? 'bg-[#00ff41] text-[#003907] shadow-[0_0_15px_rgba(0,255,65,0.4)] scale-105'
                      : 'bg-[#121922] text-[#b9ccb2] hover:text-[#00ff41] border border-[#2b3d30]'
                  }`}
                >
                  ⚡ Auto-Route (k-NN)
                </button>
                {models.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedTargetModel(m.id)}
                    className={`text-xs font-mono-data px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                      selectedTargetModel === m.id
                        ? 'bg-[#16212e] text-white font-bold border-2 shadow-md scale-105'
                        : 'bg-[#121922] text-[#b9ccb2] hover:text-white border border-[#2b3d30]'
                    }`}
                    style={{
                      borderColor: selectedTargetModel === m.id ? m.color : undefined,
                      boxShadow: selectedTargetModel === m.id ? `0 0 14px ${m.color}50` : undefined,
                      color: selectedTargetModel === m.id ? m.color : undefined
                    }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                    {m.name}
                  </button>
                ))}
              </div>

              <form onSubmit={handleHeroSubmit} className="relative group z-40">
                <div className="absolute -inset-1 rounded-2xl border border-[#00ff41]/45 opacity-75 shadow-[0_0_22px_rgba(0,255,65,0.22)] group-hover:opacity-100 group-focus-within:opacity-100 transition duration-500 pointer-events-none"></div>
                
                <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-[#060a10]/98 backdrop-blur-2xl border-2 border-[#00ff41]/90 rounded-2xl sm:rounded-2xl p-1.5 sm:p-2 shadow-[0_0_30px_rgba(0,255,65,0.22)] gap-2">
                  {/* Search Input Container */}
                  <div 
                    className="relative flex items-center flex-grow pl-3 sm:pl-4 pr-2 py-1.5 sm:py-2 bg-[#0d131f]/90 rounded-xl border border-[#1e2f3d] group-focus-within:border-[#00ff41] transition-all min-h-[44px]"
                  >
                    <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#00ff41] shrink-0 mr-2.5 animate-pulse" />
                    <textarea
                      ref={inputRef}
                      value={heroPrompt}
                      onChange={(e) => setHeroPrompt(e.target.value)}
                      onInput={(e) => resizePrompt(e.currentTarget, 240)}
                      onKeyDown={handlePromptKeyDown}
                      aria-label="Prompt to route"
                      placeholder="Ask anything or enter a query to route (e.g. 'What is 15 * 24?')..."
                      rows={1}
                      data-prompt-input
                      className="!outline-none !ring-0 focus:!outline-none focus-visible:!outline-none resize-none overflow-hidden min-h-[30px] max-h-[240px] leading-6 w-full bg-transparent text-sm sm:text-base font-mono-data text-white placeholder:text-[#b9ccb2]/50"
                    />
                    {heroPrompt && (
                      <button
                        type="button"
                        onClick={() => setHeroPrompt('')}
                        aria-label="Clear prompt"
                        className="rounded-md p-1 text-[#869683] hover:bg-white/10 hover:text-white transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Extra Model Dropdown Selector (Direct API / Bypass Routing) */}
                  <div className="relative shrink-0 flex items-center z-50" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl border font-mono-data text-[11px] sm:text-xs font-semibold flex items-center justify-between sm:justify-start gap-1.5 transition-all cursor-pointer ${
                        selectedTargetModel !== 'auto'
                          ? 'bg-[#121922] text-[#00C9E8] border-[#00C9E8]/80 shadow-[0_0_15px_rgba(0,201,232,0.25)]'
                          : 'bg-[#121924] text-[#b9ccb2] border-[#2b3d30] hover:border-[#00ff41]/80 hover:text-white hover:bg-[#182420]'
                      }`}
                      title="Select a specific model to query directly via its API without routing"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <Cpu className={`w-3.5 h-3.5 shrink-0 ${selectedTargetModel !== 'auto' ? 'text-[#00C9E8]' : 'text-[#00ff41]'}`} />
                        <span className="truncate max-w-[100px] sm:max-w-[130px]">
                          {selectedTargetModel === 'auto'
                            ? 'Model API'
                            : models.find((m) => m.id === selectedTargetModel)?.name || selectedTargetModel}
                        </span>
                      </div>
                      <ChevronDown className={`w-3 h-3 shrink-0 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-h-[420px] overflow-y-auto bg-[#0a0f18] border-2 border-[#00ff41] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.98)] z-[999] p-2.5 backdrop-blur-2xl text-left"
                        >
                          <div className="px-2.5 py-1.5 border-b border-[#3b4b37]/50 mb-1 flex items-center justify-between">
                            <span className="text-[10px] font-mono-data text-[#00ff41] font-bold uppercase tracking-wider">
                              Choose Model API
                            </span>
                            <span className="text-[9px] font-mono-data text-[#b9ccb2]/60">
                              Bypasses Routing
                            </span>
                          </div>

                          {/* Auto-Route Option */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTargetModel('auto');
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left p-2 rounded-lg font-mono-data text-xs flex items-center justify-between transition-colors mb-1 cursor-pointer ${
                              selectedTargetModel === 'auto'
                                ? 'bg-[#00ff41]/15 text-[#00ff41] border border-[#00ff41]/40'
                                : 'text-[#dfe2eb] hover:bg-[#182230] border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#00ff41]" />
                              <div>
                                <div className="font-bold flex items-center gap-1.5">
                                  ⚡ Auto-Route (k-NN Engine)
                                </div>
                                <div className="text-[10px] text-[#b9ccb2]/70">
                                  Dynamically routes for 85%+ cost reduction
                                </div>
                              </div>
                            </div>
                            {selectedTargetModel === 'auto' && <Check className="w-3.5 h-3.5 text-[#00ff41] shrink-0" />}
                          </button>

                          <div className="px-2 py-1 text-[9px] font-mono-data text-[#b9ccb2]/50 uppercase tracking-wider">
                            All Available Models (Direct Call)
                          </div>

                          {/* All Models List */}
                          <div className="flex flex-col gap-1">
                            {models.map((m) => {
                              const isSelected = selectedTargetModel === m.id;
                              return (
                                <button
                                  key={m.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedTargetModel(m.id);
                                    setIsDropdownOpen(false);
                                    if (heroPrompt.trim()) {
                                      handleHeroSubmit(undefined, m.id);
                                    }
                                  }}
                                  className={`w-full text-left p-2 rounded-lg font-mono-data text-xs flex items-center justify-between transition-all cursor-pointer ${
                                    isSelected
                                      ? 'bg-[#182535] text-white border border-[#00C9E8]/60 shadow-sm'
                                      : 'text-[#dfe2eb] hover:bg-[#161f2c] border border-transparent'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
                                    <div className="min-w-0">
                                      <div className="font-semibold text-white truncate flex items-center gap-1.5">
                                        {m.name}
                                        {m.hasKey && (
                                          <span className="text-[8px] bg-[#00ff41]/15 text-[#00ff41] px-1 py-0.2 rounded border border-[#00ff41]/30">
                                            KEY
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-[10px] text-[#b9ccb2]/70 truncate">
                                        {m.provider} • ${m.promptPricePerM}/1M • Q: {m.qualityScore}/100
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right shrink-0 ml-2">
                                    {isSelected ? (
                                      <Check className="w-3.5 h-3.5 text-[#00C9E8]" />
                                    ) : (
                                      <span className="text-[9px] text-[#00C9E8]/80 opacity-0 group-hover:opacity-100 hover:underline">
                                        Use API →
                                      </span>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    type="submit"
                    className="h-8 sm:h-9 px-3.5 sm:px-4 rounded-xl bg-[#00ff41] text-[#003907] font-mono-data font-bold text-xs tracking-wider hover:bg-[#72ff70] active:scale-95 transition-all shadow-[0_0_20px_rgba(0,255,65,0.4)] flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>
                      {selectedTargetModel === 'auto'
                        ? 'Route'
                        : `Query ${models.find((m) => m.id === selectedTargetModel)?.name?.split(' ')[0] || 'API'}`}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between px-1 text-[10px] font-mono-data text-[#869683]" aria-live="polite">
                  <span>Try: summarize a document, debug code, or analyze a contract</span>
                  <span className="hidden sm:inline text-[#b9ccb2]/60">⌘/Ctrl + Enter to route • Auto or forced model</span>
                </div>
              </form>

              {/* Quick preset suggestions */}
              <div className="relative z-20 flex flex-wrap items-center justify-center gap-2 mt-6 sm:mt-7 pt-1">
                <span className="text-xs font-mono-data text-[#b9ccb2]/75 flex items-center gap-1 mr-1">
                  <Sparkles className="w-3 h-3 text-[#ffba20]" /> Try:
                </span>
                <button
                  type="button"
                  onClick={() => handlePresetClick('Summarize this document into five concise bullet points, highlighting risks and next steps.')}
                  className="text-xs font-mono-data bg-[#141a22] hover:bg-[#00ff41]/15 text-[#dfe2eb] hover:text-[#00ff41] px-3 py-1.5 rounded-lg border border-[#3b4b37] hover:border-[#00ff41]/60 transition-all cursor-pointer shadow-sm"
                >
                  Summarize a document
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetClick('Debug this function, explain the root cause, and provide a corrected implementation with tests.')}
                  className="text-xs font-mono-data bg-[#141a22] hover:bg-[#00ff41]/15 text-[#dfe2eb] hover:text-[#00ff41] px-3 py-1.5 rounded-lg border border-[#3b4b37] hover:border-[#00ff41]/60 transition-all cursor-pointer shadow-sm"
                >
                  Debug this function
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetClick('Analyze this contract for unusual obligations, termination risks, and missing protections.')}
                  className="text-xs font-mono-data bg-[#141a22] hover:bg-[#ffba20]/15 text-[#dfe2eb] hover:text-[#ffba20] px-3 py-1.5 rounded-lg border border-[#3b4b37] hover:border-[#ffba20]/60 transition-all cursor-pointer shadow-sm"
                >
                  Analyze a contract
                </button>
              </div>
            </div>

            {/* STICKY SEARCH BAR - Floats pinned clearly below the header and sub-navigation */}
            <AnimatePresence>
              {isStickyActive && (
                <motion.div
                  initial={{ y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -30, opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className={`fixed ${isAdmin ? '2xl:top-[76px] top-[108px]' : 'top-[74px]'} left-0 right-0 z-50 px-3 sm:px-6 py-2 pointer-events-none`}
                >
                  <div className="max-w-4xl mx-auto pointer-events-auto bg-[#060a10]/98 backdrop-blur-2xl border-2 border-[#00ff41]/90 rounded-2xl shadow-[0_12px_45px_rgba(0,0,0,0.95),0_0_25px_rgba(0,255,65,0.25)] p-1.5 sm:p-2 flex items-center gap-2 sm:gap-3">
                    <form
                      onSubmit={(e) => {
                        handleHeroSubmit(e);
                      }}
                      className="flex-grow flex items-center bg-[#0d131f] border border-[#1e2f3d] focus-within:border-[#00ff41] rounded-xl px-3 py-1.5 shadow-[0_0_12px_rgba(0,0,0,0.5)] focus-within:shadow-[0_0_20px_rgba(0,255,65,0.25)] transition-all min-h-[42px]"
                    >
                      <Search className="w-4 h-4 text-[#00ff41] shrink-0 mr-2.5 animate-pulse" />
                      <textarea
                        ref={stickyInputRef}
                        value={heroPrompt}
                        onChange={(e) => setHeroPrompt(e.target.value)}
                        onInput={(e) => resizePrompt(e.currentTarget, 160)}
                        placeholder="Search, route a prompt, or enter code..."
                        onKeyDown={handlePromptKeyDown}
                        aria-label="Prompt to route"
                        rows={1}
                        data-prompt-input
                        className="!outline-none !ring-0 focus:!outline-none focus-visible:!outline-none resize-none overflow-hidden min-h-[26px] max-h-[160px] leading-5 w-full bg-transparent text-xs sm:text-sm font-mono-data text-white placeholder:text-[#b9ccb2]/50"
                      />

                      {heroPrompt && (
                        <button
                          type="button"
                          onClick={() => setHeroPrompt('')}
                          className="text-[#b9ccb2]/60 hover:text-white px-1.5 py-0.5 text-xs font-mono-data mr-1"
                        >
                          ✕
                        </button>
                      )}
                    </form>

                    {/* Sticky Model Selector */}
                    <div className="relative shrink-0" ref={stickyDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setIsStickyDropdownOpen(!isStickyDropdownOpen)}
                        className={`h-9 px-2.5 sm:px-3 rounded-xl border font-mono-data text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          selectedTargetModel !== 'auto'
                            ? 'bg-[#121922] text-[#00C9E8] border-[#00C9E8]/80 shadow-[0_0_12px_rgba(0,201,232,0.2)]'
                            : 'bg-[#121924] text-[#b9ccb2] border-[#2b3d30] hover:border-[#00ff41]/80 hover:text-white'
                        }`}
                      >
                        <Cpu className={`w-3.5 h-3.5 ${selectedTargetModel !== 'auto' ? 'text-[#00C9E8]' : 'text-[#00ff41]'}`} />
                        <span className="truncate max-w-[80px] sm:max-w-[120px]">
                          {selectedTargetModel === 'auto'
                            ? 'Auto-Route'
                            : models.find((m) => m.id === selectedTargetModel)?.name || selectedTargetModel}
                        </span>
                        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isStickyDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Sticky Dropdown Menu */}
                      <AnimatePresence>
                        {isStickyDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-full mt-2 w-72 sm:w-80 max-h-[380px] overflow-y-auto bg-[#0a0f18] border-2 border-[#00ff41] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.95)] z-[999] p-2 backdrop-blur-2xl text-left"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedTargetModel('auto');
                                setIsStickyDropdownOpen(false);
                              }}
                              className={`w-full text-left p-2 rounded-lg font-mono-data text-xs flex items-center justify-between transition-colors mb-1 cursor-pointer ${
                                selectedTargetModel === 'auto'
                                  ? 'bg-[#00ff41]/15 text-[#00ff41] border border-[#00ff41]/40'
                                  : 'text-[#dfe2eb] hover:bg-[#182230] border border-transparent'
                              }`}
                            >
                              <span className="font-bold">⚡ Auto-Route (k-NN Engine)</span>
                              {selectedTargetModel === 'auto' && <Check className="w-3.5 h-3.5 text-[#00ff41]" />}
                            </button>

                            <div className="px-2 py-1 text-[9px] font-mono-data text-[#b9ccb2]/50 uppercase tracking-wider">
                              Specific Model APIs
                            </div>

                            {models.map((m) => (
                              <button
                                key={m.id}
                                type="button"
                                onClick={() => {
                                  setSelectedTargetModel(m.id);
                                  setIsStickyDropdownOpen(false);
                                  if (heroPrompt.trim()) {
                                    handleHeroSubmit(undefined, m.id);
                                  }
                                }}
                                className={`w-full text-left p-2 rounded-lg font-mono-data text-xs flex items-center justify-between transition-all cursor-pointer ${
                                  selectedTargetModel === m.id
                                    ? 'bg-[#182535] text-white border border-[#00C9E8]/60 shadow-sm'
                                    : 'text-[#dfe2eb] hover:bg-[#161f2c] border border-transparent'
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
                                  <span className="truncate">{m.name}</span>
                                </div>
                                {selectedTargetModel === m.id && <Check className="w-3.5 h-3.5 text-[#00C9E8] shrink-0" />}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Sticky Route Button */}
                    <button
                      type="button"
                      onClick={() => handleHeroSubmit()}
                      className="h-9 px-3 sm:px-4 rounded-xl bg-[#00ff41] text-[#003907] font-mono-data font-bold text-xs hover:bg-[#72ff70] active:scale-95 transition-all shadow-[0_0_15px_rgba(0,255,65,0.4)] flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span className="hidden sm:inline">Route</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Secondary Action Buttons */}
            <div className="relative z-20 flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10 mb-2">
              <button
                onClick={onExplorePlayground}
                className="px-5 py-2.5 rounded-xl bg-[#1c222c] text-[#dfe2eb] border border-[#3b4b37] hover:border-[#00ff41]/50 hover:text-[#00ff41] font-mono-data text-xs font-semibold tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#00ff41]" />
                VIEW ALL BENCHMARKS
              </button>

              <button
                onClick={onExploreRoi}
                className="px-5 py-2.5 rounded-xl bg-[#1c2026] text-[#dfe2eb] border border-[#3b4b37] hover:border-[#ffba20]/50 hover:text-[#ffba20] font-mono-data text-xs font-semibold tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <DollarSign className="w-3.5 h-3.5 text-[#ffba20]" />
                CALCULATE ENTERPRISE ROI
              </button>

              <button
                onClick={onExploreDocs}
                className="px-4 py-2.5 rounded-xl bg-[#14181f]/80 text-[#b9ccb2] border border-[#3b4b37]/70 hover:border-[#00e5ff]/50 hover:text-[#00e5ff] font-mono-data text-xs tracking-wider transition-all flex items-center gap-2 cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5 text-[#00e5ff]" />
                API DOCS
              </button>
            </div>
          </>
        ) : (
          <div className="max-w-2xl mx-auto py-1">
            <div className="p-4 rounded-2xl bg-[#090d13] border border-[#00ff41]/30 shadow-[0_0_30px_rgba(0,255,65,0.08)] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-[#00ff41]/10 border border-[#00ff41]/30 flex items-center justify-center text-[#00ff41]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white font-mono-data flex items-center gap-2">
                    <span>ADMINISTRATOR_CONTROL_PLANE</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/40 font-bold">ACTIVE</span>
                  </div>
                  <div className="text-xs text-[#869683]">Live telemetry ingestion, dynamic model provider pricing, & live routing stream.</div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    const el = document.getElementById('employee-telemetry-hub');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#00ff41]/15 hover:bg-[#00ff41]/25 text-[#00ff41] border border-[#00ff41]/40 text-xs font-mono-data font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Users className="w-3.5 h-3.5 text-[#00ff41]" />
                  <span>TEAM TELEMETRY</span>
                </button>
                <button
                  onClick={onExploreRoi}
                  className="px-3.5 py-2 rounded-xl bg-[#1c222c] hover:bg-[#00ff41]/10 text-[#dfe2eb] hover:text-[#00ff41] border border-[#3b4b37] hover:border-[#00ff41]/40 text-xs font-mono-data font-semibold transition-all shrink-0 cursor-pointer"
                >
                  ROI METRICS
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
