import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Trash2, 
  ChevronDown, 
  MoreVertical,
  Download,
  Palette,
  Sparkles
} from 'lucide-react';
import { THEMES } from '../utils/themes';

export default function Navbar({
  challenges,
  activeId,
  onSelectGoal,
  soundEnabled,
  onToggleSound,
  themeId,
  onSelectTheme,
  currentTheme,
  onOpenCreate,
  onResetGoal,
  onDeleteGoal,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);

  const activeChallenge = challenges.find(c => c.id === activeId) || challenges[0];

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(challenges, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `vaultcraft_goals_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#090D14]/85 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Active Goal Selector */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-[0_0_15px_rgba(16,185,129,0.35)] flex items-center justify-center">
              <div className="w-full h-full bg-[#090D14] rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-base font-extrabold tracking-tight text-white block leading-none">
                Vault<span className="text-emerald-400">Craft</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                Smart Savings Engine
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden sm:block" />

          {/* Goal Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 text-xs font-semibold text-slate-200 transition-all hover:border-slate-700 shadow-sm"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="text-left">
                <span className="block font-bold text-white max-w-[130px] sm:max-w-[200px] truncate leading-tight">
                  {activeChallenge?.title || 'No Goal Selected'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {activeChallenge ? `${activeChallenge.currency}${activeChallenge.targetAmount?.toLocaleString()}` : ''}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                <div className="absolute left-0 mt-2 w-72 bg-[#0F1522] border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Your Savings Portfolios
                  </div>
                  <div className="max-h-64 overflow-y-auto px-1">
                    {challenges.map(ch => {
                      const isCurrent = ch.id === activeId;
                      const saved = ch.items.filter(it => it.saved).reduce((a, b) => a + b.amount, 0);
                      const pct = Math.round((saved / ch.targetAmount) * 100) || 0;
                      return (
                        <button
                          key={ch.id}
                          onClick={() => {
                            onSelectGoal(ch.id);
                            setDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-2.5 rounded-xl text-left text-xs flex items-center justify-between transition-colors my-0.5 ${
                            isCurrent
                              ? 'bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20'
                              : 'text-slate-300 hover:bg-slate-800/60'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <span className="block font-medium truncate text-white">{ch.title}</span>
                            <span className="text-[10px] text-slate-400">{ch.category || 'Goal'} • {pct}% saved</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-slate-300">
                            {ch.currency}{ch.targetAmount.toLocaleString()}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-2 border-t border-slate-800/80 mt-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenCreate();
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-xs font-bold transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Create New Goal
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Palette / Theme Switcher */}
          <div className="relative">
            <button
              onClick={() => setThemeOpen(!themeOpen)}
              title="Change Theme Palette"
              className="w-9 h-9 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-300 transition-colors"
            >
              <Palette className="w-4 h-4 text-emerald-400" />
            </button>

            {themeOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setThemeOpen(false)} />
                <div className="absolute right-0 mt-2 w-52 bg-[#0F1522] border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in duration-100">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Color Palettes
                  </div>
                  {Object.values(THEMES).map(th => (
                    <button
                      key={th.id}
                      onClick={() => {
                        onSelectTheme(th.id);
                        setThemeOpen(false);
                      }}
                      className={`w-full px-2.5 py-2 rounded-xl text-xs flex items-center justify-between text-left my-0.5 transition-colors ${
                        themeId === th.id
                          ? 'bg-slate-800 text-white font-bold'
                          : 'text-slate-300 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3.5 h-3.5 rounded-full shadow-sm"
                          style={{ backgroundColor: th.accentColor }}
                        />
                        <span>{th.name}</span>
                      </div>
                      {themeId === th.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Disable sound feedback' : 'Enable sound feedback'}
            className="w-9 h-9 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-300 transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* New Goal Primary Button */}
          <button
            onClick={onOpenCreate}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs font-extrabold tracking-wide transition-all shadow-[0_0_18px_rgba(16,185,129,0.3)] active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">New Goal</span>
          </button>

          {/* Extra Actions Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-9 h-9 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-300 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-52 bg-[#0F1522] border border-slate-800 rounded-2xl shadow-2xl py-1.5 z-50 animate-in fade-in duration-100">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleExport();
                    }}
                    className="w-full px-3.5 py-2.5 text-left text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2.5"
                  >
                    <Download className="w-4 h-4 text-slate-400" />
                    Export Backup (JSON)
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onResetGoal();
                    }}
                    className="w-full px-3.5 py-2.5 text-left text-xs text-amber-400 hover:bg-amber-400/10 flex items-center gap-2.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset Progress
                  </button>
                  {challenges.length > 1 && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onDeleteGoal(activeId);
                      }}
                      className="w-full px-3.5 py-2.5 text-left text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2.5"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Goal
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
