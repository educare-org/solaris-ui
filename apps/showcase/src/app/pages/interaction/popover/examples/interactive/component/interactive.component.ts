import { Component } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisPopoverDirective,
  SolarisPopoverTriggerDirective,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-popover-interactive-example',
  imports: [
    SolarisButtonDirective,
    SolarisPopoverDirective,
    SolarisPopoverTriggerDirective,
    SolarisTranslatePipe,
  ],
  templateUrl: './interactive.component.html',
})
export class PopoverInteractiveExample {
  protected logAction(action: string): void {
    console.log(`Popover action: ${action}`);
  }
}
