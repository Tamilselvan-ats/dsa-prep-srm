import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ArrowUp, RefreshCw, Layers, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function StackQueueVisualizer() {
  const [mode, setMode] = useState('stack'); // 'stack' or 'queue'
  const STACK_MAX = 6;
  const QUEUE_MAX = 6;

  // Stack State
  const [stack, setStack] = useState([10, 20, 30]);
  const [stackInput, setStackInput] = useState('');
  const [stackMessage, setStackMessage] = useState('Stack initialized with 3 elements (LIFO).');

  // Queue State
  const [queue, setQueue] = useState([15, 25, 35]);
  const [queueInput, setQueueInput] = useState('');
  const [queueMessage, setQueueMessage] = useState('Queue initialized with 3 elements (FIFO).');

  // Stack operations
  const handlePush = () => {
    if (stack.length >= STACK_MAX) {
      setStackMessage('⚠️ Stack Overflow! top == MAX-1. Cannot push to full stack.');
      return;
    }
    const val = parseInt(stackInput, 10) || Math.floor(Math.random() * 80 + 10);
    setStack([...stack, val]);
    setStackMessage(`pushed ${val} onto stack. Top index is now ${stack.length}.`);
    setStackInput('');
  };

  const handlePop = () => {
    if (stack.length === 0) {
      setStackMessage('⚠️ Stack Underflow! top == -1. Stack is empty.');
      return;
    }
    const popped = stack[stack.length - 1];
    setStack(stack.slice(0, -1));
    setStackMessage(`popped ${popped} from stack top. Top index is now ${stack.length - 2}.`);
  };

  // Queue operations
  const handleEnqueue = () => {
    if (queue.length >= QUEUE_MAX) {
      setQueueMessage('⚠️ Queue Overflow! Rear reached capacity.');
      return;
    }
    const val = parseInt(queueInput, 10) || Math.floor(Math.random() * 80 + 10);
    setQueue([...queue, val]);
    setQueueMessage(`enqueued ${val} at rear. Elements shift FIFO.`);
    setQueueInput('');
  };

  const handleDequeue = () => {
    if (queue.length === 0) {
      setQueueMessage('⚠️ Queue Underflow! Queue is empty.');
      return;
    }
    const removed = queue[0];
    setQueue(queue.slice(1));
    setQueueMessage(`dequeued ${removed} from front. Front advanced.`);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
      {/* Header & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-indigo-400 font-mono">02.</span> Stack &amp; Queue Visualizer
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            LIFO vs FIFO memory execution, overflow, underflow and pointers
          </p>
        </div>

        <div className="flex bg-slate-900/80 p-1 rounded-xl border border-white/10 text-xs font-semibold">
          <button
            onClick={() => setMode('stack')}
            className={`px-4 py-1.5 rounded-lg transition ${mode === 'stack' ? 'bg-indigo-500 text-white shadow-md font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Stack (LIFO)
          </button>
          <button
            onClick={() => setMode('queue')}
            className={`px-4 py-1.5 rounded-lg transition ${mode === 'queue' ? 'bg-indigo-500 text-white shadow-md font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Queue (FIFO)
          </button>
        </div>
      </div>

      {mode === 'stack' ? (
        /* STACK VISUALIZER */
        <div className="space-y-5">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="number"
              placeholder="Value"
              value={stackInput}
              onChange={(e) => setStackInput(e.target.value)}
              className="glass-input px-3 py-2 rounded-lg text-sm w-28"
            />
            <button
              onClick={handlePush}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition"
            >
              <ArrowDown size={14} /> Push (x)
            </button>
            <button
              onClick={handlePop}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-600/30 hover:bg-rose-500/40 text-rose-200 border border-rose-500/30 rounded-lg text-xs font-medium transition"
            >
              <ArrowUp size={14} /> Pop ()
            </button>
            <button
              onClick={() => {
                setStack([10, 20, 30]);
                setStackMessage('Stack reset to 3 items.');
              }}
              className="flex items-center gap-1 px-3 py-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg text-xs ml-auto border border-white/10 transition"
            >
              <RefreshCw size={13} /> Reset
            </button>
          </div>

          {/* Interactive Stack Tower */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Visual Bucket */}
            <div className="md:col-span-2 bg-slate-950/80 rounded-xl p-6 border border-white/5 flex flex-col items-center justify-end min-h-[300px]">
              <div className="w-64 border-b-4 border-l-4 border-r-4 border-indigo-500/60 rounded-b-2xl p-3 flex flex-col-reverse gap-2 bg-indigo-950/20">
                <AnimatePresence>
                  {stack.map((item, index) => {
                    const isTop = index === stack.length - 1;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: -40, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -30, scale: 0.8 }}
                        transition={{ duration: 0.25 }}
                        className={`p-3 rounded-lg flex items-center justify-between border font-mono font-bold transition-all ${
                          isTop
                            ? 'bg-indigo-600/40 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                            : 'bg-slate-900 border-white/10 text-slate-300'
                        }`}
                      >
                        <span className="text-xs text-slate-400">[{index}]</span>
                        <span className="text-base">{item}</span>
                        {isTop ? (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500 text-slate-950 uppercase font-extrabold tracking-wider">
                            TOP
                          </span>
                        ) : (
                          <span className="w-8"></span>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                {stack.length === 0 && (
                  <div className="py-12 text-center text-slate-500 text-xs font-mono">
                    Stack is empty (top = -1)
                  </div>
                )}
              </div>
            </div>

            {/* Invariant Stats */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-white/10 space-y-3 text-xs">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Layers size={16} className="text-indigo-400" /> Stack State
              </h4>
              <div className="space-y-2 font-mono">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">top index:</span>
                  <span className="text-indigo-300 font-bold">{stack.length - 1}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">capacity (MAX):</span>
                  <span className="text-slate-300">{STACK_MAX}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">isEmpty:</span>
                  <span className={stack.length === 0 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                    {stack.length === 0 ? 'TRUE' : 'FALSE'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">isFull:</span>
                  <span className={stack.length >= STACK_MAX ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                    {stack.length >= STACK_MAX ? 'TRUE' : 'FALSE'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="bg-slate-900/80 p-3 rounded-xl border border-white/10 text-xs font-mono flex items-center gap-2 text-indigo-300">
            <span>&gt;</span> <span>{stackMessage}</span>
          </div>
        </div>
      ) : (
        /* QUEUE VISUALIZER */
        <div className="space-y-5">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="number"
              placeholder="Value"
              value={queueInput}
              onChange={(e) => setQueueInput(e.target.value)}
              className="glass-input px-3 py-2 rounded-lg text-sm w-28"
            />
            <button
              onClick={handleEnqueue}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition"
            >
              Enqueue (Rear)
            </button>
            <button
              onClick={handleDequeue}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-600/30 hover:bg-rose-500/40 text-rose-200 border border-rose-500/30 rounded-lg text-xs font-medium transition"
            >
              Dequeue (Front)
            </button>
            <button
              onClick={() => {
                setQueue([15, 25, 35]);
                setQueueMessage('Queue reset.');
              }}
              className="flex items-center gap-1 px-3 py-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg text-xs ml-auto border border-white/10 transition"
            >
              <RefreshCw size={13} /> Reset
            </button>
          </div>

          {/* Queue Pipe */}
          <div className="bg-slate-950/80 rounded-xl p-8 border border-white/5 flex flex-col items-center justify-center min-h-[220px]">
            <div className="flex items-center gap-3 overflow-x-auto p-3 border-y-2 border-indigo-500/40 bg-indigo-950/10 rounded-xl w-full max-w-xl justify-center">
              {queue.length > 0 && (
                <div className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded border border-emerald-500/40 flex flex-col items-center">
                  <span>FRONT</span>
                  <span>(exit)</span>
                </div>
              )}

              <AnimatePresence>
                {queue.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.25 }}
                    className="w-16 h-16 rounded-xl bg-slate-900 border border-indigo-500/40 flex flex-col items-center justify-center font-mono font-bold shadow-md relative"
                  >
                    <span className="text-[10px] text-slate-400">[{idx}]</span>
                    <span className="text-white text-base">{item}</span>
                  </motion.div>
                ))}
              </AnimatePresence>

              {queue.length === 0 && (
                <div className="py-6 text-slate-500 text-xs font-mono">
                  Queue is empty (front = -1, rear = -1)
                </div>
              )}

              {queue.length > 0 && (
                <div className="text-[10px] font-mono text-indigo-400 bg-indigo-950/80 px-2 py-1 rounded border border-indigo-500/40 flex flex-col items-center">
                  <span>REAR</span>
                  <span>(entry)</span>
                </div>
              )}
            </div>
          </div>

          {/* Status Bar */}
          <div className="bg-slate-900/80 p-3 rounded-xl border border-white/10 text-xs font-mono flex items-center gap-2 text-indigo-300">
            <span>&gt;</span> <span>{queueMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
