export type SolarisLoadingTextSize = 'sm' | 'md' | 'lg' | 'xl';

export type SolarisLoadingTextSpeed = 'slow' | 'normal' | 'fast';

export type SolarisLoadingTextColor =
  | 'neutral'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'custom';

export interface SolarisLoadingTextConfig {
  size?: SolarisLoadingTextSize;
  color?: SolarisLoadingTextColor;
  speed?: SolarisLoadingTextSpeed;
  text?: string;
}
