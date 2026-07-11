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
} from '@angular/core';
import { type Subscription } from 'rxjs';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';

import { SolarisFormControl } from '../../form-field/model/form-control.contract';
import { SolarisCheckboxComponent } from '../../checkbox/component/checkbox.component';
import { SolarisTranslateService } from '../../../services/translation';

import type {
  SolarisCheckboxGroupOrientation,
  SolarisCheckboxGroupLayout,
  SolarisCheckboxGroupColumns,
  SolarisCheckboxGroupDensity,
  SolarisCheckboxGroupSize,
} from '../model/checkbox-group.types';

let nextId = 0;

function generateId(): string {
  return `solaris-checkbox-group-${++nextId}`;
}

function defaultCompare(a: unknown, b: unknown): boolean {
  return Object.is(a, b);
}

@Component({
  selector: 'solaris-checkbox-group',
  standalone: true,
  imports: [SolarisCheckboxComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SolarisCheckboxGroupComponent),
      multi: true,
    },
    {
      provide: SolarisFormControl,
      useExisting: forwardRef(() => SolarisCheckboxGroupComponent),
    },
  ],
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.scss'],
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
    '[attr.data-select-all]': 'selectAll() ? "" : null',
    '[attr.aria-label]': 'effectiveAriaLabel() ?? null',
    '[attr.aria-labelledby]': 'ariaLabelledBy()',
    '[attr.aria-describedby]': 'ariaDescribedBy()',
    '[attr.aria-invalid]': 'isEffectivelyInvalid() ? "true" : null',
    '[attr.aria-required]': 'isEffectivelyRequired() ? "true" : null',
  },
})
export class SolarisCheckboxGroupComponent
  extends SolarisFormControl
  implements ControlValueAccessor, AfterContentInit, OnDestroy
{
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly translateService = inject(SolarisTranslateService);
  private readonly ngZone = inject(NgZone);

  @ContentChildren(SolarisCheckboxComponent)
  protected checkboxes!: QueryList<SolarisCheckboxComponent>;

  /** Inputs */
  readonly orientation = input<SolarisCheckboxGroupOrientation>('vertical');
  readonly layout = input<SolarisCheckboxGroupLayout>('list');
  readonly columns = input<SolarisCheckboxGroupColumns>(1);
  readonly density = input<SolarisCheckboxGroupDensity>();
  readonly size = input<SolarisCheckboxGroupSize>('md');
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
  readonly minSelected = input<number>();
  readonly maxSelected = input<number>();
  readonly selectAll = input<boolean>(false);
  readonly selectAllLabel = input<string>();
  readonly selectAllLabelKey = input<string>();
  readonly compareWith =
    input<(a: unknown, b: unknown) => boolean>(defaultCompare);
  readonly ariaLabel = input<string>();
  readonly ariaLabelKey = input<string>();

  /** Outputs */
  readonly valueChange = output<unknown[]>();
  // eslint-disable-next-line @angular-eslint/no-output-native
  readonly change = output<unknown[]>();

  /** Internal state */
  private readonly _value = signal<unknown[]>([]);
  private readonly _focused = signal(false);
  private readonly _describedByIds = signal<string[]>([]);
  private readonly cvaDisabled = signal(false);
  private readonly autoInvalid = signal(false);

  /** CVA callbacks */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: unknown[]) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  /** Subscriptions cleanup */
  private readonly checkboxCvaSubscriptions = new Map<
    SolarisCheckboxComponent,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  >();
  private contentInitialized = false;
  private checkboxQuerySubscription: Subscription | null = null;
  private focusListenersAttached = false;

  /** IDs */
  protected readonly groupId = computed(() => {
    // SECURITY_EXCEPTION: nativeElement.getAttribute('id') is the standard DOM API to check existing ID before generating one. Same approach used by Angular CDK and Solaris Checkbox.
    return this.elementRef.nativeElement.getAttribute('id') || generateId();
  });
  protected readonly labelId = computed(() => `${this.groupId()}-label`);
  protected readonly hintId = computed(() => `${this.groupId()}-hint`);
  protected readonly errorId = computed(() => `${this.groupId()}-error`);

  /** Computed */
  protected readonly columnsStr = computed(() => String(this.columns()));

  protected readonly effectiveDensity = computed<SolarisCheckboxGroupDensity>(
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

  protected readonly selectAllLabelText = computed(() => {
    const customLabel = this.selectAllLabel();
    if (customLabel) return customLabel;
    const key = this.selectAllLabelKey();
    if (key) {
      const translated = this.translateService.translate(key);
      if (translated !== key) return translated;
    }
    return this.translateService.translate('solaris.checkboxGroup.selectAll');
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

  /** Select-all computed */
  protected readonly selectAllChecked = computed(() => {
    const children = this.getEnabledCheckboxes();
    if (children.length === 0) return false;
    return children.every((c) => this.isChildValueInValue(c));
  });

  protected readonly selectAllIndeterminate = computed(() => {
    const children = this.getEnabledCheckboxes();
    if (children.length === 0) return false;
    const checkedCount = children.filter((c) =>
      this.isChildValueInValue(c),
    ).length;
    return checkedCount > 0 && checkedCount < children.length;
  });

  /** SolarisFormControl implementation */
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
    const first = this.checkboxes?.get(0);
    if (first) {
      first.focus();
    }
  }

  /** CVA implementation */
  writeValue(value: unknown[] | null): void {
    this._value.set(Array.isArray(value) ? [...value] : []);
    this.syncChildrenToValue();
  }

  registerOnChange(fn: (value: unknown[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
    this.propagateDisabledToChildren();
  }

  /** ContentChildren lifecycle */
  ngAfterContentInit(): void {
    this.contentInitialized = true;
    this.attachFocusListeners();
    this.initCheckboxes();
    this.syncChildrenToValue();
    this.propagateDisabledToChildren();
    this.propagateReadonlyToChildren();

    this.checkboxQuerySubscription = this.checkboxes.changes.subscribe(() => {
      this.initCheckboxes();
      this.syncChildrenToValue();
      this.propagateDisabledToChildren();
      this.propagateReadonlyToChildren();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAllCheckboxes();
    if (this.checkboxQuerySubscription) {
      this.checkboxQuerySubscription.unsubscribe();
    }
  }

  /** Focus tracking */
  private attachFocusListeners(): void {
    if (this.focusListenersAttached) return;
    this.focusListenersAttached = true;

    // SECURITY_EXCEPTION: nativeElement.focusin/focusout are standard DOM events for focus tracking. Same pattern used by Solaris FormField.
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

  /** Init checkbox tracking */
  private initCheckboxes(): void {
    this.unsubscribeAllCheckboxes();
    this.checkboxes.forEach((checkbox) => {
      const sub = checkbox.checkedChange.subscribe((checked: boolean) => {
        this.onChildCheckedChange(checkbox, checked);
      });
      this.checkboxCvaSubscriptions.set(checkbox, sub);
    });
  }

  private unsubscribeAllCheckboxes(): void {
    this.checkboxCvaSubscriptions.forEach((sub) => sub.unsubscribe());
    this.checkboxCvaSubscriptions.clear();
  }

  /** Child checkbox interaction */
  private onChildCheckedChange(
    child: SolarisCheckboxComponent,
    checked: boolean,
  ): void {
    if (this.isEffectivelyDisabled() || this.isEffectivelyReadonly()) {
      return;
    }

    const childValue = child.value();
    const currentValue = [...this._value()];
    const cmp = this.compareWith();

    if (checked) {
      const exists = currentValue.some((v) => cmp(v, childValue));
      if (!exists) {
        currentValue.push(childValue);
      }
    } else {
      const index = currentValue.findIndex((v) => cmp(v, childValue));
      if (index !== -1) {
        currentValue.splice(index, 1);
      }
    }

    this.updateValue(currentValue);
  }

  /** Select all interaction */
  protected onSelectAllChange(checked: boolean): void {
    if (this.isEffectivelyDisabled() || this.isEffectivelyReadonly()) {
      return;
    }

    const children = this.getEnabledCheckboxes();
    const cmp = this.compareWith();
    let currentValue = [...this._value()];

    if (checked) {
      for (const child of children) {
        const childValue = child.value();
        const exists = currentValue.some((v) => cmp(v, childValue));
        if (!exists) {
          currentValue.push(childValue);
        }
      }
    } else {
      const removeValues = children.map((c) => c.value());
      currentValue = currentValue.filter(
        (v) => !removeValues.some((rv) => cmp(rv, v)),
      );
    }

    this.updateValue(currentValue);
  }

  /** Value update */
  private updateValue(newValue: unknown[]): void {
    this._value.set(newValue);
    this.syncChildrenToValue();
    this.onChange(newValue);
    this.valueChange.emit(newValue);
    this.change.emit(newValue);
  }

  /** Sync checkboxes to current value */
  private syncChildrenToValue(): void {
    if (!this.contentInitialized || !this.checkboxes) return;
    const currentValue = this._value();
    const cmp = this.compareWith();

    this.checkboxes.forEach((checkbox) => {
      const childValue = checkbox.value();
      const isChecked = currentValue.some((v) => cmp(v, childValue));
      checkbox.writeValue(isChecked);
    });
  }

  /** Get enabled (non-disabled, non-readonly) checkboxes */
  private getEnabledCheckboxes(): SolarisCheckboxComponent[] {
    if (!this.checkboxes) return [];
    return this.checkboxes.filter((c) => !c.disabled && !c.readonly);
  }

  /** Check if a child's value is selected */
  private isChildValueInValue(child: SolarisCheckboxComponent): boolean {
    const childValue = child.value();
    const cmp = this.compareWith();
    return this._value().some((v) => cmp(v, childValue));
  }

  /** Propagate disabled to children */
  private propagateDisabledToChildren(): void {
    if (!this.contentInitialized || !this.checkboxes) return;
    const isDisabled = this.isEffectivelyDisabled();
    this.checkboxes.forEach((checkbox) => {
      checkbox.setDisabledState(isDisabled);
    });
  }

  /** Propagate readonly to children */
  private propagateReadonlyToChildren(): void {
    if (!this.contentInitialized || !this.checkboxes) return;
    const isReadonly = this.isEffectivelyReadonly();
    this.checkboxes.forEach((checkbox) => {
      checkbox.setCvaReadonlyState(isReadonly);
    });
  }

  /** Effect: propagate disabled/readonly when inputs change */
  private readonly _propagateEffect = effect(() => {
    if (!this.contentInitialized) return;
    this.isEffectivelyDisabled();
    this.isEffectivelyReadonly();
    this.propagateDisabledToChildren();
    this.propagateReadonlyToChildren();
  });

  /** Effect: re-validate on value/min/max changes */
  private readonly _validateEffect = effect(() => {
    this._value();
    this.minSelected();
    this.maxSelected();
    this.validateBounds();
  });

  private validateBounds(): void {
    const count = this._value().length;
    const min = this.minSelected();
    const max = this.maxSelected();
    const isOutOfBounds =
      (min != null && count < min) || (max != null && count > max);
    this.autoInvalid.set(!!isOutOfBounds);
  }

  constructor() {
    super();
  }
}
