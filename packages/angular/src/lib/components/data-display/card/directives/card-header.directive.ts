import { Directive } from '@angular/core';

@Directive({
  selector: '[solaris-card-header]',
  standalone: true,
  host: {
    class: 'solaris-card-header',
  },
})
export class SolarisCardHeaderDirective {}
