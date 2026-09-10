import { Directive, booleanAttribute, input } from '@angular/core';

@Directive({
  selector: '[solaris-selection-card-header]',
  standalone: true,
  host: {
    class: 'solaris-selection-card-header',
    '[attr.data-separator]': "separator() ? '' : null",
  },
})
export class SolarisSelectionCardHeaderDirective {
  readonly separator = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
}
