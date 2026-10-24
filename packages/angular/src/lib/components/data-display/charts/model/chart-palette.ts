import type { SolarisChartSeriesColor } from './chart.types';

export const SOLARIS_CHART_PALETTE: readonly SolarisChartSeriesColor[] = [
  'primary',
  'accent',
  'success',
  'violet',
  'warning',
  'danger',
  'info',
  'neutral',
];

export function solarisChartColorVar(color: SolarisChartSeriesColor): string {
  // Warning solid (#f1d008 light, 1.53:1 on white) fails WCAG 3:1 for
  // graphics; the foreground token passes on light (5.51:1) and dark (3.25:1
  // on #171717), so chart strokes use it instead of the solid.
  if (color === 'warning') return `var(--solaris-warning-foreground)`;
  return `var(--solaris-${color}-solid)`;
}

export function solarisChartSoftVar(color: SolarisChartSeriesColor): string {
  return `var(--solaris-${color}-soft)`;
}

export function resolveChartSeriesColor(
  index: number,
  override?: SolarisChartSeriesColor,
): string {
  if (override !== undefined) return solarisChartColorVar(override);
  const length = SOLARIS_CHART_PALETTE.length;
  const safeIndex = Number.isFinite(index) ? Math.floor(index) : 0;
  const position = ((safeIndex % length) + length) % length;
  return solarisChartColorVar(SOLARIS_CHART_PALETTE[position]);
}
