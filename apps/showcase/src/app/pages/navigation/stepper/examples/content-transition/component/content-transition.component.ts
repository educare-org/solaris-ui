import { Component, signal } from '@angular/core';
import {
  SolarisStepperComponent,
  SolarisStepComponent,
  SolarisStepperContentComponent,
  SolarisStepperActionsComponent,
  SolarisButtonDirective,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-content-transition-stepper-example',
  imports: [
    SolarisStepperComponent,
    SolarisStepComponent,
    SolarisStepperContentComponent,
    SolarisStepperActionsComponent,
    SolarisButtonDirective,
  ],
  templateUrl: './content-transition.component.html',
  styleUrls: ['./content-transition.component.scss'],
})
export class ContentTransitionStepperExample {
  readonly activeStep = signal(0);
  readonly transition = signal<'none' | 'fade' | 'slide'>('fade');

  next(): void {
    if (this.activeStep() < 2) this.activeStep.set(this.activeStep() + 1);
  }

  prev(): void {
    if (this.activeStep() > 0) this.activeStep.set(this.activeStep() - 1);
  }
}
