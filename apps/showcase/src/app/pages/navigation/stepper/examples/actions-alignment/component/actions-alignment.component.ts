import { Component, signal } from '@angular/core';
import {
  SolarisStepperComponent,
  SolarisStepComponent,
  SolarisStepperActionsComponent,
  SolarisButtonDirective,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-actions-alignment-stepper-example',
  imports: [
    SolarisStepperComponent,
    SolarisStepComponent,
    SolarisStepperActionsComponent,
    SolarisButtonDirective,
  ],
  templateUrl: './actions-alignment.component.html',
  styleUrls: ['./actions-alignment.component.scss'],
})
export class ActionsAlignmentStepperExample {
  readonly align = signal<'start' | 'center' | 'end' | 'space-between'>('end');
}
