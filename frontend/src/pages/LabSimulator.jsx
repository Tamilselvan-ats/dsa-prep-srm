import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { evaluateLabCode } from '../services/api';
import { useProgress } from '../context/ProgressContext';
import {
  Clock,
  Play,
  RotateCcw,
  Send,
  Award,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Code2,
  HardDrive
} from 'lucide-react';

const RANDOM_QUESTIONS = [
  "Implement Queue using Linked List with enqueue, dequeue, and display operations.",
  "Implement Stack using Singly Linked List with push, pop, and memory deallocation.",
  "Write a C program to implement Binary Search Tree insertion and Inorder traversal.",
  "Implement Doubly Linked List with insert at head and delete from tail.",
  "Write a C program to convert an Infix expression into Postfix notation using a Stack.",
  "Implement Dijkstra's Single-Source Shortest Path algorithm in C using an adjacency matrix.",
  "Implement Circular Queue using static array with modulo arithmetic conditions."
];

const STARTER_CODE = `#include <stdio.h>
#include <stdlib.h>

// Define your data structure here
struct Node {
    int data;
    struct Node* next;
};

// Implement required operations

int main() {
    printf("--- LAB EXAM SUBMISSION ---\\n");
    // Write test cases and driver code
    return 0;
}
`;

export default function LabSimulator() {
  const location = useLocation();
  const [question, setQuestion] = useState(
    location.state?.presetQuestion || RANDOM_QUESTIONS[0]
  );
  const [code, setCode] = useState(
    location.state?.starterCode || STARTER_CODE
  );
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState(null);

  const { recordLabSubmission } = useProgress();

  // Timer countdown
  useEffect(() => {
    if (!isTimerRunning || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const handleRandomQuestion = () => {
    const randomIdx = Math.floor(Math.random() * RANDOM_QUESTIONS.length);
    setQuestion(RANDOM_QUESTIONS[randomIdx]);
    setTimeLeft(45 * 60);
    setIsTimerRunning(true);
    setEvaluation(null);
  };

  const handleSubmit = async () => {
    if (!code.trim()) return;
    setSubmitting(true);
    setIsTimerRunning(false);

    try {
      const minutesSpent = Math.max(1, Math.round((45 * 60 - timeLeft) / 60));
      const res = await evaluateLabCode({
        question,
        studentCode: code,
        timeTakenMinutes: minutesSpent
      });

      if (res.evaluation) {
        setEvaluation(res.evaluation);
        recordLabSubmission({
          id: 'lab-eval-' + Date.now(),
          title: question,
          score: res.evaluation.totalMarks,
          max: 10,
          date: 'Today'
        });
      }
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header & Exam Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
              Practical Exam Simulator
            </span>
            <span className="text-xs text-slate-400 font-mono">Max Marks: 10</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Lab Practical Examination
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl font-medium">
            Task: <span className="text-cyan-300 font-mono font-semibold">{question}</span>
          </p>
        </div>

        {/* Timer & Controls */}
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl border flex items-center gap-2.5 font-mono ${
            timeLeft < 300
              ? 'bg-rose-950/40 border-rose-500/50 text-rose-300 animate-pulse'
              : 'bg-slate-900/80 border-white/10 text-cyan-300'
          }`}>
            <Clock size={18} className={timeLeft < 300 ? 'text-rose-400' : 'text-cyan-400'} />
            <div className="text-left">
              <span className="text-[10px] text-slate-400 block uppercase leading-none">Time Remaining</span>
              <span className="text-lg font-black tracking-wider">{formatTime(timeLeft)}</span>
            </div>
          </div>

          <button
            onClick={handleRandomQuestion}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-white/10 transition text-xs font-semibold"
            title="Generate New Question"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Editor & Submission Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Code Editor (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl border border-white/10 overflow-hidden space-y-0">
          <div className="px-4 py-3 bg-slate-900 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Code2 size={16} className="text-cyan-400" />
              <span>solution.c</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">gcc -std=c11</span>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck="false"
            rows={18}
            className="w-full bg-slate-950 p-4 text-xs font-mono text-slate-200 focus:outline-none resize-none leading-relaxed"
            placeholder="Type your C solution here..."
          />

          <div className="p-3 bg-slate-900/90 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">
              Lines: {code.split('\n').length} | Chars: {code.length}
            </span>

            <button
              onClick={handleSubmit}
              disabled={submitting || !code.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-bold text-xs shadow-lg hover:opacity-95 transition disabled:opacity-40"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Grading Submission...</span>
                </>
              ) : (
                <>
                  <Send size={14} />
                  <span>Submit for Evaluation (10M)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Evaluation Rubric & Feedback (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {evaluation ? (
            <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-5 animate-in fade-in duration-300">
              {/* Total Score Banner */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    Evaluation Result
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-4xl font-black text-cyan-400">{evaluation.totalMarks}</span>
                    <span className="text-sm text-slate-400">/ 10 Marks</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    evaluation.totalMarks >= 8 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    evaluation.totalMarks >= 5 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                    'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {evaluation.verdict}
                  </span>
                </div>
              </div>

              {/* Rubric Breakdown */}
              <div className="space-y-2 text-xs">
                <span className="font-mono font-bold text-slate-400 uppercase text-[10px]">
                  Rubric Breakdown:
                </span>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div className="p-2 rounded bg-white/5 border border-white/5 flex justify-between">
                    <span>Logic:</span>
                    <span className="font-mono text-cyan-300 font-bold">{evaluation.breakdown?.logic} / 3</span>
                  </div>
                  <div className="p-2 rounded bg-white/5 border border-white/5 flex justify-between">
                    <span>Validation:</span>
                    <span className="font-mono text-cyan-300 font-bold">{evaluation.breakdown?.validation} / 2</span>
                  </div>
                  <div className="p-2 rounded bg-white/5 border border-white/5 flex justify-between">
                    <span>Output:</span>
                    <span className="font-mono text-cyan-300 font-bold">{evaluation.breakdown?.output} / 2</span>
                  </div>
                  <div className="p-2 rounded bg-white/5 border border-white/5 flex justify-between">
                    <span>Readability:</span>
                    <span className="font-mono text-cyan-300 font-bold">{evaluation.breakdown?.readability} / 1</span>
                  </div>
                </div>
              </div>

              {/* Computed Complexity */}
              <div className="p-3 bg-slate-900 rounded-xl border border-white/10 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase">Time Complexity:</span>
                  <span className="text-emerald-300 font-bold">{evaluation.timeComplexity}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase">Space Complexity:</span>
                  <span className="text-purple-300 font-bold">{evaluation.spaceComplexity}</span>
                </div>
              </div>

              {/* Bugs Detected */}
              <div>
                <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <AlertTriangle size={13} /> Bugs &amp; Pitfalls Found:
                </span>
                <div className="space-y-1.5 text-xs">
                  {evaluation.bugsDetected?.map((bug, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-200">
                      • {bug}
                    </div>
                  ))}
                </div>
              </div>

              {/* Code-Specific Generated Viva Questions */}
              <div>
                <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <HelpCircle size={13} /> Follow-Up Viva On Your Code:
                </span>
                <div className="space-y-2 text-xs">
                  {evaluation.vivaQuestions?.map((vq, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-purple-950/30 border border-purple-500/20 space-y-1">
                      <p className="font-bold text-white">Q: {vq.question}</p>
                      <p className="text-slate-300 text-[11px]">A: {vq.sampleAnswer}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Remarks */}
              <div className="text-xs text-slate-300 leading-relaxed italic border-t border-white/10 pt-3">
                &ldquo;{evaluation.examinerRemarks}&rdquo;
              </div>
            </div>
          ) : (
            /* Idle Rubric Instructions */
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 text-xs text-slate-300">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Award size={16} className="text-indigo-400" /> Evaluation Standards
              </h3>
              <p className="leading-relaxed">
                When you submit, DSA MASTER AI audits your C code against standard engineering university practical criteria:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                  <span><strong>Logic (3 Marks):</strong> Correct pointer links, operations, and invariants.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                  <span><strong>Validation (2 Marks):</strong> Null checks, empty check, heap exhaustion.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                  <span><strong>Output (2 Marks):</strong> Proper formatting and driver test cases.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                  <span><strong>Readability (1 Mark):</strong> Identifiers and memory deallocation (free).</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                  <span><strong>Viva (2 Marks):</strong> Generated question readiness.</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
