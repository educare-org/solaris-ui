import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'solaris-stepper-content',
  standalone: true,
  templateUrl: './stepper-content.component.html',
  styleUrls: ['./stepper-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-stepper-content',
  },
})
export class SolarisStepperContentComponent {}
