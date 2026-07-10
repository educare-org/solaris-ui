import { Directive } from '@angular/core';

@Directive({
  selector: '[solaris-icon-button-badge]',
  standalone: true,
  host: {
    class: 'solaris-icon-button-badge',
  },
})
export class SolarisIconButtonBadgeDirective {}
