import type {
  SolarisChartSeries,
  SolarisChartSlice,
} from '../../model/chart.types';

export type SolarisPieChartVariant = 'pie' | 'donut' | 'gauge';

export type SolarisPieChartSize = 'sm' | 'md' | 'lg';

export type SolarisPieChartDensity = 'compact' | 'normal' | 'comfortable';

export type SolarisPieChartValueFormatter = (value: number) => string;

export interface SolarisPieChartSliceEvent {
  readonly id: string;
}

export interface SolarisPieChartSliceGeometry {
  readonly id: string;
  readonly label: string;
  readonly value: number;
  readonly fraction: number;
  readonly percent: number;
  readonly startAngle: number;
  readonly endAngle: number;
  readonly path: string;
  readonly colorVar: string;
}

export interface SolarisPieChartFrame {
  readonly width: number;
  readonly height: number;
  readonly centerX: number;
  readonly centerY: number;
  readonly radius: number;
  readonly innerRadius: number;
  readonly total: number;
  readonly slices: readonly SolarisPieChartSliceGeometry[];
}

export interface SolarisPieChartFrameOptions {
  readonly width?: number;
  readonly height?: number;
  readonly innerRatio?: number;
}

export interface SolarisPieChartGaugeGeometry {
  readonly value: number;
  readonly min: number;
  readonly max: number;
  readonly target: number | null;
  readonly fraction: number;
  readonly targetFraction: number | null;
  readonly targetAngle: number | null;
  readonly trackPath: string;
  readonly valuePath: string;
  readonly colorVar: string;
}

export interface SolarisPieChartInputs {
  readonly series: readonly SolarisChartSeries[];
  readonly slices?: readonly SolarisChartSlice[];
}
