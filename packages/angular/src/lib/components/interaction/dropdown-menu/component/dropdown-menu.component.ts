import {
  Component,
  input,
  contentChildren,
  signal,
  computed,
  viewChild,
  TemplateRef,
} from '@angular/core';

import { SolarisDropdownMenuItemComponent } from './dropdown-menu-item.component';

import type {
  SolarisDropdownMenuSize,
  SolarisDropdownMenuDensity,
} from '../model/dropdown-menu.types';

let nextId = 0;

@Component({
  selector: 'solaris-dropdown-menu',
  standalone: true,
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.scss'],
  host: {
    '[id]': 'panelId',
    '[attr.role]': '"menu"',
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'density()',
  },
})
export class SolarisDropdownMenuComponent {
  readonly size = input<SolarisDropdownMenuSize>('md');
  readonly density = input<SolarisDropdownMenuDensity>('comfortable');

  readonly items = contentChildren(SolarisDropdownMenuItemComponent);

  readonly contentTemplate = viewChild.required('contentTmpl', {
    read: TemplateRef,
  });

  readonly panelId = `solaris-dropdown-menu-${++nextId}`;

  readonly focusedIndex = signal(-1);

  readonly enabledItems = computed(() => {
    return this.items().filter((item) => !item.disabled());
  });

  focusFirstItem(): void {
    const enabled = this.enabledItems();
    if (enabled.length > 0) {
      const idx = this.items().indexOf(enabled[0]);
      this.focusedIndex.set(idx);
      enabled[0].focus();
    }
  }

  focusLastItem(): void {
    const enabled = this.enabledItems();
    const last = enabled.at(-1);
    if (last) {
      const idx = this.items().indexOf(last);
      this.focusedIndex.set(idx);
      last.focus();
    }
  }

  focusNextItem(): void {
    const items = this.items();
    const enabled = this.enabledItems();
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
    const items = this.items();
    const enabled = this.enabledItems();
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
    const enabled = this.enabledItems();
    const lowerLabel = label.toLowerCase();
    const match = enabled.find((item) => {
      const itemLabel = item.label();
      return itemLabel?.toLowerCase().startsWith(lowerLabel);
    });
    if (match) {
      const idx = this.items().indexOf(match);
      this.focusedIndex.set(idx);
      match.focus();
    }
  }

  activateFocusedItem(): void {
    const items = this.items();
    const idx = this.focusedIndex();
    if (idx >= 0 && idx < items.length) {
      const item = items[idx];
      if (!item.disabled()) {
        item.handleClick();
      }
    }
  }
}
