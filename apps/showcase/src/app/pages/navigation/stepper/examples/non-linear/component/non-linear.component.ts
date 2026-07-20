import { Component, signal } from '@angular/core';
import {
  SolarisStepperComponent,
  SolarisStepComponent,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-non-linear-stepper-example',
  imports: [SolarisStepperComponent, SolarisStepComponent],
  templateUrl: './non-linear.component.html',
  styleUrls: ['./non-linear.component.scss'],
})
export class NonLinearStepperExample {
  readonly activeIndex = signal(2);
}
