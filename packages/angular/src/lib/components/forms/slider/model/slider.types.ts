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

export type SolarisSliderScaleKind =
  | 'linear'
  | 'log'
  | 'pow'
  | 'time'
  | 'custom';

export interface SolarisSliderScaleLinear {
  kind: 'linear';
}

export interface SolarisSliderScaleLog {
  kind: 'log';
  base?: number;
}

export interface SolarisSliderScalePow {
  kind: 'pow';
  exponent?: number;
}

export interface SolarisSliderScaleTime {
  kind: 'time';
}

export interface SolarisSliderScaleCustom {
  kind: 'custom';
  toRatio: (value: number) => number;
  fromRatio: (ratio: number) => number;
}

export type SolarisSliderScale =
  | SolarisSliderScaleLinear
  | SolarisSliderScaleLog
  | SolarisSliderScalePow
  | SolarisSliderScaleTime
  | SolarisSliderScaleCustom;

export interface SolarisSliderZone {
  from: number;
  to: number;
  color: SolarisSliderColor;
}

export type SolarisZoneFadePhase = 'a' | 'b';

export interface SolarisZoneFadeFrame {
  zone: SolarisSliderColor;
  phase: SolarisZoneFadePhase;
}
