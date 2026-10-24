import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  SolarisButtonDirective,
  SolarisCheckboxComponent,
  SolarisStepComponent,
  SolarisStepperActionsComponent,
  SolarisStepperComponent,
  SolarisStepperContentComponent,
  SolarisTranslatePipe,
  type SolarisStepperBlockedEvent,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-validation-stepper-example',
  imports: [
    FormsModule,
    SolarisButtonDirective,
    SolarisCheckboxComponent,
    SolarisStepComponent,
    SolarisStepperActionsComponent,
    SolarisStepperComponent,
    SolarisStepperContentComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.scss'],
})
export class ValidationStepperExample {
  protected readonly activeStep = signal(0);
  protected readonly accountError = signal(false);
  protected confirmed = false;

  protected canLeaveAccount = (): boolean => this.confirmed;

  protected onBlocked(event: SolarisStepperBlockedEvent): void {
    if (event.reason === 'exit' && event.from === 0) {
      this.accountError.set(true);
    }
  }

  protected onConfirmedChange(): void {
    this.accountError.set(false);
  }
}
