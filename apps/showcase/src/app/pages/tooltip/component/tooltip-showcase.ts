import { Component } from '@angular/core';
import {
  SolarisTooltipDirective,
  SolarisTranslatePipe,
  SolarisButtonDirective,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [
    SolarisTooltipDirective,
    SolarisButtonDirective,
    SolarisTranslatePipe,
  ],
  templateUrl: './tooltip-showcase.html',
  styleUrls: ['./tooltip-showcase.scss'],
})
export class TooltipShowcasePage {
  protected showArrow = true;
  protected appearance: 'outline' | 'surface' | 'inverse' = 'outline';
  protected size: 'sm' | 'md' | 'lg' = 'sm';
  protected radius: 'sm' | 'md' | 'lg' = 'md';
  protected placement = 'top';
  protected tooltipDisabled = false;
  protected clickTooltipOpen = false;

  protected onTooltipOpened(): void {
    this.clickTooltipOpen = true;
  }

  protected onTooltipClosed(): void {
    this.clickTooltipOpen = false;
  }
}
