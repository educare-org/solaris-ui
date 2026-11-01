import {
  clampToRange,
  enforceMinStepsBetweenThumbs,
  orderValues,
  percentOf,
} from '../../slider/functions/slider.utils';
import { SOLARIS_RANGE_SLIDER_DEFAULT_MAX_THUMBS } from '../model/range-slider.defaults';

export interface SolarisRangeFillBounds {
  start: number;
  end: number;
}

export function normalizeRangeValues(
  values: number[],
  min: number,
  max: number,
  step: number,
  minStepsBetweenThumbs: number,
  maxThumbs: number = SOLARIS_RANGE_SLIDER_DEFAULT_MAX_THUMBS,
): number[] {
  // Why: the v1 cap keeps tab order and pointer overlap tractable, so excess
  // thumbs are dropped after ordering instead of breaking collision math.
  const capped = orderValues(values).slice(
    0,
    Math.max(0, Math.floor(maxThumbs)),
  );
  return enforceMinStepsBetweenThumbs(
    capped,
    min,
    max,
    step,
    minStepsBetweenThumbs,
  );
}

export function rangeFillBounds(
  values: number[],
  min: number,
  max: number,
): SolarisRangeFillBounds {
  const lo = Math.min(min, max);
  if (values.length === 0) {
    return { start: lo, end: lo };
  }
  const ordered = orderValues(values).map((value) =>
    clampToRange(value, min, max),
  );
  return { start: ordered[0], end: ordered[ordered.length - 1] };
}

export function thumbPercents(
  values: number[],
  min: number,
  max: number,
): number[] {
  return values.map((value) =>
    percentOf(clampToRange(value, min, max), min, max),
  );
}
