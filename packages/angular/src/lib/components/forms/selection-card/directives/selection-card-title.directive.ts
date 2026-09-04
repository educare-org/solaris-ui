import { Directive } from '@angular/core';

@Directive({
  selector: '[solaris-selection-card-title]',
  standalone: true,
  host: {
    class: 'solaris-selection-card-title',
  },
})
export class SolarisSelectionCardTitleDirective {}
