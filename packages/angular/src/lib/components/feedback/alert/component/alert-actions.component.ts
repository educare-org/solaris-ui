import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'solaris-alert-actions',
  standalone: true,
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-alert-actions',
  },
})
export class SolarisAlertActionsComponent {}
