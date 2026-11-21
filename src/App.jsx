import React, { useState } from 'react';
import { useSavingsChallenges } from './hooks/useSavingsChallenges';
import Navbar from './components/Navbar';
import HeroOverview from './components/HeroOverview';
import InteractiveMatrix from './components/InteractiveMatrix';
import TimelineSchedule from './components/TimelineSchedule';
import GoalPortfolio from './components/GoalPortfolio';
import CreateGoalModal from './components/CreateGoalModal';
import ItemDetailModal from './components/ItemDetailModal';
import CelebrationModal from './components/CelebrationModal';
import { Sparkles, Plus, ShieldCheck, Target } from 'lucide-react';

export default function App() {
  const {
    challenges,
    activeChallenge,
    activeId,
    setActiveId,
    activeTab,
    setActiveTab,
    soundEnabled,
    setSoundEnabled,
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
    closeCelebration,
  } = useSavingsChallenges();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [detailItem, setDetailItem] = useState(null);

  const currency = activeChallenge?.currency || '₹';

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Application Navbar */}
      <Navbar
        challenges={challenges}
        activeId={activeId}
        onSelectGoal={setActiveId}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        themeId={themeId}
        onSelectTheme={setThemeId}
        currentTheme={currentTheme}
        onOpenCreate={() => setIsCreateOpen(true)}
        onResetGoal={resetGoal}
        onDeleteGoal={deleteGoal}
      />

      {/* Main Container */}
      <main className="w-full">
        {activeChallenge ? (
          <>
            {/* Executive Hero Banner & KPI Stats */}
            <HeroOverview
              challenge={activeChallenge}
              analytics={analytics}
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              onSaveNext={saveNextItem}
              currentTheme={currentTheme}
            />

            {/* Tabbed Content Views */}
            {activeTab === 'matrix' && (
              <InteractiveMatrix
                challenge={activeChallenge}
                onToggleItem={toggleItem}
                onOpenItemDetail={(item) => setDetailItem(item)}
              />
            )}

            {activeTab === 'timeline' && (
              <TimelineSchedule
                challenge={activeChallenge}
                onToggleItem={toggleItem}
                onOpenItemDetail={(item) => setDetailItem(item)}
              />
            )}

            {activeTab === 'overview' && (
              <GoalPortfolio
                challenges={challenges}
                activeId={activeId}
                onSelectGoal={(id) => {
                  setActiveId(id);
                  setActiveTab('matrix');
                }}
                onOpenCreate={() => setIsCreateOpen(true)}
              />
            )}
          </>
        ) : (
          /* Empty State for Fresh Users */
          <div className="max-w-xl mx-auto px-4 py-24 text-center">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Welcome to VaultCraft
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
              You have no active savings targets yet. Build financial momentum by creating your very first goal.
            </p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold text-sm shadow-[0_0_20px_rgba(16,185,129,0.4)] active:scale-95 transition-all"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              Create Your First Goal
            </button>
          </div>
        )}
      </main>

      {/* Sticky Mobile Quick Save Bar */}
      {activeChallenge && activeTab !== 'overview' && analytics.nextDueItem && (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden p-3 bg-[#0A0E17]/95 backdrop-blur-xl border-t border-slate-800 z-30">
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Banked so far</span>
              <span className="text-lg font-extrabold text-emerald-400 font-mono leading-tight">
                {currency}{analytics.totalSaved?.toLocaleString()}
              </span>
            </div>
            <button
              onClick={saveNextItem}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold text-xs shadow-[0_0_15px_rgba(16,185,129,0.4)] active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              Deposit Next ({currency}{analytics.nextDueItem?.amount?.toLocaleString()})
            </button>
          </div>
        </div>
      )}

      {/* Item Detail & Notes Modal */}
      <ItemDetailModal
        isOpen={!!detailItem}
        item={detailItem}
        currency={currency}
        onClose={() => setDetailItem(null)}
        onUpdateItem={updateItem}
        onToggleItem={toggleItem}
      />

      {/* Create New Goal Modal */}
      <CreateGoalModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreateGoal={createChallenge}
        currentTheme={currentTheme}
      />

      {/* Milestone Fanfare Modal */}
      <CelebrationModal
        celebration={celebration}
        onClose={closeCelebration}
      />
    </div>
  );
}
