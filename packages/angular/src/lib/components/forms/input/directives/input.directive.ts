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

import type {
  SolarisInputAppearance,
  SolarisInputSize,
  SolarisInputDensity,
  SolarisInputRadius,
} from '../model/input.types';

import { SUPPORTED_TYPES, UNSUPPORTED_TYPES } from '../model/input.defaults';

let nextId = 0;

function generateId(): string {
  return `solaris-input-${++nextId}`;
}

@Directive({
  selector: '[solaris-input]',
  standalone: true,
  providers: [
    { provide: SolarisFormControl, useExisting: SolarisInputDirective },
  ],
  host: {
    '[id]': 'elementId()',
    '[attr.data-size]': 'size()',
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
  readonly radius = input<SolarisInputRadius>('md');
  readonly size = input<SolarisInputSize>('md');
  readonly density = input<SolarisInputDensity>();

  readonly manualInvalid = input<boolean | undefined>(undefined, {
    alias: 'invalid',
  });
  readonly fullWidth = input<boolean>(true);

  // SECURITY_EXCEPTION: ElementRef.nativeElement is the standard Angular directive API to read host element properties and attributes. Same approach used by Angular CDK and all Solaris directives.
  private readonly elementRef =
    inject<ElementRef<HTMLInputElement>>(ElementRef);
  // SECURITY_EXCEPTION: nativeElement access required for host element property reads (tagName, disabled, readonly, required, focus, getAttribute). Same pattern used by Angular CDK form controls.
  private readonly inputElement = this.elementRef.nativeElement;
  protected readonly ngControl = inject(NgControl, {
    optional: true,
    self: true,
  });

  protected readonly _focused = signal(false);
  private readonly _describedByIds = signal<string[]>([]);

  // SECURITY_EXCEPTION: nativeElement.getAttribute('id') is the standard DOM API to check existing ID before generating one. Same approach used by Angular CDK form controls.
  protected readonly elementId = computed(() => {
    const existingId = this.inputElement.getAttribute('id');
    return existingId ?? generateId();
  });

  protected readonly effectiveDensity = computed<SolarisInputDensity>(() => {
    return this.density() ?? 'comfortable';
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

  // SECURITY_EXCEPTION: nativeElement.disabled is the standard DOM property to read input disabled state. Same approach used by Angular Forms.
  get disabled(): boolean {
    return this.inputElement.disabled;
  }

  // SECURITY_EXCEPTION: nativeElement.readOnly is the standard DOM property to read input readonly state.
  get readonly(): boolean {
    return this.inputElement.readOnly;
  }

  get invalid(): boolean {
    return this.isEffectivelyInvalid();
  }

  // SECURITY_EXCEPTION: nativeElement.required is the standard DOM property to read input required state.
  get required(): boolean {
    return this.inputElement.required;
  }

  get describedByIds(): string[] {
    return this._describedByIds();
  }

  setDescribedByIds(ids: string[]): void {
    this._describedByIds.set([...ids]);
  }

  // SECURITY_EXCEPTION: nativeElement.focus() is the standard DOM API to programmatically focus an input. No alternative exists.
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
    // SECURITY_EXCEPTION: nativeElement.tagName is the standard Angular API to validate directive host element. Same pattern used by SolarisButtonDirective.
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
    // SECURITY_EXCEPTION: nativeElement.getAttribute is the standard DOM API to read HTML attributes. Same pattern used by SolarisButtonDirective.
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
