import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Plus, Search, Eye } from 'lucide-react';

// BST Node structure
class Node {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

export default function BSTVisualizer() {
  const [treeVals, setTreeVals] = useState([50, 30, 70, 20, 40, 60, 80]);
  const [inputValue, setInputValue] = useState('');
  const [highlightedNode, setHighlightedNode] = useState(null);
  const [traversalOutput, setTraversalOutput] = useState([]);
  const [activeStepText, setActiveStepText] = useState('BST ready. Choose an operation or trigger a traversal.');
  const [isPlaying, setIsPlaying] = useState(false);
  const [stepsQueue, setStepsQueue] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [speed, setSpeed] = useState(700);

  const timerRef = useRef(null);

  // Rebuild BST from treeVals array
  const buildTree = () => {
    let root = null;
    const insertNode = (node, val) => {
      if (!node) return new Node(val);
      if (val < node.val) node.left = insertNode(node.left, val);
      else if (val > node.val) node.right = insertNode(node.right, val);
      return node;
    };

    for (const v of treeVals) {
      root = insertNode(root, v);
    }
    return root;
  };

  const handleInsert = () => {
    const val = parseInt(inputValue, 10);
    if (isNaN(val)) return;
    if (treeVals.includes(val)) {
      setActiveStepText(`Value ${val} already exists in BST (no duplicate keys allowed).`);
      return;
    }
    if (treeVals.length >= 15) {
      setActiveStepText('Maximum node limit reached for clear visualization.');
      return;
    }

    setTreeVals([...treeVals, val]);
    setActiveStepText(`Inserted ${val} into BST following BST property (left < root < right).`);
    setInputValue('');
  };

  const startSearch = () => {
    const target = parseInt(inputValue, 10) || 40;
    const steps = [];
    const root = buildTree();

    let curr = root;
    while (curr) {
      steps.push({
        val: curr.val,
        text: `Examining node ${curr.val}: ${target === curr.val ? 'Target MATCH!' : target < curr.val ? `${target} < ${curr.val} -> go LEFT` : `${target} > ${curr.val} -> go RIGHT`}`,
        found: curr.val === target
      });
      if (target === curr.val) break;
      curr = target < curr.val ? curr.left : curr.right;
    }

    if (!curr) {
      steps.push({ val: null, text: `Reached NULL. Target ${target} not present in BST.`, found: false });
    }

    setStepsQueue(steps);
    setCurrentStepIdx(0);
    setIsPlaying(true);
  };

  const startTraversal = (type) => {
    const root = buildTree();
    const order = [];
    const steps = [];

    const inorder = (n) => {
      if (!n) return;
      inorder(n.left);
      order.push(n.val);
      steps.push({ val: n.val, text: `Inorder visit: ${n.val} (left subtree finished)` });
      inorder(n.right);
    };

    const preorder = (n) => {
      if (!n) return;
      order.push(n.val);
      steps.push({ val: n.val, text: `Preorder visit root: ${n.val}` });
      preorder(n.left);
      preorder(n.right);
    };

    const postorder = (n) => {
      if (!n) return;
      postorder(n.left);
      postorder(n.right);
      order.push(n.val);
      steps.push({ val: n.val, text: `Postorder visit after subtrees: ${n.val}` });
    };

    if (type === 'inorder') inorder(root);
    else if (type === 'preorder') preorder(root);
    else if (type === 'postorder') postorder(root);

    setTraversalOutput([]);
    setStepsQueue(steps);
    setCurrentStepIdx(0);
    setIsPlaying(true);
  };

  // Traversal playback
  useEffect(() => {
    if (!isPlaying || stepsQueue.length === 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentStepIdx((prev) => {
        if (prev < stepsQueue.length - 1) {
          const next = prev + 1;
          const step = stepsQueue[next];
          setHighlightedNode(step.val);
          setActiveStepText(step.text);
          if (step.val !== null) {
            setTraversalOutput((curr) => [...curr, step.val]);
          }
          return next;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, speed);

    return () => clearInterval(timerRef.current);
  }, [isPlaying, stepsQueue, speed]);

  const stepForward = () => {
    if (currentStepIdx < stepsQueue.length - 1) {
      const next = currentStepIdx + 1;
      setCurrentStepIdx(next);
      setHighlightedNode(stepsQueue[next].val);
      setActiveStepText(stepsQueue[next].text);
      if (stepsQueue[next].val !== null) {
        setTraversalOutput((curr) => [...curr, stepsQueue[next].val]);
      }
    }
  };

  const stepBackward = () => {
    if (currentStepIdx > 0) {
      const prev = currentStepIdx - 1;
      setCurrentStepIdx(prev);
      setHighlightedNode(stepsQueue[prev].val);
      setActiveStepText(stepsQueue[prev].text);
    }
  };

  const resetBST = () => {
    setIsPlaying(false);
    setHighlightedNode(null);
    setTreeVals([50, 30, 70, 20, 40, 60, 80]);
    setTraversalOutput([]);
    setActiveStepText('Reset BST to standard balanced 7-node tree.');
    setStepsQueue([]);
    setCurrentStepIdx(0);
  };

  // Convert tree into visual positioned coordinates
  const getCoordinates = () => {
    const root = buildTree();
    const coords = [];
    const links = [];

    const traverse = (node, x, y, dx) => {
      if (!node) return;
      coords.push({ val: node.val, x, y });

      if (node.left) {
        const lx = x - dx;
        const ly = y + 70;
        links.push({ x1: x, y1: y, x2: lx, y2: ly });
        traverse(node.left, lx, ly, dx * 0.55);
      }
      if (node.right) {
        const rx = x + dx;
        const ry = y + 70;
        links.push({ x1: x, y1: y, x2: rx, y2: ry });
        traverse(node.right, rx, ry, dx * 0.55);
      }
    };

    traverse(root, 300, 45, 130);
    return { coords, links };
  };

  const { coords, links } = getCoordinates();

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-emerald-400 font-mono">03.</span> Binary Search Tree Visualizer
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Dynamic BST insertion, key search pathing, and Inorder/Preorder/Postorder traversals
          </p>
        </div>

        {/* Traversal Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => startTraversal('inorder')}
            className="px-3 py-1.5 bg-emerald-600/30 hover:bg-emerald-500/40 text-emerald-200 border border-emerald-500/40 rounded-lg text-xs font-semibold transition"
          >
            Inorder (Sorted)
          </button>
          <button
            onClick={() => startTraversal('preorder')}
            className="px-3 py-1.5 bg-cyan-600/30 hover:bg-cyan-500/40 text-cyan-200 border border-cyan-500/40 rounded-lg text-xs font-semibold transition"
          >
            Preorder
          </button>
          <button
            onClick={() => startTraversal('postorder')}
            className="px-3 py-1.5 bg-purple-600/30 hover:bg-purple-500/40 text-purple-200 border border-purple-500/40 rounded-lg text-xs font-semibold transition"
          >
            Postorder
          </button>
        </div>
      </div>

      {/* Operation Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="number"
          placeholder="Node Val (e.g. 65)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="glass-input px-3 py-2 rounded-lg text-sm w-36"
        />
        <button
          onClick={handleInsert}
          className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs transition"
        >
          <Plus size={14} /> Insert Node
        </button>
        <button
          onClick={startSearch}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-medium transition"
        >
          <Search size={14} /> Search Key
        </button>
        <button
          onClick={resetBST}
          className="flex items-center gap-1 px-3 py-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg text-xs ml-auto border border-white/10 transition"
        >
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      {/* Interactive SVG Canvas */}
      <div className="bg-slate-950/80 rounded-xl p-4 border border-white/5 flex flex-col items-center justify-center min-h-[300px] overflow-x-auto">
        <svg width="600" height="280" className="overflow-visible">
          {/* Edges */}
          {links.map((link, i) => (
            <line
              key={i}
              x1={link.x1}
              y1={link.y1}
              x2={link.x2}
              y2={link.y2}
              stroke="rgba(16, 185, 129, 0.4)"
              strokeWidth="2.5"
            />
          ))}

          {/* Node Circles */}
          {coords.map((n) => {
            const isHighlight = n.val === highlightedNode;
            return (
              <g key={n.val} className="transition-all duration-300">
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={22}
                  fill={isHighlight ? '#fbbf24' : '#0f172a'}
                  stroke={isHighlight ? '#f59e0b' : '#10b981'}
                  strokeWidth={isHighlight ? '3.5' : '2'}
                  className="transition-all duration-300 cursor-pointer shadow-lg"
                />
                <text
                  x={n.x}
                  y={n.y + 5}
                  textAnchor="middle"
                  fill={isHighlight ? '#090d16' : '#ffffff'}
                  fontSize="13"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {n.val}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Traversal Output Tape */}
        {traversalOutput.length > 0 && (
          <div className="w-full mt-4 pt-3 border-t border-white/10 flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
              Output:
            </span>
            <div className="flex items-center gap-1.5">
              {traversalOutput.map((val, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-mono font-bold"
                >
                  {val}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Trace Log Bar */}
      <div className="bg-slate-900/90 rounded-xl p-3 border border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-mono text-emerald-300 font-medium">Trace Log:</span>
          <span className="text-slate-200">{activeStepText}</span>
        </div>
      </div>

      {/* Animation Playback Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={stepsQueue.length === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              isPlaying
                ? 'bg-amber-500 text-slate-950'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            {isPlaying ? 'Pause' : 'Auto Play'}
          </button>

          <button
            onClick={stepBackward}
            disabled={currentStepIdx <= 0}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <SkipBack size={14} />
          </button>

          <button
            onClick={stepForward}
            disabled={currentStepIdx >= stepsQueue.length - 1}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <SkipForward size={14} />
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
            className="w-24 accent-emerald-400 cursor-pointer"
          />
          <span className="text-[11px] font-mono text-emerald-300">{speed}ms</span>
        </div>
      </div>
    </div>
  );
}
