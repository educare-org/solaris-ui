export type SolarisCollapsibleSize = 'sm' | 'md' | 'lg';

export interface SolarisCollapsibleConfig {
  size?: SolarisCollapsibleSize;
  disabled?: boolean;
  label?: string;
  labelKey?: string;
  ariaLabel?: string;
  ariaLabelKey?: string;
  open?: boolean;
}
