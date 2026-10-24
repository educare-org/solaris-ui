import {
  Component,
  input,
  output,
  computed,
  inject,
  signal,
  booleanAttribute,
  ChangeDetectionStrategy,
} from '@angular/core';

import {
  SolarisDropdownMenuComponent,
  SolarisDropdownMenuItemComponent,
  SolarisDropdownMenuTriggerDirective,
} from '../../../interaction/dropdown-menu';
import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisThemeService } from '../../../../services/theme';
import { SolarisIconComponent } from '../../../icon';
import { SEPARATOR_ICONS } from '../model/breadcrumb.types';

import type {
  SolarisBreadcrumbSize,
  SolarisBreadcrumbDensity,
  SolarisBreadcrumbSeparator,
  SolarisBreadcrumbOverflowPosition,
  SolarisBreadcrumbItem,
  SolarisBreadcrumbNavigateEvent,
  SolarisBreadcrumbEllipsisSlot,
  SolarisBreadcrumbVisibleSlot,
} from '../model/breadcrumb.types';

@Component({
  selector: 'solaris-breadcrumb',
  standalone: true,
  imports: [
    SolarisIconComponent,
    SolarisDropdownMenuComponent,
    SolarisDropdownMenuItemComponent,
    SolarisDropdownMenuTriggerDirective,
  ],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-breadcrumb',
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-separator]': 'separator()',
    '[attr.data-overflow]': 'overflowPosition()',
  },
})
export class SolarisBreadcrumbComponent {
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });
  protected readonly themeService = inject(SolarisThemeService);

  readonly items = input.required<SolarisBreadcrumbItem[]>();
  readonly size = input<SolarisBreadcrumbSize>('md');
  readonly density = input<SolarisBreadcrumbDensity>();
  readonly separator = input<SolarisBreadcrumbSeparator>('slash');
  readonly maxVisibleItems = input<number | null>(null);
  readonly overflowPosition = input<SolarisBreadcrumbOverflowPosition>('none');
  readonly showNavigation = input<boolean, boolean>(false, {
    transform: booleanAttribute,
  });
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelKey = input<string | undefined>(undefined);

  readonly effectiveDensity = computed(() => {
    return this.density() ?? this.themeService.density;
  });

  readonly navigate = output<SolarisBreadcrumbNavigateEvent>();
  readonly previous = output<void>();
  readonly next = output<void>();

  protected readonly overflowOpen = signal(false);

  protected readonly separatorIcon = computed(() => {
    return SEPARATOR_ICONS[this.separator()];
  });

  protected readonly slots = computed<SolarisBreadcrumbVisibleSlot[]>(() => {
    const items = this.items();
    const m = this.maxVisibleItems();
    const position = this.overflowPosition();

    if (m == null || position === 'none' || m >= items.length) {
      return items.map((item, index) => ({
        kind: 'item' as const,
        item,
        index,
      }));
    }

    const effectiveM = Math.max(2, Math.floor(m));
    const n = items.length;

    if (position === 'start') {
      const start = n - effectiveM;
      const hiddenItems = items.slice(0, start);
      const visible = items.slice(start);
      return [
        { kind: 'ellipsis', hiddenItems },
        ...visible.map((item, index) => ({
          kind: 'item' as const,
          item,
          index: start + index,
        })),
      ];
    }

    if (position === 'end') {
      const head = items.slice(0, effectiveM - 1);
      const hiddenItems = items.slice(effectiveM - 1, n - 1);
      const last = items[n - 1];
      return [
        ...head.map((item, index) => ({
          kind: 'item' as const,
          item,
          index,
        })),
        { kind: 'ellipsis', hiddenItems },
        { kind: 'item' as const, item: last, index: n - 1 },
      ];
    }

    const tailStart = n - (effectiveM - 1);
    const hiddenItems = items.slice(1, tailStart);
    const tail = items.slice(tailStart);
    return [
      { kind: 'item' as const, item: items[0], index: 0 },
      { kind: 'ellipsis', hiddenItems },
      ...tail.map((item, index) => ({
        kind: 'item' as const,
        item,
        index: tailStart + index,
      })),
    ];
  });

  protected readonly hiddenItems = computed<SolarisBreadcrumbItem[]>(() => {
    return this.slots()
      .filter(
        (slot): slot is SolarisBreadcrumbEllipsisSlot =>
          slot.kind === 'ellipsis',
      )
      .flatMap((slot) => slot.hiddenItems);
  });

  protected readonly currentIndex = computed(() => {
    const items = this.items();
    const found = items.findIndex((item) => item.current);
    return found >= 0 ? found : items.length - 1;
  });

  protected readonly canGoPrevious = computed(() => {
    const index = this.currentIndex();
    if (index <= 0) return false;
    return !this.items()[index - 1]?.disabled;
  });

  protected readonly canGoNext = computed(() => {
    const index = this.currentIndex();
    if (index >= this.items().length - 1) return false;
    return !this.items()[index + 1]?.disabled;
  });

  protected readonly resolvedLabel = computed(() => {
    if (this.ariaLabel()) return this.ariaLabel();
    const key = this.ariaLabelKey() ?? 'solaris.breadcrumb.label';
    return (
      this.resolveText(key) ?? (this.ariaLabelKey() ? undefined : 'Breadcrumb')
    );
  });

  protected readonly resolvedShowMoreLabel = computed(() => {
    return this.resolveText('solaris.breadcrumb.showMore') ?? 'Show more items';
  });

  protected readonly resolvedPreviousLabel = computed(() => {
    return this.resolveText('solaris.breadcrumb.previous') ?? 'Previous';
  });

  protected readonly resolvedNextLabel = computed(() => {
    return this.resolveText('solaris.breadcrumb.next') ?? 'Next';
  });

  protected resolveText(key: string): string | undefined {
    if (!this.translateService) return undefined;
    const translated = this.translateService.translate(key);
    return translated !== key ? translated : undefined;
  }

  protected itemLabel(item: SolarisBreadcrumbItem): string | undefined {
    if (item.label) return item.label;
    return this.resolveText(item.labelKey ?? '');
  }

  protected itemAriaLabel(item: SolarisBreadcrumbItem): string | undefined {
    return (
      this.itemLabel(item) ??
      this.resolveText(item.ariaLabelKey ?? '') ??
      item.ariaLabel
    );
  }

  protected isCurrent(item: SolarisBreadcrumbItem): boolean {
    return item.current === true;
  }

  protected isLink(item: SolarisBreadcrumbItem): boolean {
    return !!item.href && !item.disabled && !this.isCurrent(item);
  }

  protected isDisabled(item: SolarisBreadcrumbItem): boolean {
    return item.disabled === true && !this.isCurrent(item);
  }

  protected onItemClick(item: SolarisBreadcrumbItem, event: Event): void {
    if (item.disabled) return;
    this.navigate.emit({ item, event });
  }

  protected onOverflowItemSelect(item: SolarisBreadcrumbItem): void {
    if (item.disabled) return;
    this.navigate.emit({ item });
  }

  protected onPrevious(): void {
    if (!this.canGoPrevious()) return;
    this.previous.emit();
  }

  protected onNext(): void {
    if (!this.canGoNext()) return;
    this.next.emit();
  }
}
