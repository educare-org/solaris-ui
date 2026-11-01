import {
  clampToRange,
  defaultPageStep,
  enforceMinStepsBetweenThumbs,
  orderValues,
  percentOf,
  snapToStep,
  tickPositions,
  valueFromPercent,
} from '../functions/slider.utils';

describe('negative ranges', () => {
  it('anchors snapping, percents, round-trips, and ticks on a negative min', () => {
    expect(clampToRange(-60, -50, 50)).toBe(-50);
    expect(clampToRange(60, -50, 50)).toBe(50);
    expect(snapToStep(-23, -50, 10)).toBe(-20);
    expect(percentOf(-50, -50, 50)).toBe(0);
    expect(percentOf(0, -50, 50)).toBe(50);
    expect(percentOf(50, -50, 50)).toBe(100);
    expect(valueFromPercent(25, -50, 50)).toBe(-25);
    expect(tickPositions(-50, 50, 50)).toEqual([-50, 0, 50]);
  });
});

describe('clampToRange', () => {
  it('clamps below min and above max', () => {
    expect(clampToRange(-5, 0, 100)).toBe(0);
    expect(clampToRange(150, 0, 100)).toBe(100);
    expect(clampToRange(42, 0, 100)).toBe(42);
  });

  it('returns the bound when min equals max', () => {
    expect(clampToRange(-10, 50, 50)).toBe(50);
    expect(clampToRange(999, 50, 50)).toBe(50);
  });
});

describe('snapToStep', () => {
  it('snaps to the nearest step from min', () => {
    expect(snapToStep(7.6, 0, 5)).toBe(10);
    expect(snapToStep(7.4, 0, 5)).toBe(5);
    expect(snapToStep(12, 10, 5)).toBe(10);
  });

  it('avoids floating-point drift on fractional steps', () => {
    expect(snapToStep(0.30000000000000004, 0, 0.1)).toBe(0.3);
    expect(snapToStep(1.006, 0, 0.01)).toBe(1.01);
  });

  it('returns the value untouched when step is not positive', () => {
    expect(snapToStep(7.6, 0, 0)).toBe(7.6);
    expect(snapToStep(7.6, 0, -2)).toBe(7.6);
  });
});

describe('percentOf', () => {
  it('maps endpoints and midpoint', () => {
    expect(percentOf(0, 0, 100)).toBe(0);
    expect(percentOf(100, 0, 100)).toBe(100);
    expect(percentOf(50, 0, 100)).toBe(50);
  });

  it('clamps out-of-range values to 0..100', () => {
    expect(percentOf(-20, 0, 100)).toBe(0);
    expect(percentOf(250, 0, 100)).toBe(100);
  });

  it('returns 0 when min equals max', () => {
    expect(percentOf(50, 50, 50)).toBe(0);
  });
});

describe('valueFromPercent', () => {
  it('maps percent endpoints and midpoint', () => {
    expect(valueFromPercent(0, 0, 100)).toBe(0);
    expect(valueFromPercent(100, 0, 100)).toBe(100);
    expect(valueFromPercent(50, 0, 200)).toBe(100);
  });

  it('clamps percent outside 0..100 into range', () => {
    expect(valueFromPercent(-10, 0, 100)).toBe(0);
    expect(valueFromPercent(150, 0, 100)).toBe(100);
  });

  it('returns min when min equals max', () => {
    expect(valueFromPercent(50, 70, 70)).toBe(70);
  });
});

describe('tickPositions', () => {
  it('emits inclusive endpoints at tick intervals', () => {
    expect(tickPositions(0, 100, 25)).toEqual([0, 25, 50, 75, 100]);
  });

  it('always includes max even when off-grid', () => {
    expect(tickPositions(0, 10, 3)).toEqual([0, 3, 6, 9, 10]);
  });

  it('returns a single bound when min equals max', () => {
    expect(tickPositions(50, 50, 10)).toEqual([50]);
  });

  it('returns empty when tickStep is not positive', () => {
    expect(tickPositions(0, 100, 0)).toEqual([]);
    expect(tickPositions(0, 100, -5)).toEqual([]);
  });
});

describe('orderValues', () => {
  it('sorts ascending without mutating the input', () => {
    const input = [75, 25, 50];
    expect(orderValues(input)).toEqual([25, 50, 75]);
    expect(input).toEqual([75, 25, 50]);
  });

  it('handles empty and single-value arrays', () => {
    expect(orderValues([])).toEqual([]);
    expect(orderValues([42])).toEqual([42]);
  });
});

describe('enforceMinStepsBetweenThumbs', () => {
  it('orders crossing thumbs and keeps the gap only where violated', () => {
    expect(enforceMinStepsBetweenThumbs([80, 20], 0, 100, 1, 10)).toEqual([
      20, 80,
    ]);
    expect(enforceMinStepsBetweenThumbs([28, 25], 0, 100, 1, 10)).toEqual([
      25, 35,
    ]);
  });

  it('keeps ordered thumbs that already satisfy the gap', () => {
    expect(enforceMinStepsBetweenThumbs([10, 50, 90], 0, 100, 1, 5)).toEqual([
      10, 50, 90,
    ]);
  });

  it('clamps and snaps before enforcing the gap', () => {
    expect(enforceMinStepsBetweenThumbs([-20, 7.6], 0, 100, 5, 0)).toEqual([
      0, 10,
    ]);
  });

  it('stacks at max when the gap no longer fits', () => {
    expect(enforceMinStepsBetweenThumbs([95, 96, 97], 0, 100, 1, 10)).toEqual([
      95, 100, 100,
    ]);
  });

  it('treats non-positive minSteps as zero gap', () => {
    expect(enforceMinStepsBetweenThumbs([30, 30], 0, 100, 1, 0)).toEqual([
      30, 30,
    ]);
    expect(enforceMinStepsBetweenThumbs([30, 30], 0, 100, 1, -3)).toEqual([
      30, 30,
    ]);
  });

  it('handles empty arrays and five thumbs', () => {
    expect(enforceMinStepsBetweenThumbs([], 0, 100, 1, 5)).toEqual([]);
    expect(
      enforceMinStepsBetweenThumbs([90, 10, 50, 30, 70], 0, 100, 1, 10),
    ).toEqual([10, 30, 50, 70, 90]);
  });
});

describe('defaultPageStep', () => {
  it('defaults to ten steps', () => {
    expect(defaultPageStep(1, 0, 100)).toBe(10);
    expect(defaultPageStep(2, 0, 100)).toBe(20);
  });

  it('clamps to the range span', () => {
    expect(defaultPageStep(5, 0, 20)).toBe(20);
    expect(defaultPageStep(1, 50, 50)).toBe(0);
  });

  it('returns 0 when step is not positive', () => {
    expect(defaultPageStep(0, 0, 100)).toBe(0);
    expect(defaultPageStep(-1, 0, 100)).toBe(0);
  });
});
