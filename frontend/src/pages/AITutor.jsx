import React, { useState } from 'react';
import { askAITutor } from '../services/api';
import CodeBlock from '../components/common/CodeBlock';
import {
  Bot,
  Send,
  Sparkles,
  Layers,
  Clock,
  HardDrive,
  AlertCircle,
  HelpCircle,
  GraduationCap,
  Briefcase,
  Terminal,
  BookOpen,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const SUGGESTED_QUERIES = [
  "Explain AVL Rotation",
  "Give Linked List Program",
  "Dry run Dijkstra",
  "Difference between Queue and Stack",
  "Explain Infix to Postfix conversion",
  "How does Prim's algorithm find MST in C?"
];

// Helper to parse the 13 structured sections from markdown text
function parse13Sections(markdown) {
  if (!markdown) return null;

  const sectionTitles = [
    { key: 'simple', title: '1. Simple Explanation', icon: BookOpen },
    { key: 'detailed', title: '2. Detailed Explanation', icon: Layers },
    { key: 'analogy', title: '3. Real-Life Analogy', icon: Sparkles },
    { key: 'diagram', title: '4. Diagram', icon: Terminal },
    { key: 'dryRun', title: '5. Dry Run', icon: Clock },
    { key: 'cProgram', title: '6. C Program', icon: Terminal },
    { key: 'timeComplexity', title: '7. Time Complexity', icon: Clock },
    { key: 'spaceComplexity', title: '8. Space Complexity', icon: HardDrive },
    { key: 'viva', title: '9. Common Viva Questions', icon: HelpCircle },
    { key: 'mistakes', title: '10. Common Mistakes', icon: AlertCircle },
    { key: 'theoryExam', title: '11. Theory Exam Perspective', icon: GraduationCap },
    { key: 'labExam', title: '12. Lab Exam Perspective', icon: Terminal },
    { key: 'placement', title: '13. Placement Perspective', icon: Briefcase }
  ];

  const sections = {};
  const regex = /###\s*([0-9]+\.[^\n]+)([\s\S]*?)(?=(?:###\s*[0-9]+\.|$))/g;
  let match;

  while ((match = regex.exec(markdown)) !== null) {
    const header = match[1].trim();
    const content = match[2].trim();
    const matchedConfig = sectionTitles.find(s => header.toLowerCase().includes(s.key.toLowerCase()) || header.includes(s.title.split('.')[1].trim()));
    if (matchedConfig) {
      sections[matchedConfig.key] = content;
    }
  }

  // If regex parsing caught sufficient sections, return it; otherwise return raw content
  return {
    raw: markdown,
    parsed: Object.keys(sections).length >= 5 ? sections : null,
    configs: sectionTitles
  };
}

export default function AITutor() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    simple: true,
    cProgram: true,
    diagram: true,
    dryRun: true,
    viva: true
  });

  const toggleSection = (key) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const expandAll = () => {
    const all = {};
    ['simple', 'detailed', 'analogy', 'diagram', 'dryRun', 'cProgram', 'timeComplexity', 'spaceComplexity', 'viva', 'mistakes', 'theoryExam', 'labExam', 'placement'].forEach(k => all[k] = true);
    setExpandedSections(all);
  };

  const collapseAll = () => {
    setExpandedSections({});
  };

  const handleAsk = async (customQuery) => {
    const q = customQuery || query;
    if (!q.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const data = await askAITutor(q);
      const parsedData = parse13Sections(data.content);
      setResult({ ...data, parsedData, query: q });
      expandAll();
    } catch (err) {
      setResult({
        error: true,
        content: `Error connecting to AI Tutor: ${err.message}. Please check your backend connection or retry.`
      });
    } finally {
      setLoading(false);
    }
  };

  // Extract C code snippet if present inside triple backticks
  const extractCode = (text) => {
    const match = text?.match(/```c([\s\S]*?)```/);
    return match ? match[1].trim() : text;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/40">
              <Bot size={20} />
            </span>
            AI DSA Tutor
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Answers every C DSA question in the strict 13-Part Academic &amp; Interview Structure
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
            13-Part Academic Standard
          </span>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
          High-Yield Exam Prompts:
        </span>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUERIES.map((sq, i) => (
            <button
              key={i}
              onClick={() => {
                setQuery(sq);
                handleAsk(sq);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-cyan-950/60 border border-white/10 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-cyan-200 transition"
            >
              💬 {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Box */}
      <div className="glass-panel p-2 rounded-2xl border border-white/10 flex items-center gap-2 shadow-xl">
        <input
          type="text"
          placeholder="Ask anything (e.g. 'Explain AVL Rotation', 'Give Linked List Program', 'Dry run Dijkstra')..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none"
        />
        <button
          onClick={() => handleAsk()}
          disabled={loading || !query.trim()}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-extrabold text-xs transition hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Send size={15} />
              <span>Generate Answer</span>
            </>
          )}
        </button>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="glass-panel p-8 rounded-2xl border border-white/10 space-y-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20" />
            <div className="h-4 w-48 bg-slate-800 rounded" />
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-4 w-full bg-slate-800/80 rounded" />
            <div className="h-4 w-5/6 bg-slate-800/60 rounded" />
            <div className="h-4 w-3/4 bg-slate-800/40 rounded" />
          </div>
          <div className="h-32 w-full bg-slate-900 rounded-xl" />
        </div>
      )}

      {/* 13-Part Structured Answer Rendering */}
      {result && !loading && (
        <div className="space-y-4">
          {/* Answer Controls bar */}
          <div className="flex items-center justify-between px-2 text-xs">
            <div className="flex items-center gap-2 font-mono text-cyan-300">
              <Sparkles size={14} className="text-cyan-400" />
              <span>Question: &ldquo;{result.query}&rdquo;</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={expandAll} className="text-slate-400 hover:text-white transition">
                Expand All
              </button>
              <span className="text-slate-600">•</span>
              <button onClick={collapseAll} className="text-slate-400 hover:text-white transition">
                Collapse All
              </button>
            </div>
          </div>

          {result.parsedData?.parsed ? (
            /* Parsed 13-Part Accordion View */
            <div className="space-y-3">
              {result.parsedData.configs.map((config) => {
                const content = result.parsedData.parsed[config.key];
                if (!content) return null;
                const isExpanded = expandedSections[config.key] ?? false;
                const Icon = config.icon;

                return (
                  <div
                    key={config.key}
                    className="glass-panel rounded-2xl border border-white/10 overflow-hidden transition"
                  >
                    {/* Accordion Header */}
                    <button
                      onClick={() => toggleSection(config.key)}
                      className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-white/[0.02] transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 flex items-center justify-center">
                          <Icon size={15} />
                        </div>
                        <span className="text-sm font-bold text-white tracking-wide">
                          {config.title}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp size={16} className="text-slate-400" />
                      ) : (
                        <ChevronDown size={16} className="text-slate-400" />
                      )}
                    </button>

                    {/* Content Section */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-1 text-xs text-slate-300 leading-relaxed border-t border-white/5 space-y-3">
                        {config.key === 'cProgram' ? (
                          <CodeBlock
                            code={extractCode(content)}
                            title="Complete C Program"
                          />
                        ) : config.key === 'diagram' ? (
                          <div className="bg-slate-950 p-4 rounded-xl border border-white/10 font-mono text-[11px] text-cyan-300 overflow-x-auto whitespace-pre">
                            {content.replace(/```[a-z]*/g, '')}
                          </div>
                        ) : (
                          <div className="whitespace-pre-line prose prose-invert prose-xs max-w-none">
                            {content}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Fallback Raw Markdown View */
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
              {result.content}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
