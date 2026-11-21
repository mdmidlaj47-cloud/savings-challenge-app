// Dual Period & Rate Conversion Utilities

export function getDualPeriodInfo(durationValue, durationUnit, targetAmount = 0, currency = '₹') {
  const val = Number(durationValue) || 1;
  const target = Number(targetAmount) || 0;

  let primaryLabel = '';
  let secondaryLabel = '';
  let primaryRate = '';
  let secondaryRate = '';

  if (durationUnit === 'weeks') {
    const approxMonths = (val / 4.333).toFixed(1).replace(/\.0$/, '');
    primaryLabel = `${val} Weeks`;
    secondaryLabel = `approx. ${approxMonths} Months`;

    if (target > 0) {
      const weeklyRate = Math.round(target / val);
      const monthlyRate = Math.round(weeklyRate * 4.333);
      primaryRate = `${currency}${weeklyRate.toLocaleString()} / week`;
      secondaryRate = `approx. ${currency}${monthlyRate.toLocaleString()} / month`;
    }
  } else if (durationUnit === 'months') {
    const approxWeeks = Math.round(val * 4.333);
    primaryLabel = `${val} Months`;
    secondaryLabel = `approx. ${approxWeeks} Weeks`;

    if (target > 0) {
      const monthlyRate = Math.round(target / val);
      const weeklyRate = Math.round(monthlyRate / 4.333);
      primaryRate = `${currency}${monthlyRate.toLocaleString()} / month`;
      secondaryRate = `approx. ${currency}${weeklyRate.toLocaleString()} / week`;
    }
  } else {
    // Days
    const approxWeeks = (val / 7).toFixed(1).replace(/\.0$/, '');
    const approxMonths = (val / 30.4).toFixed(1).replace(/\.0$/, '');
    primaryLabel = `${val} Days`;
    secondaryLabel = `${approxWeeks} wks • ${approxMonths} mos`;

    if (target > 0) {
      const dailyRate = Math.round(target / val);
      const weeklyRate = Math.round(dailyRate * 7);
      primaryRate = `${currency}${dailyRate.toLocaleString()} / day`;
      secondaryRate = `approx. ${currency}${weeklyRate.toLocaleString()} / week`;
    }
  }

  return {
    val,
    unit: durationUnit,
    primaryLabel,
    secondaryLabel,
    badgeText: `${primaryLabel} (${secondaryLabel})`,
    primaryRate,
    secondaryRate,
    rateComparison: primaryRate && secondaryRate ? `${primaryRate} • ${secondaryRate}` : primaryRate
  };
}
