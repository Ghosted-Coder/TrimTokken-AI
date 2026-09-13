import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Cpu, 
  Globe,
  Shield,
  Briefcase,
  Sparkles,
  Server
} from 'lucide-react';
import { TrimTokenLogo } from './TrimTokenLogo';
import { MeteorShower } from './MeteorShower';
import { UserAccount } from '../types';

interface AuthPageProps {
  onLoginSuccess: (user: UserAccount) => void;
  onContinueAsGuest?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess, onContinueAsGuest }) => {
  const [authRole, setAuthRole] = useState<'admin' | 'employee'>('admin');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  // Form Fields
  const [email, setEmail] = useState('admin@trimtoken.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [orgName, setOrgName] = useState('');
  const [selectedTier, setSelectedTier] = useState<'Enterprise' | 'FinOps Pro' | 'Developer'>('Enterprise');
  const [gatewayRegion, setGatewayRegion] = useState<'us-east' | 'eu-central' | 'global-anycast'>('global-anycast');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  
  // Interactive UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authStepMessage, setAuthStepMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Switch role handler with realistic default presets
  const handleRoleChange = (newRole: 'admin' | 'employee') => {
    setAuthRole(newRole);
    setErrorMessage('');
    if (mode === 'signin') {
      if (newRole === 'admin') {
        setEmail('admin@trimtoken.ai');
        setPassword('TrimTokenAdmin#2026');
      } else {
        setEmail('alex.employee@neuraltech.io');
        setPassword('EmployeePass#2026');
      }
    }
  };

  // Email validator
  const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const passwordStrength = getPasswordStrength(password);

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !validateEmail(email)) {
      setErrorMessage('Please enter a valid work or corporate email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters in length.');
      return;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please re-enter.');
        return;
      }
      if (!agreeTerms) {
        setErrorMessage('Please accept the Terms of Service & Privacy Policy.');
        return;
      }
    }

    setIsLoading(true);
    setAuthStepMessage(
      authRole === 'admin'
        ? mode === 'signup'
          ? 'Provisioning Master Admin Tenant & Ingress Gateway...'
          : 'Verifying Admin Security Clearance & Root Privileges...'
        : mode === 'signup'
          ? 'Registering Employee Workspace & Allocation Sandbox...'
          : 'Authenticating Employee Single Sign-On Gateway...'
    );

    setTimeout(() => {
      setAuthStepMessage(authRole === 'admin' ? 'Authorizing Full Cost Routing & Provider Controls...' : 'Loading Employee Prompt Optimizer & Savings Sandbox...');
      setTimeout(() => {
        setAuthStepMessage('Connecting to real-time LLM cost feed...');
        setTimeout(() => {
          const initials = fullName
            ? fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .substring(0, 2)
            : authRole === 'admin' ? 'AD' : 'EM';

          const resolvedRoleTitle = 
            authRole === 'admin'
              ? (mode === 'signup' ? `${selectedTier} Master Admin` : 'Head of AI Infrastructure & Routing')
              : (mode === 'signup' ? `AI Solutions Engineer` : 'Staff LLM Prompt Engineer');

          const newUser: UserAccount = {
            id: `usr_${Math.random().toString(36).substring(2, 9)}`,
            name: fullName.trim() || (authRole === 'admin' ? 'Master Admin' : 'Alex Mercer'),
            email: email.trim(),
            role: resolvedRoleTitle,
            authRole: authRole,
            tier: authRole === 'admin' ? 'Enterprise' : selectedTier,
            organization: orgName.trim() || (email.includes('@') ? email.split('@')[1].split('.')[0].toUpperCase() : 'Neural Tech AI'),
            avatarColor: authRole === 'admin' ? 'from-[#00ff41] to-[#00b32c]' : 'from-[#00e5ff] to-[#0099b8]',
            initials: initials || (authRole === 'admin' ? 'AD' : 'EM'),
            apiTokensAllocated: authRole === 'admin' ? 100000000 : 25000000,
            apiTokensUsed: authRole === 'admin' ? 142000 : 38000,
            createdAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            isGuest: false,
          };
          onLoginSuccess(newUser);
        }, 300);
      }, 350);
    }, 400);
  };

  const handleOAuthLogin = (provider: 'Google' | 'GitHub' | 'SAML') => {
    setIsLoading(true);
    setErrorMessage('');
    setAuthStepMessage(`Connecting to ${provider} Enterprise Identity Provider as ${authRole.toUpperCase()}...`);

    setTimeout(() => {
      setAuthStepMessage(`Authorizing OAuth2 tokens and granting ${authRole.toUpperCase()} credentials...`);
      setTimeout(() => {
        const initials = authRole === 'admin' ? 'AD' : 'EM';
        const user: UserAccount = {
          id: `usr_${Math.random().toString(36).substring(2, 9)}`,
          name: `${authRole === 'admin' ? 'Lead Admin' : 'Employee Dev'} (${provider})`,
          email: `${authRole}@${provider.toLowerCase()}-corp.io`,
          role: authRole === 'admin' ? 'Enterprise Security Admin' : 'Engineering Employee',
          authRole: authRole,
          tier: authRole === 'admin' ? 'Enterprise' : 'FinOps Pro',
          organization: `${provider} SSO Organization`,
          avatarColor: authRole === 'admin' ? 'from-[#00ff41] to-[#00e5ff]' : 'from-[#00e5ff] to-[#72ff70]',
          initials,
          apiTokensAllocated: authRole === 'admin' ? 100000000 : 25000000,
          apiTokensUsed: 62000,
          createdAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          isGuest: false,
        };
        onLoginSuccess(user);
      }, 350);
    }, 400);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !validateEmail(forgotEmail)) {
      setErrorMessage('Please enter a valid email address to receive reset instructions.');
      return;
    }
    setResetSent(true);
    setTimeout(() => {
      setShowForgotPassword(false);
      setResetSent(false);
      setForgotEmail('');
    }, 2800);
  };

  return (
    <div className="min-h-screen bg-[#080c10] text-[#dfe2eb] flex flex-col justify-between selection:bg-[#00ff41]/25 selection:text-[#72ff70] relative overflow-hidden bg-grid-cyber">
      <MeteorShower />
      {/* Ambient background glow accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-[#00ff41]/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#00e5ff]/5 rounded-full blur-[130px] pointer-events-none"></div>

      {/* Top Header Bar with Brand */}
      <header className="w-full border-b border-[#3b4b37]/50 bg-[#090d13]/80 backdrop-blur-xl px-4 sm:px-8 py-3.5 z-20 flex items-center justify-between">
        <div className="flex items-center gap-3 mx-auto sm:mx-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#101b2b] to-[#0a121e] border border-[#00C9E8]/40 flex items-center justify-center p-1 shadow-[0_0_18px_rgba(0,201,232,0.25)]">
            <TrimTokenLogo size="sm" variant="icon-only" />
          </div>
          <div>
            <div className="font-display text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>TrimToken</span>
              <span className="text-[#00e5ff] font-extrabold drop-shadow-[0_0_10px_rgba(0,229,255,0.6)]">AI</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Center Stage: Authentication & Value Proposition */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12 z-10">
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Product Value Proposition & Trust Highlights */}
          <div className="lg:col-span-6 flex flex-col justify-center text-left space-y-6">
            {/* Compliance & Proxy Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101924]/90 border border-[#00C9E8]/40 shadow-[0_0_25px_rgba(0,201,232,0.2)] w-fit">
              <TrimTokenLogo size="xs" variant="icon-only" />
              <span className="text-xs font-mono-data font-bold text-white tracking-wide">
                TRIMTOKEN <span className="text-[#00e5ff]">AI</span> GATEWAY
              </span>
              <span className="text-[#2a3e52]">|</span>
              <span className="text-xs font-mono-data text-[#b9ccb2] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00e5ff]" /> 1-Line Drop-in Proxy
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#dfe2eb] leading-[1.18]">
              Cut Enterprise LLM Costs by{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff41] via-[#72ff70] to-[#00e5ff] glow-text-green">
                Up To 72%
              </span>{' '}
              Without Sacrificing Output Quality.
            </h1>

            {/* Subtitle */}
            <p className="font-body text-sm sm:text-base text-[#b9ccb2] leading-relaxed">
              Stop burning frontier model budget on routine classification and lookups. 
              TrimToken AI classifies query complexity and performs real-time cost routing across live model pricing.
            </p>

            {/* Quick Trust Highlights 4-box Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-[#14181f]/80 border border-[#3b4b37]/60 flex flex-col">
                <span className="text-[11px] font-mono-data text-[#869683]">ROUTING OVERHEAD</span>
                <span className="text-base font-bold font-mono-data text-[#00ff41] glow-text-green mt-0.5">&lt; 1.2ms k-NN</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#14181f]/80 border border-[#3b4b37]/60 flex flex-col">
                <span className="text-[11px] font-mono-data text-[#869683]">INTELLIGENT FALLBACK</span>
                <span className="text-base font-bold font-mono-data text-[#00e5ff] mt-0.5">Transparent routing controls</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#14181f]/80 border border-[#3b4b37]/60 flex flex-col">
                <span className="text-[11px] font-mono-data text-[#869683]">DYNAMIC PRICING</span>
                <span className="text-base font-bold font-mono-data text-[#ffba20] mt-0.5">Real-Time Arbitrage</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#14181f]/80 border border-[#3b4b37]/60 flex flex-col">
                <span className="text-[11px] font-mono-data text-[#869683]">INTEGRATION EFFORT</span>
                <span className="text-base font-bold font-mono-data text-[#dfe2eb] mt-0.5">1-Line BaseURL Swap</span>
              </div>
            </div>
          </div>

          {/* Right Column: Focused Authentication Card */}
          <div className="lg:col-span-6 w-full max-w-lg mx-auto">
            <div className={`glass-panel rounded-2xl p-6 sm:p-8 border shadow-[0_0_50px_rgba(0,0,0,0.7)] relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_60px_rgba(0,229,255,0.12)] ${
              authRole === 'admin' ? 'border-[#00ff41]/40' : 'border-[#00e5ff]/40'
            }`}>
            {/* Corner accent glow */}
            <div className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl pointer-events-none rounded-bl-full transition-all duration-500 ${
              authRole === 'admin' ? 'from-[#00ff41]/15 to-transparent' : 'from-[#00e5ff]/15 to-transparent'
            }`}></div>

            {/* TWO PRIMARY OPTIONS: LOGIN AS ADMIN VS LOGIN AS EMPLOYEE */}
            <div className="mb-6">
              <label className="block text-[11px] font-mono-data text-[#869683] uppercase tracking-wider mb-2 font-bold flex items-center justify-between">
                <span>Select Access Gateway Role:</span>
                <span className={`text-[10px] font-bold ${authRole === 'admin' ? 'text-[#00ff41]' : 'text-[#00e5ff]'}`}>
                  {authRole === 'admin' ? 'ROOT ACCESS' : 'MEMBER ACCESS'}
                </span>
              </label>
              <div className="grid grid-cols-2 gap-2.5 p-1 bg-[#090d13] rounded-xl border border-[#3b4b37]/70">
                {/* Admin Role Button */}
                <button
                  type="button"
                  onClick={() => handleRoleChange('admin')}
                  className={`py-3 px-3 rounded-lg text-xs font-mono-data font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer relative ${
                    authRole === 'admin'
                      ? 'bg-gradient-to-b from-[#00ff41]/20 to-[#00ff41]/10 text-[#00ff41] border border-[#00ff41] shadow-[0_0_15px_rgba(0,255,65,0.25)]'
                      : 'text-[#b9ccb2] hover:text-white hover:bg-[#131a24] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Shield className={`w-4 h-4 ${authRole === 'admin' ? 'text-[#00ff41]' : 'text-[#869683]'}`} />
                    <span className="tracking-wide">LOGIN AS ADMIN</span>
                  </div>
                  <span className={`text-[10px] font-normal leading-none ${authRole === 'admin' ? 'text-[#72ff70]/80' : 'text-[#869683]'}`}>
                    Security &amp; Full Control
                  </span>
                  {authRole === 'admin' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41] absolute top-2 right-2 animate-ping"></span>
                  )}
                </button>

                {/* Employee Role Button */}
                <button
                  type="button"
                  onClick={() => handleRoleChange('employee')}
                  className={`py-3 px-3 rounded-lg text-xs font-mono-data font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer relative ${
                    authRole === 'employee'
                      ? 'bg-gradient-to-b from-[#00e5ff]/20 to-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.25)]'
                      : 'text-[#b9ccb2] hover:text-white hover:bg-[#131a24] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Briefcase className={`w-4 h-4 ${authRole === 'employee' ? 'text-[#00e5ff]' : 'text-[#869683]'}`} />
                    <span className="tracking-wide">LOGIN AS EMPLOYEE</span>
                  </div>
                  <span className={`text-[10px] font-normal leading-none ${authRole === 'employee' ? 'text-[#72f5ff]/80' : 'text-[#869683]'}`}>
                    Optimization &amp; Dev Hub
                  </span>
                  {authRole === 'employee' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] absolute top-2 right-2 animate-ping"></span>
                  )}
                </button>
              </div>

              {/* Role description pill banner */}
              <div className={`mt-2.5 p-2 rounded-lg text-[11px] font-mono-data flex items-center justify-between border ${
                authRole === 'admin'
                  ? 'bg-[#00ff41]/5 border-[#00ff41]/25 text-[#00ff41]'
                  : 'bg-[#00e5ff]/5 border-[#00e5ff]/25 text-[#00e5ff]'
              }`}>
                <div className="flex items-center gap-1.5">
                  {authRole === 'admin' ? (
                    <Server className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <Cpu className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span>
                    {authRole === 'admin' 
                      ? 'Admin: Gateway routing, API keys, pricing controls & analytics'
                      : 'Employee: Real-time prompt sandbox, token savings & query inspector'}
                  </span>
                </div>
              </div>
            </div>

            {/* Mode Switcher Tabs: Sign In vs Create Account */}
            <div className="flex items-center p-1 bg-[#090d13] rounded-xl border border-[#3b4b37]/60 mb-5">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMessage('');
                  if (authRole === 'admin') {
                    setEmail('admin@trimtoken.ai');
                    setPassword('TrimTokenAdmin#2026');
                  } else {
                    setEmail('alex.employee@neuraltech.io');
                    setPassword('EmployeePass#2026');
                  }
                }}
                className={`flex-1 py-2 text-xs font-mono-data font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  mode === 'signin'
                    ? authRole === 'admin'
                      ? 'bg-[#00ff41] text-[#003907] shadow-[0_0_12px_rgba(0,255,65,0.3)]'
                      : 'bg-[#00e5ff] text-[#003940] shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                    : 'text-[#b9ccb2] hover:text-white'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>SIGN IN ({authRole.toUpperCase()})</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage('');
                  setEmail('');
                  setPassword('');
                }}
                className={`flex-1 py-2 text-xs font-mono-data font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  mode === 'signup'
                    ? authRole === 'admin'
                      ? 'bg-[#00ff41] text-[#003907] shadow-[0_0_12px_rgba(0,255,65,0.3)]'
                      : 'bg-[#00e5ff] text-[#003940] shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                    : 'text-[#b9ccb2] hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>NEW {authRole.toUpperCase()} ACCOUNT</span>
              </button>
            </div>

            {/* Error Message Box */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span className="flex-1">{errorMessage}</span>
              </div>
            )}

            {/* Loading State Overlay */}
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="relative">
                  <div className={`w-14 h-14 rounded-full border-2 animate-spin ${
                    authRole === 'admin' 
                      ? 'border-[#00ff41]/20 border-t-[#00ff41]' 
                      : 'border-[#00e5ff]/20 border-t-[#00e5ff]'
                  }`}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {authRole === 'admin' ? (
                      <Shield className="w-6 h-6 text-[#00ff41] animate-pulse" />
                    ) : (
                      <Briefcase className="w-6 h-6 text-[#00e5ff] animate-pulse" />
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className={`text-sm font-bold font-mono-data tracking-wide ${
                    authRole === 'admin' ? 'text-[#00ff41]' : 'text-[#00e5ff]'
                  }`}>
                    {authStepMessage || 'AUTHENTICATING...'}
                  </div>
                  <div className="text-xs text-[#869683] font-mono-data">
                    Securing cryptographic {authRole} gateway session
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Social / SSO Auth Buttons */}
                <div className="space-y-2 mb-5">
                  <div className="text-[11px] font-mono-data text-[#869683] uppercase tracking-wider mb-2">
                    {mode === 'signin' 
                      ? `Authenticate as ${authRole === 'admin' ? 'Admin' : 'Employee'} with SSO:` 
                      : `Register ${authRole} with enterprise identity:`}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleOAuthLogin('Google')}
                      className="p-2.5 rounded-xl bg-[#090d13] hover:bg-[#131a24] border border-[#3b4b37]/60 hover:border-[#00e5ff]/50 text-xs font-mono-data text-[#dfe2eb] flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12 5c1.5 0 2.9.5 4 1.5l3-3C17.1 1.7 14.7 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z" />
                        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                        <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.6 7.2C.6 9.2 0 10.5 0 12.4s.6 3.2 1.6 5.2l3.7-2.9z" />
                        <path fill="#34A853" d="M12 23.8c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16.7C3.5 20.5 7.4 23.8 12 23.8z" />
                      </svg>
                      <span>Google</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOAuthLogin('GitHub')}
                      className="p-2.5 rounded-xl bg-[#090d13] hover:bg-[#131a24] border border-[#3b4b37]/60 hover:border-[#00ff41]/50 text-xs font-mono-data text-[#dfe2eb] flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                      <span>GitHub</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOAuthLogin('SAML')}
                      className="col-span-2 sm:col-span-1 p-2.5 rounded-xl bg-[#090d13] hover:bg-[#131a24] border border-[#3b4b37]/60 hover:border-[#ffba20]/50 text-xs font-mono-data text-[#dfe2eb] flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#ffba20]" />
                      <span>SAML SSO</span>
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="relative flex py-2 items-center mb-5">
                  <div className="flex-grow border-t border-[#3b4b37]/60"></div>
                  <span className="flex-shrink mx-3 text-[11px] font-mono-data text-[#869683] uppercase tracking-wider">
                    Or {authRole === 'admin' ? 'Admin' : 'Employee'} credentials
                  </span>
                  <div className="flex-grow border-t border-[#3b4b37]/60"></div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Sign Up Exclusive Fields */}
                  {mode === 'signup' && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-mono-data text-[#b9ccb2] mb-1.5 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-[#00ff41]" />
                            <span>Full Name</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder={authRole === 'admin' ? 'Jordan Vance' : 'Alex Mercer'}
                            className="w-full bg-[#090d13] border border-[#3b4b37]/70 focus:border-[#00ff41] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-mono-data placeholder:text-[#869683]/50 focus:outline-none focus:ring-1 focus:ring-[#00ff41]/40 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono-data text-[#b9ccb2] mb-1.5 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-[#00e5ff]" />
                            <span>Organization</span>
                          </label>
                          <input
                            type="text"
                            value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                            placeholder="Neural Tech Corp"
                            className="w-full bg-[#090d13] border border-[#3b4b37]/70 focus:border-[#00e5ff] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-mono-data placeholder:text-[#869683]/50 focus:outline-none focus:ring-1 focus:ring-[#00e5ff]/40 transition-all"
                          />
                        </div>
                      </div>

                      {/* Employee ID or Admin Key */}
                      {authRole === 'employee' ? (
                        <div>
                          <label className="block text-xs font-mono-data text-[#b9ccb2] mb-1.5 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <Briefcase className="w-3.5 h-3.5 text-[#00e5ff]" />
                              <span>Corporate Employee ID (Optional)</span>
                            </span>
                            <span className="text-[10px] text-[#869683]">e.g. EMP-9421</span>
                          </label>
                          <input
                            type="text"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            placeholder="EMP-8042"
                            className="w-full bg-[#090d13] border border-[#3b4b37]/70 focus:border-[#00e5ff] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono-data placeholder:text-[#869683]/50 focus:outline-none"
                          />
                        </div>
                      ) : (
                        /* Plan Tier Selection for Admin */
                        <div>
                          <label className="block text-xs font-mono-data text-[#b9ccb2] mb-1.5">
                            Admin Managed Infrastructure Tier:
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {(['Enterprise', 'FinOps Pro', 'Developer'] as const).map((tierOption) => (
                              <button
                                key={tierOption}
                                type="button"
                                onClick={() => setSelectedTier(tierOption)}
                                className={`py-2 px-1.5 rounded-xl border text-[11px] font-mono-data font-bold transition-all text-center cursor-pointer ${
                                  selectedTier === tierOption
                                    ? tierOption === 'Enterprise'
                                      ? 'border-[#00ff41] bg-[#00ff41]/15 text-[#00ff41]'
                                      : tierOption === 'FinOps Pro'
                                      ? 'border-[#ffba20] bg-[#ffba20]/15 text-[#ffba20]'
                                      : 'border-[#00e5ff] bg-[#00e5ff]/15 text-[#00e5ff]'
                                    : 'border-[#3b4b37]/50 bg-[#090d13] text-[#b9ccb2] hover:bg-[#121922]'
                                }`}
                              >
                                {tierOption}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Gateway Region */}
                      <div>
                        <label className="block text-xs font-mono-data text-[#b9ccb2] mb-1.5 flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-[#00e5ff]" />
                          <span>Primary Gateway Ingress Region</span>
                        </label>
                        <div className="grid grid-cols-3 gap-2 text-[10px] font-mono-data">
                          {[
                            { id: 'global-anycast', label: 'Global Anycast' },
                            { id: 'us-east', label: 'US-East (VA)' },
                            { id: 'eu-central', label: 'EU-Central (FRA)' },
                          ].map((region) => (
                            <button
                              key={region.id}
                              type="button"
                              onClick={() => setGatewayRegion(region.id as any)}
                              className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                                gatewayRegion === region.id
                                  ? 'border-[#00e5ff] bg-[#00e5ff]/15 text-[#00e5ff]'
                                  : 'border-[#3b4b37]/50 bg-[#090d13] text-[#869683]'
                              }`}
                            >
                              {region.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-mono-data text-[#b9ccb2] mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Mail className={`w-3.5 h-3.5 ${authRole === 'admin' ? 'text-[#00ff41]' : 'text-[#00e5ff]'}`} />
                        <span>{authRole === 'admin' ? 'Admin Email Address' : 'Employee Work Email'}</span>
                      </span>
                      {mode === 'signin' && (
                        <span className="text-[10px] text-[#869683]">
                          {authRole === 'admin' ? 'e.g. admin@trimtoken.ai' : 'e.g. employee@company.com'}
                        </span>
                      )}
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={authRole === 'admin' ? 'admin@company.com' : 'employee@company.com'}
                      className={`w-full bg-[#090d13] border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-mono-data placeholder:text-[#869683]/50 focus:outline-none transition-all ${
                        authRole === 'admin'
                          ? 'border-[#3b4b37]/70 focus:border-[#00ff41] focus:ring-1 focus:ring-[#00ff41]/40'
                          : 'border-[#3b4b37]/70 focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]/40'
                      }`}
                    />
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-mono-data text-[#b9ccb2] flex items-center gap-1.5">
                        <KeyRound className={`w-3.5 h-3.5 ${authRole === 'admin' ? 'text-[#00ff41]' : 'text-[#00e5ff]'}`} />
                        <span>{authRole === 'admin' ? 'Master Admin Password' : 'Employee Password'}</span>
                      </label>
                      {mode === 'signin' && (
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(true)}
                          className="text-[11px] font-mono-data text-[#00e5ff] hover:underline cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className={`w-full bg-[#090d13] border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-mono-data placeholder:text-[#869683]/50 focus:outline-none pr-10 transition-all ${
                          authRole === 'admin'
                            ? 'border-[#3b4b37]/70 focus:border-[#00ff41] focus:ring-1 focus:ring-[#00ff41]/40'
                            : 'border-[#3b4b37]/70 focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]/40'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#869683] hover:text-white cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Strength Indicator for Signup */}
                    {mode === 'signup' && password && (
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4].map((step) => (
                            <div
                              key={step}
                              className={`h-1 flex-1 rounded-full transition-all ${
                                passwordStrength >= step
                                  ? passwordStrength <= 2
                                    ? 'bg-amber-400'
                                    : authRole === 'admin' ? 'bg-[#00ff41]' : 'bg-[#00e5ff]'
                                  : 'bg-[#1a232f]'
                              }`}
                            ></div>
                          ))}
                        </div>
                        <div className="text-[10px] font-mono-data text-[#869683] text-right">
                          {passwordStrength < 2 ? 'Weak password' : passwordStrength < 4 ? 'Moderate' : 'Strong enterprise password'}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password (Sign Up only) */}
                  {mode === 'signup' && (
                    <div>
                      <label className="block text-xs font-mono-data text-[#b9ccb2] mb-1.5 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff41]" />
                        <span>Confirm Password</span>
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-[#090d13] border border-[#3b4b37]/70 focus:border-[#00ff41] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-mono-data placeholder:text-[#869683]/50 focus:outline-none focus:ring-1 focus:ring-[#00ff41]/40 transition-all"
                      />
                    </div>
                  )}

                  {/* Remember me / Terms Checkbox */}
                  <div className="flex items-center justify-between pt-1">
                    {mode === 'signin' ? (
                      <label className="flex items-center gap-2 text-xs font-mono-data text-[#b9ccb2] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className={`rounded border-[#3b4b37] focus:ring-0 focus:ring-offset-0 bg-[#090d13] w-3.5 h-3.5 cursor-pointer ${
                            authRole === 'admin' ? 'text-[#00ff41]' : 'text-[#00e5ff]'
                          }`}
                        />
                        <span>Remember {authRole} session (30 days)</span>
                      </label>
                    ) : (
                      <label className="flex items-center gap-2 text-[11px] font-mono-data text-[#b9ccb2] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="rounded border-[#3b4b37] text-[#00ff41] focus:ring-0 focus:ring-offset-0 bg-[#090d13] w-3.5 h-3.5 cursor-pointer"
                        />
                        <span>I accept TrimToken {authRole === 'admin' ? 'Enterprise Admin SLA' : 'Employee Usage Policy'}</span>
                      </label>
                    )}
                  </div>

                  {/* Submit CTA Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-xl font-mono-data font-extrabold text-sm tracking-wider active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2 ${
                      authRole === 'admin'
                        ? 'bg-[#00ff41] hover:bg-[#72ff70] text-[#003907] shadow-[0_0_20px_rgba(0,255,65,0.35)]'
                        : 'bg-[#00e5ff] hover:bg-[#72f5ff] text-[#003940] shadow-[0_0_20px_rgba(0,229,255,0.35)]'
                    }`}
                  >
                    {authRole === 'admin' ? (
                      <Shield className="w-4 h-4" />
                    ) : (
                      <Zap className="w-4 h-4 fill-current" />
                    )}
                    <span>
                      {mode === 'signin' 
                        ? `ENTER AS ${authRole.toUpperCase()}` 
                        : `PROVISION ${authRole.toUpperCase()} GATEWAY`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  {onContinueAsGuest && mode === 'signin' && (
                    <button
                      type="button"
                      onClick={onContinueAsGuest}
                      disabled={isLoading}
                      className="w-full py-2.5 px-4 rounded-xl border border-[#3b4b37]/70 text-[#b9ccb2] hover:text-white hover:border-[#869683] font-mono-data text-xs transition-colors disabled:opacity-50 mt-2"
                    >
                      Continue in sandbox mode
                    </button>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </main>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel max-w-md w-full rounded-2xl p-6 border border-[#00e5ff]/40 shadow-2xl relative">
            <h3 className="font-display text-lg font-bold text-white mb-2 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-[#00e5ff]" />
              <span>Reset {authRole === 'admin' ? 'Admin' : 'Employee'} Credentials</span>
            </h3>
            <p className="text-xs text-[#b9ccb2] mb-4">
              Enter your registered email address to receive a secure token to reset your {authRole} access key.
            </p>

            {resetSent ? (
              <div className="p-3 rounded-xl bg-[#00ff41]/10 border border-[#00ff41]/40 text-[#00ff41] text-xs font-mono-data flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Recovery instructions sent to {forgotEmail}!</span>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono-data text-[#b9ccb2] mb-1">Account Email</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full bg-[#090d13] border border-[#3b4b37] focus:border-[#00e5ff] rounded-xl px-3 py-2 text-xs text-white font-mono-data placeholder:text-[#869683]/50 focus:outline-none"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono-data text-[#b9ccb2] hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#00e5ff] text-[#003940] font-mono-data font-bold text-xs hover:bg-[#72f5ff] cursor-pointer"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Security & Compliance Footer */}
      <footer className="w-full border-t border-[#3b4b37]/30 bg-[#090d13]/60 py-3 px-6 text-center text-[11px] font-mono-data text-[#869683] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00ff41]" />
          <span>Demo authentication • Role-based dashboard access</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hover:text-white cursor-pointer">Admin Policies</span>
          <span className="hover:text-white cursor-pointer">Employee Guidelines</span>
          <span className="text-[#00ff41]">Ingress Cluster: Active</span>
        </div>
      </footer>
    </div>
  );
};
