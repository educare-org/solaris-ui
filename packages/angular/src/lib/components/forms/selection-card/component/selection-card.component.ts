// SECURITY_EXCEPTION_FILE: nativeElement.focus() is the standard DOM API to focus an element. No alternative exists.
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  contentChild,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';

import { resolveElementId } from '../../../../core';
import { SolarisThemeService } from '../../../../services/theme';
import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisFormControl } from '../../form-field/model/form-control.contract';
import { SOLARIS_RADIO_GROUP_NAME } from '../../radio-group/model/radio-group.token';
import {
  SOLARIS_RADIO_OPTION,
  type SolarisRadioOption,
} from '../../radio/model/radio-option.contract';
import { SolarisSelectionCardMediaDirective } from '../directives/selection-card-media.directive';

import type {
  SolarisSelectionCardAppearance,
  SolarisSelectionCardColor,
  SolarisSelectionCardDensity,
  SolarisSelectionCardRadius,
  SolarisSelectionCardSize,
} from '../model/selection-card.types';

@Component({
  selector: 'solaris-selection-card',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SolarisSelectionCardComponent),
      multi: true,
    },
    {
      provide: SolarisFormControl,
      useExisting: forwardRef(() => SolarisSelectionCardComponent),
    },
    {
      provide: SOLARIS_RADIO_OPTION,
      useExisting: forwardRef(() => SolarisSelectionCardComponent),
    },
  ],
  templateUrl: './selection-card.component.html',
  styleUrls: ['./selection-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-selection-card',
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-color]': 'color()',
    '[attr.data-size]': 'size()',
    '[attr.data-radius]': 'radius()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-checked]': '_checked() ? "" : null',
    '[attr.data-disabled]': 'isEffectivelyDisabled() ? "" : null',
    '[attr.data-readonly]': 'isEffectivelyReadonly() ? "" : null',
    '[attr.data-invalid]': 'isEffectivelyInvalid() ? "" : null',
    '[attr.data-focused]': '_focused() ? "" : null',
    '[attr.data-has-media]': 'hasMedia() ? "" : null',
  },
})
export class SolarisSelectionCardComponent
  extends SolarisFormControl
  implements ControlValueAccessor, SolarisRadioOption
{
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly translateService = inject(SolarisTranslateService);
  private readonly groupName =
    inject(SOLARIS_RADIO_GROUP_NAME, { optional: true }) ?? null;
  private readonly inputElementRef =
    viewChild<ElementRef<HTMLInputElement>>('inputElement');
  private readonly media = contentChild(SolarisSelectionCardMediaDirective);

  protected readonly _checked = signal(false);
  protected readonly _focused = signal(false);
  private readonly _describedByIds = signal<string[]>([]);
  private readonly cvaDisabled = signal(false);
  private readonly cvaReadonly = signal(false);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: boolean) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  readonly checked = input<boolean, boolean>(false, {
    transform: (value: boolean) => value ?? false,
  });
  readonly disabledInput = input<boolean, boolean>(false, {
    alias: 'disabled',
    transform: (value: boolean) => value ?? false,
  });
  readonly readonlyInput = input<boolean, boolean>(false, {
    alias: 'readonly',
    transform: (value: boolean) => value ?? false,
  });
  readonly requiredInput = input<boolean, boolean>(false, {
    alias: 'required',
    transform: (value: boolean) => value ?? false,
  });
  readonly invalidInput = input<boolean | undefined>(undefined, {
    alias: 'invalid',
  });
  readonly appearance = input<SolarisSelectionCardAppearance>('surface');
  readonly color = input<SolarisSelectionCardColor>('neutral');
  readonly size = input<SolarisSelectionCardSize>('md');
  readonly radius = input<SolarisSelectionCardRadius>('lg');
  readonly density = input<SolarisSelectionCardDensity>();
  readonly name = input<string>();
  readonly value = input<unknown>();
  readonly ariaLabel = input<string>();
  readonly ariaLabelKey = input<string>();

  readonly checkedChange = output<boolean>();
  readonly changeEvent = output<Event>();

  protected readonly themeService = inject(SolarisThemeService);

  protected readonly effectiveDensity = computed<SolarisSelectionCardDensity>(
    () => this.density() ?? this.themeService.density,
  );

  protected readonly hasMedia = computed(() => this.media() !== undefined);

  protected readonly isEffectivelyDisabled = computed(
    () => this.disabledInput() || this.cvaDisabled(),
  );

  protected readonly isEffectivelyReadonly = computed(
    () => this.readonlyInput() || this.cvaReadonly(),
  );

  protected readonly isEffectivelyInvalid = computed(
    () => this.invalidInput() ?? false,
  );

  protected readonly elementId = computed(() =>
    resolveElementId(this.elementRef, 'solaris-selection-card'),
  );

  protected readonly contentId = computed(() => `${this.elementId()}-content`);

  protected readonly effectiveName = computed(
    () => this.name() ?? this.groupName,
  );

  protected readonly ariaDescribedBy = computed(() => {
    const ids = this._describedByIds();
    return ids.length > 0 ? ids.join(' ') : null;
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
    return this.effectiveAriaLabel() ? null : this.contentId();
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
    this.inputElementRef()?.nativeElement.focus();
  }

  private readonly syncCheckedFromInput = effect(() => {
    this._checked.set(this.checked());
  });

  private readonly syncNativeChecked = effect(() => {
    const input = this.inputElementRef()?.nativeElement;
    if (input) {
      input.checked = this._checked();
    }
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

  setCvaReadonlyState(isReadonly: boolean): void {
    this.cvaReadonly.set(isReadonly);
  }

  protected onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (this.isEffectivelyDisabled() || this.isEffectivelyReadonly()) {
      event.preventDefault();
      input.checked = this._checked();
      return;
    }

    this.syncCheckedFromNativeInput(input);
    this.changeEvent.emit(event);
  }

  private syncCheckedFromNativeInput(input: HTMLInputElement): void {
    if (this._checked() === input.checked) {
      return;
    }

    this._checked.set(input.checked);
    this.onChange(input.checked);
    this.checkedChange.emit(input.checked);
    this.onTouched();
  }

  protected onFocus(): void {
    this._focused.set(true);
  }

  protected onBlur(): void {
    this._focused.set(false);
    this.onTouched();
  }
}
