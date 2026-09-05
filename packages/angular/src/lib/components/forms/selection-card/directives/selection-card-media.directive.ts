import { Directive } from '@angular/core';

@Directive({
  selector: '[solaris-selection-card-media]',
  standalone: true,
  host: {
    class: 'solaris-selection-card-media',
  },
})
export class SolarisSelectionCardMediaDirective {}
