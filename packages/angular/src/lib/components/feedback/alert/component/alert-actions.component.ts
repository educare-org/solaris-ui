import { Component } from '@angular/core';

@Component({
  selector: 'solaris-alert-actions',
  standalone: true,
  template: '<ng-content />',
  host: {
    class: 'solaris-alert-actions',
  },
})
export class SolarisAlertActionsComponent {}
