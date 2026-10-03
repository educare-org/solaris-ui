import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
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
  SolarisFormSuffixDirective,
} from '../../form-field';
import { SolarisFormControl } from '../../form-field/model/form-control.contract';
import { SolarisInputDirective } from '../../input';
import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisThemeService } from '../../../../services/theme';
import { SolarisDateCalendarComponent } from '../../date/component/calendar.component';
import {
  addSolarisMonths,
  compareSolarisDates,
  formatSolarisDate,
  monthForSolarisDate,
  parseLocalizedSolarisDate,
  parseSolarisDate,
  todaySolarisDate,
} from '../../date/model/date.utils';
import type {
  SolarisCalendarMonth,
  SolarisDatePreset,
  SolarisDateRange,
  SolarisDateValue,
} from '../../date/model/date.types';
import type {
  SolarisDatePickerAppearance,
  SolarisDatePickerRadius,
} from '../../date-picker/model/date-picker.types';
import { SolarisIconButtonDirective } from '../../../actions/icon-button';

const EMPTY_RANGE: SolarisDateRange = { start: null, end: null };

@Component({
  selector: 'solaris-date-range-picker',
  standalone: true,
  imports: [
    SolarisButtonDirective,
    SolarisDateCalendarComponent,
    SolarisFormFieldComponent,
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
  readonly presets = input<readonly SolarisDatePreset[]>([]);
  readonly appearance = input<SolarisDatePickerAppearance>('outline');
  readonly radius = input<SolarisDatePickerRadius>('sm');
  readonly density = input<'compact' | 'normal' | 'comfortable'>();
  readonly requiredInput = input(false, { alias: 'required' });
  readonly disabledInput = input(false, { alias: 'disabled' });
  readonly readonlyInput = input(false, { alias: 'readonly' });
  readonly manualInvalid = input<boolean | undefined>(undefined, {
    alias: 'invalid',
  });

  readonly valueChange = output<SolarisDateRange>();
  readonly openedChange = output<boolean>();

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
    monthForSolarisDate(todaySolarisDate())!,
  );
  private readonly describedBy = signal<string[]>([]);
  private onChange: (value: SolarisDateRange) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected readonly resolvedLocale = computed(
    () => this.locale() ?? this.translateService.locale,
  );
  protected readonly effectiveDensity = computed(
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
  protected readonly calendarLabel = computed(() =>
    this.translateService.translate('solaris.date-picker.open-calendar'),
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
  protected readonly clearLabel = computed(() =>
    this.translateService.translate('solaris.date-range-picker.clear'),
  );
  protected readonly presetsLabel = computed(() =>
    this.translateService.translate('solaris.date-range-picker.presets'),
  );
  protected readonly placeholderText = computed(() =>
    this.translateService.translate('solaris.date-range-picker.placeholder'),
  );
  protected readonly customLabel = computed(() =>
    this.translateService.translate('solaris.date-range-picker.custom'),
  );
  protected readonly rangeDisplay = computed(() => {
    const range = this.value();
    const start = formatSolarisDate(range.start, this.resolvedLocale());
    const end = formatSolarisDate(range.end, this.resolvedLocale());

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
    this.activePresetId.set('custom');
    const text = (event.target as HTMLInputElement).value;
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
  protected cancel(): void {
    this.pending.set(this.value());
    this.updateDisplays(this.value());
    this.popoverTrigger()?.close();
  }
  protected apply(): void {
    const range = this.pending();
    if (range.start && !range.end) return;
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
    this.startDisplay.set(
      formatSolarisDate(range.start, this.resolvedLocale()),
    );
    this.endDisplay.set(formatSolarisDate(range.end, this.resolvedLocale()));
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
  private resolveText(value?: string, key?: string): string {
    return key
      ? this.translateService.translate(key) || value || ''
      : value || '';
  }
}
