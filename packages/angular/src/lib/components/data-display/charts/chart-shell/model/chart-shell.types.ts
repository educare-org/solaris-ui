import type {
  SolarisChartDisplayMode,
  SolarisChartPeriod,
  SolarisChartView,
} from '../../model/chart.types';
import type { SolarisDateValue } from '../../../../forms/date/model/date.types';

export interface SolarisChartPeriodDuration {
  readonly days?: number;
  readonly months?: number;
  readonly years?: number;
}

export interface SolarisChartShellInterval {
  readonly start: SolarisDateValue | null;
  readonly end: SolarisDateValue | null;
  readonly period: SolarisChartPeriod;
}

export interface SolarisChartShellDisplayModeOption {
  readonly value: SolarisChartDisplayMode;
  readonly label?: string;
  readonly labelKey?: string;
  readonly disabled?: boolean;
}

export interface SolarisChartShellViewOption {
  readonly value: SolarisChartView;
  readonly label?: string;
  readonly labelKey?: string;
  readonly disabled?: boolean;
}

export interface SolarisChartShellPeriodOption {
  readonly value: SolarisChartPeriod;
  readonly label?: string;
  readonly labelKey?: string;
  readonly disabled?: boolean;
  readonly fixedDuration?: SolarisChartPeriodDuration;
  readonly icon?: string;
}

export type SolarisChartShellAction = 'export' | 'fullscreen';

export interface SolarisChartShellActionOption {
  readonly value: SolarisChartShellAction | (string & {});
  readonly label?: string;
  readonly labelKey?: string;
  readonly icon?: string;
}

export type SolarisChartShellSize = 'sm' | 'md' | 'lg';

export type SolarisChartShellDensity = 'compact' | 'normal' | 'comfortable';

export type SolarisChartShellTrend = 'up' | 'down' | 'flat';
