import { Component } from '@angular/core';
import {
  SolarisStepperComponent,
  SolarisStepComponent,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-icon-stepper-example',
  imports: [SolarisStepperComponent, SolarisStepComponent],
  templateUrl: './icon.component.html',
})
export class IconStepperExample {}
