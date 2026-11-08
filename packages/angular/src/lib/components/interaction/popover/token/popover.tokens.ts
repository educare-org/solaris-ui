import { InjectionToken, TemplateRef } from '@angular/core';

import type {
  SolarisPopoverAppearance,
  SolarisPopoverAutoFocus,
  SolarisPopoverPadding,
  SolarisPopoverRadius,
} from '../model/popover.types';

export interface SolarisPopoverPanelData {
  contentTemplate: TemplateRef<unknown>;
  appearance: SolarisPopoverAppearance;
  padding: SolarisPopoverPadding;
  radius: SolarisPopoverRadius;
  role: string | undefined | null;
  panelId: string;
  autoFocus: SolarisPopoverAutoFocus;
  connectedSide?: 'top' | 'bottom';
  maxHeight?: string;
  /**
   * Whether the panel draws its own border. Defaults to true; borderless
   * triggers (surface/minimal) pass false so the panel mirrors them.
   */
  bordered?: boolean;
}

export const SOLARIS_POPOVER_PANEL_DATA =
  new InjectionToken<SolarisPopoverPanelData>('SolarisPopoverPanelData');
