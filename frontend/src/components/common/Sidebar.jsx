import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  BookOpen,
  FlaskConical,
  Clock,
  Mic2,
  Code2,
  Eye,
  Zap,
  HelpCircle,
  Briefcase
} from 'lucide-react';

const NAV_GROUPS = [
  {
    title: 'ACADEMIC CORE',
    links: [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/tutor', label: 'AI DSA Tutor', icon: Bot, badge: '13-Part' },
      { to: '/syllabus', label: 'Syllabus Tracker', icon: BookOpen, badge: 'Units 1-5' },
      { to: '/revision', label: 'Last Minute Revision', icon: Zap, badge: '15m/30m' },
    ]
  },
  {
    title: 'LAB & PRACTICALS',
    links: [
      { to: '/labs', label: 'Lab Experiments', icon: FlaskConical, badge: '15 Exps' },
      { to: '/lab-simulator', label: 'Lab Exam Simulator', icon: Clock, badge: 'Timed' },
      { to: '/viva', label: 'Viva Trainer', icon: Mic2, badge: 'Strict AI' },
      { to: '/visualizers', label: 'Visualizers', icon: Eye, badge: 'Interactive' },
    ]
  },
  {
    title: 'CODE & PLACEMENTS',
    links: [
      { to: '/analyzer', label: 'Code Analyzer', icon: Code2, badge: 'Audit' },
      { to: '/questions', label: 'Smart Question Bank', icon: HelpCircle, badge: 'MCQ/10M' },
      { to: '/placement', label: 'Placement Mode', icon: Briefcase, badge: 'LeetCode' },
    ]
  }
];

export default function Sidebar({ isOpen, closeSidebar }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-[61px] left-0 h-screen lg:h-[calc(100vh-61px)] w-64 glass-panel border-r border-white/10 z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {NAV_GROUPS.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <h4 className="px-3 text-[10px] font-mono font-bold tracking-wider text-slate-400/90 uppercase">
                {group.title}
              </h4>
              <div className="space-y-1 pt-1">
                {group.links.map((link) => {
                  const Icon = link.icon;
                  return (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={closeSidebar}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                          isActive
                            ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={16} />
                        <span>{link.label}</span>
                      </div>
                      {link.badge && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">
                          {link.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info pill */}
        <div className="p-3 border-t border-white/10 bg-slate-950/40 text-[10px] text-slate-500 font-mono text-center">
          Powered by Gemini AI Engine
        </div>
      </aside>
    </>
  );
}
