import { Directive } from '@angular/core';

@Directive({
  selector: '[solaris-selection-card-header]',
  standalone: true,
  host: {
    class: 'solaris-selection-card-header',
  },
})
export class SolarisSelectionCardHeaderDirective {}
