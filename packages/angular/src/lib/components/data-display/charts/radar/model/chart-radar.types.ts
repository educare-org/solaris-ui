import type { SolarisChartSeriesColor } from '../../model/chart.types';

export type SolarisRadarSize = 'sm' | 'md' | 'lg';

export type SolarisRadarDensity = 'compact' | 'normal' | 'comfortable';

export type SolarisRadarTooltipSide = 'top' | 'right' | 'bottom' | 'left';

export type SolarisRadarValueFormatter = (value: number) => string;

export interface SolarisRadarSeries {
  readonly id: string;
  readonly label: string;
  readonly color?: SolarisChartSeriesColor;
  readonly values: readonly (number | null)[];
  readonly hidden?: boolean;
}

export interface SolarisRadarVertexEvent {
  readonly seriesId: string;
  readonly axisIndex: number;
}

export interface SolarisRadarVertexGeometry {
  readonly seriesId: string;
  readonly axisIndex: number;
  readonly x: number;
  readonly y: number;
  readonly value: number | null;
  readonly fraction: number;
}

export interface SolarisRadarSeriesGeometry {
  readonly id: string;
  readonly label: string;
  readonly colorVar: string;
  readonly fractions: readonly number[];
  readonly points: readonly { readonly x: number; readonly y: number }[];
  readonly path: string;
  readonly vertices: readonly SolarisRadarVertexGeometry[];
}

export interface SolarisRadarFrame {
  readonly width: number;
  readonly height: number;
  readonly centerX: number;
  readonly centerY: number;
  readonly radius: number;
  readonly max: number;
  readonly rings: readonly (readonly {
    readonly x: number;
    readonly y: number;
  }[])[];
  readonly axisEnds: readonly { readonly x: number; readonly y: number }[];
  readonly series: readonly SolarisRadarSeriesGeometry[];
}

export interface SolarisRadarFrameOptions {
  readonly max?: number;
  readonly levels?: number;
}

export interface SolarisRadarTooltip {
  readonly seriesId: string;
  readonly seriesLabel: string;
  readonly axisLabel: string;
  readonly formattedValue: string | null;
  readonly leftPercent: number;
  readonly topPercent: number;
  readonly side: SolarisRadarTooltipSide;
}

export interface SolarisRadarInputs {
  readonly axes: readonly string[];
  readonly series: readonly SolarisRadarSeries[];
}
