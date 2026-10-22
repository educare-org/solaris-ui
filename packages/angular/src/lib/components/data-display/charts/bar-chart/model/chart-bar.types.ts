import type {
  SolarisChartReferenceLine,
  SolarisChartSeries,
} from '../../model/chart.types';

export type SolarisBarChartOrientation = 'vertical' | 'horizontal';

export type SolarisBarChartLayout = 'grouped' | 'stacked' | 'stacked-100';

export type SolarisBarChartSize = 'sm' | 'md' | 'lg';

export type SolarisBarChartDensity = 'compact' | 'normal' | 'comfortable';

export type SolarisBarChartValueFormatter = (value: number) => string;

export interface SolarisBarChartPointEvent {
  readonly seriesId: string;
  readonly index: number;
}

export interface SolarisBarChartTooltipRow {
  readonly seriesId: string;
  readonly label: string;
  readonly colorVar: string;
  readonly formattedValue: string;
}

export interface SolarisBarChartTooltip {
  readonly index: number;
  readonly heading: string;
  readonly leftPercent: number;
  readonly rows: readonly SolarisBarChartTooltipRow[];
  readonly total: string | null;
  readonly totalLabel: string;
}

export interface SolarisBarChartInputs {
  readonly series: readonly SolarisChartSeries[];
  readonly referenceLines?: readonly SolarisChartReferenceLine[];
}

export interface SolarisBarChartPadding {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
}

export interface SolarisBarChartPlot {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
}

export interface SolarisBarChartDomain {
  readonly min: number;
  readonly max: number;
}

export interface SolarisBarChartBarGeometry {
  readonly seriesId: string;
  readonly index: number;
  readonly value: number;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly colorVar: string;
  readonly roundTop: boolean;
  readonly roundBottom: boolean;
  readonly roundLeft: boolean;
  readonly roundRight: boolean;
}

export interface SolarisBarChartSeriesGeometry {
  readonly id: string;
  readonly label: string;
  readonly colorVar: string;
  readonly bars: readonly SolarisBarChartBarGeometry[];
}

export interface SolarisBarChartTickGeometry {
  readonly value: number;
  readonly position: number;
}

export interface SolarisBarChartFrame {
  readonly width: number;
  readonly height: number;
  readonly plot: SolarisBarChartPlot;
  readonly domain: SolarisBarChartDomain;
  readonly baseline: number;
  readonly categoryCenters: readonly number[];
  readonly valueTicks: readonly SolarisBarChartTickGeometry[];
  readonly series: readonly SolarisBarChartSeriesGeometry[];
}

export interface SolarisBarChartFrameOptions {
  readonly width?: number;
  readonly height?: number;
  readonly orientation?: SolarisBarChartOrientation;
  readonly layout?: SolarisBarChartLayout;
}
