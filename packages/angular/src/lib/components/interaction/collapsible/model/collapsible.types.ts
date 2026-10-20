export type SolarisCollapsibleSize = 'sm' | 'md' | 'lg';

export type SolarisCollapsibleDensity = 'compact' | 'normal' | 'comfortable';

export type SolarisCollapsibleAppearance = 'boxed' | 'lined' | 'plain';

export type SolarisCollapsibleValue = string | number;

export interface SolarisCollapsibleConfig {
  size?: SolarisCollapsibleSize;
  density?: SolarisCollapsibleDensity;
  appearance?: SolarisCollapsibleAppearance;
  disabled?: boolean;
  label?: string;
  labelKey?: string;
  ariaLabel?: string;
  ariaLabelKey?: string;
  open?: boolean;
  value?: SolarisCollapsibleValue;
  icon?: string;
  leadingIcon?: string;
}
