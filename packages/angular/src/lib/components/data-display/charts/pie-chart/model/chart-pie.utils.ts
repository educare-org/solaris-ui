import { resolveChartSeriesColor } from '../../model/chart-palette';
import type {
  SolarisChartSeries,
  SolarisChartSlice,
} from '../../model/chart.types';
import type {
  SolarisPieChartFrame,
  SolarisPieChartFrameOptions,
  SolarisPieChartGaugeGeometry,
  SolarisPieChartSliceGeometry,
} from './chart-pie.types';

export const SOLARIS_PIE_CHART_WIDTH = 320;
export const SOLARIS_PIE_CHART_HEIGHT = 260;
export const SOLARIS_PIE_CHART_RADIUS = 104;
export const SOLARIS_PIE_CHART_DONUT_RATIO = 0.62;

export const SOLARIS_PIE_CHART_GRADIENT_RADIUS_RATIO = 0.85;

export const SOLARIS_PIE_CHART_TOOLTIP_OFFSET = 14;

export const SOLARIS_GAUGE_CHART_WIDTH = 320;
export const SOLARIS_GAUGE_CHART_HEIGHT = 196;
export const SOLARIS_GAUGE_CHART_RADIUS = 124;
export const SOLARIS_GAUGE_CHART_STROKE = 16;

const FULL_CIRCLE_TOLERANCE = 359.999;

function isPlottable(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function roundCoordinate(value: number): number {
  return Number(value.toFixed(2));
}

function resolveSize(value: number | undefined, fallback: number): number {
  if (value === undefined || !Number.isFinite(value) || value <= 0) {
    return fallback;
  }
  return value;
}

function formatCoordinate(value: number): string {
  return roundCoordinate(value).toString();
}

function polar(
  centerX: number,
  centerY: number,
  radius: number,
  angle: number,
): { readonly x: number; readonly y: number } {
  const radians = (angle * Math.PI) / 180;
  return {
    x: roundCoordinate(centerX + radius * Math.sin(radians)),
    y: roundCoordinate(centerY - radius * Math.cos(radians)),
  };
}

export function pieSlicePath(
  centerX: number,
  centerY: number,
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number,
): string {
  const outer = Math.max(0, outerRadius);
  const inner = Math.min(Math.max(0, innerRadius), outer);
  const sweep = endAngle - startAngle;
  if (sweep <= 0 || outer <= 0) return '';
  const outerStart = polar(centerX, centerY, outer, startAngle);
  const outerEnd = polar(centerX, centerY, outer, endAngle);
  const fixedOuter = formatCoordinate(outer);
  if (sweep >= FULL_CIRCLE_TOLERANCE) {
    const outerMid = polar(centerX, centerY, outer, startAngle + 180);
    const ring = [
      `M ${formatCoordinate(outerStart.x)} ${formatCoordinate(outerStart.y)}`,
      `A ${fixedOuter} ${fixedOuter} 0 1 1 ${formatCoordinate(outerMid.x)} ${formatCoordinate(outerMid.y)}`,
      `A ${fixedOuter} ${fixedOuter} 0 1 1 ${formatCoordinate(outerStart.x)} ${formatCoordinate(outerStart.y)}`,
      'Z',
    ].join(' ');
    if (inner <= 0) {
      return [
        `M ${formatCoordinate(centerX)} ${formatCoordinate(centerY)}`,
        `L ${formatCoordinate(outerStart.x)} ${formatCoordinate(outerStart.y)}`,
        `A ${fixedOuter} ${fixedOuter} 0 1 1 ${formatCoordinate(outerMid.x)} ${formatCoordinate(outerMid.y)}`,
        `A ${fixedOuter} ${fixedOuter} 0 1 1 ${formatCoordinate(outerStart.x)} ${formatCoordinate(outerStart.y)}`,
        'Z',
      ].join(' ');
    }
    const innerStart = polar(centerX, centerY, inner, startAngle);
    const innerMid = polar(centerX, centerY, inner, startAngle + 180);
    const fixedInner = formatCoordinate(inner);
    return [
      ring,
      `M ${formatCoordinate(innerStart.x)} ${formatCoordinate(innerStart.y)}`,
      `A ${fixedInner} ${fixedInner} 0 1 0 ${formatCoordinate(innerMid.x)} ${formatCoordinate(innerMid.y)}`,
      `A ${fixedInner} ${fixedInner} 0 1 0 ${formatCoordinate(innerStart.x)} ${formatCoordinate(innerStart.y)}`,
      'Z',
    ].join(' ');
  }
  const largeArc = sweep > 180 ? 1 : 0;
  const innerStart = polar(centerX, centerY, inner, startAngle);
  const innerEnd = polar(centerX, centerY, inner, endAngle);
  const fixedInner = formatCoordinate(inner);
  return [
    `M ${formatCoordinate(outerStart.x)} ${formatCoordinate(outerStart.y)}`,
    `A ${fixedOuter} ${fixedOuter} 0 ${largeArc} 1 ${formatCoordinate(outerEnd.x)} ${formatCoordinate(outerEnd.y)}`,
    `L ${formatCoordinate(innerEnd.x)} ${formatCoordinate(innerEnd.y)}`,
    `A ${fixedInner} ${fixedInner} 0 ${largeArc} 0 ${formatCoordinate(innerStart.x)} ${formatCoordinate(innerStart.y)}`,
    'Z',
  ].join(' ');
}

export function gaugeArcPath(
  centerX: number,
  centerY: number,
  radius: number,
  startFraction: number,
  endFraction: number,
): string {
  const safeRadius = Math.max(0, radius);
  if (safeRadius <= 0) return '';
  const from = Math.min(Math.max(startFraction, 0), 1);
  const to = Math.min(Math.max(endFraction, 0), 1);
  if (to <= from) return '';
  const start = polar(centerX, centerY, safeRadius, 270 + from * 180);
  const end = polar(centerX, centerY, safeRadius, 270 + to * 180);
  const fixed = formatCoordinate(safeRadius);
  return [
    `M ${formatCoordinate(start.x)} ${formatCoordinate(start.y)}`,
    `A ${fixed} ${fixed} 0 0 1 ${formatCoordinate(end.x)} ${formatCoordinate(end.y)}`,
  ].join(' ');
}

export function seriesToPieSlices(
  series: readonly SolarisChartSeries[],
): SolarisChartSlice[] {
  return series.map((entry) => ({
    id: entry.id,
    label: entry.label,
    value: entry.points.reduce((sum, point) => {
      if (!isPlottable(point.y) || point.y < 0) return sum;
      return sum + point.y;
    }, 0),
  }));
}

function resolveGaugeBounds(
  min: number,
  max: number,
): { readonly min: number; readonly max: number } {
  const safeMin = isPlottable(min) ? min : 0;
  let safeMax = isPlottable(max) ? max : 100;
  if (safeMax <= safeMin) safeMax = safeMin + 1;
  return { min: safeMin, max: safeMax };
}

export function buildPieChartFrame(
  slices: readonly SolarisChartSlice[],
  options: SolarisPieChartFrameOptions = {},
): SolarisPieChartFrame {
  const width = resolveSize(options.width, SOLARIS_PIE_CHART_WIDTH);
  const height = resolveSize(options.height, SOLARIS_PIE_CHART_HEIGHT);
  const centerX = roundCoordinate(width / 2);
  const centerY = roundCoordinate(height / 2);
  const radius = Math.min(
    SOLARIS_PIE_CHART_RADIUS,
    roundCoordinate(Math.min(width, height) / 2 - 8),
  );
  const ratio = options.innerRatio;
  const innerRadius =
    ratio === undefined || !Number.isFinite(ratio) || ratio <= 0
      ? 0
      : roundCoordinate(Math.min(radius * Math.min(ratio, 0.9), radius));
  const values = slices.map((slice) =>
    isPlottable(slice.value) && slice.value > 0 ? slice.value : 0,
  );
  const total = values.reduce((sum, value) => sum + value, 0);
  if (total <= 0) {
    return {
      width,
      height,
      centerX,
      centerY,
      radius,
      innerRadius,
      total: 0,
      slices: [],
    };
  }
  let cursor = 0;
  const geometries: SolarisPieChartSliceGeometry[] = slices.map(
    (slice, index) => {
      const value = values[index] ?? 0;
      const fraction = value / total;
      const startAngle = cursor;
      const endAngle = cursor + fraction * 360;
      cursor = endAngle;
      return {
        id: slice.id,
        label: slice.label,
        value: slice.value,
        fraction,
        percent: roundCoordinate(fraction * 100),
        startAngle: roundCoordinate(startAngle),
        endAngle: roundCoordinate(endAngle),
        path: pieSlicePath(
          centerX,
          centerY,
          radius,
          innerRadius,
          startAngle,
          endAngle,
        ),
        colorVar: resolveChartSeriesColor(index),
      };
    },
  );
  return {
    width,
    height,
    centerX,
    centerY,
    radius,
    innerRadius,
    total,
    slices: geometries,
  };
}

export function buildGaugeGeometry(
  value: number,
  min: number,
  max: number,
  target: number | null | undefined,
  colorVar?: string,
): SolarisPieChartGaugeGeometry {
  const bounds = resolveGaugeBounds(min, max);
  const span = bounds.max - bounds.min;
  const clamp = (candidate: number): number =>
    Math.min(Math.max(candidate, bounds.min), bounds.max);
  const safeValue = isPlottable(value) ? clamp(value) : bounds.min;
  const safeTarget =
    target === null || target === undefined || !isPlottable(target)
      ? null
      : clamp(target);
  const fraction = (safeValue - bounds.min) / span;
  const targetFraction =
    safeTarget === null ? null : (safeTarget - bounds.min) / span;
  const centerX = roundCoordinate(SOLARIS_GAUGE_CHART_WIDTH / 2);
  const centerY = roundCoordinate(
    SOLARIS_GAUGE_CHART_HEIGHT - SOLARIS_GAUGE_CHART_STROKE,
  );
  const radius = SOLARIS_GAUGE_CHART_RADIUS;
  return {
    value: safeValue,
    min: bounds.min,
    max: bounds.max,
    target: safeTarget,
    fraction: roundCoordinate(fraction),
    targetFraction:
      targetFraction === null ? null : roundCoordinate(targetFraction),
    targetAngle:
      targetFraction === null
        ? null
        : roundCoordinate(270 + targetFraction * 180),
    trackPath: gaugeArcPath(centerX, centerY, radius, 0, 1),
    valuePath: gaugeArcPath(centerX, centerY, radius, 0, fraction),
    colorVar: colorVar ?? resolveChartSeriesColor(0),
  };
}

export function gaugeTargetTick(
  centerX: number,
  centerY: number,
  radius: number,
  targetAngle: number,
  halfLength = 10,
): {
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
} {
  const inner = polar(
    centerX,
    centerY,
    Math.max(0, radius - halfLength),
    targetAngle,
  );
  const outer = polar(centerX, centerY, radius + halfLength, targetAngle);
  return { x1: inner.x, y1: inner.y, x2: outer.x, y2: outer.y };
}

export function pieSliceLabelPosition(
  centerX: number,
  centerY: number,
  radius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number,
): { readonly x: number; readonly y: number } {
  const mid = startAngle + (endAngle - startAngle) / 2;
  const distance =
    innerRadius > 0 ? innerRadius + (radius - innerRadius) / 2 : radius * 0.68;
  return polar(centerX, centerY, Math.max(0, distance), mid);
}

export const SOLARIS_PIE_ENTER_SLICE_DELAY_MS = 70;
export const SOLARIS_PIE_ENTER_SLICE_DURATION_MS = 400;
export const SOLARIS_PIE_ENTER_GAUGE_DURATION_MS = 520;

export function easeOutCubic(fraction: number): number {
  const clamped = Math.min(Math.max(fraction, 0), 1);
  return 1 - (1 - clamped) ** 3;
}

export function pieSliceEnterProgress(
  elapsedMs: number,
  position: number,
): number {
  const safePosition = Number.isFinite(position) ? Math.max(0, position) : 0;
  return easeOutCubic(
    (elapsedMs - safePosition * SOLARIS_PIE_ENTER_SLICE_DELAY_MS) /
      SOLARIS_PIE_ENTER_SLICE_DURATION_MS,
  );
}

export function pieSliceAnchorPoint(
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  offset = SOLARIS_PIE_CHART_TOOLTIP_OFFSET,
): { readonly x: number; readonly y: number } {
  const mid = startAngle + (endAngle - startAngle) / 2;
  return polar(
    centerX,
    centerY,
    Math.max(0, radius) + Math.max(0, offset),
    mid,
  );
}

export function gaugeAnchorPoint(
  centerX: number,
  centerY: number,
  radius: number,
  fraction: number,
  offset = SOLARIS_PIE_CHART_TOOLTIP_OFFSET,
): { readonly x: number; readonly y: number } {
  const clamped = Math.min(Math.max(fraction, 0), 1);
  return polar(
    centerX,
    centerY,
    Math.max(0, radius) + Math.max(0, offset),
    270 + clamped * 180,
  );
}

export type SolarisPieTooltipSide = 'top' | 'right' | 'bottom' | 'left';

export function pieTooltipSide(midAngle: number): SolarisPieTooltipSide {
  const normalized = ((midAngle % 360) + 360) % 360;
  if (normalized >= 45 && normalized < 135) return 'right';
  if (normalized >= 135 && normalized < 225) return 'bottom';
  if (normalized >= 225 && normalized < 315) return 'left';
  return 'top';
}

export function pieEnterTotalMs(sliceCount: number): number {
  const safeCount = Number.isFinite(sliceCount) ? Math.max(0, sliceCount) : 0;
  if (safeCount === 0) return 0;
  return (
    (safeCount - 1) * SOLARIS_PIE_ENTER_SLICE_DELAY_MS +
    SOLARIS_PIE_ENTER_SLICE_DURATION_MS
  );
}
