import { Component } from '@angular/core';

@Component({
  selector: 'solaris-form-label',
  standalone: true,
  template: '<ng-content />',
  host: {
    class: 'solaris-form-label',
  },
})
export class SolarisFormLabelComponent {}
