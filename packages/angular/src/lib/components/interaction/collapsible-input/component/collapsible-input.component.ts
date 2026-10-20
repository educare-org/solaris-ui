import {
  Component,
  ElementRef,
  inject,
  input,
  model,
  computed,
  booleanAttribute,
  signal,
  ChangeDetectionStrategy,
  output,
} from '@angular/core';
import type {
  SolarisCollapsibleInputSize,
  SolarisCollapsibleInputDensity,
  SolarisCollapsibleInputAppearance,
  SolarisCollapsibleInputValue,
} from '../model/collapsible-input.types';
import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisThemeService } from '../../../../services/theme';
import { SolarisIconComponent } from '../../../icon';
import { SolarisSpinnerComponent } from '../../../feedback/spinner';
import { resolveElementId } from '../../../../core';
import { SOLARIS_ACCORDION } from '../../accordion';

@Component({
  selector: 'solaris-collapsible-input',
  standalone: true,
  imports: [SolarisIconComponent, SolarisSpinnerComponent],
  templateUrl: './collapsible-input.component.html',
  styleUrls: ['./collapsible-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-collapsible-input',
    '[attr.data-size]': 'effectiveSize()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-appearance]': 'effectiveAppearance()',
    '[attr.data-open]': 'isOpen() ? "" : null',
    '[attr.data-disabled]': 'isEffectivelyDisabled() ? "" : null',
    '[attr.data-loading]': 'loading() ? "" : null',
  },
})
export class SolarisCollapsibleInputComponent {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });
  protected readonly themeService = inject(SolarisThemeService);
  private readonly accordionControl = inject(SOLARIS_ACCORDION, {
    optional: true,
  });

  readonly value = input<SolarisCollapsibleInputValue>();
  readonly query = model<string>('');
  readonly placeholder = input<string>();
  readonly placeholderKey = input<string>();
  readonly leadingIcon = input<string>('file-text');
  readonly submitLabel = input<string>();
  readonly submitLabelKey = input<string>();
  readonly submitIcon = input<string>('right-arrow');
  readonly stopLabel = input<string>();
  readonly stopLabelKey = input<string>();
  readonly stopIcon = input<string>('x');
  readonly loadingLabel = input<string>();
  readonly loadingLabelKey = input<string>();
  readonly loading = input<boolean, boolean>(false, {
    transform: booleanAttribute,
  });
  readonly disabled = input<boolean, boolean>(false, {
    transform: booleanAttribute,
  });
  readonly size = input<SolarisCollapsibleInputSize>('md');
  readonly density = input<SolarisCollapsibleInputDensity | undefined>(
    undefined,
  );
  readonly appearance = input<SolarisCollapsibleInputAppearance>('boxed');

  readonly submitted = output<string>();
  readonly cancelled = output<void>();

  protected readonly submittedQuery = signal<string | null>(null);

  protected readonly baseId = computed(() => {
    return resolveElementId(this.elementRef, 'solaris-collapsible-input');
  });

  protected readonly isOpen = computed(() => {
    if (this.accordionControl) {
      return this.accordionControl.isOpen(this.value());
    }
    return this.submittedQuery() !== null;
  });

  protected readonly isEffectivelyDisabled = computed(() => {
    return this.disabled() || (this.accordionControl?.disabled() ?? false);
  });

  protected readonly effectiveAppearance = computed(() => {
    return this.accordionControl?.appearance() ?? this.appearance();
  });

  protected readonly effectiveSize = computed<SolarisCollapsibleInputSize>(
    () => {
      return (
        (this.accordionControl?.size() as
          | SolarisCollapsibleInputSize
          | undefined) ?? this.size()
      );
    },
  );

  protected readonly effectiveDensity =
    computed<SolarisCollapsibleInputDensity>(() => {
      return (
        (this.accordionControl?.effectiveDensity() as
          | SolarisCollapsibleInputDensity
          | undefined) ??
        this.density() ??
        (this.themeService.density as SolarisCollapsibleInputDensity)
      );
    });

  protected readonly triggerId = computed(() => {
    if (this.accordionControl) {
      return this.accordionControl.generateTriggerId(this.value());
    }
    return `${this.baseId()}-trigger`;
  });

  protected readonly panelId = computed(() => {
    if (this.accordionControl) {
      return this.accordionControl.generatePanelId(this.value());
    }
    return `${this.baseId()}-panel`;
  });

  protected readonly placeholderText = computed(() => {
    const key = this.placeholderKey();
    if (key && this.translateService) {
      const translated = this.translateService.translate(key);
      if (translated !== key) {
        return translated;
      }
    }
    if (this.placeholder()) {
      return this.placeholder();
    }
    if (this.translateService) {
      const fallback = this.translateService.translate(
        'solaris.collapsibleInput.placeholder',
      );
      if (fallback !== 'solaris.collapsibleInput.placeholder') {
        return fallback;
      }
    }
    return 'Ask anything else';
  });

  protected readonly submitText = computed(() =>
    this.resolveText(
      this.submitLabel(),
      this.submitLabelKey(),
      'solaris.collapsibleInput.submit',
      'Send question',
    ),
  );
  protected readonly stopText = computed(() =>
    this.resolveText(
      this.stopLabel(),
      this.stopLabelKey(),
      'solaris.collapsibleInput.stop',
      'Stop',
    ),
  );
  protected readonly loadingText = computed(() =>
    this.resolveText(
      this.loadingLabel(),
      this.loadingLabelKey(),
      'solaris.collapsibleInput.loading',
      'Reading the docs',
    ),
  );

  protected readonly canSubmit = computed(() => {
    return !this.isEffectivelyDisabled() && this.query().trim().length > 0;
  });

  protected readonly actionLabel = computed(() => {
    return this.loading() ? this.stopText() : this.submitText();
  });

  protected onQueryInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected submit(event?: Event): void {
    event?.preventDefault();
    if (this.loading()) {
      this.cancelled.emit();
      return;
    }
    const current = this.query().trim();
    if (!current || this.isEffectivelyDisabled()) {
      return;
    }
    this.submittedQuery.set(current);
    this.query.set(current);
    if (this.accordionControl && !this.accordionControl.isOpen(this.value())) {
      this.accordionControl.toggle(this.value());
    }
    this.submitted.emit(current);
  }

  protected onActionClick(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    if (this.loading()) {
      this.cancelled.emit();
      return;
    }
    this.submit();
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      if (this.loading()) {
        event.preventDefault();
        this.cancelled.emit();
      }
    }
  }

  private resolveText(
    value?: string,
    key?: string,
    fallbackKey?: string,
    fallback?: string,
  ): string {
    if (key && this.translateService) {
      const translated = this.translateService.translate(key);
      if (translated !== key) {
        return translated;
      }
    }
    if (value) {
      return value;
    }
    if (fallbackKey && this.translateService) {
      const translated = this.translateService.translate(fallbackKey);
      if (translated !== fallbackKey) {
        return translated;
      }
    }
    return fallback ?? '';
  }
}
