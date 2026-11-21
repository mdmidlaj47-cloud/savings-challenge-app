import React from 'react';
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  Flame, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  LayoutGrid, 
  ListTree, 
  Layers,
  ArrowRightLeft
} from 'lucide-react';

export default function HeroOverview({
  challenge,
  analytics,
  activeTab,
  onSelectTab,
  onSaveNext,
  currentTheme
}) {
  const currency = challenge.currency || '₹';
  const {
    totalTarget = 0,
    totalSaved = 0,
    remainingAmount = 0,
    progressPercent = 0,
    savedCount = 0,
    totalCount = 0,
    nextDueItem,
    streak = 0,
    avgContribution = 0,
    projectedDate = 'N/A',
    dualInfo
  } = analytics;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
      {/* Top Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#111827] via-[#0D131F] to-[#0A0E17] border border-slate-800 p-6 sm:p-8 shadow-2xl">
        {/* Subtle Ambient Background Glows */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Goal Information */}
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <Target className="w-3.5 h-3.5" />
                <span>{challenge.category || 'Active Target'}</span>
              </span>

              {/* Dual Period Badge (e.g. 20 Weeks ~ 4.6 Months) */}
              {dualInfo && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-slate-300 text-xs font-bold font-mono">
                  <ArrowRightLeft className="w-3 h-3 text-emerald-400" />
                  <span>{dualInfo.badgeText}</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              {challenge.title}
            </h1>
            
            {/* Dual Rate Breakdown Subtitle */}
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 font-medium flex items-center gap-1.5 flex-wrap">
              <span>Savings Rate:</span>
              <span className="text-emerald-400 font-bold font-mono">
                {dualInfo?.rateComparison || challenge.subtitle}
              </span>
            </p>
          </div>

          {/* Target Big Number Display */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 lg:text-right">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 block">
                Target Vault
              </span>
              <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-mono tracking-tight">
                {currency}{totalTarget.toLocaleString()}
              </span>
            </div>

            <div className="hidden sm:block h-12 w-px bg-slate-800" />

            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400 block">
                Total Saved
              </span>
              <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-emerald-400 font-mono tracking-tight drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                {currency}{totalSaved.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <div className="flex justify-between items-center text-xs font-bold mb-2">
            <span className="text-slate-300 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Overall Progress: <span className="text-emerald-400 font-mono text-sm">{progressPercent}%</span>
            </span>
            <span className="text-slate-400 font-mono">
              {savedCount} of {totalCount} Installments Banked
            </span>
          </div>

          <div className="w-full h-3.5 bg-slate-950/80 rounded-full p-0.5 border border-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-green-300 rounded-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(16,185,129,0.7)]"
              style={{ width: `${Math.max(2, progressPercent)}%` }}
            />
          </div>
        </div>

        {/* 4 Financial KPI Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6">
          {/* Metric 1: Remaining Balance */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 sm:p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Remaining</span>
              <Clock className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono text-slate-200">
              {currency}{remainingAmount.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {totalCount - savedCount} periods left
            </div>
          </div>

          {/* Metric 2: Next Installment & Quick Save */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 sm:p-4 backdrop-blur-sm relative group">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Next Due</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            {nextDueItem ? (
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400">
                    {currency}{nextDueItem.amount.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {nextDueItem.label}
                  </div>
                </div>
                <button
                  onClick={onSaveNext}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-black text-[11px] font-bold transition-all shadow-sm"
                >
                  Deposit
                </button>
              </div>
            ) : (
              <div className="text-sm font-bold text-emerald-400 py-1">
                All Completed! 🎉
              </div>
            )}
          </div>

          {/* Metric 3: Projected Completion with Dual Equivalent */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 sm:p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Estimated Finish</span>
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-200 truncate">
              {projectedDate}
            </div>
            <div className="text-[11px] text-emerald-400/90 font-medium mt-0.5">
              {dualInfo?.primaryRate || `Avg ${currency}${avgContribution.toLocaleString()}`}
            </div>
          </div>

          {/* Metric 4: Discipline Streak */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 sm:p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Savings Streak</span>
              <Flame className="w-3.5 h-3.5 text-orange-400" />
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono text-orange-400 flex items-center gap-1.5">
              <span>{streak}</span>
              <span className="text-xs font-sans text-slate-400 font-normal">cycles</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {streak > 0 ? 'Consistent habit 🔥' : 'Start your streak today'}
            </div>
          </div>
        </div>
      </div>

      {/* View Switcher Navigation Tabs */}
      <div className="flex items-center justify-between mt-6 mb-4">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 border border-slate-800 rounded-2xl">
          <button
            onClick={() => onSelectTab('matrix')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'matrix'
                ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Interactive Grid</span>
          </button>

          <button
            onClick={() => onSelectTab('timeline')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'timeline'
                ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ListTree className="w-3.5 h-3.5" />
            <span>Timeline Schedule</span>
          </button>

          <button
            onClick={() => onSelectTab('overview')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Goals</span>
          </button>
        </div>

        {/* Quick Deposit Next Floating Action for Desktop */}
        <div className="hidden sm:block">
          <button
            onClick={onSaveNext}
            disabled={remainingAmount === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
              remainingAmount === 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {remainingAmount === 0 ? 'Goal Completed' : 'Save Next Installment'}
          </button>
        </div>
      </div>
    </div>
  );
}
