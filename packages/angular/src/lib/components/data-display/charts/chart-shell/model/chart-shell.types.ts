import type {
  SolarisChartPeriod,
  SolarisChartView,
} from '../../model/chart.types';

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
