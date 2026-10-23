import { describe, expect, it } from 'vitest';

import {
  addSolarisIntervalDuration,
  isChartDisplayMode,
  isChartPeriod,
  isChartView,
  isSolarisIntervalDate,
  matchChartPeriodForRange,
  resolveChartIntervalEnd,
  resolvePeriodPresetRange,
} from '../model/chart-shell.utils';

describe('Solaris chart shell utils', () => {
  it('identifies chart views', () => {
    expect(isChartView('line')).toBe(true);
    expect(isChartView('bar')).toBe(true);
    expect(isChartView('pie')).toBe(true);
    expect(isChartView('heatmap')).toBe(true);
    expect(isChartView('radar')).toBe(true);
    expect(isChartView('scatter')).toBe(false);
    expect(isChartView(undefined)).toBe(false);
  });

  it('identifies chart periods', () => {
    for (const period of [
      'day',
      'week',
      'month',
      'quarter',
      'year',
      'all',
      'custom',
    ]) {
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

  it('adds interval durations to ISO dates', () => {
    expect(addSolarisIntervalDuration('2026-04-28', { days: 6 })).toBe(
      '2026-05-04',
    );
    expect(addSolarisIntervalDuration('2026-04-28', { days: 0 })).toBe(
      '2026-04-28',
    );
    expect(addSolarisIntervalDuration('2026-01-31', { months: 1 })).toBe(
      '2026-03-03',
    );
    expect(addSolarisIntervalDuration('2026-05-04', { years: 1 })).toBe(
      '2027-05-04',
    );
    expect(addSolarisIntervalDuration('not-a-date', { days: 6 })).toBeNull();
    expect(addSolarisIntervalDuration('2026-02-30', { days: 1 })).toBeNull();
  });

  it('validates interval dates', () => {
    expect(isSolarisIntervalDate('2026-04-28')).toBe(true);
    expect(isSolarisIntervalDate(null)).toBe(false);
    expect(isSolarisIntervalDate('04/28/2026')).toBe(false);
  });

  it('resolves the period end from the start', () => {
    expect(
      resolveChartIntervalEnd('2026-04-28', {
        value: 'week',
        fixedDuration: { days: 6 },
      }),
    ).toBe('2026-05-04');
    expect(resolveChartIntervalEnd(null, { value: 'all' })).toBeNull();
    expect(resolveChartIntervalEnd('2026-04-28', undefined)).toBeNull();
    expect(resolveChartIntervalEnd('2026-04-28', { value: 'all' })).toBeNull();
  });

  it('resolves preset ranges from an anchor date', () => {
    expect(
      resolvePeriodPresetRange(
        { value: 'week', fixedDuration: { days: 6 } },
        '2026-04-28',
      ),
    ).toEqual({ start: '2026-04-28', end: '2026-05-04' });
    expect(resolvePeriodPresetRange({ value: 'year' }, '2026-04-28')).toEqual({
      start: '2026-01-01',
      end: '2026-12-31',
    });
    expect(resolvePeriodPresetRange({ value: 'all' }, '2026-04-28')).toBeNull();
    expect(
      resolvePeriodPresetRange(
        { value: 'week', fixedDuration: { days: 6 } },
        'not-a-date',
      ),
    ).toBeNull();
    expect(resolvePeriodPresetRange(undefined, '2026-04-28')).toBeNull();
  });

  it('matches applied ranges back to fixed periods', () => {
    const options = [
      { value: 'day', fixedDuration: { days: 0 } },
      { value: 'week', fixedDuration: { days: 6 } },
      { value: 'all' },
    ] as const;
    expect(matchChartPeriodForRange('2026-04-28', '2026-05-04', options)).toBe(
      'week',
    );
    expect(matchChartPeriodForRange('2026-04-28', '2026-04-28', options)).toBe(
      'day',
    );
    expect(
      matchChartPeriodForRange('2026-04-28', '2026-05-10', options),
    ).toBeNull();
    expect(matchChartPeriodForRange(null, '2026-05-04', options)).toBeNull();
    expect(matchChartPeriodForRange('2026-04-28', null, options)).toBeNull();
  });
});
