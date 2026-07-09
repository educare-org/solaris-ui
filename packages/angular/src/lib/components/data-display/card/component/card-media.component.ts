import { Component } from '@angular/core';

@Component({
  selector: 'solaris-card-media',
  standalone: true,
  template: '<ng-content />',
  host: {
    class: 'solaris-card-media',
  },
})
export class SolarisCardMediaComponent {}
