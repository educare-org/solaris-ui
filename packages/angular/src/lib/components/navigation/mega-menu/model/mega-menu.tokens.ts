import { InjectionToken, type Signal } from '@angular/core';

import type { SolarisMegaMenuAppearance } from './mega-menu.types';

export interface SolarisMegaMenuControl {
  readonly isOpen: Signal<boolean>;
  readonly appearance: Signal<SolarisMegaMenuAppearance>;
  readonly panelId: string;
  open(): void;
  close(restoreFocus?: boolean): void;
  toggleFromClick(): void;
  scheduleOpen(): void;
  scheduleClose(): void;
  cancelScheduledClose(): void;
  focusFirstPanelItem(): void;
}

export interface SolarisMegaMenuGroupControl {
  open(menu: SolarisMegaMenuControl): void;
  close(menu: SolarisMegaMenuControl): void;
}

export interface SolarisMegaMenuAnchorControl {
  readonly element: HTMLElement;
}

export const SOLARIS_MEGA_MENU = new InjectionToken<SolarisMegaMenuControl>(
  'SOLARIS_MEGA_MENU',
);

export const SOLARIS_MEGA_MENU_GROUP =
  new InjectionToken<SolarisMegaMenuGroupControl>('SOLARIS_MEGA_MENU_GROUP');

export const SOLARIS_MEGA_MENU_ANCHOR =
  new InjectionToken<SolarisMegaMenuAnchorControl>('SOLARIS_MEGA_MENU_ANCHOR');
