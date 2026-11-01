export type SolarisSliderSize = 'sm' | 'md' | 'lg';

export type SolarisSliderColor =
  | 'neutral'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'custom';

export type SolarisSliderOrientation = 'horizontal' | 'vertical';

export type SolarisSliderValueDisplay = 'inline' | 'tooltip' | 'thumb' | 'none';

export type SolarisSliderValueFormatter = (value: number) => string;
