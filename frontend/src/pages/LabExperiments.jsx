import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLabs } from '../services/api';
import CodeBlock from '../components/common/CodeBlock';
import {
  FlaskConical,
  Search,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock,
  Layers,
  Terminal,
  Play,
  ArrowRight,
  BookOpen
} from 'lucide-react';

export default function LabExperiments() {
  const [experiments, setExperiments] = useState([]);
  const [selectedId, setSelectedId] = useState(1);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('code'); // 'code', 'viva', 'theory'
  const navigate = useNavigate();

  useEffect(() => {
    fetchLabs()
      .then(data => {
        if (data.experiments) setExperiments(data.experiments);
      })
      .catch(err => console.error('Error fetching labs:', err));
  }, []);

  const currentExp = experiments.find(e => e.id === selectedId) || experiments[0];

  const filteredExperiments = experiments.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.id.toString().includes(search) ||
    e.aim.toLowerCase().includes(search.toLowerCase())
  );

  const handleLaunchSimulator = () => {
    if (!currentExp) return;
    navigate('/lab-simulator', {
      state: {
        presetQuestion: `Implement ${currentExp.title} in C with proper input validation and memory safety.`,
        starterCode: currentExp.program
      }
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/40">
              <FlaskConical size={20} />
            </span>
            Lab Exam Preparation (15 Experiments)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete database of all standard university C DSA practical experiments
          </p>
        </div>

        <button
          onClick={handleLaunchSimulator}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 hover:opacity-95 transition"
        >
          <Play size={14} /> Practice in Simulator
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 15 Experiments Master List (4 cols) */}
        <div className="lg:col-span-4 glass-panel p-4 rounded-2xl border border-white/10 space-y-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Filter experiment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="glass-input pl-9 pr-3 py-2 rounded-xl text-xs w-full"
            />
          </div>

          <div className="space-y-1.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredExperiments.map((exp) => {
              const isSelected = exp.id === selectedId;
              return (
                <button
                  key={exp.id}
                  onClick={() => setSelectedId(exp.id)}
                  className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-500/30 to-purple-500/30 border-indigo-500/50 text-white shadow-md'
                      : 'bg-slate-900/40 border-white/5 text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center font-mono text-[11px] font-bold text-indigo-300">
                      {exp.id}
                    </span>
                    <span className="text-xs font-semibold truncate max-w-[170px]">
                      {exp.title}
                    </span>
                  </div>
                  <ArrowRight size={13} className={`text-slate-400 transition ${isSelected ? 'opacity-100 translate-x-0.5' : 'opacity-0'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Complete Detailed Experiment Record (8 cols) */}
        {currentExp && (
          <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
            {/* Experiment Title & Aim */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider mb-1">
                <span>Experiment {currentExp.id} of 15</span>
              </div>
              <h2 className="text-xl font-black text-white">
                {currentExp.title}
              </h2>
              <div className="mt-2 p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-slate-300 leading-relaxed">
                <span className="font-bold text-white uppercase font-mono mr-1">Aim:</span>
                {currentExp.aim}
              </div>
            </div>

            {/* Sub-tabs */}
            <div className="flex border-b border-white/10 text-xs font-semibold gap-4">
              <button
                onClick={() => setActiveTab('code')}
                className={`pb-2.5 border-b-2 transition ${activeTab === 'code' ? 'border-indigo-400 text-indigo-300' : 'border-transparent text-slate-400 hover:text-white'}`}
              >
                C Program &amp; I/O
              </button>
              <button
                onClick={() => setActiveTab('theory')}
                className={`pb-2.5 border-b-2 transition ${activeTab === 'theory' ? 'border-indigo-400 text-indigo-300' : 'border-transparent text-slate-400 hover:text-white'}`}
              >
                Algorithm &amp; Memory
              </button>
              <button
                onClick={() => setActiveTab('viva')}
                className={`pb-2.5 border-b-2 transition ${activeTab === 'viva' ? 'border-indigo-400 text-indigo-300' : 'border-transparent text-slate-400 hover:text-white'}`}
              >
                Viva &amp; Pitfalls
              </button>
            </div>

            {/* TAB 1: CODE & IO */}
            {activeTab === 'code' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
                    C Source Code:
                  </h3>
                  <CodeBlock code={currentExp.program} title={`Experiment ${currentExp.id}: ${currentExp.title}`} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                      Sample Input:
                    </span>
                    <pre className="text-xs font-mono text-cyan-300 whitespace-pre overflow-x-auto">
                      {currentExp.sampleInput}
                    </pre>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                      Sample Output:
                    </span>
                    <pre className="text-xs font-mono text-emerald-300 whitespace-pre overflow-x-auto">
                      {currentExp.sampleOutput}
                    </pre>
                  </div>
                </div>

                {/* Dry Run */}
                <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-slate-300 leading-relaxed">
                  <span className="font-mono font-bold text-indigo-400 uppercase block mb-1">
                    Dry Run Walkthrough:
                  </span>
                  {currentExp.dryRun}
                </div>
              </div>
            )}

            {/* TAB 2: ALGORITHM & MEMORY */}
            {activeTab === 'theory' && (
              <div className="space-y-5 text-xs text-slate-300">
                {/* Algorithm steps */}
                <div>
                  <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Step-by-Step Algorithm:
                  </h3>
                  <div className="space-y-2">
                    {currentExp.algorithm?.map((step, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                        {step}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Memory Diagram */}
                <div>
                  <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Memory Layout &amp; Pointer Diagram:
                  </h3>
                  <pre className="p-4 bg-slate-950 rounded-xl border border-white/10 font-mono text-cyan-300 text-[11px] overflow-x-auto">
                    {currentExp.memoryDiagram}
                  </pre>
                </div>

                {/* Complexity Analysis */}
                <div className="p-4 rounded-xl bg-slate-900 border border-white/10">
                  <h4 className="font-mono font-bold text-white mb-1 uppercase tracking-wider">
                    Complexity Analysis:
                  </h4>
                  <p>{currentExp.complexityAnalysis}</p>
                </div>
              </div>
            )}

            {/* TAB 3: VIVA & COMMON ERRORS */}
            {activeTab === 'viva' && (
              <div className="space-y-5 text-xs">
                {/* Common Errors */}
                <div>
                  <h3 className="font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <AlertTriangle size={14} /> Common Errors In Lab Exams
                  </h3>
                  <div className="space-y-2">
                    {currentExp.commonErrors?.map((err, i) => (
                      <div key={i} className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-slate-200">
                        ⚠️ {err}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Viva Questions */}
                <div>
                  <h3 className="font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <HelpCircle size={14} /> Expected Lab Viva Questions
                  </h3>
                  <div className="space-y-3">
                    {currentExp.vivaQuestions?.map((vq, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-1">
                        <p className="font-bold text-white">Q: {vq.q}</p>
                        <p className="text-slate-300">A: {vq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
