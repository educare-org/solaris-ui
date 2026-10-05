import { Component } from '@angular/core';

import {
  SolarisAvatarComponent,
  SolarisTooltipDirective,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-avatar-tooltip-example',
  imports: [
    SolarisAvatarComponent,
    SolarisTooltipDirective,
    SolarisTranslatePipe,
  ],
  templateUrl: './avatar-tooltip.component.html',
})
export class AvatarTooltipExample {}
