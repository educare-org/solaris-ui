// SECURITY_EXCEPTION_FILE: Setting disabled/readonly on native control is standard DOM API.
// SECURITY_EXCEPTION_FILE: Required for FormField to propagate disabled/readonly state to projected control.
// SECURITY_EXCEPTION_FILE: Setting disabled/readonly on native control is required for FormField propagation.
// SECURITY_EXCEPTION_FILE: nativeElement.querySelector required to find trigger element. Standard DOM API used after Angular CDK pattern.
// SECURITY_EXCEPTION_FILE: nativeElement access required to detect projected form controls.
// SECURITY_EXCEPTION_FILE: Angular CDK and Material use the same approach.
// SECURITY_EXCEPTION_FILE: Read-only querySelectorAll, no DOM mutation.
// SECURITY_EXCEPTION_FILE: nativeElement.tagName is the standard DOM API to check element type.
// SECURITY_EXCEPTION_FILE: getAttribute is the standard DOM API to read HTML attributes.
// SECURITY_EXCEPTION_FILE: reading value.length from native input/textarea is required for character counter.
// SECURITY_EXCEPTION_FILE: reading value.length from native input/textarea is standard DOM API for character counter.
// SECURITY_EXCEPTION_FILE: nativeElement access required to count projected controls.
// SECURITY_EXCEPTION_FILE: Same justification as detectControl: read-only query, no DOM mutation.
import {
  Component,
  input,
  computed,
  signal,
  effect,
  contentChild,
  AfterContentInit,
  OnDestroy,
  ElementRef,
  inject,
  NgZone,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormControlDirective, FormControlName, NgModel } from '@angular/forms';

import { SolarisFormPrefixDirective } from '../directives/form-prefix.directive';
import { SolarisFormSuffixDirective } from '../directives/form-suffix.directive';
import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisFormControl } from '../model/form-control.contract';
import { SolarisFormLabelComponent } from './form-label.component';
import { SolarisFormErrorComponent } from './form-error.component';
import { SolarisFormHintComponent } from './form-hint.component';
import { nextIdFor } from '../../../../core';

import type {
  SolarisFormFieldAppearance,
  SolarisFormFieldSize,
  SolarisFormFieldDensity,
  SolarisFormFieldRadius,
  ControlResize,
} from '../model/form-field.types';

@Component({
  selector: 'solaris-form-field',
  standalone: true,
  imports: [],
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-radius]': 'radius()',
    '[attr.data-bwignore]': '"true"',
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-control-type]': 'controlType()',
    '[attr.data-control-resize]': 'controlResize()',
    '[attr.data-invalid]': 'isInvalid() ? "" : null',
    '[attr.data-focused]': 'isFocused() ? "" : null',
    '[attr.data-has-prefix]': 'hasPrefix() ? "" : null',
    '[attr.data-has-suffix]': 'hasSuffix() ? "" : null',
    '[attr.data-disabled]': 'isEffectivelyDisabled() ? "" : null',
    '[attr.data-readonly]': 'isEffectivelyReadonly() ? "" : null',
  },
})
export class SolarisFormFieldComponent implements AfterContentInit, OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly translateService = inject(SolarisTranslateService);
  private readonly ngZone = inject(NgZone);

  constructor() {
    effect(() => {
      this.isEffectivelyDisabled();
      this.isEffectivelyReadonly();
      this.syncControlDisabledReadonly();
    });
  }

  readonly hintKey = input<string>();
  readonly labelKey = input<string>();
  readonly hint = input<string>('');
  readonly errorKey = input<string>();
  readonly label = input<string>('');
  readonly error = input<string>('');
  readonly optionalLabel = input<string>();
  readonly requiredLabel = input<string>();
  readonly optionalLabelKey = input<string>();
  readonly requiredLabelKey = input<string>();
  readonly required = input<boolean>(false);
  readonly optional = input<boolean>(false);
  readonly invalid = input<boolean | undefined>();
  readonly disabled = input<boolean | undefined>();
  readonly readonly = input<boolean | undefined>();
  readonly density = input<SolarisFormFieldDensity>();
  readonly size = input<SolarisFormFieldSize>('md');
  readonly radius = input<SolarisFormFieldRadius>('md');
  readonly appearance = input<SolarisFormFieldAppearance>('outline');
  readonly control = input<SolarisFormControl | undefined>(undefined);

  protected readonly projectedLabel = contentChild(SolarisFormLabelComponent);
  protected readonly projectedHint = contentChild(SolarisFormHintComponent);
  protected readonly projectedError = contentChild(SolarisFormErrorComponent);
  protected readonly prefix = contentChild(SolarisFormPrefixDirective);
  protected readonly suffix = contentChild(SolarisFormSuffixDirective);
  protected readonly formControl = contentChild(SolarisFormControl);
  protected readonly formControlDirective = contentChild(FormControlDirective);
  protected readonly formControlName = contentChild(FormControlName);
  protected readonly ngModelDir = contentChild(NgModel);

  protected readonly fieldId = nextIdFor('solaris-form-field');
  protected readonly hintId = `solaris-form-field-hint-${this.fieldId}`;
  protected readonly errorId = `solaris-form-field-error-${this.fieldId}`;
  protected readonly labelId = `solaris-form-field-label-${this.fieldId}`;

  protected readonly isFocused = signal(false);
  protected readonly isTextareaControl = signal(false);
  protected readonly autoDetectedDisabled = signal(false);
  protected readonly autoDetectedReadonly = signal(false);
  protected readonly controlResize = signal<ControlResize | null>(null);

  protected readonly maxLength = signal<number | undefined>(undefined);
  protected readonly currentLength = signal<number>(0);
  protected readonly showCharacterCounter = computed(() => {
    const max = this.maxLength();
    return max !== undefined && max > 0;
  });
  protected readonly characterCounterText = computed(() => {
    const max = this.maxLength();
    if (max === undefined || max <= 0) return '';
    const current = this.currentLength();
    return `${current}/${max}`;
  });
  protected readonly characterCounterSeverity = computed<
    'normal' | 'warning' | 'danger'
  >(() => {
    const max = this.maxLength();
    const current = this.currentLength();
    if (max === undefined || max <= 0) return 'normal';
    const ratio = current / max;
    if (ratio >= 1) return 'danger';
    if (ratio >= 0.9) return 'warning';
    return 'normal';
  });

  protected controlId: string | null = null;
  private controlElement: HTMLElement | null = null;
  private focusListener: (() => void) | null = null;
  private blurListener: (() => void) | null = null;
  private inputListener: (() => void) | null = null;

  protected readonly hasProjectedLabel = computed(
    () => !!this.projectedLabel(),
  );
  protected readonly hasProjectedHint = computed(() => !!this.projectedHint());
  protected readonly hasProjectedError = computed(
    () => !!this.projectedError(),
  );
  protected readonly hasPrefix = signal(false);
  protected readonly hasSuffix = signal(false);

  protected readonly controlType = computed<
    'input' | 'textarea' | 'select' | 'other'
  >(() => {
    return this.isTextareaControl() ? 'textarea' : 'other';
  });

  protected readonly effectiveDensity = computed<SolarisFormFieldDensity>(
    () => {
      return this.density() ?? 'comfortable';
    },
  );

  protected readonly labelText = computed(() => {
    const key = this.labelKey();
    if (key) {
      return this.translateService.translate(key);
    }
    return this.label();
  });

  protected readonly hintText = computed(() => {
    const key = this.hintKey();
    if (key) {
      return this.translateService.translate(key);
    }
    return this.hint();
  });

  protected readonly errorText = computed(() => {
    const key = this.errorKey();
    if (key) {
      return this.translateService.translate(key);
    }
    return this.error();
  });

  protected readonly optionalLabelText = computed(() => {
    const key = this.optionalLabelKey();
    if (key) {
      return this.translateService.translate(key);
    }
    const explicit = this.optionalLabel();
    if (explicit) {
      return explicit;
    }
    return this.translateService.translate('solaris.form-field.optional');
  });

  protected readonly isEffectivelyDisabled = computed(() => {
    const manual = this.disabled();
    if (manual !== undefined) {
      return manual;
    }
    const explicitControl = this.control();
    if (explicitControl) {
      return explicitControl.disabled;
    }
    const projectedControl = this.formControl();
    if (projectedControl) {
      return projectedControl.disabled;
    }
    return this.autoDetectedDisabled();
  });

  protected readonly isEffectivelyReadonly = computed(() => {
    const manual = this.readonly();
    if (manual !== undefined) {
      return manual;
    }
    const explicitControl = this.control();
    if (explicitControl) {
      return explicitControl.readonly;
    }
    const projectedControl = this.formControl();
    if (projectedControl) {
      return projectedControl.readonly;
    }
    return this.autoDetectedReadonly();
  });

  protected readonly effectiveNgControl = computed(() => {
    return (
      this.formControlDirective() ??
      this.formControlName() ??
      this.ngModelDir() ??
      null
    );
  });

  protected readonly isAutoInvalid = computed(() => {
    const control = this.effectiveNgControl();
    if (!control?.control) {
      return false;
    }
    const ctrl = control.control;
    const invalid = ctrl.invalid;
    const touched = ctrl.touched;
    const dirty = ctrl.dirty;
    const focused = this.isFocused();
    if (!invalid) {
      return false;
    }
    if (focused) {
      return false;
    }
    return touched || dirty;
  });

  protected readonly isInvalid = computed(() => {
    const manual = this.invalid();
    if (manual !== undefined) {
      return manual;
    }
    const explicitControl = this.control();
    if (explicitControl) {
      return explicitControl.invalid;
    }
    const projectedControl = this.formControl();
    if (projectedControl) {
      return projectedControl.invalid && !this.isFocused();
    }
    return this.isAutoInvalid();
  });

  protected readonly showError = computed(() => {
    return this.isInvalid() && (!!this.errorText() || this.hasProjectedError());
  });

  protected readonly showHint = computed(() => {
    if (this.showError()) {
      return false;
    }
    return !!this.hintText() || this.hasProjectedHint();
  });

  protected readonly describedBy = computed(() => {
    const ids: string[] = [];
    if (this.showHint()) {
      ids.push(this.hintId);
    }
    if (this.showError()) {
      ids.push(this.errorId);
    }
    return ids.length > 0 ? ids.join(' ') : null;
  });

  ngAfterContentInit(): void {
    this.hasPrefix.set(!!this.prefix());
    this.hasSuffix.set(!!this.suffix());
    this.detectControl();
    this.connectControl();
    this.syncDescribedBy();
    this.syncControlDisabledReadonly();
    this.warnNoControl();
    this.warnMultipleControls();
  }

  private syncControlDisabledReadonly(): void {
    if (!this.controlElement) {
      return;
    }
    if (this.control()) {
      return;
    }
    const input = this.controlElement as HTMLInputElement;
    const shouldDisable = this.isEffectivelyDisabled();
    const shouldReadonly = this.isEffectivelyReadonly();
    if (input.disabled !== shouldDisable) {
      input.disabled = shouldDisable;
    }
    if (input.readOnly !== shouldReadonly) {
      input.readOnly = shouldReadonly;
    }
  }

  private syncDescribedBy(): void {
    const describedBy = this.describedBy();
    const targetControl = this.control() ?? this.formControl();
    if (targetControl) {
      if (describedBy) {
        targetControl.setDescribedByIds(describedBy.split(' '));
      } else {
        targetControl.setDescribedByIds([]);
      }
    }
  }

  protected readonly describedByEffect = effect(() => {
    this.describedBy();
    this.syncDescribedBy();
  });

  ngOnDestroy(): void {
    this.removeListeners();
  }

  private detectControl(): void {
    const explicitControl = this.control();
    if (explicitControl) {
      this.detectExplicitControl(explicitControl);
    } else {
      this.detectNativeControl();
    }
    this.assignControlId();
  }

  private detectExplicitControl(explicitControl: SolarisFormControl): void {
    this.controlId = explicitControl.id;
    const triggerEl = this.elementRef.nativeElement.querySelector(
      '[solaris-form-field-trigger]',
    );
    if (triggerEl) {
      this.controlElement = triggerEl as HTMLElement;
      if (triggerEl.id) {
        this.controlId = triggerEl.id;
      }
      this.connectControl();
    }
  }

  private detectNativeControl(): void {
    const nativeElement = this.elementRef.nativeElement;
    const children = nativeElement.querySelectorAll(
      'input, select, textarea, [solaris-input], [solaris-select], [solaris-textarea]',
    );

    if (children.length === 0) {
      return;
    }

    const first = children[0] as HTMLElement;
    this.controlElement = first;
    const isTextarea = first.tagName === 'TEXTAREA';
    this.isTextareaControl.set(isTextarea);
    this.detectCharacterCounter(first);
    this.detectControlResize(first, isTextarea);
  }

  private detectCharacterCounter(first: HTMLElement): void {
    const maxlengthAttr = first.getAttribute('maxlength');
    if (maxlengthAttr !== null) {
      const parsed = Number.parseInt(maxlengthAttr, 10);
      this.maxLength.set(!Number.isNaN(parsed) ? parsed : undefined);
    } else {
      this.maxLength.set(undefined);
    }
    this.currentLength.set(
      (first as HTMLInputElement | HTMLTextAreaElement).value?.length ?? 0,
    );
  }

  private detectControlResize(first: HTMLElement, isTextarea: boolean): void {
    if (!isTextarea) {
      this.controlResize.set(null);
      return;
    }
    const resize = first.dataset['resize'] ?? first.getAttribute('resize');

    const validResize: ControlResize =
      resize === 'none' ||
      resize === 'vertical' ||
      resize === 'horizontal' ||
      resize === 'both'
        ? resize
        : 'vertical';

    this.controlResize.set(validResize);
  }

  private assignControlId(): void {
    const projectedControl = this.formControl();
    if (projectedControl) {
      this.controlId = projectedControl.id;
      return;
    }
    if (!this.controlElement) {
      return;
    }
    if (!this.controlElement.id) {
      const generatedId = `solaris-control-${this.fieldId}`;
      this.controlElement.id = generatedId;
      this.controlId = generatedId;
    } else {
      this.controlId = this.controlElement.id;
    }
  }

  private connectControl(): void {
    if (this.controlElement) {
      this.addListeners(this.controlElement);
    }
  }

  private addListeners(element: HTMLElement): void {
    this.removeListeners();
    this.ngZone.runOutsideAngular(() => {
      const onFocus = (): void => {
        this.ngZone.run(() => this.isFocused.set(true));
      };
      const onBlur = (): void => {
        this.ngZone.run(() => this.isFocused.set(false));
      };
      const onInput = (): void => {
        this.ngZone.run(() => {
          this.currentLength.set(
            (element as HTMLInputElement | HTMLTextAreaElement).value?.length ??
              0,
          );
        });
      };
      element.addEventListener('focusin', onFocus);
      element.addEventListener('focusout', onBlur);
      element.addEventListener('input', onInput);
      this.focusListener = () =>
        element.removeEventListener('focusin', onFocus);
      this.blurListener = () => element.removeEventListener('focusout', onBlur);
      this.inputListener = () => element.removeEventListener('input', onInput);
    });
  }

  private removeListeners(): void {
    this.focusListener?.();
    this.blurListener?.();
    this.inputListener?.();
    this.focusListener = null;
    this.blurListener = null;
    this.inputListener = null;
  }

  private warnNoControl(): void {
    const hasAnyControl =
      !!this.control() ||
      !!this.formControl() ||
      !!this.controlElement ||
      !!this.effectiveNgControl();
    if (!hasAnyControl) {
      console.warn(
        `[SolarisFormField] No form control found inside <solaris-form-field id="${this.fieldId}">. ` +
          'Form Field requires a control (input, select, textarea, or a Solaris form control directive). ' +
          'This warning is shown in development only. The component will render safely without the control.',
      );
    }
  }

  private warnMultipleControls(): void {
    const nativeElement = this.elementRef.nativeElement;
    const children = nativeElement.querySelectorAll(
      'input, select, textarea, [solaris-input], [solaris-select], [solaris-textarea]',
    );
    if (children.length > 1) {
      console.warn(
        `[SolarisFormField] Multiple form controls detected inside <solaris-form-field id="${this.fieldId}">. ` +
          'Form Field v1 supports one main control. Multiple controls may cause unexpected behavior.',
      );
    }
  }
}
