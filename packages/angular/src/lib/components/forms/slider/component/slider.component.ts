import {
  Component,
  input,
  model,
  output,
  computed,
  signal,
  forwardRef,
  inject,
  viewChild,
  ElementRef,
  isDevMode,
  effect,
  booleanAttribute,
  numberAttribute,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';

import { SolarisFormControl } from '../../form-field/model/form-control.contract';
import { resolveElementId } from '../../../../core';
import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisIconComponent } from '../../../icon';

import type { SolarisIconName } from '../../../../services/icon';
import type {
  SolarisSliderColor,
  SolarisSliderOrientation,
  SolarisSliderScale,
  SolarisSliderSize,
  SolarisSliderValueDisplay,
  SolarisSliderValueFormatter,
  SolarisSliderZone,
  SolarisZoneFadePhase,
} from '../model/slider.types';
import {
  SOLARIS_SLIDER_DEFAULT_COLOR,
  SOLARIS_SLIDER_DEFAULT_DISTRIBUTION,
  SOLARIS_SLIDER_DEFAULT_MAX,
  SOLARIS_SLIDER_DEFAULT_MIN,
  SOLARIS_SLIDER_DEFAULT_ORIENTATION,
  SOLARIS_SLIDER_DEFAULT_SCALE,
  SOLARIS_SLIDER_DEFAULT_SHOW_MIN_MAX,
  SOLARIS_SLIDER_DEFAULT_SHOW_TICKS,
  SOLARIS_SLIDER_DEFAULT_SIZE,
  SOLARIS_SLIDER_DEFAULT_STEP,
  SOLARIS_SLIDER_DEFAULT_TICK_VALUES,
  SOLARIS_SLIDER_DEFAULT_VALUE,
  SOLARIS_SLIDER_DEFAULT_VALUE_DISPLAY,
  SOLARIS_SLIDER_DEFAULT_ZONES,
} from '../model/slider.defaults';
import {
  clampToRange,
  defaultPageStep,
  snapToStep,
  tickPositions,
} from '../functions/slider.utils';
import {
  distributionHeights,
  ratioOf,
  resolveZoneColor,
  resolveZoneFade,
  validateTickValues,
  valueFromRatio,
} from '../functions/slider.scale';

export const SOLARIS_SLIDER_DEFAULT_UNIT = '%';

@Component({
  selector: 'solaris-slider',
  standalone: true,
  imports: [SolarisIconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SolarisSliderComponent),
      multi: true,
    },
    {
      provide: SolarisFormControl,
      useExisting: forwardRef(() => SolarisSliderComponent),
    },
  ],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-slider',
    '[attr.data-size]': 'size()',
    '[attr.data-color]': 'resolvedColor()',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-value-display]': 'valueDisplay()',
    '[attr.data-disabled]': 'isEffectivelyDisabled() ? "" : null',
    '[attr.data-readonly]': 'readonlyInput() ? "" : null',
    '[attr.data-invalid]': 'invalidInput() ? "" : null',
    '[attr.data-dragging]': '_dragging() ? "" : null',
  },
})
export class SolarisSliderComponent
  extends SolarisFormControl
  implements ControlValueAccessor
{
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly translateService = inject(SolarisTranslateService);

  protected readonly trackElementRef =
    viewChild<ElementRef<HTMLElement>>('trackElement');
  protected readonly thumbElementRef =
    viewChild<ElementRef<HTMLElement>>('thumbElement');

  protected readonly _dragging = signal(false);
  protected readonly _released = signal(false);
  protected readonly _focused = signal(false);
  private readonly _describedByIds = signal<string[]>([]);
  private readonly cvaDisabled = signal(false);
  private keyDirty = false;
  private previousZoneColor: SolarisSliderColor | null = null;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: number) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  readonly value = model<number>(SOLARIS_SLIDER_DEFAULT_VALUE);
  readonly min = input<number, unknown>(SOLARIS_SLIDER_DEFAULT_MIN, {
    transform: numberAttribute,
  });
  readonly max = input<number, unknown>(SOLARIS_SLIDER_DEFAULT_MAX, {
    transform: numberAttribute,
  });
  readonly step = input<number, unknown>(SOLARIS_SLIDER_DEFAULT_STEP, {
    transform: numberAttribute,
  });
  readonly pageStep = input<number | undefined, unknown>(undefined, {
    transform: (v: unknown) =>
      v === undefined || v === null || v === '' ? undefined : Number(v),
  });
  readonly orientation = input<SolarisSliderOrientation>(
    SOLARIS_SLIDER_DEFAULT_ORIENTATION,
  );
  readonly size = input<SolarisSliderSize>(SOLARIS_SLIDER_DEFAULT_SIZE);
  readonly color = input<SolarisSliderColor>(SOLARIS_SLIDER_DEFAULT_COLOR);
  readonly valueDisplay = input<SolarisSliderValueDisplay>(
    SOLARIS_SLIDER_DEFAULT_VALUE_DISPLAY,
  );
  readonly formatValue = input<SolarisSliderValueFormatter | undefined>();
  readonly valueText = input<SolarisSliderValueFormatter | undefined>();
  readonly unit = input<string>(SOLARIS_SLIDER_DEFAULT_UNIT);
  readonly unitKey = input<string | undefined>();
  readonly showTicks = input<boolean, unknown>(
    SOLARIS_SLIDER_DEFAULT_SHOW_TICKS,
    { transform: booleanAttribute },
  );
  readonly showMinMax = input<boolean, unknown>(
    SOLARIS_SLIDER_DEFAULT_SHOW_MIN_MAX,
    { transform: booleanAttribute },
  );
  readonly tickStep = input<number | undefined, unknown>(undefined, {
    transform: (v: unknown) =>
      v === undefined || v === null || v === '' ? undefined : Number(v),
  });
  readonly scale = input<SolarisSliderScale>(SOLARIS_SLIDER_DEFAULT_SCALE);
  readonly tickValues = input<readonly number[] | undefined>(
    SOLARIS_SLIDER_DEFAULT_TICK_VALUES,
  );
  readonly zones = input<readonly SolarisSliderZone[] | undefined>(
    SOLARIS_SLIDER_DEFAULT_ZONES,
  );
  readonly distribution = input<readonly number[] | undefined>(
    SOLARIS_SLIDER_DEFAULT_DISTRIBUTION,
  );
  readonly sliderLabel = input<string | undefined>(undefined, {
    alias: 'label',
  });
  readonly labelKey = input<string | undefined>();
  readonly sliderDescription = input<string | undefined>(undefined, {
    alias: 'description',
  });
  readonly descriptionKey = input<string | undefined>();
  readonly ariaLabel = input<string | undefined>();
  readonly ariaLabelKey = input<string | undefined>();
  readonly startIcon = input<SolarisIconName | undefined>();
  readonly endIcon = input<SolarisIconName | undefined>();
  readonly thumbIcon = input<SolarisIconName | undefined>();
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
  readonly invalidInput = input<boolean, unknown>(false, {
    alias: 'invalid',
    transform: booleanAttribute,
  });
  readonly name = input<string | undefined>();

  readonly valueCommit = output<number>();

  protected readonly effectiveValue = computed(() =>
    snapToStep(
      clampToRange(this.value(), this.min(), this.max()),
      this.min(),
      this.step(),
    ),
  );

  protected readonly percent = computed(
    () =>
      ratioOf(this.effectiveValue(), this.min(), this.max(), this.scale()) *
      100,
  );

  protected readonly effectivePageStep = computed(
    () =>
      this.pageStep() ?? defaultPageStep(this.step(), this.min(), this.max()),
  );

  protected readonly unitText = computed(() => {
    const key = this.unitKey();
    if (key) {
      const translated = this.translateService.translate(key);
      if (translated !== key) {
        return translated;
      }
    }
    return this.unit();
  });

  protected readonly displayText = computed(() =>
    this.formatBound(this.effectiveValue()),
  );

  protected readonly minLabel = computed(() => this.formatBound(this.min()));

  protected readonly maxLabel = computed(() => this.formatBound(this.max()));

  protected readonly ariaValueText = computed(() => {
    const builder = this.valueText();
    if (builder) {
      return builder(this.effectiveValue());
    }
    return this.displayText();
  });

  protected readonly labelText = computed(() => {
    const key = this.labelKey();
    if (key) {
      const translated = this.translateService.translate(key);
      return translated !== key ? translated : undefined;
    }
    return this.sliderLabel();
  });

  protected readonly descriptionText = computed(() => {
    const key = this.descriptionKey();
    if (key) {
      const translated = this.translateService.translate(key);
      return translated !== key ? translated : undefined;
    }
    return this.sliderDescription();
  });

  protected readonly effectiveAriaLabel = computed(() => {
    const key = this.ariaLabelKey();
    if (key) {
      const translated = this.translateService.translate(key);
      return translated !== key ? translated : undefined;
    }
    return this.ariaLabel();
  });

  protected readonly resolvedColor = computed(() =>
    resolveZoneColor(this.effectiveValue(), this.zones(), this.color()),
  );

  protected readonly zoneFadeColor = signal<SolarisSliderColor | null>(null);
  protected readonly zoneFade = signal<SolarisZoneFadePhase | null>(null);

  protected readonly distributionBars = computed(() =>
    distributionHeights(this.distribution()),
  );

  protected readonly tickOffsets = computed(() => {
    if (!this.showTicks()) {
      return [];
    }
    const min = this.min();
    const max = this.max();
    const scale = this.scale();
    const explicit = validateTickValues(this.tickValues(), min, max);
    if (explicit.length > 0) {
      return explicit.map((tick) => ratioOf(tick, min, max, scale) * 100);
    }
    if (scale.kind !== 'linear' && scale.kind !== 'time') {
      return [];
    }
    const tickStep = this.tickStep() ?? this.step();
    return tickPositions(min, max, tickStep).map(
      (tick) => ratioOf(tick, min, max, scale) * 100,
    );
  });

  protected readonly isEffectivelyDisabled = computed(
    () => this.disabledInput() || this.cvaDisabled(),
  );

  protected readonly elementId = computed(() =>
    resolveElementId(this.elementRef, 'solaris-slider'),
  );

  protected readonly labelId = computed(() => `${this.elementId()}-label`);
  protected readonly descriptionId = computed(
    () => `${this.elementId()}-description`,
  );

  protected readonly ariaLabelledBy = computed(() =>
    this.labelText() ? this.labelId() : null,
  );

  protected readonly ariaDescribedBy = computed(() => {
    const ids = [...this._describedByIds()];
    if (this.descriptionText()) {
      ids.push(this.descriptionId());
    }
    return ids.length > 0 ? ids.join(' ') : null;
  });

  protected readonly thumbOffset = computed(() => `${this.percent()}%`);

  protected readonly fillTransform = computed(() => {
    const ratio = this.percent() / 100;
    return this.orientation() === 'vertical'
      ? `scaleY(${ratio})`
      : `scaleX(${ratio})`;
  });

  protected readonly showHeader = computed(
    () => !!this.labelText() || this.valueDisplay() === 'inline',
  );

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
    return this.readonlyInput();
  }

  get invalid(): boolean {
    return this.invalidInput();
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
    const thumb = this.thumbElementRef();
    if (thumb) {
      // SECURITY_EXCEPTION: programmatic focus requires the native method; no declarative alternative exists.
      thumb.nativeElement.focus();
    }
  }

  writeValue(value: number | null): void {
    this.value.set(this.normalize(value ?? this.min()));
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }

  protected onThumbKeydown(event: KeyboardEvent): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) {
      return;
    }
    const step = this.step() > 0 ? this.step() : 0;
    let next: number | null = null;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = this.effectiveValue() + step;
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        next = this.effectiveValue() - step;
        break;
      case 'Home':
        next = this.min();
        break;
      case 'End':
        next = this.max();
        break;
      case 'PageUp':
        next = this.effectiveValue() + this.effectivePageStep();
        break;
      case 'PageDown':
        next = this.effectiveValue() - this.effectivePageStep();
        break;
      default:
        return;
    }
    event.preventDefault();
    this.applyValue(next, false);
    this.keyDirty = true;
  }

  protected onThumbFocus(): void {
    this._focused.set(true);
  }

  protected onThumbBlur(): void {
    this._focused.set(false);
    if (this.keyDirty) {
      this.keyDirty = false;
      this.valueCommit.emit(this.effectiveValue());
    }
    this.onTouched();
  }

  protected onTrackPointerDown(event: PointerEvent): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) {
      return;
    }
    if (event.button !== 0) {
      return;
    }
    this._dragging.set(true);
    this._released.set(false);
    this.applyValue(this.valueFromPointer(event), false);
    const track = this.trackElementRef();
    if (track) {
      try {
        // SECURITY_EXCEPTION: drag continuity requires pointer capture on the track; no declarative alternative exists.
        track.nativeElement.setPointerCapture(event.pointerId);
        // eslint-disable-next-line no-empty
      } catch {}
    }
    this.focus();
    event.preventDefault();
  }

  protected onTrackPointerMove(event: PointerEvent): void {
    if (
      !this._dragging() ||
      this.isEffectivelyDisabled() ||
      this.readonlyInput()
    ) {
      return;
    }
    this.applyValue(this.valueFromPointer(event), false);
  }

  protected onTrackPointerUp(event: PointerEvent): void {
    if (!this._dragging()) {
      return;
    }
    this._dragging.set(false);
    this._released.set(true);
    this.valueCommit.emit(this.effectiveValue());
    this.onTouched();
    event.preventDefault();
  }

  protected onTrackPointerCancel(): void {
    this._dragging.set(false);
  }

  protected onThumbAnimationEnd(): void {
    this._released.set(false);
  }

  private formatBound(value: number): string {
    const formatter = this.formatValue();
    if (formatter) {
      return formatter(value);
    }
    return `${value}${this.unitText()}`;
  }

  private normalize(candidate: number): number {
    return snapToStep(
      clampToRange(candidate, this.min(), this.max()),
      this.min(),
      this.step(),
    );
  }

  private applyValue(candidate: number, commit: boolean): void {
    const next = this.normalize(candidate);
    this.value.set(next);
    this.onChange(next);
    if (commit) {
      this.valueCommit.emit(next);
    }
  }

  private valueFromPointer(event: PointerEvent): number {
    const track = this.trackElementRef();
    if (!track) {
      return this.effectiveValue();
    }
    const rect = track.nativeElement.getBoundingClientRect();
    const min = this.min();
    const max = this.max();
    const scale = this.scale();
    if (this.orientation() === 'vertical') {
      if (rect.height <= 0) {
        return this.effectiveValue();
      }
      const ratio = (rect.bottom - event.clientY) / rect.height;
      return valueFromRatio(ratio, min, max, scale);
    }
    if (rect.width <= 0) {
      return this.effectiveValue();
    }
    const ratio = (event.clientX - rect.left) / rect.width;
    return valueFromRatio(ratio, min, max, scale);
  }

  constructor() {
    super();
    if (isDevMode()) {
      effect(() => {
        if (!(this.max() > this.min())) {
          console.warn(
            `[SolarisSlider] "max" (${this.max()}) must be greater than "min" (${this.min()}). Values are normalized defensively.`,
          );
        }
        if (!(this.step() > 0)) {
          console.warn(
            `[SolarisSlider] "step" (${this.step()}) must be greater than 0. Snapping is skipped until fixed.`,
          );
        }
        if (this.tickValues() !== undefined && this.tickStep() !== undefined) {
          console.warn(
            `[SolarisSlider] "tickValues" takes precedence over "tickStep". Remove "tickStep" to silence this warning.`,
          );
        }
        const scale = this.scale();
        if (
          this.tickStep() !== undefined &&
          this.tickValues() === undefined &&
          scale.kind !== 'linear' &&
          scale.kind !== 'time'
        ) {
          console.warn(
            `[SolarisSlider] "tickStep" counts linear value steps and is ignored on "${scale.kind}" scales. Use "tickValues" instead.`,
          );
        }
      });
    }
    effect(() => {
      const current = this.resolvedColor();
      const frame = resolveZoneFade(
        this.previousZoneColor,
        current,
        this.zoneFade(),
      );
      this.previousZoneColor = current;
      if (frame === null) {
        return;
      }
      this.zoneFadeColor.set(frame.zone);
      this.zoneFade.set(frame.phase);
    });
  }
}
