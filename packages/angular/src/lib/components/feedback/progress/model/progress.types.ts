export type SolarisProgressSize = 'sm' | 'md' | 'lg';

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
  indeterminate?: boolean;
  size?: SolarisProgressSize;
  color?: SolarisProgressColor;
  label?: string;
}
