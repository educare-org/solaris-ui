import { Directive } from '@angular/core';

@Directive({
  selector: '[solaris-card-actions]',
  standalone: true,
  host: {
    class: 'solaris-card-actions',
  },
})
export class SolarisCardActionsDirective {}
