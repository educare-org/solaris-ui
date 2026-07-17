import { Component, signal } from '@angular/core';
import {
  SolarisStepperComponent,
  SolarisStepComponent,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-linear-stepper-example',
  imports: [SolarisStepperComponent, SolarisStepComponent],
  templateUrl: './linear.component.html',
  styleUrls: ['./linear.component.scss'],
})
export class LinearStepperExample {
  readonly activeIndex = signal(2);
}
