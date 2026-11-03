import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSyllabus } from '../services/api';
import { useProgress } from '../context/ProgressContext';
import CodeBlock from '../components/common/CodeBlock';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Sparkles,
  Bot,
  Search,
  Filter,
  Layers,
  HelpCircle,
  X
} from 'lucide-react';

export default function SyllabusTracker() {
  const [syllabus, setSyllabus] = useState([]);
  const [activeUnit, setActiveUnit] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const { completedTopics, toggleTopicCompletion } = useProgress();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSyllabus()
      .then(data => {
        if (data.units) setSyllabus(data.units);
      })
      .catch(err => console.error('Error fetching syllabus:', err));
  }, []);

  const currentUnitData = syllabus.find(u => u.unit === activeUnit);

  // Filter topics
  const topicsToDisplay = (currentUnitData?.topics || []).filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateUnitProgress = (topics = []) => {
    if (topics.length === 0) return 0;
    const completed = topics.filter(t => completedTopics[t.id]).length;
    return Math.round((completed / topics.length) * 100);
  };

  const handleAskTutorForTopic = (topicTitle) => {
    navigate('/tutor', { state: { query: `Explain ${topicTitle} in C DSA in complete detail` } });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/40">
              <BookOpen size={20} />
            </span>
            Syllabus Tracker
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete 5-Unit Engineering C DSA Curriculum with interactive mastery tracking
          </p>
        </div>

        {/* Global Progress Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/80 px-3 py-1 rounded-xl border border-cyan-500/30">
            {Object.keys(completedTopics).length} of 47 Topics Mastered
          </span>
        </div>
      </div>

      {/* Unit Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/5">
        {[1, 2, 3, 4, 5].map((uNum) => {
          const unit = syllabus.find(u => u.unit === uNum);
          const pct = calculateUnitProgress(unit?.topics || []);
          return (
            <button
              key={uNum}
              onClick={() => setActiveUnit(uNum)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl border transition text-xs font-bold flex items-center gap-2.5 ${
                activeUnit === uNum
                  ? 'bg-gradient-to-r from-cyan-500/30 to-indigo-500/30 text-white border-cyan-500/50 shadow-md'
                  : 'bg-slate-900/60 text-slate-400 border-white/5 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <span>Unit {uNum}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${pct === 100 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-slate-300'}`}>
                {pct}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Unit Info & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">
            {currentUnitData?.title || `Unit ${activeUnit}`}
          </h2>
          <p className="text-xs text-slate-400">
            {currentUnitData?.description}
          </p>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search size={14} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search topics in unit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input pl-9 pr-3 py-2 rounded-xl text-xs w-full"
          />
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topicsToDisplay.map((topic) => {
          const isDone = !!completedTopics[topic.id];
          return (
            <div
              key={topic.id}
              className={`glass-panel p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-3 ${
                isDone
                  ? 'border-emerald-500/40 bg-emerald-950/10'
                  : 'border-white/10 hover:border-cyan-500/30'
              }`}
            >
              {/* Top Row: Title, Weight & Checkbox */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white tracking-wide">
                      {topic.title}
                    </h3>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-cyan-300">
                      {topic.examWeight}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    Category: {topic.category}
                  </span>
                </div>

                {/* Mark Complete Checkbox */}
                <button
                  onClick={() => toggleTopicCompletion(topic.id)}
                  className={`p-1.5 rounded-lg transition ${
                    isDone
                      ? 'text-emerald-400 hover:text-emerald-300'
                      : 'text-slate-500 hover:text-cyan-400'
                  }`}
                  title={isDone ? 'Mark as Incomplete' : 'Mark as Mastered (+50 XP)'}
                >
                  {isDone ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                </button>
              </div>

              {/* Summary */}
              <p className="text-xs text-slate-300 leading-relaxed">
                {topic.summary}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                <button
                  onClick={() => setSelectedTopic(topic)}
                  className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  View Details &amp; C Snippet &rarr;
                </button>

                <button
                  onClick={() => handleAskTutorForTopic(topic.title)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-600/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-500/30 text-[11px] font-medium transition"
                >
                  <Bot size={13} /> Ask Tutor
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Topic Detail Modal */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="relative max-w-2xl w-full max-h-[85vh] overflow-y-auto glass-panel border border-cyan-500/40 rounded-2xl p-6 space-y-5 shadow-2xl">
            <button
              onClick={() => setSelectedTopic(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X size={20} />
            </button>

            <div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                {selectedTopic.category} • {selectedTopic.examWeight}
              </span>
              <h3 className="text-xl font-black text-white mt-2">
                {selectedTopic.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {selectedTopic.summary}
              </p>
            </div>

            {/* Key Concepts */}
            <div>
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                Core Exam Concepts:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedTopic.keyConcepts?.map((kc, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-200 text-xs">
                    • {kc}
                  </span>
                ))}
              </div>
            </div>

            {/* C Snippet */}
            {selectedTopic.cSnippet && (
              <div>
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Representative C Code:
                </h4>
                <CodeBlock code={selectedTopic.cSnippet} title={`${selectedTopic.title} Implementation`} />
              </div>
            )}

            {/* Viva Question */}
            {selectedTopic.vivaQ && (
              <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-1.5 text-xs">
                <span className="font-mono font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle size={14} /> High-Probability Viva Question
                </span>
                <p className="font-semibold text-white">Q: {selectedTopic.vivaQ}</p>
                <p className="text-slate-300">A: {selectedTopic.vivaAns}</p>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  toggleTopicCompletion(selectedTopic.id);
                  setSelectedTopic(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-white/10 transition"
              >
                {completedTopics[selectedTopic.id] ? 'Mark Incomplete' : '✓ Mark Mastered (+50 XP)'}
              </button>

              <button
                onClick={() => {
                  setSelectedTopic(null);
                  handleAskTutorForTopic(selectedTopic.title);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-md"
              >
                <Bot size={14} /> Full 13-Part Analysis &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
