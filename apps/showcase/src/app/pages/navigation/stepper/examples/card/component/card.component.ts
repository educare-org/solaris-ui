import { Component } from '@angular/core';
import {
  SolarisStepperComponent,
  SolarisStepComponent,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-card-stepper-example',
  imports: [SolarisStepperComponent, SolarisStepComponent],
  templateUrl: './card.component.html',
})
export class CardStepperExample {}
