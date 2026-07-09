import { Component } from '@angular/core';

@Component({
  selector: 'solaris-card-actions',
  standalone: true,
  template: '<ng-content />',
  host: {
    class: 'solaris-card-actions',
  },
})
export class SolarisCardActionsComponent {}
