// root to move focus between SVG slices. No innerHTML is used; style writes
// target only presentation attributes of the component's own SVG.
import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { SolarisThemeService } from '../../../../../services/theme';
import { SolarisTranslateService } from '../../../../../services/translation';
import {
  groupSmallChartSlices,
  visibleChartSeries,
} from '../../model/chart-scale.utils';
import { resolveChartFallback } from '../../model/strings/chart-strings';
import type {
  SolarisChartSeries,
  SolarisChartSlice,
} from '../../model/chart.types';
import {
  SOLARIS_GAUGE_CHART_HEIGHT,
  SOLARIS_GAUGE_CHART_RADIUS,
  SOLARIS_GAUGE_CHART_STROKE,
  SOLARIS_GAUGE_CHART_WIDTH,
  SOLARIS_PIE_CHART_DONUT_RATIO,
  SOLARIS_PIE_CHART_GRADIENT_RADIUS_RATIO,
  SOLARIS_PIE_ENTER_GAUGE_DURATION_MS,
  buildGaugeGeometry,
  buildPieChartFrame,
  easeOutCubic,
  gaugeAnchorPoint,
  gaugeArcPath,
  gaugeTargetTick,
  pieEnterTotalMs,
  pieSliceAnchorPoint,
  pieSliceEnterProgress,
  pieSliceLabelPosition,
  pieSlicePath,
  pieTooltipSide,
  seriesToPieSlices,
} from '../model/chart-pie.utils';
import type {
  SolarisPieChartDensity,
  SolarisPieChartSize,
  SolarisPieChartValueFormatter,
  SolarisPieChartVariant,
} from '../model/chart-pie.types';

interface SolarisPieChartFocusMark {
  readonly id: string;
  readonly position: number;
}

let solarisPieChartInstanceCount = 0;

function nextSolarisPieChartInstanceId(): number {
  solarisPieChartInstanceCount += 1;
  return solarisPieChartInstanceCount;
}

@Component({
  selector: 'solaris-pie-chart',
  standalone: true,
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-pie-chart',
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-entering]': 'entering() ? "" : null',
  },
})
export class SolarisPieChartComponent implements OnDestroy {
  readonly series = input<readonly SolarisChartSeries[]>([]);
  readonly slices = input<readonly SolarisChartSlice[] | undefined>(undefined);
  readonly locale = input.required<string>();
  readonly variant = input<SolarisPieChartVariant>('pie');
  readonly centerValue = input<string | undefined>(undefined);
  readonly centerLabel = input<string | undefined>(undefined);
  readonly minSlicePercent = input<number>(0.02);
  readonly showValues = input(false);
  readonly gaugeMin = input<number>(0);
  readonly gaugeMax = input<number>(100);
  readonly gaugeTarget = input<number | undefined>(undefined);
  readonly valueFormat = input<SolarisPieChartValueFormatter | undefined>(
    undefined,
  );
  readonly size = input<SolarisPieChartSize>('md');
  readonly density = input<SolarisPieChartDensity | undefined>(undefined);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelKey = input<string | undefined>(undefined);

  readonly sliceSelect = output<string>();

  private readonly platformId = inject(PLATFORM_ID);
  private readonly elementRef = inject(ElementRef);
  protected readonly themeService = inject(SolarisThemeService);
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });

  protected readonly gradientPrefix = `solaris-pie-chart-${nextSolarisPieChartInstanceId()}`;

  protected readonly hoveredId = signal<string | null>(null);
  private readonly selectedId = signal<string | null>(null);
  private readonly focusedId = signal<string | null>(null);
  protected readonly enterElapsed = signal(Number.POSITIVE_INFINITY);
  private enterRaf: number | null = null;
  private lastEnterKey: string | null = null;

  private readonly enterEffect = effect(() => {
    const key = this.enterKey();
    if (this.lastEnterKey === key) return;
    this.lastEnterKey = key;
    this.startEnter();
  });

  protected readonly isBrowser = computed(() =>
    isPlatformBrowser(this.platformId),
  );

  protected readonly effectiveDensity = computed(() => {
    return this.density() ?? this.themeService.density;
  });

  protected readonly rawSlices = computed<readonly SolarisChartSlice[]>(() => {
    const direct = this.slices();
    if (direct !== undefined) return [...direct];
    return seriesToPieSlices(visibleChartSeries(this.series()));
  });

  protected readonly groupedSlices = computed<SolarisChartSlice[]>(() => {
    const raw = this.rawSlices();
    const percent = this.minSlicePercent();
    const fraction = Number.isFinite(percent) ? percent / 100 : 0;
    return groupSmallChartSlices(
      raw,
      fraction,
      this.translate('solaris.chart.others', {}),
    );
  });

  protected readonly frame = computed(() =>
    buildPieChartFrame(this.groupedSlices(), {
      innerRatio:
        this.variant() === 'donut' ? SOLARIS_PIE_CHART_DONUT_RATIO : 0,
    }),
  );

  protected readonly gauge = computed(() => {
    if (this.variant() !== 'gauge') return null;
    const first = this.groupedSlices()[0];
    const colorVar = this.frame().slices[0]?.colorVar;
    return buildGaugeGeometry(
      first?.value ?? Number.NaN,
      this.gaugeMin(),
      this.gaugeMax(),
      this.gaugeTarget(),
      colorVar,
    );
  });

  protected readonly isEmpty = computed(() => {
    if (this.variant() === 'gauge') return this.groupedSlices().length === 0;
    return this.frame().slices.length === 0;
  });

  protected readonly enterKey = computed(() => {
    const data = this.groupedSlices()
      .map((slice) => `${slice.id}:${slice.value}`)
      .join('|');
    return `${data}|${this.minSlicePercent()}|${this.gaugeMin()}|${this.gaugeMax()}|${this.gaugeTarget() ?? ''}`;
  });

  protected readonly enterTotalMs = computed(() =>
    Math.max(
      pieEnterTotalMs(this.frame().slices.length),
      SOLARIS_PIE_ENTER_GAUGE_DURATION_MS,
    ),
  );

  protected readonly entering = computed(
    () => this.enterElapsed() < this.enterTotalMs(),
  );

  protected readonly displayFrame = computed(() => {
    const target = this.frame();
    const total = this.enterTotalMs();
    const elapsed = this.enterElapsed();
    if (elapsed >= total || target.slices.length === 0) return target;
    const slices = target.slices.map((slice, position) => {
      const progress = pieSliceEnterProgress(elapsed, position);
      if (progress >= 1) return slice;
      const endAngle =
        slice.startAngle + (slice.endAngle - slice.startAngle) * progress;
      return {
        ...slice,
        endAngle: Math.round(endAngle * 100) / 100,
        path: pieSlicePath(
          target.centerX,
          target.centerY,
          target.radius,
          target.innerRadius,
          slice.startAngle,
          endAngle,
        ),
      };
    });
    return { ...target, slices };
  });

  protected readonly displayGauge = computed(() => {
    const gauge = this.gauge();
    if (!gauge) return null;
    const elapsed = this.enterElapsed();
    if (elapsed >= SOLARIS_PIE_ENTER_GAUGE_DURATION_MS) return gauge;
    const progress = easeOutCubic(
      elapsed / SOLARIS_PIE_ENTER_GAUGE_DURATION_MS,
    );
    const center = this.gaugeCenter();
    return {
      ...gauge,
      fraction: gauge.fraction * progress,
      valuePath: gaugeArcPath(
        center.x,
        center.y,
        SOLARIS_GAUGE_CHART_RADIUS,
        0,
        gauge.fraction * progress,
      ),
    };
  });

  protected readonly viewWidth = computed(() =>
    this.variant() === 'gauge' ? SOLARIS_GAUGE_CHART_WIDTH : this.frame().width,
  );

  protected readonly viewHeight = computed(() =>
    this.variant() === 'gauge'
      ? SOLARIS_GAUGE_CHART_HEIGHT
      : this.frame().height,
  );

  protected readonly gaugeCenter = computed(() => ({
    x: SOLARIS_GAUGE_CHART_WIDTH / 2,
    y: SOLARIS_GAUGE_CHART_HEIGHT - SOLARIS_GAUGE_CHART_STROKE,
  }));

  protected readonly gaugeTargetTick = computed(() => {
    const gauge = this.gauge();
    const targetAngle = gauge?.targetAngle;
    if (targetAngle === null || targetAngle === undefined) return null;
    const center = this.gaugeCenter();
    return gaugeTargetTick(
      center.x,
      center.y,
      SOLARIS_GAUGE_CHART_RADIUS,
      targetAngle,
    );
  });

  protected readonly resolvedValueFormat = computed(() => {
    const custom = this.valueFormat();
    if (custom !== undefined) return custom;
    const formatter = new Intl.NumberFormat(this.locale(), {
      notation: 'compact',
    });
    return (value: number): string => formatter.format(value);
  });

  protected formatSliceValue(value: number): string {
    return this.resolvedValueFormat()(value);
  }

  protected formatPercent(fraction: number): string {
    return new Intl.NumberFormat(this.locale(), {
      style: 'percent',
      maximumFractionDigits: 1,
    }).format(fraction);
  }

  protected readonly summary = computed(() => {
    if (this.ariaLabel() !== undefined) return this.ariaLabel();
    if (this.ariaLabelKey() !== undefined) {
      return this.translate(this.ariaLabelKey() as string, {});
    }
    const gauge = this.gauge();
    if (this.variant() === 'gauge' && gauge) {
      const first = this.groupedSlices()[0];
      const formatted = this.formatSliceValue(gauge.value);
      const target =
        gauge.target === null
          ? ''
          : `, ${this.translate('solaris.chart.total', {})} ${this.formatSliceValue(gauge.target)}`;
      return `${first?.label ?? ''}: ${formatted}${target}`;
    }
    const totalLabel = this.translate('solaris.chart.total', {});
    const total = this.formatSliceValue(this.frame().total);
    const parts = this.frame().slices.map(
      (slice) => `${slice.label}: ${this.formatPercent(slice.fraction)}`,
    );
    return [`${totalLabel}: ${total}`, ...parts].join('; ');
  });

  protected readonly focusMarks = computed<SolarisPieChartFocusMark[]>(() =>
    this.frame().slices.map((slice, position) => ({
      id: slice.id,
      position,
    })),
  );

  protected readonly centerDisplay = computed(() => {
    const total = this.translate('solaris.chart.total', {});
    return {
      value: this.centerValue() ?? this.formatSliceValue(this.frame().total),
      label: this.centerLabel() ?? total,
    };
  });

  protected readonly tooltip = computed(() => {
    const id = this.hoveredId() ?? this.focusedId();
    if (id === null || this.isEmpty()) return null;
    const slice = this.frame().slices.find((entry) => entry.id === id);
    const gauge = this.gauge();
    if (this.variant() === 'gauge' && gauge) {
      const first = this.frame().slices[0];
      if (first?.id !== id) return null;
      const center = this.gaugeCenter();
      const anchor = gaugeAnchorPoint(
        center.x,
        center.y,
        SOLARIS_GAUGE_CHART_RADIUS,
        gauge.fraction,
      );
      return {
        id,
        label: first.label,
        formattedValue: this.formatSliceValue(gauge.value),
        percent: this.formatPercent(gauge.fraction),
        total: null as string | null,
        totalLabel: this.translate('solaris.chart.total', {}),
        leftPercent: clampPercent((anchor.x / SOLARIS_GAUGE_CHART_WIDTH) * 100),
        topPercent: clampPercent((anchor.y / SOLARIS_GAUGE_CHART_HEIGHT) * 100),
        side: pieTooltipSide(270 + gauge.fraction * 180),
      };
    }
    if (!slice) return null;
    const frame = this.frame();
    const anchor = pieSliceAnchorPoint(
      frame.centerX,
      frame.centerY,
      frame.radius,
      slice.startAngle,
      slice.endAngle,
    );
    return {
      id: slice.id,
      label: slice.label,
      formattedValue: this.formatSliceValue(slice.value),
      percent: this.formatPercent(slice.fraction),
      total:
        frame.slices.length > 1 ? this.formatSliceValue(frame.total) : null,
      totalLabel: this.translate('solaris.chart.total', {}),
      leftPercent: clampPercent((anchor.x / frame.width) * 100),
      topPercent: clampPercent((anchor.y / frame.height) * 100),
      side: pieTooltipSide((slice.startAngle + slice.endAngle) / 2),
    };
  });

  protected gradientId(sliceId: string): string {
    return `${this.gradientPrefix}-${sliceId}`;
  }

  protected sliceGradient(sliceId: string): {
    readonly x: number;
    readonly y: number;
    readonly r: number;
  } {
    const frame = this.frame();
    const slice = frame.slices.find((entry) => entry.id === sliceId);
    const center = slice
      ? pieSliceLabelPosition(
          frame.centerX,
          frame.centerY,
          frame.radius,
          frame.innerRadius,
          slice.startAngle,
          slice.endAngle,
        )
      : { x: frame.centerX, y: frame.centerY };
    return {
      ...center,
      r: Math.max(1, frame.radius * SOLARIS_PIE_CHART_GRADIENT_RADIUS_RATIO),
    };
  }

  protected sliceEnterProgressFor(sliceId: string): number {
    const elapsed = this.enterElapsed();
    if (elapsed >= this.enterTotalMs()) return 1;
    const position = this.focusMarks().findIndex((mark) => mark.id === sliceId);
    if (position === -1) return 1;
    return pieSliceEnterProgress(elapsed, position);
  }

  protected labelPosition(sliceId: string): {
    readonly x: number;
    readonly y: number;
  } | null {
    if (!this.labelShown(sliceId)) return null;
    const frame = this.displayFrame();
    const slice = frame.slices.find((entry) => entry.id === sliceId);
    if (!slice || slice.fraction < 0.05) return null;
    return pieSliceLabelPosition(
      frame.centerX,
      frame.centerY,
      frame.radius,
      frame.innerRadius,
      slice.startAngle,
      slice.endAngle,
    );
  }

  protected labelShown(sliceId: string): boolean {
    return this.showValues() && this.sliceEnterProgressFor(sliceId) >= 1;
  }

  protected markTabIndex(id: string): number {
    const focused = this.focusedId();
    if (focused === null) {
      return this.focusMarks()[0]?.id === id ? 0 : -1;
    }
    return focused === id ? 0 : -1;
  }

  protected isMarkActive(id: string): boolean {
    const hovered = this.hoveredId();
    if (hovered !== null) return hovered === id;
    const selected = this.selectedId();
    if (selected !== null) return selected === id;
    return this.focusedId() === id;
  }

  protected isMarkDimmed(id: string): boolean {
    const hovered = this.hoveredId();
    if (hovered === null) return false;
    return hovered !== id;
  }

  protected sliceAriaLabel(id: string): string {
    const slice = this.frame().slices.find((entry) => entry.id === id);
    if (!slice) return id;
    return `${slice.label}: ${this.formatSliceValue(slice.value)} (${this.formatPercent(slice.fraction)})`;
  }

  protected gaugeAriaLabel(): string {
    const gauge = this.gauge();
    const first = this.frame().slices[0];
    if (!gauge || !first) return '';
    const target =
      gauge.target === null
        ? ''
        : `, ${this.translate('solaris.chart.total', {})} ${this.formatSliceValue(gauge.target)}`;
    return `${first.label}: ${this.formatSliceValue(gauge.value)}${target}`;
  }

  protected onSliceHover(id: string): void {
    this.hoveredId.set(id);
  }

  protected onSlicesLeave(): void {
    this.hoveredId.set(null);
  }

  protected onSliceFocus(id: string): void {
    this.focusedId.set(id);
    this.hoveredId.set(id);
  }

  protected onSliceBlur(): void {
    this.focusedId.set(null);
    this.hoveredId.set(null);
  }

  protected onSliceActivate(id: string): void {
    this.selectedId.set(id);
    this.sliceSelect.emit(id);
  }

  protected onSliceKeydown(event: KeyboardEvent, id: string): void {
    const marks = this.focusMarks();
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onSliceActivate(id);
      return;
    }
    const position = marks.findIndex((mark) => mark.id === id);
    if (position === -1) return;
    let next: number | null = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      next = Math.min(position + 1, marks.length - 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      next = Math.max(position - 1, 0);
    } else if (event.key === 'Home') {
      next = 0;
    } else if (event.key === 'End') {
      next = marks.length - 1;
    }
    if (next === null || next === position) return;
    const target = marks[next];
    if (!target) return;
    event.preventDefault();
    this.focusedId.set(target.id);
    this.hoveredId.set(target.id);
    const native = this.elementRef.nativeElement as HTMLElement;
    native
      .querySelector<SVGGraphicsElement>(`[data-slice="${target.id}"]`)
      ?.focus();
  }

  protected emptyTitle(): string {
    return this.translate('solaris.chart.emptyTitle', {});
  }

  protected emptyMessage(): string {
    return this.translate('solaris.chart.emptyMessage', {});
  }

  ngOnDestroy(): void {
    this.cancelEnter();
  }

  private startEnter(): void {
    this.cancelEnter();
    if (
      !this.isBrowser() ||
      typeof requestAnimationFrame === 'undefined' ||
      this.prefersReducedMotion()
    ) {
      this.enterElapsed.set(this.enterTotalMs());
      return;
    }
    this.enterElapsed.set(0);
    const origin = this.nowMs();
    const step = (stamp: number): void => {
      const elapsed = stamp - origin;
      if (elapsed >= this.enterTotalMs()) {
        this.enterElapsed.set(this.enterTotalMs());
        this.enterRaf = null;
        return;
      }
      this.enterElapsed.set(elapsed);
      this.enterRaf = requestAnimationFrame(step);
    };
    this.enterRaf = requestAnimationFrame(step);
  }

  private cancelEnter(): void {
    if (this.enterRaf !== null && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.enterRaf);
      this.enterRaf = null;
    }
  }

  private prefersReducedMotion(): boolean {
    if (typeof matchMedia === 'undefined') return false;
    return matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  private nowMs(): number {
    if (typeof performance !== 'undefined') return performance.now();
    return Date.now();
  }

  private translate(key: string, params: Record<string, string>): string {
    const service = this.translateService;
    if (service) return service.translate(key, params);
    return resolveChartFallback(this.locale(), key, params);
  }
}

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 50;
  return Math.min(86, Math.max(14, value));
}
