export type SolarisSpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

export type SolarisSpinnerColor =
  | 'neutral'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'custom';

export type SolarisSpinnerSpeed = 'slow' | 'normal' | 'fast';

export type SolarisSpinnerEasing =
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'spring';

export interface SolarisSpinnerConfig {
  size?: SolarisSpinnerSize;
  color?: SolarisSpinnerColor;
  speed?: SolarisSpinnerSpeed;
  easing?: SolarisSpinnerEasing;
  backdrop?: boolean;
  label?: string;
}
