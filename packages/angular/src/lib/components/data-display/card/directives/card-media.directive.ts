import { Directive } from '@angular/core';

@Directive({
  selector: '[solaris-card-media]',
  standalone: true,
  host: {
    class: 'solaris-card-media',
  },
})
export class SolarisCardMediaDirective {}
