import type {
  SolarisChartReferenceLine,
  SolarisChartSeries,
} from '../../model/chart.types';

export type SolarisLineChartSize = 'sm' | 'md' | 'lg';

export type SolarisLineChartDensity = 'compact' | 'normal' | 'comfortable';

export type SolarisLineChartValueFormatter = (value: number) => string;

export interface SolarisLineChartPointEvent {
  readonly seriesId: string;
  readonly index: number;
}

export interface SolarisLineChartTooltipRow {
  readonly seriesId: string;
  readonly label: string;
  readonly colorVar: string;
  readonly formattedValue: string;
}

export interface SolarisLineChartTooltip {
  readonly index: number;
  readonly heading: string;
  readonly subheading: string | null;
  readonly leftPercent: number;
  readonly rows: readonly SolarisLineChartTooltipRow[];
  readonly total: string | null;
  readonly totalLabel: string;
}

export interface SolarisLineChartInputs {
  readonly series: readonly SolarisChartSeries[];
  readonly referenceLines?: readonly SolarisChartReferenceLine[];
}
