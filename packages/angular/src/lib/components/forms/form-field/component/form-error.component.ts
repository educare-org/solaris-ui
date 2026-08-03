import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'solaris-form-error',
  standalone: true,
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-form-error',
    role: 'alert',
  },
})
export class SolarisFormErrorComponent {}
