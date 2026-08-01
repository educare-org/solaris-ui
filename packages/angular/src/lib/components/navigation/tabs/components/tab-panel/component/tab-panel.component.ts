import {
  Component,
  input,
  computed,
  signal,
  inject,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core';

import { SOLARIS_TABS } from '../../../token/tabs.tokens';
import { nextIdFor } from '../../../../../../core/utils/id';

@Component({
  selector: 'solaris-tab-panel',
  standalone: true,
  imports: [],
  templateUrl: './tab-panel.component.html',
  styleUrls: ['./tab-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'tabpanel',
    '[attr.id]': 'panelId()',
    '[hidden]': '!isActive()',
    '[attr.data-active]': 'isActive()',
    '[attr.aria-labelledby]': 'tabId()',
  },
})
export class SolarisTabPanelComponent {
  private readonly tabsControl = inject(SOLARIS_TABS, { optional: true });

  readonly value = input.required<string | number>();
  readonly lazy = input<boolean>(false);

  protected readonly instanceId = nextIdFor('solaris-tab-panel');

  protected readonly panelId = computed(() => {
    if (this.tabsControl) {
      return this.tabsControl.generatePanelId(this.value());
    }
    return `${this.instanceId}-panel`;
  });

  protected readonly tabId = computed(() => {
    if (this.tabsControl) {
      return this.tabsControl.generateTabId(this.value());
    }
    return `${this.instanceId}-tab`;
  });

  protected readonly isActive = computed(() => {
    if (!this.tabsControl) return false;
    return this.tabsControl.value() === this.value();
  });

  protected readonly hasBeenActivated = signal(false);

  constructor() {
    effect(() => {
      if (this.isActive()) {
        this.hasBeenActivated.set(true);
      }
    });
  }

  protected readonly showContent = computed(() => {
    if (!this.lazy()) return true;
    if (this.isActive()) return true;
    return this.hasBeenActivated();
  });
}
