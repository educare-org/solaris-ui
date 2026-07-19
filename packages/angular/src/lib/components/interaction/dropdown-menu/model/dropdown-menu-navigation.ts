import { InjectionToken } from '@angular/core';

export interface SolarisDropdownNavigableItem {
  disabled(): boolean;
  focus(): void;
  label(): string | undefined;
  handleClick(): void;
}

export const SOLARIS_DROPDOWN_NAVIGABLE_ITEM =
  new InjectionToken<SolarisDropdownNavigableItem>('SolarisDropdownNavigableItem');
