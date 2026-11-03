import React, { useState } from 'react';
import LinkedListVisualizer from '../components/visualizers/LinkedListVisualizer';
import StackQueueVisualizer from '../components/visualizers/StackQueueVisualizer';
import BSTVisualizer from '../components/visualizers/BSTVisualizer';
import GraphVisualizer from '../components/visualizers/GraphVisualizer';
import { Eye, Network, Layers, GitFork, Compass } from 'lucide-react';

export default function VisualizersPage() {
  const [activeCategory, setActiveCategory] = useState('linked-list');

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <Eye size={20} />
            </span>
            Algorithm &amp; Data Structure Visualizers
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Animated visual simulators with Step Forward, Step Backward, Auto Play, and Speed Control
          </p>
        </div>

        {/* Category Switcher Tabs */}
        <div className="flex bg-slate-900/90 p-1.5 rounded-2xl border border-white/10 text-xs font-semibold gap-1 overflow-x-auto">
          {[
            { id: 'linked-list', label: 'Linked Lists', icon: GitFork },
            { id: 'stack-queue', label: 'Stack & Queue', icon: Layers },
            { id: 'trees', label: 'BST & Traversals', icon: Network },
            { id: 'graphs', label: 'Graphs & MST', icon: Compass },
          ].map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={14} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Selected Visualizer Engine */}
      <div>
        {activeCategory === 'linked-list' && <LinkedListVisualizer />}
        {activeCategory === 'stack-queue' && <StackQueueVisualizer />}
        {activeCategory === 'trees' && <BSTVisualizer />}
        {activeCategory === 'graphs' && <GraphVisualizer />}
      </div>
    </div>
  );
}
