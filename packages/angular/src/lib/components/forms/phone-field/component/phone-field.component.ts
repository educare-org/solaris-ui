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
  afterNextRender,
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
  readonly placeholderKey = input<string>();
  readonly invalidErrorKey = input<string>();
  readonly requiredErrorKey = input<string>();
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
  protected readonly hydrated = signal(false);
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
    return this.countryListFactory(this.translateService.locale());
  });

  protected readonly countries = computed(() => {
    const list = this.allCountries();
    const restrict = this.countryList();
    if (restrict && restrict.length > 0) {
      return list.filter((country) => restrict.includes(country.code));
    }
    return list;
  });

  protected readonly effectiveCountry = computed<SolarisCountryCode>(() => {
    const explicit = this.country();
    if (explicit) return explicit;
    const selected = this.selectedCountry();
    if (selected) return selected;
    const fromValue = this.internalValue()
      ? detectCountry(this.internalValue())
      : undefined;
    if (fromValue && this.countryAllowed(fromValue)) return fromValue;
    const def = this.defaultCountry();
    if (def) return def;
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
    return this.translateService.translate('solaris.phone-field.clear');
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
    const formatted = formatAsYouType('9'.repeat(max), country);
    return Math.max(formatted.length, max);
  });

  protected readonly placeholderText = computed(() => {
    const key = this.placeholderKey();
    if (key) {
      return this.translateService.translate(key);
    }
    if (this.placeholder() != null) {
      return this.placeholder() as string;
    }
    return getExampleNumberFor(this.effectiveCountry());
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
    afterNextRender(() => {
      this.hydrated.set(true);
    });
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

    if (!this.dirty()) {
      this.dirty.set(true);
    }

    const startsWithPlus = raw.trim().startsWith('+');
    let country = this.effectiveCountry();
    let digits = raw.replace(/\D+/g, '');

    if (startsWithPlus) {
      const detected = detectCountry(raw);
      if (detected && !this.country() && this.countryAllowed(detected)) {
        this.selectedCountry.set(detected);
        this.countryChange.emit(detected);
        country = detected;
      }
      const callingCode = this.selectedCallingCode();
      if (callingCode && digits.startsWith(callingCode)) {
        digits = digits.slice(callingCode.length);
      }
    }

    digits = digits.slice(0, this.effectiveMaxLength());
    const formatted = formatAsYouType(digits, country);
    this.displayValue.set(formatted);
    if (target.value !== formatted) {
      target.value = formatted;
    }

    const e164 = toValidE164(formatted, country);
    if (e164) {
      this.internalValue.set(e164);
      this.onChange(e164);
      this.valueChange.emit(e164);
    } else {
      this.internalValue.set('');
      this.onChange('');
      this.valueChange.emit('');
    }
  }

  protected onInputFocus(): void {
    this.internalFocused.set(true);
  }

  protected onInputBlur(): void {
    this.internalFocused.set(false);
    this.markAsTouched();
  }

  protected clearValue(): void {
    this.internalValue.set('');
    this.displayValue.set('');
    this.dirty.set(true);
    this.onChange('');
    this.valueChange.emit('');
    this.cleared.emit();
    this.markAsTouched();
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

  protected onInputClick(event: Event): void {
    event.stopPropagation();
  }

  protected selectCountry(country: SolarisCountry): void {
    this.selectedCountry.set(country.code);
    this.countryChange.emit(country.code);

    const digits = this.displayValue().replace(/\D+/g, '');
    if (digits) {
      const formatted = formatAsYouType(digits, country.code);
      this.displayValue.set(formatted);
      const e164 = toValidE164(formatted, country.code);
      if (e164) {
        this.internalValue.set(e164);
        this.onChange(e164);
        this.valueChange.emit(e164);
      }
    }

    this.popoverTrigger()?.close();
  }

  private applyDisplayFromValue(e164: string): void {
    if (!e164) {
      this.displayValue.set('');
      return;
    }
    const country = detectCountry(e164);
    if (country && !this.country() && this.countryAllowed(country)) {
      this.selectedCountry.set(country);
    }
    this.displayValue.set(formatE164(e164));
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
    const result = this.translateService.translate(key, params);
    return result !== key ? result : defaultText;
  }

  private translateKey(key: string | undefined): string | undefined {
    if (key) {
      const translated = this.translateService.translate(key);
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
