import { Component, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { SolarisIconComponent } from '../../../components/icon/component/solaris-icon.component';

import {
  SOLARIS_TOOLTIP_PANEL_DATA,
  type SolarisTooltipPanelData,
} from '../token/tooltip.tokens';

@Component({
  selector: 'solaris-tooltip-panel',
  standalone: true,
  imports: [NgTemplateOutlet, SolarisIconComponent],
  templateUrl: './tooltip-panel.component.html',
  styleUrls: ['./tooltip-panel.component.scss'],
  host: {
    class: 'solaris-tooltip-panel',
  },
})
export class SolarisTooltipPanelComponent {
  readonly data: SolarisTooltipPanelData = inject(SOLARIS_TOOLTIP_PANEL_DATA);
}
