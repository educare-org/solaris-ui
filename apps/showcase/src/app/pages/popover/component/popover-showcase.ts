import { Component } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisPopoverDirective,
  SolarisPopoverTriggerDirective,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [
    SolarisButtonDirective,
    SolarisPopoverDirective,
    SolarisPopoverTriggerDirective,
    SolarisTranslatePipe,
  ],
  templateUrl: './popover-showcase.html',
  styleUrls: ['./popover-showcase.scss'],
})
export class PopoverShowcasePage {
  protected popoverContent = 'This is the popover content area.';

  protected logAction(action: string): void {
    console.log(`Popover action: ${action}`);
  }

  protected customWidth = false;
  protected customMinWidth: string | undefined;
  protected customMaxWidth: string | undefined;
  protected appearance: 'surface' | 'outline' = 'surface';
  protected padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
  protected radius: 'none' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  protected placement: 'top' | 'right' | 'bottom' | 'left' = 'bottom';
  protected align: 'start' | 'center' | 'end' = 'start';

  protected reactivePopoverOpen = false;

  protected toggleReactivePopover(): void {
    this.reactivePopoverOpen = !this.reactivePopoverOpen;
  }
}
