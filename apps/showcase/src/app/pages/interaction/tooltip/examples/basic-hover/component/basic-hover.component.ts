import { Component } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisTooltipDirective,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-tooltip-basic-hover-example',
  imports: [
    SolarisButtonDirective,
    SolarisTooltipDirective,
    SolarisTranslatePipe,
  ],
  templateUrl: './basic-hover.component.html',
})
export class TooltipBasicHoverExample {}
