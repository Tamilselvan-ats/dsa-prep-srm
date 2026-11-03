import React, { useState, useEffect } from 'react';
import { fetchPlacementModules } from '../services/api';
import {
  Briefcase,
  Layers,
  Sparkles,
  Terminal,
  ExternalLink,
  Building2,
  CheckCircle2,
  GitBranch
} from 'lucide-react';

export default function PlacementMode() {
  const [modules, setModules] = useState([]);
  const [activeTopicId, setActiveTopicId] = useState('linked-list');

  useEffect(() => {
    fetchPlacementModules()
      .then(res => {
        if (res.modules) setModules(res.modules);
      })
      .catch(err => console.error('Placement fetch error:', err));
  }, []);

  const currentModule = modules.find(m => m.topicId === activeTopicId) || modules[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/40">
              <Briefcase size={20} />
            </span>
            Placement Mode (Academic to Technical Interviews)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Transform college C DSA syllabus into LeetCode patterns and interview coding tests
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950 px-3 py-1 rounded-xl border border-cyan-500/30">
            FAANG &amp; MNC Patterns
          </span>
        </div>
      </div>

      {/* Topic Switcher Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-white/5">
        {modules.map((m) => (
          <button
            key={m.topicId}
            onClick={() => setActiveTopicId(m.topicId)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 flex-shrink-0 ${
              activeTopicId === m.topicId
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 shadow-md font-extrabold'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <GitBranch size={14} />
            <span>{m.title.split(' in ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Active Module Details */}
      {currentModule && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Companies Tag Bar */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
                Academic Concept:
              </span>
              <p className="text-sm font-semibold text-white">{currentModule.academicConcept}</p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                <Building2 size={13} /> Frequently Asked At:
              </span>
              {currentModule.companies?.map((comp, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold"
                >
                  {comp}
                </span>
              ))}
            </div>
          </div>

          {/* Patterns Showcase */}
          <div className="space-y-6">
            {currentModule.interviewPatterns?.map((pat, idx) => (
              <div
                key={idx}
                className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                      Pattern {idx + 1}
                    </span>
                    <h3 className="text-lg font-black text-white mt-0.5">
                      {pat.patternName}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {pat.description}
                </p>

                {/* Academic vs Interview Comparison Box */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 space-y-1 text-xs">
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase block">
                    College Theory vs Interview Difference:
                  </span>
                  <p className="text-slate-200 italic">{pat.academicVsInterview}</p>
                </div>

                {/* LeetCode Problems Grid */}
                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Standard Interview Problems:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {pat.problems?.map((prob, pIdx) => (
                      <div
                        key={pIdx}
                        className="p-4 rounded-xl bg-slate-900 border border-white/5 flex flex-col justify-between space-y-2 text-xs"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-white text-xs">{prob.name}</span>
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                              prob.difficulty === 'Hard' ? 'bg-rose-950 text-rose-300' :
                              prob.difficulty === 'Medium' ? 'bg-amber-950 text-amber-300' :
                              'bg-emerald-950 text-emerald-300'
                            }`}>
                              {prob.difficulty}
                            </span>
                          </div>
                          <span className="text-[10px] text-cyan-400 font-mono block">
                            {prob.leetcode}
                          </span>
                        </div>

                        <div className="p-2 bg-slate-950 rounded font-mono text-[10px] text-slate-300 border border-white/5">
                          <span className="text-slate-500 block">C Implementation Hint:</span>
                          <code>{prob.cHint}</code>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
