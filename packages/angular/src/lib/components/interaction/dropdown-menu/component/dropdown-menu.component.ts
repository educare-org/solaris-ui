import {
  Component,
  input,
  contentChildren,
  signal,
  computed,
  viewChild,
  TemplateRef,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';

import { SolarisThemeService } from '../../../../services/theme';

import {
  SOLARIS_DROPDOWN_NAVIGABLE_ITEM,
  type SolarisDropdownNavigableItem,
} from '../model/dropdown-menu-navigation';

import type {
  SolarisDropdownMenuSize,
  SolarisDropdownMenuDensity,
} from '../model/dropdown-menu.types';
import { nextIdFor } from '../../../../core';

@Component({
  selector: 'solaris-dropdown-menu',
  standalone: true,
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[id]': 'panelId',
    '[attr.role]': '"menu"',
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'effectiveDensity()',
  },
})
export class SolarisDropdownMenuComponent {
  readonly size = input<SolarisDropdownMenuSize>('md');
  readonly density = input<SolarisDropdownMenuDensity>();

  protected readonly themeService = inject(SolarisThemeService);

  protected readonly effectiveDensity = computed(() => {
    return this.density() ?? this.themeService.density;
  });

  readonly navigableItems = contentChildren<SolarisDropdownNavigableItem>(
    SOLARIS_DROPDOWN_NAVIGABLE_ITEM,
  );

  readonly contentTemplate = viewChild.required('contentTmpl', {
    read: TemplateRef,
  });

  readonly panelId = nextIdFor('solaris-dropdown-menu');

  readonly focusedIndex = signal(-1);

  readonly enabledNavigableItems = computed(() => {
    return this.navigableItems().filter((item) => !item.disabled());
  });

  focusFirstItem(): void {
    const enabled = this.enabledNavigableItems();
    if (enabled.length > 0) {
      const idx = this.navigableItems().indexOf(enabled[0]);
      this.focusedIndex.set(idx);
      enabled[0].focus();
    }
  }

  focusLastItem(): void {
    const enabled = this.enabledNavigableItems();
    const last = enabled.at(-1);
    if (last) {
      const idx = this.navigableItems().indexOf(last);
      this.focusedIndex.set(idx);
      last.focus();
    }
  }

  focusNextItem(): void {
    const items = this.navigableItems();
    const enabled = this.enabledNavigableItems();
    if (enabled.length === 0) return;

    const currentFocused = this.focusedIndex();
    const currentFocusedItem =
      currentFocused >= 0 ? items[currentFocused] : null;

    let currentEnabledIndex = -1;
    if (currentFocusedItem) {
      currentEnabledIndex = enabled.indexOf(currentFocusedItem);
    }

    const nextEnabledIndex = (currentEnabledIndex + 1) % enabled.length;
    const nextItem = enabled[nextEnabledIndex];
    const nextItemIndex = items.indexOf(nextItem);
    this.focusedIndex.set(nextItemIndex);
    nextItem.focus();
  }

  focusPreviousItem(): void {
    const items = this.navigableItems();
    const enabled = this.enabledNavigableItems();
    if (enabled.length === 0) return;

    const currentFocused = this.focusedIndex();
    const currentFocusedItem =
      currentFocused >= 0 ? items[currentFocused] : null;

    let currentEnabledIndex = -1;
    if (currentFocusedItem) {
      currentEnabledIndex = enabled.indexOf(currentFocusedItem);
    }

    const prevEnabledIndex =
      currentEnabledIndex <= 0 ? enabled.length - 1 : currentEnabledIndex - 1;
    const prevItem = enabled[prevEnabledIndex];
    const prevItemIndex = items.indexOf(prevItem);
    this.focusedIndex.set(prevItemIndex);
    prevItem.focus();
  }

  focusItemByLabel(label: string): void {
    const enabled = this.enabledNavigableItems();
    const lowerLabel = label.toLowerCase();
    const match = enabled.find((item) => {
      const itemLabel = item.label();
      return itemLabel?.toLowerCase().startsWith(lowerLabel);
    });
    if (match) {
      const idx = this.navigableItems().indexOf(match);
      this.focusedIndex.set(idx);
      match.focus();
    }
  }

  activateFocusedItem(): void {
    const items = this.navigableItems();
    const idx = this.focusedIndex();
    if (idx >= 0 && idx < items.length) {
      const item = items[idx];
      if (!item.disabled()) {
        item.handleClick();
      }
    }
  }
}
