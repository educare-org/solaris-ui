import { Directive, booleanAttribute, input } from '@angular/core';

@Directive({
  selector: '[solaris-selection-card-footer]',
  standalone: true,
  host: {
    class: 'solaris-selection-card-footer',
    '[attr.data-separator]': "separator() ? '' : null",
  },
})
export class SolarisSelectionCardFooterDirective {
  readonly separator = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
}
