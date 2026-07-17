import { Component } from '@angular/core';
import {
  SolarisStepperComponent,
  SolarisStepComponent,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-error-stepper-example',
  imports: [SolarisStepperComponent, SolarisStepComponent],
  templateUrl: './error.component.html',
})
export class ErrorStepperExample {}
