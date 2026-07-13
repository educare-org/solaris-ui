import { InjectionToken, TemplateRef } from '@angular/core';

export interface SolarisTooltipPanelData {
  title: string | undefined;
  body: string | undefined;
  icon: string | undefined;
  iconDecorative: boolean;
  contentTemplate: TemplateRef<unknown> | undefined;
  appearance: string;
  size: string;
  radius: string;
  maxWidth: string | number;
  arrow: boolean;
  arrowClass: string;
  closeable: boolean;
  closeLabel: string;
  panelId: string;
  placement: string;
  trigger: string;
  close: () => void;
}

export const SOLARIS_TOOLTIP_PANEL_DATA =
  new InjectionToken<SolarisTooltipPanelData>('SolarisTooltipPanelData');
