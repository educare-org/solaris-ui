import { SOLARIS_SLIDER_PAGE_STEP_FACTOR } from '../model/slider.defaults';

function orderedBounds(min: number, max: number): [number, number] {
  return min <= max ? [min, max] : [max, min];
}

function decimalPlaces(step: number): number {
  const text = String(step);
  const dot = text.indexOf('.');
  return dot === -1 ? 0 : Math.min(text.length - dot - 1, 12);
}

export function clampToRange(value: number, min: number, max: number): number {
  const [lo, hi] = orderedBounds(min, max);
  if (value <= lo) {
    return lo;
  }
  if (value >= hi) {
    return hi;
  }
  return value;
}

export function snapToStep(value: number, min: number, step: number): number {
  if (!(step > 0) || !Number.isFinite(value) || !Number.isFinite(min)) {
    return value;
  }
  const snapped = min + Math.round((value - min) / step) * step;
  return Number(snapped.toFixed(decimalPlaces(step)));
}

export function percentOf(value: number, min: number, max: number): number {
  const [lo, hi] = orderedBounds(min, max);
  if (!(hi > lo)) {
    return 0;
  }
  return clampToRange(((value - lo) / (hi - lo)) * 100, 0, 100);
}

export function valueFromPercent(
  percent: number,
  min: number,
  max: number,
): number {
  const [lo, hi] = orderedBounds(min, max);
  if (!(hi > lo) || !Number.isFinite(percent)) {
    return lo;
  }
  return lo + (clampToRange(percent, 0, 100) / 100) * (hi - lo);
}

export function tickPositions(
  min: number,
  max: number,
  tickStep: number,
): number[] {
  const [lo, hi] = orderedBounds(min, max);
  if (!(tickStep > 0) || !Number.isFinite(tickStep)) {
    return [];
  }
  if (!(hi > lo)) {
    return [lo];
  }
  const places = decimalPlaces(tickStep);
  const positions: number[] = [];
  for (
    let cursor = lo;
    cursor < hi;
    cursor = Number((cursor + tickStep).toFixed(places))
  ) {
    positions.push(cursor);
  }
  positions.push(hi);
  return positions;
}

export function orderValues(values: number[]): number[] {
  return [...values].sort((a, b) => a - b);
}

export function enforceMinStepsBetweenThumbs(
  values: number[],
  min: number,
  max: number,
  step: number,
  minStepsBetweenThumbs: number,
): number[] {
  const [lo, hi] = orderedBounds(min, max);
  const gapSteps = Math.max(0, Math.floor(minStepsBetweenThumbs));
  const gap = gapSteps === 0 || !(step > 0) ? 0 : gapSteps * step;
  const ordered = orderValues(values).map((value) =>
    snapToStep(clampToRange(value, lo, hi), lo, step),
  );
  const result: number[] = [];
  for (const value of ordered) {
    const floor = result.length === 0 ? lo : result[result.length - 1] + gap;
    result.push(clampToRange(Math.max(value, floor), lo, hi));
  }
  return result;
}

export function defaultPageStep(
  step: number,
  min: number,
  max: number,
): number {
  const [lo, hi] = orderedBounds(min, max);
  if (!(step > 0) || !Number.isFinite(step)) {
    return 0;
  }
  return Math.min(SOLARIS_SLIDER_PAGE_STEP_FACTOR * step, hi - lo);
}
