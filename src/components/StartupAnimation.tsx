import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FastForward, Sparkles } from 'lucide-react';

interface StartupAnimationProps {
  onComplete: () => void;
  isOpen: boolean;
}

export function StartupAnimation({ onComplete, isOpen }: StartupAnimationProps) {
  const [phase, setPhase] = useState<'appear' | 'glow' | 'transition' | 'finished'>('appear');

  useEffect(() => {
    if (!isOpen) {
      setPhase('appear');
      return;
    }

    // Single-cycle choreographed timeline:
    // 0.0s - 0.9s: Silky card entrance + matrix grid reveal
    // 0.9s - 2.0s: Cyan lightning surge across diagonal + arrows branch out with neon glow
    // 2.0s - 2.8s: Smooth cinematic forward glide & seamless fade direct into main website
    const t1 = setTimeout(() => setPhase('glow'), 850);
    const t2 = setTimeout(() => setPhase('transition'), 1950);
    const t3 = setTimeout(() => {
      setPhase('finished');
      onComplete();
    }, 2750);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        onComplete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onComplete]);

  return (
    <AnimatePresence>
      {isOpen && phase !== 'finished' && (
        <motion.div
          key="startup-overlay"
          initial={{ opacity: 1 }}
          animate={{
            opacity: phase === 'transition' ? 0 : 1,
            scale: phase === 'transition' ? 1.08 : 1,
          }}
          exit={{ opacity: 0, scale: 1.08 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99999] bg-[#070b10] flex items-center justify-center overflow-hidden select-none cursor-pointer"
          onClick={onComplete}
        >
          {/* Cyber matrix grid ambient radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,201,232,0.18)_0%,rgba(7,11,16,0.98)_75%)] pointer-events-none" />

          {/* Floating Digital Matrix Runes */}
          <div className="absolute inset-0 pointer-events-none opacity-20 flex flex-wrap gap-8 p-6 font-mono-data text-xs text-[#00e5ff] overflow-hidden">
            {Array.from({ length: 42 }).map((_, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0.1 }}
                animate={{
                  opacity: [0.1, 0.5, 0.15],
                  y: [0, -4, 0],
                }}
                transition={{
                  duration: 2.2 + (i % 3),
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: (i * 0.07) % 1.2,
                }}
                className="tracking-widest"
              >
                {['∑', '∏', 'c z', '1 0', '¬ ^', '⊓ ⊔', '· _', 'w ·', 'g p', 'v 7'][i % 10]}
              </motion.span>
            ))}
          </div>

          {/* Main Animated Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={
              phase === 'transition'
                ? {
                    scale: 1.15,
                    y: -10,
                    opacity: 0,
                    filter: 'blur(8px)',
                  }
                : {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                  }
            }
            transition={{
              duration: phase === 'transition' ? 0.75 : 0.7,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative w-[330px] sm:w-[410px] aspect-square bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0] rounded-[36px] p-8 shadow-[0_25px_80px_rgba(0,0,0,0.85),0_0_60px_rgba(0,201,232,0.35)] border border-white/80 flex flex-col items-center justify-between overflow-hidden"
          >
            {/* Card subtle matrix rune background */}
            <div className="absolute inset-0 pointer-events-none opacity-25 font-mono-data text-[11px] grid grid-cols-6 gap-3 p-5 leading-none text-[#0e2a47] select-none">
              <span>c z</span><span>_ 1</span><span>^ ¬</span><span>v 7</span><span>g p</span><span>w ·</span>
              <span>∑ ∏</span><span>⊓ ⊔</span><span>1 0</span><span>c z</span><span>_ v</span><span>7 g</span>
              <span>p w</span><span>¬ ^</span><span>0 1</span><span>z c</span><span>· _</span><span>g 7</span>
              <span>⊓ ⊔</span><span>∑ ∏</span><span>1 0</span><span>w ·</span><span>v 7</span><span>c z</span>
            </div>

            {/* Top Status Indicator */}
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="relative z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0e1e33]/10 border border-[#0e1e33]/15 text-[10px] font-mono-data text-[#0e223d] font-semibold"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00C9E8] animate-ping" />
              <span>OPTIMIZING ROUTING FABRIC</span>
            </motion.div>

            {/* Center Vector TrimToken AI Logo */}
            <div className="relative z-10 my-auto flex items-center justify-center">
              {/* Pulsing Cyan Radial Light */}
              <motion.div
                animate={{
                  scale: phase === 'glow' ? [1, 1.25, 1.1] : 1,
                  opacity: phase === 'glow' ? [0.35, 0.75, 0.45] : 0.3,
                }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                className="absolute w-44 h-44 rounded-full bg-[#00C9E8]/30 blur-2xl pointer-events-none"
              />

              <svg
                viewBox="0 0 200 200"
                className="w-44 h-44 sm:w-52 sm:h-52 overflow-visible"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="smooth-cyan" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0096B4" />
                    <stop offset="45%" stopColor="#00C9E8" />
                    <stop offset="100%" stopColor="#38EFFF" />
                  </linearGradient>

                  <linearGradient id="smooth-shadow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#006C82" />
                    <stop offset="100%" stopColor="#003D4A" />
                  </linearGradient>

                  <linearGradient id="smooth-navy" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#111c30" />
                    <stop offset="100%" stopColor="#060c18" />
                  </linearGradient>

                  <linearGradient id="smooth-inner" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#093950" />
                    <stop offset="100%" stopColor="#031e2c" />
                  </linearGradient>

                  <filter id="smooth-glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Navy Geometric 'T' Top Bar & Core */}
                <motion.path
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  d="M 28 35 L 75 35 L 75 60 L 58 60 L 58 105 L 28 75 Z"
                  fill="url(#smooth-navy)"
                />

                <motion.path
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.45, delay: 0.1 }}
                  d="M 58 105 L 58 135 L 78 135 L 78 85 Z"
                  fill="url(#smooth-navy)"
                />

                <motion.path
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.45, delay: 0.12 }}
                  d="M 75 35 L 122 35 L 98 60 L 75 60 Z"
                  fill="url(#smooth-navy)"
                />

                {/* Lower inner teal wedge */}
                <motion.path
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.45, delay: 0.15 }}
                  d="M 78 85 L 78 135 L 115 135 Z"
                  fill="url(#smooth-inner)"
                />

                <motion.path
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.45, delay: 0.18 }}
                  d="M 78 135 L 78 165 L 102 165 L 102 135 Z"
                  fill="url(#smooth-navy)"
                />

                {/* DIAGONAL CYAN LIGHTNING SLASH */}
                <motion.path
                  initial={{ pathLength: 0, opacity: 0, scale: 0.95 }}
                  animate={{ pathLength: 1, opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  d="M 42 142 L 68 168 L 126 50 L 100 35 Z"
                  fill="url(#smooth-cyan)"
                  filter="url(#smooth-glow)"
                />

                {/* UPPER CIRCUIT ROUTING ARROW */}
                <motion.path
                  initial={{ x: -12, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  d="M 112 55 L 132 45 L 148 45 L 148 35 L 168 50 L 148 65 L 148 55 L 128 55 Z"
                  fill="url(#smooth-cyan)"
                />
                <path
                  d="M 128 55 L 148 55 L 148 65 L 168 50 L 168 54 L 148 69 L 148 59 L 128 59 Z"
                  fill="url(#smooth-shadow)"
                  opacity="0.9"
                />

                {/* LOWER CIRCUIT ROUTING ARROW */}
                <motion.path
                  initial={{ x: -12, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  d="M 98 85 L 118 75 L 134 75 L 134 65 L 154 80 L 134 95 L 134 85 L 116 85 Z"
                  fill="url(#smooth-cyan)"
                />
                <path
                  d="M 116 85 L 134 85 L 134 95 L 154 80 L 154 84 L 134 99 L 134 89 L 116 89 Z"
                  fill="url(#smooth-shadow)"
                  opacity="0.9"
                />

                {/* Arrowhead Nodes */}
                <motion.circle
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.55 }}
                  cx="168"
                  cy="50"
                  r="3"
                  fill="#FFFFFF"
                />
                <motion.circle
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.65 }}
                  cx="154"
                  cy="80"
                  r="3"
                  fill="#FFFFFF"
                />
              </svg>
            </div>

            {/* Typography: TRIM TOKEN AI */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 flex items-center justify-center gap-2 font-display font-extrabold text-2xl sm:text-3xl tracking-wider text-[#0b1626]"
            >
              <span>TRIM TOKEN</span>
              <span className="text-[#00C9E8] font-mono-data drop-shadow-[0_0_12px_rgba(0,201,232,0.8)]">
                AI
              </span>
            </motion.div>
          </motion.div>

          {/* Bottom Interactive Skip Hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            transition={{ delay: 0.6 }}
            className="absolute bottom-7 flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0d1624]/85 border border-white/10 backdrop-blur-md text-xs font-mono-data text-[#a4b8cc] hover:text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onComplete();
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00C9E8]" />
            <span>Click or press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white text-[10px]">Space</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white text-[10px]">Esc</kbd></span>
            <FastForward className="w-3.5 h-3.5 ml-0.5 text-[#00C9E8]" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
