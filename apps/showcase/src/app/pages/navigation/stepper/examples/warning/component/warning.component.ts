import { Component } from '@angular/core';
import {
  SolarisStepperComponent,
  SolarisStepComponent,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-warning-stepper-example',
  imports: [SolarisStepperComponent, SolarisStepComponent],
  templateUrl: './warning.component.html',
})
export class WarningStepperExample {}
