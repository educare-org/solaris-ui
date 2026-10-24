import { Component } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisTooltipDirective,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-tooltip-disabled-wrapper-example',
  imports: [
    SolarisButtonDirective,
    SolarisTooltipDirective,
    SolarisTranslatePipe,
  ],
  templateUrl: './disabled-wrapper.component.html',
})
export class TooltipDisabledWrapperExample {}
