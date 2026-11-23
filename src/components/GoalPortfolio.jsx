import React from 'react';
import { Target, TrendingUp, Plus, ArrowRight, ShieldCheck, Clock, Trash2 } from 'lucide-react';

export default function GoalPortfolio({
  challenges,
  activeId,
  onSelectGoal,
  onOpenCreate,
  onDeleteGoal
}) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-28">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Your Goal Portfolio</h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage and track your active wealth and savings targets</p>
        </div>
        <button
          onClick={onOpenCreate}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-xs font-bold border border-emerald-500/30 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Goal</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {challenges.map(ch => {
          const isCurrent = ch.id === activeId;
          const currency = ch.currency || '₹';
          const saved = ch.items.filter(it => it.saved).reduce((a, b) => a + b.amount, 0);
          const total = ch.targetAmount || 1;
          const pct = Math.min(100, Math.round((saved / total) * 100));
          const remaining = Math.max(0, total - saved);
          const savedCount = ch.items.filter(it => it.saved).length;

          return (
            <div
              key={ch.id}
              className={`group relative rounded-3xl p-6 border transition-all duration-200 flex flex-col justify-between ${
                isCurrent
                  ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-[#0A121A] border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700/80">
                    {ch.category || 'Savings Target'}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {isCurrent && (
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        Active
                      </span>
                    )}

                    {/* Direct Delete Goal Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteGoal(ch.id);
                      }}
                      title="Delete this goal"
                      className="w-7 h-7 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div 
                  onClick={() => onSelectGoal(ch.id)}
                  className="cursor-pointer"
                >
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {ch.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                    {ch.subtitle || `${ch.durationValue} ${ch.durationUnit}`}
                  </p>
                </div>

                {/* Amounts display */}
                <div className="flex items-baseline justify-between mt-5 pt-4 border-t border-slate-800/80">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-500 block">Saved so far</span>
                    <span className="text-xl font-bold font-mono text-emerald-400">
                      {currency}{saved.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-semibold text-slate-500 block">Target</span>
                    <span className="text-xl font-bold font-mono text-white">
                      {currency}{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                    <span className="text-slate-400">{savedCount} of {ch.items.length} saved</span>
                    <span className="text-emerald-400 font-mono">{pct}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(2, pct)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action link */}
              <div 
                onClick={() => onSelectGoal(ch.id)}
                className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs font-bold text-slate-400 group-hover:text-emerald-400 transition-colors cursor-pointer"
              >
                <span>View & Track Progress</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}

        {/* Create New Goal Card */}
        <button
          onClick={onOpenCreate}
          className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-all min-h-[260px] bg-slate-900/20 hover:bg-slate-900/40 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
            Create Another Goal
          </span>
          <span className="text-xs text-slate-400 max-w-[200px] mt-1">
            Vacation, Pocket Money, Tech upgrade, or Emergency reserve
          </span>
        </button>
      </div>
    </div>
  );
}
