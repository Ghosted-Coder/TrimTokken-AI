import React from 'react';

interface TrimTokenLogoProps {
  variant?: 'full' | 'icon-only' | 'card' | 'badge';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero';
  className?: string;
  theme?: 'dark' | 'light' | 'auto';
  showText?: boolean;
  animated?: boolean;
}

export function TrimTokenLogo({
  variant = 'full',
  size = 'md',
  className = '',
  theme = 'auto',
  showText = true,
  animated = false,
}: TrimTokenLogoProps) {
  // Dimension mappings
  const dimensions = {
    xs: { iconSize: 20, textClass: 'text-xs' },
    sm: { iconSize: 28, textClass: 'text-sm' },
    md: { iconSize: 36, textClass: 'text-base sm:text-lg' },
    lg: { iconSize: 48, textClass: 'text-xl sm:text-2xl' },
    xl: { iconSize: 64, textClass: 'text-2xl sm:text-3xl' },
    '2xl': { iconSize: 96, textClass: 'text-3xl sm:text-4xl' },
    hero: { iconSize: 140, textClass: 'text-4xl sm:text-5xl md:text-6xl' },
  }[size];

  const iconDim = dimensions.iconSize;

  // The precise vector path geometry matching the attached video logo
  const EmblemSVG = (
    <svg
      viewBox="0 0 200 200"
      width={iconDim}
      height={iconDim}
      className={`shrink-0 overflow-visible ${animated ? 'animate-pulse' : ''}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Cyan gradient for diagonal slash and circuit arrows */}
        <linearGradient id="tt-cyan-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00A3C4" />
          <stop offset="50%" stopColor="#00C9E8" />
          <stop offset="100%" stopColor="#22E4FF" />
        </linearGradient>

        {/* 3D shadow gradient for circuit arrows */}
        <linearGradient id="tt-cyan-shadow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00778F" />
          <stop offset="100%" stopColor="#004A59" />
        </linearGradient>

        {/* Dark Navy block gradient */}
        <linearGradient id="tt-navy-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14213d" />
          <stop offset="100%" stopColor="#0a1120" />
        </linearGradient>

        {/* Inner teal wedge */}
        <linearGradient id="tt-inner-teal" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0a3c53" />
          <stop offset="100%" stopColor="#032030" />
        </linearGradient>

        {/* Glow filter */}
        <filter id="tt-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Main Navy 'T' left geometry */}
      {/* Top Left Arm */}
      <path
        d="M 28 35 L 75 35 L 75 60 L 58 60 L 58 105 L 28 75 Z"
        fill="url(#tt-navy-grad)"
      />

      {/* Main vertical core left */}
      <path
        d="M 58 105 L 58 135 L 78 135 L 78 85 Z"
        fill="url(#tt-navy-grad)"
      />

      {/* Top central-right bar above diagonal slash */}
      <path
        d="M 75 35 L 122 35 L 98 60 L 75 60 Z"
        fill="url(#tt-navy-grad)"
      />

      {/* Inner lower triangle under diagonal */}
      <path
        d="M 78 85 L 78 135 L 115 135 Z"
        fill="url(#tt-inner-teal)"
      />

      {/* Bottom central wedge */}
      <path
        d="M 78 135 L 78 165 L 102 165 L 102 135 Z"
        fill="url(#tt-navy-grad)"
      />

      {/* VIBRANT CYAN DIAGONAL SLICE (The prominent lightning streak from bottom-left to top-right) */}
      <path
        d="M 42 142 L 68 168 L 126 50 L 100 35 Z"
        fill="url(#tt-cyan-grad)"
        filter="url(#tt-glow)"
      />

      {/* UPPER CIRCUIT ROUTING ARROW */}
      {/* Main stem branching right */}
      <path
        d="M 112 55 L 132 45 L 148 45 L 148 35 L 168 50 L 148 65 L 148 55 L 128 55 Z"
        fill="url(#tt-cyan-grad)"
      />
      {/* 3D lower extrusion bevel on upper arrow */}
      <path
        d="M 128 55 L 148 55 L 148 65 L 168 50 L 168 54 L 148 69 L 148 59 L 128 59 Z"
        fill="url(#tt-cyan-shadow)"
        opacity="0.9"
      />

      {/* LOWER CIRCUIT ROUTING ARROW */}
      {/* Main stem branching right */}
      <path
        d="M 98 85 L 118 75 L 134 75 L 134 65 L 154 80 L 134 95 L 134 85 L 116 85 Z"
        fill="url(#tt-cyan-grad)"
      />
      {/* 3D lower extrusion bevel on lower arrow */}
      <path
        d="M 116 85 L 134 85 L 134 95 L 154 80 L 154 84 L 134 99 L 134 89 L 116 89 Z"
        fill="url(#tt-cyan-shadow)"
        opacity="0.9"
      />

      {/* High-tech node spark accent */}
      <circle cx="168" cy="50" r="2.5" fill="#FFFFFF" />
      <circle cx="154" cy="80" r="2.5" fill="#FFFFFF" />
    </svg>
  );

  if (variant === 'icon-only') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{EmblemSVG}</div>;
  }

  // Card Variant (exactly like the rounded card shown in the video)
  if (variant === 'card') {
    return (
      <div
        className={`relative bg-[#f0f4f9] text-[#0d1624] rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/60 overflow-hidden ${className}`}
      >
        {/* Subtle matrix runes in background */}
        <div className="absolute inset-0 pointer-events-none opacity-20 font-mono-data text-[10px] select-none grid grid-cols-6 gap-3 p-4 leading-none text-[#1b3552]">
          <span>c z</span><span>_ 1</span><span>^ ¬</span><span>v 7</span><span>g p</span><span>w ·</span>
          <span>∑ ∏</span><span>⊓ ⊔</span><span>1 0</span><span>c z</span><span>_ v</span><span>7 g</span>
          <span>p w</span><span>¬ ^</span><span>0 1</span><span>z c</span><span>· _</span><span>g 7</span>
        </div>

        {/* Central Emblem */}
        <div className="relative z-10 my-2 scale-110 sm:scale-125">
          {EmblemSVG}
        </div>

        {/* Typography */}
        {showText && (
          <div className="relative z-10 mt-4 flex items-center justify-center gap-2 font-display font-extrabold tracking-wider text-xl sm:text-2xl">
            <span className="text-[#0d1624] tracking-tight">TRIM TOKEN</span>
            <span className="text-[#00C9E8] font-mono-data tracking-normal drop-shadow-[0_0_8px_rgba(0,201,232,0.6)]">
              AI
            </span>
          </div>
        )}
      </div>
    );
  }

  // Default / Full horizontal brand header
  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 ${className}`}>
      <div className="relative flex items-center justify-center">
        {EmblemSVG}
      </div>

      {showText && (
        <div className="flex items-center gap-1.5 font-display font-bold tracking-tight">
          <span
            className={
              theme === 'light'
                ? 'text-[#0d1624] font-extrabold'
                : 'text-[#e6edf5] font-extrabold'
            }
          >
            TrimToken
          </span>
          <span className="text-[#00e5ff] font-extrabold drop-shadow-[0_0_10px_rgba(0,229,255,0.4)]">
            AI
          </span>
        </div>
      )}
    </div>
  );
}
