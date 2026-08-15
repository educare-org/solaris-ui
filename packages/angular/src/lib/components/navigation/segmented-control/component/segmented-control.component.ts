// SECURITY_EXCEPTION_FILE: nativeElement.querySelector required to find item DOM element for programmatic focus. Standard DOM method, SSR-safe with guard.
// SECURITY_EXCEPTION_FILE: nativeElement.querySelector required to measure indicator position for animation. Read-only measurement, SSR-safe.
// SECURITY_EXCEPTION_FILE: nativeElement required for ResizeObserver target. Standard DOM API, SSR-safe with typeof guard.
// SECURITY_EXCEPTION_FILE: nativeElement required for MutationObserver target. Standard DOM API, SSR-safe with typeof guard.
import {
  Component,
  input,
  output,
  model,
  contentChildren,
  computed,
  signal,
  inject,
  ChangeDetectionStrategy,
  effect,
  ElementRef,
  NgZone,
  Injector,
  forwardRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';

import { SolarisSegmentedItemComponent } from '../item/segmented-item.component';
import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisThemeService } from '../../../../services/theme';
import { nextIdFor } from '../../../../core';

import {
  SOLARIS_SEGMENTED_CONTROL,
  type SolarisSegmentedControlInterface,
} from '../token/segmented-control.tokens';

import type {
  SolarisSegmentedControlOrientation,
  SolarisSegmentedControlAppearance,
  SolarisSegmentedControlSize,
  SolarisSegmentedControlDensity,
  SolarisSegmentedControlRadius,
  SolarisSegmentedControlChangeEvent,
} from '../model/segmented-control.types';

@Component({
  selector: 'solaris-segmented-control',
  standalone: true,
  imports: [],
  templateUrl: './segmented-control.component.html',
  styleUrls: ['./segmented-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-segmented-control',
    role: 'radiogroup',
    '[attr.data-size]': 'size()',
    '[attr.data-radius]': 'radius()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-invalid]': 'invalid() || undefined',
    '[attr.data-readonly]': 'readonly() || undefined',
    '[attr.aria-required]': 'required() || undefined',
    '[attr.data-full-width]': 'fullWidth() || undefined',
    '[attr.data-equal-width]': 'equalWidth() || undefined',
    '[attr.aria-label]': 'resolvedAriaLabel() || undefined',
    '[attr.data-show-indicator]': 'indicator() || undefined',
    '[attr.aria-labelledby]': 'ariaLabelledby() || undefined',
    '[attr.data-disabled]': 'isEffectivelyDisabled() || undefined',
    '[attr.aria-disabled]': 'isEffectivelyDisabled() || undefined',
    '[attr.aria-invalid]':
      'invalid() || (required() && touched() && !hasValue()) ? "true" : undefined',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SolarisSegmentedControlComponent),
      multi: true,
    },
    {
      provide: SOLARIS_SEGMENTED_CONTROL,
      useExisting: SolarisSegmentedControlComponent,
    },
  ],
})
export class SolarisSegmentedControlComponent
  implements
    SolarisSegmentedControlInterface,
    ControlValueAccessor,
    AfterViewInit,
    OnDestroy
{
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });
  protected readonly themeService = inject(SolarisThemeService);
  private readonly elementRef = inject(ElementRef);
  private readonly injector = inject(Injector);
  private readonly ngZone = inject(NgZone);

  readonly items = contentChildren(SolarisSegmentedItemComponent);

  readonly invalid = input<boolean>(false);
  readonly indicator = input<boolean>(true);
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly fullWidth = input<boolean>(false);
  readonly equalWidth = input<boolean>(false);
  readonly value = model<unknown>(undefined);
  readonly defaultValue = input<unknown>(undefined);
  readonly compareFn = computed(() => this.compareWith());
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelKey = input<string | undefined>(undefined);
  readonly ariaLabelledby = input<string | undefined>(undefined);
  readonly size = input<SolarisSegmentedControlSize>('md');
  readonly radius = input<SolarisSegmentedControlRadius>('md');
  readonly compareWith = input<(a: unknown, b: unknown) => boolean>(Object.is);
  readonly density = input<SolarisSegmentedControlDensity>();
  readonly appearance = input<SolarisSegmentedControlAppearance>('surface');
  readonly orientation =
    input<SolarisSegmentedControlOrientation>('horizontal');

  readonly valueChange = output<unknown>();
  readonly segmentedChange = output<SolarisSegmentedControlChangeEvent>();

  protected readonly instanceId = nextIdFor('solaris-segmented-control');
  protected readonly touched = signal(false);
  protected readonly indicatorWidth = signal('0');
  protected readonly indicatorHeight = signal('0');
  protected readonly indicatorReady = signal(false);
  protected readonly internalDisabled = signal(false);
  protected readonly indicatorTransformX = signal('translateX(0)');
  protected readonly indicatorTransformY = signal('translateY(0)');

  private onChange: (value: unknown) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  private resizeObserver: ResizeObserver | null = null;
  private contentObserver: MutationObserver | null = null;

  protected readonly isEffectivelyDisabled = computed(() => {
    return this.disabled() || this.internalDisabled();
  });

  readonly effectiveDensity = computed(() => {
    return this.density() ?? this.themeService.density;
  });

  protected readonly hasValue = computed(() => {
    return this.value() !== undefined && this.value() !== null;
  });

  protected readonly resolvedAriaLabel = computed(() => {
    if (this.ariaLabel()) return this.ariaLabel();
    const ariaLabelKey = this.ariaLabelKey();
    if (ariaLabelKey && this.translateService) {
      return this.translateService.translate(ariaLabelKey);
    }
    return ariaLabelKey ?? undefined;
  });

  constructor() {
    effect(() => {
      const defaultValue = this.defaultValue();
      const currentValue = this.value();
      if (currentValue === undefined && defaultValue !== undefined) {
        this.value.set(defaultValue);
      }
    });
  }

  ngAfterViewInit(): void {
    this.setupIndicatorMeasurement();

    effect(
      () => {
        this.value();
        this.appearance();
        this.orientation();
        this.size();
        this.density();
        this.radius();
        this.ngZone.runOutsideAngular(() => {
          requestAnimationFrame(() => this.measureIndicator());
        });
      },
      { injector: this.injector },
    );
  }

  ngOnDestroy(): void {
    this.disconnectObserver();
  }

  selectItem(item: SolarisSegmentedItemComponent): void {
    if (this.isEffectivelyDisabled()) return;
    if (this.readonly()) return;
    const previousValue = this.value();
    const newValue = item.value();
    if (this.compareFn()(newValue, previousValue)) return;
    this.value.set(newValue);
    this.valueChange.emit(newValue);
    this.segmentedChange.emit({ value: newValue, previousValue });
    this.onChange(newValue);
    this.markAsTouched();
  }

  focusItem(item: SolarisSegmentedItemComponent): void {
    const nativeElement = this.elementRef.nativeElement as HTMLElement;
    const itemElements = nativeElement.querySelectorAll(
      'solaris-segmented-item',
    ) as NodeListOf<HTMLElement>;
    const items = this.items();
    const index = items.indexOf(item);
    if (index >= 0 && itemElements[index]) {
      itemElements[index].focus();
    }
  }

  // ControlValueAccessor
  writeValue(safe: unknown): void {
    this.value.set(safe);
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => this.measureIndicator());
    });
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.internalDisabled.set(isDisabled);
  }

  private markAsTouched(): void {
    if (!this.touched()) {
      this.touched.set(true);
      this.onTouched();
    }
  }

  private measureIndicator(): void {
    if (!this.indicator()) return;

    const nativeEl = this.elementRef.nativeElement as HTMLElement;
    const container = nativeEl.querySelector(
      '.solaris-segmented-control__container',
    ) as HTMLElement | null;
    if (!container) return;

    const selectedItem = container.querySelector(
      'solaris-segmented-item[data-selected="true"]',
    ) as HTMLElement | null;
    if (!selectedItem) return;

    const isVertical = this.orientation() === 'vertical';

    if (isVertical) {
      this.indicatorTransformY.set(`translateY(${selectedItem.offsetTop}px)`);
      this.indicatorHeight.set(`${selectedItem.offsetHeight}px`);
    } else {
      this.indicatorTransformX.set(`translateX(${selectedItem.offsetLeft}px)`);
      this.indicatorWidth.set(`${selectedItem.offsetWidth}px`);
    }

    if (!this.indicatorReady()) {
      requestAnimationFrame(() => this.indicatorReady.set(true));
    }
  }

  private setupIndicatorMeasurement(): void {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.ngZone.runOutsideAngular(() => {
          requestAnimationFrame(() => this.measureIndicator());
        });
      });
      const nativeEl = this.elementRef.nativeElement as HTMLElement;
      this.resizeObserver.observe(nativeEl);
    }

    if (typeof MutationObserver !== 'undefined') {
      const nativeEl = this.elementRef.nativeElement as HTMLElement;
      this.contentObserver = new MutationObserver(() => {
        this.ngZone.runOutsideAngular(() => {
          requestAnimationFrame(() => this.measureIndicator());
        });
      });
      this.contentObserver.observe(nativeEl, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => this.measureIndicator());
    });
  }

  private disconnectObserver(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.contentObserver?.disconnect();
    this.contentObserver = null;
  }
}
