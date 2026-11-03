import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Sparkles, X } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

export default function BadgeModal() {
  const { newlyUnlockedBadge, setNewlyUnlockedBadge } = useProgress();

  if (!newlyUnlockedBadge) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 30 }}
          className="relative max-w-sm w-full glass-panel border border-cyan-500/50 rounded-2xl p-6 text-center space-y-4 shadow-2xl shadow-cyan-500/20"
        >
          <button
            onClick={() => setNewlyUnlockedBadge(null)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X size={18} />
          </button>

          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-400/50 flex items-center justify-center text-4xl shadow-inner animate-bounce">
            {newlyUnlockedBadge.icon}
          </div>

          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-500/30">
              New Badge Unlocked!
            </span>
            <h3 className="text-xl font-black text-white mt-2">
              {newlyUnlockedBadge.name}
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              {newlyUnlockedBadge.description}
            </p>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center gap-2 text-xs font-mono text-amber-300 font-bold">
            <Sparkles size={14} className="text-amber-400" /> +100 Bonus XP Awarded
          </div>

          <button
            onClick={() => setNewlyUnlockedBadge(null)}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition hover:opacity-90 shadow-lg"
          >
            Awesome! Keep Learning
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
