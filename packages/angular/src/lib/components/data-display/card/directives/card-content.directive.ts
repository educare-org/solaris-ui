import { Directive } from '@angular/core';

@Directive({
  selector: '[solaris-card-content]',
  standalone: true,
  host: {
    class: 'solaris-card-content',
  },
})
export class SolarisCardContentDirective {}
