import { Component, input } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisButtonGroupComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-motion-button-group-example',
  imports: [
    SolarisButtonDirective,
    SolarisButtonGroupComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './motion.component.html',
})
export class MotionButtonGroupExample {
  readonly loading = input(false);
}
