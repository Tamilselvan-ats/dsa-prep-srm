import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Plus, Trash2, Search, ArrowRight, ArrowLeft } from 'lucide-react';

export default function LinkedListVisualizer() {
  const [listType, setListType] = useState('singly'); // singly, doubly, circular
  const [nodes, setNodes] = useState([
    { id: '1', val: 10 },
    { id: '2', val: 20 },
    { id: '3', val: 30 },
    { id: '4', val: 40 }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [activeStepText, setActiveStepText] = useState('Ready. Select an operation or play animation.');
  const [isPlaying, setIsPlaying] = useState(false);
  const [history, setHistory] = useState([]);
  const [currentHistoryStep, setCurrentHistoryStep] = useState(0);
  const [speed, setSpeed] = useState(800); // ms per step

  const timerRef = useRef(null);

  const insertHead = () => {
    const val = parseInt(inputValue, 10) || Math.floor(Math.random() * 90 + 10);
    const newNode = { id: Date.now().toString(), val };
    const newNodes = [newNode, ...nodes];
    setNodes(newNodes);
    setActiveStepText(`Inserted ${val} at Head. Head pointer updated.`);
    setInputValue('');
  };

  const insertTail = () => {
    const val = parseInt(inputValue, 10) || Math.floor(Math.random() * 90 + 10);
    const newNode = { id: Date.now().toString(), val };
    const newNodes = [...nodes, newNode];
    setNodes(newNodes);
    setActiveStepText(`Traversed to tail (next == NULL) and attached node with value ${val}.`);
    setInputValue('');
  };

  const deleteHead = () => {
    if (nodes.length === 0) {
      setActiveStepText('List is empty! Underflow condition.');
      return;
    }
    const removed = nodes[0].val;
    setNodes(nodes.slice(1));
    setActiveStepText(`Deleted head node (${removed}). Freed heap memory. Head updated.`);
  };

  const deleteTail = () => {
    if (nodes.length === 0) {
      setActiveStepText('List is empty! Underflow condition.');
      return;
    }
    const removed = nodes[nodes.length - 1].val;
    setNodes(nodes.slice(0, -1));
    setActiveStepText(`Deleted tail node (${removed}). Predecessor next set to NULL.`);
  };

  // Traversal search animation
  const startSearch = (targetVal) => {
    if (nodes.length === 0) return;
    const searchTarget = targetVal !== undefined ? targetVal : (parseInt(inputValue, 10) || 30);
    const steps = [];

    for (let i = 0; i < nodes.length; i++) {
      steps.push({
        index: i,
        text: `Step ${i + 1}: Checking node at index ${i} (value: ${nodes[i].val}) against target ${searchTarget}...`,
        found: nodes[i].val === searchTarget
      });
      if (nodes[i].val === searchTarget) break;
    }

    setHistory(steps);
    setCurrentHistoryStep(0);
    setIsPlaying(true);
  };

  // Playback engine
  useEffect(() => {
    if (!isPlaying || history.length === 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentHistoryStep((prev) => {
        if (prev < history.length - 1) {
          const next = prev + 1;
          setHighlightIndex(history[next].index);
          setActiveStepText(history[next].text);
          return next;
        } else {
          setIsPlaying(false);
          const last = history[prev];
          setActiveStepText(last.found ? `Target FOUND at node index ${last.index}!` : 'Reached end (NULL). Target NOT FOUND.');
          return prev;
        }
      });
    }, speed);

    return () => clearInterval(timerRef.current);
  }, [isPlaying, history, speed]);

  const stepForward = () => {
    if (currentHistoryStep < history.length - 1) {
      const next = currentHistoryStep + 1;
      setCurrentHistoryStep(next);
      setHighlightIndex(history[next].index);
      setActiveStepText(history[next].text);
    }
  };

  const stepBackward = () => {
    if (currentHistoryStep > 0) {
      const prev = currentHistoryStep - 1;
      setCurrentHistoryStep(prev);
      setHighlightIndex(history[prev].index);
      setActiveStepText(history[prev].text);
    }
  };

  const resetList = () => {
    setIsPlaying(false);
    setHighlightIndex(-1);
    setNodes([
      { id: '1', val: 10 },
      { id: '2', val: 20 },
      { id: '3', val: 30 },
      { id: '4', val: 40 }
    ]);
    setActiveStepText('Reset to initial 4-node list.');
    setHistory([]);
    setCurrentHistoryStep(0);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
      {/* Type Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-cyan-400 font-mono">01.</span> Linked List Visualizer
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Step-by-step dynamic memory node chaining with pointer animation
          </p>
        </div>

        <div className="flex bg-slate-900/80 p-1 rounded-xl border border-white/10 text-xs font-semibold">
          <button
            onClick={() => setListType('singly')}
            className={`px-3 py-1.5 rounded-lg transition ${listType === 'singly' ? 'bg-cyan-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Singly Linked List
          </button>
          <button
            onClick={() => setListType('doubly')}
            className={`px-3 py-1.5 rounded-lg transition ${listType === 'doubly' ? 'bg-cyan-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Doubly Linked List
          </button>
          <button
            onClick={() => setListType('circular')}
            className={`px-3 py-1.5 rounded-lg transition ${listType === 'circular' ? 'bg-cyan-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Circular Linked List
          </button>
        </div>
      </div>

      {/* Operation Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="number"
          placeholder="Value (e.g. 25)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="glass-input px-3 py-2 rounded-lg text-sm w-32 focus:ring-1 focus:ring-cyan-400"
        />

        <button
          onClick={insertHead}
          className="flex items-center gap-1.5 px-3 py-2 bg-cyan-600/30 hover:bg-cyan-500/40 text-cyan-200 border border-cyan-500/40 rounded-lg text-xs font-medium transition"
        >
          <Plus size={14} /> Insert Head
        </button>

        <button
          onClick={insertTail}
          className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600/30 hover:bg-indigo-500/40 text-indigo-200 border border-indigo-500/40 rounded-lg text-xs font-medium transition"
        >
          <Plus size={14} /> Insert Tail
        </button>

        <button
          onClick={deleteHead}
          className="flex items-center gap-1.5 px-3 py-2 bg-rose-600/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-medium transition"
        >
          <Trash2 size={14} /> Delete Head
        </button>

        <button
          onClick={deleteTail}
          className="flex items-center gap-1.5 px-3 py-2 bg-rose-600/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-medium transition"
        >
          <Trash2 size={14} /> Delete Tail
        </button>

        <button
          onClick={() => startSearch()}
          className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600/30 hover:bg-emerald-500/40 text-emerald-200 border border-emerald-500/40 rounded-lg text-xs font-medium transition ml-auto"
        >
          <Search size={14} /> Animate Search
        </button>
      </div>

      {/* Interactive Visual Canvas */}
      <div className="relative min-h-[180px] bg-slate-950/70 rounded-xl p-6 border border-white/5 flex items-center justify-start overflow-x-auto gap-4">
        {nodes.length === 0 ? (
          <div className="w-full text-center py-10 text-slate-500 font-mono text-sm">
            Head -&gt; NULL (List is empty)
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {/* HEAD Label */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono font-bold tracking-wider text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40 uppercase">
                HEAD
              </span>
              <span className="text-cyan-400 text-lg">↓</span>
            </div>

            {/* Nodes */}
            <AnimatePresence>
              {nodes.map((node, idx) => {
                const isHighlighted = idx === highlightIndex;
                return (
                  <motion.div
                    key={node.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.6, y: 20 }}
                    transition={{ duration: 0.35 }}
                    className="flex items-center gap-2"
                  >
                    {/* Node Card */}
                    <div
                      className={`relative flex rounded-xl border transition-all duration-300 ${
                        isHighlighted
                          ? 'border-yellow-400 bg-yellow-500/20 shadow-[0_0_20px_rgba(250,204,21,0.4)] scale-105'
                          : 'border-cyan-500/40 bg-slate-900/90 hover:border-cyan-400'
                      }`}
                    >
                      {/* Prev pointer partition if Doubly LL */}
                      {listType === 'doubly' && (
                        <div className="w-8 border-r border-white/10 flex items-center justify-center text-[10px] text-slate-400 font-mono bg-black/20">
                          {idx === 0 ? 'Ø' : '•'}
                        </div>
                      )}

                      {/* Data Field */}
                      <div className="px-4 py-3 flex flex-col items-center min-w-[54px]">
                        <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400">data</span>
                        <span className="text-base font-bold text-white font-mono">{node.val}</span>
                      </div>

                      {/* Next Pointer partition */}
                      <div className="w-9 border-l border-white/10 flex flex-col items-center justify-center bg-cyan-950/30 text-[10px] text-cyan-300 font-mono">
                        <span className="text-[8px] text-cyan-500/70 uppercase">next</span>
                        <span>•</span>
                      </div>
                    </div>

                    {/* Pointer Links */}
                    {idx < nodes.length - 1 ? (
                      <div className="flex flex-col items-center text-cyan-400 px-1">
                        <ArrowRight size={18} className="animate-pulse" />
                        {listType === 'doubly' && (
                          <ArrowLeft size={18} className="text-indigo-400 -mt-1" />
                        )}
                      </div>
                    ) : listType === 'circular' ? (
                      <div className="flex items-center text-purple-400 gap-1 text-xs font-mono font-bold bg-purple-950/50 px-2 py-1 rounded border border-purple-500/30">
                        <span>↻ loops to HEAD</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-rose-400/80 gap-1 font-mono text-xs font-semibold px-1">
                        <span>→</span>
                        <span className="px-1.5 py-0.5 rounded bg-rose-950/50 border border-rose-500/30 text-rose-300">
                          NULL
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Step Explanation & Live Terminal Feedback */}
      <div className="bg-slate-900/90 rounded-xl p-3 border border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span className="font-mono text-cyan-300 font-medium">Trace Log:</span>
          <span className="text-slate-200">{activeStepText}</span>
        </div>
        <span className="text-slate-400 font-mono">Nodes: {nodes.length}</span>
      </div>

      {/* Animation Playback & Speed Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={history.length === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              isPlaying
                ? 'bg-amber-500 text-slate-950'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            {isPlaying ? 'Pause' : 'Auto Play'}
          </button>

          <button
            onClick={stepBackward}
            disabled={currentHistoryStep <= 0}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="Step Backward"
          >
            <SkipBack size={14} />
          </button>

          <button
            onClick={stepForward}
            disabled={currentHistoryStep >= history.length - 1}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="Step Forward"
          >
            <SkipForward size={14} />
          </button>

          <button
            onClick={resetList}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg border border-white/10 text-xs transition"
          >
            <RotateCcw size={13} /> Reset
          </button>
        </div>

        {/* Speed Slider */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-mono">Speed:</span>
          <input
            type="range"
            min="300"
            max="1800"
            step="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-24 accent-cyan-400 cursor-pointer"
          />
          <span className="text-[11px] font-mono text-cyan-300">{speed}ms</span>
        </div>
      </div>
    </div>
  );
}
