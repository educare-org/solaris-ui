import { Directive } from '@angular/core';

@Directive({
  selector: '[solaris-alert-description]',
  standalone: true,
  host: {
    class: 'solaris-alert-description',
  },
})
export class SolarisAlertDescriptionDirective {}
