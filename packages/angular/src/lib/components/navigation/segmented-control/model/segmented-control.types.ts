export type SolarisSegmentedControlOrientation = 'horizontal' | 'vertical';

export type SolarisSegmentedControlAppearance = 'surface' | 'outline';

export type SolarisSegmentedControlSize = 'sm' | 'md' | 'lg';

export type SolarisSegmentedControlDensity = 'compact' | 'comfortable';

export type SolarisSegmentedControlRadius = 'sm' | 'md' | 'lg' | 'full';

export interface SolarisSegmentedControlValueChangeEvent {
  value: unknown;
}

export interface SolarisSegmentedControlChangeEvent {
  value: unknown;
  previousValue: unknown;
}
