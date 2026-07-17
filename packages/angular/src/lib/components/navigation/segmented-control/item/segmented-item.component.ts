import {
  input,
  inject,
  computed,
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';

import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisIconComponent } from '../../../icon';
import { SOLARIS_SEGMENTED_CONTROL } from '../token/segmented-control.tokens';

let nextId = 0;

@Component({
  selector: 'solaris-segmented-item',
  standalone: true,
  imports: [SolarisIconComponent],
  templateUrl: './segmented-item.component.html',
  styleUrls: ['./segmented-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'radio',
    '[attr.id]': 'itemId()',
    '(click)': 'onClick()',
    '(keydown)': 'onKeydown($event)',
    '[attr.data-selected]': 'isSelected()',
    '[attr.data-disabled]': 'isComputedDisabled()',
    '[attr.aria-checked]': 'isSelected()',
    '[attr.aria-disabled]': 'isComputedDisabled() || undefined',
    '[attr.aria-label]': 'resolvedAriaLabel() || undefined',
    '[attr.tabindex]': 'isTabstop() ? "0" : "-1"',
    '[class.solaris-segmented-item--icon-only]': 'isIconOnly()',
  },
})
export class SolarisSegmentedItemComponent {
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });
  private readonly control = inject(SOLARIS_SEGMENTED_CONTROL, {
    optional: true,
  });

  readonly value = input.required<unknown>();
  readonly label = input<string | undefined>(undefined);
  readonly labelKey = input<string | undefined>(undefined);
  readonly icon = input<string | undefined>(undefined);
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelKey = input<string | undefined>(undefined);

  protected readonly instanceId = `solaris-segmented-item-${nextId++}`;

  protected readonly itemId = computed(() => {
    const ctrl = this.control;
    if (ctrl) {
      return `solaris-segmented-item-${String(this.value())}`;
    }
    return this.instanceId;
  });

  readonly isSelected = computed(() => {
    if (!this.control) return false;
    return this.control.compareFn()(this.value(), this.control.value());
  });

  readonly isComputedDisabled = computed(() => {
    return this.disabled() || (this.control?.disabled() ?? false);
  });

  readonly isComputedReadonly = computed(() => {
    return this.control?.readonly() ?? false;
  });

  readonly isTabstop = computed(() => {
    if (this.isComputedDisabled()) return false;
    if (this.isSelected()) return true;
    if (!this.control) return false;
    const items = this.control.items();
    const firstEnabled = items.findIndex(
      (item) => !item.isComputedDisabled(),
    );
    return items.indexOf(this) === firstEnabled;
  });

  protected readonly isIconOnly = computed(() => {
    return !!this.icon() && !this.label() && !this.labelKey();
  });

  readonly resolvedLabel = computed(() => {
    if (this.label()) return this.label();
    const labelKey = this.labelKey();
    if (labelKey && this.translateService) {
      return this.translateService.translate(labelKey);
    }
    return labelKey ?? undefined;
  });

  protected readonly resolvedAriaLabel = computed(() => {
    if (this.ariaLabel()) return this.ariaLabel();
    const ariaLabelKey = this.ariaLabelKey();
    if (ariaLabelKey && this.translateService) {
      return this.translateService.translate(ariaLabelKey);
    }
    return undefined;
  });

  protected readonly index = computed(() => {
    if (!this.control) return -1;
    return this.control.items().indexOf(this);
  });

  protected onClick(): void {
    if (this.isComputedDisabled()) return;
    if (this.isComputedReadonly()) return;
    this.control?.selectItem(this);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (this.isComputedDisabled()) return;

    const items = this.control?.items() ?? [];
    const currentIndex = this.index();

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!this.isComputedReadonly()) {
        this.control?.selectItem(this);
      }
      return;
    }

    const nextIndex = this.getNextIndex(event.key, items, currentIndex);

    if (nextIndex === null || nextIndex === currentIndex) return;

    event.preventDefault();

    const nextItem = items[nextIndex];
    this.control?.focusItem(nextItem);
  }

  private getNextIndex(
    key: string,
    items: ReadonlyArray<SolarisSegmentedItemComponent>,
    currentIndex: number,
  ): number | null {
    const orientation = this.control?.orientation() ?? 'horizontal';

    switch (key) {
      case 'ArrowRight':
        return orientation === 'horizontal'
          ? this.findNextEnabled(items, currentIndex, 1)
          : null;

      case 'ArrowLeft':
        return orientation === 'horizontal'
          ? this.findNextEnabled(items, currentIndex, -1)
          : null;

      case 'ArrowDown':
        return orientation === 'vertical'
          ? this.findNextEnabled(items, currentIndex, 1)
          : null;

      case 'ArrowUp':
        return orientation === 'vertical'
          ? this.findNextEnabled(items, currentIndex, -1)
          : null;

      case 'Home':
        return this.findFirstEnabled(items);

      case 'End':
        return this.findLastEnabled(items);

      default:
        return null;
    }
  }

  private findNextEnabled(
    items: ReadonlyArray<SolarisSegmentedItemComponent>,
    fromIndex: number,
    direction: 1 | -1,
  ): number | null {
    let i = fromIndex + direction;
    while (i >= 0 && i < items.length) {
      if (!items[i].isComputedDisabled()) return i;
      i += direction;
    }
    return null;
  }

  private findFirstEnabled(
    items: ReadonlyArray<SolarisSegmentedItemComponent>,
  ): number | null {
    for (let i = 0; i < items.length; i++) {
      if (!items[i].isComputedDisabled()) return i;
    }
    return null;
  }

  private findLastEnabled(
    items: ReadonlyArray<SolarisSegmentedItemComponent>,
  ): number | null {
    for (let i = items.length - 1; i >= 0; i--) {
      if (!items[i].isComputedDisabled()) return i;
    }
    return null;
  }
}
