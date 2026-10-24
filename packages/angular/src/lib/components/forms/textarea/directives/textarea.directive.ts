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
  SolarisTextareaAppearance,
  SolarisTextareaSize,
  SolarisTextareaDensity,
  SolarisTextareaRadius,
  SolarisTextareaResize,
} from '../model/textarea.types';

@Directive({
  selector: '[solaris-textarea]',
  standalone: true,
  providers: [
    { provide: SolarisFormControl, useExisting: SolarisTextareaDirective },
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
    '[attr.data-resize]': 'resize()',
  },
})
export class SolarisTextareaDirective extends SolarisFormControl {
  readonly appearance = input<SolarisTextareaAppearance>('outline');
  readonly radius = input<SolarisTextareaRadius>('md');
  readonly size = input<SolarisTextareaSize>();
  readonly density = input<SolarisTextareaDensity>();

  readonly manualInvalid = input<boolean | undefined>(undefined, {
    alias: 'invalid',
  });
  readonly fullWidth = input<boolean>(true);
  readonly resize = input<SolarisTextareaResize>('vertical');

  private readonly elementRef =
    inject<ElementRef<HTMLTextAreaElement>>(ElementRef);
  // SECURITY_EXCEPTION: reading host properties (disabled, readOnly, required, tagName) requires the native element; same pattern as Angular CDK form controls. Read-only.
  private readonly textareaElement = this.elementRef.nativeElement;
  protected readonly ngControl = inject(NgControl, {
    optional: true,
    self: true,
  });

  protected readonly _focused = signal(false);
  private readonly _describedByIds = signal<string[]>([]);

  protected readonly elementId = computed(() => {
    return resolveElementId(this.elementRef, 'solaris-textarea');
  });

  protected readonly themeService = inject(SolarisThemeService);
  protected readonly formField = inject(SOLARIS_FORM_FIELD, {
    optional: true,
  });

  protected readonly effectiveSize = computed<SolarisTextareaSize>(() => {
    return this.size() ?? this.formField?.size() ?? 'md';
  });

  protected readonly effectiveDensity = computed<SolarisTextareaDensity>(() => {
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
    return this.textareaElement.disabled;
  }

  get readonly(): boolean {
    return this.textareaElement.readOnly;
  }

  get invalid(): boolean {
    return this.isEffectivelyInvalid();
  }

  get required(): boolean {
    return this.textareaElement.required;
  }

  get describedByIds(): string[] {
    return this._describedByIds();
  }

  setDescribedByIds(ids: string[]): void {
    this._describedByIds.set([...ids]);
  }

  focus(): void {
    this.textareaElement.focus();
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
  }

  private validateHost(): void {
    if (this.textareaElement.tagName !== 'TEXTAREA') {
      if (isDevMode()) {
        console.warn(
          `[SolarisTextarea] The [solaris-textarea] directive is intended for use on <textarea> elements only. ` +
            `Applying it to <${this.textareaElement.tagName.toLowerCase()}> is unsupported ` +
            `and may cause unexpected behavior.`,
        );
      }
    }
  }
}
