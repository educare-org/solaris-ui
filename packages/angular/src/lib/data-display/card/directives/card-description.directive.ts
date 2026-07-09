import { Directive } from '@angular/core';

@Directive({
  selector: '[solaris-card-description]',
  standalone: true,
  host: {
    class: 'solaris-card-description',
  },
})
export class SolarisCardDescriptionDirective {}
