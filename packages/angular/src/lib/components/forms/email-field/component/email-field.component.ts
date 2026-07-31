import {
  Component,
  input,
  computed,
  signal,
  forwardRef,
  inject,
  ViewChild,
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
  SolarisEmailFieldSize,
  SolarisEmailFieldDensity,
  SolarisEmailFieldRadius,
} from '../model/email-field.types';
import {
  isValidEmailFormat,
  extractDomain,
  isDomainAllowed,
  isDomainBlocked,
} from '../validators/email-field.validators';
import type { SolarisTranslateParams } from '../../../../services/translation';
import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisFormFieldComponent } from '../../form-field';
import { SolarisInputDirective } from '../../input';

@Component({
  selector: 'solaris-email-field',
  standalone: true,
  imports: [FormsModule, SolarisFormFieldComponent, SolarisInputDirective],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SolarisEmailFieldComponent),
      multi: true,
    },
  ],
  templateUrl: './email-field.component.html',
  styleUrls: ['./email-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolarisEmailFieldComponent implements ControlValueAccessor {
  private readonly translateService = inject(SolarisTranslateService);

  @ViewChild('inputElement', { read: ElementRef })
  protected inputElementRef?: ElementRef<HTMLInputElement>;

  readonly id = input<string>();
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
  readonly required = input<boolean>(false);
  readonly optional = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly trimOnBlur = input<boolean>(true);
  readonly allowedDomainErrorKey = input<string>();
  readonly blockedDomainErrorKey = input<string>();
  readonly autocomplete = input<string>('email');
  readonly invalid = input<boolean | undefined>();
  readonly normalizeLowercase = input<boolean>(false);
  readonly allowedDomains = input<string[] | undefined>();
  readonly blockedDomains = input<string[] | undefined>();
  readonly density = input<SolarisEmailFieldDensity>();
  readonly size = input<SolarisEmailFieldSize>('md');
  readonly radius = input<SolarisEmailFieldRadius>('md');
  readonly appearance = input<SolarisEmailFieldAppearance>('outline');
  readonly maxLength = input<number | undefined>();
  readonly validateDomain = input<boolean, boolean>(false, {
    transform: (v: boolean) => v,
  });

  protected readonly internalValue = signal<string>('');
  protected readonly internalDisabled = signal(false);
  protected readonly internalFocused = signal(false);
  protected readonly touched = signal(false);
  protected readonly dirty = signal(false);

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
    return this.disabled() || this.internalDisabled();
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
      if (this.required()) {
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
    const manual = this.invalid();
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

      if (this.inputElementRef) {
        try {
          // SECURITY_EXCEPTION: nativeElement.value assignment is required to sync the input element with the normalized value after blur. Angular's data binding may not reflect synchronous value changes to the native input. Same approach is standard for CVA blur normalization.
          this.inputElementRef.nativeElement.value = currentValue;
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
