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
 * Clean Starter Goals with ZERO pre-marked demo items
 * Every single installment starts as pending so the user starts fresh.
 */
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
      premarkedCount: 0 // NO demo items marked!
    })
  }
];

export function generateChronologicalItems({
  targetAmount,
  periods,
  durationUnit,
  strategy,
  premarkedCount = 0,
  randomSeed = 0
}) {
  const items = [];
  const baseDate = new Date();
  const unitLabel = durationUnit === 'weeks' ? 'Week' : durationUnit === 'months' ? 'Month' : 'Day';

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
    const denoms = [20, 30, 50, 75, 100, 150, 200, 250, 500];
    const avg = targetAmount / count;
    let accumulated = 0;

    for (let i = 1; i <= count; i++) {
      if (i === count) {
        const amt = Math.max(10, targetAmount - accumulated);
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

    // Exact balance
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
      // Random variance between 0.4x and 1.6x of the slot budget
      const randomFactor = 0.4 + (Math.random() * 1.2);
      let chosen = Math.round((slotBudget * randomFactor) / 10) * 10;
      
      // Ensure remaining slots have at least 10 each
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
  randomSeed = 0
}) {
  const target = Math.max(10, Math.round(Number(targetAmount) || 1000));
  const periods = Math.max(1, Math.min(100, Math.round(Number(durationValue) || 12)));

  const items = generateChronologicalItems({
    targetAmount: target,
    periods,
    durationUnit,
    strategy,
    premarkedCount: 0,
    randomSeed
  });

  const periodInfo = getDualPeriodInfo(periods, durationUnit, target, currency);
  let subtitle = '';

  if (strategy === 'equal') {
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
    subtitle,
    startDate: new Date().toISOString().split('T')[0],
    finishDate: finalDate,
    items,
  };
}
