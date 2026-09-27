import { Component } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisTooltipDirective,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-tooltip-click-closeable-example',
  imports: [
    SolarisButtonDirective,
    SolarisTooltipDirective,
    SolarisTranslatePipe,
  ],
  templateUrl: './click-closeable.component.html',
})
export class TooltipClickCloseableExample {}
