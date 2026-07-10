import {
  Component,
  input,
  computed,
  signal,
  ContentChild,
  AfterContentInit,
  OnDestroy,
  ElementRef,
  inject,
  NgZone,
} from '@angular/core';
import { FormControlDirective, FormControlName, NgModel } from '@angular/forms';

import { SolarisTranslateService } from '../../../services/translation/service/solaris-translate.service';
import { SolarisFormControl } from '../model/form-control.contract';
import { SolarisFormLabelComponent } from './form-label.component';
import { SolarisFormHintComponent } from './form-hint.component';
import { SolarisFormErrorComponent } from './form-error.component';

import type {
  SolarisFormFieldAppearance,
  SolarisFormFieldSize,
  SolarisFormFieldDensity,
  SolarisFormFieldRadius,
} from '../model/form-field.types';

let nextId = 0;
function generateId(): string {
  return `solaris-form-field-${++nextId}`;
}

@Component({
  selector: 'solaris-form-field',
  standalone: true,
  imports: [],
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  host: {
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-radius]': 'radius()',
    '[attr.data-invalid]': 'showError() ? "" : null',
    '[attr.data-focused]': 'isFocused() ? "" : null',
    '[attr.data-disabled]': 'isEffectivelyDisabled() ? "" : null',
    '[attr.data-readonly]': 'isEffectivelyReadonly() ? "" : null',
  },
})
export class SolarisFormFieldComponent implements AfterContentInit, OnDestroy {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly ngZone = inject(NgZone);

  readonly label = input<string>('');
  readonly labelKey = input<string>();
  readonly hint = input<string>('');
  readonly hintKey = input<string>();
  readonly error = input<string>('');
  readonly errorKey = input<string>();
  readonly required = input<boolean>(false);
  readonly optional = input<boolean>(false);
  readonly optionalLabel = input<string>();
  readonly optionalLabelKey = input<string>();
  readonly requiredLabel = input<string>();
  readonly requiredLabelKey = input<string>();
  readonly invalid = input<boolean | undefined>();
  readonly disabled = input<boolean | undefined>();
  readonly readonly = input<boolean | undefined>();
  readonly appearance = input<SolarisFormFieldAppearance>('outline');
  readonly size = input<SolarisFormFieldSize>('md');
  readonly density = input<SolarisFormFieldDensity>();
  readonly radius = input<SolarisFormFieldRadius>('md');

  @ContentChild(SolarisFormLabelComponent)
  protected projectedLabel?: SolarisFormLabelComponent;
  @ContentChild(SolarisFormHintComponent)
  protected projectedHint?: SolarisFormHintComponent;
  @ContentChild(SolarisFormErrorComponent)
  protected projectedError?: SolarisFormErrorComponent;
  @ContentChild(SolarisFormControl)
  protected formControl?: SolarisFormControl;
  @ContentChild(FormControlDirective)
  protected formControlDirective?: FormControlDirective;
  @ContentChild(FormControlName)
  protected formControlName?: FormControlName;
  @ContentChild(NgModel)
  protected ngModelDir?: NgModel;

  protected readonly fieldId = generateId();
  protected readonly hintId = `solaris-form-field-hint-${this.fieldId}`;
  protected readonly errorId = `solaris-form-field-error-${this.fieldId}`;
  protected readonly labelId = `solaris-form-field-label-${this.fieldId}`;

  protected readonly isFocused = signal(false);
  protected readonly autoDetectedInvalid = signal(false);
  protected readonly autoDetectedDisabled = signal(false);
  protected readonly autoDetectedReadonly = signal(false);

  protected controlId: string | null = null;
  private controlElement: HTMLElement | null = null;
  private focusListener: (() => void) | null = null;
  private blurListener: (() => void) | null = null;

  protected readonly hasProjectedLabel = computed(() => !!this.projectedLabel);
  protected readonly hasProjectedHint = computed(() => !!this.projectedHint);
  protected readonly hasProjectedError = computed(() => !!this.projectedError);

  protected readonly effectiveDensity = computed<SolarisFormFieldDensity>(() => {
    return this.density() ?? 'comfortable';
  });

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

  protected readonly requiredLabelText = computed(() => {
    const key = this.requiredLabelKey();
    if (key) {
      return this.translateService.translate(key);
    }
    return this.requiredLabel() ?? '';
  });

  protected readonly isEffectivelyDisabled = computed(() => {
    const manual = this.disabled();
    if (manual !== undefined) {
      return manual;
    }
    if (this.formControl) {
      return this.formControl.disabled;
    }
    return this.autoDetectedDisabled();
  });

  protected readonly isEffectivelyReadonly = computed(() => {
    const manual = this.readonly();
    if (manual !== undefined) {
      return manual;
    }
    if (this.formControl) {
      return this.formControl.readonly;
    }
    return this.autoDetectedReadonly();
  });

  protected readonly effectiveNgControl = computed(() => {
    return this.formControlDirective ?? this.formControlName ?? this.ngModelDir ?? null;
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
    if (this.formControl) {
      return this.formControl.invalid && !this.isFocused();
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
    this.warnNoControl();
    this.warnMultipleControls();
  }

  ngOnDestroy(): void {
    this.removeListeners();
  }

  private detectControl(): void {
    if (this.formControl) {
      this.controlId = this.formControl.id;
      return;
    }

    // SECURITY_EXCEPTION: nativeElement access required to detect projected form controls.
    // SECURITY_EXCEPTION: Angular CDK and Material use the same approach.
    // SECURITY_EXCEPTION: Read-only querySelectorAll, no DOM mutation.
    const nativeElement = this.elementRef.nativeElement;
    const children = nativeElement.querySelectorAll(
      'input, select, textarea, [solaris-input], [solaris-select], [solaris-textarea]',
    );

    if (children.length > 0) {
      const first = children[0] as HTMLElement;
      this.controlElement = first;
      if (!first.id) {
        const generatedId = `solaris-control-${this.fieldId}`;
        first.id = generatedId;
        this.controlId = generatedId;
      } else {
        this.controlId = first.id;
      }
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
      element.addEventListener('focusin', onFocus);
      element.addEventListener('focusout', onBlur);
      this.focusListener = () => element.removeEventListener('focusin', onFocus);
      this.blurListener = () => element.removeEventListener('focusout', onBlur);
    });
  }

  private removeListeners(): void {
    this.focusListener?.();
    this.blurListener?.();
    this.focusListener = null;
    this.blurListener = null;
  }

  private warnNoControl(): void {
    const hasAnyControl =
      !!this.formControl || !!this.controlElement || !!this.effectiveNgControl();
    if (!hasAnyControl) {
      console.warn(
        `[SolarisFormField] No form control found inside <solaris-form-field id="${this.fieldId}">. ` +
          'Form Field requires a control (input, select, textarea, or a Solaris form control directive). ' +
          'This warning is shown in development only. The component will render safely without the control.',
      );
    }
  }

  private warnMultipleControls(): void {
    // SECURITY_EXCEPTION: nativeElement access required to count projected controls.
    // SECURITY_EXCEPTION: Same justification as detectControl: read-only query, no DOM mutation.
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
