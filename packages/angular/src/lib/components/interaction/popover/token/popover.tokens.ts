import { InjectionToken, TemplateRef } from '@angular/core';

export interface SolarisPopoverPanelData {
  contentTemplate: TemplateRef<unknown>;
  appearance: string;
  padding: string;
  radius: string;
  role: string | undefined | null;
  panelId: string;
  autoFocus: string | boolean;
  connectedSide?: 'top' | 'bottom';
}

export const SOLARIS_POPOVER_PANEL_DATA =
  new InjectionToken<SolarisPopoverPanelData>('SolarisPopoverPanelData');
