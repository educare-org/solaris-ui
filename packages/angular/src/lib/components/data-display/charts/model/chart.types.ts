export type SolarisChartInterpolation = 'smooth' | 'linear' | 'step';

export type SolarisChartView = 'line' | 'bar' | 'pie' | 'heatmap' | 'radar';

export type SolarisChartPeriod =
  | 'day'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year'
  | 'all';

export type SolarisChartDisplayMode = 'timeline' | 'list';

export type SolarisChartSeriesColor =
  | 'primary'
  | 'accent'
  | 'success'
  | 'violet'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral';

export interface SolarisChartPoint {
  readonly x: string | number;
  readonly y: number | null;
  readonly label?: string;
}

export interface SolarisChartSeries {
  readonly id: string;
  readonly label: string;
  readonly color?: SolarisChartSeriesColor;
  readonly points: readonly SolarisChartPoint[];
  readonly hidden?: boolean;
}

export interface SolarisChartSlice {
  readonly id: string;
  readonly label: string;
  readonly value: number;
}

export interface SolarisChartReferenceLine {
  readonly value: number;
  readonly label?: string;
  readonly color?: SolarisChartSeriesColor;
}
