import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { SolarisIconComponent } from '../../../icon';

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
  private readonly cdr = inject(ChangeDetectorRef);

  updatePlacement(placement: string, arrowClass: string): void {
    this.data.placement = placement;
    this.data.arrowClass = arrowClass;
    this.cdr.markForCheck();
  }
}
