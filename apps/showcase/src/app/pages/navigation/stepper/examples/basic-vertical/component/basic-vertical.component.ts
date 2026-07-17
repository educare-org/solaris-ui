import { Component } from '@angular/core';
import {
  SolarisStepperComponent,
  SolarisStepComponent,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-basic-vertical-stepper-example',
  imports: [SolarisStepperComponent, SolarisStepComponent],
  templateUrl: './basic-vertical.component.html',
})
export class BasicVerticalStepperExample {}
