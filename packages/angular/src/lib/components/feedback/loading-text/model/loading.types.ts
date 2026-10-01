export type SolarisLoadingTextSize = 'sm' | 'md' | 'lg' | 'xl';

export type SolarisLoadingTextDensity = 'compact' | 'normal' | 'comfortable';

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
  density?: SolarisLoadingTextDensity;
  color?: SolarisLoadingTextColor;
  speed?: SolarisLoadingTextSpeed;
  text?: string;
  maxLines?: number;
  dots?: boolean;
}
