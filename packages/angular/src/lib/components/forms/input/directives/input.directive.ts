import {
  Directive,
  input,
  computed,
  signal,
  HostListener,
  inject,
  ElementRef,
  isDevMode,
} from '@angular/core';
import { NgControl } from '@angular/forms';

import { SolarisFormControl } from '../../form-field/model/form-control.contract';
import { SOLARIS_FORM_FIELD } from '../../form-field/model/form-field.token';
import { resolveElementId } from '../../../../core';
import { SolarisThemeService } from '../../../../services/theme';

import type {
  SolarisInputAppearance,
  SolarisInputSize,
  SolarisInputDensity,
  SolarisInputRadius,
} from '../model/input.types';

import { SUPPORTED_TYPES, UNSUPPORTED_TYPES } from '../model/input.defaults';

@Directive({
  selector: '[solaris-input]',
  standalone: true,
  providers: [
    { provide: SolarisFormControl, useExisting: SolarisInputDirective },
  ],
  host: {
    '[id]': 'elementId()',
    '[attr.data-size]': 'effectiveSize()',
    '[attr.data-radius]': 'radius()',
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.aria-describedby]': 'ariaDescribedBy()',
    '[attr.data-focused]': '_focused() ? "" : null',
    '[attr.data-full-width]': 'fullWidth() ? "" : null',
    '[attr.data-invalid]': 'isEffectivelyInvalid() ? "" : null',
    '[attr.aria-invalid]': 'isEffectivelyInvalid() ? "true" : null',
  },
})
export class SolarisInputDirective extends SolarisFormControl {
  readonly appearance = input<SolarisInputAppearance>('outline');
  readonly radius = input<SolarisInputRadius>('sm');
  readonly size = input<SolarisInputSize>();
  readonly density = input<SolarisInputDensity>();

  readonly manualInvalid = input<boolean | undefined>(undefined, {
    alias: 'invalid',
  });
  readonly fullWidth = input<boolean>(true);

  private readonly elementRef =
    inject<ElementRef<HTMLInputElement>>(ElementRef);
  // SECURITY_EXCEPTION: reading host properties (disabled, readOnly, required, tagName) requires the native element; same pattern as Angular CDK form controls. Read-only.
  private readonly inputElement = this.elementRef.nativeElement;
  protected readonly ngControl = inject(NgControl, {
    optional: true,
    self: true,
  });

  protected readonly _focused = signal(false);
  private readonly _describedByIds = signal<string[]>([]);

  protected readonly elementId = computed(() => {
    return resolveElementId(this.elementRef, 'solaris-input');
  });

  protected readonly themeService = inject(SolarisThemeService);
  protected readonly formField = inject(SOLARIS_FORM_FIELD, {
    optional: true,
  });

  protected readonly effectiveSize = computed<SolarisInputSize>(() => {
    return this.size() ?? this.formField?.size() ?? 'md';
  });

  protected readonly effectiveDensity = computed<SolarisInputDensity>(() => {
    return (
      this.density() ??
      this.formField?.effectiveDensity() ??
      this.themeService.density
    );
  });

  protected readonly isEffectivelyInvalid = computed(() => {
    const manual = this.manualInvalid();
    if (manual !== undefined) {
      return manual;
    }
    if (this.ngControl?.control) {
      const control = this.ngControl.control;
      return (
        control.invalid &&
        (control.touched || control.dirty) &&
        !this._focused()
      );
    }
    return false;
  });

  protected readonly ariaDescribedBy = computed(() => {
    const ids = this._describedByIds();
    return ids.length > 0 ? ids.join(' ') : null;
  });

  get id(): string {
    return this.elementId();
  }

  get focused(): boolean {
    return this._focused();
  }

  get disabled(): boolean {
    return this.inputElement.disabled;
  }

  get readonly(): boolean {
    return this.inputElement.readOnly;
  }

  get invalid(): boolean {
    return this.isEffectivelyInvalid();
  }

  get required(): boolean {
    return this.inputElement.required;
  }

  get describedByIds(): string[] {
    return this._describedByIds();
  }

  setDescribedByIds(ids: string[]): void {
    this._describedByIds.set([...ids]);
  }

  focus(): void {
    this.inputElement.focus();
  }

  @HostListener('focus')
  protected onFocus(): void {
    this._focused.set(true);
  }

  @HostListener('blur')
  protected onBlur(): void {
    this._focused.set(false);
  }

  constructor() {
    super();
    this.validateHost();
    this.validateType();
  }

  private validateHost(): void {
    if (this.inputElement.tagName !== 'INPUT') {
      if (isDevMode()) {
        console.warn(
          `[SolarisInput] The [solaris-input] directive is intended for use on <input> elements only. ` +
            `Applying it to <${this.inputElement.tagName.toLowerCase()}> is unsupported ` +
            `and may cause unexpected behavior.`,
        );
      }
    }
  }

  private validateType(): void {
    const type = (
      this.inputElement.getAttribute('type') || 'text'
    ).toLowerCase();
    if (UNSUPPORTED_TYPES.has(type)) {
      if (isDevMode()) {
        console.warn(
          `[SolarisInput] The type "${type}" is not supported for [solaris-input]. ` +
            `Supported types are: ${Array.from(SUPPORTED_TYPES).join(', ')}. ` +
            `The directive will not apply input styling.`,
        );
      }
    }
  }
}
