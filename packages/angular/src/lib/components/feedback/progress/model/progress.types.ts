export type SolarisProgressSize = 'sm' | 'md' | 'lg';

export type SolarisProgressDensity = 'compact' | 'normal' | 'comfortable';

export type SolarisProgressStatus = 'active' | 'success' | 'exception';

export type SolarisProgressColor =
  | 'neutral'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'custom';

export interface SolarisProgressConfig {
  value?: number;
  bufferValue?: number;
  indeterminate?: boolean;
  size?: SolarisProgressSize;
  density?: SolarisProgressDensity;
  color?: SolarisProgressColor;
  status?: SolarisProgressStatus;
  striped?: boolean;
  animatedStripes?: boolean;
  label?: string;
}
