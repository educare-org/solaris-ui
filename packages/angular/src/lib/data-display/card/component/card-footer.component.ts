import { Component, input } from '@angular/core';

@Component({
  selector: 'solaris-card-footer',
  standalone: true,
  template: '<ng-content />',
  host: {
    class: 'solaris-card-footer',
    '[attr.data-separator]': "separator() ? '' : null",
  },
})
export class SolarisCardFooterComponent {
  readonly separator = input<boolean>(false);
}
