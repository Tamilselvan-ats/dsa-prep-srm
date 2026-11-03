import React, { useState } from 'react';
import { analyzeCodeSnippet } from '../services/api';
import CodeBlock from '../components/common/CodeBlock';
import {
  Code2,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Clock,
  HardDrive,
  GitBranch,
  Sparkles,
  FileCode,
  Copy
} from 'lucide-react';

const SAMPLE_CODES = [
  {
    name: 'Memory Leak in Singly Linked List',
    code: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

void deleteNode(struct Node** head, int key) {
    struct Node* temp = *head;
    struct Node* prev = NULL;
    if (temp != NULL && temp->data == key) {
        *head = temp->next; // BUG: node is unlinked but never freed! Memory Leak!
        return;
    }
    while (temp != NULL && temp->data != key) {
        prev = temp;
        temp = temp->next;
    }
    if (temp == NULL) return;
    prev->next = temp->next; // BUG: free(temp) is omitted!
}`
  },
  {
    name: 'Null Pointer Dereference in Stack',
    code: `#include <stdio.h>
#include <stdlib.h>

struct Stack {
    int data;
    struct Stack* next;
};

int pop(struct Stack** top) {
    // BUG: Missing check for if (*top == NULL) -> Segmentation fault on empty stack!
    struct Stack* temp = *top;
    int val = temp->data; 
    *top = (*top)->next;
    free(temp);
    return val;
}`
  }
];

export default function CodeAnalyzer() {
  const [code, setCode] = useState(SAMPLE_CODES[0].code);
  const [goal, setGoal] = useState('Detect memory leaks, null dereferences, and time complexity');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('mistakes'); // 'mistakes', 'linebyline', 'improved', 'flow', 'viva'

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setAnalysis(null);

    try {
      const res = await analyzeCodeSnippet({ code, userGoal: goal });
      if (res.analysis) {
        setAnalysis(res.analysis);
      }
    } catch (err) {
      console.error('Code analysis failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/40">
              <Code2 size={20} />
            </span>
            AI C Code Analyzer &amp; Bug Auditor
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Detects memory leaks, NULL pointer dereferences, computes complexity, and generates viva questions
          </p>
        </div>

        <div className="flex items-center gap-2">
          {SAMPLE_CODES.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => setCode(sample.code)}
              className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:text-white transition"
            >
              Load: {sample.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Action Row */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="px-4 py-2.5 bg-slate-900 border-b border-white/10 flex items-center justify-between text-xs">
          <span className="font-mono text-slate-300">input_code.c</span>
          <span className="text-[10px] text-slate-500 font-mono">Paste arbitrary C program</span>
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck="false"
          rows={11}
          className="w-full bg-slate-950 p-4 text-xs font-mono text-slate-200 focus:outline-none resize-none leading-relaxed"
          placeholder="Paste your C code here to analyze..."
        />

        <div className="p-3 bg-slate-900/90 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <input
            type="text"
            placeholder="Analysis Focus (e.g. Memory leaks, Big-O, Pointer safety)..."
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="glass-input px-3 py-1.5 rounded-lg text-xs flex-1 max-w-md"
          />

          <button
            onClick={handleAnalyze}
            disabled={loading || !code.trim()}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 text-white font-bold text-xs shadow-lg hover:opacity-95 transition disabled:opacity-40"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Auditing Code...</span>
              </>
            ) : (
              <>
                <Sparkles size={14} />
                <span>Audit C Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results View */}
      {analysis && (
        <div className="space-y-5 animate-in fade-in duration-300">
          {/* Complexity Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel p-4 rounded-xl border border-white/10 flex items-center gap-3">
              <Clock size={22} className="text-emerald-400" />
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">Computed Time:</span>
                <p className="text-sm font-bold text-white font-mono">{analysis.complexity?.time}</p>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-white/10 flex items-center gap-3">
              <HardDrive size={22} className="text-purple-400" />
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">Auxiliary Space:</span>
                <p className="text-sm font-bold text-white font-mono">{analysis.complexity?.space}</p>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-white/10 flex items-center gap-3">
              <AlertTriangle size={22} className="text-amber-400" />
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">Vulnerabilities:</span>
                <p className="text-sm font-bold text-amber-300 font-mono">
                  {analysis.mistakes?.length || 0} issues detected
                </p>
              </div>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-white/10 text-xs font-semibold gap-6">
            {[
              { id: 'mistakes', label: 'Bugs & Leaks', icon: AlertTriangle },
              { id: 'linebyline', label: 'Line-by-Line Walkthrough', icon: FileCode },
              { id: 'improved', label: 'Improved C Code', icon: Code2 },
              { id: 'flow', label: 'Execution Flow & Pseudocode', icon: GitBranch },
              { id: 'viva', label: 'Targeted Viva Questions', icon: HelpCircle }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-2.5 border-b-2 flex items-center gap-2 transition ${
                    activeTab === tab.id
                      ? 'border-rose-500 text-rose-300'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: MISTAKES & BUGS */}
          {activeTab === 'mistakes' && (
            <div className="space-y-3">
              {analysis.mistakes?.map((mistake, i) => (
                <div key={i} className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm flex items-center gap-2">
                      <AlertTriangle size={15} className="text-rose-400" /> {mistake.issue}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                      {mistake.severity} Severity
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed mt-1">{mistake.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: LINE BY LINE */}
          {activeTab === 'linebyline' && (
            <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-2">
              {analysis.lineByLine?.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-white/5 border border-white/5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="font-mono text-cyan-300 font-semibold">{item.line}</span>
                  <span className="text-slate-300">{item.explanation}</span>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: IMPROVED CODE */}
          {activeTab === 'improved' && (
            <div>
              <CodeBlock code={analysis.improvedCode} title="Corrected & Optimized C Code" />
            </div>
          )}

          {/* TAB 4: FLOW & PSEUDOCODE */}
          {activeTab === 'flow' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-panel p-5 rounded-xl border border-white/10 space-y-2 text-xs">
                <span className="font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Step-by-step Flow:
                </span>
                <div className="space-y-1.5 text-slate-200">
                  {analysis.flowSteps?.map((s, i) => (
                    <div key={i} className="p-2 rounded bg-white/5">
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel p-5 rounded-xl border border-white/10 space-y-2 text-xs">
                <span className="font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Algorithmic Pseudocode:
                </span>
                <pre className="p-3 bg-slate-950 rounded-xl font-mono text-cyan-300 text-[11px] overflow-x-auto whitespace-pre">
                  {analysis.pseudocode}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 5: VIVA QUESTIONS */}
          {activeTab === 'viva' && (
            <div className="space-y-3">
              {analysis.vivaQuestions?.map((vq, i) => (
                <div key={i} className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs space-y-1.5">
                  <p className="font-bold text-white text-sm">Q: {vq.question}</p>
                  <p className="text-slate-300 leading-relaxed">A: {vq.answer}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
