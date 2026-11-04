import { Component, input } from '@angular/core';

import {
  SolarisBadgeComponent,
  SolarisIconButtonBadgeDirective,
  SolarisIconButtonDirective,
  SolarisIconComponent,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-motion-icon-button-example',
  imports: [
    SolarisBadgeComponent,
    SolarisIconButtonBadgeDirective,
    SolarisIconButtonDirective,
    SolarisIconComponent,
  ],
  templateUrl: './motion.component.html',
})
export class MotionIconButtonExample {
  readonly loading = input(false);
  readonly showBadge = input(true);
}
