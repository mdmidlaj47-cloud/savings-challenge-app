import { useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { INITIAL_PRESETS, generateCustomChallenge } from '../utils/challengeGenerator';
import { getDualPeriodInfo } from '../utils/periodConverter';
import { THEMES } from '../utils/themes';
import { playPopSound, playUntickSound, playSuccessChime, playMilestoneFanfare } from '../utils/audio';

const STORAGE_KEY = 'vaultcraft_savings_goals_v3';
const SOUND_KEY = 'vaultcraft_sound_pref';
const THEME_KEY = 'vaultcraft_theme_pref';

export function useSavingsChallenges() {
  const [challenges, setChallenges] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load goals from localStorage', e);
    }
    return INITIAL_PRESETS;
  });

  const [activeId, setActiveId] = useState(() => {
    return challenges[0]?.id || '';
  });

  const [activeTab, setActiveTab] = useState('matrix'); // 'matrix', 'timeline', 'overview'

  const [soundEnabled, setSoundEnabledState] = useState(() => {
    const pref = localStorage.getItem(SOUND_KEY);
    return pref !== null ? JSON.parse(pref) : true;
  });

  const [themeId, setThemeId] = useState(() => {
    const pref = localStorage.getItem(THEME_KEY);
    return pref && THEMES[pref] ? pref : 'emerald';
  });

  const [celebration, setCelebration] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(challenges));
    } catch (e) {}
  }, [challenges]);

  useEffect(() => {
    try {
      localStorage.setItem(SOUND_KEY, JSON.stringify(soundEnabled));
    } catch (e) {}
  }, [soundEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, themeId);
    } catch (e) {}
  }, [themeId]);

  const activeChallenge = useMemo(() => {
    return challenges.find(c => c.id === activeId) || challenges[0] || null;
  }, [challenges, activeId]);

  const currentTheme = THEMES[themeId] || THEMES.emerald;

  // Financial Analytics Calculations with Dual Period Conversion
  const analytics = useMemo(() => {
    if (!activeChallenge) return {};

    const totalTarget = activeChallenge.targetAmount || 0;
    const currency = activeChallenge.currency || '₹';
    const items = activeChallenge.items || [];
    const savedItems = items.filter(it => it.saved);
    const totalSaved = savedItems.reduce((acc, it) => acc + (Number(it.amount) || 0), 0);
    const remainingAmount = Math.max(0, totalTarget - totalSaved);
    const progressPercent = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;
    const savedCount = savedItems.length;
    const totalCount = items.length;

    // Dual Period & Rates Conversion
    const dualInfo = getDualPeriodInfo(
      activeChallenge.durationValue,
      activeChallenge.durationUnit,
      totalTarget,
      currency
    );

    // Next item to save
    const nextDueItem = items.find(it => !it.saved) || null;

    // Calculate savings streak
    let streak = 0;
    for (let i = 0; i < items.length; i++) {
      if (items[i].saved) streak++;
      else break;
    }

    // Average contribution
    const avgContribution = savedCount > 0 ? Math.round(totalSaved / savedCount) : Math.round(totalTarget / (totalCount || 1));

    // Projected completion estimation
    const remainingCount = totalCount - savedCount;
    const unitDays = activeChallenge.durationUnit === 'weeks' ? 7 : activeChallenge.durationUnit === 'months' ? 30.4 : 1;
    const estimatedDaysRemaining = Math.round(remainingCount * unitDays);
    const projectedDate = new Date(Date.now() + estimatedDaysRemaining * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    return {
      totalTarget,
      totalSaved,
      remainingAmount,
      progressPercent,
      savedCount,
      totalCount,
      nextDueItem,
      streak,
      avgContribution,
      projectedDate,
      dualInfo
    };
  }, [activeChallenge]);

  // Confetti celebrations
  const triggerConfetti = useCallback((level = 'normal') => {
    if (level === 'epic') {
      const end = Date.now() + 2500;
      const interval = setInterval(() => {
        if (Date.now() > end) return clearInterval(interval);
        confetti({
          startVelocity: 35,
          spread: 360,
          ticks: 70,
          origin: { x: Math.random(), y: Math.random() - 0.2 },
          colors: ['#10B981', '#06B6D4', '#6366F1', '#F59E0B', '#EC4899']
        });
      }, 250);
    } else {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10B981', '#34D399', '#38BDF8', '#FBBF24']
      });
    }
  }, []);

  // Toggle item status
  const toggleItem = useCallback((itemId) => {
    setChallenges(prev => prev.map(ch => {
      if (ch.id !== activeId) return ch;

      const updatedItems = ch.items.map(item => {
        if (item.id === itemId) {
          const nextState = !item.saved;
          if (nextState) playPopSound();
          else playUntickSound();

          return {
            ...item,
            saved: nextState,
            savedAt: nextState ? new Date().toISOString().split('T')[0] : null,
          };
        }
        return item;
      });

      // Milestone trigger
      const prevSaved = ch.items.filter(it => it.saved).reduce((a, b) => a + b.amount, 0);
      const newSaved = updatedItems.filter(it => it.saved).reduce((a, b) => a + b.amount, 0);
      const prevPct = Math.floor((prevSaved / ch.targetAmount) * 100);
      const newPct = Math.floor((newSaved / ch.targetAmount) * 100);

      if (newPct >= 100 && prevPct < 100) {
        playMilestoneFanfare();
        triggerConfetti('epic');
        setCelebration({
          percent: 100,
          title: 'Goal Completed! 🏆',
          subtitle: `Congratulations! You reached your goal of ${ch.currency}${ch.targetAmount.toLocaleString()}.`
        });
      } else if (newPct >= 75 && prevPct < 75) {
        playSuccessChime();
        triggerConfetti('normal');
        setCelebration({
          percent: 75,
          title: '75% Milestone Achieved! 🚀',
          subtitle: `Only ${ch.currency}${(ch.targetAmount - newSaved).toLocaleString()} left to the finish line.`
        });
      } else if (newPct >= 50 && prevPct < 50) {
        playSuccessChime();
        triggerConfetti('normal');
        setCelebration({
          percent: 50,
          title: 'Halfway There! ⭐️',
          subtitle: `You have successfully banked ${ch.currency}${newSaved.toLocaleString()}.`
        });
      } else if (newPct >= 25 && prevPct < 25) {
        playSuccessChime();
        triggerConfetti('normal');
        setCelebration({
          percent: 25,
          title: 'Quarter Milestone (25%)! 👏',
          subtitle: `Outstanding start! Steady habits build lasting wealth.`
        });
      }

      return { ...ch, items: updatedItems };
    }));
  }, [activeId, triggerConfetti]);

  // Update item details
  const updateItem = useCallback((itemId, updates) => {
    setChallenges(prev => prev.map(ch => {
      if (ch.id !== activeId) return ch;
      return {
        ...ch,
        items: ch.items.map(it => it.id === itemId ? { ...it, ...updates } : it)
      };
    }));
  }, [activeId]);

  // Quick save next due installment
  const saveNextItem = useCallback(() => {
    if (analytics.nextDueItem) {
      toggleItem(analytics.nextDueItem.id);
    }
  }, [analytics.nextDueItem, toggleItem]);

  // Create new challenge
  const createChallenge = useCallback((config) => {
    const newGoal = generateCustomChallenge(config);
    setChallenges(prev => [newGoal, ...prev]);
    setActiveId(newGoal.id);
    playSuccessChime();
  }, []);

  // Reset progress
  const resetGoal = useCallback(() => {
    if (!window.confirm('Reset this savings goal? All logged deposits will be set back to pending.')) return;
    setChallenges(prev => prev.map(ch => {
      if (ch.id === activeId) {
        return {
          ...ch,
          items: ch.items.map(it => ({ ...it, saved: false, savedAt: null, note: '' }))
        };
      }
      return ch;
    }));
    playUntickSound();
  }, [activeId]);

  // Delete goal
  const deleteGoal = useCallback((idToDelete) => {
    if (challenges.length <= 1) {
      alert('You must maintain at least one active savings goal.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this savings goal?')) return;

    setChallenges(prev => {
      const remaining = prev.filter(c => c.id !== idToDelete);
      if (activeId === idToDelete) {
        setActiveId(remaining[0].id);
      }
      return remaining;
    });
  }, [activeId, challenges.length]);

  return {
    challenges,
    activeChallenge,
    activeId,
    setActiveId,
    activeTab,
    setActiveTab,
    soundEnabled,
    setSoundEnabled: setSoundEnabledState,
    themeId,
    setThemeId,
    currentTheme,
    analytics,
    toggleItem,
    updateItem,
    saveNextItem,
    createChallenge,
    resetGoal,
    deleteGoal,
    celebration,
    closeCelebration: () => setCelebration(null),
  };
}
