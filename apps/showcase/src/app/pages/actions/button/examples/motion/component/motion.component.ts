import { Component, input } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-motion-button-example',
  imports: [SolarisButtonDirective, SolarisTranslatePipe],
  templateUrl: './motion.component.html',
})
export class MotionButtonExample {
  readonly loading = input(false);
  readonly longLabel = input(false);
}
