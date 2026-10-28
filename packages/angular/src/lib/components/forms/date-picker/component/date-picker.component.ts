import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  contentChild,
  forwardRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';

import { SolarisIconComponent } from '../../../icon';
import {
  SolarisPopoverDirective,
  SolarisPopoverTriggerDirective,
} from '../../../interaction/popover';
import {
  SolarisFormFieldComponent,
  SolarisFormPrefixDirective,
  SolarisFormSuffixActionDirective,
  SolarisFormSuffixDirective,
} from '../../form-field';
import { SolarisFormControl } from '../../form-field/model/form-control.contract';
import { SolarisInputDirective } from '../../input';
import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisThemeService } from '../../../../services/theme';
import type { SolarisIconName } from '../../../../services/icon';
import { SolarisDateCalendarComponent } from '../../date';
import {
  compareSolarisDates,
  formatSolarisDate,
  maskLocalizedSolarisDateInput,
  monthForSolarisDate,
  parseLocalizedSolarisDate,
  parseSolarisDate,
  todaySolarisDate,
} from '../../date/model/date.utils';
import type {
  SolarisCalendarMonth,
  SolarisDateFormat,
  SolarisDateValue,
  SolarisWeekStartsOn,
} from '../../date/model/date.types';
import type {
  SolarisDatePickerAppearance,
  SolarisDatePickerDensity,
  SolarisDatePickerRadius,
  SolarisDatePickerSize,
} from '../model/date-picker.types';
import { SolarisIconButtonDirective } from '../../../actions/icon-button';

@Component({
  selector: 'solaris-date-picker',
  standalone: true,
  imports: [
    SolarisDateCalendarComponent,
    SolarisFormFieldComponent,
    SolarisFormPrefixDirective,
    SolarisFormSuffixActionDirective,
    SolarisFormSuffixDirective,
    SolarisIconComponent,
    SolarisInputDirective,
    SolarisPopoverDirective,
    SolarisPopoverTriggerDirective,
    SolarisIconButtonDirective,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SolarisDatePickerComponent),
      multi: true,
    },
    {
      provide: SolarisFormControl,
      useExisting: forwardRef(() => SolarisDatePickerComponent),
    },
  ],
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-date-picker',
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-open]': 'panelOpen() ? "" : null',
  },
})
export class SolarisDatePickerComponent
  extends SolarisFormControl
  implements ControlValueAccessor
{
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly translateService = inject(SolarisTranslateService);
  protected readonly themeService = inject(SolarisThemeService);
  protected readonly inputElement =
    viewChild<ElementRef<HTMLInputElement>>('inputElement');
  protected readonly popoverTrigger = viewChild(SolarisPopoverTriggerDirective);

  protected readonly projectedSuffixAction = contentChild(
    SolarisFormSuffixActionDirective,
    { descendants: true },
  );

  readonly label = input<string>();
  readonly labelKey = input<string>();
  readonly hint = input<string>();
  readonly hintKey = input<string>();
  readonly error = input<string>();
  readonly errorKey = input<string>();
  readonly placeholder = input<string>();
  readonly placeholderKey = input<string>();
  readonly locale = input<string>();
  readonly min = input<SolarisDateValue>();
  readonly max = input<SolarisDateValue>();
  readonly disabledDates = input<readonly SolarisDateValue[]>([]);
  readonly appearance = input<SolarisDatePickerAppearance>('outline');
  readonly radius = input<SolarisDatePickerRadius>('md');
  readonly density = input<SolarisDatePickerDensity>();
  readonly size = input<SolarisDatePickerSize>('md');
  readonly requiredInput = input(false, { alias: 'required' });
  readonly disabledInput = input(false, { alias: 'disabled' });
  readonly readonlyInput = input(false, { alias: 'readonly' });
  readonly manualInvalid = input<boolean | undefined>(undefined, {
    alias: 'invalid',
  });
  readonly loading = input<boolean>(false);
  readonly calendarButtonLabel = input<string>();
  readonly calendarButtonLabelKey = input<string>();
  readonly clearable = input<boolean>(false);
  readonly clearLabel = input<string>();
  readonly clearLabelKey = input<string>();
  readonly prefix = input<SolarisIconName>();
  readonly suffix = input<SolarisIconName>();
  readonly weekStartsOn = input<SolarisWeekStartsOn>();
  readonly disablePast = input<boolean>(false);
  readonly disableFuture = input<boolean>(false);
  readonly dateFormat = input<SolarisDateFormat>('2-digit');

  readonly valueChange = output<SolarisDateValue | null>();
  readonly openedChange = output<boolean>();
  readonly cleared = output<void>();

  protected readonly value = signal<SolarisDateValue | null>(null);
  protected readonly displayValue = signal('');
  protected readonly focusedState = signal(false);
  protected readonly disabledState = signal(false);
  protected readonly touched = signal(false);
  protected readonly parseError = signal(false);
  protected readonly panelOpen = signal(false);
  protected readonly displayedMonth = signal<SolarisCalendarMonth>(
    // todaySolarisDate() is always parseable; the fallback only satisfies the type checker.
    monthForSolarisDate(todaySolarisDate()) ?? {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
    },
  );
  private readonly describedBy = signal<string[]>([]);

  private onChange: (value: SolarisDateValue | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected readonly resolvedLocale = computed(
    () => this.locale() ?? this.translateService.locale(),
  );
  protected readonly effectiveDensity = computed<SolarisDatePickerDensity>(
    () => this.density() ?? this.themeService.density,
  );
  protected readonly isEffectivelyDisabled = computed(
    () => this.disabledInput() || this.disabledState(),
  );
  protected readonly isEffectivelyReadonly = computed(() =>
    this.readonlyInput(),
  );
  protected readonly isEffectivelyInvalid = computed(() => {
    const manual = this.manualInvalid();
    if (manual !== undefined) return manual;
    return (
      this.parseError() ||
      (this.requiredInput() && this.touched() && !this.value())
    );
  });
  protected readonly canClear = computed(() => {
    return (
      this.clearable() &&
      this.value() !== null &&
      !this.isEffectivelyDisabled() &&
      !this.isEffectivelyReadonly()
    );
  });
  protected readonly clearAriaLabel = computed(() => {
    const key = this.clearLabelKey();
    if (key) {
      return this.translateService?.translate(key) ?? key;
    }
    const text = this.clearLabel();
    if (text) {
      return text;
    }
    return (
      this.translateService?.translate('solaris.date-picker.clear') ??
      'Clear date'
    );
  });
  protected readonly placeholderText = computed(() =>
    this.resolveText(
      this.placeholder(),
      this.placeholderKey(),
      'solaris.date-picker.placeholder',
    ),
  );
  protected readonly labelText = computed(() =>
    this.resolveText(this.label(), this.labelKey()),
  );
  protected readonly hintText = computed(() =>
    this.resolveText(this.hint(), this.hintKey()),
  );
  protected readonly errorText = computed(() => {
    if (this.error() || this.errorKey())
      return this.resolveText(this.error(), this.errorKey());
    if (this.parseError())
      return this.translateService.translate('solaris.date-picker.invalid');
    if (this.requiredInput() && !this.value())
      return this.translateService.translate('solaris.date-picker.required');
    return '';
  });
  protected readonly calendarButtonLabelText = computed(() =>
    this.resolveText(
      this.calendarButtonLabel(),
      this.calendarButtonLabelKey(),
      'solaris.date-picker.open-calendar',
    ),
  );
  protected readonly previousMonthLabel = computed(() =>
    this.translateService.translate('solaris.date-picker.previous-month'),
  );
  protected readonly nextMonthLabel = computed(() =>
    this.translateService.translate('solaris.date-picker.next-month'),
  );

  get id(): string {
    // SECURITY_EXCEPTION: reading the host id for control association requires the native element. Read-only.
    return `${this.elementRef.nativeElement.id || 'solaris-date-picker'}-input`;
  }

  get focused(): boolean {
    return this.focusedState();
  }

  get disabled(): boolean {
    return this.isEffectivelyDisabled();
  }

  get readonly(): boolean {
    return this.isEffectivelyReadonly();
  }

  get invalid(): boolean {
    return this.isEffectivelyInvalid();
  }

  get required(): boolean {
    return this.requiredInput();
  }

  get describedByIds(): string[] {
    return this.describedBy();
  }

  setDescribedByIds(ids: string[]): void {
    this.describedBy.set([...ids]);
  }

  focus(): void {
    // SECURITY_EXCEPTION: programmatic focus requires the native method; no declarative alternative exists.
    this.inputElement()?.nativeElement.focus();
  }

  writeValue(value: SolarisDateValue | null): void {
    const valid = parseSolarisDate(value);
    const normalized = valid ? value : null;
    this.value.set(normalized);
    this.displayValue.set(
      formatSolarisDate(normalized, this.resolvedLocale(), this.dateFormat()),
    );
    this.parseError.set(false);
    const month = normalized ? monthForSolarisDate(normalized) : null;
    if (month) this.displayedMonth.set(month);
  }

  registerOnChange(fn: (value: SolarisDateValue | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledState.set(isDisabled);
  }

  protected onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const raw = input.value;
    const text = this.applyDateMask(input, raw);
    this.displayValue.set(text);
    const parsed = parseLocalizedSolarisDate(text, this.resolvedLocale());

    if (!text.trim()) {
      this.commitValue(null);
      this.parseError.set(false);
      return;
    }

    if (!parsed || !this.isSelectable(parsed)) {
      this.parseError.set(true);
      return;
    }

    this.parseError.set(false);
    this.commitValue(parsed);
    const month = monthForSolarisDate(parsed);
    if (month) this.displayedMonth.set(month);
  }

  protected onInputFocus(): void {
    this.focusedState.set(true);
  }

  protected onInputBlur(): void {
    this.focusedState.set(false);
    this.markTouched();
    if (!this.parseError()) {
      this.displayValue.set(
        formatSolarisDate(
          this.value(),
          this.resolvedLocale(),
          this.dateFormat(),
        ),
      );
    }
  }

  protected onInputKeydown(event: KeyboardEvent): void {
    if (event.altKey && event.key === 'ArrowDown') {
      event.preventDefault();
      this.popoverTrigger()?.open();
      return;
    }
    if (event.key === 'Escape') {
      const pristine = formatSolarisDate(
        this.value(),
        this.resolvedLocale(),
        this.dateFormat(),
      );
      if (this.displayValue() !== pristine) {
        event.preventDefault();
        this.displayValue.set(pristine);
        this.parseError.set(false);
      } else {
        this.popoverTrigger()?.close();
      }
    }
  }

  protected onPanelOpened(): void {
    this.panelOpen.set(true);
    this.openedChange.emit(true);
  }

  protected onPanelClosed(): void {
    this.panelOpen.set(false);
    this.openedChange.emit(false);
    this.markTouched();
  }

  protected selectDate(value: SolarisDateValue): void {
    this.commitValue(value);
    this.displayValue.set(
      formatSolarisDate(value, this.resolvedLocale(), this.dateFormat()),
    );
    this.parseError.set(false);
    this.popoverTrigger()?.close();
  }

  protected clearValue(): void {
    this.commitValue(null);
    this.displayValue.set('');
    this.parseError.set(false);
    this.cleared.emit();
    this.markTouched();
  }

  protected setDisplayedMonth(month: SolarisCalendarMonth): void {
    this.displayedMonth.set(month);
  }

  private applyDateMask(input: HTMLInputElement, raw: string): string {
    if (!raw || !/\d/.test(raw) || /[A-Za-z]/.test(raw)) return raw;
    const masked = maskLocalizedSolarisDateInput(raw, this.resolvedLocale());
    if (masked === raw) return raw;
    const caret = input.selectionStart ?? raw.length;
    const digitsBeforeCaret = raw.slice(0, caret).replace(/\D/g, '').length;
    // SECURITY_EXCEPTION: syncing the native input value keeps the caret usable while typing; no declarative alternative.
    input.value = masked;
    let position = 0;
    let seen = 0;
    while (position < masked.length && seen < digitsBeforeCaret) {
      if (/\d/.test(masked[position])) seen += 1;
      position += 1;
    }
    input.setSelectionRange(position, position);
    return masked;
  }

  private commitValue(value: SolarisDateValue | null): void {
    if (this.value() === value) return;
    this.value.set(value);
    this.onChange(value);
    this.valueChange.emit(value);
  }

  private isSelectable(value: SolarisDateValue): boolean {
    const today = todaySolarisDate();
    const min = this.min();
    const max = this.max();
    return (
      (!min || value >= min) &&
      (!max || value <= max) &&
      (!this.disablePast() || compareSolarisDates(value, today) >= 0) &&
      (!this.disableFuture() || compareSolarisDates(value, today) <= 0) &&
      !this.disabledDates().includes(value)
    );
  }

  private markTouched(): void {
    if (!this.touched()) {
      this.touched.set(true);
      this.onTouched();
    }
  }

  private resolveText(value?: string, key?: string, fallback?: string): string {
    if (key) return this.translateService?.translate(key) || value || '';
    return (
      value ||
      (fallback ? (this.translateService?.translate(fallback) ?? '') : '')
    );
  }
}
