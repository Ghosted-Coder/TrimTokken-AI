"use client";

import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, LogOut, Monitor, Moon, Settings, Sun, Activity } from 'lucide-react';
import { cn } from '../lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export interface NavTab {
  label: string;
  value: string;
}

export interface AppNavbarProps {
  tabs: NavTab[];
  activeTab: string;
  onTabChange: (value: string) => void;
  brandName?: string;
  brandBadge?: string;
  userName?: string;
  userEmail?: string;
  userInitials?: string;
  userImage?: string;
  onLogout?: () => void;
}

const THEME_OPTIONS = [
  { key: 'system', icon: Monitor, label: 'System theme' },
  { key: 'light', icon: Sun, label: 'Light theme' },
  { key: 'dark', icon: Moon, label: 'Dark theme' },
] as const;

type ThemeKey = (typeof THEME_OPTIONS)[number]['key'];

function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeKey>(() => {
    if (typeof window === 'undefined') return 'system';
    const stored = localStorage.getItem('theme');
    return THEME_OPTIONS.some((option) => option.key === stored) ? (stored as ThemeKey) : 'system';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      root.classList.toggle('dark', media.matches);
      const listener = (event: MediaQueryListEvent) => root.classList.toggle('dark', event.matches);
      media.addEventListener('change', listener);
      localStorage.setItem('theme', theme);
      return () => media.removeEventListener('change', listener);
    }
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="relative isolate flex h-7 rounded-full bg-background p-1 ring-1 ring-border">
      {THEME_OPTIONS.map(({ key, icon: Icon, label }) => {
        const isActive = theme === key;
        return (
          <button key={key} type="button" aria-label={label} onClick={() => setTheme(key)} className="relative h-5 w-6 rounded-full">
            {isActive && <span className="absolute inset-0 rounded-full bg-secondary" />}
            <Icon className={cn('relative z-10 m-auto h-3.5 w-3.5', isActive ? 'text-foreground' : 'text-muted-foreground')} />
          </button>
        );
      })}
    </div>
  );
}

export function AppNavbar({
  tabs,
  activeTab,
  onTabChange,
  brandName = 'TrimToken AI',
  brandBadge = 'v1.0',
  userName = 'Master Admin',
  userEmail,
  userInitials = 'AD',
  userImage,
  onLogout,
}: AppNavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTabClick = useCallback((value: string) => onTabChange(value), [onTabChange]);

  return (
    <div className={cn('sticky top-0 z-50 flex h-[4.5rem] w-full min-w-0 items-center justify-between overflow-hidden px-3 transition-all duration-500 sm:px-4', scrolled ? 'border-b border-[#28352f] bg-[#080c10]/90 shadow-[0_12px_40px_rgba(0,0,0,0.22)] backdrop-blur-2xl' : 'border-b border-transparent bg-[#080c10]/35')}>
      <div className="mx-auto flex w-full max-w-[1600px] min-w-0 items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="group flex shrink-0 items-center gap-2 whitespace-nowrap">
            <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl border border-[#00e5ff]/40 bg-[#0c1a25] shadow-[0_0_22px_rgba(0,229,255,0.16)]">
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,229,255,0.4),transparent_60%)] opacity-70 transition-opacity group-hover:opacity-100" />
              <span className="relative font-mono-data text-xs font-black text-[#00e5ff]">T</span>
            </div>
            <div className="hidden leading-none sm:block">
              <span className="block text-sm font-semibold tracking-tight text-foreground">{brandName}</span>
              {brandBadge && <span className="mt-1 block font-mono-data text-[9px] uppercase tracking-[0.18em] text-[#869683]">Cost spectrum gateway // {brandBadge}</span>}
            </div>
          </div>
          <nav aria-label="Workspace sections" className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <ul className="flex w-max min-w-full items-center gap-1 px-1 lg:gap-1.5">
              {tabs.map((tab) => (
                <li key={tab.value}>
                  <motion.button type="button" onClick={() => handleTabClick(tab.value)} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 500, damping: 28 }} className={cn('group relative isolate inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full px-3 font-mono-data text-[10px] font-medium tracking-[0.08em] uppercase transition-colors sm:text-[11px] lg:px-3.5 lg:text-xs', tab.value === activeTab ? 'text-[#07100a]' : 'text-[#869683] hover:text-[#dfe2eb]')}>
                    {tab.value === activeTab && (
                      <motion.span layoutId="active-nav-pill" className="skiper-active-pill absolute inset-0 z-0 rounded-full bg-[#72ff70] shadow-[0_0_22px_rgba(114,255,112,0.28)]" transition={{ type: 'spring', stiffness: 420, damping: 32 }} />
                    )}
                    <span className={cn('relative z-10 h-1.5 w-1.5 rounded-full transition-all', tab.value === activeTab ? 'skiper-active-dot bg-[#07100a]' : 'bg-[#3b4b37] group-hover:bg-[#00e5ff]')} />
                    <span className="relative z-10">{tab.label}</span>
                    <AnimatePresence>
                      {tab.value === activeTab && (
                        <motion.span initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} className="relative z-10 hidden sm:block">
                          <ArrowUpRight className="h-3 w-3" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-[#28352f] bg-[#0d1413]/80 px-3 py-1.5 font-mono-data text-[9px] uppercase tracking-[0.14em] text-[#72ff70] xl:flex">
          <Activity className="h-3 w-3 animate-pulse" />
          <span>Ingress online</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" aria-label="Open account menu" className="shrink-0 rounded-full">
              <Avatar className="h-8 w-8 border border-border">
                {userImage && <AvatarImage src={userImage} alt="" />}
                <AvatarFallback className="text-xs font-medium">{userInitials}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 rounded-xl p-3" align="end">
            <div className="p-2">
              <p className="font-semibold text-foreground">{userName}</p>
              {userEmail && <p className="text-sm text-muted-foreground">{userEmail}</p>}
            </div>
            <DropdownMenuGroup>
              <DropdownMenuItem className="justify-between py-3">Account settings <Settings className="h-4 w-4" /></DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="-mx-3" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="justify-between py-3">Theme <ThemeSwitcher /></DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="-mx-3" />
            <DropdownMenuItem className="justify-between py-3" onClick={onLogout}>Logout <LogOut className="h-4 w-4" /></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default AppNavbar;
