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
