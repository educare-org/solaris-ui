import { describe, expect, it } from 'vitest';

import {
  groupSmallChartSlices,
  isChartSeriesEmpty,
  normalizeStacked100,
  resolveChartDomain,
  resolveChartTicks,
  visibleChartSeries,
} from '../model/chart-scale.utils';

describe('Solaris chart scale utilities', () => {
  it('resolves domains with padding and zero inclusion', () => {
    expect(resolveChartDomain([10, 20], { paddingRatio: 0 })).toEqual({
      min: 10,
      max: 20,
    });
    expect(
      resolveChartDomain([10, 20], { includeZero: true, paddingRatio: 0 }),
    ).toEqual({ min: 0, max: 20 });
    expect(
      resolveChartDomain([-20, -10], { includeZero: true, paddingRatio: 0 }),
    ).toEqual({ min: -20, max: 0 });
  });

  it('ignores null, undefined and NaN values without mutating the input', () => {
    const values = [5, null, undefined, Number.NaN, 15];
    expect(resolveChartDomain(values, { paddingRatio: 0 })).toEqual({
      min: 5,
      max: 15,
    });
    expect(values).toEqual([5, null, undefined, Number.NaN, 15]);
  });

  it('resolves empty input to a defined unit domain', () => {
    expect(resolveChartDomain([])).toEqual({ min: 0, max: 1 });
    expect(resolveChartDomain([null, undefined])).toEqual({ min: 0, max: 1 });
  });

  it('expands equal values so the axis stays renderable', () => {
    const domain = resolveChartDomain([7, 7]);
    expect(domain.min).toBeLessThan(7);
    expect(domain.max).toBeGreaterThan(7);
    const zero = resolveChartDomain([0, 0]);
    expect(zero.min).toBeLessThan(0);
    expect(zero.max).toBeGreaterThan(0);
  });

  it('applies padding proportionally to the data range', () => {
    expect(resolveChartDomain([0, 100])).toEqual({ min: -5, max: 105 });
  });

  it('resolves performantly over 10k points', () => {
    const values = Array.from({ length: 10_000 }, (_, i) => Math.sin(i) * 100);
    const start = performance.now();
    const domain = resolveChartDomain(values);
    expect(performance.now() - start).toBeLessThan(50);
    expect(domain.min).toBeLessThan(-90);
    expect(domain.max).toBeGreaterThan(90);
  });

  it('resolves nice ascending ticks within the requested count', () => {
    const ticks = resolveChartTicks(0, 100, 5);
    expect(ticks).toEqual([0, 25, 50, 75, 100]);
    expect(ticks.length).toBeLessThanOrEqual(6);
  });

  it('resolves ticks for negative and fractional ranges', () => {
    const negative = resolveChartTicks(-37, -3, 4);
    expect([...negative].sort((a, b) => a - b)).toEqual(negative);
    expect(negative.length).toBeGreaterThanOrEqual(2);

    const fractional = resolveChartTicks(0, 1, 5);
    expect(fractional[0]).toBe(0);
    expect(fractional[fractional.length - 1]).toBeLessThanOrEqual(1);
  });

  it('expands equal bounds instead of returning a single tick', () => {
    const ticks = resolveChartTicks(5, 5, 5);
    expect(ticks.length).toBeGreaterThanOrEqual(2);
    expect(Math.min(...ticks)).toBeLessThan(5);
    expect(Math.max(...ticks)).toBeGreaterThan(5);
  });

  it('normalizes stacks to 100 per category', () => {
    const result = normalizeStacked100([
      [30, 0, null],
      [70, 0, 10],
    ]);
    expect(result[0][0]).toBeCloseTo(30);
    expect(result[1][0]).toBeCloseTo(70);
    expect(result[0][0] + result[1][0]).toBeCloseTo(100);
    expect(result[0][1]).toBe(0);
    expect(result[1][1]).toBe(0);
  });

  it('treats negative and non-finite stack entries as zero', () => {
    const result = normalizeStacked100([
      [50, -20],
      [50, Number.NaN],
    ]);
    expect(result[0][0] + result[1][0]).toBeCloseTo(100);
    expect(result[0][1]).toBe(0);
    expect(result[1][1]).toBe(0);
  });

  it('does not mutate stack inputs of uneven length', () => {
    const stacks = [[1, 3], [1]];
    const result = normalizeStacked100(stacks);
    expect(stacks).toEqual([[1, 3], [1]]);
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveLength(2);
    expect(result[0][0] + result[1][0]).toBeCloseTo(100);
  });

  it('groups small slices preserving order and appending others last', () => {
    const slices = [
      { id: 'a', label: 'A', value: 70 },
      { id: 'b', label: 'B', value: 2 },
      { id: 'c', label: 'C', value: 25 },
      { id: 'd', label: 'D', value: 3 },
    ];
    const result = groupSmallChartSlices(slices, 0.05, 'Outros');
    expect(result).toEqual([
      { id: 'a', label: 'A', value: 70 },
      { id: 'c', label: 'C', value: 25 },
      { id: 'others', label: 'Outros', value: 5 },
    ]);
    expect(slices).toHaveLength(4);
  });

  it('returns grouped input untouched when nothing is small or total is zero', () => {
    const slices = [
      { id: 'a', label: 'A', value: 50 },
      { id: 'b', label: 'B', value: 50 },
    ];
    expect(groupSmallChartSlices(slices, 0.05, 'Outros')).toEqual(slices);
    expect(groupSmallChartSlices([], 0.05, 'Outros')).toEqual([]);
    expect(
      groupSmallChartSlices(
        [{ id: 'a', label: 'A', value: 0 }],
        0.05,
        'Outros',
      ),
    ).toEqual([{ id: 'a', label: 'A', value: 0 }]);
  });

  it('detects empty series and filters hidden ones', () => {
    const series = [
      { id: 'a', label: 'A', points: [{ x: 1, y: null }] },
      {
        id: 'b',
        label: 'B',
        hidden: true,
        points: [{ x: 1, y: 10 }],
      },
    ];
    expect(isChartSeriesEmpty(series)).toBe(false);
    expect(isChartSeriesEmpty([])).toBe(true);
    expect(isChartSeriesEmpty([series[0]])).toBe(true);
    expect(visibleChartSeries(series).map((entry) => entry.id)).toEqual(['a']);
  });
});
