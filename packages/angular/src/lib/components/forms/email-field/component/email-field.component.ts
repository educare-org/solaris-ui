import {
  Component,
  input,
  computed,
  signal,
  output,
  forwardRef,
  inject,
  viewChild,
  contentChild,
  ElementRef,
  isDevMode,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormsModule,
} from '@angular/forms';

import type {
  SolarisEmailFieldAppearance,
  SolarisEmailFieldDensity,
  SolarisEmailFieldRadius,
  SolarisEmailFieldSize,
} from '../model/email-field.types';
import { SolarisFormControl } from '../../form-field/model/form-control.contract';
import { resolveElementId } from '../../../../core';
import type { SolarisIconName } from '../../../../services/icon';
import {
  isValidEmailFormat,
  extractDomain,
  isDomainAllowed,
  isDomainBlocked,
} from '../validators/email-field.validators';
import type { SolarisTranslateParams } from '../../../../services/translation';
import { SolarisTranslateService } from '../../../../services/translation';
import {
  SolarisFormFieldComponent,
  SolarisFormPrefixDirective,
  SolarisFormSuffixActionDirective,
  SolarisFormSuffixDirective,
} from '../../form-field';
import { SolarisInputDirective } from '../../input';
import { SolarisIconComponent } from '../../../icon';
import { SolarisThemeService } from '../../../../services/theme';

@Component({
  selector: 'solaris-email-field',
  standalone: true,
  imports: [
    FormsModule,
    SolarisFormFieldComponent,
    SolarisInputDirective,
    SolarisFormPrefixDirective,
    SolarisFormSuffixDirective,
    SolarisIconComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SolarisEmailFieldComponent),
      multi: true,
    },
    {
      provide: SolarisFormControl,
      useExisting: forwardRef(() => SolarisEmailFieldComponent),
    },
  ],
  templateUrl: './email-field.component.html',
  styleUrls: ['./email-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'effectiveDensity()',
  },
})
export class SolarisEmailFieldComponent
  extends SolarisFormControl
  implements ControlValueAccessor
{
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly translateService = inject(SolarisTranslateService);
  protected readonly themeService = inject(SolarisThemeService);

  protected readonly inputElementRef =
    viewChild<ElementRef<HTMLInputElement>>('inputElement');

  protected readonly projectedPrefix = contentChild(SolarisFormPrefixDirective);
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
  readonly allowedDomainError = input<string>();
  readonly blockedDomainError = input<string>();
  readonly requiredInput = input<boolean>(false, { alias: 'required' });
  readonly optional = input<boolean>(false);
  readonly disabledInput = input<boolean>(false, { alias: 'disabled' });
  readonly readonlyInput = input<boolean>(false, { alias: 'readonly' });
  readonly loading = input<boolean>(false);
  readonly trimOnBlur = input<boolean>(true);
  readonly allowedDomainErrorKey = input<string>();
  readonly blockedDomainErrorKey = input<string>();
  readonly autocomplete = input<string>('email');
  readonly invalidInput = input<boolean | undefined>(undefined, {
    alias: 'invalid',
  });
  readonly normalizeLowercase = input<boolean>(false);
  readonly allowedDomains = input<string[] | undefined>();
  readonly blockedDomains = input<string[] | undefined>();
  readonly density = input<SolarisEmailFieldDensity>();
  readonly size = input<SolarisEmailFieldSize>('md');
  readonly radius = input<SolarisEmailFieldRadius>('sm');
  readonly appearance = input<SolarisEmailFieldAppearance>('outline');
  readonly maxLength = input<number | undefined>();
  readonly validateDomain = input<boolean, boolean>(false, {
    transform: (v: boolean) => v,
  });
  readonly prefix = input<SolarisIconName>();
  readonly suffix = input<SolarisIconName>();
  readonly clearable = input<boolean>(false);
  readonly clearLabel = input<string>();
  readonly clearLabelKey = input<string>();

  readonly cleared = output<void>();

  protected readonly hasPrefix = computed(() => {
    return !!this.projectedPrefix() || !!this.prefix();
  });
  protected readonly hasSuffix = computed(() => {
    return !!this.projectedSuffix() || !!this.suffix() || this.canClear();
  });
  protected readonly canClear = computed(() => {
    return (
      this.clearable() &&
      this.internalValue().length > 0 &&
      !this.isEffectivelyDisabled() &&
      !this.readonlyInput()
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
    return this.translateService.translate('solaris.email-field.clear');
  });

  protected readonly internalValue = signal<string>('');
  protected readonly internalDisabled = signal(false);
  protected readonly internalFocused = signal(false);
  protected readonly touched = signal(false);
  protected readonly dirty = signal(false);

  protected readonly effectiveDensity = computed<SolarisEmailFieldDensity>(
    () => {
      return this.density() ?? this.themeService.density;
    },
  );

  protected readonly elementId = computed(() => {
    return resolveElementId(this.elementRef, 'solaris-email-field');
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
    return this.readonlyInput();
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

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  protected readonly placeholderText = computed(() => {
    const key = this.placeholderKey();
    if (key) {
      return this.translateService.translate(key);
    }
    return this.placeholder() ?? '';
  });

  protected readonly isEffectivelyDisabled = computed(() => {
    return this.disabledInput() || this.internalDisabled();
  });

  protected readonly effectiveValidateDomain = computed(() => {
    const explicit = this.validateDomain();
    if (explicit) return true;
    const allowed = this.allowedDomains();
    const blocked = this.blockedDomains();
    if (allowed && allowed.length > 0) return true;
    return !!(blocked && blocked.length > 0);
  });

  protected readonly computedError = computed(() => {
    const manualError = this.error() || this.translateKey(this.errorKey());
    if (manualError) return manualError;

    const val = this.internalValue();
    const isTouchedOrDirty = this.touched() || this.dirty();
    if (!isTouchedOrDirty || this.internalFocused()) return '';

    if (!val || val.trim().length === 0) {
      if (this.requiredInput()) {
        return this.buildError(
          this.requiredError(),
          this.requiredErrorKey(),
          'solaris.email-field.required',
          'Email is required.',
        );
      }
      return '';
    }

    if (!isValidEmailFormat(val)) {
      return this.buildError(
        this.invalidError(),
        this.invalidErrorKey(),
        'solaris.email-field.invalid',
        'Enter a valid email address.',
      );
    }

    return this.computeDomainError(val) ?? '';
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

  writeValue(safe = ''): void {
    this.internalValue.set(safe);
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
    const newValue = target.value;

    if (!this.dirty()) {
      this.dirty.set(true);
    }

    this.internalValue.set(newValue);
    this.onChange(newValue);
  }

  protected clearValue(): void {
    this.internalValue.set('');
    this.dirty.set(true);
    this.onChange('');
    this.cleared.emit();
    if (!this.touched()) {
      this.touched.set(true);
    }
    this.onTouched();
  }

  protected onInputFocus(): void {
    this.internalFocused.set(true);
  }

  protected onInputBlur(): void {
    this.internalFocused.set(false);

    let currentValue = this.internalValue();

    if (this.trimOnBlur()) {
      currentValue = currentValue.trim();
    }

    if (this.normalizeLowercase()) {
      currentValue = currentValue.toLowerCase();
    }

    if (currentValue !== this.internalValue()) {
      this.internalValue.set(currentValue);
      this.onChange(currentValue);

      if (this.inputElementRef()) {
        try {
          // SECURITY_EXCEPTION: syncing the native value after blur normalization requires a direct write; data binding may not reflect it synchronously.
          this.inputElementRef()!.nativeElement.value = currentValue;
        } catch {
          if (isDevMode()) {
            console.warn(
              '[SolarisEmailField] Could not update input value after normalization.',
            );
          }
        }
      }
    }

    if (!this.touched()) {
      this.touched.set(true);
    }

    this.onTouched();
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

  private computeDomainError(val: string): string | undefined {
    if (!this.effectiveValidateDomain()) return undefined;
    const domain = extractDomain(val);
    if (!domain) return undefined;

    const allowed = this.allowedDomains();
    if (allowed && allowed.length > 0 && !isDomainAllowed(domain, allowed)) {
      return this.buildError(
        this.allowedDomainError(),
        this.allowedDomainErrorKey(),
        'solaris.email-field.allowedDomain',
        'Email domain is not allowed.',
      );
    }

    const blocked = this.blockedDomains();
    if (blocked && blocked.length > 0 && isDomainBlocked(domain, blocked)) {
      return this.buildError(
        this.blockedDomainError(),
        this.blockedDomainErrorKey(),
        'solaris.email-field.blockedDomain',
        'Email domain is not allowed.',
      );
    }

    return undefined;
  }
}
