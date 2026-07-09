import { Component } from '@angular/core';

@Component({
  selector: 'solaris-card-content',
  standalone: true,
  template: '<ng-content />',
  host: {
    class: 'solaris-card-content',
  },
})
export class SolarisCardContentComponent {}
