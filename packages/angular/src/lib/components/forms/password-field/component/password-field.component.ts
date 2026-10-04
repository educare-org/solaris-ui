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
  isDevMode,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormsModule,
} from '@angular/forms';

import type {
  SolarisPasswordFieldAppearance,
  SolarisPasswordFieldDensity,
  SolarisPasswordFieldRadius,
  SolarisPasswordFieldSize,
  SolarisPasswordStrength,
} from '../model/password-field.types';
import type { SolarisIconName } from '../../../../services/icon';
import {
  SolarisFormFieldComponent,
  SolarisFormPrefixDirective,
  SolarisFormSuffixActionDirective,
  SolarisFormSuffixDirective,
} from '../../form-field';
import type { SolarisPasswordPolicy } from '../model/password-policy.types';
import { SolarisFormControl } from '../../form-field/model/form-control.contract';
import { resolveElementId } from '../../../../core';
import { solarisPasswordValidator } from '../validators/password.validator';
import { SolarisTranslateService } from '../../../../services/translation';
import type { SolarisTranslateParams } from '../../../../services/translation';
import { calculatePasswordStrength } from '../model/password-strength';
import { SolarisThemeService } from '../../../../services/theme';
import { SolarisIconComponent } from '../../../icon';
import { SolarisInputDirective } from '../../input';

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
    SolarisFormSuffixActionDirective,
    SolarisIconComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SolarisPasswordFieldComponent),
      multi: true,
    },
    {
      provide: SolarisFormControl,
      useExisting: forwardRef(() => SolarisPasswordFieldComponent),
    },
  ],
  templateUrl: './password-field.component.html',
  styleUrls: ['./password-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-full-width]': 'fullWidth() || undefined',
  },
})
export class SolarisPasswordFieldComponent
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

  protected readonly effectiveDensity = computed(() => {
    return this.density() ?? this.themeService.density;
  });

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
  readonly fieldId = input<string>(undefined, { alias: 'id' });
  readonly requiredInput = input<boolean>(false, { alias: 'required' });
  readonly optional = input<boolean>(false);
  readonly disabledInput = input<boolean>(false, { alias: 'disabled' });
  readonly readonlyInput = input<boolean>(false, { alias: 'readonly' });
  readonly loading = input<boolean>(false);
  readonly invalidInput = input<boolean | undefined>(undefined, {
    alias: 'invalid',
  });
  readonly appearance = input<SolarisPasswordFieldAppearance>('outline');
  readonly density = input<SolarisPasswordFieldDensity>();
  readonly size = input<SolarisPasswordFieldSize>('md');
  readonly radius = input<SolarisPasswordFieldRadius>('sm');
  readonly fullWidth = input<boolean>(true);
  readonly prefix = input<SolarisIconName>();
  readonly suffix = input<SolarisIconName>();

  protected readonly hasPrefix = computed(() => {
    return !!this.prefix() || !!this.projectedPrefix();
  });
  protected readonly hasSuffix = computed(() => {
    return !!this.suffix() || !!this.projectedSuffix() || this.showToggle();
  });

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
      ...p,
      ...(min !== undefined ? { minLength: min } : {}),
      ...(max !== undefined ? { maxLength: max } : {}),
    };
  });

  constructor() {
    super();
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
    return this.disabledInput() || this.internalDisabled();
  });

  protected readonly elementId = computed(() => {
    return resolveElementId(this.elementRef, 'solaris-password-field');
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

    const val = this.internalValue();
    if (this.requiredInput() && (!val || val.length === 0)) {
      return true;
    }

    const currentPolicy = this.effectivePolicy();
    if (this.validatePolicy() && currentPolicy) {
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

  protected readonly computedError = computed(() => {
    if (!this.isFieldInvalid()) {
      return '';
    }

    const val = this.internalValue();
    if (!val || val.length === 0) {
      if (this.requiredInput()) {
        return this.translateWithDefault(
          'solaris.password-field.error.required',
          'Password is required.',
        );
      }
    }

    return '';
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

    if (this.inputElementRef()) {
      try {
        // SECURITY_EXCEPTION: restoring focus after the visibility toggle requires imperative focus; no declarative alternative exists.
        this.inputElementRef()?.nativeElement.focus();
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
