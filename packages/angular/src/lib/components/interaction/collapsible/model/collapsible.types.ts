export type SolarisCollapsibleSize = 'sm' | 'md' | 'lg';

export type SolarisCollapsibleAppearance = 'boxed' | 'lined';

export type SolarisCollapsibleValue = string | number;

export interface SolarisCollapsibleConfig {
  size?: SolarisCollapsibleSize;
  appearance?: SolarisCollapsibleAppearance;
  disabled?: boolean;
  label?: string;
  labelKey?: string;
  ariaLabel?: string;
  ariaLabelKey?: string;
  open?: boolean;
  value?: SolarisCollapsibleValue;
  icon?: string;
}
