import { Component } from '@angular/core';
import {
  SolarisStepperComponent,
  SolarisStepComponent,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-basic-horizontal-stepper-example',
  imports: [SolarisStepperComponent, SolarisStepComponent],
  templateUrl: './basic-horizontal.component.html',
})
export class BasicHorizontalStepperExample {}
