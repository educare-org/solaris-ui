import { Directive } from '@angular/core';

@Directive({
  selector: '[solaris-form-label-action]',
  standalone: true,
  host: {
    class: 'solaris-form-label-action',
  },
})
export class SolarisFormLabelActionDirective {}
