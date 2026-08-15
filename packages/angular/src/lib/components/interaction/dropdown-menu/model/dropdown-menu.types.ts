import type {
  SolarisPopoverPlacement,
  SolarisPopoverAlign,
  SolarisPopoverAppearance,
  SolarisPopoverRadius,
  SolarisPopoverScrollStrategy,
} from '../../popover/model/popover.types';

export type SolarisDropdownMenuPlacement = SolarisPopoverPlacement;
export type SolarisDropdownMenuAlign = SolarisPopoverAlign;
export type SolarisDropdownMenuAppearance = SolarisPopoverAppearance;
export type SolarisDropdownMenuRadius = SolarisPopoverRadius;
export type SolarisDropdownMenuScrollStrategy = SolarisPopoverScrollStrategy;

export type SolarisDropdownMenuSize = 'sm' | 'md' | 'lg';
export type SolarisDropdownMenuDensity = 'compact' | 'normal' | 'comfortable';

export type SolarisDropdownMenuItemColor =
  | 'neutral'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

export type SolarisDropdownMenuItemType = 'item' | 'checkbox' | 'radio';

export type SolarisDropdownMenuItemSelectionMode =
  | 'none'
  | 'single'
  | 'multiple';
