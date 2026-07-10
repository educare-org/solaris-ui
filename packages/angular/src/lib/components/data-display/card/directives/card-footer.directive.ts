import { Directive, input } from '@angular/core';

@Directive({
  selector: '[solaris-card-footer]',
  standalone: true,
  host: {
    class: 'solaris-card-footer',
    '[attr.data-separator]': "separator() ? '' : null",
  },
})
export class SolarisCardFooterDirective {
  readonly separator = input<boolean>(false);
}
