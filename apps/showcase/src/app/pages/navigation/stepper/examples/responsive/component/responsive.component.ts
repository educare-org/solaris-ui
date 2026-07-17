import { Component } from '@angular/core';
import {
  SolarisStepperComponent,
  SolarisStepComponent,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-responsive-stepper-example',
  imports: [SolarisStepperComponent, SolarisStepComponent],
  templateUrl: './responsive.component.html',
  styleUrls: ['./responsive.component.scss'],
})
export class ResponsiveStepperExample {}
