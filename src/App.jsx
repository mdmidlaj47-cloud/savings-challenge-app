import React, { useState } from 'react';
import { useSavingsChallenges } from './hooks/useSavingsChallenges';
import Navbar from './components/Navbar';
import HeroOverview from './components/HeroOverview';
import InteractiveMatrix from './components/InteractiveMatrix';
import TimelineSchedule from './components/TimelineSchedule';
import GoalPortfolio from './components/GoalPortfolio';
import CreateGoalModal from './components/CreateGoalModal';
import ItemDetailModal from './components/ItemDetailModal';
import NotificationModal from './components/NotificationModal';
import CelebrationModal from './components/CelebrationModal';
import { Sparkles, Plus, ShieldCheck, Bell, CheckCircle2, X } from 'lucide-react';

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
    dueTodayInstallments,
    notificationSettings,
    updateNotificationSettings,
    triggerTestNotification,
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
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [dismissDueBanner, setDismissDueBanner] = useState(false);

  const currency = activeChallenge?.currency || '₹';
  const hasDueToday = dueTodayInstallments.length > 0;
  const firstDue = hasDueToday ? dueTodayInstallments[0] : null;

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#070A0F] text-slate-100 font-sans selection:bg-emerald-500 selection:text-black">
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
        onOpenNotifications={() => setIsNotificationOpen(true)}
        hasDueNotifications={hasDueToday}
        onResetGoal={resetGoal}
        onDeleteGoal={deleteGoal}
      />

      {/* Due Today Interactive Banner */}
      {hasDueToday && !dismissDueBanner && (
        <div className="bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-teal-500/15 border-b border-amber-500/20 px-3 sm:px-4 py-2 w-full overflow-hidden">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 truncate min-w-0">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
              <span className="text-slate-300 truncate text-[11px] sm:text-xs">
                <strong className="text-white">Due Today:</strong> {firstDue.label} of <strong className="text-emerald-400 font-mono">{firstDue.currency}{firstDue.amount}</strong> for "{firstDue.goalTitle}"
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={() => toggleItem(firstDue.itemId)}
                className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-[10px] sm:text-[11px] transition-all"
              >
                Deposit
              </button>
              <button
                onClick={() => setDismissDueBanner(true)}
                className="text-slate-400 hover:text-white p-0.5"
                title="Dismiss banner"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="w-full max-w-full overflow-x-hidden">
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
                onDeleteGoal={deleteGoal}
              />
            )}
          </>
        ) : (
          /* Empty State for Fresh Users or when all goals deleted */
          <div className="max-w-xl mx-auto px-4 py-20 sm:py-24 text-center">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome to VaultCraft
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-md mx-auto">
              You currently have no active savings goals. Build financial momentum by creating your own customized savings plan.
            </p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="mt-6 sm:mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold text-sm shadow-[0_0_20px_rgba(16,185,129,0.4)] active:scale-95 transition-all"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              Create Your Goal
            </button>
          </div>
        )}
      </main>

      {/* Sticky Mobile Quick Save Bar */}
      {activeChallenge && activeTab !== 'overview' && analytics.nextDueItem && (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden p-3 bg-[#0A0E17]/95 backdrop-blur-xl border-t border-slate-800 z-30 pb-safe w-full max-w-full overflow-hidden">
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            <div className="min-w-0">
              <span className="text-[9px] text-slate-400 block font-medium">Banked so far</span>
              <span className="text-base sm:text-lg font-extrabold text-emerald-400 font-mono leading-tight truncate block">
                {currency}{analytics.totalSaved?.toLocaleString()}
              </span>
            </div>
            <button
              onClick={saveNextItem}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold text-xs shadow-[0_0_15px_rgba(16,185,129,0.4)] active:scale-95 flex-shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
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

      {/* Notification / Reminders Modal */}
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notificationSettings={notificationSettings}
        onUpdateSettings={updateNotificationSettings}
        onTriggerTest={triggerTestNotification}
        dueInstallments={dueTodayInstallments}
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
