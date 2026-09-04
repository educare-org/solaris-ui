import { Directive } from '@angular/core';

@Directive({
  selector: '[solaris-selection-card-content]',
  standalone: true,
  host: {
    class: 'solaris-selection-card-content',
  },
})
export class SolarisSelectionCardContentDirective {}
