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
  contentChildren,
  NgZone,
  type AfterContentInit,
  type OnDestroy,
  ChangeDetectionStrategy,
  type OutputRefSubscription,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';

import { SolarisFormControl } from '../../form-field/model/form-control.contract';
import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisThemeService } from '../../../../services/theme';
import {
  SOLARIS_RADIO_GROUP,
  SOLARIS_RADIO_GROUP_NAME,
} from '../model/radio-group.token';
import {
  SOLARIS_RADIO_OPTION,
  type SolarisRadioOption,
} from '../../radio/model/radio-option.contract';
import { SolarisRadioComponent } from '../../radio';
import { resolveElementId } from '../../../../core';

import type {
  SolarisRadioGroupOrientation,
  SolarisRadioGroupLayout,
  SolarisRadioGroupColumns,
  SolarisRadioGroupDensity,
  SolarisRadioGroupSize,
} from '../model/radio-group.types';

function defaultCompare(a: unknown, b: unknown): boolean {
  return Object.is(a, b);
}

let groupNameCounter = 0;

function generateGroupName(): string {
  return `solaris-radio-group-name-${++groupNameCounter}`;
}

@Component({
  selector: 'solaris-radio-group',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SolarisRadioGroupComponent),
      multi: true,
    },
    {
      provide: SolarisFormControl,
      useExisting: forwardRef(() => SolarisRadioGroupComponent),
    },
    {
      provide: SOLARIS_RADIO_GROUP_NAME,
      useFactory: () => generateGroupName(),
    },
    {
      provide: SOLARIS_RADIO_GROUP,
      useExisting: forwardRef(() => SolarisRadioGroupComponent),
    },
  ],
  templateUrl: './radio-group.component.html',
  styleUrls: ['./radio-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'radiogroup',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-layout]': 'layout()',
    '[attr.data-columns]': 'columnsStr()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-size]': 'size()',
    '[attr.data-disabled]': 'isEffectivelyDisabled() ? "" : null',
    '[attr.data-readonly]': 'isEffectivelyReadonly() ? "" : null',
    '[attr.data-invalid]': 'isEffectivelyInvalid() ? "" : null',
    '[attr.aria-label]': 'effectiveAriaLabel() ?? null',
    '[attr.aria-labelledby]': 'ariaLabelledBy()',
    '[attr.aria-describedby]': 'ariaDescribedBy()',
    '[attr.aria-invalid]': 'isEffectivelyInvalid() ? "true" : null',
    '[attr.aria-required]': 'isEffectivelyRequired() ? "true" : null',
  },
})
export class SolarisRadioGroupComponent
  extends SolarisFormControl
  implements ControlValueAccessor, AfterContentInit, OnDestroy
{
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly translateService = inject(SolarisTranslateService);
  private readonly ngZone = inject(NgZone);

  protected readonly radios = contentChildren(SolarisRadioComponent);
  private readonly radioOptions = contentChildren(SOLARIS_RADIO_OPTION);

  readonly orientation = input<SolarisRadioGroupOrientation>('vertical');
  readonly layout = input<SolarisRadioGroupLayout>('list');
  readonly columns = input<SolarisRadioGroupColumns>(1);
  readonly density = input<SolarisRadioGroupDensity>();
  readonly size = input<SolarisRadioGroupSize>('md');
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
  readonly labelInput = input<string>(undefined, { alias: 'label' });
  readonly labelKey = input<string>();
  readonly hintInput = input<string>(undefined, { alias: 'hint' });
  readonly hintKey = input<string>();
  readonly errorInput = input<string>(undefined, { alias: 'error' });
  readonly errorKey = input<string>();
  readonly compareWith =
    input<(a: unknown, b: unknown) => boolean>(defaultCompare);
  readonly ariaLabel = input<string>();
  readonly ariaLabelKey = input<string>();

  readonly valueChange = output<unknown>();

  readonly changeEvent = output<unknown>();

  private readonly _value = signal<unknown>(undefined);
  private readonly _focused = signal(false);
  private readonly _describedByIds = signal<string[]>([]);
  private readonly cvaDisabled = signal(false);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: unknown) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  private readonly radioSubscriptions = new Map<
    SolarisRadioOption,
    OutputRefSubscription
  >();
  private contentInitialized = false;
  private focusListenersAttached = false;
  protected readonly groupId = computed(() => {
    return resolveElementId(this.elementRef, 'solaris-radio-group');
  });
  protected readonly labelId = computed(() => `${this.groupId()}-label`);
  protected readonly hintId = computed(() => `${this.groupId()}-hint`);
  protected readonly errorId = computed(() => `${this.groupId()}-error`);

  protected readonly columnsStr = computed(() => String(this.columns()));

  protected readonly themeService = inject(SolarisThemeService);

  /** Public for SOLARIS_RADIO_GROUP: children inherit group density. */
  readonly effectiveDensity = computed<SolarisRadioGroupDensity>(() => {
    return this.density() ?? this.themeService.density;
  });

  protected readonly isEffectivelyDisabled = computed(() => {
    return this.disabledInput() || this.cvaDisabled();
  });

  protected readonly isEffectivelyReadonly = computed(() => {
    return this.readonlyInput();
  });

  protected readonly isEffectivelyInvalid = computed(() => {
    return this.invalidInput() ?? false;
  });

  protected readonly isEffectivelyRequired = computed(() => {
    return this.requiredInput();
  });

  protected readonly labelText = computed(() => {
    const key = this.labelKey();
    if (key) {
      const translated = this.translateService.translate(key);
      return translated !== key ? translated : undefined;
    }
    return this.labelInput();
  });

  protected readonly hintText = computed(() => {
    const key = this.hintKey();
    if (key) {
      const translated = this.translateService.translate(key);
      return translated !== key ? translated : undefined;
    }
    return this.hintInput();
  });

  protected readonly errorText = computed(() => {
    const key = this.errorKey();
    if (key) {
      const translated = this.translateService.translate(key);
      return translated !== key ? translated : undefined;
    }
    return this.errorInput();
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
    if (this.labelText()) {
      return this.labelId();
    }
    return null;
  });

  protected readonly ariaDescribedBy = computed(() => {
    const customIds = this._describedByIds();
    const ownIds: string[] = [];
    if (this.hintText()) ownIds.push(this.hintId());
    if (this.showError()) ownIds.push(this.errorId());
    const all = [...customIds, ...ownIds];
    return all.length > 0 ? all.join(' ') : null;
  });

  protected readonly showError = computed(() => {
    if (this.isEffectivelyInvalid()) {
      return this.errorText() ?? null;
    }
    return null;
  });

  get id(): string {
    return this.groupId();
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
    return this.isEffectivelyRequired();
  }

  get describedByIds(): string[] {
    return this._describedByIds();
  }

  setDescribedByIds(ids: string[]): void {
    this._describedByIds.set([...ids]);
  }

  focus(): void {
    const first = this.radioOptions()[0];
    if (first) {
      first.focus();
    }
  }

  writeValue(value: unknown): void {
    this._value.set(value ?? undefined);
    this.syncRadiosToValue();
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
    this.propagateDisabledToRadios();
  }

  private readonly _radiosEffect = effect(() => {
    if (!this.contentInitialized) return;
    this.radioOptions();
    this.initRadios();
    this.syncRadiosToValue();
    this.propagateDisabledToRadios();
    this.propagateReadonlyToRadios();
  });

  ngOnDestroy(): void {
    this.unsubscribeAllRadios();
  }

  ngAfterContentInit(): void {
    this.contentInitialized = true;
    this.attachFocusListeners();
    this.radioOptions();
    this.initRadios();
    this.syncRadiosToValue();
    this.propagateDisabledToRadios();
    this.propagateReadonlyToRadios();
  }

  private attachFocusListeners(): void {
    if (this.focusListenersAttached) return;
    this.focusListenersAttached = true;

    // SECURITY_EXCEPTION: group focus tracking needs native focusin/focusout listeners on the host; read-only, outside Angular.
    const native = this.elementRef.nativeElement;
    this.ngZone.runOutsideAngular(() => {
      native.addEventListener('focusin', () => {
        this.ngZone.run(() => this._focused.set(true));
      });
      native.addEventListener('focusout', (e: FocusEvent) => {
        const related = e.relatedTarget as Node | null;
        if (related && native.contains(related)) return;
        this.ngZone.run(() => {
          this._focused.set(false);
          this.onTouched();
        });
      });
    });
  }

  private initRadios(): void {
    this.unsubscribeAllRadios();
    this.radioOptions().forEach((radio) => {
      const sub = radio.checkedChange.subscribe((checked: boolean) => {
        this.onRadioCheckedChange(radio, checked);
      });
      this.radioSubscriptions.set(radio, sub);
    });
  }

  private unsubscribeAllRadios(): void {
    this.radioSubscriptions.forEach((sub) => sub.unsubscribe());
    this.radioSubscriptions.clear();
  }

  private onRadioCheckedChange(
    child: SolarisRadioOption,
    checked: boolean,
  ): void {
    if (this.isEffectivelyDisabled() || this.isEffectivelyReadonly()) {
      return;
    }

    if (!checked) {
      return;
    }

    const childValue = child.value();
    const cmp = this.compareWith();

    const currentValue = this._value();
    if (currentValue !== undefined && cmp(currentValue, childValue)) {
      return;
    }

    this.updateValue(childValue);
  }

  private updateValue(newValue: unknown): void {
    this._value.set(newValue);
    this.syncRadiosToValue();
    this.onChange(newValue);
    this.valueChange.emit(newValue);
    this.changeEvent.emit(newValue);
  }

  private syncRadiosToValue(): void {
    if (!this.contentInitialized) return;
    const currentValue = this._value();
    const cmp = this.compareWith();

    this.radioOptions().forEach((radio) => {
      const childValue = radio.value();
      const isChecked =
        currentValue !== undefined && cmp(currentValue, childValue);
      radio.writeValue(isChecked);
    });
  }

  private propagateDisabledToRadios(): void {
    if (!this.contentInitialized) return;
    const isDisabled = this.isEffectivelyDisabled();
    this.radioOptions().forEach((radio) => {
      radio.setDisabledState(isDisabled);
    });
  }

  private propagateReadonlyToRadios(): void {
    if (!this.contentInitialized) return;
    const isReadonly = this.isEffectivelyReadonly();
    this.radioOptions().forEach((radio) => {
      radio.setCvaReadonlyState(isReadonly);
    });
  }

  private readonly _propagateEffect = effect(() => {
    if (!this.contentInitialized) return;
    this.isEffectivelyDisabled();
    this.isEffectivelyReadonly();
    this.propagateDisabledToRadios();
    this.propagateReadonlyToRadios();
  });

  constructor() {
    super();
  }
}
