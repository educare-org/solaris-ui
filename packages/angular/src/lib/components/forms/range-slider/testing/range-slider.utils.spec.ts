import {
  normalizeRangeValues,
  rangeFillBounds,
  thumbPercents,
} from '../functions/range-slider.utils';

describe('normalizeRangeValues', () => {
  it('orders crossing thumbs and never mutates the input', () => {
    const input = [80, 20];
    expect(normalizeRangeValues(input, 0, 100, 1, 0)).toEqual([20, 80]);
    expect(input).toEqual([80, 20]);
  });

  it('enforces the minimum step gap between thumbs', () => {
    expect(normalizeRangeValues([28, 25], 0, 100, 1, 10)).toEqual([25, 35]);
  });

  it('caps thumbs at five by default', () => {
    expect(
      normalizeRangeValues([90, 10, 50, 30, 70, 60, 40], 0, 100, 1, 0),
    ).toEqual([10, 30, 40, 50, 60]);
  });

  it('respects a custom maxThumbs cap', () => {
    expect(normalizeRangeValues([10, 20, 30], 0, 100, 1, 0, 2)).toEqual([
      10, 20,
    ]);
  });

  it('handles empty and single-value arrays', () => {
    expect(normalizeRangeValues([], 0, 100, 1, 0)).toEqual([]);
    expect(normalizeRangeValues([120], 0, 100, 1, 0)).toEqual([100]);
  });
});

describe('rangeFillBounds', () => {
  it('spans from the lowest to the highest thumb', () => {
    expect(rangeFillBounds([80, 20], 0, 100)).toEqual({ start: 20, end: 80 });
  });

  it('collapses to min when empty', () => {
    expect(rangeFillBounds([], 0, 100)).toEqual({ start: 0, end: 0 });
  });

  it('clamps thumbs outside the range', () => {
    expect(rangeFillBounds([-50, 250], 0, 100)).toEqual({
      start: 0,
      end: 100,
    });
  });
});

describe('thumbPercents', () => {
  it('maps each thumb to its track percent', () => {
    expect(thumbPercents([0, 50, 100], 0, 100)).toEqual([0, 50, 100]);
  });

  it('clamps out-of-range thumbs', () => {
    expect(thumbPercents([-20, 150], 0, 100)).toEqual([0, 100]);
  });

  it('handles empty arrays', () => {
    expect(thumbPercents([], 0, 100)).toEqual([]);
  });
});
