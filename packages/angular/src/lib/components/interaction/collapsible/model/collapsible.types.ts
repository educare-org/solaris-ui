export type SolarisCollapsibleSize = 'sm' | 'md' | 'lg';

export type SolarisCollapsibleDensity = 'compact' | 'normal' | 'comfortable';

export type SolarisCollapsibleAppearance = 'boxed' | 'lined' | 'plain';

export type SolarisCollapsibleValue = string | number;

export interface SolarisCollapsibleIconOption {
  value: string;
  label?: string;
  labelKey?: string;
}

export interface SolarisCollapsibleAddResult {
  label: string;
  description: string;
  leadingIcon: string | null;
}

export interface SolarisCollapsibleAddDialogData {
  iconOptions: readonly SolarisCollapsibleIconOption[];
  title?: string;
  titleKey?: string;
  titleLabel?: string;
  titleLabelKey?: string;
  descriptionLabel?: string;
  descriptionLabelKey?: string;
  iconLabel?: string;
  iconLabelKey?: string;
  noIconLabel?: string;
  noIconLabelKey?: string;
  cancelLabel?: string;
  cancelLabelKey?: string;
  confirmLabel?: string;
  confirmLabelKey?: string;
}
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
  showAddAction?: boolean;
  addActionLabel?: string;
  addActionLabelKey?: string;
  addActionIcon?: string;
  iconOptions?: readonly SolarisCollapsibleIconOption[];
}
