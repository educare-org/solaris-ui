import { Directive } from '@angular/core';

@Directive({
  selector: '[solaris-button-icon]',
  standalone: true,
  host: {
    class: 'solaris-button-icon',
  },
})
export class SolarisButtonIconDirective {}
