import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'solaris-form-label',
  standalone: true,
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-form-label',
  },
})
export class SolarisFormLabelComponent {}
