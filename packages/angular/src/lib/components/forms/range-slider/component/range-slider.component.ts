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
  viewChildren,
  ElementRef,
  isDevMode,
  effect,
  booleanAttribute,
  numberAttribute,
  ChangeDetectionStrategy,
  type QueryList,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';

import { SolarisFormControl } from '../../form-field/model/form-control.contract';
import { resolveElementId } from '../../../../core';
import { SolarisTranslateService } from '../../../../services/translation';
import type { SolarisTranslateParams } from '../../../../services/translation';
import { SolarisIconComponent } from '../../../icon';

import type { SolarisIconName } from '../../../../services/icon';
import type {
  SolarisSliderColor,
  SolarisSliderOrientation,
  SolarisSliderSize,
  SolarisSliderValueDisplay,
  SolarisSliderValueFormatter,
} from '../../slider/model/slider.types';
import {
  SOLARIS_SLIDER_DEFAULT_COLOR,
  SOLARIS_SLIDER_DEFAULT_MAX,
  SOLARIS_SLIDER_DEFAULT_MIN,
  SOLARIS_SLIDER_DEFAULT_ORIENTATION,
  SOLARIS_SLIDER_DEFAULT_SHOW_TICKS,
  SOLARIS_SLIDER_DEFAULT_SHOW_MIN_MAX,
  SOLARIS_SLIDER_DEFAULT_SIZE,
  SOLARIS_SLIDER_DEFAULT_STEP,
} from '../../slider/model/slider.defaults';
import {
  clampToRange,
  defaultPageStep,
  percentOf,
  snapToStep,
  tickPositions,
} from '../../slider/functions/slider.utils';
import {
  normalizeRangeValues,
  rangeFillBounds,
} from '../functions/range-slider.utils';
import {
  SOLARIS_RANGE_SLIDER_DEFAULT_MAX_THUMBS,
  SOLARIS_RANGE_SLIDER_DEFAULT_MIN_STEPS_BETWEEN_THUMBS,
  SOLARIS_RANGE_SLIDER_DEFAULT_MIN_THUMBS,
  SOLARIS_RANGE_SLIDER_DEFAULT_VALUE_DISPLAY,
  SOLARIS_RANGE_SLIDER_DEFAULT_VALUES,
} from '../model/range-slider.defaults';
import { SOLARIS_SLIDER_DEFAULT_UNIT } from '../../slider/component/slider.component';

@Component({
  selector: 'solaris-range-slider',
  standalone: true,
  imports: [SolarisIconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SolarisRangeSliderComponent),
      multi: true,
    },
    {
      provide: SolarisFormControl,
      useExisting: forwardRef(() => SolarisRangeSliderComponent),
    },
  ],
  templateUrl: './range-slider.component.html',
  styleUrls: ['./range-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-range-slider',
    '[attr.data-size]': 'size()',
    '[attr.data-color]': 'color()',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-value-display]': 'valueDisplay()',
    '[attr.data-disabled]': 'isEffectivelyDisabled() ? "" : null',
    '[attr.data-readonly]': 'readonlyInput() ? "" : null',
    '[attr.data-invalid]': 'invalidInput() ? "" : null',
    '[attr.data-dragging]': 'activeThumb() !== null ? "" : null',
  },
})
export class SolarisRangeSliderComponent
  extends SolarisFormControl
  implements ControlValueAccessor
{
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly translateService = inject(SolarisTranslateService);

  protected readonly trackElementRef =
    viewChild<ElementRef<HTMLElement>>('trackElement');
  protected readonly thumbElementRefs =
    viewChildren<ElementRef<HTMLElement>>('thumbElement');

  protected readonly _focused = signal(false);
  protected readonly activeThumb = signal<number | null>(null);
  protected readonly releasedThumb = signal<number | null>(null);
  private readonly _describedByIds = signal<string[]>([]);
  private readonly cvaDisabled = signal(false);
  private keyDirty = false;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: number[]) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  readonly values = model<number[]>([...SOLARIS_RANGE_SLIDER_DEFAULT_VALUES]);
  readonly minThumbs = input<number, unknown>(
    SOLARIS_RANGE_SLIDER_DEFAULT_MIN_THUMBS,
    { transform: numberAttribute },
  );
  readonly maxThumbs = input<number, unknown>(
    SOLARIS_RANGE_SLIDER_DEFAULT_MAX_THUMBS,
    { transform: numberAttribute },
  );
  readonly minStepsBetweenThumbs = input<number, unknown>(
    SOLARIS_RANGE_SLIDER_DEFAULT_MIN_STEPS_BETWEEN_THUMBS,
    { transform: numberAttribute },
  );
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
    SOLARIS_RANGE_SLIDER_DEFAULT_VALUE_DISPLAY,
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
  readonly rangeLabel = input<string | undefined>(undefined, {
    alias: 'label',
  });
  readonly labelKey = input<string | undefined>();
  readonly rangeDescription = input<string | undefined>(undefined, {
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

  readonly valueCommit = output<number[]>();
  readonly thumbFocus = output<number>();

  protected readonly effectiveMaxThumbs = computed(() => {
    const requested = Math.floor(this.maxThumbs());
    if (requested > SOLARIS_RANGE_SLIDER_DEFAULT_MAX_THUMBS) {
      return SOLARIS_RANGE_SLIDER_DEFAULT_MAX_THUMBS;
    }
    return Math.max(0, requested);
  });

  protected readonly effectiveValues = computed(() =>
    normalizeRangeValues(
      this.values(),
      this.min(),
      this.max(),
      this.step(),
      this.minStepsBetweenThumbs(),
      this.effectiveMaxThumbs(),
    ),
  );

  protected readonly thumbPercents = computed(() =>
    this.effectiveValues().map((value) =>
      percentOf(value, this.min(), this.max()),
    ),
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

  protected readonly labelText = computed(() => {
    const key = this.labelKey();
    if (key) {
      const translated = this.translateService.translate(key);
      return translated !== key ? translated : undefined;
    }
    return this.rangeLabel();
  });

  protected readonly descriptionText = computed(() => {
    const key = this.descriptionKey();
    if (key) {
      const translated = this.translateService.translate(key);
      return translated !== key ? translated : undefined;
    }
    return this.rangeDescription();
  });

  protected readonly baseAriaLabel = computed(() => {
    const key = this.ariaLabelKey();
    if (key) {
      const translated = this.translateService.translate(key);
      return translated !== key ? translated : undefined;
    }
    return this.ariaLabel();
  });

  protected readonly inlineText = computed(() =>
    this.effectiveValues()
      .map((value) => this.formatOne(value))
      .join(' – '),
  );

  protected readonly minLabel = computed(() => this.formatOne(this.min()));

  protected readonly maxLabel = computed(() => this.formatOne(this.max()));

  protected readonly tickOffsets = computed(() => {
    if (!this.showTicks()) {
      return [];
    }
    const tickStep = this.tickStep() ?? this.step();
    return tickPositions(this.min(), this.max(), tickStep).map((tick) =>
      percentOf(tick, this.min(), this.max()),
    );
  });

  protected readonly fillTransform = computed(() => {
    const bounds = rangeFillBounds(
      this.effectiveValues(),
      this.min(),
      this.max(),
    );
    const start = percentOf(bounds.start, this.min(), this.max());
    const end = percentOf(bounds.end, this.min(), this.max());
    const span = Math.max(0, (end - start) / 100);
    // Why: a full-track layer positioned by translate + scale keeps the
    // animated property transform-only; static left/width would need layout.
    return this.orientation() === 'vertical'
      ? `translateY(${100 - end}%) scaleY(${span})`
      : `translateX(${start}%) scaleX(${span})`;
  });

  protected readonly isEffectivelyDisabled = computed(
    () => this.disabledInput() || this.cvaDisabled(),
  );

  protected readonly elementId = computed(() =>
    resolveElementId(this.elementRef, 'solaris-range-slider'),
  );

  protected readonly labelId = computed(() => `${this.elementId()}-label`);
  protected readonly descriptionId = computed(
    () => `${this.elementId()}-description`,
  );

  protected readonly ariaDescribedBy = computed(() => {
    const ids = [...this._describedByIds()];
    if (this.descriptionText()) {
      ids.push(this.descriptionId());
    }
    return ids.length > 0 ? ids.join(' ') : null;
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

  focus(index = 0): void {
    const thumb = this.thumbElementRefs().at(index);
    if (thumb) {
      // SECURITY_EXCEPTION: programmatic focus requires the native method; no declarative alternative exists.
      thumb.nativeElement.focus();
    }
  }

  writeValue(values: number[] | null): void {
    this.values.set(this.normalizeAll(values ?? []));
  }

  registerOnChange(fn: (value: number[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }

  protected formatOne(value: number): string {
    const formatter = this.formatValue();
    if (formatter) {
      return formatter(value);
    }
    return `${value}${this.unitText()}`;
  }

  protected ariaTextOne(value: number): string {
    const builder = this.valueText();
    if (builder) {
      return builder(value);
    }
    return this.formatOne(value);
  }

  protected thumbName(index: number): string {
    // Why: a single naming source keeps SSR and client identical; labelledby
    // plus per-thumb labels would split the accessible name across nodes.
    const base = this.baseAriaLabel();
    const label = this.labelText();
    const prefix = base ?? label ?? '';
    const qualify = (thumb: string): string =>
      prefix ? `${prefix} ${thumb}` : thumb;
    const total = this.effectiveValues().length;
    if (total <= 2) {
      return qualify(
        this.translateWithDefault(
          index === 0 ? 'solaris.slider.minHandle' : 'solaris.slider.maxHandle',
          index === 0 ? 'Minimum value' : 'Maximum value',
        ),
      );
    }
    return qualify(
      this.translateWithDefault(
        'solaris.slider.thumbN',
        `Value ${index + 1} of ${total}`,
        { index: index + 1, total },
      ),
    );
  }

  protected onThumbKeydown(event: KeyboardEvent, index: number): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) {
      return;
    }
    const step = this.step() > 0 ? this.step() : 0;
    const current = this.effectiveValues();
    const value = current[index];
    if (value === undefined) {
      return;
    }
    let next: number | null = null;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = value + step;
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        next = value - step;
        break;
      case 'Home':
        next = this.min();
        break;
      case 'End':
        next = this.max();
        break;
      case 'PageUp':
        next = value + this.effectivePageStep();
        break;
      case 'PageDown':
        next = value - this.effectivePageStep();
        break;
      default:
        return;
    }
    event.preventDefault();
    this.moveThumb(index, next, false);
    this.keyDirty = true;
  }

  protected onThumbFocus(index: number): void {
    this._focused.set(true);
    this.thumbFocus.emit(index);
  }

  protected onThumbBlur(): void {
    this._focused.set(false);
    if (this.keyDirty) {
      this.keyDirty = false;
      this.valueCommit.emit([...this.effectiveValues()]);
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
    const values = this.effectiveValues();
    if (values.length === 0) {
      return;
    }
    const candidate = this.valueFromPointer(event);
    let nearest = 0;
    for (let i = 1; i < values.length; i++) {
      if (
        Math.abs(values[i] - candidate) < Math.abs(values[nearest] - candidate)
      ) {
        nearest = i;
      }
    }
    this.activeThumb.set(nearest);
    // Why: a new gesture cancels the one-shot release pop, so the thumb
    // never pops mid-drag when the pointer re-grabs it.
    this.releasedThumb.set(null);
    this.moveThumb(nearest, candidate, false);
    const track = this.trackElementRef();
    if (track) {
      try {
        // SECURITY_EXCEPTION: drag continuity requires pointer capture on the track; no declarative alternative exists.
        track.nativeElement.setPointerCapture(event.pointerId);
      } catch {
        // Why: capture is best-effort (already-released pointers throw); drag still works via move/up listeners.
      }
    }
    this.focus(nearest);
    event.preventDefault();
  }

  protected onTrackPointerMove(event: PointerEvent): void {
    const index = this.activeThumb();
    if (
      index === null ||
      this.isEffectivelyDisabled() ||
      this.readonlyInput()
    ) {
      return;
    }
    this.moveThumb(index, this.valueFromPointer(event), false);
  }

  protected onTrackPointerUp(event: PointerEvent): void {
    const index = this.activeThumb();
    if (index === null) {
      return;
    }
    this.activeThumb.set(null);
    // Why: the release pop is pointer-only (keyboard commits have no press);
    // state stays in aria-valuenow/text either way.
    this.releasedThumb.set(index);
    this.valueCommit.emit([...this.effectiveValues()]);
    this.onTouched();
    event.preventDefault();
  }

  protected onTrackPointerCancel(): void {
    this.activeThumb.set(null);
  }

  protected onThumbAnimationEnd(index: number): void {
    if (this.releasedThumb() === index) {
      this.releasedThumb.set(null);
    }
  }

  private gap(): number {
    const steps = Math.max(0, Math.floor(this.minStepsBetweenThumbs()));
    return steps === 0 || !(this.step() > 0) ? 0 : steps * this.step();
  }

  private normalizeAll(values: number[]): number[] {
    return normalizeRangeValues(
      values,
      this.min(),
      this.max(),
      this.step(),
      this.minStepsBetweenThumbs(),
      this.effectiveMaxThumbs(),
    );
  }

  private moveThumb(index: number, candidate: number, commit: boolean): void {
    const current = this.effectiveValues();
    if (index < 0 || index >= current.length) {
      return;
    }
    const gap = this.gap();
    const lo = index === 0 ? this.min() : current[index - 1] + gap;
    const hi =
      index === current.length - 1 ? this.max() : current[index + 1] - gap;
    // Why: thumbs clamp against live neighbors instead of reordering, so
    // crossing is structurally impossible and the consumer array stays sorted.
    const next = snapToStep(
      clampToRange(candidate, Math.min(lo, hi), Math.max(lo, hi)),
      this.min(),
      this.step(),
    );
    if (next === current[index]) {
      return;
    }
    // Why: the consumer array is never mutated in place; a new ordered array
    // is emitted so OnPush consumers and forms detect the change.
    const updated = [...current];
    updated[index] = next;
    this.values.set(updated);
    this.onChange([...updated]);
    if (commit) {
      this.valueCommit.emit([...updated]);
    }
  }

  private valueFromPointer(event: PointerEvent): number {
    const track = this.trackElementRef();
    if (!track) {
      return this.min();
    }
    // Why: geometry is read per gesture (never cached), so SSR construction stays DOM-free and resizes cannot go stale.
    const rect = track.nativeElement.getBoundingClientRect();
    const min = this.min();
    const max = this.max();
    if (this.orientation() === 'vertical') {
      if (rect.height <= 0) {
        return this.min();
      }
      const ratio = (rect.bottom - event.clientY) / rect.height;
      return min + ratio * (max - min);
    }
    if (rect.width <= 0) {
      return this.min();
    }
    const ratio = (event.clientX - rect.left) / rect.width;
    return min + ratio * (max - min);
  }

  private translateWithDefault(
    key: string,
    defaultText: string,
    params?: SolarisTranslateParams,
  ): string {
    const translated = this.translateService?.translate(key, params);
    if (translated === undefined || translated === null) return defaultText;
    return translated !== key ? translated : defaultText;
  }

  constructor() {
    super();
    if (isDevMode()) {
      effect(() => {
        if (!(this.max() > this.min())) {
          console.warn(
            `[SolarisRangeSlider] "max" (${this.max()}) must be greater than "min" (${this.min()}). Values are normalized defensively.`,
          );
        }
        if (!(this.step() > 0)) {
          console.warn(
            `[SolarisRangeSlider] "step" (${this.step()}) must be greater than 0. Snapping is skipped until fixed.`,
          );
        }
        if (this.maxThumbs() > SOLARIS_RANGE_SLIDER_DEFAULT_MAX_THUMBS) {
          console.warn(
            `[SolarisRangeSlider] "maxThumbs" (${this.maxThumbs()}) exceeds the v1 cap of ${SOLARIS_RANGE_SLIDER_DEFAULT_MAX_THUMBS} and is clamped.`,
          );
        }
        if (this.values().length < Math.max(2, Math.floor(this.minThumbs()))) {
          console.warn(
            `[SolarisRangeSlider] "values" needs at least ${Math.max(2, Math.floor(this.minThumbs()))} thumbs; single values belong to solaris-slider.`,
          );
        }
      });
    }
  }
}
