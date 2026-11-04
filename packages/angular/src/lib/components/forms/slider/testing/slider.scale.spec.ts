import {
  distributionHeights,
  normalizeScale,
  ratioOf,
  resolveZoneColor,
  resolveZoneFade,
  validateTickValues,
  valueFromRatio,
} from '../functions/slider.scale';

describe('normalizeScale', () => {
  it('defaults unknown input to linear', () => {
    expect(normalizeScale(undefined)).toEqual({ kind: 'linear' });
    expect(normalizeScale(null)).toEqual({ kind: 'linear' });
    expect(normalizeScale('log')).toEqual({ kind: 'linear' });
    expect(normalizeScale({ kind: 'nope' })).toEqual({ kind: 'linear' });
  });

  it('fills log/pow defaults when params are invalid', () => {
    expect(normalizeScale({ kind: 'log' })).toEqual({ kind: 'log', base: 10 });
    expect(normalizeScale({ kind: 'log', base: 1 })).toEqual({
      kind: 'log',
      base: 10,
    });
    expect(normalizeScale({ kind: 'pow' })).toEqual({
      kind: 'pow',
      exponent: 2,
    });
    expect(normalizeScale({ kind: 'pow', exponent: 0 })).toEqual({
      kind: 'pow',
      exponent: 2,
    });
  });

  it('falls back to linear when custom mappers are missing', () => {
    expect(normalizeScale({ kind: 'custom' })).toEqual({ kind: 'linear' });
    expect(
      normalizeScale({
        kind: 'custom',
        toRatio: (v: number) => v,
        fromRatio: (r: number) => r,
      }).kind,
    ).toBe('custom');
  });
});

describe('linear/time parity', () => {
  it('matches v1 percents for linear and time', () => {
    expect(ratioOf(50, 0, 100, { kind: 'linear' })).toBe(0.5);
    expect(ratioOf(50, 0, 100, { kind: 'time' })).toBe(0.5);
    expect(ratioOf(-50, -50, 50, { kind: 'linear' })).toBe(0);
    expect(valueFromRatio(0.5, 0, 100, { kind: 'linear' })).toBe(50);
    expect(valueFromRatio(0.5, 0, 100, { kind: 'time' })).toBe(50);
  });

  it('returns bounds when min equals max', () => {
    expect(ratioOf(50, 50, 50, { kind: 'log', base: 10 })).toBe(0);
    expect(valueFromRatio(0.5, 50, 50, { kind: 'log', base: 10 })).toBe(50);
  });
});

describe('log scale', () => {
  it('spaces decades evenly', () => {
    const scale = { kind: 'log', base: 10 } as const;
    expect(ratioOf(1, 1, 1000, scale)).toBeCloseTo(0, 10);
    expect(ratioOf(10, 1, 1000, scale)).toBeCloseTo(1 / 3, 10);
    expect(ratioOf(100, 1, 1000, scale)).toBeCloseTo(2 / 3, 10);
    expect(ratioOf(1000, 1, 1000, scale)).toBeCloseTo(1, 10);
  });

  it('round-trips through the inverse', () => {
    const scale = { kind: 'log', base: 10 } as const;
    for (const value of [1, 5, 47, 999]) {
      expect(
        valueFromRatio(ratioOf(value, 1, 1000, scale), 1, 1000, scale),
      ).toBeCloseTo(value, 8);
    }
  });

  it('falls back to linear on non-positive domains', () => {
    expect(ratioOf(0, 0, 100, { kind: 'log', base: 10 })).toBe(0);
    expect(ratioOf(50, 0, 100, { kind: 'log', base: 10 })).toBe(0.5);
    expect(ratioOf(50, -10, 100, { kind: 'log', base: 10 })).toBeCloseTo(
      60 / 110,
      10,
    );
  });
});

describe('pow scale', () => {
  it('gives small values more room with exponent 2', () => {
    const scale = { kind: 'pow', exponent: 2 } as const;
    expect(ratioOf(25, 0, 100, scale)).toBeCloseTo(0.5, 10);
    expect(valueFromRatio(0.5, 0, 100, scale)).toBeCloseTo(25, 10);
  });

  it('falls back to linear for negatives; bad exponents use the default', () => {
    expect(ratioOf(50, -100, 100, { kind: 'pow', exponent: 2 })).toBe(0.75);
    expect(
      ratioOf(50, 0, 100, { kind: 'pow', exponent: 0 } as never),
    ).toBeCloseTo(Math.SQRT1_2, 10);
  });
});

describe('custom scale', () => {
  const inverted = {
    kind: 'custom',
    toRatio: (v: number) => 1 - v / 100,
    fromRatio: (r: number) => (1 - r) * 100,
  } as const;

  it('uses consumer mappers and round-trips', () => {
    expect(ratioOf(25, 0, 100, inverted)).toBeCloseTo(0.75, 10);
    expect(valueFromRatio(0.75, 0, 100, inverted)).toBeCloseTo(25, 10);
  });

  it('falls back to linear when mappers throw or go non-finite', () => {
    const throwing = {
      kind: 'custom',
      toRatio: () => {
        throw new Error('nope');
      },
      fromRatio: () => NaN,
    } as unknown as {
      kind: 'custom';
      toRatio: (v: number) => number;
      fromRatio: (r: number) => number;
    };
    expect(ratioOf(50, 0, 100, throwing)).toBe(0.5);
    expect(valueFromRatio(0.5, 0, 100, throwing)).toBe(50);
  });

  it('falls back to linear when a mapper returns NaN', () => {
    const nanMapper = {
      kind: 'custom',
      toRatio: () => NaN,
      fromRatio: (r: number) => r * 100,
    } as unknown as {
      kind: 'custom';
      toRatio: (v: number) => number;
      fromRatio: (r: number) => number;
    };
    expect(ratioOf(50, 0, 100, nanMapper)).toBe(0.5);
  });

  it('stays NaN-safe on NaN domains (negated comparisons)', () => {
    expect(ratioOf(50, Number.NaN, 100, { kind: 'linear' })).toBe(0);
    expect(ratioOf(50, Number.NaN, Number.NaN, { kind: 'log', base: 10 })).toBe(
      0,
    );
    expect(valueFromRatio(0.5, Number.NaN, 100, { kind: 'linear' })).toBe(100);
  });
});

describe('validateTickValues', () => {
  it('sorts, clamps, and dedupes', () => {
    expect(validateTickValues([100, 0, 50, 50, -5, 150], 0, 100)).toEqual([
      0, 50, 100,
    ]);
  });

  it('drops non-finite entries and non-arrays', () => {
    expect(validateTickValues([10, NaN, Infinity, 20], 0, 100)).toEqual([
      10, 20,
    ]);
    expect(validateTickValues(undefined, 0, 100)).toEqual([]);
    expect(validateTickValues('ticks', 0, 100)).toEqual([]);
  });
});

describe('resolveZoneColor', () => {
  it('returns the first matching zone else fallback', () => {
    const zones = [
      { from: 0, to: 33, color: 'success' },
      { from: 33, to: 66, color: 'warning' },
      { from: 66, to: 100, color: 'danger' },
    ] as const;
    expect(resolveZoneColor(10, zones, 'neutral')).toBe('success');
    expect(resolveZoneColor(90, zones, 'neutral')).toBe('danger');
    expect(resolveZoneColor(150, zones, 'neutral')).toBe('neutral');
  });

  it('ignores malformed zones and non-finite values', () => {
    expect(
      resolveZoneColor(NaN, [{ from: 0, to: 10, color: 'danger' }], 'neutral'),
    ).toBe('neutral');
    expect(resolveZoneColor(5, 'zones', 'neutral')).toBe('neutral');
    expect(resolveZoneColor(5, [], 'primary')).toBe('primary');
  });
});

describe('resolveZoneFade', () => {
  it('stages nothing on first run or unchanged zones', () => {
    expect(resolveZoneFade(null, 'danger', null)).toBeNull();
    expect(resolveZoneFade('danger', 'danger', 'a')).toBeNull();
  });

  it('stages the outgoing color and alternates the animation phase', () => {
    expect(resolveZoneFade('danger', 'success', null)).toEqual({
      zone: 'danger',
      phase: 'a',
    });
    expect(resolveZoneFade('success', 'danger', 'a')).toEqual({
      zone: 'success',
      phase: 'b',
    });
    expect(resolveZoneFade('warning', 'success', 'b')).toEqual({
      zone: 'warning',
      phase: 'a',
    });
  });
});

describe('distributionHeights', () => {
  it('normalizes by the peak', () => {
    expect(distributionHeights([0, 5, 10])).toEqual([0, 0.5, 1]);
  });

  it('maps empty, zero-max, and dirty input to zeros', () => {
    expect(distributionHeights([])).toEqual([]);
    expect(distributionHeights(undefined)).toEqual([]);
    expect(distributionHeights([0, 0, 0])).toEqual([0, 0, 0]);
    expect(distributionHeights([4, -3, NaN])).toEqual([1, 0, 0]);
  });
});
