import { Component } from '@angular/core';
import {
  SolarisStepperComponent,
  SolarisStepComponent,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-dashed-stepper-example',
  imports: [SolarisStepperComponent, SolarisStepComponent],
  templateUrl: './dashed.component.html',
})
export class DashedStepperExample {}
