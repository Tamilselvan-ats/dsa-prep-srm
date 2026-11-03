import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Share2, Compass, GitCommit } from 'lucide-react';

const GRAPH_NODES = [
  { id: 0, label: '0', x: 80, y: 140 },
  { id: 1, label: '1', x: 200, y: 60 },
  { id: 2, label: '2', x: 200, y: 220 },
  { id: 3, label: '3', x: 340, y: 60 },
  { id: 4, label: '4', x: 340, y: 220 },
  { id: 5, label: '5', x: 460, y: 140 }
];

const GRAPH_EDGES = [
  { u: 0, v: 1, w: 4 },
  { u: 0, v: 2, w: 2 },
  { u: 1, v: 2, w: 1 },
  { u: 1, v: 3, w: 5 },
  { u: 2, v: 4, w: 8 },
  { u: 2, v: 3, w: 8 },
  { u: 3, v: 4, w: 2 },
  { u: 3, v: 5, w: 6 },
  { u: 4, v: 5, w: 3 }
];

export default function GraphVisualizer() {
  const [algo, setAlgo] = useState('bfs'); // 'bfs', 'dfs', 'dijkstra', 'prims'
  const [visitedNodes, setVisitedNodes] = useState([]);
  const [activeEdge, setActiveEdge] = useState(null);
  const [mstEdges, setMstEdges] = useState([]);
  const [activeNode, setActiveNode] = useState(null);
  const [distances, setDistances] = useState({ 0: 0, 1: '∞', 2: '∞', 3: '∞', 4: '∞', 5: '∞' });
  const [logText, setLogText] = useState('Select an algorithm and click Auto Play or Step Forward.');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);

  const timerRef = useRef(null);

  // Generate steps based on algorithm
  const generateSteps = (selectedAlgo) => {
    const list = [];
    if (selectedAlgo === 'bfs') {
      list.push({ node: 0, visited: [0], text: 'BFS Start at node 0. Enqueue 0, mark visited.', edge: null });
      list.push({ node: 0, visited: [0], text: 'Inspect neighbors of 0: nodes 1 (w=4) and 2 (w=2).', edge: { u: 0, v: 2 } });
      list.push({ node: 2, visited: [0, 2], text: 'Enqueue 2, mark visited.', edge: { u: 0, v: 2 } });
      list.push({ node: 1, visited: [0, 2, 1], text: 'Enqueue 1, mark visited.', edge: { u: 0, v: 1 } });
      list.push({ node: 2, visited: [0, 2, 1], text: 'Dequeue 2, explore unvisited neighbors: node 4.', edge: { u: 2, v: 4 } });
      list.push({ node: 4, visited: [0, 2, 1, 4], text: 'Enqueue 4, mark visited.', edge: { u: 2, v: 4 } });
      list.push({ node: 1, visited: [0, 2, 1, 4], text: 'Dequeue 1, explore unvisited neighbors: node 3.', edge: { u: 1, v: 3 } });
      list.push({ node: 3, visited: [0, 2, 1, 4, 3], text: 'Enqueue 3, mark visited.', edge: { u: 1, v: 3 } });
      list.push({ node: 4, visited: [0, 2, 1, 4, 3], text: 'Dequeue 4, explore unvisited neighbors: node 5.', edge: { u: 4, v: 5 } });
      list.push({ node: 5, visited: [0, 2, 1, 4, 3, 5], text: 'Enqueue 5, mark visited. All reachable vertices explored!', edge: { u: 4, v: 5 } });
    } else if (selectedAlgo === 'dfs') {
      list.push({ node: 0, visited: [0], text: 'DFS Start at node 0. Push to call stack.', edge: null });
      list.push({ node: 1, visited: [0, 1], text: 'Traverse edge (0->1). Push node 1.', edge: { u: 0, v: 1 } });
      list.push({ node: 2, visited: [0, 1, 2], text: 'From 1, traverse edge (1->2). Push node 2.', edge: { u: 1, v: 2 } });
      list.push({ node: 4, visited: [0, 1, 2, 4], text: 'From 2, traverse edge (2->4). Push node 4.', edge: { u: 2, v: 4 } });
      list.push({ node: 3, visited: [0, 1, 2, 4, 3], text: 'From 4, traverse edge (4->3). Push node 3.', edge: { u: 4, v: 3 } });
      list.push({ node: 5, visited: [0, 1, 2, 4, 3, 5], text: 'From 3, traverse edge (3->5). Push node 5. Deepest branch reached, backtracking complete.', edge: { u: 3, v: 5 } });
    } else if (selectedAlgo === 'dijkstra') {
      list.push({ node: 0, visited: [0], dist: { 0: 0, 1: '∞', 2: '∞', 3: '∞', 4: '∞', 5: '∞' }, text: 'Initialize dist[0]=0, all others=∞.', edge: null });
      list.push({ node: 0, visited: [0], dist: { 0: 0, 1: 4, 2: 2, 3: '∞', 4: '∞', 5: '∞' }, text: 'Relax neighbors of 0: dist[1]=4, dist[2]=2.', edge: { u: 0, v: 2 } });
      list.push({ node: 2, visited: [0, 2], dist: { 0: 0, 1: 3, 2: 2, 3: 10, 4: 10, 5: '∞' }, text: 'Pick min unvisited node 2 (dist=2). Relax 1 via 2: 2+1=3 < 4! dist[1]=3.', edge: { u: 1, v: 2 } });
      list.push({ node: 1, visited: [0, 2, 1], dist: { 0: 0, 1: 3, 2: 2, 3: 8, 4: 10, 5: '∞' }, text: 'Pick min unvisited node 1 (dist=3). Relax 3: 3+5=8 < 10. dist[3]=8.', edge: { u: 1, v: 3 } });
      list.push({ node: 3, visited: [0, 2, 1, 3], dist: { 0: 0, 1: 3, 2: 2, 3: 8, 4: 10, 5: 14 }, text: 'Pick node 3 (dist=8). Relax 4: 8+2=10.', edge: { u: 3, v: 4 } });
      list.push({ node: 4, visited: [0, 2, 1, 3, 4], dist: { 0: 0, 1: 3, 2: 2, 3: 8, 4: 10, 5: 13 }, text: 'Pick node 4 (dist=10). Relax 5: 10+3=13 < 14! dist[5]=13.', edge: { u: 4, v: 5 } });
      list.push({ node: 5, visited: [0, 2, 1, 3, 4, 5], dist: { 0: 0, 1: 3, 2: 2, 3: 8, 4: 10, 5: 13 }, text: 'Target node 5 finalized with shortest distance = 13.', edge: null });
    } else if (selectedAlgo === 'prims') {
      list.push({ node: 0, visited: [0], mst: [], text: "Start Prim's MST at arbitrary node 0.", edge: null });
      list.push({ node: 2, visited: [0, 2], mst: [{ u: 0, v: 2 }], text: "Min crossing edge is (0,2) with weight 2. Add to MST.", edge: { u: 0, v: 2 } });
      list.push({ node: 1, visited: [0, 2, 1], mst: [{ u: 0, v: 2 }, { u: 1, v: 2 }], text: "Min crossing edge is (1,2) with weight 1. Add to MST.", edge: { u: 1, v: 2 } });
      list.push({ node: 3, visited: [0, 2, 1, 3], mst: [{ u: 0, v: 2 }, { u: 1, v: 2 }, { u: 1, v: 3 }], text: "Min crossing edge is (1,3) with weight 5. Add to MST.", edge: { u: 1, v: 3 } });
      list.push({ node: 4, visited: [0, 2, 1, 3, 4], mst: [{ u: 0, v: 2 }, { u: 1, v: 2 }, { u: 1, v: 3 }, { u: 3, v: 4 }], text: "Min crossing edge is (3,4) with weight 2. Add to MST.", edge: { u: 3, v: 4 } });
      list.push({ node: 5, visited: [0, 2, 1, 3, 4, 5], mst: [{ u: 0, v: 2 }, { u: 1, v: 2 }, { u: 1, v: 3 }, { u: 3, v: 4 }, { u: 4, v: 5 }], text: "Min crossing edge is (4,5) with weight 3. Total MST weight = 2 + 1 + 5 + 2 + 3 = 13.", edge: { u: 4, v: 5 } });
    }
    return list;
  };

  const applyStep = (stepObj) => {
    if (!stepObj) return;
    setActiveNode(stepObj.node);
    setVisitedNodes(stepObj.visited || []);
    setActiveEdge(stepObj.edge);
    setLogText(stepObj.text);
    if (stepObj.dist) setDistances(stepObj.dist);
    if (stepObj.mst) setMstEdges(stepObj.mst);
  };

  const loadAlgo = (newAlgo) => {
    setIsPlaying(false);
    setAlgo(newAlgo);
    const newSteps = generateSteps(newAlgo);
    setSteps(newSteps);
    setCurrentStep(0);
    setMstEdges([]);
    setDistances({ 0: 0, 1: '∞', 2: '∞', 3: '∞', 4: '∞', 5: '∞' });
    applyStep(newSteps[0]);
  };

  useEffect(() => {
    loadAlgo('bfs');
  }, []);

  // Animation player
  useEffect(() => {
    if (!isPlaying || steps.length === 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          const next = prev + 1;
          applyStep(steps[next]);
          return next;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, speed);

    return () => clearInterval(timerRef.current);
  }, [isPlaying, steps, speed]);

  const stepForward = () => {
    if (currentStep < steps.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      applyStep(steps[next]);
    }
  };

  const stepBackward = () => {
    if (currentStep > 0) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      applyStep(steps[prev]);
    }
  };

  const isEdgeInMST = (u, v) => {
    return mstEdges.some(e => (e.u === u && e.v === v) || (e.u === v && e.v === u));
  };

  const isEdgeActive = (u, v) => {
    if (!activeEdge) return false;
    return (activeEdge.u === u && activeEdge.v === v) || (activeEdge.u === v && activeEdge.v === u);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
      {/* Header & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-purple-400 font-mono">04.</span> Graph Algorithms Visualizer
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Step-by-step BFS, DFS, Dijkstra Shortest Path &amp; Prim's Minimum Spanning Tree
          </p>
        </div>

        <div className="flex bg-slate-900/80 p-1 rounded-xl border border-white/10 text-xs font-semibold">
          {['bfs', 'dfs', 'dijkstra', 'prims'].map((type) => (
            <button
              key={type}
              onClick={() => loadAlgo(type)}
              className={`px-3 py-1.5 rounded-lg transition uppercase ${
                algo === type ? 'bg-purple-600 text-white font-bold shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {type === 'bfs' ? 'BFS' : type === 'dfs' ? 'DFS' : type === 'dijkstra' ? 'Dijkstra' : "Prim's MST"}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Graph Canvas */}
      <div className="bg-slate-950/80 rounded-xl p-4 border border-white/5 flex flex-col items-center justify-center min-h-[300px] relative overflow-x-auto">
        <svg width="540" height="280" className="overflow-visible">
          {/* Edges */}
          {GRAPH_EDGES.map((edge, i) => {
            const uNode = GRAPH_NODES.find(n => n.id === edge.u);
            const vNode = GRAPH_NODES.find(n => n.id === edge.v);
            const inMst = isEdgeInMST(edge.u, edge.v);
            const active = isEdgeActive(edge.u, edge.v);

            return (
              <g key={i}>
                <line
                  x1={uNode.x}
                  y1={uNode.y}
                  x2={vNode.x}
                  y2={vNode.y}
                  stroke={inMst ? '#10b981' : active ? '#f59e0b' : 'rgba(255,255,255,0.15)'}
                  strokeWidth={inMst ? 4 : active ? 3.5 : 2}
                  className="transition-all duration-300"
                />
                {/* Weight badge */}
                <rect
                  x={(uNode.x + vNode.x) / 2 - 10}
                  y={(uNode.y + vNode.y) / 2 - 9}
                  width="20"
                  height="16"
                  rx="4"
                  fill="#0b0f19"
                  stroke={active ? '#f59e0b' : inMst ? '#10b981' : 'rgba(255,255,255,0.1)'}
                />
                <text
                  x={(uNode.x + vNode.x) / 2}
                  y={(uNode.y + vNode.y) / 2 + 3}
                  textAnchor="middle"
                  fill={active ? '#f59e0b' : inMst ? '#34d399' : '#94a3b8'}
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {edge.w}
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {GRAPH_NODES.map((node) => {
            const isVisited = visitedNodes.includes(node.id);
            const isActive = activeNode === node.id;

            return (
              <g key={node.id} className="transition-all duration-300">
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={22}
                  fill={isActive ? '#a855f7' : isVisited ? '#1e1b4b' : '#0f172a'}
                  stroke={isActive ? '#c084fc' : isVisited ? '#818cf8' : 'rgba(255,255,255,0.2)'}
                  strokeWidth={isActive ? '3.5' : '2'}
                  className="transition-all duration-300 shadow-md"
                />
                <text
                  x={node.x}
                  y={node.y + 5}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="13"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {node.label}
                </text>
                {algo === 'dijkstra' && (
                  <text
                    x={node.x}
                    y={node.y - 28}
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    d={distances[node.id]}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Trace Log Bar */}
      <div className="bg-slate-900/90 rounded-xl p-3 border border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
          <span className="font-mono text-purple-300 font-medium">Trace Log:</span>
          <span className="text-slate-200">{logText}</span>
        </div>
        <span className="text-slate-400 font-mono">
          Step: {currentStep + 1} / {steps.length}
        </span>
      </div>

      {/* Animation Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={steps.length === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              isPlaying
                ? 'bg-amber-500 text-slate-950'
                : 'bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            {isPlaying ? 'Pause' : 'Auto Play'}
          </button>

          <button
            onClick={stepBackward}
            disabled={currentStep <= 0}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <SkipBack size={14} />
          </button>

          <button
            onClick={stepForward}
            disabled={currentStep >= steps.length - 1}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <SkipForward size={14} />
          </button>

          <button
            onClick={() => loadAlgo(algo)}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg text-xs ml-auto border border-white/10 transition"
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
            max="2000"
            step="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-24 accent-purple-400 cursor-pointer"
          />
          <span className="text-[11px] font-mono text-purple-300">{speed}ms</span>
        </div>
      </div>
    </div>
  );
}
