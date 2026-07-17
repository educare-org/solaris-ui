import { Component, signal } from '@angular/core';
import {
  SolarisStepperComponent,
  SolarisStepComponent,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-optional-step-example',
  imports: [SolarisStepperComponent, SolarisStepComponent],
  templateUrl: './optional.component.html',
})
export class OptionalStepExample {
  readonly activeIndex = signal(1);
}
