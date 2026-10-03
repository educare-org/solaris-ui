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
  SolarisFormSuffixActionDirective,
  SolarisFormSuffixDirective,
} from '../../form-field';
import { SolarisFormControl } from '../../form-field/model/form-control.contract';
import { SolarisInputDirective } from '../../input';
import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisThemeService } from '../../../../services/theme';
import { SolarisDateCalendarComponent } from '../../date/component/calendar.component';
import {
  formatSolarisDate,
  monthForSolarisDate,
  parseLocalizedSolarisDate,
  parseSolarisDate,
  todaySolarisDate,
} from '../../date/model/date.utils';
import type {
  SolarisCalendarMonth,
  SolarisDateValue,
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
  readonly radius = input<SolarisDatePickerRadius>('sm');
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

  readonly valueChange = output<SolarisDateValue | null>();
  readonly openedChange = output<boolean>();

  protected readonly value = signal<SolarisDateValue | null>(null);
  protected readonly displayValue = signal('');
  protected readonly focusedState = signal(false);
  protected readonly disabledState = signal(false);
  protected readonly touched = signal(false);
  protected readonly parseError = signal(false);
  protected readonly panelOpen = signal(false);
  protected readonly displayedMonth = signal<SolarisCalendarMonth>(
    monthForSolarisDate(todaySolarisDate())!,
  );
  private readonly describedBy = signal<string[]>([]);

  private onChange: (value: SolarisDateValue | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected readonly resolvedLocale = computed(
    () => this.locale() ?? this.translateService.locale,
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
    this.displayValue.set(formatSolarisDate(normalized, this.resolvedLocale()));
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
    const text = (event.target as HTMLInputElement).value;
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
    this.displayedMonth.set(monthForSolarisDate(parsed)!);
  }

  protected onInputFocus(): void {
    this.focusedState.set(true);
  }

  protected onInputBlur(): void {
    this.focusedState.set(false);
    this.markTouched();
    if (!this.parseError()) {
      this.displayValue.set(
        formatSolarisDate(this.value(), this.resolvedLocale()),
      );
    }
  }

  protected onInputKeydown(event: KeyboardEvent): void {
    if (event.altKey && event.key === 'ArrowDown') {
      event.preventDefault();
      this.popoverTrigger()?.open();
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
    this.displayValue.set(formatSolarisDate(value, this.resolvedLocale()));
    this.parseError.set(false);
    this.popoverTrigger()?.close();
  }

  protected setDisplayedMonth(month: SolarisCalendarMonth): void {
    this.displayedMonth.set(month);
  }

  private commitValue(value: SolarisDateValue | null): void {
    if (this.value() === value) return;
    this.value.set(value);
    this.onChange(value);
    this.valueChange.emit(value);
  }

  private isSelectable(value: SolarisDateValue): boolean {
    return (
      (!this.min() || value >= this.min()!) &&
      (!this.max() || value <= this.max()!) &&
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
    if (key) return this.translateService.translate(key) || value || '';
    return value || (fallback ? this.translateService.translate(fallback) : '');
  }
}
