import { Directive } from '@angular/core';

@Directive({
  selector: '[solaris-alert-title]',
  standalone: true,
  host: {
    class: 'solaris-alert-title',
  },
})
export class SolarisAlertTitleDirective {}
