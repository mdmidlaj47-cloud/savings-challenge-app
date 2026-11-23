// VaultCraft - Goal Generation Engine & Presets
import { getDualPeriodInfo } from './periodConverter';

export const CURRENCY_SYMBOLS = [
  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  { code: 'AED', symbol: 'AED', label: 'AED' },
  { code: 'CAD', symbol: 'C$', label: 'CAD ($)' },
  { code: 'AUD', symbol: 'A$', label: 'AUD ($)' },
];

/**
 * Two core presets:
 * 1. Random Pocket Savings (₹10 to ₹30)
 * 2. Fixed Planned Amount (Fixed per month/week)
 */
export const INITIAL_PRESETS = [
  {
    id: 'preset-pocket-10-30',
    title: 'Pocket Savings (₹10–₹30)',
    category: 'Pocket Savings',
    savingsMode: 'random_pocket', // 'random_pocket' or 'fixed_amount'
    targetAmount: 400,
    currency: '₹',
    durationValue: 20,
    durationUnit: 'weeks',
    strategy: 'gamified_range',
    customLimits: { enabled: true, min: 10, max: 30 },
    subtitle: '20 Weeks (~4.6 Months) • Random ₹10–₹30 per week',
    startDate: new Date().toISOString().split('T')[0],
    finishDate: new Date(Date.now() + 140 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: generateChronologicalItems({
      targetAmount: 400,
      periods: 20,
      durationUnit: 'weeks',
      strategy: 'gamified_range',
      customLimits: { enabled: true, min: 10, max: 30 },
      premarkedCount: 0
    })
  },
  {
    id: 'preset-fixed-amount',
    title: 'Fixed Monthly Goal (₹1,000/mo)',
    category: 'Wealth Building',
    savingsMode: 'fixed_amount',
    targetAmount: 12000,
    currency: '₹',
    durationValue: 12,
    durationUnit: 'months',
    strategy: 'equal',
    customLimits: null,
    subtitle: '12 Months (~52 Weeks) • Fixed ₹1,000 / month (~₹231 / week)',
    startDate: new Date().toISOString().split('T')[0],
    finishDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: generateChronologicalItems({
      targetAmount: 12000,
      periods: 12,
      durationUnit: 'months',
      strategy: 'equal',
      customLimits: null,
      premarkedCount: 0
    })
  }
];

/**
 * Distribute an exact amount across N slots with strict [min, max] bounds
 */
function distributeWithBounds(target, periods, minBound, maxBound) {
  const min = Math.max(1, Math.round(minBound));
  const max = Math.max(min, Math.round(maxBound));
  let safeTarget = Math.max(periods * min, Math.min(periods * max, target));

  const range = max - min;
  const stepUnit = range >= 20 ? 10 : range >= 10 ? 5 : 1;

  safeTarget = Math.round(safeTarget / stepUnit) * stepUnit;
  if (safeTarget < periods * min) safeTarget = periods * min;
  if (safeTarget > periods * max) safeTarget = periods * max;

  let remaining = safeTarget - (periods * min);
  const result = new Array(periods).fill(min);

  for (let i = 0; i < periods; i++) {
    const slotsLeft = periods - 1 - i;
    if (slotsLeft === 0) {
      result[i] += remaining;
      break;
    }

    const maxAddForThisSlot = Math.min(max - min, remaining);
    const minAddForThisSlot = Math.max(0, remaining - (slotsLeft * (max - min)));

    if (maxAddForThisSlot <= minAddForThisSlot) {
      result[i] += minAddForThisSlot;
      remaining -= minAddForThisSlot;
    } else {
      const rawDelta = Math.random() * (maxAddForThisSlot - minAddForThisSlot) + minAddForThisSlot;
      let step = Math.round(rawDelta / stepUnit) * stepUnit;
      step = Math.max(minAddForThisSlot, Math.min(maxAddForThisSlot, step));
      result[i] += step;
      remaining -= step;
    }
  }

  // Shuffle result so values are scattered naturally
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export function generateChronologicalItems({
  targetAmount,
  periods,
  durationUnit,
  strategy = 'equal',
  customLimits = null,
  premarkedCount = 0,
  randomSeed = 0
}) {
  const items = [];
  const baseDate = new Date();
  const unitLabel = durationUnit === 'weeks' ? 'Week' : durationUnit === 'months' ? 'Month' : 'Day';

  // Mode 1: Random Pocket Limits (e.g. strictly between 10 and 30)
  if (customLimits && customLimits.enabled && customLimits.max > 0) {
    const minVal = Math.max(1, Number(customLimits.min) || 10);
    const maxVal = Math.max(minVal, Number(customLimits.max) || 30);
    const amounts = distributeWithBounds(targetAmount, periods, minVal, maxVal);

    for (let i = 1; i <= periods; i++) {
      const amt = amounts[i - 1] || minVal;
      const dueDate = computeDueDate(baseDate, i - 1, durationUnit);
      const isSaved = i <= premarkedCount;

      items.push({
        id: `item-${i}`,
        label: `${unitLabel} ${i}`,
        amount: amt,
        dueDate: dueDate.toISOString().split('T')[0],
        saved: isSaved,
        savedAt: isSaved ? dueDate.toISOString().split('T')[0] : null,
        note: ''
      });
    }

    return items;
  }

  // Mode 2: Fixed Specific / Equal Installments
  if (strategy === 'equal') {
    const baseAmount = Math.floor(targetAmount / periods);
    let remainder = targetAmount - (baseAmount * periods);

    for (let i = 1; i <= periods; i++) {
      let amt = baseAmount;
      if (remainder > 0) {
        amt += 1;
        remainder -= 1;
      }
      const dueDate = computeDueDate(baseDate, i - 1, durationUnit);
      const isSaved = i <= premarkedCount;

      items.push({
        id: `item-${i}`,
        label: `${unitLabel} ${i}`,
        amount: amt,
        dueDate: dueDate.toISOString().split('T')[0],
        saved: isSaved,
        savedAt: isSaved ? dueDate.toISOString().split('T')[0] : null,
        note: ''
      });
    }
  } else {
    // Dynamic random variance without specific bounds
    let remainingTarget = targetAmount;

    for (let i = 1; i <= periods; i++) {
      if (i === periods) {
        items.push({
          id: `item-${i}`,
          label: `${unitLabel} ${i}`,
          amount: Math.max(10, remainingTarget),
          dueDate: computeDueDate(baseDate, i - 1, durationUnit).toISOString().split('T')[0],
          saved: false,
          savedAt: null,
          note: ''
        });
        break;
      }

      const slotsLeft = periods - i;
      const slotBudget = remainingTarget / (slotsLeft + 1);
      const randomFactor = 0.4 + (Math.random() * 1.2);
      let chosen = Math.round((slotBudget * randomFactor) / 10) * 10;
      
      chosen = Math.min(remainingTarget - (slotsLeft * 10), Math.max(10, chosen));
      remainingTarget -= chosen;

      const dueDate = computeDueDate(baseDate, i - 1, durationUnit);

      items.push({
        id: `item-${i}`,
        label: `${unitLabel} ${i}`,
        amount: chosen,
        dueDate: dueDate.toISOString().split('T')[0],
        saved: false,
        savedAt: null,
        note: ''
      });
    }
  }

  return items;
}

function computeDueDate(startDate, offset, unit) {
  const d = new Date(startDate);
  if (unit === 'weeks') {
    d.setDate(d.getDate() + (offset * 7));
  } else if (unit === 'months') {
    d.setMonth(d.getMonth() + offset);
  } else {
    d.setDate(d.getDate() + offset);
  }
  return d;
}

export function generateCustomChallenge({
  title,
  category = 'General Savings',
  savingsMode = 'random_pocket', // 'random_pocket' or 'fixed_amount'
  targetAmount,
  currency = '₹',
  durationValue = 20,
  durationUnit = 'weeks',
  strategy = 'gamified_range',
  customLimits = null,
  randomSeed = 0
}) {
  const target = Math.max(10, Math.round(Number(targetAmount) || 500));
  const periods = Math.max(1, Math.min(100, Math.round(Number(durationValue) || 20)));

  const isRandom = savingsMode === 'random_pocket';
  const effectiveStrategy = isRandom ? 'gamified_range' : 'equal';
  const effectiveLimits = isRandom && customLimits ? customLimits : null;

  const items = generateChronologicalItems({
    targetAmount: target,
    periods,
    durationUnit,
    strategy: effectiveStrategy,
    customLimits: effectiveLimits,
    premarkedCount: 0,
    randomSeed
  });

  const periodInfo = getDualPeriodInfo(periods, durationUnit, target, currency);
  let subtitle = '';

  if (isRandom && effectiveLimits && effectiveLimits.enabled) {
    subtitle = `${periodInfo.badgeText} • Random ${currency}${effectiveLimits.min}–${currency}${effectiveLimits.max} per ${durationUnit.slice(0, -1)}`;
  } else if (!isRandom) {
    subtitle = `${periodInfo.badgeText} • Fixed ${currency}${items[0]?.amount?.toLocaleString()} per ${durationUnit.slice(0, -1)}`;
  } else {
    const amounts = items.map(it => it.amount);
    subtitle = `${periodInfo.badgeText} • Random ${currency}${Math.min(...amounts)}–${currency}${Math.max(...amounts)}`;
  }

  const finalDate = items[items.length - 1]?.dueDate || '';

  return {
    id: `goal-${Date.now()}`,
    title: title || (isRandom ? `Pocket Savings (${currency}${effectiveLimits?.min || 10}–${currency}${effectiveLimits?.max || 30})` : `Fixed ${currency}${target.toLocaleString()} Goal`),
    category,
    savingsMode,
    targetAmount: target,
    currency,
    durationValue: periods,
    durationUnit,
    strategy: effectiveStrategy,
    customLimits: effectiveLimits,
    subtitle,
    startDate: new Date().toISOString().split('T')[0],
    finishDate: finalDate,
    items,
  };
}
