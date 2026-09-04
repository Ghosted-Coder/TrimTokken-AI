import React, { useState, useMemo } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Search,
  Filter,
  DollarSign,
  Zap,
  TrendingUp,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  ChevronDown,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Plus,
  BarChart3,
  X,
  CheckCircle2,
  Cpu,
  Layers,
  FileText,
  Sliders,
  Download,
} from 'lucide-react';
import { EmployeeUsageRecord, QueryComplexity } from '../types';
import { INITIAL_EMPLOYEES } from '../data/mockEmployees';

interface EmployeeActivityDashboardProps {
  onSimulateEmployeeQuery?: (employeeId: string) => void;
}

export const EmployeeActivityDashboard: React.FC<EmployeeActivityDashboardProps> = ({
  onSimulateEmployeeQuery,
}) => {
  const [employees, setEmployees] = useState<EmployeeUsageRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('trimtoken_employee_records');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore corrupted data
        }
      }
    }
    return INITIAL_EMPLOYEES;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ONLINE' | 'IDLE' | 'OFFLINE'>('ALL');
  const [deptFilter, setDeptFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'costSaved' | 'totalQueries' | 'tokens' | 'lastActive'>('costSaved');
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeUsageRecord | null>(null);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [newEmployeeEmail, setNewEmployeeEmail] = useState('');
  const [newEmployeeDept, setNewEmployeeDept] = useState<'Engineering' | 'AI / Research' | 'Product' | 'Customer Ops' | 'Data Science'>('Engineering');
  const [newEmployeeRole, setNewEmployeeRole] = useState('');
  const [newEmployeeQuota, setNewEmployeeQuota] = useState('15');
  const [isSimulating, setIsSimulating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save to localStorage whenever updated
  const updateEmployeesState = (newEmployees: EmployeeUsageRecord[]) => {
    setEmployees(newEmployees);
    if (typeof window !== 'undefined') {
      localStorage.setItem('trimtoken_employee_records', JSON.stringify(newEmployees));
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // High-level aggregates
  const stats = useMemo(() => {
    const total = employees.length;
    const online = employees.filter((e) => e.status === 'ONLINE').length;
    const idle = employees.filter((e) => e.status === 'IDLE').length;
    const offline = employees.filter((e) => e.status === 'OFFLINE').length;
    const totalQueries = employees.reduce((acc, curr) => acc + curr.totalQueries, 0);
    const totalTokens = employees.reduce((acc, curr) => acc + curr.tokensConsumed, 0);
    const totalCostRealized = employees.reduce((acc, curr) => acc + curr.costRealized, 0);
    const totalCostBaseline = employees.reduce((acc, curr) => acc + curr.costBaseline, 0);
    const totalCostSaved = employees.reduce((acc, curr) => acc + curr.costSaved, 0);
    const overallSavingsPct = totalCostBaseline > 0 ? (totalCostSaved / totalCostBaseline) * 100 : 0;

    return {
      total,
      online,
      idle,
      offline,
      totalQueries,
      totalTokens,
      totalCostRealized,
      totalCostBaseline,
      totalCostSaved,
      overallSavingsPct,
    };
  }, [employees]);

  // Filtered & Sorted employees
  const filteredEmployees = useMemo(() => {
    return employees
      .filter((emp) => {
        // Status filter
        if (statusFilter !== 'ALL' && emp.status !== statusFilter) {
          return false;
        }
        // Dept filter
        if (deptFilter !== 'ALL' && emp.department !== deptFilter) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = emp.name.toLowerCase().includes(q);
          const matchEmail = emp.email.toLowerCase().includes(q);
          const matchId = emp.employeeId.toLowerCase().includes(q);
          const matchRole = emp.role.toLowerCase().includes(q);
          const matchDept = emp.department.toLowerCase().includes(q);
          return matchName || matchEmail || matchId || matchRole || matchDept;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'costSaved') return b.costSaved - a.costSaved;
        if (sortBy === 'totalQueries') return b.totalQueries - a.totalQueries;
        if (sortBy === 'tokens') return b.tokensConsumed - a.tokensConsumed;
        if (sortBy === 'lastActive') return b.lastActiveTimeMs - a.lastActiveTimeMs;
        return 0;
      });
  }, [employees, statusFilter, deptFilter, searchQuery, sortBy]);

  // Simulate an employee query
  const handleTriggerSimulatedQuery = (empId?: string) => {
    setIsSimulating(true);
    const targetId = empId || (employees.find((e) => e.status === 'ONLINE')?.id || employees[0].id);

    setTimeout(() => {
      const samplePrompts = [
        { text: 'Parse and validate JSON payload against OpenAPI 3.1 schema', comp: 'EXTRACTION' as QueryComplexity, model: 'Gemini 1.5 Flash', tokens: 1840, saved: 0.016 },
        { text: 'Generate asynchronous retry exponential backoff handler in Go', comp: 'CODE' as QueryComplexity, model: 'DeepSeek-V3', tokens: 3200, saved: 0.044 },
        { text: 'Analyze multi-region failover latency impact for Redis cache cluster', comp: 'REASONING' as QueryComplexity, model: 'Claude 3.5 Haiku', tokens: 2450, saved: 0.022 },
        { text: 'What is 1024 * 768 / 120?', comp: 'SIMPLE' as QueryComplexity, model: 'Gemini 1.5 Flash', tokens: 320, saved: 0.008 },
        { text: 'Draft enterprise security attestation summary for SOC2 Type II compliance', comp: 'CREATIVE' as QueryComplexity, model: 'GPT-4o Mini', tokens: 2100, saved: 0.026 },
      ];
      const randomPrompt = samplePrompts[Math.floor(Math.random() * samplePrompts.length)];

      const updated = employees.map((emp) => {
        if (emp.id === targetId) {
          const newCostSaved = Number((emp.costSaved + randomPrompt.saved).toFixed(2));
          const newRealized = Number((emp.costRealized + 0.004).toFixed(2));
          const newBaseline = Number((emp.costBaseline + randomPrompt.saved + 0.004).toFixed(2));
          const newQueries = emp.totalQueries + 1;
          const newTokens = emp.tokensConsumed + randomPrompt.tokens;
          const newPct = Number(((newCostSaved / newBaseline) * 100).toFixed(1));

          const newQueryItem = {
            id: `q_sim_${Date.now()}`,
            timestamp: 'Just now',
            prompt: randomPrompt.text,
            complexity: randomPrompt.comp,
            routedModel: randomPrompt.model,
            costSaved: randomPrompt.saved,
            tokens: randomPrompt.tokens,
          };

          return {
            ...emp,
            status: 'ONLINE' as const,
            lastActive: 'Just now',
            lastActiveTimeMs: Date.now(),
            totalQueries: newQueries,
            tokensConsumed: newTokens,
            costRealized: newRealized,
            costBaseline: newBaseline,
            costSaved: newCostSaved,
            savingsPercentage: newPct,
            recentQueries: [newQueryItem, ...emp.recentQueries.slice(0, 9)],
          };
        }
        return emp;
      });

      updateEmployeesState(updated);
      setIsSimulating(false);
      const targetEmp = employees.find((e) => e.id === targetId);
      showToast(`Routed query for ${targetEmp?.name || 'Employee'}: Saved $${randomPrompt.saved.toFixed(3)} via ${randomPrompt.model}`);

      if (selectedEmployee && selectedEmployee.id === targetId) {
        const refreshed = updated.find((e) => e.id === targetId);
        if (refreshed) setSelectedEmployee(refreshed);
      }

      if (onSimulateEmployeeQuery) {
        onSimulateEmployeeQuery(targetId);
      }
    }, 450);
  };

  // Add new employee handler
  const handleAddEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmployeeName.trim() || !newEmployeeEmail.trim()) return;

    const initials = newEmployeeName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

    const colors = [
      'from-[#00e5ff] to-[#0099b8]',
      'from-[#00ff41] to-[#00a825]',
      'from-[#ffba20] to-[#d48800]',
      'from-[#d946ef] to-[#9333ea]',
      'from-[#3b82f6] to-[#1d4ed8]',
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const quotaNumber = (parseFloat(newEmployeeQuota) || 15) * 1000000;

    const newRec: EmployeeUsageRecord = {
      id: `emp_${Date.now()}`,
      name: newEmployeeName.trim(),
      email: newEmployeeEmail.trim(),
      employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      department: newEmployeeDept,
      role: newEmployeeRole.trim() || 'Software Engineer',
      avatarColor: randomColor,
      initials: initials || 'EM',
      status: 'ONLINE',
      lastActive: 'Just enrolled',
      lastActiveTimeMs: Date.now(),
      totalQueries: 0,
      tokensConsumed: 0,
      tokensLimit: quotaNumber,
      costRealized: 0,
      costBaseline: 0,
      costSaved: 0,
      savingsPercentage: 0,
      primaryModels: ['Gemini 1.5 Flash', 'Claude 3.5 Haiku'],
      recentQueries: [],
    };

    const updated = [newRec, ...employees];
    updateEmployeesState(updated);
    setIsAddEmployeeOpen(false);
    setNewEmployeeName('');
    setNewEmployeeEmail('');
    setNewEmployeeRole('');
    showToast(`Successfully registered ${newRec.name} to enterprise workspace.`);
  };

  // Reset to initial mock records
  const handleResetToDefaults = () => {
    updateEmployeesState(INITIAL_EMPLOYEES);
    showToast('Reset employee records to benchmark enterprise seed.');
  };

  // Export JSON summary
  const handleExportSummary = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(employees, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `trimtoken_employee_telemetry_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Employee telemetry report exported successfully.');
  };

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-7 border border-[#3b4b37]/60 shadow-[0_0_35px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col gap-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 right-4 z-50 px-4 py-2.5 rounded-xl bg-[#080d14] border border-[#00ff41] text-[#00ff41] font-mono-data text-xs font-semibold shadow-[0_0_20px_rgba(0,255,65,0.4)] flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#00ff41]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Control Plane Identity */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-[#3b4b37]/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00ff41]/10 border border-[#00ff41]/40 flex items-center justify-center text-[#00ff41] shadow-[0_0_15px_rgba(0,255,65,0.2)]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold font-display text-white tracking-tight">
                Enterprise Employee Usage & Activity Hub
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono-data font-bold bg-[#00ff41]/15 text-[#00ff41] border border-[#00ff41]/40">
                ADMIN CONSOLE
              </span>
            </div>
            <p className="text-xs text-[#869683] mt-0.5">
              Live telemetry tracking of team member token allocations, active routing decisions, and financial savings.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => handleTriggerSimulatedQuery()}
            disabled={isSimulating}
            className="px-3.5 py-2 rounded-xl bg-[#00ff41]/10 hover:bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/40 hover:border-[#00ff41] text-xs font-mono-data font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
            title="Simulate a real-time prompt routed for an active employee"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>SIMULATE LIVE QUERY</span>
          </button>

          <button
            onClick={() => setIsAddEmployeeOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#1c222c] hover:bg-[#252e3b] text-white border border-[#3b4b37] hover:border-[#00e5ff]/50 text-xs font-mono-data font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#00e5ff]" />
            <span>INVITE EMPLOYEE</span>
          </button>

          <button
            onClick={handleExportSummary}
            className="p-2 rounded-xl bg-[#14181f] hover:bg-[#1c222c] text-[#869683] hover:text-white border border-[#3b4b37] transition-all cursor-pointer"
            title="Export JSON telemetry report"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4-Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Employees */}
        <div className="p-4 rounded-xl bg-[#090d13] border border-[#3b4b37]/60 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono-data text-[#869683] font-bold">TOTAL REGISTERED</span>
            <Users className="w-4 h-4 text-[#869683]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono-data text-white">{stats.total}</span>
            <span className="text-xs text-[#869683] font-mono-data">Team Members</span>
          </div>
          <div className="mt-2 text-[10px] text-[#869683] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41]"></span>
            <span>Across 5 organizational departments</span>
          </div>
        </div>

        {/* Online vs Offline Status Split */}
        <div className="p-4 rounded-xl bg-[#090d13] border border-[#00ff41]/30 flex flex-col justify-between shadow-[0_0_15px_rgba(0,255,65,0.06)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono-data text-[#00ff41] font-bold">ACTIVE ROUTING NOW</span>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff41] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00ff41]"></span>
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono-data text-[#00ff41] glow-text-green">
              {stats.online}
            </span>
            <span className="text-xs text-[#869683] font-mono-data">Online / {stats.idle} Idle / {stats.offline} Offline</span>
          </div>
          <div className="mt-2 w-full bg-[#1c222c] h-1.5 rounded-full overflow-hidden flex">
            <div className="bg-[#00ff41] h-full" style={{ width: `${(stats.online / stats.total) * 100}%` }} title="Online"></div>
            <div className="bg-[#ffba20] h-full" style={{ width: `${(stats.idle / stats.total) * 100}%` }} title="Idle"></div>
            <div className="bg-[#50604e] h-full" style={{ width: `${(stats.offline / stats.total) * 100}%` }} title="Offline"></div>
          </div>
        </div>

        {/* Total Cost Saved by Team */}
        <div className="p-4 rounded-xl bg-[#090d13] border border-[#3b4b37]/60 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono-data text-[#869683] font-bold">TEAM DOLLARS SAVED</span>
            <DollarSign className="w-4 h-4 text-[#00ff41]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono-data text-[#00ff41]">
              ${stats.totalCostSaved.toFixed(2)}
            </span>
            <span className="text-xs font-mono-data px-1.5 py-0.5 rounded bg-[#00ff41]/15 text-[#00ff41] border border-[#00ff41]/30 font-bold">
              +{stats.overallSavingsPct.toFixed(1)}%
            </span>
          </div>
          <div className="mt-2 text-[10px] text-[#869683] font-mono-data">
            Baseline: ${stats.totalCostBaseline.toFixed(2)} | Realized: ${stats.totalCostRealized.toFixed(2)}
          </div>
        </div>

        {/* Total Queries & Tokens Routed */}
        <div className="p-4 rounded-xl bg-[#090d13] border border-[#3b4b37]/60 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono-data text-[#869683] font-bold">ROUTED THROUGHPUT</span>
            <Zap className="w-4 h-4 text-[#00e5ff]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono-data text-[#00e5ff]">
              {stats.totalQueries.toLocaleString()}
            </span>
            <span className="text-xs text-[#869683] font-mono-data">Queries</span>
          </div>
          <div className="mt-2 text-[10px] text-[#869683] font-mono-data">
            {(stats.totalTokens / 1000000).toFixed(1)}M Tokens dynamically optimized
          </div>
        </div>
      </div>

      {/* Filter, Search & Sort Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-xl bg-[#080d14] border border-[#3b4b37]/50">
        {/* Search Bar */}
        <div className="relative flex-grow max-w-md">
          <Search className="w-4 h-4 text-[#869683] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employee by name, ID (e.g. EMP-9041), email, or role..."
            className="w-full bg-[#10141b] border border-[#3b4b37]/60 focus:border-[#00ff41] rounded-xl pl-9 pr-8 py-2 text-xs font-mono-data text-white placeholder:text-[#869683] focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#869683] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills & Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Segmented Buttons */}
          <div className="flex items-center rounded-lg bg-[#10141b] border border-[#3b4b37]/60 p-0.5 text-xs font-mono-data">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                statusFilter === 'ALL' ? 'bg-[#00ff41]/20 text-[#00ff41] font-bold' : 'text-[#869683] hover:text-white'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setStatusFilter('ONLINE')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                statusFilter === 'ONLINE' ? 'bg-[#00ff41] text-[#003907] font-bold' : 'text-[#869683] hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41] inline-block"></span>
              Online ({stats.online})
            </button>
            <button
              onClick={() => setStatusFilter('IDLE')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                statusFilter === 'IDLE' ? 'bg-[#ffba20] text-[#4d3000] font-bold' : 'text-[#869683] hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffba20] inline-block"></span>
              Idle ({stats.idle})
            </button>
            <button
              onClick={() => setStatusFilter('OFFLINE')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                statusFilter === 'OFFLINE' ? 'bg-[#50604e] text-white font-bold' : 'text-[#869683] hover:text-white'
              }`}
            >
              Offline ({stats.offline})
            </button>
          </div>

          {/* Department Filter */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-[#10141b] border border-[#3b4b37]/60 text-[#dfe2eb] text-xs font-mono-data rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#00ff41] cursor-pointer"
          >
            <option value="ALL">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="AI / Research">AI / Research</option>
            <option value="Product">Product</option>
            <option value="Customer Ops">Customer Ops</option>
            <option value="Data Science">Data Science</option>
          </select>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#10141b] border border-[#3b4b37]/60 text-[#dfe2eb] text-xs font-mono-data rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#00ff41] cursor-pointer"
          >
            <option value="costSaved">Sort: Highest Cost Saved ($)</option>
            <option value="totalQueries">Sort: Most Queries Routed</option>
            <option value="tokens">Sort: Most Tokens Consumed</option>
            <option value="lastActive">Sort: Most Recently Active</option>
          </select>
        </div>
      </div>

      {/* Employee Activity Table */}
      <div className="overflow-x-auto rounded-xl border border-[#3b4b37]/50 bg-[#090d13]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#10151d] text-[#869683] text-[11px] font-mono-data border-b border-[#3b4b37]/60">
              <th className="py-3 px-4 font-bold">EMPLOYEE / ID</th>
              <th className="py-3 px-3 font-bold">DEPARTMENT & ROLE</th>
              <th className="py-3 px-3 font-bold">STATUS / LAST ACTIVE</th>
              <th className="py-3 px-3 font-bold">TOKEN QUOTA USAGE</th>
              <th className="py-3 px-3 font-bold">ROUTED QUERIES</th>
              <th className="py-3 px-3 font-bold">NET SAVINGS ($)</th>
              <th className="py-3 px-3 font-bold">PRIMARY MODELS</th>
              <th className="py-3 px-4 font-bold text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e2630]/60 text-xs font-mono-data">
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-[#869683]">
                  <Users className="w-8 h-8 mx-auto mb-2 text-[#3b4b37]" />
                  <span>No employees found matching filter criteria.</span>
                </td>
              </tr>
            ) : (
              filteredEmployees.map((emp) => {
                const tokenUsagePct = Math.min(100, Math.round((emp.tokensConsumed / emp.tokensLimit) * 100));

                return (
                  <tr
                    key={emp.id}
                    className="hover:bg-[#121822] transition-colors group cursor-pointer"
                    onClick={() => setSelectedEmployee(emp)}
                  >
                    {/* Employee Identity */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${emp.avatarColor} text-[#080c10] font-bold text-xs flex items-center justify-center font-mono-data shadow-sm`}>
                            {emp.initials}
                          </div>
                          {/* Live Status Indicator Dot */}
                          <span
                            className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-[#090d13] ${
                              emp.status === 'ONLINE'
                                ? 'bg-[#00ff41]'
                                : emp.status === 'IDLE'
                                ? 'bg-[#ffba20]'
                                : 'bg-[#50604e]'
                            }`}
                          ></span>
                        </div>
                        <div className="flex flex-col">
                          <div className="font-bold text-white group-hover:text-[#00ff41] transition-colors flex items-center gap-1.5">
                            <span>{emp.name}</span>
                          </div>
                          <div className="text-[10px] text-[#869683]">{emp.employeeId} • {emp.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Department & Role */}
                    <td className="py-3 px-3">
                      <div className="flex flex-col">
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold w-fit ${
                          emp.department === 'Engineering'
                            ? 'bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30'
                            : emp.department === 'AI / Research'
                            ? 'bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/30'
                            : emp.department === 'Product'
                            ? 'bg-[#d946ef]/10 text-[#d946ef] border border-[#d946ef]/30'
                            : emp.department === 'Customer Ops'
                            ? 'bg-[#ffba20]/10 text-[#ffba20] border border-[#ffba20]/30'
                            : 'bg-[#14b8a6]/10 text-[#14b8a6] border border-[#14b8a6]/30'
                        }`}>
                          {emp.department}
                        </span>
                        <span className="text-[10px] text-[#dfe2eb] mt-0.5 truncate max-w-[140px]">{emp.role}</span>
                      </div>
                    </td>

                    {/* Status & Last Active */}
                    <td className="py-3 px-3">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              emp.status === 'ONLINE'
                                ? 'bg-[#00ff41]/15 text-[#00ff41] border border-[#00ff41]/40'
                                : emp.status === 'IDLE'
                                ? 'bg-[#ffba20]/15 text-[#ffba20] border border-[#ffba20]/40'
                                : 'bg-[#50604e]/20 text-[#869683] border border-[#50604e]/40'
                            }`}
                          >
                            {emp.status}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#869683] mt-0.5 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" /> {emp.lastActive}
                        </span>
                      </div>
                    </td>

                    {/* Token Quota Progress */}
                    <td className="py-3 px-3 min-w-[130px]">
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-white font-bold">{(emp.tokensConsumed / 1000000).toFixed(1)}M</span>
                          <span className="text-[#869683]">/ {(emp.tokensLimit / 1000000).toFixed(0)}M ({tokenUsagePct}%)</span>
                        </div>
                        <div className="w-full bg-[#1c222c] h-1.5 rounded-full overflow-hidden mt-1">
                          <div
                            className={`h-full rounded-full transition-all ${
                              tokenUsagePct > 85
                                ? 'bg-[#ff5449]'
                                : tokenUsagePct > 60
                                ? 'bg-[#ffba20]'
                                : 'bg-[#00e5ff]'
                            }`}
                            style={{ width: `${tokenUsagePct}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    {/* Routed Queries */}
                    <td className="py-3 px-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-xs">{emp.totalQueries.toLocaleString()}</span>
                        <span className="text-[10px] text-[#869683]">{emp.recentQueries.length} recent logged</span>
                      </div>
                    </td>

                    {/* Net Savings ($) */}
                    <td className="py-3 px-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#00ff41] text-xs">${emp.costSaved.toFixed(2)}</span>
                        <span className="text-[10px] text-[#00ff41]/80">+{emp.savingsPercentage}% saved</span>
                      </div>
                    </td>

                    {/* Primary Routed Models */}
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1 max-w-[170px]">
                        {emp.primaryModels.slice(0, 2).map((m, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded bg-[#1c222c] text-[#dfe2eb] text-[9px] border border-[#3b4b37]/60 truncate"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Action Button */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEmployee(emp);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#141a22] hover:bg-[#00ff41]/15 text-[#dfe2eb] hover:text-[#00ff41] border border-[#3b4b37] hover:border-[#00ff41]/50 text-[10px] font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>INSPECT</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Controls & Stats Summary */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-data text-[#869683] pt-2 border-t border-[#3b4b37]/40">
        <div>
          Showing <span className="text-white font-bold">{filteredEmployees.length}</span> of{' '}
          <span className="text-white font-bold">{employees.length}</span> employees • Real-time telemetry feed active
        </div>

        <button
          onClick={handleResetToDefaults}
          className="text-[#869683] hover:text-[#00ff41] transition-colors flex items-center gap-1 cursor-pointer text-[11px]"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset Sample Telemetry Seed</span>
        </button>
      </div>

      {/* Employee Detail Inspector Modal / Drawer */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-3xl rounded-2xl border border-[#00ff41]/40 shadow-[0_0_50px_rgba(0,255,65,0.2)] overflow-hidden flex flex-col max-h-[90vh] bg-[#090d13] animate-fade-in">
            {/* Modal Header */}
            <div className="p-5 bg-[#10151d] border-b border-[#3b4b37]/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${selectedEmployee.avatarColor} text-[#080c10] font-extrabold text-base flex items-center justify-center font-mono-data shadow-md`}>
                  {selectedEmployee.initials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white font-display">{selectedEmployee.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono-data font-bold ${
                      selectedEmployee.status === 'ONLINE'
                        ? 'bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/40'
                        : selectedEmployee.status === 'IDLE'
                        ? 'bg-[#ffba20]/20 text-[#ffba20] border border-[#ffba20]/40'
                        : 'bg-[#50604e]/30 text-[#869683] border border-[#50604e]/50'
                    }`}>
                      {selectedEmployee.status}
                    </span>
                  </div>
                  <div className="text-xs text-[#869683] font-mono-data">
                    {selectedEmployee.employeeId} • {selectedEmployee.email} • {selectedEmployee.department} ({selectedEmployee.role})
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedEmployee(null)}
                className="p-1.5 rounded-lg bg-[#1c222c] text-[#869683] hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Financial & Token Efficiency Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-[#141a22] border border-[#3b4b37]/50">
                  <div className="text-[10px] font-mono-data text-[#869683]">TOTAL COST SAVED</div>
                  <div className="text-xl font-bold font-mono-data text-[#00ff41] mt-1">
                    ${selectedEmployee.costSaved.toFixed(2)}
                  </div>
                  <div className="text-[10px] font-mono-data text-[#00ff41]/80 mt-0.5">
                    +{selectedEmployee.savingsPercentage}% vs frontier baseline
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#141a22] border border-[#3b4b37]/50">
                  <div className="text-[10px] font-mono-data text-[#869683]">TOTAL QUERIES ROUTED</div>
                  <div className="text-xl font-bold font-mono-data text-[#00e5ff] mt-1">
                    {selectedEmployee.totalQueries.toLocaleString()}
                  </div>
                  <div className="text-[10px] font-mono-data text-[#869683] mt-0.5">
                    Last active: {selectedEmployee.lastActive}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#141a22] border border-[#3b4b37]/50">
                  <div className="text-[10px] font-mono-data text-[#869683]">TOKEN QUOTA STATUS</div>
                  <div className="text-xl font-bold font-mono-data text-white mt-1">
                    {(selectedEmployee.tokensConsumed / 1000000).toFixed(2)}M
                  </div>
                  <div className="text-[10px] font-mono-data text-[#869683] mt-0.5">
                    Limit: {(selectedEmployee.tokensLimit / 1000000).toFixed(0)}M tokens
                  </div>
                </div>
              </div>

              {/* Recent Query Activity Log */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold font-mono-data text-white flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#00ff41]" />
                    RECENT QUERY ROUTING AUDIT TRAIL
                  </h4>
                  <button
                    onClick={() => handleTriggerSimulatedQuery(selectedEmployee.id)}
                    disabled={isSimulating}
                    className="text-[11px] font-mono-data text-[#00ff41] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Run Query as {selectedEmployee.name.split(' ')[0]}</span>
                  </button>
                </div>

                {selectedEmployee.recentQueries.length === 0 ? (
                  <div className="p-6 rounded-xl bg-[#10151d] text-center text-xs text-[#869683] font-mono-data">
                    No recent query activity logged for this employee yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedEmployee.recentQueries.map((q) => (
                      <div
                        key={q.id}
                        className="p-3 rounded-xl bg-[#10151d] border border-[#3b4b37]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono-data"
                      >
                        <div className="flex flex-col gap-1 max-w-lg">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#00e5ff]/15 text-[#00e5ff] font-bold border border-[#00e5ff]/30">
                              {q.complexity}
                            </span>
                            <span className="text-[10px] text-[#869683]">{q.timestamp}</span>
                          </div>
                          <p className="text-white text-xs truncate">{q.prompt}</p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <div className="text-xs font-bold text-[#dfe2eb]">{q.routedModel}</div>
                            <div className="text-[10px] text-[#00ff41]">Saved +${q.costSaved.toFixed(3)}</div>
                          </div>
                          <div className="text-[10px] text-[#869683] bg-[#1c222c] px-2 py-1 rounded">
                            {q.tokens} tkn
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#10151d] border-t border-[#3b4b37]/60 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedEmployee(null)}
                className="px-4 py-2 rounded-xl bg-[#1c222c] hover:bg-[#252e3b] text-white font-mono-data text-xs font-bold transition-all cursor-pointer"
              >
                CLOSE AUDIT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite / Add Employee Modal */}
      {isAddEmployeeOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-[#00ff41]/40 shadow-[0_0_50px_rgba(0,255,65,0.2)] overflow-hidden flex flex-col bg-[#090d13] animate-fade-in">
            <div className="p-5 bg-[#10151d] border-b border-[#3b4b37]/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#00ff41]" />
                <h3 className="text-sm font-bold text-white font-display">Enroll Employee into Workspace</h3>
              </div>
              <button
                onClick={() => setIsAddEmployeeOpen(false)}
                className="p-1 rounded-lg bg-[#1c222c] text-[#869683] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEmployeeSubmit} className="p-5 space-y-4 font-mono-data text-xs">
              <div>
                <label className="block text-[#869683] mb-1 font-bold">FULL NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Hayes"
                  value={newEmployeeName}
                  onChange={(e) => setNewEmployeeName(e.target.value)}
                  className="w-full bg-[#10141b] border border-[#3b4b37]/60 focus:border-[#00ff41] rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#869683] mb-1 font-bold">COMPANY EMAIL</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. jordan.hayes@company.com"
                  value={newEmployeeEmail}
                  onChange={(e) => setNewEmployeeEmail(e.target.value)}
                  className="w-full bg-[#10141b] border border-[#3b4b37]/60 focus:border-[#00ff41] rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#869683] mb-1 font-bold">DEPARTMENT</label>
                  <select
                    value={newEmployeeDept}
                    onChange={(e) => setNewEmployeeDept(e.target.value as any)}
                    className="w-full bg-[#10141b] border border-[#3b4b37]/60 focus:border-[#00ff41] rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="AI / Research">AI / Research</option>
                    <option value="Product">Product</option>
                    <option value="Customer Ops">Customer Ops</option>
                    <option value="Data Science">Data Science</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#869683] mb-1 font-bold">MONTHLY TOKEN LIMIT</label>
                  <select
                    value={newEmployeeQuota}
                    onChange={(e) => setNewEmployeeQuota(e.target.value)}
                    className="w-full bg-[#10141b] border border-[#3b4b37]/60 focus:border-[#00ff41] rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="10">10 Million Tokens</option>
                    <option value="15">15 Million Tokens</option>
                    <option value="25">25 Million Tokens</option>
                    <option value="50">50 Million Tokens</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#869683] mb-1 font-bold">JOB ROLE / TITLE</label>
                <input
                  type="text"
                  placeholder="e.g. Full Stack Engineer"
                  value={newEmployeeRole}
                  onChange={(e) => setNewEmployeeRole(e.target.value)}
                  className="w-full bg-[#10141b] border border-[#3b4b37]/60 focus:border-[#00ff41] rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddEmployeeOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-[#1c222c] text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#00ff41] text-[#003907] font-bold hover:bg-[#72ff70]"
                >
                  Confirm Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
