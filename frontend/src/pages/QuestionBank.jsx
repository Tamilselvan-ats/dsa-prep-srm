import React, { useState, useEffect } from 'react';
import { fetchQuestions } from '../services/api';
import { useProgress } from '../context/ProgressContext';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Filter,
  Award,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';

export default function QuestionBank() {
  const [selectedUnit, setSelectedUnit] = useState('all');
  const [selectedType, setSelectedType] = useState('mcq'); // 'mcq', 'twoMarks', 'fiveMarks', 'tenMarks'
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // MCQ User Answers State: { [questionId]: selectedOptionIndex }
  const [userAnswers, setUserAnswers] = useState({});
  const [revealedSolutions, setRevealedSolutions] = useState({});

  const { addXP } = useProgress();

  useEffect(() => {
    setLoading(true);
    fetchQuestions({
      unit: selectedUnit !== 'all' ? selectedUnit : '',
      type: selectedType,
      difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : ''
    })
      .then(res => {
        if (res.questions) {
          setQuestions(Array.isArray(res.questions) ? res.questions : res.questions[selectedType] || []);
        }
      })
      .catch(err => console.error('Question bank fetch error:', err))
      .finally(() => setLoading(false));
  }, [selectedUnit, selectedType, selectedDifficulty]);

  const handleSelectMCQOption = (qId, optionIdx, correctIdx) => {
    if (userAnswers[qId] !== undefined) return; // already answered

    setUserAnswers(prev => ({ ...prev, [qId]: optionIdx }));
    if (optionIdx === correctIdx) {
      addXP(25, 'Correct MCQ Answer');
    }
  };

  const toggleSolution = (qId) => {
    setRevealedSolutions(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/40">
              <HelpCircle size={20} />
            </span>
            Smart Question Bank
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            MCQs, 2 Mark, 5 Mark, and 10 Mark examination questions sorted by Units and Difficulty
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950 px-3 py-1 rounded-xl border border-cyan-500/30">
            Interactive Exam Drill
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Type Selector */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-white/5">
          {[
            { id: 'mcq', label: 'MCQs' },
            { id: 'twoMarks', label: '2 Marks' },
            { id: 'fiveMarks', label: '5 Marks' },
            { id: 'tenMarks', label: '10 Marks' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id)}
              className={`px-3 py-1.5 rounded-lg transition font-semibold ${
                selectedType === t.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Unit & Difficulty Dropdowns */}
        <div className="flex items-center gap-3">
          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="glass-input px-3 py-1.5 rounded-xl text-xs bg-slate-900 text-slate-200 border-white/10"
          >
            <option value="all">All Units (1 - 5)</option>
            <option value="1">Unit 1 (Structures &amp; Pointers)</option>
            <option value="2">Unit 2 (Lists &amp; Cursor)</option>
            <option value="3">Unit 3 (Stack &amp; Queue)</option>
            <option value="4">Unit 4 (Trees &amp; Hashing)</option>
            <option value="5">Unit 5 (Graphs &amp; MST)</option>
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="glass-input px-3 py-1.5 rounded-xl text-xs bg-slate-900 text-slate-200 border-white/10"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="glass-panel p-8 rounded-2xl border border-white/10 text-center text-xs text-slate-400">
          Loading questions...
        </div>
      )}

      {/* Questions Render Area */}
      {!loading && (
        <div className="space-y-4">
          {selectedType === 'mcq' ? (
            /* MCQ Quiz Cards */
            <div className="space-y-4">
              {questions.map((q, idx) => {
                const answered = userAnswers[q.id] !== undefined;
                const isCorrect = userAnswers[q.id] === q.answer;

                return (
                  <div
                    key={q.id || idx}
                    className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <h3 className="text-sm font-bold text-white leading-relaxed">
                          {q.question}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                          Unit {q.unit}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          q.difficulty === 'Hard' ? 'bg-rose-950 text-rose-300 border border-rose-500/30' :
                          q.difficulty === 'Medium' ? 'bg-amber-950 text-amber-300 border border-amber-500/30' :
                          'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {q.difficulty}
                        </span>
                      </div>
                    </div>

                    {/* 4 MCQ Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                      {q.options?.map((opt, optIdx) => {
                        let btnStyle = 'bg-slate-900 border-white/10 hover:border-cyan-500/40 text-slate-200';
                        if (answered) {
                          if (optIdx === q.answer) {
                            btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                          } else if (optIdx === userAnswers[q.id]) {
                            btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                          } else {
                            btnStyle = 'bg-slate-950/50 border-white/5 text-slate-500 opacity-50';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectMCQOption(q.id, optIdx, q.answer)}
                            disabled={answered}
                            className={`p-3 rounded-xl border text-left flex items-center justify-between transition ${btnStyle}`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-mono text-[10px]">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span>{opt}</span>
                            </span>

                            {answered && optIdx === q.answer && (
                              <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                            )}
                            {answered && optIdx === userAnswers[q.id] && optIdx !== q.answer && (
                              <XCircle size={16} className="text-rose-400 flex-shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation after answer */}
                    {answered && (
                      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs text-slate-300 flex items-start gap-2.5 animate-in fade-in">
                        <Sparkles size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-white font-mono uppercase text-[10px] block">
                            Explanation:
                          </span>
                          <p className="mt-0.5">{q.explanation}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Descriptive Question Cards (2M, 5M, 10M) */
            <div className="space-y-4">
              {questions.map((q, idx) => {
                const isRevealed = revealedSolutions[q.id];
                return (
                  <div
                    key={q.id || idx}
                    className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <h3 className="text-sm font-bold text-white leading-relaxed">
                          {q.question}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                          Unit {q.unit}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold uppercase">
                          {selectedType === 'twoMarks' ? '2 Marks' : selectedType === 'fiveMarks' ? '5 Marks' : '10 Marks'}
                        </span>
                      </div>
                    </div>

                    {/* Toggle Solution */}
                    <button
                      onClick={() => toggleSolution(q.id)}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 pt-1"
                    >
                      {isRevealed ? (
                        <>
                          <ChevronUp size={15} /> Hide Model Solution
                        </>
                      ) : (
                        <>
                          <ChevronDown size={15} /> View Model Exam Answer &rarr;
                        </>
                      )}
                    </button>

                    {isRevealed && (
                      <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-slate-300 leading-relaxed whitespace-pre-line font-mono animate-in fade-in">
                        {q.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
