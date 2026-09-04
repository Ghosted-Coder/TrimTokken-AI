export type QueryComplexity = 'SIMPLE' | 'EXTRACTION' | 'REASONING' | 'CODE' | 'CREATIVE' | 'COMPLEX';

export type ModelTier = 'ULTRA_CHEAP' | 'EDGE' | 'MID' | 'FRONTIER';

export interface ModelPricing {
  id: string;
  name: string;
  provider: string;
  tier: ModelTier;
  promptPricePerM: number;     // USD per 1M prompt tokens
  completionPricePerM: number; // USD per 1M completion tokens
  latencyAvgMs: number;
  qualityScore: number;        // 0 to 100 benchmark score (e.g. MMLU / Coding)
  bestFor: QueryComplexity[];
  active: boolean;
  hasKey?: boolean;
  color: string;
}

export interface RoutingDecision {
  id: string;
  timestamp: string;
  prompt: string;
  complexity: QueryComplexity;
  complexityScore: number;     // 0.0 to 1.0
  heuristicSignals: string[];
  knnNearestCluster: string;
  vectorSimilarity: number;    // e.g. 0.94
  naiveModel: string;
  naiveCost: number;           // in USD
  routedModel: ModelPricing;
  realizedCost: number;        // in USD
  costSaved: number;           // in USD
  savingsPercentage: number;   // e.g. 88.5%
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
  status: 'SUCCESS' | 'ROUTED' | 'FALLBACK';
  source?: 'USER' | 'BENCHMARK';
  routerEngine?: string;       // Fine-tuned Qwen routing classifier
  responseSnippet?: string;
  fullResponse?: string;
}

export interface RouterConfig {
  routingStrategy: 'qwen_finetuned' | 'langchain_cscr' | 'langchain_router_chain' | 'langchain_semantic' | 'langchain_cost_greedy' | 'cscr_contrastive' | 'knn_pricing' | 'heuristic_tier' | 'cost_greedy';
  costSensitivity: number;      // 0.0 (Quality Max) to 1.0 (Cost Max)
  minQualityThreshold: number;  // 0 to 100
  frontierBaselineModelId: string;
  isSimulating: boolean;
  simulationSpeedMs: number;    // interval between queries
  scenario: 'mixed' | 'ecommerce_support' | 'developer_copilot' | 'legal_finance';
}

export interface AggregatedStats {
  totalQueries: number;
  naiveCostTotal: number;
  realizedCostTotal: number;
  dollarsSavedTotal: number;
  percentRetained: number;
  avgLatencySavedMs: number;
  totalTokensProcessed: number;
  queriesByModel: Record<string, number>;
  queriesByComplexity: Record<QueryComplexity, number>;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  authRole?: 'admin' | 'employee';
  tier: 'Enterprise' | 'FinOps Pro' | 'Developer' | 'Sandbox Guest';
  organization: string;
  avatarColor: string;
  initials: string;
  apiTokensAllocated: number;
  apiTokensUsed: number;
  createdAt: string;
  isGuest?: boolean;
}

export interface EmployeeRecentQuery {
  id: string;
  timestamp: string;
  prompt: string;
  complexity: QueryComplexity;
  routedModel: string;
  costSaved: number;
  tokens: number;
}

export interface EmployeeUsageRecord {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  department: 'Engineering' | 'AI / Research' | 'Product' | 'Customer Ops' | 'Data Science';
  role: string;
  avatarColor: string;
  initials: string;
  status: 'ONLINE' | 'IDLE' | 'OFFLINE';
  lastActive: string;
  lastActiveTimeMs: number;
  totalQueries: number;
  tokensConsumed: number;
  tokensLimit: number;
  costRealized: number;
  costBaseline: number;
  costSaved: number;
  savingsPercentage: number;
  primaryModels: string[];
  recentQueries: EmployeeRecentQuery[];
}
