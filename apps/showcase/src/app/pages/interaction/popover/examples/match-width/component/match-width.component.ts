import { Component } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisPopoverDirective,
  SolarisPopoverTriggerDirective,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-popover-match-width-example',
  imports: [
    SolarisButtonDirective,
    SolarisPopoverDirective,
    SolarisPopoverTriggerDirective,
    SolarisTranslatePipe,
  ],
  templateUrl: './match-width.component.html',
})
export class PopoverMatchWidthExample {}
