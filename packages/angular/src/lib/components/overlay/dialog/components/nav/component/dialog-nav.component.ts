import {
  Component,
  input,
  output,
  model,
  computed,
  inject,
  linkedSignal,
  contentChildren,
  ChangeDetectionStrategy,
  ElementRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { SolarisTranslateService } from '../../../../../../services/translation';
import { SolarisThemeService } from '../../../../../../services/theme';
import { SolarisIconComponent } from '../../../../../icon';
import { SolarisSelectComponent } from '../../../../../forms/select';
import { SolarisOptionComponent } from '../../../../../forms/option';
import { SolarisOptionLeadingDirective } from '../../../../../forms/option';
import { SolarisDialogNavContentDirective } from '../directives/dialog-nav-content.directive';
import {
  isDialogNavItemClickable,
  resolveDialogNavItemState,
  findDialogNavFocusableSection,
  findDialogNavIndexByValue,
} from '../functions/dialog-nav.functions';

import type {
  SolarisDialogNavItem,
  SolarisDialogNavStepChange,
} from '../model/dialog-nav.types';

@Component({
  selector: 'solaris-dialog-nav',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    SolarisIconComponent,
    SolarisSelectComponent,
    SolarisOptionComponent,
    SolarisOptionLeadingDirective,
  ],
  templateUrl: './dialog-nav.component.html',
  styleUrls: ['./dialog-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-dialog-nav',
    '[attr.data-density]': 'effectiveDensity()',
  },
})
export class SolarisDialogNavComponent {
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });
  private readonly themeService = inject(SolarisThemeService, {
    optional: true,
  });
  private readonly hostElement =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  /** Sections in display order. */
  readonly items = input.required<SolarisDialogNavItem[]>();
  /** Zero-based index of the visible section. Two-way bindable. */
  readonly activeStep = model<number>(0);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelKey = input<string | undefined>(undefined);
  /** Accessible name for the mobile section select (small viewports). */
  readonly selectLabel = input<string | undefined>(undefined);
  /** Translation key for the mobile section select name. */
  readonly selectLabelKey = input<string | undefined>(undefined);

  readonly stepChange = output<SolarisDialogNavStepChange>();

  readonly contents = contentChildren(SolarisDialogNavContentDirective);

  readonly effectiveDensity = computed(() => {
    return this.themeService?.density ?? 'normal';
  });

  /**
   * Roving tabindex: the only tabbable section button.
   * Follows programmatic `activeStep` changes; arrow keys move it
   * without changing the selection.
   */
  protected readonly focusedIndex = linkedSignal(() => this.activeStep());

  protected readonly resolvedAriaLabel = computed(() => {
    if (this.ariaLabel()) return this.ariaLabel();
    const key = this.ariaLabelKey() ?? 'solaris.dialog.navLabel';
    const translated = this.resolveText(key);
    if (translated !== undefined) return translated;
    return this.ariaLabelKey() ? undefined : 'Sections';
  });

  protected readonly resolvedSelectLabel = computed(() => {
    if (this.selectLabel()) return this.selectLabel();
    const key = this.selectLabelKey() ?? 'solaris.dialog.navSectionLabel';
    const translated = this.resolveText(key);
    if (translated !== undefined) return translated;
    return this.selectLabelKey() ? undefined : 'Section';
  });

  protected readonly activeValue = computed(
    () => this.items()[this.activeStep()]?.value,
  );

  protected readonly activeIcon = computed(
    () => this.items()[this.activeStep()]?.icon,
  );

  protected readonly activeTemplate = computed(() => {
    const value = this.items()[this.activeStep()]?.value;
    if (value === undefined) return null;
    return (
      this.contents().find((content) => content.value() === value)
        ?.templateRef ?? null
    );
  });

  protected isActive(index: number): boolean {
    return resolveDialogNavItemState(index, this.activeStep()) === 'active';
  }

  protected isClickable(index: number): boolean {
    return isDialogNavItemClickable(
      index,
      this.activeStep(),
      this.items()[index],
    );
  }

  protected itemLabel(item: SolarisDialogNavItem): string | undefined {
    if (item.labelKey) return this.resolveText(item.labelKey) ?? item.label;
    return item.label;
  }

  protected itemDescription(item: SolarisDialogNavItem): string | undefined {
    if (item.descriptionKey)
      return this.resolveText(item.descriptionKey) ?? item.description;
    return item.description;
  }

  protected tabIndex(index: number): string {
    const focused = this.focusedIndex();
    const valid = focused >= 0 && focused < this.items().length ? focused : 0;
    return valid === index ? '0' : '-1';
  }

  protected goTo(index: number): void {
    const items = this.items();
    if (index < 0 || index >= items.length) return;
    if (!this.isClickable(index)) return;
    const previousIndex = this.activeStep();
    this.activeStep.set(index);
    this.stepChange.emit({
      index,
      previousIndex,
      value: items[index].value,
    });
  }

  protected onItemFocus(index: number): void {
    this.focusedIndex.set(index);
  }

  protected onSelectValue(value: unknown): void {
    const index = findDialogNavIndexByValue(this.items(), value);
    if (index !== null) this.goTo(index);
  }

  protected onListKeydown(event: KeyboardEvent): void {
    const items = this.items();
    const from = this.focusedIndex();
    let target: number | null = null;
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        target = findDialogNavFocusableSection(items, from, 1);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        target = findDialogNavFocusableSection(items, from, -1);
        break;
      case 'Home':
        target = findDialogNavFocusableSection(items, -1, 1);
        break;
      case 'End':
        target = findDialogNavFocusableSection(items, items.length, -1);
        break;
      default:
        return;
    }
    event.preventDefault();
    this.focusedIndex.set(target);
    this.focusSectionButton(target);
  }

  private focusSectionButton(index: number): void {
    const buttons = this.hostElement.querySelectorAll<HTMLButtonElement>(
      '.solaris-dialog-nav__button:not([disabled])',
    );
    for (const button of buttons) {
      if (button.dataset['index'] === String(index)) {
        button.focus();
        return;
      }
    }
  }

  private resolveText(key: string): string | undefined {
    if (!key || !this.translateService) return undefined;
    const translated = this.translateService.translate(key);
    return translated !== key ? translated : undefined;
  }
}
