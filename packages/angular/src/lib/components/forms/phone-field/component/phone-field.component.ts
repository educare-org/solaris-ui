import {
  Component,
  input,
  computed,
  signal,
  output,
  effect,
  forwardRef,
  inject,
  viewChild,
  contentChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  type ControlValueAccessor,
  FormsModule,
} from '@angular/forms';

import { SolarisFormControl } from '../../form-field/model/form-control.contract';
import { resolveElementId } from '../../../../core';
import {
  SolarisFormFieldComponent,
  SolarisFormPrefixDirective,
  SolarisFormSuffixActionDirective,
  SolarisFormSuffixDirective,
} from '../../form-field';
import { SolarisInputDirective } from '../../input';
import { SolarisIconComponent } from '../../../icon';
import { SolarisTranslateService } from '../../../../services/translation';
import type { SolarisTranslateParams } from '../../../../services/translation';
import { SolarisThemeService } from '../../../../services/theme';
import type { SolarisIconName } from '../../../../services/icon';
import {
  SolarisPopoverDirective,
  SolarisPopoverTriggerDirective,
} from '../../../interaction/popover';
import { SolarisPhoneCountryListComponent } from './country-list.component';
import { SolarisSafeHtmlPipe } from './solaris-safe-html.pipe';
import { SOLARIS_PHONE_COUNTRY_LIST } from '../model/phone-field.tokens';
import {
  formatAsYouType,
  toValidE164,
  detectCountry,
  formatE164,
  getExampleNumberFor,
  getMaxNationalNumberLength,
} from '../model/phone-format';
import {
  adjustRawForTrailingFormatDeletion,
  formatE164ForDisplay,
  formatInternationalDisplay,
  getPhoneLengthReason,
  mapCaretToFormatted,
  parseEditablePhoneInput,
} from '../functions/phone-field-input';

import type {
  SolarisPhoneFieldAppearance,
  SolarisPhoneFieldDensity,
  SolarisPhoneFieldRadius,
  SolarisPhoneFieldSize,
} from '../model/phone-field.types';
import type {
  SolarisCountry,
  SolarisCountryCode,
} from '../model/country.types';

@Component({
  selector: 'solaris-phone-field',
  standalone: true,
  imports: [
    FormsModule,
    SolarisFormFieldComponent,
    SolarisFormPrefixDirective,
    SolarisFormSuffixDirective,
    SolarisInputDirective,
    SolarisIconComponent,
    SolarisPopoverDirective,
    SolarisPopoverTriggerDirective,
    SolarisPhoneCountryListComponent,
    SolarisSafeHtmlPipe,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SolarisPhoneFieldComponent),
      multi: true,
    },
    {
      provide: SolarisFormControl,
      useExisting: forwardRef(() => SolarisPhoneFieldComponent),
    },
  ],
  templateUrl: './phone-field.component.html',
  styleUrls: ['./phone-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-phone-field',
    '[attr.data-size]': 'size()',
    '[attr.data-open]': 'panelOpen() ? "" : null',
    '[attr.data-density]': 'effectiveDensity()',
  },
})
export class SolarisPhoneFieldComponent
  extends SolarisFormControl
  implements ControlValueAccessor, AfterViewInit, OnDestroy
{
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly translateService = inject(SolarisTranslateService);
  private readonly countryListFactory = inject(SOLARIS_PHONE_COUNTRY_LIST);
  protected readonly themeService = inject(SolarisThemeService);

  protected readonly inputElementRef =
    viewChild<ElementRef<HTMLInputElement>>('inputElement');
  protected readonly popoverTrigger = viewChild(SolarisPopoverTriggerDirective);
  protected readonly projectedSuffix = contentChild(SolarisFormSuffixDirective);
  protected readonly projectedSuffixAction = contentChild(
    SolarisFormSuffixActionDirective,
    { descendants: true },
  );

  readonly fieldId = input<string>(undefined, { alias: 'id' });
  readonly name = input<string>();
  readonly hintKey = input<string>();
  readonly hint = input<string>('');
  readonly labelKey = input<string>();
  readonly errorKey = input<string>();
  readonly value = input<string>('');
  readonly label = input<string>('');
  readonly error = input<string>('');
  readonly placeholder = input<string>();
  readonly invalidError = input<string>();
  readonly requiredError = input<string>();
  readonly tooShortError = input<string>();
  readonly tooLongError = input<string>();
  readonly placeholderKey = input<string>();
  readonly invalidErrorKey = input<string>();
  readonly requiredErrorKey = input<string>();
  readonly tooShortErrorKey = input<string>();
  readonly tooLongErrorKey = input<string>();
  readonly requiredInput = input<boolean>(false, { alias: 'required' });
  readonly optional = input<boolean>(false);
  readonly disabledInput = input<boolean>(false, { alias: 'disabled' });
  readonly readonlyInput = input<boolean>(false, { alias: 'readonly' });
  readonly autocomplete = input<string>('tel');
  readonly invalidInput = input<boolean | undefined>(undefined, {
    alias: 'invalid',
  });
  readonly density = input<SolarisPhoneFieldDensity>();
  readonly size = input<SolarisPhoneFieldSize>('md');
  readonly radius = input<SolarisPhoneFieldRadius>('md');
  readonly appearance = input<SolarisPhoneFieldAppearance>('outline');
  readonly maxLength = input<number | undefined>();
  readonly suffix = input<SolarisIconName>();
  readonly loading = input<boolean>(false);
  readonly clearable = input<boolean>(false);
  readonly clearLabel = input<string>();
  readonly clearLabelKey = input<string>();

  readonly defaultCountry = input<SolarisCountryCode>();
  readonly country = input<SolarisCountryCode | undefined>();
  readonly searchable = input<boolean>(true);
  readonly allowAnyCountry = input<boolean>(true);
  readonly countryList = input<SolarisCountryCode[] | undefined>();
  readonly excludeCountries = input<SolarisCountryCode[] | undefined>();
  readonly preferredCountries = input<SolarisCountryCode[] | undefined>();
  readonly emptyText = input<string>();
  readonly emptyTextKey = input<string>();
  readonly noResultsText = input<string>();
  readonly noResultsTextKey = input<string>();
  readonly searchPlaceholder = input<string>();
  readonly searchPlaceholderKey = input<string>();
  readonly countryButtonLabel = input<string>();
  readonly countryButtonLabelKey = input<string>();
  readonly panelMaxWidth = input<string | number>();
  readonly panelMaxHeight = input<string | number>();

  readonly valueChange = output<string>();
  readonly countryChange = output<SolarisCountryCode>();
  readonly cleared = output<void>();

  protected readonly internalValue = signal<string>('');
  protected readonly displayValue = signal<string>('');
  protected readonly internalDisabled = signal(false);
  protected readonly internalFocused = signal(false);
  protected readonly touched = signal(false);
  protected readonly dirty = signal(false);
  protected readonly selectedCountry = signal<SolarisCountryCode | undefined>(
    undefined,
  );
  protected readonly panelOpen = signal(false);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};
  private readonly popoverSubscriptions: (() => void)[] = [];

  protected readonly allCountries = computed(() => {
    return this.countryListFactory(this.translateService?.locale() ?? 'en-US');
  });

  protected readonly countries = computed(() => {
    const list = this.allCountries();
    const restrict = this.countryList();
    const excluded = new Set(this.excludeCountries() ?? []);
    return list.filter(
      (country) =>
        (!restrict ||
          restrict.length === 0 ||
          restrict.includes(country.code)) &&
        !excluded.has(country.code),
    );
  });

  protected readonly preferredCountryCodes = computed(() => {
    const available = new Set(this.countries().map((country) => country.code));
    return (this.preferredCountries() ?? []).filter((code) =>
      available.has(code),
    );
  });

  protected readonly effectiveCountry = computed<SolarisCountryCode>(() => {
    const explicit = this.country();
    if (explicit) return explicit;
    const selected = this.selectedCountry();
    if (selected && this.countryAllowed(selected)) return selected;
    const fromValue = this.internalValue()
      ? detectCountry(this.internalValue())
      : undefined;
    if (fromValue && this.countryAllowed(fromValue)) return fromValue;
    const def = this.defaultCountry();
    if (def && this.countryAllowed(def)) return def;
    const first = this.countries()[0];
    return first?.code ?? 'US';
  });

  protected readonly selectedCountryObject = computed<
    SolarisCountry | undefined
  >(() => {
    const code = this.effectiveCountry();
    return (
      this.countries().find((country) => country.code === code) ??
      this.countries()[0]
    );
  });

  protected readonly selectedFlag = computed(
    () => this.selectedCountryObject()?.flag ?? '',
  );

  protected readonly selectedCallingCode = computed(
    () => this.selectedCountryObject()?.callingCode ?? '',
  );

  protected readonly hasPrefix = computed(() => true);

  protected readonly hasSuffix = computed(() => {
    return !!this.projectedSuffix() || !!this.suffix() || this.canClear();
  });
  protected readonly effectiveSuffix = computed(() => {
    const icon = this.suffix();
    return icon && !this.projectedSuffix() ? icon : undefined;
  });
  protected readonly canClear = computed(() => {
    return (
      this.clearable() &&
      (this.internalValue().length > 0 || this.displayValue().length > 0) &&
      !this.isEffectivelyDisabled() &&
      !this.isEffectivelyReadonly()
    );
  });
  protected readonly clearAriaLabel = computed(() => {
    const key = this.clearLabelKey();
    if (key) {
      return this.translateService.translate(key);
    }
    const text = this.clearLabel();
    if (text) {
      return text;
    }
    return this.translateWithDefault(
      'solaris.phone-field.clear',
      'Clear phone number',
    );
  });

  protected readonly isEffectivelyDisabled = computed(() => {
    return this.disabledInput() || this.internalDisabled();
  });

  protected readonly effectiveDensity = computed<SolarisPhoneFieldDensity>(
    () => {
      return this.density() ?? this.themeService.density;
    },
  );

  protected readonly elementId = computed(() => {
    return resolveElementId(this.elementRef, 'solaris-phone-field');
  });

  protected readonly _describedByIds = signal<string[]>([]);

  protected readonly ariaDescribedBy = computed(() => {
    const ids = this._describedByIds();
    return ids.length > 0 ? ids.join(' ') : null;
  });

  get id(): string {
    return this.fieldId() ?? this.elementId();
  }

  get focused(): boolean {
    return this.internalFocused();
  }

  get disabled(): boolean {
    return this.isEffectivelyDisabled();
  }

  get readonly(): boolean {
    return this.isEffectivelyReadonly();
  }

  get invalid(): boolean {
    return this.isFieldInvalid();
  }

  get required(): boolean {
    return this.requiredInput();
  }

  get describedByIds(): string[] {
    return this._describedByIds();
  }

  setDescribedByIds(ids: string[]): void {
    this._describedByIds.set([...ids]);
  }

  focus(): void {
    const input = this.inputElementRef();
    if (input) {
      // SECURITY_EXCEPTION: programmatic focus requires the native method; no declarative alternative exists.
      input.nativeElement.focus();
    } else {
      // SECURITY_EXCEPTION: fallback focus on the host requires the native method.
      this.elementRef.nativeElement.focus();
    }
  }

  protected readonly isEffectivelyReadonly = computed(() => {
    return this.readonlyInput();
  });

  protected readonly canOpen = computed(() => {
    return (
      this.allowAnyCountry() &&
      !this.isEffectivelyDisabled() &&
      !this.isEffectivelyReadonly()
    );
  });

  protected readonly popoverAppearance = computed(() => {
    const appearance = this.appearance();
    if (appearance === 'outline') return 'outline';
    return 'surface';
  });

  protected readonly effectiveMaxLength = computed(() => {
    const explicit = this.maxLength();
    if (explicit !== undefined) {
      return explicit;
    }
    return getMaxNationalNumberLength(this.effectiveCountry());
  });

  /**
   * Native `maxlength` for the inner input. `effectiveMaxLength` counts
   * national digits, but the input displays the formatted value (e.g. BR
   * `(11) 99999-8888` is 15 chars for 11 digits). Binding the digit count
   * directly would truncate the formatted text while typing, so the native
   * limit is derived from the formatted length instead. Digit capping is
   * still enforced in `onInput`.
   */
  protected readonly inputMaxLength = computed(() => {
    const max = this.effectiveMaxLength();
    if (!max || max <= 0) {
      return null;
    }
    const country = this.effectiveCountry();
    const national = formatAsYouType('9'.repeat(max), country);
    const callingCode = this.selectedCountryObject()?.callingCode ?? '';
    const display = callingCode
      ? formatInternationalDisplay(callingCode, national)
      : national;
    return Math.max(display.length, max);
  });

  protected readonly placeholderText = computed(() => {
    const key = this.placeholderKey();
    if (key) {
      return this.translateService.translate(key);
    }
    if (this.placeholder() != null) {
      return this.placeholder() as string;
    }
    const example = getExampleNumberFor(this.effectiveCountry());
    if (!example) return '';
    const callingCode = this.selectedCountryObject()?.callingCode ?? '';
    return callingCode ? `+${callingCode} ${example}` : example;
  });

  protected readonly searchPlaceholderText = computed(() => {
    const key = this.searchPlaceholderKey();
    if (key) {
      return this.translateService.translate(key);
    }
    if (this.searchPlaceholder()) {
      return this.searchPlaceholder() as string;
    }
    return this.translateWithDefault(
      'solaris.phone-field.search.placeholder',
      'Search country or code',
    );
  });

  protected readonly emptyTextValue = computed(() => {
    const key = this.emptyTextKey();
    if (key) {
      return this.translateService.translate(key);
    }
    if (this.emptyText()) {
      return this.emptyText() as string;
    }
    return this.translateWithDefault(
      'solaris.phone-field.empty',
      'No countries available',
    );
  });

  protected readonly noResultsTextValue = computed(() => {
    const key = this.noResultsTextKey();
    if (key) {
      return this.translateService.translate(key);
    }
    if (this.noResultsText()) {
      return this.noResultsText() as string;
    }
    return this.translateWithDefault(
      'solaris.phone-field.noResults',
      'No results found',
    );
  });

  protected readonly countryButtonLabelText = computed(() => {
    const key = this.countryButtonLabelKey();
    if (key) {
      return this.translateService.translate(key);
    }
    if (this.countryButtonLabel()) {
      return this.countryButtonLabel() as string;
    }
    return this.translateWithDefault(
      'solaris.phone-field.country',
      'Select country code',
    );
  });

  protected readonly computedError = computed(() => {
    const manualError = this.error() || this.translateKey(this.errorKey());
    if (manualError) return manualError;

    const isTouchedOrDirty = this.touched() || this.dirty();
    if (!isTouchedOrDirty || this.internalFocused()) return '';

    if (!this.displayValue() || this.displayValue().trim().length === 0) {
      if (this.requiredInput()) {
        return this.buildError(
          this.requiredError(),
          this.requiredErrorKey(),
          'solaris.phone-field.required',
          'Phone number is required.',
        );
      }
      return '';
    }

    if (!this.internalValue()) {
      const reason = getPhoneLengthReason(
        this.displayValue(),
        this.effectiveCountry(),
      );
      if (reason === 'TOO_SHORT') {
        return this.buildError(
          this.tooShortError(),
          this.tooShortErrorKey(),
          'solaris.phone-field.tooShort',
          'Phone number is too short.',
        );
      }
      if (reason === 'TOO_LONG') {
        return this.buildError(
          this.tooLongError(),
          this.tooLongErrorKey(),
          'solaris.phone-field.tooLong',
          'Phone number is too long.',
        );
      }
      return this.buildError(
        this.invalidError(),
        this.invalidErrorKey(),
        'solaris.phone-field.invalid',
        'Enter a valid phone number.',
      );
    }

    return '';
  });

  protected readonly isFieldInvalid = computed(() => {
    const manual = this.invalidInput();
    if (manual !== undefined) {
      return manual;
    }
    if (this.internalFocused()) {
      return false;
    }
    const isTouchedOrDirty = this.touched() || this.dirty();
    if (!isTouchedOrDirty) {
      return false;
    }
    return !!this.computedError();
  });

  constructor() {
    super();
    effect(() => {
      const value = this.value();
      if (value !== this.lastAppliedValue) {
        this.lastAppliedValue = value;
        this.internalValue.set(value);
        this.applyDisplayFromValue(value);
      }
    });
  }

  private lastAppliedValue = '';

  ngAfterViewInit(): void {
    const trigger = this.popoverTrigger();
    if (trigger) {
      const openedSub = trigger.solarisPopoverOpened.subscribe(() => {
        this.panelOpen.set(true);
      });
      const closedSub = trigger.solarisPopoverClosed.subscribe(() => {
        this.panelOpen.set(false);
        this.markAsTouched();
      });
      this.popoverSubscriptions.push(
        () => openedSub.unsubscribe(),
        () => closedSub.unsubscribe(),
      );
    }
  }

  ngOnDestroy(): void {
    this.popoverSubscriptions.forEach((fn) => fn());
  }

  writeValue(value: string | null | undefined = ''): void {
    const safe = value ?? '';
    this.internalValue.set(safe);
    this.applyDisplayFromValue(safe);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.internalDisabled.set(isDisabled);
  }

  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const raw = target.value;
    const rawCaret = target.selectionStart ?? raw.length;

    if (!this.dirty()) {
      this.dirty.set(true);
    }

    // Typing always dismisses the country panel so the list never
    // overlaps the field mid-edit (the search box inside the panel is a
    // separate input and is unaffected). No focus restore: the user is
    // already interacting with the phone input and stealing focus back
    // would drop keystrokes.
    this.dismissCountryPanel();

    const current = this.effectiveCountry();
    // Deletion assist: when backspace removes only auto-added formatting
    // (e.g. the `)` in `+55 (11)`), also drop the last digit so the number
    // visibly shrinks instead of resurrecting the formatting character.
    const effectiveRaw = adjustRawForTrailingFormatDeletion(
      raw,
      this.displayValue(),
    );
    const parsed = parseEditablePhoneInput(
      effectiveRaw,
      current,
      this.countries(),
      this.effectiveMaxLength(),
    );

    if (parsed.country !== current && !this.country()) {
      if (this.countryAllowed(parsed.country)) {
        this.selectedCountry.set(parsed.country);
        this.countryChange.emit(parsed.country);
      }
    }

    this.displayValue.set(parsed.display);
    if (target.value !== parsed.display) {
      target.value = parsed.display;
      try {
        const trimmed = raw.trim();
        const isInternational =
          trimmed.startsWith('+') || trimmed.startsWith('00');
        let autoPrefixDigits = 0;
        if (!isInternational) {
          const callingCode =
            this.countries().find((item) => item.code === parsed.country)
              ?.callingCode ?? '';
          autoPrefixDigits = callingCode.length;
        }
        const caret = mapCaretToFormatted(
          effectiveRaw,
          Math.min(rawCaret, effectiveRaw.length),
          parsed.display,
          autoPrefixDigits,
        );
        target.setSelectionRange(caret, caret);
      } catch {
        // Caret restore is best-effort; a failed sync must not break typing.
      }
    }

    if (parsed.e164) {
      this.internalValue.set(parsed.e164);
      this.onChange(parsed.e164);
      this.valueChange.emit(parsed.e164);
    } else {
      this.internalValue.set('');
      this.onChange('');
      this.valueChange.emit('');
    }
  }

  protected onInputFocus(): void {
    this.internalFocused.set(true);
    // Same no-restore dismissal as typing: focusing the field means the
    // user took the interaction back from an open panel.
    this.dismissCountryPanel();
  }

  protected onInputBlur(): void {
    this.internalFocused.set(false);
    this.markAsTouched();
  }

  protected clearValue(): void {
    this.internalValue.set('');
    this.displayValue.set('');
    this.dirty.set(true);
    const input = this.inputElementRef()?.nativeElement;
    if (input && input.value !== '') {
      input.value = '';
    }
    this.onChange('');
    this.valueChange.emit('');
    this.cleared.emit();
    this.markAsTouched();
    this.dismissCountryPanel();
    this.focus();
  }

  protected onCountryToggle(event: Event): void {
    event.stopPropagation();
    if (this.canOpen()) {
      this.popoverTrigger()?.toggle();
    }
  }

  protected closeCountryPanel(): void {
    this.popoverTrigger()?.close();
  }

  /**
   * Silently dismiss the panel without restoring focus. Used when the
   * interaction already lives in the phone input (typing, focusing,
   * clearing): restoring focus to the pre-open element would blur the
   * input and drop keystrokes. Panel-initiated closes (option select,
   * Escape/Tab in the search) keep using `closeCountryPanel` so focus
   * returns to the trigger as documented.
   */
  protected dismissCountryPanel(): void {
    this.popoverTrigger()?.close({ restoreFocus: false });
  }

  protected onInputClick(event: Event): void {
    event.stopPropagation();
  }

  protected selectCountry(country: SolarisCountry): void {
    const previousCountry = this.effectiveCountry();
    const previousCallingCode =
      this.countries().find((item) => item.code === previousCountry)
        ?.callingCode ?? '';
    this.selectedCountry.set(country.code);
    this.countryChange.emit(country.code);

    const digits = this.displayValue().replace(/\D+/g, '');
    let national = digits;
    if (
      previousCallingCode &&
      national.startsWith(previousCallingCode) &&
      previousCallingCode !== country.callingCode
    ) {
      national = national.slice(previousCallingCode.length);
    } else if (national.startsWith(country.callingCode)) {
      national = national.slice(country.callingCode.length);
    }
    if (national) {
      national = national.slice(0, this.effectiveMaxLength());
      const formatted = formatAsYouType(national, country.code);
      const display = formatInternationalDisplay(
        country.callingCode,
        formatted,
      );
      this.displayValue.set(display);
      const input = this.inputElementRef()?.nativeElement;
      if (input && input.value !== display) {
        input.value = display;
        try {
          input.setSelectionRange(display.length, display.length);
        } catch {
          // Caret placement is best-effort after a country switch.
        }
      }
      const e164 = toValidE164(display, country.code);
      if (e164) {
        this.internalValue.set(e164);
        this.onChange(e164);
        this.valueChange.emit(e164);
      }
    } else {
      this.displayValue.set('');
      const input = this.inputElementRef()?.nativeElement;
      if (input && input.value !== '') {
        input.value = '';
      }
    }

    this.popoverTrigger()?.close();
  }

  private applyDisplayFromValue(e164: string): void {
    if (!e164) {
      this.displayValue.set('');
      return;
    }
    const { country, display } = formatE164ForDisplay(
      e164,
      this.effectiveCountry(),
    );
    if (country && !this.country() && this.countryAllowed(country)) {
      this.selectedCountry.set(country);
    }
    this.displayValue.set(display || formatE164(e164));
  }

  private countryAllowed(code: SolarisCountryCode): boolean {
    return this.countries().some((country) => country.code === code);
  }

  private markAsTouched(): void {
    if (!this.touched()) {
      this.touched.set(true);
      this.onTouched();
    }
  }

  private translateWithDefault(
    key: string,
    defaultText: string,
    params?: SolarisTranslateParams,
  ): string {
    const translated = this.translateService?.translate(key, params);
    if (translated === undefined || translated === null) return defaultText;
    return translated !== key ? translated : defaultText;
  }

  private translateKey(key: string | undefined): string | undefined {
    if (key) {
      const translated = this.translateService?.translate(key);
      if (translated === undefined || translated === null) return undefined;
      return translated !== key ? translated : undefined;
    }
    return undefined;
  }

  private buildError(
    direct: string | undefined,
    key: string | undefined,
    fallbackKey: string,
    fallbackDefault: string,
  ): string {
    return (
      direct ??
      this.translateKey(key) ??
      this.translateWithDefault(fallbackKey, fallbackDefault)
    );
  }
}
