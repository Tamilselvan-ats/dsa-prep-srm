import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProgress } from '../../context/ProgressContext';
import { Terminal, Flame, Award, Zap, User, LogOut, Menu, X } from 'lucide-react';

export default function Navbar({ toggleSidebar, isSidebarOpen }) {
  const { user, logout } = useAuth();
  const { xp, streak, unlockedBadges, badges } = useProgress();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-4 lg:px-8 py-3 flex items-center justify-between">
      {/* Brand & Mobile Hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition">
            <Terminal size={22} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white group-hover:text-cyan-300 transition">
                DSA MASTER
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
              Engineering C DSA Platform
            </p>
          </div>
        </Link>
      </div>

      {/* Gamification Counters & User Profile */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Daily Streak */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-bold"
          title={`${streak} Day Learning Streak!`}
        >
          <Flame size={15} className="text-amber-400 animate-bounce" />
          <span>{streak}d</span>
          <span className="text-[10px] text-amber-400/80 font-normal hidden sm:inline">streak</span>
        </div>

        {/* XP Points */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-bold"
          title="Total Experience Points"
        >
          <Zap size={14} className="text-cyan-400" />
          <span>{xp}</span>
          <span className="text-[10px] text-cyan-400/80 font-normal hidden sm:inline">XP</span>
        </div>

        {/* Badges Count */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-bold"
          title={`${unlockedBadges.length} of ${badges.length} Badges Unlocked`}
        >
          <Award size={14} className="text-purple-400" />
          <span>{unlockedBadges.length}</span>
          <span className="text-[10px] text-purple-400/80 font-normal">/ {badges.length}</span>
        </div>

        {/* User Pill / Login */}
        {user ? (
          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
              {user.displayName?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="hidden md:block text-left text-xs">
              <p className="font-semibold text-slate-200 leading-tight truncate max-w-[100px]">
                {user.displayName}
              </p>
              <p className="text-[10px] text-cyan-400/90 font-mono">
                {user.isDemo ? 'Demo Mode' : 'Verified'}
              </p>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition shadow-md shadow-cyan-500/20"
          >
            <User size={14} /> Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
