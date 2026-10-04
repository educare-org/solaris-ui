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
  viewChild,
  afterNextRender,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';

import { SolarisFormControl } from '../../form-field/model/form-control.contract';
import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisThemeService } from '../../../../services/theme';
import {
  SOLARIS_RADIO_GROUP,
  SOLARIS_RADIO_GROUP_NAME,
} from '../../radio-group';
import { resolveElementId } from '../../../../core';
import {
  SOLARIS_RADIO_OPTION,
  type SolarisRadioOption,
} from '../model/radio-option.contract';

import type {
  SolarisRadioAppearance,
  SolarisRadioColor,
  SolarisRadioSize,
  SolarisRadioDensity,
  SolarisRadioLabelPosition,
} from '../model/radio.types';

@Component({
  selector: 'solaris-radio',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SolarisRadioComponent),
      multi: true,
    },
    {
      provide: SolarisFormControl,
      useExisting: SolarisRadioComponent,
    },
    {
      provide: SOLARIS_RADIO_OPTION,
      useExisting: forwardRef(() => SolarisRadioComponent),
    },
  ],
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-color]': 'color()',
    '[attr.data-size]': 'effectiveSize()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-label-position]': 'labelPosition()',
    '[attr.data-checked]': '_checked() ? "" : null',
    '[attr.data-disabled]': 'isEffectivelyDisabled() ? "" : null',
    '[attr.data-readonly]': 'isEffectivelyReadonly() ? "" : null',
    '[attr.data-invalid]': 'isEffectivelyInvalid() ? "" : null',
    '[attr.data-focused]': '_focused() ? "" : null',
  },
})
export class SolarisRadioComponent
  extends SolarisFormControl
  implements ControlValueAccessor, SolarisRadioOption
{
  private readonly groupName =
    inject(SOLARIS_RADIO_GROUP_NAME, { optional: true }) ?? null;
  private readonly group = inject(SOLARIS_RADIO_GROUP, { optional: true });
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly translateService = inject(SolarisTranslateService);
  protected readonly themeService = inject(SolarisThemeService);

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

  readonly checked = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
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
  readonly radioDescription = input<string>(undefined, {
    alias: 'description',
  });
  readonly size = input<SolarisRadioSize | undefined>(undefined);
  readonly labelPosition = input<SolarisRadioLabelPosition>('end');
  readonly appearance = input<SolarisRadioAppearance>('outline');
  readonly radioLabel = input<string>(undefined, { alias: 'label' });
  readonly color = input<SolarisRadioColor>('neutral');
  readonly density = input<SolarisRadioDensity>();
  readonly descriptionKey = input<string>();
  readonly ariaLabelKey = input<string>();
  readonly ariaLabel = input<string>();
  readonly labelKey = input<string>();
  readonly name = input<string>();
  readonly value = input<unknown>();

  readonly checkedChange = output<boolean>();
  readonly changeEvent = output<Event>();

  protected readonly effectiveSize = computed<SolarisRadioSize>(() => {
    return this.size() ?? this.group?.size() ?? 'md';
  });

  protected readonly effectiveDensity = computed<SolarisRadioDensity>(() => {
    return (
      this.density() ??
      this.group?.effectiveDensity() ??
      this.themeService.density
    );
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
    return resolveElementId(this.elementRef, 'solaris-radio');
  });

  protected readonly descriptionId = computed(
    () => `${this.elementId()}-description`,
  );

  protected readonly ariaDescribedBy = computed(() => {
    const ids = this._describedByIds();
    const ownIds = [...ids];
    if (this.descriptionText()) ownIds.push(this.descriptionId());
    return ownIds.length > 0 ? ownIds.join(' ') : null;
  });

  protected readonly effectiveName = computed(() => {
    return this.name() ?? this.groupName;
  });

  protected readonly labelText = computed(() => {
    const key = this.labelKey();
    if (key) {
      const translated = this.translateService.translate(key);
      return translated !== key ? translated : undefined;
    }
    return this.radioLabel();
  });

  protected readonly descriptionText = computed(() => {
    const key = this.descriptionKey();
    if (key) {
      const translated = this.translateService.translate(key);
      return translated !== key ? translated : undefined;
    }
    return this.radioDescription();
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
      // SECURITY_EXCEPTION: programmatic focus requires the native method; no declarative alternative exists.
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
    this.changeEvent.emit(event);
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
      // SECURITY_EXCEPTION: detecting projected content requires reading host childNodes; same pattern as Angular CDK. Read-only.
      const nativeElement = this.elementRef.nativeElement;
      const hasContent = Array.from(nativeElement.childNodes).some(
        (node) => node.nodeType !== Node.COMMENT_NODE,
      );
      this.hasProjectedContent.set(hasContent);
    });
  }
}
