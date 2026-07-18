import {
  Component,
  input,
  ChangeDetectionStrategy,
  TemplateRef,
  contentChild,
} from '@angular/core';

import type { SolarisEditableTabAction } from '../model/editable-tabs.types';

@Component({
  selector: 'solaris-editable-tab',
  standalone: true,
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-editable-tab',
    '[attr.data-value]': 'value()',
    '[attr.data-locked]': 'locked() ? "" : null',
  },
})
export class SolarisEditableTabComponent {
  readonly value = input.required<unknown>();
  readonly locked = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly icon = input<string | undefined>(undefined);
  readonly label = input<string | undefined>(undefined);
  readonly labelKey = input<string | undefined>(undefined);
  readonly movable = input<boolean | undefined>(undefined);
  readonly removable = input<boolean | undefined>(undefined);
  readonly renamable = input<boolean | undefined>(undefined);
  readonly defaultable = input<boolean | undefined>(undefined);
  readonly badge = input<string | number | undefined>(undefined);
  readonly customActions = input<SolarisEditableTabAction[] | undefined>(undefined);

  readonly content = contentChild(TemplateRef);
}
