import React, { useState, useEffect } from 'react';
import { fetchRevisionNotes } from '../services/api';
import CodeBlock from '../components/common/CodeBlock';
import {
  Zap,
  Clock,
  BookOpen,
  Award,
  AlertTriangle,
  HelpCircle,
  FileCode,
  CheckCircle2,
  Filter
} from 'lucide-react';

export default function LastMinuteRevision() {
  const [mode, setMode] = useState('15min'); // '15min', '30min', '1hr'
  const [unit, setUnit] = useState('all');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchRevisionNotes(mode, unit)
      .then(res => {
        if (res.notes) setData(res.notes);
      })
      .catch(err => console.error('Revision fetch error:', err))
      .finally(() => setLoading(false));
  }, [mode, unit]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
              <Zap size={20} />
            </span>
            Last Minute Revision Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Rapid emergency revision summaries for the night before or 30 minutes before exams
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-white/10 text-xs font-semibold gap-1">
          {[
            { id: '15min', label: '15 Minutes Blitz', time: '15m' },
            { id: '30min', label: '30 Minutes Power', time: '30m' },
            { id: '1hr', label: '1 Hour Comprehensive', time: '60m' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`px-3.5 py-1.5 rounded-xl transition ${
                mode === m.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="glass-panel p-8 rounded-2xl border border-white/10 text-center space-y-3">
          <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-mono">Generating high-yield {mode} revision packet...</p>
        </div>
      )}

      {/* Revision Content */}
      {data && !loading && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* SECTION 1: IMPORTANT DEFINITIONS */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen size={18} className="text-amber-400" />
              1. High-Yield Definitions &amp; Formulae
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.definitions?.map((def, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-white/5 space-y-1.5 text-xs">
                  <span className="font-bold text-cyan-300 text-sm block">{def.term}</span>
                  <p className="text-slate-300 leading-relaxed">{def.definition}</p>
                  {def.formula && (
                    <div className="p-2 bg-slate-900 rounded font-mono text-[11px] text-amber-300 border border-white/5">
                      {def.formula}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: CRUCIAL ALGORITHMS */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock size={18} className="text-cyan-400" />
              2. Must-Know Algorithms &amp; Complexities
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.crucialAlgorithms?.map((algo, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-white/5 flex flex-col justify-between space-y-3 text-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white text-sm">{algo.name}</span>
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold">
                        {algo.time}
                      </span>
                    </div>
                    <div className="space-y-1 pt-2">
                      {algo.steps?.map((step, sIdx) => (
                        <div key={sIdx} className="text-slate-300 flex items-start gap-1.5">
                          <span className="text-cyan-400 font-mono">{sIdx + 1}.</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: MUST-KNOW C PROGRAMS */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileCode size={18} className="text-indigo-400" />
              3. High-Probability Exam C Code Snippets
            </h2>

            <div className="space-y-4">
              {data.mustKnowPrograms?.map((prog, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{prog.title}</span>
                    <span className="text-[11px] text-amber-300 font-mono">
                      ⭐ Key trick: {prog.keyTrick}
                    </span>
                  </div>
                  <CodeBlock code={prog.code} title={prog.title} />
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: EXPECTED QUESTIONS & VIVA TRAPS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Expected Questions */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Award size={18} className="text-purple-400" />
                4. Expected Exam Questions (2M / 5M / 10M)
              </h2>

              <div className="space-y-3">
                {data.expectedQuestions?.map((eq, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{eq.question}</span>
                      <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                        {eq.marks}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] pt-1">
                      <strong>Answer summary:</strong> {eq.answerSummary}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Viva Traps */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle size={18} className="text-rose-400" />
                5. Rapid-Fire Viva Examiner Traps
              </h2>

              <div className="space-y-3">
                {data.vivaTraps?.map((trap, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/20 text-xs space-y-1">
                    <p className="font-bold text-rose-300">⚠️ Trick: {trap.trap}</p>
                    <p className="text-slate-200 text-[11px]">
                      <strong>Correct Response:</strong> {trap.correctResponse}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
