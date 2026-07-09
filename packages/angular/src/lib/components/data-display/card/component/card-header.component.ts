import { Component } from '@angular/core';

@Component({
  selector: 'solaris-card-header',
  standalone: true,
  template: '<ng-content />',
  host: {
    class: 'solaris-card-header',
  },
})
export class SolarisCardHeaderComponent {}
