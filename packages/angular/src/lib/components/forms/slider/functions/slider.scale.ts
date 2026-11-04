import type {
  SolarisSliderColor,
  SolarisSliderScale,
  SolarisSliderZone,
  SolarisZoneFadeFrame,
  SolarisZoneFadePhase,
} from '../model/slider.types';
import {
  SOLARIS_SLIDER_DEFAULT_LOG_BASE,
  SOLARIS_SLIDER_DEFAULT_POW_EXPONENT,
} from '../model/slider.defaults';
import { clampToRange, percentOf, valueFromPercent } from './slider.utils';

function orderedBounds(min: number, max: number): [number, number] {
  return min <= max ? [min, max] : [max, min];
}

function finiteOr(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

export function normalizeScale(scale: unknown): SolarisSliderScale {
  if (typeof scale !== 'object' || scale === null) {
    return { kind: 'linear' };
  }
  const candidate = scale as Partial<SolarisSliderScale> & { kind?: unknown };
  switch (candidate.kind) {
    case 'linear':
      return { kind: 'linear' };
    case 'time':
      return { kind: 'time' };
    case 'log': {
      const base = (candidate as { base?: unknown }).base;
      return {
        kind: 'log',
        base:
          typeof base === 'number' && Number.isFinite(base) && base > 1
            ? base
            : SOLARIS_SLIDER_DEFAULT_LOG_BASE,
      };
    }
    case 'pow': {
      const exponent = (candidate as { exponent?: unknown }).exponent;
      return {
        kind: 'pow',
        exponent:
          typeof exponent === 'number' &&
          Number.isFinite(exponent) &&
          exponent !== 0
            ? exponent
            : SOLARIS_SLIDER_DEFAULT_POW_EXPONENT,
      };
    }
    case 'custom': {
      const custom = candidate as {
        toRatio?: unknown;
        fromRatio?: unknown;
      };
      if (
        typeof custom.toRatio === 'function' &&
        typeof custom.fromRatio === 'function'
      ) {
        return {
          kind: 'custom',
          toRatio: custom.toRatio as (value: number) => number,
          fromRatio: custom.fromRatio as (ratio: number) => number,
        };
      }
      return { kind: 'linear' };
    }
    default:
      return { kind: 'linear' };
  }
}

function logRatio(value: number, lo: number, hi: number, base: number): number {
  if (!(lo > 0) || !(hi > lo) || !(base > 1) || !Number.isFinite(base)) {
    return percentOf(value, lo, hi) / 100;
  }
  const clamped = clampToRange(value, lo, hi);
  const denominator = Math.log(hi) - Math.log(lo);
  if (!Number.isFinite(denominator) || denominator === 0) {
    return percentOf(value, lo, hi) / 100;
  }
  const logBase = Math.log(base);
  const ratio =
    (Math.log(clamped) / logBase - Math.log(lo) / logBase) /
    (denominator / logBase);
  return clampToRange(finiteOr(ratio, 0), 0, 1);
}

function logValue(ratio: number, lo: number, hi: number): number {
  if (!(lo > 0) || !(hi > lo)) {
    return valueFromPercent(ratio * 100, lo, hi);
  }
  const clamped = clampToRange(ratio, 0, 1);
  return lo * Math.pow(hi / lo, clamped);
}

function powRatio(
  value: number,
  lo: number,
  hi: number,
  exponent: number,
): number {
  if (
    !(hi > lo) ||
    !Number.isFinite(exponent) ||
    exponent === 0 ||
    !(lo >= 0)
  ) {
    return percentOf(value, lo, hi) / 100;
  }
  const clamped = clampToRange(value, lo, hi);
  const span = hi - lo;
  const ratio = Math.pow((clamped - lo) / span, 1 / exponent);
  return clampToRange(finiteOr(ratio, 0), 0, 1);
}

function powValue(
  ratio: number,
  lo: number,
  hi: number,
  exponent: number,
): number {
  if (
    !(hi > lo) ||
    !Number.isFinite(exponent) ||
    exponent === 0 ||
    !(lo >= 0)
  ) {
    return valueFromPercent(ratio * 100, lo, hi);
  }
  const clamped = clampToRange(ratio, 0, 1);
  return lo + (hi - lo) * Math.pow(clamped, exponent);
}

function customRatio(
  value: number,
  lo: number,
  hi: number,
  scale: Extract<SolarisSliderScale, { kind: 'custom' }>,
): number {
  if (!(hi > lo)) {
    return 0;
  }
  try {
    const ratio = scale.toRatio(clampToRange(value, lo, hi));
    if (!Number.isFinite(ratio)) {
      return percentOf(value, lo, hi) / 100;
    }
    return clampToRange(ratio, 0, 1);
  } catch {
    return percentOf(value, lo, hi) / 100;
  }
}

function customValue(
  ratio: number,
  lo: number,
  hi: number,
  scale: Extract<SolarisSliderScale, { kind: 'custom' }>,
): number {
  if (!(hi > lo)) {
    return lo;
  }
  try {
    const value = scale.fromRatio(clampToRange(ratio, 0, 1));
    if (!Number.isFinite(value)) {
      return valueFromPercent(ratio * 100, lo, hi);
    }
    return clampToRange(value, lo, hi);
  } catch {
    return valueFromPercent(ratio * 100, lo, hi);
  }
}

export function ratioOf(
  value: number,
  min: number,
  max: number,
  scale: unknown,
): number {
  const [lo, hi] = orderedBounds(min, max);
  if (!(hi > lo) || !Number.isFinite(value)) {
    return 0;
  }
  const normalized = normalizeScale(scale);
  switch (normalized.kind) {
    case 'log':
      return logRatio(
        value,
        lo,
        hi,
        normalized.base ?? SOLARIS_SLIDER_DEFAULT_LOG_BASE,
      );
    case 'pow':
      return powRatio(
        value,
        lo,
        hi,
        normalized.exponent ?? SOLARIS_SLIDER_DEFAULT_POW_EXPONENT,
      );
    case 'time':
      return percentOf(value, lo, hi) / 100;
    case 'custom':
      return customRatio(value, lo, hi, normalized);
    default:
      return percentOf(value, lo, hi) / 100;
  }
}

export function valueFromRatio(
  ratio: number,
  min: number,
  max: number,
  scale: unknown,
): number {
  const [lo, hi] = orderedBounds(min, max);
  if (!(hi > lo) || !Number.isFinite(ratio)) {
    return lo;
  }
  const normalized = normalizeScale(scale);
  switch (normalized.kind) {
    case 'log':
      return logValue(ratio, lo, hi);
    case 'pow':
      return powValue(
        ratio,
        lo,
        hi,
        normalized.exponent ?? SOLARIS_SLIDER_DEFAULT_POW_EXPONENT,
      );
    case 'time':
      return valueFromPercent(clampToRange(ratio, 0, 1) * 100, lo, hi);
    case 'custom':
      return customValue(ratio, lo, hi, normalized);
    default:
      return valueFromPercent(clampToRange(ratio, 0, 1) * 100, lo, hi);
  }
}

export function validateTickValues(
  values: unknown,
  min: number,
  max: number,
): number[] {
  if (!Array.isArray(values)) {
    return [];
  }
  const [lo, hi] = orderedBounds(min, max);
  const seen = new Set<number>();
  const result: number[] = [];
  for (const candidate of values) {
    if (typeof candidate !== 'number' || !Number.isFinite(candidate)) {
      continue;
    }
    const clamped = clampToRange(candidate, lo, hi);
    if (!seen.has(clamped)) {
      seen.add(clamped);
      result.push(clamped);
    }
  }
  return result.sort((a, b) => a - b);
}

export function resolveZoneColor(
  value: number,
  zones: unknown,
  fallback: SolarisSliderColor,
): SolarisSliderColor {
  if (!Array.isArray(zones) || !Number.isFinite(value)) {
    return fallback;
  }
  for (const zone of zones) {
    if (typeof zone !== 'object' || zone === null) {
      continue;
    }
    const { from, to, color } = zone as Partial<SolarisSliderZone>;
    if (
      typeof from !== 'number' ||
      typeof to !== 'number' ||
      !Number.isFinite(from) ||
      !Number.isFinite(to) ||
      typeof color !== 'string' ||
      color.length === 0
    ) {
      continue;
    }
    const zoneLo = Math.min(from, to);
    const zoneHi = Math.max(from, to);
    if (value >= zoneLo && value <= zoneHi) {
      return color as SolarisSliderColor;
    }
  }
  return fallback;
}

export function resolveZoneFade(
  previous: SolarisSliderColor | null,
  current: SolarisSliderColor,
  phase: SolarisZoneFadePhase | null,
): SolarisZoneFadeFrame | null {
  if (previous === null || previous === current) {
    return null;
  }
  return { zone: previous, phase: phase === 'a' ? 'b' : 'a' };
}

export function distributionHeights(values: unknown): number[] {
  if (!Array.isArray(values)) {
    return [];
  }
  const cleaned = values.map((candidate) =>
    typeof candidate === 'number' && Number.isFinite(candidate) && candidate > 0
      ? candidate
      : 0,
  );
  const peak = Math.max(0, ...cleaned);
  if (!(peak > 0)) {
    return cleaned.map(() => 0);
  }
  return cleaned.map((entry) => clampToRange(entry / peak, 0, 1));
}
