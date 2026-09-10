import { Directive, booleanAttribute, input } from '@angular/core';

@Directive({
  selector: '[solaris-card-header]',
  standalone: true,
  host: {
    class: 'solaris-card-header',
    '[attr.data-separator]': "separator() ? '' : null",
  },
})
export class SolarisCardHeaderDirective {
  readonly separator = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
}
