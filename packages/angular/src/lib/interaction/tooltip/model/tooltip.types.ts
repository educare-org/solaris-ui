export type SolarisTooltipPlacement =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'right-start'
  | 'right-end'
  | 'left-start'
  | 'left-end';

export type SolarisTooltipTrigger = 'hover' | 'click' | 'manual';

export type SolarisTooltipAppearance = 'outline' | 'surface' | 'inverse';

export type SolarisTooltipSize = 'sm' | 'md' | 'lg';

export type SolarisTooltipRadius = 'sm' | 'md' | 'lg';

export interface SolarisTooltipConfig {
  placement?: SolarisTooltipPlacement;
  offset?: number;
  appearance?: SolarisTooltipAppearance;
  size?: SolarisTooltipSize;
  radius?: SolarisTooltipRadius;
  maxWidth?: string | number;
  arrow?: boolean;
  trigger?: SolarisTooltipTrigger;
  closeable?: boolean;
  showDelay?: number;
  hideDelay?: number;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  restoreFocus?: boolean;
  disabled?: boolean;
}
