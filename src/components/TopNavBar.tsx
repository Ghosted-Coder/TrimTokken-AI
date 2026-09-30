import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal, 
  Settings, 
  Zap, 
  Play, 
  Pause, 
  RefreshCw, 
  Code2, 
  BookOpen, 
  BarChart3, 
  Sliders, 
  Calculator, 
  Layers, 
  Sparkles, 
  Search, 
  ArrowRight, 
  CornerDownLeft,
  User,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Users,
  Link,
  Copy,
  Check,
  ExternalLink,
  Share2
} from 'lucide-react';
import { TrimTokenLogo } from './TrimTokenLogo';
import { UserAccount } from '../types';

interface TopNavBarProps {
  activeTab: 'dashboard' | 'simulator' | 'policies' | 'analytics' | 'python' | 'docs' | 'routing-log';
  setActiveTab: (tab: 'dashboard' | 'simulator' | 'policies' | 'analytics' | 'python' | 'docs' | 'routing-log') => void;
  isSimulating: boolean;
  setIsSimulating: React.Dispatch<React.SetStateAction<boolean>>;
  onResetStats: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onOpenManageProviders: () => void;
  onScrollToSection?: (id: string) => void;
  onRunQueryFromTop?: (query: string) => void;
  onReplayIntro?: () => void;
  currentUser: UserAccount | null;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  activeTab,
  setActiveTab,
  isSimulating,
  setIsSimulating,
  onResetStats,
  searchTerm,
  setSearchTerm,
  onOpenManageProviders,
  onScrollToSection,
  onRunQueryFromTop,
  onReplayIntro,
  currentUser,
  onLogout,
  onOpenAuth,
}) => {
  const [topInput, setTopInput] = useState(searchTerm);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLinkMenuOpen, setIsLinkMenuOpen] = useState(false);
  const [copiedLinkType, setCopiedLinkType] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const linkMenuRef = useRef<HTMLDivElement>(null);

  const devUrl = 'https://ais-dev-3q7zg37ylydkbcgasskpdm-685413386300.asia-southeast1.run.app';
  const sharedUrl = 'https://ais-pre-3q7zg37ylydkbcgasskpdm-685413386300.asia-southeast1.run.app';

  const copyToClipboard = async (text: string, type: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const fallback = document.createElement('textarea');
        fallback.value = text;
        fallback.setAttribute('readonly', '');
        fallback.style.position = 'fixed';
        fallback.style.opacity = '0';
        document.body.appendChild(fallback);
        fallback.select();
        document.execCommand('copy');
        fallback.remove();
      }
      setCopiedLinkType(type);
      setTimeout(() => setCopiedLinkType(null), 2000);
    } catch {
      setCopiedLinkType(null);
    }
  };

  const getCurrentPageUrl = () => (
    typeof window !== 'undefined' ? window.location.href : ''
  );

  const handleShareCurrentPage = async () => {
    const url = getCurrentPageUrl();
    if (!url) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'TrimToken AI - Cost-Aware LLM Gateway',
          text: 'Explore this TrimToken AI routing workspace.',
          url,
        });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }

    await copyToClipboard(url, 'page');
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (linkMenuRef.current && !linkMenuRef.current.contains(event.target as Node)) {
        setIsLinkMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (tab: 'dashboard' | 'simulator' | 'policies' | 'analytics' | 'python' | 'docs' | 'routing-log', sectionId?: string) => {
    setActiveTab(tab);
    if (sectionId && onScrollToSection) {
      setTimeout(() => onScrollToSection(sectionId), 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleExecuteTopQuery = () => {
    const query = topInput.trim();
    if (!query) return;
    if (onRunQueryFromTop) {
      onRunQueryFromTop(query);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleExecuteTopQuery();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTopInput(val);
    setSearchTerm(val);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0c1015]/95 backdrop-blur-2xl border-b border-[#3b4b37]/80 shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
      {/* Primary Top Bar */}
      <div className="max-w-[1700px] mx-auto flex items-center justify-between px-3 md:px-6 h-16 gap-3 lg:gap-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div 
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => handleNavClick('dashboard')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#101b2b] to-[#0a121e] border border-[#00C9E8]/40 flex items-center justify-center p-1 shadow-[0_0_20px_rgba(0,201,232,0.25)] group-hover:scale-105 group-hover:border-[#00C9E8] transition-all">
              <TrimTokenLogo size="sm" variant="icon-only" />
            </div>
            <div>
              <h1 className="font-display text-base sm:text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>TrimToken</span>
                <span className="text-[#00e5ff] font-extrabold drop-shadow-[0_0_12px_rgba(0,229,255,0.6)]">AI</span>
                <span className="text-[10px] text-[#00e5ff] bg-[#00e5ff]/10 px-1.5 py-0.5 rounded border border-[#00e5ff]/30 font-mono-data hidden sm:inline-block">v1.0</span>
              </h1>
            </div>
          </div>
        </div>

        {/* Empty flex-1 spacer or subtle branding */}
        <div className="flex-1"></div>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden 2xl:flex items-center gap-1 shrink-0">
          {currentUser?.authRole === 'admin' && (
            <button
              onClick={() => handleNavClick('dashboard', 'employee-telemetry-hub')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono-data tracking-wider text-[#00ff41] bg-[#00ff41]/10 border border-[#00ff41]/30 hover:bg-[#00ff41]/20 font-bold transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,255,65,0.15)] cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>TEAM_USAGE</span>
            </button>
          )}
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono-data tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === 'dashboard'
                ? 'text-[#00ff41] bg-[#00ff41]/10 border border-[#00ff41]/30 font-bold'
                : 'text-[#b9ccb2] hover:text-[#ebffe2] hover:bg-[#353940]/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            PLAYGROUND
          </button>
          {currentUser?.authRole === 'admin' && (
            <button
              onClick={() => handleNavClick('dashboard', 'roi-calculator')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono-data tracking-wider text-[#b9ccb2] hover:text-[#ffba20] hover:bg-[#353940]/30 transition-all flex items-center gap-1"
            >
              <Calculator className="w-3.5 h-3.5 text-[#ffba20]" />
              ROI
            </button>
          )}
          {currentUser?.authRole === 'admin' && (
            <>
              <button
                onClick={() => handleNavClick('simulator')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono-data tracking-wider transition-all flex items-center gap-1.5 ${
                  activeTab === 'simulator'
                    ? 'text-[#00ff41] bg-[#00ff41]/10 border border-[#00ff41]/30 font-semibold'
                    : 'text-[#b9ccb2] hover:text-[#ebffe2] hover:bg-[#353940]/30'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                SIMULATOR
              </button>
              <button
                onClick={() => handleNavClick('policies')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono-data tracking-wider transition-all flex items-center gap-1.5 ${
                  activeTab === 'policies'
                    ? 'text-[#00ff41] bg-[#00ff41]/10 border border-[#00ff41]/30 font-semibold'
                    : 'text-[#b9ccb2] hover:text-[#ebffe2] hover:bg-[#353940]/30'
                }`}
              >
                POLICIES
              </button>
              <button
                onClick={() => handleNavClick('analytics')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono-data tracking-wider transition-all flex items-center gap-1.5 ${
                  activeTab === 'analytics'
                    ? 'text-[#00ff41] bg-[#00ff41]/10 border border-[#00ff41]/30 font-semibold'
                    : 'text-[#b9ccb2] hover:text-[#ebffe2] hover:bg-[#353940]/30'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                ANALYTICS
              </button>
              <button
                onClick={() => handleNavClick('python')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono-data tracking-wider transition-all flex items-center gap-1.5 ${
                  activeTab === 'python'
                    ? 'text-[#00e5ff] bg-[#00e5ff]/10 border border-[#00e5ff]/30 font-semibold'
                    : 'text-[#b9ccb2] hover:text-[#00e5ff] hover:bg-[#353940]/30'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                PYTHON
              </button>
              <button
                onClick={() => handleNavClick('docs')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono-data tracking-wider transition-all flex items-center gap-1.5 ${
                  activeTab === 'docs'
                    ? 'text-[#ffba20] bg-[#ffba20]/10 border border-[#ffba20]/30 font-semibold'
                    : 'text-[#b9ccb2] hover:text-[#ffba20] hover:bg-[#353940]/30'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                DOCS
              </button>
            </>
          )}
          <button
            onClick={() => handleNavClick('routing-log')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono-data tracking-wider transition-all ${
              activeTab === 'routing-log'
                ? 'text-[#00e5ff] bg-[#00e5ff]/10 border border-[#00e5ff]/30 font-semibold'
                : 'text-[#b9ccb2] hover:text-[#00e5ff] hover:bg-[#353940]/30'
            }`}
          >
            ROUTING LOG
          </button>
        </nav>

        {/* Right Tools Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Stream Toggle */}
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-mono-data font-bold tracking-wider transition-all ${
              isSimulating
                ? 'bg-[#00e639]/15 text-[#00ff41] border border-[#00e639]/40 hover:bg-[#00e639]/25 shadow-[0_0_10px_rgba(0,255,65,0.2)]'
                : 'bg-[#353940]/40 text-[#b9ccb2] border border-[#3b4b37]/40 hover:bg-[#353940]/70'
            }`}
            title={isSimulating ? 'Pause live stream traffic' : 'Resume live stream traffic'}
          >
            {isSimulating ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse"></span>
                <Pause className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">LIVE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">PAUSED</span>
              </>
            )}
          </button>

          {/* Replay Opening Animation */}
          {onReplayIntro && (
            <button
              onClick={onReplayIntro}
              className="text-[#b9ccb2] hover:text-[#00e5ff] hover:bg-[#00e5ff]/10 p-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-mono-data"
              title="Play Logo Intro Animation"
            >
              <Sparkles className="w-4 h-4 text-[#00e5ff]" />
              <span className="hidden lg:inline text-[11px] text-[#00e5ff]">INTRO</span>
            </button>
          )}

          {/* Share / Create App Link */}
          <div className="relative" ref={linkMenuRef}>
            <button
              onClick={() => setIsLinkMenuOpen(!isLinkMenuOpen)}
              className={`text-[#b9ccb2] hover:text-[#00ff41] hover:bg-[#00ff41]/10 p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-mono-data cursor-pointer border ${
                isLinkMenuOpen ? 'bg-[#00ff41]/20 text-[#00ff41] border-[#00ff41]/50' : 'border-transparent'
              }`}
              title="Share & Copy App Links"
            >
              <Link className="w-4 h-4 text-[#00ff41]" />
              <span className="hidden xl:inline text-[#00ff41] font-bold">LINK</span>
            </button>

            {/* Link & Share Popover Menu */}
            {isLinkMenuOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-panel border-2 border-[#00ff41]/40 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-left">
                <div className="flex items-center justify-between pb-3 border-b border-[#3b4b37]/60">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#00ff41]/10 border border-[#00ff41]/30 flex items-center justify-center text-[#00ff41]">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-mono-data">APP ACCESS LINKS</h4>
                      <p className="text-[10px] text-[#b9ccb2]/70 font-mono-data">Shareable URLs & Cloud Run endpoints</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono-data text-[#00ff41] bg-[#00ff41]/10 px-2 py-0.5 rounded-full border border-[#00ff41]/30">
                    LIVE
                  </span>
                </div>

                <div className="py-3 space-y-3">
                  {/* Dev Sandbox URL */}
                  <div className="p-2.5 rounded-xl bg-[#090e15] border border-[#1e2f3d] hover:border-[#00ff41]/50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono-data font-bold text-[#00ff41] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41] animate-pulse"></span>
                        DEVELOPMENT CONTAINER
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => copyToClipboard(devUrl, 'dev')}
                          className="px-2 py-0.5 rounded bg-[#162231] hover:bg-[#203348] text-[#00ff41] text-[10px] font-mono-data flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {copiedLinkType === 'dev' ? <Check className="w-3 h-3 text-[#00ff41]" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedLinkType === 'dev' ? 'Copied!' : 'Copy'}</span>
                        </button>
                        <a
                          href={devUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded bg-[#162231] hover:bg-[#203348] text-[#00e5ff] transition-colors"
                          title="Open development link"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                    <div className="text-[11px] font-mono-data text-white/90 truncate bg-[#05080c] px-2 py-1 rounded border border-[#14202c]">
                      {devUrl}
                    </div>
                  </div>

                  {/* Shared App Preview URL */}
                  <div className="p-2.5 rounded-xl bg-[#090e15] border border-[#1e2f3d] hover:border-[#00C9E8]/50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono-data font-bold text-[#00C9E8] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00C9E8]"></span>
                        SHARED APP PREVIEW
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => copyToClipboard(sharedUrl, 'shared')}
                          className="px-2 py-0.5 rounded bg-[#162231] hover:bg-[#203348] text-[#00C9E8] text-[10px] font-mono-data flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {copiedLinkType === 'shared' ? <Check className="w-3 h-3 text-[#00C9E8]" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedLinkType === 'shared' ? 'Copied!' : 'Copy'}</span>
                        </button>
                        <a
                          href={sharedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded bg-[#162231] hover:bg-[#203348] text-[#00C9E8] transition-colors"
                          title="Open shared preview link"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                    <div className="text-[11px] font-mono-data text-white/90 truncate bg-[#05080c] px-2 py-1 rounded border border-[#14202c]">
                      {sharedUrl}
                    </div>
                  </div>

                  {/* API Gateway Link */}
                  <div className="p-2.5 rounded-xl bg-[#090e15] border border-[#1e2f3d] hover:border-[#ffba20]/50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono-data font-bold text-[#ffba20] flex items-center gap-1">
                        PROXY GATEWAY ENDPOINT
                      </span>
                      <button
                        onClick={() => copyToClipboard(`${window.location.origin}/api/route`, 'api')}
                        className="px-2 py-0.5 rounded bg-[#162231] hover:bg-[#203348] text-[#ffba20] text-[10px] font-mono-data flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {copiedLinkType === 'api' ? <Check className="w-3 h-3 text-[#ffba20]" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedLinkType === 'api' ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="text-[11px] font-mono-data text-white/90 truncate bg-[#05080c] px-2 py-1 rounded border border-[#14202c]">
                      {typeof window !== 'undefined' ? `${window.location.origin}/api/route` : '/api/route'}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#3b4b37]/60 text-center">
                  <button
                    onClick={handleShareCurrentPage}
                    className="w-full py-1.5 rounded-lg bg-[#00ff41]/15 hover:bg-[#00ff41] text-[#00ff41] hover:text-[#003907] font-mono-data text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copiedLinkType === 'page' ? 'Page Link Copied!' : 'Share Current Page Link'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Reset Stats */}
          <button
            onClick={onResetStats}
            className="text-[#b9ccb2] hover:text-[#ebffe2] hover:bg-[#353940]/40 p-2 rounded-lg transition-colors"
            title="Reset Telemetry Stats"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Manage Providers Modal */}
          <button
            onClick={onOpenManageProviders}
            className="text-[#b9ccb2] hover:text-[#00ff41] hover:bg-[#353940]/40 p-2 rounded-lg transition-colors"
            title="Manage Model Pricing & Providers"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleNavClick('docs')}
            className="text-[#b9ccb2] hover:text-[#00e5ff] hover:bg-[#353940]/40 p-2 rounded-lg transition-colors hidden sm:block"
            title="Terminal & Proxy Gateway Docs"
          >
            <Terminal className="w-4 h-4" />
          </button>

          {/* User Account / Profile Dropdown */}
          {currentUser && !currentUser.isGuest ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`flex items-center gap-2 py-1 px-1.5 sm:px-2 rounded-xl bg-[#090d13] border transition-all cursor-pointer shadow-sm group ${
                  currentUser.authRole === 'admin' 
                    ? 'border-[#00ff41]/50 hover:border-[#00ff41]' 
                    : 'border-[#00e5ff]/50 hover:border-[#00e5ff]'
                }`}
                title="Account Settings & Identity"
              >
                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${currentUser.avatarColor || 'from-[#00ff41] to-[#00b32c]'} text-[#080c10] font-bold text-xs flex items-center justify-center font-mono-data shadow-sm`}>
                  {currentUser.initials}
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-bold text-white group-hover:text-[#00ff41] transition-colors leading-none truncate max-w-[110px]">
                    {currentUser.name}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className={`text-[9px] font-bold px-1 rounded font-mono-data leading-tight ${
                      currentUser.authRole === 'admin'
                        ? 'bg-[#00ff41]/15 text-[#00ff41] border border-[#00ff41]/30'
                        : 'bg-[#00e5ff]/15 text-[#00e5ff] border border-[#00e5ff]/30'
                    }`}>
                      {currentUser.authRole ? currentUser.authRole.toUpperCase() : 'USER'}
                    </span>
                    <span className="text-[9px] text-[#869683] font-mono-data leading-tight">
                      {currentUser.tier.toUpperCase()}
                    </span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#869683] group-hover:text-white transition-transform" />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl glass-panel border border-[#00ff41]/40 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-start gap-3 pb-3 border-b border-[#3b4b37]/60">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentUser.avatarColor || 'from-[#00ff41] to-[#00b32c]'} text-[#080c10] font-bold text-sm flex items-center justify-center font-mono-data shadow-md shrink-0`}>
                      {currentUser.initials}
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-sm font-bold text-white truncate flex items-center gap-1.5">
                        <span>{currentUser.name}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono-data font-bold ${
                          currentUser.authRole === 'admin'
                            ? 'bg-[#00ff41]/15 text-[#00ff41] border border-[#00ff41]/40'
                            : 'bg-[#00e5ff]/15 text-[#00e5ff] border border-[#00e5ff]/40'
                        }`}>
                          {currentUser.authRole === 'admin' ? 'ADMIN' : 'EMPLOYEE'}
                        </span>
                      </div>
                      <div className="text-xs text-[#869683] truncate">{currentUser.email}</div>
                      <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded bg-[#00ff41]/10 border border-[#00ff41]/30 text-[#00ff41] text-[10px] font-mono-data font-bold">
                        <ShieldCheck className="w-3 h-3" />
                        <span>{currentUser.tier} • {currentUser.organization}</span>
                      </div>
                    </div>
                  </div>

                  {/* Token Quota Telemetry */}
                  <div className="py-3 border-b border-[#3b4b37]/60 space-y-1.5 font-mono-data text-xs">
                    <div className="flex justify-between text-[11px] text-[#b9ccb2]">
                      <span>Monthly Token Quota:</span>
                      <span className="text-[#00ff41] font-bold">
                        {(currentUser.apiTokensAllocated / 1000000).toFixed(0)}M Tok
                      </span>
                    </div>
                    <div className="w-full bg-[#121922] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-[#00ff41] to-[#00e5ff] h-full w-[18%]"></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-[#869683]">
                      <span>18% consumed</span>
                      <span>Reset in 12 days</span>
                    </div>
                  </div>

                  {/* Dropdown Actions */}
                  <div className="pt-2 space-y-1 font-mono-data text-xs">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenAuth();
                      }}
                      className="w-full px-3 py-2 rounded-lg text-left text-[#b9ccb2] hover:text-white hover:bg-[#353940]/40 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5 text-[#00e5ff]" />
                      <span>Switch Account / Persona</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full px-3 py-2 rounded-lg text-left text-red-400 hover:text-red-300 hover:bg-red-950/30 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3 py-1.5 rounded-xl bg-[#00ff41] hover:bg-[#72ff70] text-[#003907] font-mono-data text-xs font-bold tracking-wider transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,255,65,0.25)] cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>SIGN IN / UP</span>
            </button>
          )}

          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#101b2b] to-[#0a121e] overflow-hidden border border-[#00C9E8]/40 flex items-center justify-center p-1 shadow-sm hidden sm:flex">
            <TrimTokenLogo size="xs" variant="icon-only" />
          </div>
        </div>
      </div>

      {/* Secondary Quick Nav on smaller screens (Admin only) */}
      {currentUser?.authRole === 'admin' && (
        <div className="2xl:hidden flex items-center gap-1 px-4 py-1.5 border-t border-[#3b4b37]/50 overflow-x-auto bg-[#080b0f]/80 scrollbar-none">
          <button
            onClick={() => handleNavClick('dashboard', 'employee-telemetry-hub')}
            className="px-2.5 py-1 rounded-md text-[11px] font-mono-data text-[#00ff41] bg-[#00ff41]/10 border border-[#00ff41]/30 font-bold whitespace-nowrap"
          >
            TEAM_USAGE
          </button>
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-mono-data whitespace-nowrap ${
              activeTab === 'dashboard' ? 'text-[#00ff41] bg-[#00ff41]/10 font-bold' : 'text-[#b9ccb2]'
            }`}
          >
            PLAYGROUND
          </button>
          <button
            onClick={() => handleNavClick('dashboard', 'roi-calculator')}
            className="px-2.5 py-1 rounded-md text-[11px] font-mono-data text-[#b9ccb2] hover:text-[#ffba20] whitespace-nowrap"
          >
            ROI_CALCULATOR
          </button>
          <button
            onClick={() => handleNavClick('dashboard', 'architecture')}
            className="px-2.5 py-1 rounded-md text-[11px] font-mono-data text-[#b9ccb2] hover:text-[#00e5ff] whitespace-nowrap"
          >
            ARCHITECTURE
          </button>
          <button
            onClick={() => handleNavClick('simulator')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-mono-data whitespace-nowrap ${
              activeTab === 'simulator' ? 'text-[#00ff41] bg-[#00ff41]/10 font-bold' : 'text-[#b9ccb2]'
            }`}
          >
            SIMULATOR
          </button>
          <button
            onClick={() => handleNavClick('policies')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-mono-data whitespace-nowrap ${
              activeTab === 'policies' ? 'text-[#00ff41] bg-[#00ff41]/10 font-bold' : 'text-[#b9ccb2]'
            }`}
          >
            POLICIES
          </button>
          <button
            onClick={() => handleNavClick('analytics')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-mono-data whitespace-nowrap ${
              activeTab === 'analytics' ? 'text-[#00ff41] bg-[#00ff41]/10 font-bold' : 'text-[#b9ccb2]'
            }`}
          >
            ANALYTICS
          </button>
          <button
            onClick={() => handleNavClick('python')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-mono-data whitespace-nowrap ${
              activeTab === 'python' ? 'text-[#00e5ff] bg-[#00e5ff]/10 font-bold' : 'text-[#b9ccb2]'
            }`}
          >
            PYTHON_SDK
          </button>
          <button
            onClick={() => handleNavClick('docs')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-mono-data whitespace-nowrap ${
              activeTab === 'docs' ? 'text-[#ffba20] bg-[#ffba20]/10 font-bold' : 'text-[#b9ccb2]'
            }`}
          >
            GATEWAY_DOCS
          </button>
          <button
            onClick={() => handleNavClick('routing-log')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-mono-data whitespace-nowrap ${
              activeTab === 'routing-log' ? 'text-[#00e5ff] bg-[#00e5ff]/10 font-bold' : 'text-[#b9ccb2]'
            }`}
          >
            ROUTING_LOG
          </button>
        </div>
      )}
    </header>
  );
};
