import {
  Component,
  input,
  computed,
  signal,
  output,
  effect,
  forwardRef,
  inject,
  ViewChild,
  ElementRef,
  isDevMode,
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormsModule,
} from '@angular/forms';

import type {
  SolarisPasswordFieldAppearance,
  SolarisPasswordFieldSize,
  SolarisPasswordFieldDensity,
  SolarisPasswordFieldRadius,
  SolarisPasswordStrength,
} from '../model/password-field.types';
import {
  SolarisFormFieldComponent,
  SolarisFormSuffixDirective,
} from '../../form-field';
import type { SolarisPasswordPolicy } from '../model/password-policy.types';
import { solarisPasswordValidator } from '../validators/password.validator';
import { SolarisTranslateService } from '../../../services/translation';
import type { SolarisTranslateParams } from '../../../services/translation';
import { SolarisIconComponent } from '../../../components/icon';
import { SolarisInputDirective } from '../../input';
import { calculatePasswordStrength } from '../model/password-strength';

interface RequirementItem {
  key: string;
  label: string;
  met: boolean;
}

@Component({
  selector: 'solaris-password-field',
  standalone: true,
  imports: [
    FormsModule,
    SolarisFormFieldComponent,
    SolarisInputDirective,
    SolarisFormSuffixDirective,
    SolarisIconComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SolarisPasswordFieldComponent),
      multi: true,
    },
  ],
  templateUrl: './password-field.component.html',
  styleUrls: ['./password-field.component.scss'],
})
export class SolarisPasswordFieldComponent implements ControlValueAccessor {
  private readonly translateService = inject(SolarisTranslateService);

  @ViewChild('inputElement', { read: ElementRef })
  protected inputElementRef?: ElementRef<HTMLInputElement>;

  readonly value = input<string>('');
  readonly label = input<string>('');
  readonly labelKey = input<string>();
  readonly hint = input<string>('');
  readonly hintKey = input<string>();
  readonly error = input<string>('');
  readonly errorKey = input<string>();
  readonly placeholder = input<string>();
  readonly placeholderKey = input<string>();
  readonly autocomplete = input<string>();
  readonly name = input<string>();
  readonly id = input<string>();
  readonly required = input<boolean>(false);
  readonly optional = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly invalid = input<boolean | undefined>();
  readonly appearance = input<SolarisPasswordFieldAppearance>('outline');
  readonly size = input<SolarisPasswordFieldSize>('md');
  readonly density = input<SolarisPasswordFieldDensity>();
  readonly radius = input<SolarisPasswordFieldRadius>('md');
  readonly fullWidth = input<boolean>(true);

  readonly showToggle = input<boolean>(true);
  readonly visible = input<boolean>(false);
  readonly showRequirements = input<boolean>(false);
  readonly showStrength = input<boolean>(false);
  readonly policy = input<SolarisPasswordPolicy | undefined>();
  readonly validatePolicy = input<boolean>(true);
  readonly minLength = input<number>();
  readonly maxLength = input<number>();

  readonly toggleShowLabel = input<string>();
  readonly toggleShowLabelKey = input<string>();
  readonly toggleHideLabel = input<string>();
  readonly toggleHideLabelKey = input<string>();

  readonly valueChange = output<string>();
  readonly visibleChange = output<boolean>();

  protected readonly internalValue = signal<string>('');
  protected readonly internalFocused = signal(false);
  protected readonly internalDisabled = signal(false);
  protected readonly _visibleState = signal(false);
  protected readonly touched = signal(false);
  protected readonly dirty = signal(false);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  protected readonly effectivePolicy = computed<
    SolarisPasswordPolicy | undefined
  >(() => {
    const p = this.policy();
    const min = this.minLength();
    const max = this.maxLength();
    if (!p && min === undefined && max === undefined) {
      return undefined;
    }
    return {
      ...(p ?? {}),
      ...(min !== undefined ? { minLength: min } : {}),
      ...(max !== undefined ? { maxLength: max } : {}),
    };
  });

  constructor() {
    effect(() => {
      this._visibleState.set(this.visible());
    });
  }

  protected readonly inputType = computed(() => {
    return this._visibleState() ? 'text' : 'password';
  });

  protected readonly placeholderText = computed(() => {
    const key = this.placeholderKey();
    if (key) {
      return this.translateService.translate(key);
    }
    return this.placeholder() ?? '';
  });

  protected readonly toggleLabel = computed(() => {
    if (this._visibleState()) {
      const key = this.toggleHideLabelKey();
      if (key) {
        return this.translateService.translate(key);
      }
      return (
        this.toggleHideLabel() ||
        this.translateWithDefault(
          'solaris.password-field.toggle.hide',
          'Hide password',
        )
      );
    }
    const key = this.toggleShowLabelKey();
    if (key) {
      return this.translateService.translate(key);
    }
    return (
      this.toggleShowLabel() ||
      this.translateWithDefault(
        'solaris.password-field.toggle.show',
        'Show password',
      )
    );
  });

  private translateWithDefault(
    key: string,
    defaultText: string,
    params?: SolarisTranslateParams,
  ): string {
    const result = this.translateService.translate(key, params);
    return result !== key ? result : defaultText;
  }

  protected readonly isEffectivelyDisabled = computed(() => {
    return this.disabled() || this.internalDisabled();
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

    const currentPolicy = this.effectivePolicy();
    if (this.validatePolicy() && currentPolicy) {
      const val = this.internalValue();
      if (typeof val === 'string' && val.length > 0) {
        const errors = solarisPasswordValidator(currentPolicy)({
          value: val,
        } as never);
        if (errors && Object.keys(errors).length > 0) {
          return true;
        }
      }
    }

    return false;
  });

  protected readonly requirementList = computed<RequirementItem[]>(() => {
    const p = this.effectivePolicy();
    if (!p) {
      return [];
    }
    const val = this.internalValue();
    const items: RequirementItem[] = [];

    if (p.minLength !== undefined) {
      items.push({
        key: 'minLength',
        label: this.translateWithDefault(
          'solaris.password-field.requirement.minLength',
          `At least ${p.minLength} characters.`,
          { count: p.minLength },
        ),
        met: val.length >= p.minLength,
      });
    }

    if (p.maxLength !== undefined) {
      items.push({
        key: 'maxLength',
        label: this.translateWithDefault(
          'solaris.password-field.requirement.maxLength',
          `At most ${p.maxLength} characters.`,
          { count: p.maxLength },
        ),
        met: val.length <= p.maxLength,
      });
    }

    if (p.requireLowercase) {
      items.push({
        key: 'lowercase',
        label: this.translateWithDefault(
          'solaris.password-field.requirement.lowercase',
          'One lowercase letter.',
        ),
        met: /[a-z]/.test(val),
      });
    }

    if (p.requireUppercase) {
      items.push({
        key: 'uppercase',
        label: this.translateWithDefault(
          'solaris.password-field.requirement.uppercase',
          'One uppercase letter.',
        ),
        met: /[A-Z]/.test(val),
      });
    }

    if (p.requireNumber) {
      items.push({
        key: 'number',
        label: this.translateWithDefault(
          'solaris.password-field.requirement.number',
          'One number.',
        ),
        met: /\d/.test(val),
      });
    }

    if (p.requireSymbol) {
      items.push({
        key: 'symbol',
        label: this.translateWithDefault(
          'solaris.password-field.requirement.symbol',
          'One symbol.',
        ),
        met: /[^a-zA-Z0-9]/.test(val),
      });
    }

    if (p.disallowWhitespace) {
      items.push({
        key: 'noWhitespace',
        label: this.translateWithDefault(
          'solaris.password-field.requirement.noWhitespace',
          'No spaces.',
        ),
        met: !/\s/.test(val),
      });
    }

    return items;
  });

  protected readonly strengthLevel = computed<SolarisPasswordStrength>(() =>
    calculatePasswordStrength(this.internalValue()),
  );

  protected readonly strengthLabelText = computed(() => {
    const level = this.strengthLevel();
    switch (level) {
      case 'empty':
        return '';
      case 'weak':
        return this.translateWithDefault(
          'solaris.password-field.strength.weak',
          'Weak',
        );
      case 'medium':
        return this.translateWithDefault(
          'solaris.password-field.strength.medium',
          'Medium',
        );
      case 'strong':
        return this.translateWithDefault(
          'solaris.password-field.strength.strong',
          'Strong',
        );
    }
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
    this.valueChange.emit(newValue);
  }

  protected onInputFocus(): void {
    this.internalFocused.set(true);
  }

  protected onInputBlur(): void {
    this.internalFocused.set(false);

    if (!this.touched()) {
      this.touched.set(true);
    }

    this.onTouched();
  }

  protected toggleVisibility(): void {
    const newVisible = !this._visibleState();
    this._visibleState.set(newVisible);
    this.visibleChange.emit(newVisible);

    if (this.inputElementRef) {
      try {
        // SECURITY_EXCEPTION: nativeElement.focus() is the standard DOM API to restore focus after toggle. No SSR-safe alternative exists for imperative focus. Same approach used by Angular CDK.
        this.inputElementRef.nativeElement.focus();
      } catch {
        if (isDevMode()) {
          console.warn(
            '[SolarisPasswordField] Could not restore focus after toggle.',
          );
        }
      }
    }
  }
}
