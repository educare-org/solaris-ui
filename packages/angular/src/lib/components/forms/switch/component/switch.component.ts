import {
  Component,
  input,
  output,
  computed,
  signal,
  effect,
  forwardRef,
  inject,
  ElementRef,
  viewChild,
  afterNextRender,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';

import { SolarisFormControl } from '../../form-field/model/form-control.contract';
import { SolarisTranslateService } from '../../../../services/translation';

import type {
  SolarisSwitchAppearance,
  SolarisSwitchColor,
  SolarisSwitchSize,
  SolarisSwitchDensity,
} from '../model/switch.types';

let nextId = 0;

function generateId(): string {
  return `solaris-switch-${++nextId}`;
}

@Component({
  selector: 'solaris-switch',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SolarisSwitchComponent),
      multi: true,
    },
    {
      provide: SolarisFormControl,
      useExisting: SolarisSwitchComponent,
    },
  ],
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
  host: {
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-color]': 'color()',
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-checked]': '_checked() ? "" : null',
    '[attr.data-disabled]': 'isEffectivelyDisabled() ? "" : null',
    '[attr.data-readonly]': 'isEffectivelyReadonly() ? "" : null',
    '[attr.data-invalid]': 'isEffectivelyInvalid() ? "" : null',
    '[attr.data-focused]': '_focused() ? "" : null',
  },
})
export class SolarisSwitchComponent
  extends SolarisFormControl
  implements ControlValueAccessor
{
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly translateService = inject(SolarisTranslateService);

  private readonly inputElementRef =
    viewChild<ElementRef<HTMLInputElement>>('inputElement');

  protected readonly _checked = signal(false);
  protected readonly _focused = signal(false);
  private readonly _describedByIds = signal<string[]>([]);
  private readonly cvaDisabled = signal(false);
  private readonly cvaReadonly = signal(false);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: boolean) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  protected readonly hasProjectedContent = signal(false);
  private contentChecked = false;

  readonly checked = input<boolean, boolean>(false, {
    transform: (v: boolean) => v ?? false,
  });
  readonly disabledInput = input<boolean, boolean>(false, {
    alias: 'disabled',
    transform: (v: boolean) => v ?? false,
  });
  readonly readonlyInput = input<boolean, boolean>(false, {
    alias: 'readonly',
    transform: (v: boolean) => v ?? false,
  });
  readonly requiredInput = input<boolean, boolean>(false, {
    alias: 'required',
    transform: (v: boolean) => v ?? false,
  });
  readonly invalidInput = input<boolean | undefined>(undefined, {
    alias: 'invalid',
  });
  readonly appearance = input<SolarisSwitchAppearance>('surface');
  readonly color = input<SolarisSwitchColor>('primary');
  readonly size = input<SolarisSwitchSize>('md');
  readonly density = input<SolarisSwitchDensity>();
  readonly switchLabel = input<string>(undefined, { alias: 'label' });
  readonly labelKey = input<string>();
  readonly name = input<string>();
  readonly value = input<string>();
  readonly ariaLabel = input<string>();
  readonly ariaLabelKey = input<string>();

  readonly checkedChange = output<boolean>();
  // eslint-disable-next-line @angular-eslint/no-output-native
  readonly change = output<Event>();

  protected readonly effectiveDensity = computed<SolarisSwitchDensity>(() => {
    return this.density() ?? 'comfortable';
  });

  protected readonly isEffectivelyDisabled = computed(() => {
    return this.disabledInput() || this.cvaDisabled();
  });

  protected readonly isEffectivelyInvalid = computed(() => {
    return this.invalidInput() ?? false;
  });

  protected readonly isEffectivelyReadonly = computed(() => {
    return this.readonlyInput() || this.cvaReadonly();
  });

  protected readonly elementId = computed(() => {
    // SECURITY_EXCEPTION: nativeElement.getAttribute('id') is the standard DOM API to check existing ID before generating one. Same approach used by Angular CDK form controls.
    const existingId = this.elementRef.nativeElement.getAttribute('id');
    return existingId || generateId();
  });

  protected readonly ariaDescribedBy = computed(() => {
    const ids = this._describedByIds();
    return ids.length > 0 ? ids.join(' ') : null;
  });

  protected readonly labelText = computed(() => {
    const key = this.labelKey();
    if (key) {
      const translated = this.translateService.translate(key);
      return translated !== key ? translated : undefined;
    }
    return this.switchLabel();
  });

  protected readonly effectiveAriaLabel = computed(() => {
    const key = this.ariaLabelKey();
    if (key) {
      const translated = this.translateService.translate(key);
      return translated !== key ? translated : undefined;
    }
    return this.ariaLabel();
  });

  protected readonly ariaLabelledBy = computed(() => {
    const labelId = this.elementId() + '-label';
    if (this.hasProjectedContent() || this.labelText()) {
      return labelId;
    }
    return null;
  });

  get id(): string {
    return this.elementId();
  }

  get focused(): boolean {
    return this._focused();
  }

  get disabled(): boolean {
    return this.isEffectivelyDisabled();
  }

  get readonly(): boolean {
    return this.isEffectivelyReadonly();
  }

  get invalid(): boolean {
    return this.isEffectivelyInvalid();
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
      // SECURITY_EXCEPTION: nativeElement.focus() is the standard DOM API to focus an element. No alternative exists.
      input.nativeElement.focus();
    }
  }

  private readonly syncCheckedFromInput = effect(() => {
    this._checked.set(this.checked());
  });

  writeValue(value: boolean | null): void {
    this._checked.set(value === true);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }

  /** Set readonly state from parent group. */
  setCvaReadonlyState(isReadonly: boolean): void {
    this.cvaReadonly.set(isReadonly);
  }

  protected onInputChange(event: Event): void {
    if (this.isEffectivelyDisabled() || this.isEffectivelyReadonly()) {
      event.preventDefault();
      const input = event.target as HTMLInputElement;
      input.checked = this._checked();
      return;
    }

    const input = event.target as HTMLInputElement;
    this._checked.set(input.checked);
    this.onChange(input.checked);
    this.checkedChange.emit(input.checked);
    this.change.emit(event);
    this.onTouched();
  }

  protected onBlur(): void {
    this._focused.set(false);
    this.onTouched();
  }

  protected onFocus(): void {
    this._focused.set(true);
  }

  constructor() {
    super();

    afterNextRender(() => {
      if (this.contentChecked) {
        return;
      }
      this.contentChecked = true;
      // SECURITY_EXCEPTION: nativeElement.childNodes is the standard DOM API to check for projected content in the host element. Same pattern used by Angular CDK content projection detection.
      const nativeElement = this.elementRef.nativeElement;
      const hasContent = Array.from(nativeElement.childNodes).some(
        (node) => node.nodeType !== Node.COMMENT_NODE,
      );
      this.hasProjectedContent.set(hasContent);
    });
  }
}
