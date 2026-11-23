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
  Check
} from 'lucide-react';
import { CURRENCY_SYMBOLS, generateChronologicalItems } from '../utils/challengeGenerator';
import { getDualPeriodInfo } from '../utils/periodConverter';

const GOAL_CATEGORIES = [
  'Wealth Building',
  'Emergency Fund',
  'Travel & Vacation',
  'Tech & Gadgets',
  'House Downpayment',
  'Vehicle / Auto',
  'General Savings'
];

export default function CreateGoalModal({ isOpen, onClose, onCreateGoal, currentTheme }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Wealth Building');
  const [targetAmount, setTargetAmount] = useState('1000');
  const [currency, setCurrency] = useState('₹');
  const [durationValue, setDurationValue] = useState('20');
  const [durationUnit, setDurationUnit] = useState('weeks'); // 'weeks', 'months', 'days'
  const [strategy, setStrategy] = useState('gamified_range'); // 'equal', 'gamified_range', 'bubble_matrix', 'step_up'
  const [randomSeed, setRandomSeed] = useState(0);

  // Pocket Money Limits state (e.g. ₹10 to ₹30)
  const [usePocketLimits, setUsePocketLimits] = useState(true);
  const [minLimit, setMinLimit] = useState('10');
  const [maxLimit, setMaxLimit] = useState('30');

  // Dual Period calculations
  const dualPeriod = useMemo(() => {
    return getDualPeriodInfo(durationValue, durationUnit, targetAmount, currency);
  }, [durationValue, durationUnit, targetAmount, currency]);

  // Handle Quick Pocket Limit Presets
  const applyLimitPreset = (min, max) => {
    setMinLimit(min.toString());
    setMaxLimit(max.toString());
    setUsePocketLimits(true);
    setStrategy('gamified_range');

    // Auto balance target or duration to make sense
    const periods = Number(durationValue) || 20;
    const avg = (min + max) / 2;
    setTargetAmount(Math.round(periods * avg).toString());
  };

  // Capacity calculation when pocket limits are on
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

  // Dynamic preview calculation with randomizer & pocket limits support
  const preview = useMemo(() => {
    const target = Number(targetAmount) || 0;
    const periods = Number(durationValue) || 1;

    const customLimits = usePocketLimits ? {
      enabled: true,
      min: Number(minLimit) || 10,
      max: Number(maxLimit) || 30,
    } : null;

    const sampleItems = generateChronologicalItems({
      targetAmount: target,
      periods: Math.min(periods, 16),
      durationUnit,
      strategy,
      customLimits,
      premarkedCount: 0,
      randomSeed
    });

    return {
      dualPeriod,
      sampleItems,
      totalCount: periods
    };
  }, [targetAmount, durationValue, durationUnit, strategy, currency, randomSeed, dualPeriod, usePocketLimits, minLimit, maxLimit]);

  if (!isOpen) return null;

  const handleShuffleRandom = () => {
    setRandomSeed(prev => prev + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!targetAmount || Number(targetAmount) <= 0) return;

    const customLimits = usePocketLimits ? {
      enabled: true,
      min: Number(minLimit) || 10,
      max: Number(maxLimit) || 30,
    } : null;

    onCreateGoal({
      title: title || `${currency}${Number(targetAmount).toLocaleString()} ${durationValue} ${durationUnit} Plan`,
      category,
      targetAmount: Number(targetAmount),
      currency,
      durationValue: Number(durationValue),
      durationUnit,
      strategy,
      customLimits,
      randomSeed
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[#0F1522] border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                New Savings Plan
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-white mt-0.5">
              Set Your Target & Limits
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Goal Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Goal Name
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Pocket Money Goal, 20K Plan"
                className="w-full bg-[#182130] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#182130] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-medium"
              >
                {GOAL_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Pocket Limits (Min & Max Rupee Cap, e.g. 10 to 30) */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-[#121927] border border-emerald-500/30 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Pocket Savings Limit (Min & Max Cap)
                </span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={usePocketLimits}
                  onChange={(e) => setUsePocketLimits(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-0 bg-slate-800 border-slate-700 w-4 h-4"
                />
                <span className="text-xs text-emerald-400 font-semibold">Active</span>
              </label>
            </div>

            <p className="text-[11px] text-slate-400 mb-3">
              Limit each contribution to fit your spare cash (e.g. minimum {currency}10 and maximum {currency}30). Installments will be randomly picked within this limit.
            </p>

            {usePocketLimits && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Min per {durationUnit.slice(0, -1)}
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
                      Max per {durationUnit.slice(0, -1)}
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

                {/* Quick Pocket Limit Preset Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-medium">Quick Presets:</span>
                  <button
                    type="button"
                    onClick={() => applyLimitPreset(10, 30)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 hover:border-emerald-400 text-slate-200 font-mono font-bold transition-colors"
                  >
                    {currency}10–{currency}30 (Pocket Change)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyLimitPreset(20, 50)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 hover:border-emerald-400 text-slate-200 font-mono font-bold transition-colors"
                  >
                    {currency}20–{currency}50
                  </button>
                  <button
                    type="button"
                    onClick={() => applyLimitPreset(50, 100)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 hover:border-emerald-400 text-slate-200 font-mono font-bold transition-colors"
                  >
                    {currency}50–{currency}100
                  </button>
                </div>

                {/* Capacity warning or Auto-balancer */}
                {(capacity.isBelowMin || capacity.isAboveMax) && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                    <span className="text-amber-300 font-bold block mb-1">
                      Target Capacity Notice:
                    </span>
                    <span className="text-slate-300 text-[11px] block">
                      With {durationValue} {durationUnit} of {currency}{capacity.min}–{currency}{capacity.max}, you can save between {currency}{capacity.minTotal.toLocaleString()} and {currency}{capacity.maxTotal.toLocaleString()}.
                    </span>
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setTargetAmount(capacity.suggestedTarget.toString())}
                        className="px-2.5 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-black font-bold text-[10px] transition-colors"
                      >
                        Fit Target ({currency}{capacity.suggestedTarget.toLocaleString()})
                      </button>
                      <button
                        type="button"
                        onClick={() => setDurationValue(capacity.suggestedWeeks.toString())}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-[10px] transition-colors"
                      >
                        Fit Weeks ({capacity.suggestedWeeks} {durationUnit})
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Target Amount & Currency */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-[#182130] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-bold"
              >
                {CURRENCY_SYMBOLS.map(c => (
                  <option key={c.code} value={c.symbol}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Target Savings Amount
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono">
                  {currency}
                </span>
                <input
                  type="number"
                  required
                  min="10"
                  step="10"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full bg-[#182130] border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-sm font-bold font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Duration & Dual Period Conversion */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Duration & Timeframe
              </label>
              {/* Dual Period Conversion Pill */}
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 font-mono">
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
                  onChange={(e) => setDurationValue(e.target.value)}
                  placeholder="e.g. 20"
                  className="w-full bg-[#182130] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <select
                  value={durationUnit}
                  onChange={(e) => setDurationUnit(e.target.value)}
                  className="w-full bg-[#182130] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-semibold"
                >
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                  <option value="days">Days</option>
                </select>
              </div>
            </div>
          </div>

          {/* Live Preview Sample */}
          {preview.sampleItems.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-[#090D14] border border-slate-800">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-2">
                <span>Sample Installments ({usePocketLimits ? `${currency}${minLimit}–${currency}${maxLimit}` : 'Generated'}):</span>
                <button
                  type="button"
                  onClick={handleShuffleRandom}
                  className="text-emerald-400 hover:underline flex items-center gap-1 font-bold"
                >
                  <Dices className="w-3.5 h-3.5" /> Shuffle Amounts
                </button>
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
          <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all active:scale-95"
            >
              Create My Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
