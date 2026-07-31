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
  ContentChildren,
  QueryList,
  type AfterContentInit,
  type OnDestroy,
  NgZone,
  ChangeDetectionStrategy,
} from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Subscription = any;
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';

import { SolarisFormControl } from '../../form-field/model/form-control.contract';
import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisSwitchComponent } from '../../switch';

import type {
  SolarisSwitchGroupOrientation,
  SolarisSwitchGroupLayout,
  SolarisSwitchGroupColumns,
  SolarisSwitchGroupDensity,
  SolarisSwitchGroupSize,
} from '../model/switch-group.types';

let nextId = 0;

function generateId(): string {
  return `solaris-switch-group-${++nextId}`;
}

@Component({
  selector: 'solaris-switch-group',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SolarisSwitchGroupComponent),
      multi: true,
    },
    {
      provide: SolarisFormControl,
      useExisting: forwardRef(() => SolarisSwitchGroupComponent),
    },
  ],
  templateUrl: './switch-group.component.html',
  styleUrls: ['./switch-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'group',
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
export class SolarisSwitchGroupComponent
  extends SolarisFormControl
  implements ControlValueAccessor, AfterContentInit, OnDestroy
{
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly translateService = inject(SolarisTranslateService);
  private readonly ngZone = inject(NgZone);

  @ContentChildren(SolarisSwitchComponent)
  protected switches!: QueryList<SolarisSwitchComponent>;

  readonly orientation = input<SolarisSwitchGroupOrientation>('vertical');
  readonly layout = input<SolarisSwitchGroupLayout>('list');
  readonly columns = input<SolarisSwitchGroupColumns>(1);
  readonly density = input<SolarisSwitchGroupDensity>();
  readonly size = input<SolarisSwitchGroupSize>('md');
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
  readonly minEnabled = input<number>();
  readonly maxEnabled = input<number>();
  readonly ariaLabel = input<string>();
  readonly ariaLabelKey = input<string>();

  readonly valueChange = output<Record<string, boolean>>();
  // eslint-disable-next-line @angular-eslint/no-output-native
  readonly change = output<Record<string, boolean>>();

  private readonly _value = signal<Record<string, boolean>>({});
  private readonly _focused = signal(false);
  private readonly _describedByIds = signal<string[]>([]);
  private readonly cvaDisabled = signal(false);
  private readonly autoInvalid = signal(false);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: Record<string, boolean>) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  private readonly switchSubscriptions = new Map<
    SolarisSwitchComponent,
    Subscription
  >();
  private contentInitialized = false;
  private switchQuerySubscription: Subscription | null = null;
  private focusListenersAttached = false;

  protected readonly groupId = computed(() => {
    // SECURITY_EXCEPTION: nativeElement.getAttribute('id') is the standard DOM API to check existing ID before generating one. Same approach used by Angular CDK and Solaris Checkbox/Radio groups.
    return this.elementRef.nativeElement.getAttribute('id') || generateId();
  });
  protected readonly labelId = computed(() => `${this.groupId()}-label`);
  protected readonly hintId = computed(() => `${this.groupId()}-hint`);
  protected readonly errorId = computed(() => `${this.groupId()}-error`);

  protected readonly columnsStr = computed(() => String(this.columns()));

  protected readonly effectiveDensity = computed<SolarisSwitchGroupDensity>(
    () => {
      return this.density() ?? 'comfortable';
    },
  );

  protected readonly isEffectivelyDisabled = computed(() => {
    return this.disabledInput() || this.cvaDisabled();
  });

  protected readonly isEffectivelyReadonly = computed(() => {
    return this.readonlyInput();
  });

  protected readonly isEffectivelyInvalid = computed(() => {
    return this.invalidInput() ?? this.autoInvalid();
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
    const first = this.switches?.get(0);
    if (first) {
      first.focus();
    }
  }

  writeValue(value: Record<string, boolean> | null): void {
    this._value.set(value ? { ...value } : {});
    this.syncSwitchesToValue();
  }

  registerOnChange(fn: (value: Record<string, boolean>) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
    this.propagateDisabledToSwitches();
  }

  ngAfterContentInit(): void {
    this.contentInitialized = true;
    this.validateChildren();
    this.attachFocusListeners();
    this.initSwitches();
    this.syncSwitchesToValue();
    this.propagateDisabledToSwitches();
    this.propagateReadonlyToSwitches();

    this.switchQuerySubscription = this.switches.changes.subscribe(() => {
      this.validateChildren();
      this.initSwitches();
      this.syncSwitchesToValue();
      this.propagateDisabledToSwitches();
      this.propagateReadonlyToSwitches();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAllSwitches();
    if (this.switchQuerySubscription) {
      this.switchQuerySubscription.unsubscribe();
    }
  }

  private validateChildren(): void {
    if (!this.switches) return;

    const keys = new Map<string, SolarisSwitchComponent>();

    this.switches.forEach((sw) => {
      const key = sw.value();
      if (key === null || key === undefined) {
        console.warn(
          `[SolarisSwitchGroup] A <solaris-switch> child is missing a value attribute. ` +
            `Each switch inside <solaris-switch-group> must have a unique value.`,
        );
        return;
      }
      if (keys.has(key)) {
        console.warn(
          `[SolarisSwitchGroup] Duplicate value "${key}" detected among <solaris-switch> children. ` +
            `Each switch value must be unique within the group.`,
        );
      }
      keys.set(key, sw);
    });
  }

  private attachFocusListeners(): void {
    if (this.focusListenersAttached) return;
    this.focusListenersAttached = true;

    // SECURITY_EXCEPTION: nativeElement.focusin/focusout are standard DOM events for focus tracking. Same pattern used by Solaris FormField and Checkbox/Radio groups.
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

  private initSwitches(): void {
    this.unsubscribeAllSwitches();
    this.switches.forEach((sw) => {
      const sub = sw.checkedChange.subscribe((checked: boolean) => {
        this.onChildCheckedChange(sw, checked);
      });
      this.switchSubscriptions.set(sw, sub);
    });
  }

  private unsubscribeAllSwitches(): void {
    this.switchSubscriptions.forEach((sub) => sub.unsubscribe());
    this.switchSubscriptions.clear();
  }

  private onChildCheckedChange(
    child: SolarisSwitchComponent,
    checked: boolean,
  ): void {
    if (this.isEffectivelyDisabled() || this.isEffectivelyReadonly()) {
      return;
    }

    const key = child.value();
    if (key === null || key === undefined) {
      return;
    }

    const currentValue = { ...this._value() };
    currentValue[key] = checked;

    this.updateValue(currentValue);
  }

  private updateValue(newValue: Record<string, boolean>): void {
    this._value.set(newValue);
    this.onChange(newValue);
    this.valueChange.emit(newValue);
    this.change.emit(newValue);
  }

  private syncSwitchesToValue(): void {
    if (!this.contentInitialized || !this.switches) return;
    const currentValue = this._value();

    this.switches.forEach((sw) => {
      const key = sw.value();
      if (key === null || key === undefined) {
        return;
      }
      sw.writeValue(currentValue[key]);
    });
  }

  private propagateDisabledToSwitches(): void {
    if (!this.contentInitialized || !this.switches) return;
    const isDisabled = this.isEffectivelyDisabled();
    this.switches.forEach((sw) => {
      sw.setDisabledState(isDisabled);
    });
  }

  private propagateReadonlyToSwitches(): void {
    if (!this.contentInitialized || !this.switches) return;
    const isReadonly = this.isEffectivelyReadonly();
    this.switches.forEach((sw) => {
      sw.setCvaReadonlyState(isReadonly);
    });
  }

  private readonly _propagateEffect = effect(() => {
    if (!this.contentInitialized) return;
    this.isEffectivelyDisabled();
    this.isEffectivelyReadonly();
    this.propagateDisabledToSwitches();
    this.propagateReadonlyToSwitches();
  });

  private readonly _validateEffect = effect(() => {
    this._value();
    this.minEnabled();
    this.maxEnabled();
    this.requiredInput();
    this.validateBounds();
  });

  private validateBounds(): void {
    const value = this._value();
    const enabledCount = Object.values(value).filter(Boolean).length;
    const min = this.minEnabled();
    const max = this.maxEnabled();
    const isRequired = this.requiredInput();
    const minRequired = min ?? (isRequired ? 1 : 0);

    const isOutOfBounds =
      (minRequired > 0 && enabledCount < minRequired) ||
      (max != null && enabledCount > max);
    this.autoInvalid.set(isOutOfBounds);
  }

  constructor() {
    super();
  }
}
