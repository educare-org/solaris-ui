import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import type { SolarisStepperActionsAlign } from '../../root/model/stepper.types';

@Component({
  selector: 'solaris-stepper-actions',
  standalone: true,
  templateUrl: './stepper-actions.component.html',
  styleUrls: ['./stepper-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-align]': 'align()',
    class: 'solaris-stepper-actions',
  },
})
export class SolarisStepperActionsComponent {
  readonly align = input<SolarisStepperActionsAlign>('end');
}
