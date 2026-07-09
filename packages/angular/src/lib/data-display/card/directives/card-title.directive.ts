import { Directive } from '@angular/core';

@Directive({
  selector: '[solaris-card-title]',
  standalone: true,
  host: {
    class: 'solaris-card-title',
  },
})
export class SolarisCardTitleDirective {}
