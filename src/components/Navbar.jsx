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
  Bell,
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
  onOpenNotifications,
  hasDueNotifications = false,
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
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#090D14]/90 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-15 sm:h-16 flex items-center justify-between gap-2">
        
        {/* Brand & Active Goal Selector */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-[0_0_12px_rgba(16,185,129,0.35)] flex items-center justify-center">
              <div className="w-full h-full bg-[#090D14] rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              </div>
            </div>
            <div className="hidden md:block">
              <span className="text-sm sm:text-base font-extrabold tracking-tight text-white block leading-none">
                Vault<span className="text-emerald-400">Craft</span>
              </span>
              <span className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase">
                Savings Engine
              </span>
            </div>
          </div>

          <div className="h-5 w-px bg-slate-800 hidden sm:block flex-shrink-0" />

          {/* Goal Selector Dropdown */}
          <div className="relative min-w-0">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 text-xs font-semibold text-slate-200 transition-all hover:border-slate-700 shadow-sm max-w-[150px] sm:max-w-[220px]"
            >
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              <div className="text-left min-w-0 flex-1">
                <span className="block font-bold text-white text-[11px] sm:text-xs truncate leading-tight">
                  {activeChallenge?.title || 'No Goal (Tap +)'}
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono block truncate">
                  {activeChallenge ? `${activeChallenge.currency}${activeChallenge.targetAmount?.toLocaleString()}` : '0 active'}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 flex-shrink-0 ml-0.5" />
            </button>

            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                <div className="absolute left-0 mt-2 w-72 bg-[#0F1522] border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center">
                    <span>Your Savings Goals</span>
                    <span className="text-slate-500 font-mono">{challenges.length}</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto px-1">
                    {challenges.map(ch => {
                      const isCurrent = ch.id === activeId;
                      const saved = ch.items.filter(it => it.saved).reduce((a, b) => a + b.amount, 0);
                      const pct = Math.round((saved / ch.targetAmount) * 100) || 0;
                      return (
                        <div
                          key={ch.id}
                          className={`w-full px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-colors my-0.5 group ${
                            isCurrent
                              ? 'bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20'
                              : 'text-slate-300 hover:bg-slate-800/60'
                          }`}
                        >
                          <button
                            onClick={() => {
                              onSelectGoal(ch.id);
                              setDropdownOpen(false);
                            }}
                            className="text-left flex-1 truncate pr-2"
                          >
                            <span className="block font-medium truncate text-white">{ch.title}</span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {ch.currency}{ch.targetAmount.toLocaleString()} • {pct}% saved
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteGoal(ch.id);
                            }}
                            title="Delete this goal"
                            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg opacity-80 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}

                    {challenges.length === 0 && (
                      <div className="p-3 text-center text-xs text-slate-500">
                        No goals yet.
                      </div>
                    )}
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
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            title="Savings Reminders & Notifications"
            className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-300 transition-colors"
          >
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300 hover:text-white" />
            {hasDueNotifications && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[#090D14] animate-pulse" />
            )}
          </button>

          {/* Palette / Theme Switcher */}
          <div className="relative">
            <button
              onClick={() => setThemeOpen(!themeOpen)}
              title="Change Theme Palette"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-300 transition-colors"
            >
              <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
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

          {/* Sound Toggle (Visible on desktop) */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Disable sound feedback' : 'Enable sound feedback'}
            className="hidden sm:flex w-9 h-9 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 items-center justify-center text-slate-300 transition-colors"
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
            className="flex items-center justify-center gap-1.5 w-8 h-8 sm:w-auto sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs font-extrabold tracking-wide transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">New Goal</span>
          </button>

          {/* Extra Actions Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-300 transition-colors"
            >
              <MoreVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-52 bg-[#0F1522] border border-slate-800 rounded-2xl shadow-2xl py-1.5 z-50 animate-in fade-in duration-100">
                  {/* Sound Toggle for Mobile */}
                  <button
                    onClick={() => {
                      onToggleSound();
                      setMenuOpen(false);
                    }}
                    className="w-full px-3.5 py-2.5 text-left text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2.5 sm:hidden"
                  >
                    {soundEnabled ? (
                      <>
                        <Volume2 className="w-4 h-4 text-emerald-400" />
                        <span>Sound: Enabled</span>
                      </>
                    ) : (
                      <>
                        <VolumeX className="w-4 h-4 text-slate-500" />
                        <span>Sound: Muted</span>
                      </>
                    )}
                  </button>

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

                  {activeChallenge && (
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
                  )}

                  {activeChallenge && (
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
