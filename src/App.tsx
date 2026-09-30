/**
 * TrimToken AI - Cost-Aware Dynamic LLM Gateway
 * @license Apache-2.0
 */

import React, { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { TopNavBar } from './components/TopNavBar';
import { HeroMetrics } from './components/HeroMetrics';
import { WebsiteHero } from './components/WebsiteHero';
import { WebsiteFooter } from './components/WebsiteFooter';
import { StartupAnimation } from './components/StartupAnimation';
import { AuthPage } from './components/AuthPage';
import { MeteorShower } from './components/MeteorShower';

const ManualQueryPlayground = lazy(() => import('./components/ManualQueryPlayground').then((module) => ({ default: module.ManualQueryPlayground })));
const LiveRoutingStream = lazy(() => import('./components/LiveRoutingStream').then((module) => ({ default: module.LiveRoutingStream })));
const RoutingPoliciesView = lazy(() => import('./components/RoutingPoliciesView').then((module) => ({ default: module.RoutingPoliciesView })));
const AnalyticsView = lazy(() => import('./components/AnalyticsView').then((module) => ({ default: module.AnalyticsView })));
const PythonCodeView = lazy(() => import('./components/PythonCodeView').then((module) => ({ default: module.PythonCodeView })));
const ApiGatewayDocsView = lazy(() => import('./components/ApiGatewayDocsView').then((module) => ({ default: module.ApiGatewayDocsView })));
const SimulatorView = lazy(() => import('./components/SimulatorView').then((module) => ({ default: module.SimulatorView })));
const ManageProvidersModal = lazy(() => import('./components/ManageProvidersModal').then((module) => ({ default: module.ManageProvidersModal })));
const RoiCalculator = lazy(() => import('./components/RoiCalculator').then((module) => ({ default: module.RoiCalculator })));
const ArchitectureSection = lazy(() => import('./components/ArchitectureSection').then((module) => ({ default: module.ArchitectureSection })));
const BenchmarkComparison = lazy(() => import('./components/BenchmarkComparison').then((module) => ({ default: module.BenchmarkComparison })));
const EmployeeActivityDashboard = lazy(() => import('./components/EmployeeActivityDashboard').then((module) => ({ default: module.EmployeeActivityDashboard })));
const RoutingLogTableDemo = lazy(() => import('./components/RoutingLogTableDemo'));

import { ModelPricing, RouterConfig, RoutingDecision, AggregatedStats, UserAccount } from './types';
import { INITIAL_MODELS, FRONTIER_BASELINE_ID } from './lib/modelsData';
import { SAMPLE_QUERIES } from './lib/sampleQueries';
import { routeQuery } from './lib/routerEngine';

export default function App() {
  // Authentication & Identity state - Default to null so first page after animation is Login
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('trimtoken_auth_user');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // ignore corrupted JSON
        }
      }
    }
    return null;
  });

  const [isAuthPageForced, setIsAuthPageForced] = useState(false);

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setIsAuthPageForced(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('trimtoken_auth_user', JSON.stringify(user));
      localStorage.setItem('trimtoken_auth_user', JSON.stringify(user));
    }
  };

  const handleContinueAsGuest = () => {
    const guestUser: UserAccount = {
      id: 'usr_guest',
      name: 'Sandbox Guest',
      email: 'guest@sandbox.local',
      role: 'Community Developer',
      tier: 'Sandbox Guest',
      organization: 'Sandbox Workspace',
      avatarColor: 'from-[#869683] to-[#50604e]',
      initials: 'SG',
      apiTokensAllocated: 5000000,
      apiTokensUsed: 120000,
      createdAt: 'Just now',
      isGuest: true,
    };
    setCurrentUser(guestUser);
    setIsAuthPageForced(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('trimtoken_guest_access', 'true');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthPageForced(true);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('trimtoken_auth_user');
      sessionStorage.removeItem('trimtoken_auth_user');
      sessionStorage.removeItem('trimtoken_guest_access');
    }
  };

  const handleOpenAuth = () => {
    setIsAuthPageForced(true);
  };

  // Navigation & UI state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'simulator' | 'policies' | 'analytics' | 'python' | 'docs' | 'routing-log'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [isManageProvidersOpen, setIsManageProvidersOpen] = useState(false);
  const [showStartupAnimation, setShowStartupAnimation] = useState(() => {
    // Only play once per browser session
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('trimtoken_intro_viewed') !== 'true';
    }
    return true;
  });

  const handleCompleteStartupAnimation = () => {
    setShowStartupAnimation(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('trimtoken_intro_viewed', 'true');
    }
  };

  // Dynamic pricing matrix synced with backend API keys
  const [models, setModels] = useState<ModelPricing[]>(INITIAL_MODELS);
  const [externalQueryTrigger, setExternalQueryTrigger] = useState<{ prompt: string; timestamp: number; targetModelId?: string } | null>(null);

  // Sync active models from server based on configured API keys
  useEffect(() => {
    fetch('/api/models')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.models) && data.models.length > 0) {
          setModels(data.models as ModelPricing[]);
        }
      })
      .catch(() => {
        // Fallback to default
      });
  }, []);

  // Router configuration with simultaneous synthetic enterprise benchmark simulation enabled
  const [routerConfig, setRouterConfig] = useState<RouterConfig>({
    routingStrategy: 'qwen_finetuned',
    costSensitivity: 0.65,
    minQualityThreshold: 70,
    frontierBaselineModelId: FRONTIER_BASELINE_ID,
    isSimulating: true,
    simulationSpeedMs: 2400,
    scenario: 'mixed',
  });

  // Initial enterprise benchmark seed
  const initialSeeds = React.useMemo(() => {
    const defaultCfg: RouterConfig = {
      ...routerConfig,
      isSimulating: true,
    };
    return SAMPLE_QUERIES.slice(0, 5).map((sample) =>
      routeQuery(sample.prompt, models, defaultCfg, sample.sampleResponse, 'BENCHMARK')
    );
  }, [models, routerConfig]);

  // Telemetry state reflecting both user questions and benchmark traffic
  const [naiveCostTotal, setNaiveCostTotal] = useState(0);
  const [realizedCostTotal, setRealizedCostTotal] = useState(0);
  const [totalTokensProcessed, setTotalTokensProcessed] = useState(0);
  const [totalQueries, setTotalQueries] = useState(0);

  // Simultaneous queries stream (user questions + benchmark traffic)
  const [queries, setQueries] = useState<RoutingDecision[]>([]);

  // Model & Complexity counters for aggregated statistics
  const [modelDistribution, setModelDistribution] = useState<Record<string, number>>({});
  const [complexityDistribution, setComplexityDistribution] = useState<Record<any, number>>({});

  useEffect(() => {
    let isMounted = true;

    Promise.all(initialSeeds)
      .then((resolvedSeeds) => {
        if (!isMounted) return;

        setQueries(resolvedSeeds);
        setNaiveCostTotal(resolvedSeeds.reduce((sum, q) => sum + q.naiveCost, 0));
        setRealizedCostTotal(resolvedSeeds.reduce((sum, q) => sum + q.realizedCost, 0));
        setTotalTokensProcessed(
          resolvedSeeds.reduce((sum, q) => sum + q.inputTokens + q.outputTokens, 0)
        );
        setTotalQueries(resolvedSeeds.length);

        const nextModelDistribution: Record<string, number> = {};
        const nextComplexityDistribution: Record<any, number> = {};

        resolvedSeeds.forEach((q) => {
          nextModelDistribution[q.routedModel.id] = (nextModelDistribution[q.routedModel.id] || 0) + 1;
          nextComplexityDistribution[q.complexity] = (nextComplexityDistribution[q.complexity] || 0) + 1;
        });

        setModelDistribution(nextModelDistribution);
        setComplexityDistribution(nextComplexityDistribution);
      })
      .catch(() => {
        if (isMounted) {
          setQueries([]);
          setNaiveCostTotal(0);
          setRealizedCostTotal(0);
          setTotalTokensProcessed(0);
          setTotalQueries(0);
          setModelDistribution({});
          setComplexityDistribution({});
        }
      });

    return () => {
      isMounted = false;
    };
  }, [initialSeeds]);

  // Calculate high-level financial savings
  const dollarsSavedTotal = Math.max(0, naiveCostTotal - realizedCostTotal);
  const percentRetained = naiveCostTotal > 0 ? (dollarsSavedTotal / naiveCostTotal) * 100 : (totalQueries === 0 ? 0 : 100);

  // Handle incoming user query or synthetic benchmark decision
  const handleNewDecision = (decision: RoutingDecision) => {
    setQueries((prev) => [decision, ...prev.slice(0, 199)]); // maintain up to 200 items in memory
    setNaiveCostTotal((prev) => prev + decision.naiveCost);
    setRealizedCostTotal((prev) => prev + decision.realizedCost);
    setTotalTokensProcessed((prev) => prev + decision.inputTokens + decision.outputTokens);
    setTotalQueries((prev) => prev + 1);

    setModelDistribution((prev) => ({
      ...prev,
      [decision.routedModel.id]: (prev[decision.routedModel.id] || 0) + 1,
    }));

    setComplexityDistribution((prev) => ({
      ...prev,
      [decision.complexity]: (prev[decision.complexity] || 0) + 1,
    }));
  };

  // Simultaneous background traffic simulation loop for enterprise benchmark traffic
  const sampleIndexRef = useRef(5);
  useEffect(() => {
    if (!routerConfig.isSimulating) return;

    const interval = setInterval(async () => {
      const filteredSamples = SAMPLE_QUERIES.filter((q) => {
        if (routerConfig.scenario === 'mixed') return true;
        return q.domain === routerConfig.scenario;
      });

      const pool = filteredSamples.length > 0 ? filteredSamples : SAMPLE_QUERIES;
      const sample = pool[sampleIndexRef.current % pool.length];
      sampleIndexRef.current += 1;

      const decision = await routeQuery(sample.prompt, models, routerConfig, sample.sampleResponse, 'BENCHMARK');
      handleNewDecision(decision);
    }, routerConfig.simulationSpeedMs);

    return () => clearInterval(interval);
  }, [routerConfig.isSimulating, routerConfig.simulationSpeedMs, routerConfig.scenario, models, routerConfig.costSensitivity]);

  // Burst traffic trigger
  const handleTriggerBurst = async (count: number) => {
    for (let i = 0; i < count; i++) {
      const sample = SAMPLE_QUERIES[Math.floor(Math.random() * SAMPLE_QUERIES.length)];
      const decision = await routeQuery(sample.prompt, models, routerConfig, sample.sampleResponse, 'BENCHMARK');
      handleNewDecision(decision);
    }
  };

  const handleResetStats = () => {
    setQueries([]);
    setNaiveCostTotal(0.0);
    setRealizedCostTotal(0.0);
    setTotalQueries(0);
    setTotalTokensProcessed(0);
    setModelDistribution({});
    setComplexityDistribution({});
  };

  const aggregatedStats: AggregatedStats = {
    totalQueries,
    naiveCostTotal,
    realizedCostTotal,
    dollarsSavedTotal,
    percentRetained,
    avgLatencySavedMs: 460,
    totalTokensProcessed,
    queriesByModel: modelDistribution,
    queriesByComplexity: complexityDistribution,
  };

  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRunQueryFromTop = (queryText: string, targetModelId?: string) => {
    const clean = queryText.trim();
    if (!clean) return;

    if (activeTab !== 'dashboard') {
      setActiveTab('dashboard');
    }

    setExternalQueryTrigger({ prompt: clean, timestamp: Date.now(), targetModelId });

    // Ensure we scroll towards the interactive playground and answer panel
    setTimeout(() => {
      handleScrollToSection('interactive-playground');
      const answerEl = document.getElementById('answer-panel');
      if (answerEl) {
        answerEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 120);
  };

  if (!currentUser || isAuthPageForced) {
    return (
      <div className="bg-[#080c10] text-[#dfe2eb] min-h-screen font-body selection:bg-[#00ff41]/25 selection:text-[#72ff70]">
        {/* Startup Opening Animation if first time */}
        <StartupAnimation
          isOpen={showStartupAnimation}
          onComplete={handleCompleteStartupAnimation}
        />
        <AuthPage 
          onLoginSuccess={handleLoginSuccess}
          onContinueAsGuest={handleContinueAsGuest}
        />
      </div>
    );
  }

  const isAdmin = currentUser?.authRole === 'admin';
  const handleTabChange = (tab: typeof activeTab) => {
    if (!isAdmin && tab !== 'dashboard' && tab !== 'routing-log') {
      setActiveTab('dashboard');
      return;
    }
    setActiveTab(tab);
  };

  return (
    <div className="bg-[#080c10] text-[#dfe2eb] min-h-screen font-body flex flex-col selection:bg-[#00ff41]/25 selection:text-[#72ff70] relative bg-grid-cyber ambient-glow-green">
      <MeteorShower />
      {/* Startup Opening Animation Matching Video Emblem */}
      <StartupAnimation
        isOpen={showStartupAnimation}
        onComplete={handleCompleteStartupAnimation}
      />

      {/* Fixed Top Navbar */}
      <TopNavBar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isSimulating={routerConfig.isSimulating}
        setIsSimulating={(val) =>
          setRouterConfig((prev) => ({
            ...prev,
            isSimulating: typeof val === 'function' ? val(prev.isSimulating) : val,
          }))
        }
        onResetStats={handleResetStats}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onOpenManageProviders={() => setIsManageProvidersOpen(true)}
        onScrollToSection={handleScrollToSection}
        onRunQueryFromTop={handleRunQueryFromTop}
        onReplayIntro={() => setShowStartupAnimation(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Content Area */}
      <Suspense
        fallback={
          <div className="max-w-[1600px] w-full mx-auto px-4 md:px-6 pt-32 pb-16 flex-grow relative z-10">
            <div className="glass-panel rounded-2xl border border-[#1e2f3d] p-8 text-center text-sm font-mono-data text-[#b9ccb2]">
              Loading workspace...
            </div>
          </div>
        }
      >
      <main className="max-w-[1600px] w-full mx-auto px-4 md:px-6 pt-22 pb-16 flex-grow relative z-10">
        {/* Tab 1: Main Product Website & Interactive Playground */}
        {activeTab === 'dashboard' && (
          <div className="space-y-16 sm:space-y-20">
            {/* Product Hero */}
            <WebsiteHero
              onExplorePlayground={() => handleScrollToSection('interactive-playground')}
              onExploreRoi={() => handleScrollToSection('roi-calculator')}
              onExploreDocs={() => handleTabChange('docs')}
              onExecuteQuery={handleRunQueryFromTop}
              percentRetained={percentRetained}
              totalSaved={dollarsSavedTotal}
              onReplayIntro={() => setShowStartupAnimation(true)}
              isAdmin={isAdmin}
              models={models}
            />

            {/* Interactive Live Playground & Stream Section */}
            <motion.div
              id="interactive-playground"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full scroll-mt-28 pt-2 sm:pt-4"
            >
              {/* Manual Query Input (Employee) or Live Routing Stream (Admin) */}
              <div className="flex w-full min-w-0 flex-col gap-6 h-full lg:min-h-[760px]">
                <div className="glass-panel rounded-2xl overflow-hidden flex flex-col h-full flex-grow border border-[#00ff41]/35 shadow-[0_0_30px_rgba(0,0,0,0.45)]">
                  {/* Manual Query Playground (Employee / Standard User Exclusive) */}
                  {!isAdmin && (
                    <ManualQueryPlayground
                      models={models}
                      routerConfig={routerConfig}
                      onExecuteManualQuery={handleNewDecision}
                      externalQueryTrigger={externalQueryTrigger}
                    />
                  )}

                  {/* User Query Routing Stream Table (Admin Exclusive) */}
                  {isAdmin && (
                    <LiveRoutingStream
                      queries={queries}
                      searchTerm={searchTerm}
                      isSimulating={routerConfig.isSimulating}
                      onClearQueries={handleResetStats}
                      onExecutePresetQuery={handleNewDecision}
                      models={models}
                      routerConfig={routerConfig}
                    />
                  )}
                </div>
              </div>
            </motion.div>

            {/* Admin-Exclusive: Employee Usage, Online/Offline Roster & Telemetry Hub */}
            {isAdmin && (
              <motion.div
                id="employee-telemetry-hub"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="scroll-mt-24"
              >
                <EmployeeActivityDashboard />
              </motion.div>
            )}

            {/* Interactive Enterprise ROI Calculator (Admin Exclusive) */}
            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="scroll-mt-24"
              >
                <RoiCalculator />
              </motion.div>
            )}

            {/* Core Architectural Pillars */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="scroll-mt-24"
            >
              <ArchitectureSection />
            </motion.div>
          </div>
        )}

        {/* Tab 2: Traffic Simulator Studio */}
        {activeTab === 'simulator' && (
          <div className="space-y-8">
            <HeroMetrics
              naiveCost={naiveCostTotal}
              realizedCost={realizedCostTotal}
              dollarsSaved={dollarsSavedTotal}
              percentRetained={percentRetained}
              totalQueries={totalQueries}
            />
            <SimulatorView
              config={routerConfig}
              onChangeConfig={(newCfg) => setRouterConfig((prev) => ({ ...prev, ...newCfg }))}
              onTriggerBurst={handleTriggerBurst}
              recentQueries={queries}
              models={models}
              totalQueries={totalQueries}
            />
          </div>
        )}

        {/* Tab 3: Routing Policies & Pareto Tuning */}
        {activeTab === 'policies' && (
          <div className="space-y-8">
            <HeroMetrics
              naiveCost={naiveCostTotal}
              realizedCost={realizedCostTotal}
              dollarsSaved={dollarsSavedTotal}
              percentRetained={percentRetained}
              totalQueries={totalQueries}
            />
            <RoutingPoliciesView
              config={routerConfig}
              onChangeConfig={(newCfg) => setRouterConfig((prev) => ({ ...prev, ...newCfg }))}
              models={models}
            />
          </div>
        )}

        {/* Tab 4: Analytics */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <HeroMetrics
              naiveCost={naiveCostTotal}
              realizedCost={realizedCostTotal}
              dollarsSaved={dollarsSavedTotal}
              percentRetained={percentRetained}
              totalQueries={totalQueries}
            />
            <AnalyticsView stats={aggregatedStats} models={models} />
          </div>
        )}

        {/* Tab 5: Python Backend MVP Code */}
        {activeTab === 'python' && <PythonCodeView />}

        {/* Tab 6: API Gateway & OpenAI Drop-In Docs */}
        {activeTab === 'docs' && <ApiGatewayDocsView />}

        {/* Routing Log Table Demo */}
        {activeTab === 'routing-log' && <RoutingLogTableDemo queries={queries} />}
      </main>
      </Suspense>

      {/* Global Product Website Footer */}
      <WebsiteFooter onNavigateTab={handleTabChange} />

      {/* Manage Providers Modal */}
      <Suspense fallback={null}>
        <ManageProvidersModal
          isOpen={isManageProvidersOpen}
          onClose={() => setIsManageProvidersOpen(false)}
          models={models}
          onUpdateModels={(updated) => setModels(updated)}
          onResetToDefaults={() => {
            setModels(INITIAL_MODELS);
          }}
        />
      </Suspense>
    </div>
  );
}
