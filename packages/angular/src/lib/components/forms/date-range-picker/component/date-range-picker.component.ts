import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  booleanAttribute,
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

import { SolarisButtonDirective } from '../../../actions/button';
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
  addSolarisMonths,
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
  SolarisDatePreset,
  SolarisDateRange,
  SolarisDateValue,
  SolarisWeekStartsOn,
} from '../../date/model/date.types';
import type {
  SolarisDateRangePickerAppearance,
  SolarisDateRangePickerDensity,
  SolarisDateRangePickerRadius,
  SolarisDateRangePickerSize,
} from '../model/date-range-picker.types';
import { SolarisIconButtonDirective } from '../../../actions/icon-button';

const EMPTY_RANGE: SolarisDateRange = { start: null, end: null };

@Component({
  selector: 'solaris-date-range-picker',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    SolarisButtonDirective,
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
      useExisting: forwardRef(() => SolarisDateRangePickerComponent),
      multi: true,
    },
    {
      provide: SolarisFormControl,
      useExisting: forwardRef(() => SolarisDateRangePickerComponent),
    },
  ],
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-date-range-picker',
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-open]': 'panelOpen() ? "" : null',
  },
})
export class SolarisDateRangePickerComponent
  extends SolarisFormControl
  implements ControlValueAccessor
{
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly translateService = inject(SolarisTranslateService);
  protected readonly themeService = inject(SolarisThemeService);
  protected readonly triggerButton =
    viewChild<ElementRef<HTMLButtonElement>>('triggerButton');
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
  readonly locale = input<string>();
  readonly min = input<SolarisDateValue>();
  readonly max = input<SolarisDateValue>();
  readonly disabledDates = input<readonly SolarisDateValue[]>([]);
  readonly startDisabled = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  readonly endDisabled = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  readonly startReadonly = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  readonly endReadonly = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  readonly presets = input<readonly SolarisDatePreset[]>([]);
  readonly appearance = input<SolarisDateRangePickerAppearance>('outline');
  readonly radius = input<SolarisDateRangePickerRadius>('md');
  readonly size = input<SolarisDateRangePickerSize>('md');
  readonly density = input<SolarisDateRangePickerDensity>();
  readonly loading = input<boolean>(false);
  readonly requiredInput = input(false, { alias: 'required' });
  readonly disabledInput = input(false, { alias: 'disabled' });
  readonly readonlyInput = input(false, { alias: 'readonly' });
  readonly manualInvalid = input<boolean | undefined>(undefined, {
    alias: 'invalid',
  });
  readonly clearable = input<boolean>(false);
  readonly inline = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  readonly clearLabel = input<string>();
  readonly clearLabelKey = input<string>();
  readonly prefix = input<SolarisIconName>();
  readonly suffix = input<SolarisIconName>();
  readonly weekStartsOn = input<SolarisWeekStartsOn>();
  readonly disablePast = input<boolean>(false);
  readonly disableFuture = input<boolean>(false);
  readonly dateFormat = input<SolarisDateFormat>('2-digit');

  readonly valueChange = output<SolarisDateRange>();
  readonly openedChange = output<boolean>();
  readonly cleared = output<void>();
  readonly cancelled = output<void>();

  protected readonly value = signal<SolarisDateRange>(EMPTY_RANGE);
  protected readonly pending = signal<SolarisDateRange>(EMPTY_RANGE);
  protected readonly startDisplay = signal('');
  protected readonly endDisplay = signal('');
  protected readonly focusedState = signal(false);
  protected readonly disabledState = signal(false);
  protected readonly touched = signal(false);
  protected readonly parseError = signal(false);
  protected readonly panelOpen = signal(false);
  protected readonly activePresetId = signal('custom');
  protected readonly displayedMonth = signal<SolarisCalendarMonth>(
    // todaySolarisDate() is always parseable; the fallback only satisfies the type checker.
    monthForSolarisDate(todaySolarisDate()) ?? {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
    },
  );
  private readonly describedBy = signal<string[]>([]);

  private onChange: (value: SolarisDateRange) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected readonly resolvedLocale = computed(
    () => this.locale() ?? this.translateService?.locale() ?? 'en-US',
  );
  protected readonly effectiveDensity = computed<SolarisDateRangePickerDensity>(
    () => this.density() ?? this.themeService.density,
  );
  protected readonly isEffectivelyDisabled = computed(
    () => this.disabledInput() || this.disabledState(),
  );
  protected readonly isEffectivelyReadonly = computed(() =>
    this.readonlyInput(),
  );
  protected readonly isStartDisabled = computed(
    () => this.isEffectivelyDisabled() || this.startDisabled(),
  );
  protected readonly isEndDisabled = computed(
    () => this.isEffectivelyDisabled() || this.endDisabled(),
  );
  protected readonly isStartReadonly = computed(
    () => this.isEffectivelyReadonly() || this.startReadonly(),
  );
  protected readonly isEndReadonly = computed(
    () => this.isEffectivelyReadonly() || this.endReadonly(),
  );
  protected readonly isEffectivelyInvalid = computed(() => {
    const manual = this.manualInvalid();
    if (manual !== undefined) return manual;
    return (
      this.parseError() ||
      (this.requiredInput() &&
        this.touched() &&
        (!this.value().start || !this.value().end))
    );
  });
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
      return this.translateService.translate(
        'solaris.date-range-picker.invalid',
      );
    if (this.requiredInput())
      return this.translateService.translate(
        'solaris.date-range-picker.required',
      );
    return '';
  });
  protected readonly startLabel = computed(() =>
    this.translateService.translate('solaris.date-range-picker.start'),
  );
  protected readonly endLabel = computed(() =>
    this.translateService.translate('solaris.date-range-picker.end'),
  );
  protected readonly calendarLabel = computed(
    () =>
      this.translateService?.translate('solaris.date-picker.open-calendar') ??
      'Open calendar',
  );
  protected readonly previousMonthLabel = computed(() =>
    this.translateService.translate('solaris.date-picker.previous-month'),
  );
  protected readonly nextMonthLabel = computed(() =>
    this.translateService.translate('solaris.date-picker.next-month'),
  );
  protected readonly applyLabel = computed(() =>
    this.translateService.translate('solaris.date-range-picker.apply'),
  );
  protected readonly cancelLabel = computed(() =>
    this.translateService.translate('solaris.date-range-picker.cancel'),
  );
  protected readonly clearButtonLabel = computed(() =>
    this.translateService.translate('solaris.date-range-picker.clear'),
  );
  protected readonly hasValue = computed(() => {
    const range = this.value();
    return range.start !== null || range.end !== null;
  });
  protected readonly canClear = computed(() => {
    return (
      this.clearable() &&
      this.hasValue() &&
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
      this.translateService?.translate('solaris.date-range-picker.clear') ??
      'Clear'
    );
  });
  protected readonly presetsLabel = computed(() =>
    this.translateService.translate('solaris.date-range-picker.presets'),
  );
  protected readonly placeholderText = computed(
    () =>
      this.translateService?.translate(
        'solaris.date-range-picker.placeholder',
      ) ?? 'Select a date range',
  );
  protected readonly customLabel = computed(() =>
    this.translateService.translate('solaris.date-range-picker.custom'),
  );
  protected readonly rangeDisplay = computed(() => {
    const range = this.value();
    const format = this.dateFormat();
    const start = formatSolarisDate(range.start, this.resolvedLocale(), format);
    const end = formatSolarisDate(range.end, this.resolvedLocale(), format);

    return start && end ? `${start} - ${end}` : start || end;
  });

  get id(): string {
    // SECURITY_EXCEPTION: reading the host id for control association requires the native element. Read-only.
    return `${this.elementRef.nativeElement.id || 'solaris-date-range-picker'}-start`;
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
    this.triggerButton()?.nativeElement.focus();
  }

  writeValue(value: SolarisDateRange | null): void {
    const normalized = this.normalizeRange(value ?? EMPTY_RANGE);
    this.value.set(normalized);
    this.pending.set(normalized);
    this.activePresetId.set(this.presetIdForRange(normalized));
    this.updateDisplays(normalized);
    const month = normalized.start
      ? monthForSolarisDate(normalized.start)
      : null;
    if (month) this.displayedMonth.set(month);
    this.parseError.set(false);
  }

  registerOnChange(fn: (value: SolarisDateRange) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabledState.set(isDisabled);
  }

  protected onInput(part: 'start' | 'end', event: Event): void {
    if (part === 'start' && (this.isStartDisabled() || this.isStartReadonly()))
      return;
    if (part === 'end' && (this.isEndDisabled() || this.isEndReadonly()))
      return;
    this.activePresetId.set('custom');
    const input = event.target as HTMLInputElement;
    const text = this.applyDateMask(input, input.value);
    const parsed = parseLocalizedSolarisDate(text, this.resolvedLocale());
    if (part === 'start') this.startDisplay.set(text);
    else this.endDisplay.set(text);
    if (!text.trim()) {
      this.updatePending({ ...this.pending(), [part]: null });
      this.parseError.set(false);
      return;
    }
    if (!parsed || !this.isSelectable(parsed)) {
      this.parseError.set(true);
      return;
    }
    const next = { ...this.pending(), [part]: parsed };
    if (
      next.start &&
      next.end &&
      compareSolarisDates(next.start, next.end) > 0
    ) {
      this.parseError.set(true);
      return;
    }
    this.parseError.set(false);
    this.updatePending(next);
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

  protected onFocus(): void {
    this.focusedState.set(true);
  }
  protected onBlur(): void {
    this.focusedState.set(false);
    this.markTouched();
  }
  protected onInputClick(event: MouseEvent): void {
    event.stopPropagation();
  }
  protected onInputKeydown(event: KeyboardEvent): void {
    if (event.altKey && event.key === 'ArrowDown') {
      event.preventDefault();
      this.popoverTrigger()?.open();
    }
  }
  protected onPanelInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.updateDisplays(this.pending());
      this.parseError.set(false);
    }
  }
  protected onPanelOpened(): void {
    this.pending.set(this.value());
    this.updateDisplays(this.value());
    this.activePresetId.set(this.presetIdForRange(this.value()));
    this.panelOpen.set(true);
    this.openedChange.emit(true);
  }
  protected onPanelClosed(): void {
    this.panelOpen.set(false);
    this.openedChange.emit(false);
    this.markTouched();
  }
  protected setDisplayedMonth(month: SolarisCalendarMonth): void {
    this.displayedMonth.set(month);
  }

  protected nextMonth(): SolarisCalendarMonth {
    return addSolarisMonths(this.displayedMonth(), 1);
  }
  protected selectDate(value: SolarisDateValue): void {
    this.activePresetId.set('custom');
    const range = this.pending();
    const startLocked = this.isStartDisabled() || this.isStartReadonly();
    const endLocked = this.isEndDisabled() || this.isEndReadonly();
    if (endLocked && !startLocked) {
      this.updatePending({ start: value, end: range.end });
      return;
    }
    if (startLocked && !endLocked) {
      if (!range.start) {
        this.updatePending({ start: null, end: value });
        return;
      }
      this.updatePending(
        compareSolarisDates(value, range.start) < 0
          ? { start: value, end: range.start }
          : { start: range.start, end: value },
      );
      return;
    }
    if (startLocked && endLocked) return;
    if (!range.start || range.end) {
      this.updatePending({ start: value, end: null });
      return;
    }
    this.updatePending(
      compareSolarisDates(value, range.start) < 0
        ? { start: value, end: range.start }
        : { start: range.start, end: value },
    );
  }
  protected selectPreset(preset: SolarisDatePreset): void {
    const range = this.normalizeRange(preset.range);
    this.activePresetId.set(preset.id);
    this.updatePending(range);
    const month = range.start ? monthForSolarisDate(range.start) : null;
    if (month) this.displayedMonth.set(month);
  }
  protected selectCustom(): void {
    this.activePresetId.set('custom');
  }
  protected presetLabel(preset: SolarisDatePreset): string {
    return preset.labelKey
      ? this.translateService.translate(preset.labelKey)
      : (preset.label ?? '');
  }
  protected clearPending(): void {
    this.activePresetId.set('custom');
    this.updatePending(EMPTY_RANGE);
    this.parseError.set(false);
  }
  protected clearValue(): void {
    const cleared: SolarisDateRange = { ...EMPTY_RANGE };
    this.value.set(cleared);
    this.pending.set(cleared);
    this.activePresetId.set('custom');
    this.updateDisplays(cleared);
    this.parseError.set(false);
    this.onChange(cleared);
    this.valueChange.emit(cleared);
    this.cleared.emit();
    this.markTouched();
  }
  protected cancel(): void {
    this.pending.set(this.value());
    this.updateDisplays(this.value());
    this.cancelled.emit();
    this.popoverTrigger()?.close();
  }
  protected apply(): void {
    const range = this.pending();
    const endLocked = this.isEndDisabled() || this.isEndReadonly();
    const startLocked = this.isStartDisabled() || this.isStartReadonly();
    if (range.start && !range.end && !endLocked) return;
    if (range.end && !range.start && !startLocked) return;
    this.value.set(range);
    this.onChange(range);
    this.valueChange.emit(range);
    this.updateDisplays(range);
    this.popoverTrigger()?.close();
  }

  private updatePending(range: SolarisDateRange): void {
    this.pending.set(range);
    this.updateDisplays(range);
  }
  private updateDisplays(range: SolarisDateRange): void {
    const format = this.dateFormat();
    this.startDisplay.set(
      formatSolarisDate(range.start, this.resolvedLocale(), format),
    );
    this.endDisplay.set(
      formatSolarisDate(range.end, this.resolvedLocale(), format),
    );
  }
  private presetIdForRange(range: SolarisDateRange): string {
    return (
      this.presets().find((preset) => {
        const presetRange = this.normalizeRange(preset.range);
        return (
          presetRange.start === range.start && presetRange.end === range.end
        );
      })?.id ?? 'custom'
    );
  }
  private normalizeRange(range: SolarisDateRange): SolarisDateRange {
    const start = parseSolarisDate(range.start) ? range.start : null;
    const end = parseSolarisDate(range.end) ? range.end : null;
    return start && end && compareSolarisDates(start, end) > 0
      ? { start: end, end: start }
      : { start, end };
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
  private resolveText(value?: string, key?: string): string {
    return key
      ? this.translateService.translate(key) || value || ''
      : value || '';
  }
}
