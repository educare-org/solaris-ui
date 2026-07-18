import { Component, input } from '@angular/core';

let nextLabelId = 0;

@Component({
  selector: 'solaris-dropdown-menu-label',
  standalone: true,
  template:
    '<span class="solaris-dropdown-menu-label__text">{{ label() }}</span>',
  host: {
    '[id]': 'labelId',
    class: 'solaris-dropdown-menu-label',
  },
})
export class SolarisDropdownMenuLabelComponent {
  readonly label = input.required<string>();

  readonly labelId = `solaris-dropdown-menu-label-${++nextLabelId}`;
}
