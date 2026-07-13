import { Directive } from '@angular/core';

@Directive({
  selector: '[solaris-form-suffix]',
  standalone: true,
  host: {
    class: 'solaris-form-suffix',
  },
})
export class SolarisFormSuffixDirective {}
