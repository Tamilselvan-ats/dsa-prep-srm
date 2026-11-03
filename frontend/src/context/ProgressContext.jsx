import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const ProgressContext = createContext(null);

const BADGES_CONFIG = [
  { id: 'b-struct', name: 'Structure Starter', icon: '🧱', description: 'Mastered Unit 1 C Structures & Pointers' },
  { id: 'b-ll', name: 'Linked List Master', icon: '🔗', description: 'Mastered Singly, Doubly & Circular Lists' },
  { id: 'b-stack', name: 'Stack Master', icon: '🥞', description: 'Mastered LIFO Operations & Infix/Postfix' },
  { id: 'b-queue', name: 'Queue Master', icon: '🎟️', description: 'Mastered FIFO & Circular Queue modulo math' },
  { id: 'b-tree', name: 'Tree Warrior', icon: '🌲', description: 'Mastered BST & AVL Tree Balance Rotations' },
  { id: 'b-graph', name: 'Graph Explorer', icon: '🕸️', description: 'Mastered BFS, DFS, Dijkstra & MST algorithms' },
  { id: 'b-champ', name: 'DSA Champion', icon: '🏆', description: 'Achieved high overall readiness across all 5 units' }
];

export function ProgressProvider({ children }) {
  // Completed topics map: { [topicId]: true }
  const [completedTopics, setCompletedTopics] = useState(() => {
    const saved = localStorage.getItem('dsa_completed_topics');
    return saved ? JSON.parse(saved) : {
      'u1-struct': true,
      'u1-dma': true,
      'u2-linked-list': true,
      'u3-stack': true,
      'u4-bst': true
    };
  });

  const [xp, setXp] = useState(() => {
    const saved = localStorage.getItem('dsa_xp');
    return saved ? parseInt(saved, 10) : 650;
  });

  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('dsa_streak');
    return saved ? parseInt(saved, 10) : 5;
  });

  const [unlockedBadges, setUnlockedBadges] = useState(() => {
    const saved = localStorage.getItem('dsa_badges');
    return saved ? JSON.parse(saved) : ['b-struct', 'b-ll'];
  });

  const [labScores, setLabScores] = useState(() => {
    const saved = localStorage.getItem('dsa_lab_scores');
    return saved ? JSON.parse(saved) : [
      { id: 'lab-sim-1', title: 'Implement Queue using Linked List', score: 9.0, max: 10, date: 'Yesterday' }
    ];
  });

  const [vivaScore, setVivaScore] = useState(() => {
    const saved = localStorage.getItem('dsa_viva_score');
    return saved ? parseInt(saved, 10) : 78;
  });

  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('dsa_completed_topics', JSON.stringify(completedTopics));
  }, [completedTopics]);

  useEffect(() => {
    localStorage.setItem('dsa_xp', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('dsa_streak', streak.toString());
  }, [streak]);

  useEffect(() => {
    localStorage.setItem('dsa_badges', JSON.stringify(unlockedBadges));
  }, [unlockedBadges]);

  useEffect(() => {
    localStorage.setItem('dsa_lab_scores', JSON.stringify(labScores));
  }, [labScores]);

  useEffect(() => {
    localStorage.setItem('dsa_viva_score', vivaScore.toString());
  }, [vivaScore]);

  // Award XP with sound/visual cue
  const addXP = (amount, reason = '') => {
    setXp(prev => {
      const next = prev + amount;
      return next;
    });
  };

  // Check and award badges
  const checkBadgeUnlocks = (newCompletedMap, currentBadges = unlockedBadges) => {
    const newlyEarned = [];

    if (!currentBadges.includes('b-struct') && newCompletedMap['u1-struct'] && newCompletedMap['u1-self-ref']) {
      newlyEarned.push('b-struct');
    }
    if (!currentBadges.includes('b-ll') && newCompletedMap['u2-linked-list'] && newCompletedMap['u2-doubly-ll']) {
      newlyEarned.push('b-ll');
    }
    if (!currentBadges.includes('b-stack') && newCompletedMap['u3-stack'] && newCompletedMap['u3-infix-postfix']) {
      newlyEarned.push('b-stack');
    }
    if (!currentBadges.includes('b-queue') && newCompletedMap['u3-queue'] && newCompletedMap['u3-circ-queue']) {
      newlyEarned.push('b-queue');
    }
    if (!currentBadges.includes('b-tree') && newCompletedMap['u4-bst'] && newCompletedMap['u4-avl']) {
      newlyEarned.push('b-tree');
    }
    if (!currentBadges.includes('b-graph') && newCompletedMap['u5-bfs'] && newCompletedMap['u5-dijkstra']) {
      newlyEarned.push('b-graph');
    }

    const totalTopicsCount = Object.keys(newCompletedMap).length;
    if (!currentBadges.includes('b-champ') && totalTopicsCount >= 18) {
      newlyEarned.push('b-champ');
    }

    if (newlyEarned.length > 0) {
      const updated = [...currentBadges, ...newlyEarned];
      setUnlockedBadges(updated);
      const latestBadge = BADGES_CONFIG.find(b => b.id === newlyEarned[0]);
      setNewlyUnlockedBadge(latestBadge);

      // Trigger Confetti explosion
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback if canvas not available
      }
    }
  };

  const toggleTopicCompletion = (topicId) => {
    setCompletedTopics(prev => {
      const isAlready = !!prev[topicId];
      const updated = { ...prev };
      if (isAlready) {
        delete updated[topicId];
      } else {
        updated[topicId] = true;
        addXP(50, `Mastered ${topicId}`);
      }
      checkBadgeUnlocks(updated);
      return updated;
    });
  };

  const recordLabSubmission = (submission) => {
    setLabScores(prev => [submission, ...prev]);
    addXP(100, `Completed Lab Exam Simulation`);
    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch (e) {}
  };

  const updateVivaPerformance = (newScore) => {
    setVivaScore(newScore);
    addXP(30, 'Completed Viva Turn');
  };

  // Compute analytics
  const totalSyllabusTopicsCount = 47; // approx across 5 units
  const completedCount = Object.keys(completedTopics).length;
  const overallCompletionRate = Math.min(100, Math.round((completedCount / totalSyllabusTopicsCount) * 100));

  // Unit completion breakdown
  const unitBreakdown = {
    unit1: Math.min(100, Math.round((['u1-struct', 'u1-self-ref', 'u1-ptr-struct', 'u1-dma', 'u1-big-o'].filter(id => completedTopics[id]).length / 5) * 100)),
    unit2: Math.min(100, Math.round((['u2-linked-list', 'u2-doubly-ll', 'u2-circular-ll', 'u2-sparse-matrix'].filter(id => completedTopics[id]).length / 4) * 100)),
    unit3: Math.min(100, Math.round((['u3-stack', 'u3-queue', 'u3-circ-queue', 'u3-infix-postfix', 'u3-balancing-symbols'].filter(id => completedTopics[id]).length / 5) * 100)),
    unit4: Math.min(100, Math.round((['u4-trees', 'u4-bst', 'u4-avl', 'u4-rotations', 'u4-heaps', 'u4-hashing'].filter(id => completedTopics[id]).length / 6) * 100)),
    unit5: Math.min(100, Math.round((['u5-graph', 'u5-bfs', 'u5-dfs', 'u5-prims', 'u5-dijkstra'].filter(id => completedTopics[id]).length / 5) * 100)),
  };

  const labReadiness = Math.min(100, Math.round((labScores.length * 15 + completedCount * 1.5)));
  const vivaReadiness = Math.min(100, vivaScore);

  const strongAreas = ['Linked Lists', 'Stack Applications', 'BST Traversals'];
  const weakAreas = ['AVL Double Rotations (LR/RL)', 'Kruskal Cycle Detection via DSU', 'Quadratic Probing Modulo Bounds'];

  return (
    <ProgressContext.Provider value={{
      completedTopics,
      toggleTopicCompletion,
      xp,
      addXP,
      streak,
      badges: BADGES_CONFIG,
      unlockedBadges,
      newlyUnlockedBadge,
      setNewlyUnlockedBadge,
      labScores,
      recordLabSubmission,
      vivaScore,
      updateVivaPerformance,
      overallCompletionRate,
      unitBreakdown,
      labReadiness,
      vivaReadiness,
      strongAreas,
      weakAreas
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress must be used within ProgressProvider');
  return context;
}
