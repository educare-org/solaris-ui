export type SolarisSegmentedControlOrientation = 'horizontal' | 'vertical';

export type SolarisSegmentedControlAppearance = 'surface' | 'outline';

export type SolarisSegmentedControlSize = 'sm' | 'md' | 'lg';

export type SolarisSegmentedControlDensity =
  | 'compact'
  | 'normal'
  | 'comfortable';

export type SolarisSegmentedControlRadius =
  | 'none'
  | 'sm'
  | 'md'
  | 'lg'
  | 'full';

export type SolarisSegmentedControlSelectedEdge = 'first' | 'last' | 'both';

export interface SolarisSegmentedControlValueChangeEvent {
  value: unknown;
}

export interface SolarisSegmentedControlChangeEvent {
  value: unknown;
  previousValue: unknown;
}
