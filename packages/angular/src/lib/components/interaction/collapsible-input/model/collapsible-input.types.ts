export type SolarisCollapsibleInputSize = 'sm' | 'md' | 'lg';

export type SolarisCollapsibleInputDensity =
  | 'compact'
  | 'normal'
  | 'comfortable';

export type SolarisCollapsibleInputAppearance = 'boxed' | 'lined' | 'plain';

export type SolarisCollapsibleInputValue = string | number;

export interface SolarisCollapsibleInputConfig {
  size?: SolarisCollapsibleInputSize;
  density?: SolarisCollapsibleInputDensity;
  appearance?: SolarisCollapsibleInputAppearance;
  disabled?: boolean;
  value?: SolarisCollapsibleInputValue;
  placeholder?: string;
  placeholderKey?: string;
  leadingIcon?: string;
  submitLabel?: string;
  submitLabelKey?: string;
  submitIcon?: string;
  stopLabel?: string;
  stopLabelKey?: string;
  stopIcon?: string;
  loadingLabel?: string;
  loadingLabelKey?: string;
  loading?: boolean;
  query?: string;
}
