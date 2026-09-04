import { Directive } from '@angular/core';

@Directive({
  selector: '[solaris-selection-card-description]',
  standalone: true,
  host: {
    class: 'solaris-selection-card-description',
  },
})
export class SolarisSelectionCardDescriptionDirective {}
