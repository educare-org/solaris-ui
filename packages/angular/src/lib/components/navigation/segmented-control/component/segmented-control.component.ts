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
  PLATFORM_ID,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
  SolarisSegmentedControlSelectedEdge,
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
    '[attr.data-invalid]': 'isInvalid() || undefined',
    '[attr.data-readonly]': 'readonly() || undefined',
    '[attr.aria-required]': 'required() || undefined',
    '[attr.data-full-width]': 'fullWidth() || undefined',
    '[attr.data-equal-width]': 'equalWidth() || undefined',
    '[attr.aria-label]': 'resolvedAriaLabel() || undefined',
    '[attr.data-show-indicator]': 'indicator() || undefined',
    '[attr.data-selected-edge]': 'selectedEdge()',
    '[attr.aria-labelledby]': 'ariaLabelledby() || undefined',
    '[attr.aria-invalid]': 'isInvalid() ? "true" : undefined',
    '[attr.data-disabled]': 'isEffectivelyDisabled() || undefined',
    '[attr.aria-disabled]': 'isEffectivelyDisabled() || undefined',
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
  private readonly platformId = inject(PLATFORM_ID);
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
  readonly density = input<SolarisSegmentedControlDensity | undefined>(
    undefined,
  );
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

  protected readonly selectedEdge = computed<
    SolarisSegmentedControlSelectedEdge | undefined
  >(() => {
    const items = this.items();
    if (items.length === 0) {
      return undefined;
    }
    const compare = this.compareFn();
    const current = this.value();
    const index = items.findIndex((item) => compare(item.value(), current));
    if (index === -1) {
      return undefined;
    }
    const isFirst = index === 0;
    const isLast = index === items.length - 1;
    if (isFirst && isLast) {
      return 'both';
    }
    if (isFirst) {
      return 'first';
    }
    if (isLast) {
      return 'last';
    }
    return undefined;
  });

  protected readonly hasValue = computed(() => {
    return this.value() !== undefined && this.value() !== null;
  });

  protected readonly isInvalid = computed(() => {
    return (
      this.invalid() || (this.required() && this.touched() && !this.hasValue())
    );
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
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.setupIndicatorMeasurement();

    effect(
      () => {
        this.value();
        this.appearance();
        this.orientation();
        this.size();
        this.effectiveDensity();
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

  writeValue(safe: unknown): void {
    this.value.set(safe);
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
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

    const containerRect = container.getBoundingClientRect();
    const itemRect = selectedItem.getBoundingClientRect();
    const borderLeft = container.clientLeft;
    const borderTop = container.clientTop;

    if (isVertical) {
      const offsetY = itemRect.top - containerRect.top - borderTop;
      this.indicatorTransformY.set(`translateY(${offsetY}px)`);
      this.indicatorHeight.set(`${itemRect.height}px`);
    } else {
      const offsetX = itemRect.left - containerRect.left - borderLeft;
      this.indicatorTransformX.set(`translateX(${offsetX}px)`);
      this.indicatorWidth.set(`${itemRect.width}px`);
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
        attributes: true,
        attributeFilter: ['data-selected', 'class', 'style'],
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
