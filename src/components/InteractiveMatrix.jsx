import React from 'react';
import { CheckCircle2, Circle, Calendar, FileEdit, Sparkles } from 'lucide-react';

export default function InteractiveMatrix({
  challenge,
  onToggleItem,
  onOpenItemDetail
}) {
  const currency = challenge.currency || '₹';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-28">
      {/* Grid of Interactive Savings Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {challenge.items.map((item, index) => {
          const isSaved = item.saved;

          return (
            <div
              key={item.id}
              className={`group relative rounded-2xl border p-4 transition-all duration-200 select-none flex flex-col justify-between min-h-[135px] ${
                isSaved
                  ? 'bg-gradient-to-b from-emerald-950/40 via-emerald-900/20 to-slate-900/60 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:border-emerald-400'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              {/* Top Row: Label & Note/Detail button */}
              <div className="flex items-center justify-between w-full">
                <span className={`text-[11px] font-bold tracking-wide uppercase ${
                  isSaved ? 'text-emerald-400' : 'text-slate-400'
                }`}>
                  {item.label}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenItemDetail(item);
                  }}
                  title="View or add notes"
                  className="w-6 h-6 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-all"
                >
                  <FileEdit className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Center Amount */}
              <div className="my-2">
                <div className={`text-xl sm:text-2xl font-extrabold font-mono tracking-tight transition-colors ${
                  isSaved ? 'text-emerald-300 drop-shadow-[0_0_10px_rgba(16,185,129,0.25)]' : 'text-white'
                }`}>
                  {currency}{item.amount.toLocaleString()}
                </div>

                {/* Due Date or Deposit Date */}
                <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium mt-0.5">
                  <Calendar className="w-3 h-3 text-slate-600" />
                  <span>
                    {isSaved && item.savedAt
                      ? `Banked ${item.savedAt}`
                      : item.dueDate || `Target ${index + 1}`}
                  </span>
                </div>

                {/* Note Indicator if present */}
                {item.note && (
                  <div className="text-[10px] text-emerald-400/80 truncate mt-1 italic">
                    "{item.note}"
                  </div>
                )}
              </div>

              {/* Bottom Toggle Button */}
              <button
                type="button"
                onClick={() => onToggleItem(item.id)}
                className={`w-full py-1.5 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                  isSaved
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700/60'
                }`}
              >
                {isSaved ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-3.5 h-3.5 text-slate-500" />
                    <span>Mark Saved</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
