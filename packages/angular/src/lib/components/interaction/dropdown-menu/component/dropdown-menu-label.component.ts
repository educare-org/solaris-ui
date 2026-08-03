import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { nextIdFor } from '../../../../core';

@Component({
  selector: 'solaris-dropdown-menu-label',
  standalone: true,
  templateUrl: './dropdown-menu-label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[id]': 'labelId',
    class: 'solaris-dropdown-menu-label',
  },
})
export class SolarisDropdownMenuLabelComponent {
  readonly label = input.required<string>();

  readonly labelId = nextIdFor('solaris-dropdown-menu-label');
}
