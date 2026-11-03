import React, { useState } from 'react';
import { sendVivaAnswer } from '../services/api';
import { useProgress } from '../context/ProgressContext';
import {
  Mic2,
  Send,
  Award,
  AlertCircle,
  HelpCircle,
  Sparkles,
  RotateCcw,
  User,
  ShieldAlert,
  Flame,
  CheckCircle2
} from 'lucide-react';

const VIVA_TOPICS = [
  "Structures",
  "Linked List",
  "Doubly Linked List",
  "Stack",
  "Queue",
  "Tree",
  "BST",
  "BFS",
  "DFS",
  "Dijkstra",
  "MST",
  "Hashing"
];

export default function VivaTrainer() {
  const [topic, setTopic] = useState('Linked List');
  const [history, setHistory] = useState([]);
  const [studentInput, setStudentInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentScore, setCurrentScore] = useState(40);
  const [difficulty, setDifficulty] = useState('Medium');
  const [currentQuestion, setCurrentQuestion] = useState(
    "Good morning. Sit down. We are examining you on Linked Lists. Tell me: what is the fundamental advantage of a Singly Linked List over a dynamic array in C, and why does node deletion require tracking the predecessor?"
  );
  const [examinerRemark, setExaminerRemark] = useState(
    "Prof. Ramanathan is listening intently. Be precise, cite C pointers and memory addresses."
  );
  const [hint, setHint] = useState('');
  const [isExamFinished, setIsExamFinished] = useState(false);

  const { updateVivaPerformance } = useProgress();

  const handleStartTopic = (newTopic) => {
    setTopic(newTopic);
    setHistory([]);
    setCurrentScore(40);
    setDifficulty('Easy');
    setIsExamFinished(false);
    setHint('');

    const initialQMap = {
      'Structures': "Explain the difference between structure padding and structure packing in C. How does #pragma pack(1) affect memory bus cycles?",
      'Linked List': "What is the fundamental difference between array cache locality and linked list heap allocation?",
      'Doubly Linked List': "Why is node deletion in Doubly Linked List O(1) when given a pointer to that node, unlike in Singly Linked List?",
      'Stack': "What is the difference between stack overflow in an array vs dynamic memory stack?",
      'Queue': "What is false overflow in a linear queue and how does circular queue solve it mathematically?",
      'Tree': "Why can a binary tree NOT be uniquely reconstructed from Preorder and Postorder traversals alone?",
      'BST': "How do you handle deletion of a BST node that has two children?",
      'BFS': "Why must a vertex be marked visited at enqueue time rather than dequeue time in BFS?",
      'DFS': "How does DFS detect a cycle in a directed graph using recursion?",
      'Dijkstra': "Why does Dijkstra's algorithm fail when edge weights are negative?",
      'MST': "State the Cut Property in Minimum Spanning Trees.",
      'Hashing': "What is primary clustering in open addressing linear probing?"
    };

    setCurrentQuestion(initialQMap[newTopic] || `Explain the core invariant of ${newTopic} in C.`);
    setExaminerRemark(`Examiner switched to ${newTopic}. Answer clearly without hesitation.`);
  };

  const handleSendAnswer = async () => {
    if (!studentInput.trim() || loading || isExamFinished) return;

    const answer = studentInput.trim();
    setStudentInput('');
    setLoading(true);

    const newHistory = [
      ...history,
      { role: 'examiner', text: currentQuestion },
      { role: 'student', text: answer }
    ];
    setHistory(newHistory);

    try {
      const res = await sendVivaAnswer({
        topic,
        history: newHistory,
        studentAnswer: answer,
        currentScore,
        difficulty
      });

      if (res.newTotalScore !== undefined) {
        setCurrentScore(res.newTotalScore);
        updateVivaPerformance(res.newTotalScore);
      }
      if (res.nextDifficulty) setDifficulty(res.nextDifficulty);
      if (res.examinerFeedback) setExaminerRemark(res.examinerFeedback);
      if (res.nextQuestion) setCurrentQuestion(res.nextQuestion);
      if (res.hint) setHint(res.hint);
      if (res.isExamComplete || newHistory.length >= 10) {
        setIsExamFinished(true);
      }
    } catch (err) {
      console.error('Viva turn error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/40">
              <Mic2 size={20} />
            </span>
            Lab Viva Voce Trainer
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Simulated University External Examiner Prof. Ramanathan with adaptive difficulty
          </p>
        </div>

        {/* Live Score & Difficulty Meter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold">
            <Award size={15} />
            <span>Viva Score: {currentScore}/100</span>
          </div>

          <div className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold uppercase tracking-wider border ${
            difficulty === 'Hard' ? 'bg-rose-950/60 border-rose-500/40 text-rose-300' :
            difficulty === 'Medium' ? 'bg-amber-950/60 border-amber-500/40 text-amber-300' :
            'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
          }`}>
            {difficulty} Level
          </div>
        </div>
      </div>

      {/* Viva Topic Selector */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
          Select Viva Topic:
        </span>
        <div className="flex flex-wrap gap-2">
          {VIVA_TOPICS.map((t) => (
            <button
              key={t}
              onClick={() => handleStartTopic(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                topic === t
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-white/10'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Examiner Card & Conversational Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Examiner Profile Sidebar (4 cols) */}
        <div className="md:col-span-4 glass-panel p-5 rounded-2xl border border-white/10 space-y-4 text-center">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-purple-900 to-slate-800 border-2 border-purple-500/40 flex items-center justify-center text-3xl shadow-xl">
            👨‍🏫
          </div>

          <div>
            <h3 className="text-base font-bold text-white">
              Prof. K. Ramanathan
            </h3>
            <p className="text-[11px] text-purple-400 font-mono">
              External Lab Examiner (30+ Yrs Exp)
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-white/5 text-xs text-slate-300 text-left space-y-1.5 leading-relaxed">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
              Examiner Persona:
            </span>
            <p className="text-[11px] italic text-slate-300">
              &ldquo;I deduct marks for hand-waving answers. If you do not mention free(), time complexity, or memory boundaries, I will notice.&rdquo;
            </p>
          </div>

          <button
            onClick={() => handleStartTopic(topic)}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-white/10 transition"
          >
            <RotateCcw size={13} /> Reset Examination
          </button>
        </div>

        {/* Chat / Viva Exchange Area (8 cols) */}
        <div className="md:col-span-8 space-y-4">
          {/* Recent History */}
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {history.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                  item.role === 'examiner'
                    ? 'bg-purple-950/20 border-purple-500/30 text-purple-100 ml-0 mr-8'
                    : 'bg-cyan-950/20 border-cyan-500/30 text-cyan-100 mr-0 ml-8'
                }`}
              >
                <span className="font-mono font-bold uppercase tracking-wider block mb-1 text-[10px] text-slate-400">
                  {item.role === 'examiner' ? 'Prof. Ramanathan:' : 'You (Student):'}
                </span>
                <p>{item.text}</p>
              </div>
            ))}

            {/* Current Active Question from Examiner */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 to-slate-900 border-2 border-purple-500/50 shadow-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                  <ShieldAlert size={13} /> Current Question from Examiner:
                </span>
                <span className="text-[10px] font-mono text-slate-400">Q#{Math.floor(history.length / 2) + 1}</span>
              </div>
              <p className="text-sm font-semibold text-white leading-relaxed">
                {currentQuestion}
              </p>
            </div>

            {/* Examiner Feedback on Last Answer */}
            {examinerRemark && (
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs text-slate-300 flex items-start gap-2.5">
                <span className="text-amber-400 text-base">⚠️</span>
                <div className="space-y-0.5">
                  <span className="font-mono font-bold text-[10px] uppercase text-slate-400 block">
                    Examiner Reaction:
                  </span>
                  <p className="text-slate-200">{examinerRemark}</p>
                </div>
              </div>
            )}

            {/* Expandable Hint if stuck */}
            {hint && (
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-200 flex items-center gap-2">
                <Sparkles size={14} className="text-emerald-400 flex-shrink-0" />
                <span><strong>Hint:</strong> {hint}</span>
              </div>
            )}
          </div>

          {/* Student Answer Input Bar */}
          {!isExamFinished ? (
            <div className="glass-panel p-2 rounded-2xl border border-white/10 flex items-center gap-2 shadow-xl">
              <input
                type="text"
                placeholder="Type your viva answer (e.g. 'In C, memory is allocated on the heap using malloc...')..."
                value={studentInput}
                onChange={(e) => setStudentInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendAnswer()}
                disabled={loading}
                className="flex-1 bg-transparent px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                onClick={handleSendAnswer}
                disabled={loading || !studentInput.trim()}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition disabled:opacity-40"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={14} /> Answer
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Exam Complete Card */
            <div className="glass-panel p-6 rounded-2xl border border-emerald-500/50 text-center space-y-3">
              <CheckCircle2 size={36} className="text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Viva Examination Complete!</h3>
              <p className="text-xs text-slate-300">
                Final Score: <strong className="text-emerald-400 font-mono text-sm">{currentScore}/100</strong>
              </p>
              <button
                onClick={() => handleStartTopic(topic)}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                Restart New Viva Session
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
