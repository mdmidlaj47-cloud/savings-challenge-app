import React from 'react';
import { CheckCircle2, Circle, Calendar, FileEdit, Sparkles } from 'lucide-react';

export default function InteractiveMatrix({
  challenge,
  onToggleItem,
  onOpenItemDetail
}) {
  const currency = challenge.currency || '₹';

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 pb-28 overflow-x-hidden">
      {/* Grid of Interactive Savings Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-4">
        {challenge.items.map((item, index) => {
          const isSaved = item.saved;

          return (
            <div
              key={item.id}
              className={`group relative rounded-xl sm:rounded-2xl border p-3 sm:p-4 transition-all duration-200 select-none flex flex-col justify-between min-h-[125px] sm:min-h-[135px] min-w-0 overflow-hidden ${
                isSaved
                  ? 'bg-gradient-to-b from-emerald-950/40 via-emerald-900/20 to-slate-900/60 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:border-emerald-400'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              {/* Top Row: Label & Note/Detail button */}
              <div className="flex items-center justify-between w-full">
                <span className={`text-[10px] sm:text-[11px] font-bold tracking-wide uppercase truncate mr-1 ${
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
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-all flex-shrink-0"
                >
                  <FileEdit className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>

              {/* Center Amount */}
              <div className="my-1.5 sm:my-2 min-w-0">
                <div className={`text-lg sm:text-2xl font-extrabold font-mono tracking-tight truncate transition-colors ${
                  isSaved ? 'text-emerald-300 drop-shadow-[0_0_10px_rgba(16,185,129,0.25)]' : 'text-white'
                }`}>
                  {currency}{item.amount.toLocaleString()}
                </div>

                {/* Due Date or Deposit Date */}
                <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-slate-500 font-medium mt-0.5 truncate">
                  <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-600 flex-shrink-0" />
                  <span className="truncate">
                    {isSaved && item.savedAt
                      ? `Banked ${item.savedAt}`
                      : item.dueDate || `Target ${index + 1}`}
                  </span>
                </div>

                {/* Note Indicator if present */}
                {item.note && (
                  <div className="text-[9px] sm:text-[10px] text-emerald-400/80 truncate mt-0.5 sm:mt-1 italic">
                    "{item.note}"
                  </div>
                )}
              </div>

              {/* Bottom Toggle Button */}
              <button
                type="button"
                onClick={() => onToggleItem(item.id)}
                className={`w-full py-1.5 px-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 sm:gap-1.5 transition-all active:scale-95 ${
                  isSaved
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700/60'
                }`}
              >
                {isSaved ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500 flex-shrink-0" />
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
