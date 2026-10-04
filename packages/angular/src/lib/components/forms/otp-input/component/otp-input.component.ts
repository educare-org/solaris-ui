import {
  Component,
  input,
  computed,
  signal,
  output,
  effect,
  forwardRef,
  inject,
  contentChild,
  viewChildren,
  ElementRef,
  AfterViewInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  type ControlValueAccessor,
  FormsModule,
} from '@angular/forms';

import {
  SolarisFormFieldComponent,
  SolarisFormFieldTriggerDirective,
  SolarisFormSuffixActionDirective,
} from '../../form-field';
import { SolarisFormControl } from '../../form-field/model/form-control.contract';
import { SolarisTranslateService } from '../../../../services/translation';
import type { SolarisTranslateParams } from '../../../../services/translation';
import { SolarisThemeService } from '../../../../services/theme';
import { resolveElementId } from '../../../../core';

import type {
  SolarisOtpInputAppearance,
  SolarisOtpInputCharType,
  SolarisOtpInputDensity,
  SolarisOtpInputRadius,
  SolarisOtpInputSize,
} from '../model/otp-input.types';

const MASK_CHAR = '•';

@Component({
  selector: 'solaris-otp-input',
  standalone: true,
  imports: [
    FormsModule,
    SolarisFormFieldComponent,
    SolarisFormFieldTriggerDirective,
    SolarisFormSuffixActionDirective,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SolarisOtpInputComponent),
      multi: true,
    },
    {
      provide: SolarisFormControl,
      useExisting: forwardRef(() => SolarisOtpInputComponent),
    },
  ],
  templateUrl: './otp-input.component.html',
  styleUrls: ['./otp-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-otp-input',
    '[attr.id]': 'elementId()',
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-radius]': 'radius()',
    '[attr.data-length]': 'maxLength()',
    '[attr.data-masked]': 'masked() ? "" : null',
    '[attr.data-char-type]': 'charType()',
    '[attr.data-invalid]': 'isFieldInvalid() ? "" : null',
  },
})
export class SolarisOtpInputComponent
  extends SolarisFormControl
  implements ControlValueAccessor, AfterViewInit
{
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly translateService = inject(SolarisTranslateService);
  protected readonly themeService = inject(SolarisThemeService);

  protected readonly boxRefs =
    viewChildren<ElementRef<HTMLInputElement>>('box');

  protected readonly projectedSuffixAction = contentChild(
    SolarisFormSuffixActionDirective,
    { descendants: true },
  );

  readonly hintKey = input<string>();
  readonly hint = input<string>('');
  readonly labelKey = input<string>();
  readonly errorKey = input<string>();
  readonly value = input<string>('');
  readonly label = input<string>('');
  readonly error = input<string>('');
  readonly requiredError = input<string>();
  readonly invalidError = input<string>();
  readonly requiredErrorKey = input<string>();
  readonly invalidErrorKey = input<string>();
  readonly requiredInput = input(false, { alias: 'required' });
  readonly optional = input<boolean>(false);
  readonly disabledInput = input(false, { alias: 'disabled' });
  readonly readonlyInput = input(false, { alias: 'readonly' });
  readonly manualInvalid = input<boolean | undefined>(undefined, {
    alias: 'invalid',
  });
  readonly maxLength = input<number>(12);
  readonly minLength = input<number>(1);
  readonly charType = input<SolarisOtpInputCharType>('numeric');
  readonly masked = input<boolean>(false);
  readonly separatorEvery = input<number>(0);
  readonly autoFocus = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly appearance = input<SolarisOtpInputAppearance>('outline');
  readonly density = input<SolarisOtpInputDensity>();
  readonly size = input<SolarisOtpInputSize>('md');
  readonly radius = input<SolarisOtpInputRadius>('sm');

  readonly valueChange = output<string>();
  readonly completed = output<void>();

  protected readonly boxChars = signal<string[]>([]);
  protected readonly internalDisabled = signal(false);
  protected readonly internalFocused = signal(false);
  protected readonly touched = signal(false);
  protected readonly dirty = signal(false);
  protected readonly focusedIndex = signal(-1);
  protected readonly _describedByIds = signal<string[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  protected readonly elementId = computed(() => {
    return resolveElementId(this.elementRef, 'solaris-otp-input');
  });

  protected readonly effectiveDensity = computed<SolarisOtpInputDensity>(() => {
    return this.density() ?? this.themeService.density;
  });

  protected readonly isEffectivelyDisabled = computed(() => {
    return this.disabledInput() || this.internalDisabled();
  });

  protected readonly isEffectivelyReadonly = computed(() => {
    return this.readonlyInput();
  });

  protected readonly inputmode = computed(() => {
    return this.charType() === 'numeric' ? 'numeric' : 'text';
  });

  protected readonly boxes = computed(() => {
    const masked = this.masked();
    return this.boxChars().map((char) => (masked && char ? MASK_CHAR : char));
  });

  protected readonly valueString = computed(() => {
    return this.boxChars().join('');
  });

  protected readonly groupAriaLabel = computed(() => {
    const key = this.labelKey();
    if (key) {
      return this.translateService.translate(key) || this.label() || '';
    }
    return this.label() ?? '';
  });

  protected readonly ariaDescribedBy = computed(() => {
    const ids = this._describedByIds();
    return ids.length > 0 ? ids.join(' ') : null;
  });

  protected readonly computedError = computed(() => {
    const manualError = this.error() || this.translateKey(this.errorKey());
    if (manualError) return manualError;

    const isTouchedOrDirty = this.touched() || this.dirty();
    if (!isTouchedOrDirty || this.internalFocused()) return '';

    const value = this.valueString();
    if (!value) {
      if (this.requiredInput()) {
        return this.buildError(
          this.requiredError(),
          this.requiredErrorKey(),
          'solaris.otp-input.required',
          'Code is required.',
        );
      }
      return '';
    }

    if (value.length < this.minLength()) {
      return this.buildError(
        this.invalidError(),
        this.invalidErrorKey(),
        'solaris.otp-input.invalid',
        'Enter a valid code.',
      );
    }

    return '';
  });

  protected readonly isFieldInvalid = computed(() => {
    const manual = this.manualInvalid();
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
    this.boxChars.set(this.emptyChars());
    effect(() => {
      const length = this.maxLength();
      const current = this.boxChars();
      if (current.length !== length) {
        const resized = Array.from(
          { length },
          (_, index) => current[index] ?? '',
        );
        this.boxChars.set(resized);
      }
    });
    effect(() => {
      const value = this.value();
      if (value !== this.lastAppliedValue) {
        this.lastAppliedValue = value;
        this.boxChars.set(this.distributeValue(value));
      }
    });
  }

  private lastAppliedValue = '';

  get id(): string {
    return this.elementId();
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
    const index = this.boxChars().findIndex((char) => !char);
    this.focusBox(index >= 0 ? index : 0);
  }

  ngAfterViewInit(): void {
    if (this.autoFocus()) {
      this.focusBox(0);
    }
  }

  writeValue(value: string | null | undefined): void {
    this.boxChars.set(this.distributeValue(value));
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

  protected onBoxInput(event: Event, index: number): void {
    const target = event.target as HTMLInputElement;
    const raw = target.value;

    if (!this.dirty()) {
      this.dirty.set(true);
    }

    const filtered = this.filterChars(raw);
    const chars = this.currentChars();
    let cursor = index;
    for (const char of filtered) {
      if (cursor >= this.maxLength()) break;
      chars[cursor] = char;
      cursor++;
    }

    this.commitValue(chars);
    target.value = chars[index] ?? '';

    const next = cursor < this.maxLength() ? cursor : this.maxLength() - 1;
    this.focusBox(next);
  }

  protected onBoxKeydown(event: KeyboardEvent, index: number): void {
    switch (event.key) {
      case 'Backspace':
        event.preventDefault();
        this.handleBackspace(index);
        break;
      case 'Delete':
        event.preventDefault();
        this.handleDelete(index);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.focusBox(index - 1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.focusBox(index + 1);
        break;
      case 'Home':
        event.preventDefault();
        this.focusBox(0);
        break;
      case 'End':
        event.preventDefault();
        this.focusBox(this.maxLength() - 1);
        break;
      case 'Enter':
        event.preventDefault();
        break;
    }
  }

  protected onBoxPaste(event: ClipboardEvent, index: number): void {
    event.preventDefault();
    const text = event.clipboardData?.getData('text') ?? '';
    if (!text) return;

    const filtered = this.filterChars(text);
    const chars = this.currentChars();
    let cursor = index;
    for (const char of filtered) {
      if (cursor >= this.maxLength()) break;
      chars[cursor] = char;
      cursor++;
    }

    this.commitValue(chars);
    this.focusBox(cursor < this.maxLength() ? cursor : this.maxLength() - 1);
  }

  protected onBoxFocus(index: number): void {
    this.internalFocused.set(true);
    this.focusedIndex.set(index);
  }

  protected onBoxBlur(): void {
    this.internalFocused.set(false);
    this.focusedIndex.set(-1);
    this.markAsTouched();
  }

  protected boxAriaLabel(index: number): string {
    return this.translateWithDefault(
      'solaris.otp-input.box',
      `Digit ${index + 1} of ${this.maxLength()}`,
      { current: index + 1, total: this.maxLength() },
    );
  }

  protected showSeparatorAfter(index: number): boolean {
    const every = this.separatorEvery();
    return (
      every > 0 && (index + 1) % every === 0 && index < this.maxLength() - 1
    );
  }

  private currentChars(): string[] {
    return [...this.boxChars()];
  }

  private commitValue(chars: string[]): void {
    this.boxChars.set([...chars]);
    const newValue = chars.join('');
    this.onChange(newValue);
    this.valueChange.emit(newValue);
    if (newValue.length === this.maxLength()) {
      this.completed.emit();
    }
  }

  private handleBackspace(index: number): void {
    const chars = this.currentChars();
    if (chars[index]) {
      chars[index] = '';
      this.commitValue(chars);
    } else if (index > 0) {
      chars[index - 1] = '';
      this.commitValue(chars);
      this.focusBox(index - 1);
    }
  }

  private handleDelete(index: number): void {
    const chars = this.currentChars();
    if (chars[index]) {
      chars[index] = '';
      this.commitValue(chars);
    }
  }

  private filterChars(value: string): string {
    if (this.charType() === 'numeric') {
      return value.replace(/\D+/g, '');
    }
    return value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  }

  private emptyChars(): string[] {
    return Array.from({ length: this.maxLength() }, () => '');
  }

  private distributeValue(value: string | null | undefined): string[] {
    const chars = this.emptyChars();
    const source = String(value ?? '');
    for (let i = 0; i < source.length && i < this.maxLength(); i++) {
      chars[i] = source[i];
    }
    return chars;
  }

  private focusBox(index: number): void {
    if (index < 0 || index >= this.maxLength()) {
      return;
    }
    const ref = this.boxRefs()[index];
    // SECURITY_EXCEPTION: moving focus between OTP boxes requires imperative focus; no declarative alternative exists.
    ref?.nativeElement.focus();
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
