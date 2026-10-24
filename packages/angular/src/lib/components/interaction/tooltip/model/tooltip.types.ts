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
  skipDelay?: number;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  restoreFocus?: boolean;
  disabled?: boolean;
}

/**
 * Arrow height in px per tooltip size, used to reserve offset space for the
 * arrow in the CDK position strategy. Must match `--solaris-tooltip-arrow-size`
 * per `[data-size]` in `tooltip-panel.component.scss`
 * (sm → 8px, md → 10px, lg → 12px). Keep both in sync.
 */
export const SOLARIS_TOOLTIP_ARROW_SIZE_PX: Record<SolarisTooltipSize, number> =
  {
    sm: 8,
    md: 10,
    lg: 12,
  };
