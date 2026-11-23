import React, { useState, useMemo } from 'react';
import { 
  X, 
  Sparkles, 
  Target, 
  Calculator, 
  Calendar, 
  DollarSign, 
  Dices,
  Layers, 
  ArrowRightLeft,
  Sliders,
  Check,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { CURRENCY_SYMBOLS, generateChronologicalItems } from '../utils/challengeGenerator';
import { getDualPeriodInfo } from '../utils/periodConverter';

const GOAL_CATEGORIES = [
  'Pocket Savings',
  'Wealth Building',
  'Emergency Fund',
  'Travel & Vacation',
  'Tech & Gadgets',
  'House Downpayment',
  'General Savings'
];

export default function CreateGoalModal({ isOpen, onClose, onCreateGoal, currentTheme }) {
  // Mode selection: 'random_pocket' (Option 1) vs 'fixed_amount' (Option 2)
  const [savingsMode, setSavingsMode] = useState('random_pocket');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Pocket Savings');
  const [currency, setCurrency] = useState('₹');
  const [durationValue, setDurationValue] = useState('20');
  const [durationUnit, setDurationUnit] = useState('weeks'); // 'weeks', 'months', 'days'

  // Option 1 (Random limits) state
  const [minLimit, setMinLimit] = useState('10');
  const [maxLimit, setMaxLimit] = useState('30');
  const [targetAmount, setTargetAmount] = useState('400');
  const [randomSeed, setRandomSeed] = useState(0);

  // Option 2 (Fixed specific amount) state
  const [fixedAmountPerPeriod, setFixedAmountPerPeriod] = useState('500');

  // Dual Period calculations
  const dualPeriod = useMemo(() => {
    return getDualPeriodInfo(durationValue, durationUnit, targetAmount, currency);
  }, [durationValue, durationUnit, targetAmount, currency]);

  // Apply Quick Preset 1: 10 to 30 Random
  const applyPreset10to30 = () => {
    setSavingsMode('random_pocket');
    setTitle('Pocket Savings (₹10–₹30)');
    setCategory('Pocket Savings');
    setCurrency('₹');
    setDurationValue('20');
    setDurationUnit('weeks');
    setMinLimit('10');
    setMaxLimit('30');
    setTargetAmount('400');
  };

  // Apply Quick Preset 2: Fixed Specific Amount
  const applyPresetFixed = () => {
    setSavingsMode('fixed_amount');
    setTitle('Fixed Monthly Goal');
    setCategory('Wealth Building');
    setCurrency('₹');
    setDurationValue('12');
    setDurationUnit('months');
    setFixedAmountPerPeriod('1000');
    setTargetAmount('12000');
  };

  // Auto-sync target amount when in fixed amount mode
  const handleFixedAmountChange = (val) => {
    setFixedAmountPerPeriod(val);
    const amt = Number(val) || 0;
    const periods = Number(durationValue) || 1;
    setTargetAmount((amt * periods).toString());
  };

  const handleDurationChange = (val) => {
    setDurationValue(val);
    if (savingsMode === 'fixed_amount') {
      const amt = Number(fixedAmountPerPeriod) || 0;
      const periods = Number(val) || 1;
      setTargetAmount((amt * periods).toString());
    }
  };

  // Capacity calculation for random limits
  const capacity = useMemo(() => {
    const periods = Number(durationValue) || 1;
    const min = Math.max(1, Number(minLimit) || 10);
    const max = Math.max(min, Number(maxLimit) || 30);
    const minTotal = periods * min;
    const maxTotal = periods * max;
    const currentTarget = Number(targetAmount) || 0;

    const isBelowMin = currentTarget < minTotal;
    const isAboveMax = currentTarget > maxTotal;

    return {
      min,
      max,
      minTotal,
      maxTotal,
      isBelowMin,
      isAboveMax,
      suggestedTarget: Math.round(periods * ((min + max) / 2)),
      suggestedWeeks: currentTarget > 0 ? Math.ceil(currentTarget / ((min + max) / 2)) : periods
    };
  }, [durationValue, minLimit, maxLimit, targetAmount]);

  // Dynamic preview calculation
  const preview = useMemo(() => {
    const target = Number(targetAmount) || 0;
    const periods = Number(durationValue) || 1;

    const customLimits = savingsMode === 'random_pocket' ? {
      enabled: true,
      min: Number(minLimit) || 10,
      max: Number(maxLimit) || 30,
    } : null;

    const sampleItems = generateChronologicalItems({
      targetAmount: target,
      periods: Math.min(periods, 12),
      durationUnit,
      strategy: savingsMode === 'random_pocket' ? 'gamified_range' : 'equal',
      customLimits,
      premarkedCount: 0,
      randomSeed
    });

    return {
      dualPeriod,
      sampleItems,
      totalCount: periods
    };
  }, [targetAmount, durationValue, durationUnit, savingsMode, currency, randomSeed, dualPeriod, minLimit, maxLimit]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalTarget = Number(targetAmount) || (Number(fixedAmountPerPeriod) * Number(durationValue));
    if (finalTarget <= 0) return;

    const customLimits = savingsMode === 'random_pocket' ? {
      enabled: true,
      min: Number(minLimit) || 10,
      max: Number(maxLimit) || 30,
    } : null;

    onCreateGoal({
      title: title || (savingsMode === 'random_pocket' ? `Pocket Savings (${currency}${minLimit}–${currency}${maxLimit})` : `Fixed ${currency}${finalTarget.toLocaleString()} Goal`),
      category,
      savingsMode,
      targetAmount: finalTarget,
      currency,
      durationValue: Number(durationValue),
      durationUnit,
      strategy: savingsMode === 'random_pocket' ? 'gamified_range' : 'equal',
      customLimits,
      randomSeed
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[#0F1522] border border-slate-700/80 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 sm:pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[10px] sm:text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Create Savings Goal
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
              Choose How You Want to Save
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1-Click Fast Presets */}
        <div className="my-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            1-Click Starter Presets:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={applyPreset10to30}
              className={`text-xs px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold transition-all ${
                savingsMode === 'random_pocket' && minLimit === '10' && maxLimit === '30'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
              }`}
            >
              <Dices className="w-3.5 h-3.5 text-emerald-400" />
              <span>🎲 ₹10–₹30 Pocket Change (20 Wks)</span>
            </button>

            <button
              type="button"
              onClick={applyPresetFixed}
              className={`text-xs px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold transition-all ${
                savingsMode === 'fixed_amount'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>🎯 Fixed ₹1,000/mo (12 Mos)</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* THE TWO CORE OPTIONS: Random vs Fixed */}
          <div>
            <label className="text-xs font-bold text-white block mb-2">
              Select Your Savings Preference:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              
              {/* Option 1: Random Pocket Amounts (e.g. ₹10 to ₹30) */}
              <button
                type="button"
                onClick={() => {
                  setSavingsMode('random_pocket');
                  setCategory('Pocket Savings');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                  savingsMode === 'random_pocket'
                    ? 'border-emerald-500 bg-gradient-to-b from-emerald-950/40 to-slate-900 text-white shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                    : 'border-slate-800 bg-[#141b26]/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Dices className="w-4 h-4 text-emerald-400" />
                    <span className="font-extrabold text-sm text-white">1. Random Amounts</span>
                  </div>
                  {savingsMode === 'random_pocket' && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Random micro-amounts (like <strong className="text-emerald-400">{currency}10, {currency}20, {currency}30</strong>) to keep saving fun & flexible without feeling the pinch.
                </p>
                <div className="mt-2.5 inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                  Preset: {currency}10 to {currency}30
                </div>
              </button>

              {/* Option 2: Fixed Specific Amount */}
              <button
                type="button"
                onClick={() => {
                  setSavingsMode('fixed_amount');
                  setCategory('Wealth Building');
                  const amt = Number(fixedAmountPerPeriod) || 500;
                  const periods = Number(durationValue) || 12;
                  setTargetAmount((amt * periods).toString());
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                  savingsMode === 'fixed_amount'
                    ? 'border-emerald-500 bg-gradient-to-b from-emerald-950/40 to-slate-900 text-white shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                    : 'border-slate-800 bg-[#141b26]/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-cyan-400" />
                    <span className="font-extrabold text-sm text-white">2. Fixed Specific Amount</span>
                  </div>
                  {savingsMode === 'fixed_amount' && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  )}
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Save a fixed, predictable amount each period (e.g., <strong className="text-cyan-400">{currency}50/week</strong> or <strong className="text-cyan-400">{currency}1,000/month</strong>).
                </p>
                <div className="mt-2.5 inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-mono">
                  Exact Equal Installments
                </div>
              </button>

            </div>
          </div>

          {/* DYNAMIC CONTROLS BASED ON SELECTED OPTION */}
          {savingsMode === 'random_pocket' ? (
            /* Option 1 Controls: Min & Max Limits (10 to 30) */
            <div className="p-4 rounded-2xl bg-[#111723] border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                  Set Random Bounds ({currency})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setMinLimit('10');
                    setMaxLimit('30');
                  }}
                  className="text-[10px] text-emerald-400 font-bold hover:underline"
                >
                  Reset to {currency}10–{currency}30
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Minimum Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold text-xs">
                      {currency}
                    </span>
                    <input
                      type="number"
                      min="1"
                      value={minLimit}
                      onChange={(e) => setMinLimit(e.target.value)}
                      className="w-full bg-[#182130] border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs font-bold font-mono text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Maximum Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold text-xs">
                      {currency}
                    </span>
                    <input
                      type="number"
                      min={minLimit}
                      value={maxLimit}
                      onChange={(e) => setMaxLimit(e.target.value)}
                      className="w-full bg-[#182130] border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs font-bold font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Target & Capacity Notice */}
              <div className="pt-2 border-t border-slate-800 text-xs">
                <div className="flex justify-between items-center text-[11px] text-slate-400 mb-1">
                  <span>Target with this range:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    Capacity: {currency}{capacity.minTotal} – {currency}{capacity.maxTotal}
                  </span>
                </div>
                {(capacity.isBelowMin || capacity.isAboveMax) && (
                  <div className="flex gap-2 mt-1.5">
                    <button
                      type="button"
                      onClick={() => setTargetAmount(capacity.suggestedTarget.toString())}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-[10px] hover:bg-emerald-500/30"
                    >
                      Fit Target ({currency}{capacity.suggestedTarget})
                    </button>
                    <button
                      type="button"
                      onClick={() => setDurationValue(capacity.suggestedWeeks.toString())}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-white font-bold text-[10px] hover:bg-slate-700"
                    >
                      Fit Weeks ({capacity.suggestedWeeks} {durationUnit})
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Option 2 Controls: Fixed Specific Amount */
            <div className="p-4 rounded-2xl bg-[#111723] border border-cyan-500/30 space-y-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                Fixed Contribution Amount
              </span>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  How much will you save every {durationUnit.slice(0, -1)}?
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold text-sm">
                    {currency}
                  </span>
                  <input
                    type="number"
                    min="1"
                    required
                    value={fixedAmountPerPeriod}
                    onChange={(e) => handleFixedAmountChange(e.target.value)}
                    className="w-full bg-[#182130] border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-sm font-bold font-mono text-cyan-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Quick Amount Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400">Quick amounts:</span>
                {['50', '100', '250', '500', '1000', '2000'].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleFixedAmountChange(amt)}
                    className={`text-[10px] px-2 py-1 rounded-lg font-mono font-bold border transition-colors ${
                      fixedAmountPerPeriod === amt
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {currency}{amt}
                  </button>
                ))}
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex justify-between items-center font-mono">
                <span className="text-slate-400 text-[11px]">Total Resulting Goal:</span>
                <span className="font-bold text-white text-sm">
                  {currency}{(Number(fixedAmountPerPeriod) * Number(durationValue)).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* Timeframe & Cadence */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Duration & Timeframe
              </label>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 font-mono">
                <ArrowRightLeft className="w-3 h-3" />
                {dualPeriod.secondaryLabel}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="number"
                  required
                  min="1"
                  max="100"
                  value={durationValue}
                  onChange={(e) => handleDurationChange(e.target.value)}
                  placeholder="e.g. 20"
                  className="w-full bg-[#182130] border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <select
                  value={durationUnit}
                  onChange={(e) => setDurationUnit(e.target.value)}
                  className="w-full bg-[#182130] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                >
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                  <option value="days">Days</option>
                </select>
              </div>
            </div>
          </div>

          {/* Goal Name Input (Optional / Custom) */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Goal Title (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={savingsMode === 'random_pocket' ? `Pocket Savings (${currency}${minLimit}–${currency}${maxLimit})` : `Fixed ${currency}${targetAmount} Plan`}
              className="w-full bg-[#182130] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Live Sample Preview */}
          {preview.sampleItems.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-[#090D14] border border-slate-800">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-2">
                <span>
                  {savingsMode === 'random_pocket' ? `Sample Random Values (${currency}${minLimit}–${currency}${maxLimit}):` : 'Sample Fixed Installments:'}
                </span>
                {savingsMode === 'random_pocket' && (
                  <button
                    type="button"
                    onClick={() => setRandomSeed(prev => prev + 1)}
                    className="text-emerald-400 hover:underline flex items-center gap-1 font-bold"
                  >
                    <Dices className="w-3.5 h-3.5" /> Shuffle
                  </button>
                )}
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                {preview.sampleItems.slice(0, 12).map(it => (
                  <div key={it.id} className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
                    <span className="text-[9px] text-slate-500 block truncate">{it.label}</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">{currency}{it.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="pt-2 flex justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all active:scale-95"
            >
              {savingsMode === 'random_pocket' ? `Start Random (${currency}${minLimit}–${currency}${maxLimit})` : `Start Fixed (${currency}${fixedAmountPerPeriod}/${durationUnit.slice(0, -1)})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
