import React from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Bot,
  FlaskConical,
  Clock,
  Mic2,
  Code2,
  Eye,
  Award,
  Zap,
  Flame,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const {
    xp,
    streak,
    badges,
    unlockedBadges,
    overallCompletionRate,
    unitBreakdown,
    labReadiness,
    vivaReadiness,
    strongAreas,
    weakAreas,
    completedTopics
  } = useProgress();

  const QUICK_ACTIONS = [
    {
      title: 'AI DSA Tutor',
      desc: 'Ask any question for the 13-part structured answer',
      to: '/tutor',
      icon: Bot,
      color: 'from-cyan-500 to-blue-600',
      badge: 'Popular'
    },
    {
      title: 'Lab Exam Simulator',
      desc: 'Timed 45-min random practical test & AI code grading',
      to: '/lab-simulator',
      icon: Clock,
      color: 'from-indigo-500 to-purple-600',
      badge: '10 Marks'
    },
    {
      title: 'Viva Trainer',
      desc: 'Face strict examiner Prof. Ramanathan with scoring',
      to: '/viva',
      icon: Mic2,
      color: 'from-purple-500 to-pink-600',
      badge: 'Adaptive'
    },
    {
      title: 'Algorithm Visualizers',
      desc: 'Interactive step-by-step animations with controls',
      to: '/visualizers',
      icon: Eye,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Controls'
    },
    {
      title: 'Last Minute Revision',
      desc: '15m / 30m / 1h rapid emergency exam preparation',
      to: '/revision',
      icon: Zap,
      color: 'from-amber-500 to-orange-600',
      badge: 'High-Yield'
    },
    {
      title: 'C Code Analyzer',
      desc: 'Audit pointers, memory leaks, line-by-line flow',
      to: '/analyzer',
      icon: Code2,
      color: 'from-rose-500 to-red-600',
      badge: 'Audit'
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/50 border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-semibold">
                SEMESTER PREPARATION SUITE
              </span>
              <span className="text-xs text-slate-400 font-mono">C Programming DSA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-300">{user?.displayName || 'Student'}</span>!
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Your personalized AI learning hub for Theory Exams, Internal Tests, Lab Practicals, Viva Voce, and Campus Placements.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/tutor"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition hover:scale-105"
            >
              <Bot size={18} /> Launch AI Tutor
            </Link>
            <Link
              to="/revision"
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm border border-white/10 transition"
            >
              <Zap size={16} className="text-amber-400" /> Rapid Revision
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Academic Readiness Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Syllabus Mastery</span>
            <BookOpen size={16} className="text-cyan-400" />
          </div>
          <div className="my-3">
            <span className="text-3xl font-black text-white">{overallCompletionRate}%</span>
            <span className="text-xs text-slate-400 ml-2">({Object.keys(completedTopics).length}/47 topics)</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${overallCompletionRate}%` }}
            />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Lab Readiness</span>
            <FlaskConical size={16} className="text-indigo-400" />
          </div>
          <div className="my-3">
            <span className="text-3xl font-black text-indigo-300">{labReadiness}%</span>
            <span className="text-xs text-slate-400 ml-2">15 experiments</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${labReadiness}%` }}
            />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Viva Readiness</span>
            <Mic2 size={16} className="text-purple-400" />
          </div>
          <div className="my-3">
            <span className="text-3xl font-black text-purple-300">{vivaReadiness}%</span>
            <span className="text-xs text-slate-400 ml-2">prof grade</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${vivaReadiness}%` }}
            />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Study Streak</span>
            <Flame size={16} className="text-amber-400" />
          </div>
          <div className="my-3">
            <span className="text-3xl font-black text-amber-300">{streak} Days</span>
            <span className="text-xs text-slate-400 ml-2">Daily Consistency</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, streak * 20)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Feature Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BrainCircuit size={20} className="text-cyan-400" /> Master Features
          </h2>
          <span className="text-xs text-slate-400">All tools tailored for C DSA</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {QUICK_ACTIONS.map((action, i) => {
            const Icon = action.icon;
            return (
              <Link
                key={i}
                to={action.to}
                className="group glass-card p-6 rounded-2xl border border-white/10 hover:border-cyan-500/40 flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition`}>
                    <Icon size={24} />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-cyan-300">
                    {action.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition flex items-center gap-1.5">
                    {action.title}
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {action.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Unit Progress & Academic Diagnostic */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unit Breakdown Progress */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-cyan-400" /> Unit-wise Progress
            </h3>
            <Link to="/syllabus" className="text-xs text-cyan-400 hover:underline">
              View Syllabus &rarr;
            </Link>
          </div>

          <div className="space-y-3.5 pt-2">
            {[
              { num: 1, name: 'Unit 1: Structures & Pointers', pct: unitBreakdown.unit1, color: 'from-cyan-500 to-blue-500' },
              { num: 2, name: 'Unit 2: Linear Lists (SLL, DLL, Circular)', pct: unitBreakdown.unit2, color: 'from-blue-500 to-indigo-500' },
              { num: 3, name: 'Unit 3: Stacks & Queues', pct: unitBreakdown.unit3, color: 'from-indigo-500 to-purple-500' },
              { num: 4, name: 'Unit 4: Trees, BST, AVL & Hashing', pct: unitBreakdown.unit4, color: 'from-purple-500 to-pink-500' },
              { num: 5, name: 'Unit 5: Graphs, BFS, DFS, Dijkstra, MST', pct: unitBreakdown.unit5, color: 'from-pink-500 to-rose-500' },
            ].map((u) => (
              <div key={u.num} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{u.name}</span>
                  <span className="text-cyan-300 font-mono font-bold">{u.pct}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-white/5">
                  <div
                    className={`bg-gradient-to-r ${u.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${u.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Diagnostics: Weak & Strong Areas */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-400" /> Diagnostic Focus Areas
          </h3>

          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <AlertTriangle size={13} /> High Priority Weak Areas (Needs Revision)
              </span>
              <div className="space-y-2">
                {weakAreas.map((area, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs">
                    <span className="text-slate-200">{area}</span>
                    <Link to="/tutor" className="text-[10px] font-bold text-rose-300 hover:text-white px-2 py-1 rounded bg-rose-500/20">
                      Ask Tutor &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <CheckCircle2 size={13} /> Strong Topics (Mastered)
              </span>
              <div className="flex flex-wrap gap-2">
                {strongAreas.map((area, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
                    ✓ {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gamification Badges Showcase */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award size={18} className="text-purple-400" /> Academic Achievement Badges
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Unlocked by completing unit topics and passing lab simulations
            </p>
          </div>
          <span className="text-xs font-mono text-purple-300">
            {unlockedBadges.length} of {badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 pt-2">
          {badges.map((badge) => {
            const isUnlocked = unlockedBadges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                  isUnlocked
                    ? 'bg-gradient-to-b from-purple-950/40 to-slate-900 border-purple-500/40 shadow-lg shadow-purple-500/10'
                    : 'bg-slate-900/40 border-white/5 opacity-40 grayscale'
                }`}
                title={badge.description}
              >
                <span className="text-2xl">{badge.icon}</span>
                <span className="text-[11px] font-bold text-slate-200 leading-tight">
                  {badge.name}
                </span>
                <span className={`text-[9px] font-mono ${isUnlocked ? 'text-purple-300' : 'text-slate-500'}`}>
                  {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
