import { describe, expect, it } from 'vitest';

import {
  SOLARIS_CHART_PALETTE,
  resolveChartSeriesColor,
  solarisChartColorVar,
  solarisChartSoftVar,
} from '../model/chart-palette';

describe('Solaris chart palette', () => {
  it('exposes a fixed categorical order without duplicates', () => {
    expect(SOLARIS_CHART_PALETTE).toHaveLength(8);
    expect(new Set(SOLARIS_CHART_PALETTE).size).toBe(
      SOLARIS_CHART_PALETTE.length,
    );
  });

  it('resolves token variables instead of raw colors', () => {
    expect(solarisChartColorVar('primary')).toBe(
      'var(--solaris-primary-solid)',
    );
    expect(solarisChartSoftVar('danger')).toBe('var(--solaris-danger-soft)');
  });

  it('maps warning to the foreground token for light-theme contrast', () => {
    expect(solarisChartColorVar('warning')).toBe(
      'var(--solaris-warning-foreground)',
    );
    expect(resolveChartSeriesColor(4)).toBe(
      'var(--solaris-warning-foreground)',
    );
  });

  it('cycles positionally and honors explicit overrides', () => {
    expect(resolveChartSeriesColor(0)).toBe('var(--solaris-primary-solid)');
    expect(resolveChartSeriesColor(SOLARIS_CHART_PALETTE.length)).toBe(
      resolveChartSeriesColor(0),
    );
    expect(resolveChartSeriesColor(-1)).toBe(
      `var(--solaris-${SOLARIS_CHART_PALETTE[SOLARIS_CHART_PALETTE.length - 1]}-solid)`,
    );
    expect(resolveChartSeriesColor(3, 'success')).toBe(
      'var(--solaris-success-solid)',
    );
  });

  it('falls back to the first entry for non-finite indexes', () => {
    expect(resolveChartSeriesColor(Number.NaN)).toBe(
      resolveChartSeriesColor(0),
    );
  });
});
