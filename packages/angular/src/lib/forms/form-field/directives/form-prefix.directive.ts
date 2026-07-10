import { Directive } from '@angular/core';

@Directive({
  selector: '[solaris-form-prefix]',
  standalone: true,
  host: {
    class: 'solaris-form-prefix',
  },
})
export class SolarisFormPrefixDirective {}
