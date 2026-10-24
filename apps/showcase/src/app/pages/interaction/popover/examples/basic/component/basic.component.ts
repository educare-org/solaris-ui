import { Component } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisPopoverDirective,
  SolarisPopoverTriggerDirective,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-popover-basic-example',
  imports: [
    SolarisButtonDirective,
    SolarisPopoverDirective,
    SolarisPopoverTriggerDirective,
    SolarisTranslatePipe,
  ],
  templateUrl: './basic.component.html',
})
export class PopoverBasicExample {}
