import { Directive } from '@angular/core';

@Directive({
  selector: '[solaris-form-suffix-action]',
  standalone: true,
  host: {
    class: 'solaris-form-suffix-action',
  },
})
export class SolarisFormSuffixActionDirective {}
