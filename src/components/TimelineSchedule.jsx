import React from 'react';
import { CheckCircle2, Clock, Calendar, AlertCircle, FileEdit } from 'lucide-react';

export default function TimelineSchedule({
  challenge,
  onToggleItem,
  onOpenItemDetail
}) {
  const currency = challenge.currency || '₹';
  const items = challenge.items || [];

  const completedItems = items.filter(it => it.saved);
  const pendingItems = items.filter(it => !it.saved);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-28">
      {/* Summary Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Timeline Schedule</h2>
          <p className="text-xs text-slate-400 mt-0.5">Chronological record of your scheduled contributions</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 block">Completion</span>
          <span className="text-base font-bold font-mono text-emerald-400">
            {completedItems.length} / {items.length} Completed
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Pending / Upcoming Section */}
        {pendingItems.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Upcoming Contributions ({pendingItems.length})</span>
            </h3>

            <div className="space-y-2.5">
              {pendingItems.map((item, idx) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    idx === 0
                      ? 'bg-gradient-to-r from-emerald-950/20 via-slate-900 to-slate-900 border-emerald-500/40 shadow-sm'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <button
                      onClick={() => onToggleItem(item.id)}
                      className="w-9 h-9 rounded-xl border border-slate-700 bg-slate-800/80 hover:border-emerald-400 hover:bg-emerald-500/10 flex items-center justify-center text-slate-400 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4 opacity-40 hover:opacity-100 hover:text-emerald-400" />
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{item.label}</span>
                        {idx === 0 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Next Due
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>Due: {item.dueDate || 'Scheduled'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold font-mono text-white">
                      {currency}{item.amount.toLocaleString()}
                    </span>
                    <button
                      onClick={() => onOpenItemDetail(item)}
                      className="p-2 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      <FileEdit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Section */}
        {completedItems.length > 0 && (
          <div className="pt-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Completed Deposits ({completedItems.length})</span>
            </h3>

            <div className="space-y-2.5">
              {completedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-emerald-950/15 border border-emerald-500/20"
                >
                  <div className="flex items-center gap-3.5">
                    <button
                      onClick={() => onToggleItem(item.id)}
                      className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <div>
                      <span className="text-sm font-bold text-slate-200">{item.label}</span>
                      <div className="text-xs text-emerald-400/80 flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3 h-3 text-emerald-500" />
                        <span>Deposited {item.savedAt || 'Completed'}</span>
                        {item.note && <span className="text-slate-400">• "{item.note}"</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold font-mono text-emerald-400">
                      {currency}{item.amount.toLocaleString()}
                    </span>
                    <button
                      onClick={() => onOpenItemDetail(item)}
                      className="p-2 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      <FileEdit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
