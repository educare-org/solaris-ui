import type { SolarisChartInterpolation } from './chart.types';

export interface SolarisLineChartPadding {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
}

export interface SolarisLineChartDotGeometry {
  readonly seriesId: string;
  readonly index: number;
  readonly value: number | null;
  readonly cx: number;
  readonly cy: number | null;
}

export interface SolarisLineChartSeriesGeometry {
  readonly id: string;
  readonly label: string;
  readonly colorVar: string;
  readonly linePath: string;
  readonly areaPath: string;
  readonly dots: readonly SolarisLineChartDotGeometry[];
}

export interface SolarisLineChartTickGeometry {
  readonly value: number;
  readonly y: number;
}

export interface SolarisLineChartPlot {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
}

export interface SolarisLineChartDomain {
  readonly min: number;
  readonly max: number;
}

export interface SolarisLineChartFrame {
  readonly width: number;
  readonly height: number;
  readonly plot: SolarisLineChartPlot;
  readonly domain: SolarisLineChartDomain;
  readonly baselineY: number;
  readonly xPositions: readonly number[];
  readonly yTicks: readonly SolarisLineChartTickGeometry[];
  readonly series: readonly SolarisLineChartSeriesGeometry[];
}

export interface SolarisLineChartFrameOptions {
  readonly width?: number;
  readonly height?: number;
  readonly interpolation?: SolarisChartInterpolation;
  readonly step?: boolean;
}

export interface SolarisLineChartPixel {
  readonly x: number;
  readonly y: number;
}

export interface SolarisSparklineGeometry {
  readonly width: number;
  readonly height: number;
  readonly linePath: string;
  readonly areaPath: string;
  readonly trend: 'up' | 'down' | 'flat';
}

export interface SolarisSparklineGeometryOptions {
  readonly width?: number;
  readonly height?: number;
  readonly interpolation?: SolarisChartInterpolation;
}
