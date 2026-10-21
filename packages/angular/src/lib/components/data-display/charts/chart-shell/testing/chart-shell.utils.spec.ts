import { describe, expect, it } from 'vitest';

import { isChartPeriod, isChartView } from '../model/chart-shell.utils';

describe('Solaris chart shell utils', () => {
  it('identifies chart views', () => {
    expect(isChartView('line')).toBe(true);
    expect(isChartView('bar')).toBe(true);
    expect(isChartView('pie')).toBe(true);
    expect(isChartView('radar')).toBe(false);
    expect(isChartView(undefined)).toBe(false);
  });

  it('identifies chart periods', () => {
    for (const period of ['1D', '7D', '1M', '3M', 'YTD', 'all']) {
      expect(isChartPeriod(period)).toBe(true);
    }
    expect(isChartPeriod('never')).toBe(false);
    expect(isChartPeriod(undefined)).toBe(false);
  });
});
