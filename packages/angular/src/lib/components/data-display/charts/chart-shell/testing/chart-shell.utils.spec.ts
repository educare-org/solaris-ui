import { describe, expect, it } from 'vitest';

import {
  isChartDisplayMode,
  isChartPeriod,
  isChartView,
} from '../model/chart-shell.utils';

describe('Solaris chart shell utils', () => {
  it('identifies chart views', () => {
    expect(isChartView('line')).toBe(true);
    expect(isChartView('bar')).toBe(true);
    expect(isChartView('pie')).toBe(true);
    expect(isChartView('radar')).toBe(false);
    expect(isChartView(undefined)).toBe(false);
  });

  it('identifies chart periods', () => {
    for (const period of ['day', 'week', 'month', 'quarter', 'year', 'all']) {
      expect(isChartPeriod(period)).toBe(true);
    }
    expect(isChartPeriod('never')).toBe(false);
    expect(isChartPeriod(undefined)).toBe(false);
  });

  it('identifies display modes', () => {
    expect(isChartDisplayMode('timeline')).toBe(true);
    expect(isChartDisplayMode('list')).toBe(true);
    expect(isChartDisplayMode('grid')).toBe(false);
    expect(isChartDisplayMode(undefined)).toBe(false);
  });
});
