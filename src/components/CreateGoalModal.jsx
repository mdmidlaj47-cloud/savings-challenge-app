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
  ArrowRightLeft 
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
  const [targetAmount, setTargetAmount] = useState('20000');
  const [currency, setCurrency] = useState('₹');
  const [durationValue, setDurationValue] = useState('12');
  const [durationUnit, setDurationUnit] = useState('months'); // 'weeks', 'months', 'days'
  const [strategy, setStrategy] = useState('equal'); // 'equal', 'gamified_range', 'bubble_matrix', 'step_up'
  const [randomSeed, setRandomSeed] = useState(0);

  // Dual Period calculations
  const dualPeriod = useMemo(() => {
    return getDualPeriodInfo(durationValue, durationUnit, targetAmount, currency);
  }, [durationValue, durationUnit, targetAmount, currency]);

  // Dynamic preview calculation with randomizer support
  const preview = useMemo(() => {
    const target = Number(targetAmount) || 0;
    const periods = Number(durationValue) || 1;

    const sampleItems = generateChronologicalItems({
      targetAmount: target,
      periods: Math.min(periods, 12),
      durationUnit,
      strategy,
      premarkedCount: 0,
      randomSeed
    });

    return {
      dualPeriod,
      sampleItems,
      totalCount: periods
    };
  }, [targetAmount, durationValue, durationUnit, strategy, currency, randomSeed, dualPeriod]);

  if (!isOpen) return null;

  const handleShuffleRandom = () => {
    setRandomSeed(prev => prev + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!targetAmount || Number(targetAmount) <= 0) return;

    onCreateGoal({
      title: title || `${currency}${Number(targetAmount).toLocaleString()} ${durationValue} ${durationUnit} Plan`,
      category,
      targetAmount: Number(targetAmount),
      currency,
      durationValue: Number(durationValue),
      durationUnit,
      strategy,
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
              Set Your Target & Timeline
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
                placeholder="e.g. 20K in 12 Months, Emergency Fund"
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
                  min="50"
                  step="50"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full bg-[#182130] border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-sm font-bold font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Quick Target Preset Chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {['5000', '10000', '20000', '50000', '100000'].map(amt => (
              <button
                key={amt}
                type="button"
                onClick={() => setTargetAmount(amt)}
                className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition-colors ${
                  targetAmount === amt
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {currency}{Number(amt).toLocaleString()}
              </button>
            ))}
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
                  placeholder="e.g. 12"
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

            {/* Equivalent Rate Helper */}
            <div className="mt-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex items-center justify-between">
              <span className="text-slate-400 font-medium">Cadence Breakdown:</span>
              <span className="font-bold text-emerald-400 font-mono">
                {dualPeriod.rateComparison}
              </span>
            </div>
          </div>

          {/* Strategy Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Contribution Distribution
              </label>
              {strategy === 'gamified_range' && (
                <button
                  type="button"
                  onClick={handleShuffleRandom}
                  className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 px-2 py-0.5 rounded-md hover:bg-emerald-500/10 transition-colors"
                >
                  <Dices className="w-3.5 h-3.5" />
                  <span>Shuffle Amounts</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setStrategy('equal')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  strategy === 'equal'
                    ? 'border-emerald-500 bg-emerald-500/10 text-white'
                    : 'border-slate-800 bg-[#161F2E] text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-white mb-0.5">Equal Installments</div>
                <div className="text-[10px] text-slate-400">Fixed rate every {durationUnit.slice(0, -1)}</div>
              </button>

              <button
                type="button"
                onClick={() => setStrategy('gamified_range')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  strategy === 'gamified_range'
                    ? 'border-emerald-500 bg-emerald-500/10 text-white'
                    : 'border-slate-800 bg-[#161F2E] text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-white mb-0.5">Dynamic Random</div>
                <div className="text-[10px] text-slate-400">Randomized amounts to keep it fun</div>
              </button>

              <button
                type="button"
                onClick={() => setStrategy('bubble_matrix')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  strategy === 'bubble_matrix'
                    ? 'border-emerald-500 bg-emerald-500/10 text-white'
                    : 'border-slate-800 bg-[#161F2E] text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-white mb-0.5">Mosaic Matrix</div>
                <div className="text-[10px] text-slate-400">Clean denomination tiles</div>
              </button>

              <button
                type="button"
                onClick={() => setStrategy('step_up')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  strategy === 'step_up'
                    ? 'border-emerald-500 bg-emerald-500/10 text-white'
                    : 'border-slate-800 bg-[#161F2E] text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-white mb-0.5">Progressive Step</div>
                <div className="text-[10px] text-slate-400">Steps up over time</div>
              </button>
            </div>
          </div>

          {/* Live Preview Sample */}
          {strategy === 'gamified_range' && preview.sampleItems.length > 0 && (
            <div className="p-3 rounded-2xl bg-[#090D14] border border-slate-800">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-2">
                <span>Sample Randomized Installments:</span>
                <button
                  type="button"
                  onClick={handleShuffleRandom}
                  className="text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <Dices className="w-3 h-3" /> Re-roll
                </button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                {preview.sampleItems.slice(0, 6).map(it => (
                  <div key={it.id} className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
                    <span className="text-[9px] text-slate-500 block truncate">{it.label}</span>
                    <span className="text-xs font-mono font-bold text-white">{currency}{it.amount}</span>
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
