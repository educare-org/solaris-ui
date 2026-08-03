import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'solaris-form-hint',
  standalone: true,
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-form-hint',
  },
})
export class SolarisFormHintComponent {}
