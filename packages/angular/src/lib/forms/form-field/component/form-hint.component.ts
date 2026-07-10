import { Component } from '@angular/core';

@Component({
  selector: 'solaris-form-hint',
  standalone: true,
  template: '<ng-content />',
  host: {
    class: 'solaris-form-hint',
  },
})
export class SolarisFormHintComponent {}
