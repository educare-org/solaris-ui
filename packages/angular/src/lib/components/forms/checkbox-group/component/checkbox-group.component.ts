import {
  Component,
  input,
  booleanAttribute,
  output,
  computed,
  signal,
  effect,
  forwardRef,
  inject,
  ElementRef,
  contentChildren,
  type AfterContentInit,
  type OnDestroy,
  NgZone,
  ChangeDetectionStrategy,
  type OutputRefSubscription,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';

import { SolarisFormControl } from '../../form-field/model/form-control.contract';
import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisThemeService } from '../../../../services/theme';
import { SolarisCheckboxComponent } from '../../checkbox';
import { SOLARIS_CHECKBOX_GROUP } from '../model/checkbox-group.token';
import { resolveElementId } from '../../../../core';

import type {
  SolarisCheckboxGroupOrientation,
  SolarisCheckboxGroupLayout,
  SolarisCheckboxGroupColumns,
  SolarisCheckboxGroupDensity,
  SolarisCheckboxGroupSize,
} from '../model/checkbox-group.types';

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
    {
      provide: SOLARIS_CHECKBOX_GROUP,
      useExisting: forwardRef(() => SolarisCheckboxGroupComponent),
    },
  ],
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.scss'],
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

  protected readonly checkboxes = contentChildren(SolarisCheckboxComponent);

  readonly orientation = input<SolarisCheckboxGroupOrientation>('vertical');
  readonly layout = input<SolarisCheckboxGroupLayout>('list');
  readonly columns = input<SolarisCheckboxGroupColumns>(1);
  readonly density = input<SolarisCheckboxGroupDensity>();
  readonly size = input<SolarisCheckboxGroupSize>('md');
  readonly disabledInput = input<boolean, unknown>(false, {
    alias: 'disabled',
    transform: booleanAttribute,
  });
  readonly readonlyInput = input<boolean, unknown>(false, {
    alias: 'readonly',
    transform: booleanAttribute,
  });
  readonly requiredInput = input<boolean, unknown>(false, {
    alias: 'required',
    transform: booleanAttribute,
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

  readonly valueChange = output<unknown[]>();

  readonly changeEvent = output<unknown[]>();

  private readonly _value = signal<unknown[]>([]);
  private readonly _focused = signal(false);
  private readonly _describedByIds = signal<string[]>([]);
  private readonly cvaDisabled = signal(false);
  private readonly cvaReadonly = signal(false);
  private readonly autoInvalid = signal(false);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: unknown[]) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  private readonly checkboxCvaSubscriptions = new Map<
    SolarisCheckboxComponent,
    OutputRefSubscription
  >();
  private contentInitialized = false;
  private focusListenersAttached = false;

  protected readonly groupId = computed(() => {
    return resolveElementId(this.elementRef, 'solaris-checkbox-group');
  });
  protected readonly labelId = computed(() => `${this.groupId()}-label`);
  protected readonly hintId = computed(() => `${this.groupId()}-hint`);
  protected readonly errorId = computed(() => `${this.groupId()}-error`);

  protected readonly columnsStr = computed(() => String(this.columns()));

  protected readonly themeService = inject(SolarisThemeService);

  /** Public for SOLARIS_CHECKBOX_GROUP: children inherit group density. */
  readonly effectiveDensity = computed<SolarisCheckboxGroupDensity>(() => {
    return this.density() ?? this.themeService.density;
  });

  protected readonly isEffectivelyDisabled = computed(() => {
    return this.disabledInput() || this.cvaDisabled();
  });

  protected readonly isEffectivelyReadonly = computed(() => {
    return this.readonlyInput() || this.cvaReadonly();
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

  constructor() {
    super();
  }

  focus(): void {
    const first = this.checkboxes()[0];
    if (first) {
      first.focus();
    }
  }

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

  setCvaReadonlyState(isReadonly: boolean): void {
    this.cvaReadonly.set(isReadonly);
  }

  ngAfterContentInit(): void {
    this.contentInitialized = true;
    this.attachFocusListeners();
    this.initCheckboxes();
    this.syncChildrenToValue();
    this.propagateDisabledToChildren();
    this.propagateReadonlyToChildren();
  }

  private readonly _checkboxesEffect = effect(() => {
    if (!this.contentInitialized) return;
    this.checkboxes();
    this.initCheckboxes();
    this.syncChildrenToValue();
    this.propagateDisabledToChildren();
    this.propagateReadonlyToChildren();
  });

  ngOnDestroy(): void {
    this.unsubscribeAllCheckboxes();
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

  private initCheckboxes(): void {
    this.unsubscribeAllCheckboxes();
    this.checkboxes().forEach((checkbox) => {
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

  private updateValue(newValue: unknown[]): void {
    this._value.set(newValue);
    this.syncChildrenToValue();
    this.onChange(newValue);
    this.valueChange.emit(newValue);
    this.changeEvent.emit(newValue);
  }

  private syncChildrenToValue(): void {
    if (!this.contentInitialized) return;
    const currentValue = this._value();
    const cmp = this.compareWith();

    this.checkboxes().forEach((checkbox) => {
      const childValue = checkbox.value();
      const isChecked = currentValue.some((v) => cmp(v, childValue));
      checkbox.writeValue(isChecked);
    });
  }

  private getEnabledCheckboxes(): readonly SolarisCheckboxComponent[] {
    return this.checkboxes().filter((c) => !c.disabled && !c.readonly);
  }

  private isChildValueInValue(child: SolarisCheckboxComponent): boolean {
    const childValue = child.value();
    const cmp = this.compareWith();
    return this._value().some((v) => cmp(v, childValue));
  }

  private propagateDisabledToChildren(): void {
    if (!this.contentInitialized) return;
    const isDisabled = this.isEffectivelyDisabled();
    this.checkboxes().forEach((checkbox) => {
      checkbox.setDisabledState(isDisabled);
    });
  }

  private propagateReadonlyToChildren(): void {
    if (!this.contentInitialized) return;
    const isReadonly = this.isEffectivelyReadonly();
    this.checkboxes().forEach((checkbox) => {
      checkbox.setCvaReadonlyState(isReadonly);
    });
  }

  private readonly _propagateEffect = effect(() => {
    if (!this.contentInitialized) return;
    this.isEffectivelyDisabled();
    this.isEffectivelyReadonly();
    this.propagateDisabledToChildren();
    this.propagateReadonlyToChildren();
  });

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
    this.autoInvalid.set(isOutOfBounds);
  }
}
