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
  forwardRef,
  NgZone,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormControlDirective, FormControlName, NgModel } from '@angular/forms';

import { SolarisFormPrefixDirective } from '../directives/form-prefix.directive';
import { SolarisFormSuffixDirective } from '../directives/form-suffix.directive';
import { SolarisFormSuffixActionDirective } from '../directives/form-suffix-action.directive';
import { SolarisFormLabelActionDirective } from '../directives/form-label-action.directive';
import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisThemeService } from '../../../../services/theme';
import { SolarisFormControl } from '../model/form-control.contract';
import { SolarisFormLabelComponent } from './form-label.component';
import { SolarisFormErrorComponent } from './form-error.component';
import { SolarisFormHintComponent } from './form-hint.component';
import { SolarisIconComponent } from '../../../icon';
import { SolarisSpinnerComponent } from '../../../feedback/spinner';
import { SOLARIS_FORM_FIELD } from '../model/form-field.token';
import { nextIdFor } from '../../../../core';

import type {
  SolarisFormFieldAppearance,
  SolarisFormFieldDensity,
  SolarisFormFieldRadius,
  SolarisFormFieldSize,
  ControlResize,
} from '../model/form-field.types';
import type { SolarisIconName } from '../../../../services/icon';

@Component({
  selector: 'solaris-form-field',
  standalone: true,
  imports: [
    SolarisIconComponent,
    SolarisSpinnerComponent,
    SolarisFormPrefixDirective,
    SolarisFormSuffixDirective,
  ],
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: SOLARIS_FORM_FIELD,
      useExisting: forwardRef(() => SolarisFormFieldComponent),
    },
  ],
  host: {
    '[attr.data-radius]': 'radius()',
    '[attr.data-size]': 'size()',
    '[attr.data-bwignore]': '"true"',
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-control-type]': 'controlType()',
    '[attr.data-control-resize]': 'controlResize()',
    '[attr.data-loading]': 'loading() ? "" : null',
    '[attr.aria-busy]': 'loading() ? "true" : null',
    '[attr.data-invalid]': 'isInvalid() ? "" : null',
    '[attr.data-focused]': 'isFocused() ? "" : null',
    '[attr.data-has-prefix]': 'effectiveHasPrefix() ? "" : null',
    '[attr.data-has-suffix]': 'effectiveHasSuffix() ? "" : null',
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
      this.isEffectivelyRequired();
      this.syncControlState();
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
  readonly required = input<boolean | undefined>();
  readonly optional = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly loadingLabel = input<string>();
  readonly loadingLabelKey = input<string>();
  readonly invalid = input<boolean | undefined>();
  readonly disabled = input<boolean | undefined>();
  readonly readonly = input<boolean | undefined>();
  readonly density = input<SolarisFormFieldDensity>();
  readonly size = input<SolarisFormFieldSize>('md');
  readonly radius = input<SolarisFormFieldRadius>('sm');
  readonly appearance = input<SolarisFormFieldAppearance>('outline');
  readonly control = input<SolarisFormControl | undefined>(undefined);

  protected readonly projectedLabel = contentChild(SolarisFormLabelComponent);
  protected readonly projectedHint = contentChild(SolarisFormHintComponent);
  protected readonly projectedError = contentChild(SolarisFormErrorComponent);
  protected readonly projectedPrefix = contentChild(SolarisFormPrefixDirective);
  protected readonly projectedSuffix = contentChild(SolarisFormSuffixDirective);
  protected readonly projectedSuffixAction = contentChild(
    SolarisFormSuffixActionDirective,
  );
  protected readonly projectedLabelAction = contentChild(
    SolarisFormLabelActionDirective,
  );
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
  protected readonly autoDetectedRequired = signal(false);
  protected readonly controlResize = signal<ControlResize | null>(null);

  protected readonly maxLength = signal<number | undefined>(undefined);
  protected readonly currentLength = signal<number>(0);
  protected readonly validatorMaxLength = computed<number | undefined>(() => {
    const errors = this.effectiveNgControl()?.control?.errors as {
      maxlength?: { requiredLength?: unknown };
    } | null;
    const requiredLength = errors?.maxlength?.requiredLength;
    return typeof requiredLength === 'number' && requiredLength > 0
      ? requiredLength
      : undefined;
  });
  protected readonly effectiveMaxLength = computed(() => {
    return this.maxLength() ?? this.validatorMaxLength();
  });
  protected readonly showCharacterCounter = computed(() => {
    const max = this.effectiveMaxLength();
    return max !== undefined && max > 0;
  });
  protected readonly characterCounterText = computed(() => {
    const max = this.effectiveMaxLength();
    if (max === undefined || max <= 0) return '';
    const current = this.currentLength();
    return `${current}/${max}`;
  });
  protected readonly characterCounterSeverity = computed<
    'normal' | 'warning' | 'danger'
  >(() => {
    const max = this.effectiveMaxLength();
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
  protected readonly hasProjectedLabelAction = computed(
    () => !!this.projectedLabelAction(),
  );
  readonly hasPrefixInput = input<boolean | undefined>(undefined, {
    alias: 'hasPrefix',
  });
  readonly hasSuffixInput = input<boolean | undefined>(undefined, {
    alias: 'hasSuffix',
  });

  readonly prefix = input<SolarisIconName>();
  readonly suffix = input<SolarisIconName>();

  protected readonly effectiveHasPrefix = computed(() => {
    return (
      !!this.prefix() || !!this.projectedPrefix() || !!this.hasPrefixInput()
    );
  });
  protected readonly effectiveHasSuffix = computed(() => {
    return (
      !this.loading() &&
      (!!this.suffix() ||
        !!this.projectedSuffix() ||
        !!this.projectedSuffixAction() ||
        !!this.hasSuffixInput())
    );
  });
  protected readonly hasSuffixAction = computed(
    () => !this.loading() && !!this.projectedSuffixAction(),
  );
  protected readonly suffixVariant = computed(() => {
    return this.hasSuffixAction() ? 'action' : null;
  });
  protected readonly loadingSpinnerSize = computed(() => {
    return this.size() === 'lg' ? 'md' : 'sm';
  });

  protected readonly controlType = computed<
    'input' | 'textarea' | 'select' | 'other'
  >(() => {
    return this.isTextareaControl() ? 'textarea' : 'other';
  });

  protected readonly themeService = inject(SolarisThemeService);

  protected readonly effectiveDensity = computed<SolarisFormFieldDensity>(
    () => {
      return this.density() ?? this.themeService.density;
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

  protected readonly isEffectivelyRequired = computed(() => {
    const manual = this.required();
    if (manual !== undefined) {
      return manual;
    }
    const explicitControl = this.control();
    if (explicitControl) {
      return explicitControl.required;
    }
    const projectedControl = this.formControl();
    if (projectedControl) {
      return projectedControl.required;
    }
    return this.autoDetectedRequired();
  });

  protected readonly showRequiredMarker = computed(() => {
    return this.isEffectivelyRequired() && !this.optional();
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
    this.detectControl();
    this.connectControl();
    this.syncDescribedBy();
    this.syncControlState();
    this.warnNoControl();
    this.warnMultipleControls();
  }

  private syncControlState(): void {
    if (!this.controlElement) {
      return;
    }
    if (this.control()) {
      return;
    }
    const input = this.controlElement as HTMLInputElement;
    const shouldDisable = this.isEffectivelyDisabled();
    const shouldReadonly = this.isEffectivelyReadonly();
    const shouldRequire = this.isEffectivelyRequired();
    if (input.disabled !== shouldDisable) {
      input.disabled = shouldDisable;
    }
    if (input.readOnly !== shouldReadonly) {
      input.readOnly = shouldReadonly;
    }
    if (input.required !== shouldRequire) {
      input.required = shouldRequire;
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
    // SECURITY_EXCEPTION: locating the projected trigger element requires a host DOM query; contentChild cannot match arbitrary native controls. Read-only, no mutation.
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
    // SECURITY_EXCEPTION: detecting projected native controls (input/select/textarea with or without directives) requires a host DOM query. Read-only querySelectorAll, no mutation.
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
    this.autoDetectedRequired.set((first as HTMLInputElement).required);
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
    const resize =
      first.getAttribute('data-resize') ?? first.getAttribute('resize');

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
    // SECURITY_EXCEPTION: counting projected controls for the dev-only multiple-control warning requires a host DOM query. Read-only, no mutation.
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
