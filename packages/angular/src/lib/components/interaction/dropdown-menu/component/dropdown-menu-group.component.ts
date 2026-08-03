import {
  Component,
  contentChild,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';

import { SolarisDropdownMenuLabelComponent } from './dropdown-menu-label.component';

let nextGroupId = 0;

@Component({
  selector: 'solaris-dropdown-menu-group',
  standalone: true,
  templateUrl: './dropdown-menu-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.role]': 'computedRole()',
    '[id]': 'groupId',
    class: 'solaris-dropdown-menu-group',
    '[attr.aria-labelledby]': 'labelId()',
  },
})
export class SolarisDropdownMenuGroupComponent {
  readonly labelChild = contentChild(SolarisDropdownMenuLabelComponent);

  readonly groupId = `solaris-dropdown-menu-group-${++nextGroupId}`;

  protected readonly labelId = computed<string | null>(() => {
    const label = this.labelChild();
    return label ? label.labelId : null;
  });

  protected readonly computedRole = computed<string | null>(() => {
    return this.labelId() ? 'group' : null;
  });
}
