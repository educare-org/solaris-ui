import type { SolarisChartSeries, SolarisChartSlice } from './chart.types';

export interface SolarisChartDomain {
  min: number;
  max: number;
}

export interface SolarisChartDomainOptions {
  readonly includeZero?: boolean;
  readonly paddingRatio?: number;
}

const DEFAULT_PADDING_RATIO = 0.05;

function isPlottable(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function resolvePaddingRatio(value: number | undefined): number {
  if (value === undefined) return DEFAULT_PADDING_RATIO;
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

export function resolveChartDomain(
  values: readonly (number | null | undefined)[],
  options: SolarisChartDomainOptions = {},
): SolarisChartDomain {
  const plottable = values.filter(isPlottable);
  if (plottable.length === 0) return { min: 0, max: 1 };

  let min = Math.min(...plottable);
  let max = Math.max(...plottable);

  if (min === max) {
    const spread = Math.max(Math.abs(min) * 0.1, 1);
    min -= spread;
    max += spread;
  }

  if (options.includeZero === true) {
    min = Math.min(min, 0);
    max = Math.max(max, 0);
  }

  const padding = (max - min) * resolvePaddingRatio(options.paddingRatio);
  return { min: min - padding, max: max + padding };
}

function niceStep(rawStep: number): number {
  const exponent = Math.floor(Math.log10(rawStep));
  const power = 10 ** exponent;
  const fraction = rawStep / power;
  if (fraction <= 1) return power;
  if (fraction <= 2) return 2 * power;
  if (fraction <= 2.5) return 2.5 * power;
  if (fraction <= 5) return 5 * power;
  return 10 * power;
}

function roundToStep(value: number, step: number): number {
  const precision = Math.max(0, -Math.floor(Math.log10(step)));
  return Number(value.toFixed(precision));
}

export function resolveChartTicks(
  min: number,
  max: number,
  maxTicks = 5,
): number[] {
  const safeMaxTicks = Math.max(2, Math.floor(maxTicks));
  let lower = min;
  let upper = max;
  if (!(lower < upper)) {
    const center = Number.isFinite(lower) ? lower : 0;
    lower = center - 1;
    upper = center + 1;
  }
  const step = niceStep((upper - lower) / (safeMaxTicks - 1));
  const ticks: number[] = [];
  for (
    let tick = Math.ceil(lower / step) * step;
    tick <= upper + step / 2;
    tick += step
  ) {
    ticks.push(roundToStep(tick, step));
  }
  return ticks.slice(0, safeMaxTicks + 1);
}

function toStackable(value: number | null | undefined): number {
  if (!isPlottable(value) || value < 0) return 0;
  return value;
}

export function normalizeStacked100(
  stacks: readonly (readonly (number | null | undefined)[])[],
): number[][] {
  if (stacks.length === 0) return [];
  const categories = Math.max(...stacks.map((stack) => stack.length));
  const result = stacks.map((stack) =>
    Array.from({ length: categories }, (_, i) => toStackable(stack[i])),
  );
  for (let category = 0; category < categories; category += 1) {
    const total = result.reduce((sum, stack) => sum + stack[category], 0);
    if (total <= 0) continue;
    for (const stack of result) {
      stack[category] = (stack[category] / total) * 100;
    }
  }
  return result;
}

export function groupSmallChartSlices(
  slices: readonly SolarisChartSlice[],
  minFraction: number,
  othersLabel: string,
): SolarisChartSlice[] {
  const copy = slices.map((slice) => ({ ...slice }));
  const total = copy.reduce(
    (sum, slice) => sum + (isPlottable(slice.value) ? slice.value : 0),
    0,
  );
  if (total <= 0) return copy;
  const threshold = Math.min(Math.max(minFraction, 0), 1);
  const kept = copy.filter((slice) => slice.value / total >= threshold);
  const smallValue = copy
    .filter((slice) => slice.value / total < threshold)
    .reduce((sum, slice) => sum + slice.value, 0);
  if (smallValue <= 0) return kept;
  const grouped: SolarisChartSlice = {
    id: 'others',
    label: othersLabel,
    value: smallValue,
  };
  return [...kept, grouped];
}

export function isChartSeriesEmpty(
  series: readonly SolarisChartSeries[],
): boolean {
  return series.every(
    (entry) =>
      entry.points.filter((point) => isPlottable(point.y)).length === 0,
  );
}

export function visibleChartSeries(
  series: readonly SolarisChartSeries[],
): SolarisChartSeries[] {
  return series.filter((entry) => entry.hidden !== true);
}
