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

export const INITIAL_PRESETS = [
  {
    id: 'goal-20k-starter',
    title: 'My 20K Savings Goal',
    category: 'Wealth Building',
    targetAmount: 20000,
    currency: '₹',
    durationValue: 12,
    durationUnit: 'months',
    strategy: 'equal',
    subtitle: '12 Months (~52 Weeks) • ₹1,667 / month (~₹385 / week)',
    startDate: new Date().toISOString().split('T')[0],
    finishDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: generateChronologicalItems({
      targetAmount: 20000,
      periods: 12,
      durationUnit: 'months',
      strategy: 'equal',
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

  // Determine rounding unit (10, 5, or 1)
  const range = max - min;
  const stepUnit = range >= 20 ? 10 : range >= 10 ? 5 : 1;

  // Round safeTarget to be compatible with stepUnit
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
      // Pick random step between minAdd and maxAdd
      const rawDelta = Math.random() * (maxAddForThisSlot - minAddForThisSlot) + minAddForThisSlot;
      let step = Math.round(rawDelta / stepUnit) * stepUnit;
      step = Math.max(minAddForThisSlot, Math.min(maxAddForThisSlot, step));
      result[i] += step;
      remaining -= step;
    }
  }

  // Shuffle the result so higher/lower values are scattered naturally
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
  strategy,
  customLimits = null, // { enabled: true, min: 10, max: 30 }
  premarkedCount = 0,
  randomSeed = 0
}) {
  const items = [];
  const baseDate = new Date();
  const unitLabel = durationUnit === 'weeks' ? 'Week' : durationUnit === 'months' ? 'Month' : 'Day';

  // Check if Pocket Limits (min/max cap) is enabled
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
  } else if (strategy === 'step_up') {
    const totalWeights = (periods * (periods + 1)) / 2;
    let accumulated = 0;

    for (let i = 1; i <= periods; i++) {
      let amt = Math.max(10, Math.round((i / totalWeights) * targetAmount));
      if (i === periods) {
        amt = targetAmount - accumulated;
      }
      accumulated += amt;
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
  } else if (strategy === 'bubble_matrix') {
    const count = periods;
    const denoms = [10, 20, 25, 30, 50, 75, 100, 150, 200, 250, 500];
    const avg = targetAmount / count;
    let accumulated = 0;

    for (let i = 1; i <= count; i++) {
      if (i === count) {
        const amt = Math.max(5, targetAmount - accumulated);
        items.push({
          id: `tile-${i}`,
          label: `Tile ${i}`,
          amount: amt,
          dueDate: computeDueDate(baseDate, i - 1, durationUnit).toISOString().split('T')[0],
          saved: false,
          savedAt: null,
          note: ''
        });
        break;
      }

      const factor = 0.5 + (Math.random() * 1.0);
      const targetVal = avg * factor;
      const closest = denoms.reduce((prev, curr) => 
        Math.abs(curr - targetVal) < Math.abs(prev - targetVal) ? curr : prev
      );
      accumulated += closest;

      items.push({
        id: `tile-${i}`,
        label: `Tile ${i}`,
        amount: closest,
        dueDate: computeDueDate(baseDate, i - 1, durationUnit).toISOString().split('T')[0],
        saved: false,
        savedAt: null,
        note: ''
      });
    }

    // Exact balance pass
    const currentSum = items.reduce((acc, it) => acc + it.amount, 0);
    const diff = targetAmount - currentSum;
    if (items.length > 0) {
      items[items.length - 1].amount += diff;
    }
  } else {
    // Dynamic Random Range with realistic rounding
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

/**
 * Generate a new custom goal with dual period info & randomizer support
 */
export function generateCustomChallenge({
  title,
  category = 'General Savings',
  targetAmount,
  currency = '₹',
  durationValue = 12,
  durationUnit = 'months',
  strategy = 'equal',
  customLimits = null, // { enabled: true, min: 10, max: 30 }
  randomSeed = 0
}) {
  const target = Math.max(10, Math.round(Number(targetAmount) || 1000));
  const periods = Math.max(1, Math.min(100, Math.round(Number(durationValue) || 12)));

  const items = generateChronologicalItems({
    targetAmount: target,
    periods,
    durationUnit,
    strategy,
    customLimits,
    premarkedCount: 0,
    randomSeed
  });

  const periodInfo = getDualPeriodInfo(periods, durationUnit, target, currency);
  let subtitle = '';

  if (customLimits && customLimits.enabled) {
    subtitle = `${periodInfo.badgeText} • Pocket Cap ${currency}${customLimits.min}–${currency}${customLimits.max} per ${durationUnit.slice(0, -1)}`;
  } else if (strategy === 'equal') {
    subtitle = `${periodInfo.badgeText} • ${periodInfo.rateComparison}`;
  } else {
    const amounts = items.map(it => it.amount);
    const minAmt = Math.min(...amounts);
    const maxAmt = Math.max(...amounts);
    subtitle = `${periodInfo.badgeText} • Dynamic ${currency}${minAmt.toLocaleString()}–${currency}${maxAmt.toLocaleString()} (${periodInfo.secondaryRate})`;
  }

  const finalDate = items[items.length - 1]?.dueDate || '';

  return {
    id: `goal-${Date.now()}`,
    title: title || `${currency}${target.toLocaleString()} Savings Plan`,
    category,
    targetAmount: target,
    currency,
    durationValue: periods,
    durationUnit,
    strategy,
    customLimits,
    subtitle,
    startDate: new Date().toISOString().split('T')[0],
    finishDate: finalDate,
    items,
  };
}
