import { Component } from '@angular/core';

@Component({
  selector: 'solaris-form-error',
  standalone: true,
  template: '<ng-content />',
  host: {
    class: 'solaris-form-error',
    role: 'alert',
  },
})
export class SolarisFormErrorComponent {}
