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
  selector: 'app-wizard-stepper-example',
  imports: [
    SolarisStepperComponent,
    SolarisStepComponent,
    SolarisStepperContentComponent,
    SolarisStepperActionsComponent,
    SolarisButtonDirective,
  ],
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
})
export class WizardStepperExample {
  readonly activeStep = signal(0);

  next(): void {
    if (this.activeStep() < 2) {
      this.activeStep.set(this.activeStep() + 1);
    }
  }

  prev(): void {
    if (this.activeStep() > 0) {
      this.activeStep.set(this.activeStep() - 1);
    }
  }
}
