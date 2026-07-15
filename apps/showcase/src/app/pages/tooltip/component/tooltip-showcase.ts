import { Component } from '@angular/core';
import {
  SolarisTooltipDirective,
  SolarisTranslatePipe,
  SolarisButtonDirective,
} from '@solaris-ui/angular';
import type {
  SolarisTooltipPlacement,
  SolarisTooltipAppearance,
  SolarisTooltipSize,
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

  protected readonly placements: SolarisTooltipPlacement[] = [
    'top',
    'top-start',
    'top-end',
    'bottom',
    'bottom-start',
    'bottom-end',
    'left',
    'left-start',
    'left-end',
    'right',
    'right-start',
    'right-end',
  ];

  protected readonly matrixAppearances: SolarisTooltipAppearance[] = [
    'outline',
    'surface',
    'inverse',
  ];

  protected readonly matrixSizes: SolarisTooltipSize[] = ['sm', 'md', 'lg'];

  protected onTooltipOpened(): void {
    this.clickTooltipOpen = true;
  }

  protected onTooltipClosed(): void {
    this.clickTooltipOpen = false;
  }
}
