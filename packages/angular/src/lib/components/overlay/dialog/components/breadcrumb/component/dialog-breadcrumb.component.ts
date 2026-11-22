import {
  Component,
  input,
  output,
  model,
  computed,
  inject,
  booleanAttribute,
  ChangeDetectionStrategy,
  ElementRef,
} from '@angular/core';

import { SolarisTranslateService } from '../../../../../../services/translation';
import { SolarisThemeService } from '../../../../../../services/theme';
import { SolarisVisuallyHiddenDirective } from '../../../../../../services/accessibility';
import { SolarisIconComponent } from '../../../../../icon';
import {
  isDialogBreadcrumbStepClickable,
  resolveDialogBreadcrumbStepState,
  findDialogBreadcrumbFocusableStep,
} from '../functions/dialog-breadcrumb.functions';

import type {
  SolarisDialogBreadcrumbItem,
  SolarisDialogBreadcrumbStepChange,
} from '../model/dialog-breadcrumb.types';

@Component({
  selector: 'solaris-dialog-breadcrumb',
  standalone: true,
  imports: [SolarisIconComponent, SolarisVisuallyHiddenDirective],
  templateUrl: './dialog-breadcrumb.component.html',
  styleUrls: ['./dialog-breadcrumb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-dialog-breadcrumb',
    '[attr.data-density]': 'effectiveDensity()',
  },
})
export class SolarisDialogBreadcrumbComponent {
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });
  private readonly themeService = inject(SolarisThemeService, {
    optional: true,
  });
  private readonly hostElement =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  /** Wizard steps in display order. */
  readonly items = input.required<SolarisDialogBreadcrumbItem[]>();
  /** Zero-based index of the visible step. Two-way bindable. */
  readonly activeStep = model<number>(0);
  /**
   * Linear wizards only allow going back to past steps (plus steps
   * carrying `error`, so validation can be fixed). Defaults to true.
   */
  readonly linear = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelKey = input<string | undefined>(undefined);

  readonly stepChange = output<SolarisDialogBreadcrumbStepChange>();

  readonly effectiveDensity = computed(() => {
    return this.themeService?.density ?? 'normal';
  });

  protected readonly resolvedAriaLabel = computed(() => {
    if (this.ariaLabel()) return this.ariaLabel();
    const key = this.ariaLabelKey() ?? 'solaris.dialog.breadcrumbLabel';
    const translated = this.resolveText(key);
    if (translated !== undefined) return translated;
    return this.ariaLabelKey() ? undefined : 'Steps';
  });

  protected readonly stepOfText = computed(() => {
    const total = this.items().length;
    const current = Math.min(this.activeStep() + 1, Math.max(total, 1));
    return (
      this.resolveText('solaris.dialog.stepOf', {
        current,
        total,
      }) ?? `Step ${current} of ${total}`
    );
  });

  protected stateOf(index: number): string {
    return resolveDialogBreadcrumbStepState(
      index,
      this.activeStep(),
      this.items()[index],
    );
  }

  protected isClickable(index: number): boolean {
    return isDialogBreadcrumbStepClickable(
      index,
      this.activeStep(),
      this.items()[index],
      this.linear(),
    );
  }

  protected itemLabel(item: SolarisDialogBreadcrumbItem): string | undefined {
    if (item.labelKey) return this.resolveText(item.labelKey) ?? item.label;
    return item.label;
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

  protected onListKeydown(event: KeyboardEvent): void {
    const items = this.items();
    const from = this.activeStep();
    let target: number | null = null;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        target = findDialogBreadcrumbFocusableStep(items, from, 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        target = findDialogBreadcrumbFocusableStep(items, from, -1);
        break;
      case 'Home':
        target = findDialogBreadcrumbFocusableStep(items, -1, 1);
        break;
      case 'End':
        target = findDialogBreadcrumbFocusableStep(items, items.length, -1);
        break;
      default:
        return;
    }
    event.preventDefault();
    this.focusStepButton(target);
  }

  private focusStepButton(index: number): void {
    const buttons = this.hostElement.querySelectorAll<HTMLButtonElement>(
      '.solaris-dialog-breadcrumb__button',
    );
    for (const button of buttons) {
      if (button.dataset['index'] === String(index)) {
        button.focus();
        return;
      }
    }
  }

  private resolveText(
    key: string,
    params?: Record<string, string | number>,
  ): string | undefined {
    if (!key || !this.translateService) return undefined;
    const translated = this.translateService.translate(key, params);
    return translated !== key ? translated : undefined;
  }
}
