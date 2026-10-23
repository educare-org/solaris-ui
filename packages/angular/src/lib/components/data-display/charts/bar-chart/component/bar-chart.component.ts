// target to measure content size for x-label thinning and as a scoped query
// root to move focus between SVG bars. No innerHTML is used; style writes
// target only presentation attributes of the component's own SVG. SSR-safe
// via isPlatformBrowser and typeof guards.
import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
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
  SOLARIS_BAR_CHART_HEIGHT,
  SOLARIS_BAR_CHART_WIDTH,
  barChartValuePosition,
  buildBarChartFrame,
  resolveBarLabelEvery,
  resolveMorphSeriesDelay,
  roundedBarPath,
  truncateBarCategoryLabel,
} from '../model/chart-bar.utils';
import { solarisChartColorVar } from '../../model/chart-palette';
import { visibleChartSeries } from '../../model/chart-scale.utils';
import { resolveChartFallback } from '../../model/strings/chart-strings';
import type {
  SolarisChartReferenceLine,
  SolarisChartSeries,
} from '../../model/chart.types';
import type {
  SolarisBarChartBarGeometry,
  SolarisBarChartDensity,
  SolarisBarChartLayout,
  SolarisBarChartOrientation,
  SolarisBarChartPointEvent,
  SolarisBarChartSize,
  SolarisBarChartTooltip,
  SolarisBarChartValueFormatter,
} from '../model/chart-bar.types';

interface SolarisBarChartFocusMark {
  readonly seriesId: string;
  readonly index: number;
  readonly position: number;
}

let solarisBarChartInstanceCount = 0;

const SOLARIS_BAR_CHART_MIN_CATEGORY_WIDTH = 26;
const SOLARIS_BAR_CHART_DENSE_THRESHOLD = 12;
const SOLARIS_BAR_CHART_ROW_HEIGHT = 44;
const SOLARIS_BAR_CHART_MAX_HEIGHT = 560;

@Component({
  selector: 'solaris-bar-chart',
  standalone: true,
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-bar-chart',
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-layout]': 'layout()',
    '[style.--solaris-bar-chart-bar-radius]': 'barRadiusStyle()',
    '[attr.data-morphing]': 'morphing() ? "" : null',
  },
})
export class SolarisBarChartComponent implements AfterViewInit, OnDestroy {
  readonly series = input.required<readonly SolarisChartSeries[]>();
  readonly locale = input.required<string>();
  readonly orientation = input<SolarisBarChartOrientation>('vertical');
  readonly layout = input<SolarisBarChartLayout>('grouped');
  readonly barRadius = input<number | undefined>(undefined);
  readonly referenceLines = input<readonly SolarisChartReferenceLine[]>([]);
  readonly xLabels = input<readonly string[] | undefined>(undefined);
  readonly valueFormat = input<SolarisBarChartValueFormatter | undefined>(
    undefined,
  );
  readonly showValues = input(false);
  readonly size = input<SolarisBarChartSize>('md');
  readonly density = input<SolarisBarChartDensity | undefined>(undefined);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelKey = input<string | undefined>(undefined);

  readonly pointSelect = output<SolarisBarChartPointEvent>();

  private readonly platformId = inject(PLATFORM_ID);
  private readonly elementRef = inject(ElementRef);
  private readonly ngZone = inject(NgZone);
  protected readonly themeService = inject(SolarisThemeService);
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });

  protected readonly gradientPrefix = `solaris-bar-chart-${(solarisBarChartInstanceCount += 1)}`;

  private resizeObserver: ResizeObserver | null = null;
  private morphRaf: number | null = null;
  private morphGrowTimer: ReturnType<typeof setTimeout> | null = null;
  private morphPhaseMs = 300;
  private previousLayoutState: string | null = null;
  protected readonly morphing = signal(false);
  protected readonly morphGrow = signal(false);
  private readonly measuredWidth = signal<number | null>(null);
  private readonly measuredHeight = signal<number | null>(null);
  protected readonly hoveredIndex = signal<number | null>(null);
  protected readonly hoveredMark = signal<{
    seriesId: string;
    index: number;
  } | null>(null);

  private readonly guideIndex = signal(0);
  private readonly guideVisible = signal(false);
  private guideRaf: number | null = null;

  private readonly selectedMark = signal<{
    seriesId: string;
    index: number;
  } | null>(null);
  private readonly focusedMark = signal<{
    seriesId: string;
    index: number;
    position: number;
  } | null>(null);

  // Collapses every bar onto its own base (without transition) on layout or
  // orientation switches, then releases them so the `d` transition regrows
  // each bar from zero directly at its new position instead of sliding
  // across the chart. Stacked segments grow strictly inside their final
  // span, so they never cross over each other mid-morph. The collapsed state
  // is painted for one frame through a double requestAnimationFrame before
  // growing.
  private readonly layoutMorphEffect = effect(() => {
    const state = `${this.layout()}:${this.orientation()}`;
    const previous = this.previousLayoutState;
    this.previousLayoutState = state;
    if (previous === null || previous === state) return;
    this.startLayoutMorph();
  });

  // Parses a CSS motion duration (e.g. "300ms", "0.3s") into milliseconds.
  private parseMotionDurationMs(raw: string): number | null {
    const match = /^\s*([\d.]+)\s*(ms|s)?\s*$/i.exec(raw);
    if (!match) return null;
    const value = Number(match[1]);
    if (!Number.isFinite(value) || value < 0) return null;
    return match[2]?.toLowerCase() === 's' ? value * 1000 : value;
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (typeof ResizeObserver === 'undefined') return;
    const native = this.elementRef.nativeElement as HTMLElement;
    this.resizeObserver = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      const width = rect?.width ?? native.clientWidth ?? null;
      const height = rect?.height ?? native.clientHeight ?? null;
      this.ngZone.run(() => {
        this.measuredWidth.set(width);
        this.measuredHeight.set(height);
      });
    });
    this.resizeObserver.observe(native);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    if (this.morphRaf !== null && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.morphRaf);
      this.morphRaf = null;
    }
    if (this.morphGrowTimer !== null) {
      clearTimeout(this.morphGrowTimer);
      this.morphGrowTimer = null;
    }
    if (this.guideRaf !== null && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.guideRaf);
      this.guideRaf = null;
    }
  }

  protected readonly effectiveDensity = computed(() => {
    return this.density() ?? this.themeService.density;
  });

  protected readonly barRadiusStyle = computed(() => {
    const radius = this.barRadius();
    if (radius === undefined || !Number.isFinite(radius) || radius < 0) {
      return null;
    }
    return `${radius}px`;
  });

  protected readonly visibleSeries = computed(() =>
    visibleChartSeries(this.series()),
  );

  protected readonly isEmpty = computed(() => {
    if (this.visibleSeries().length === 0) return true;
    return this.frame().series.every((row) => row.bars.length === 0);
  });

  protected emptyTitle(): string {
    return this.translate('solaris.chart.emptyTitle', {});
  }

  protected emptyMessage(): string {
    return this.translate('solaris.chart.emptyMessage', {});
  }

  protected readonly frame = computed(() => {
    const orientation = this.orientation();
    const count = Math.max(
      this.visibleSeries().reduce(
        (max, entry) => Math.max(max, entry.points.length),
        0,
      ),
      this.resolvedXLabels().length,
    );
    const height =
      orientation === 'horizontal'
        ? Math.min(
            SOLARIS_BAR_CHART_MAX_HEIGHT,
            Math.max(
              SOLARIS_BAR_CHART_HEIGHT,
              count * SOLARIS_BAR_CHART_ROW_HEIGHT + 96,
            ),
          )
        : SOLARIS_BAR_CHART_HEIGHT;
    return buildBarChartFrame(this.visibleSeries(), {
      orientation,
      layout: this.layout(),
      height,
    });
  });

  protected readonly minSvgWidth = computed(() => {
    if (this.orientation() !== 'vertical') return null;
    const count = this.resolvedXLabels().length;
    if (count < SOLARIS_BAR_CHART_DENSE_THRESHOLD) return null;
    return count * SOLARIS_BAR_CHART_MIN_CATEGORY_WIDTH;
  });

  protected readonly resolvedValueFormat = computed(() => {
    const custom = this.valueFormat();
    if (custom !== undefined) return custom;
    const formatter = new Intl.NumberFormat(this.locale(), {
      notation: 'compact',
    });
    return (value: number): string => formatter.format(value);
  });

  protected readonly resolvedXLabels = computed(() => {
    const custom = this.xLabels();
    if (custom !== undefined) return [...custom];
    const first = this.visibleSeries()[0];
    if (!first) return [];
    return first.points.map((point) => point.label ?? `${point.x}`);
  });

  protected readonly labelEvery = computed(() => {
    const horizontal = this.orientation() === 'horizontal';
    const available = horizontal
      ? (this.measuredHeight() ?? SOLARIS_BAR_CHART_HEIGHT)
      : (this.measuredWidth() ?? SOLARIS_BAR_CHART_WIDTH);
    return resolveBarLabelEvery(this.resolvedXLabels().length, available);
  });

  protected readonly summary = computed(() => {
    if (this.ariaLabel() !== undefined) return this.ariaLabel();
    if (this.ariaLabelKey() !== undefined) {
      return this.translate(this.ariaLabelKey() as string, {});
    }
    const parts = this.visibleSeries().map((entry) => {
      const plottable = entry.points.filter(
        (point) => typeof point.y === 'number' && Number.isFinite(point.y),
      );
      const peak =
        plottable.length === 0
          ? 0
          : Math.max(...plottable.map((point) => point.y as number));
      return this.translate('solaris.chart.seriesSummary', {
        label: entry.label,
        count: String(plottable.length),
        max: String(peak),
      });
    });
    return parts.join('; ');
  });

  protected readonly focusMarks = computed<SolarisBarChartFocusMark[]>(() => {
    const marks: SolarisBarChartFocusMark[] = [];
    for (const row of this.frame().series) {
      for (const bar of row.bars) {
        marks.push({
          seriesId: bar.seriesId,
          index: bar.index,
          position: marks.length,
        });
      }
    }
    return marks;
  });

  protected readonly referenceViews = computed(() => {
    const frame = this.frame();
    const horizontal = this.orientation() === 'horizontal';
    const edge = horizontal
      ? frame.plot.left + frame.plot.width
      : frame.plot.top + frame.plot.height;
    const start = horizontal ? frame.plot.left : frame.plot.top;
    return this.referenceLines()
      .map((reference) => ({
        reference,
        position: barChartValuePosition(
          reference.value,
          frame.domain,
          frame.plot,
          this.orientation(),
        ),
        color: reference.color
          ? solarisChartColorVar(reference.color)
          : 'var(--solaris-danger-solid)',
      }))
      .filter((view) => view.position >= start && view.position <= edge)
      .map((view) => ({
        ...view,
        labelPosition:
          view.position - 6 <= start ? view.position + 14 : view.position - 6,
      }));
  });

  protected formatTick(value: number): string {
    const formatted = this.resolvedValueFormat()(value);
    return this.layout() === 'stacked-100' ? `${formatted}%` : formatted;
  }

  protected formatBarValue(value: number): string {
    const formatted = this.resolvedValueFormat()(value);
    return this.layout() === 'stacked-100' ? `${formatted}%` : formatted;
  }

  protected gradientId(seriesId: string): string {
    return `${this.gradientPrefix}-${seriesId}`;
  }

  protected guideGradientId(): string {
    return `${this.gradientPrefix}-guide`;
  }

  protected guideGradientReverseId(): string {
    return `${this.guideGradientId()}-reverse`;
  }

  protected guideFillId(): string {
    const id =
      this.orientation() === 'horizontal'
        ? this.guideGradientReverseId()
        : this.guideGradientId();
    return `url(#${id})`;
  }

  protected barEnterDelay(seriesId: string, index: number): string {
    const seriesIndex = this.frame().series.findIndex(
      (row) => row.id === seriesId,
    );
    const safeSeries = Math.max(0, seriesIndex);
    const delay = Math.min(640, safeSeries * 80 + index * 28);
    return `${delay}ms`;
  }

  protected morphGrowDelay(seriesId: string): string {
    const seriesIndex = this.frame().series.findIndex(
      (row) => row.id === seriesId,
    );
    return resolveMorphSeriesDelay(seriesIndex, this.morphPhaseMs);
  }

  protected readonly resolvedBarRadiusPx = computed(() => {
    const radius = this.barRadius();
    if (radius !== undefined && Number.isFinite(radius) && radius >= 0) {
      return radius;
    }
    return 2;
  });

  protected barValueLabel(bar: SolarisBarChartBarGeometry): {
    readonly x: number;
    readonly y: number;
    readonly anchor: 'start' | 'middle' | 'end';
  } {
    if (this.orientation() === 'horizontal') {
      const outside = bar.value < 0;
      return {
        x: outside ? bar.x - 4 : bar.x + bar.width + 4,
        y: bar.y + bar.height / 2 + 4,
        anchor: outside ? 'end' : 'start',
      };
    }
    return {
      x: bar.x + bar.width / 2,
      y: bar.value < 0 ? bar.y + bar.height + 12 : bar.y - 4,
      anchor: 'middle',
    };
  }

  protected barPath(bar: SolarisBarChartBarGeometry): string {
    if (this.morphing()) {
      // Collapses onto the bar's own base (the edge nearest the baseline)
      // instead of the chart baseline, so stacked segments regrow strictly
      // inside their final span and never cross over each other mid-morph.
      if (this.orientation() === 'horizontal') {
        const anchorX = bar.value < 0 ? bar.x + bar.width : bar.x;
        return roundedBarPath(anchorX, bar.y, 0, bar.height, 0, bar);
      }
      const anchorY = bar.value < 0 ? bar.y : bar.y + bar.height;
      return roundedBarPath(bar.x, anchorY, bar.width, 0, 0, bar);
    }
    return roundedBarPath(
      bar.x,
      bar.y,
      bar.width,
      bar.height,
      this.resolvedBarRadiusPx(),
      bar,
    );
  }

  protected readonly tooltip = computed<SolarisBarChartTooltip | null>(() => {
    if (this.morphing() || this.morphGrow()) return null;
    const index = this.hoveredIndex();
    if (index === null) return null;
    const single = this.hoveredMark();
    const frame = this.frame();
    const onlySingle = single !== null && single.index === index;
    const rows = frame.series
      .map((row) => {
        if (onlySingle && row.id !== single.seriesId) return null;
        const bar = row.bars.find((entry) => entry.index === index);
        if (!bar) return null;
        return {
          seriesId: row.id,
          label: row.label,
          colorVar: row.colorVar,
          formattedValue: this.formatBarValue(bar.value),
        };
      })
      .filter((row) => row !== null);
    if (rows.length === 0) return null;
    const total = onlySingle
      ? null
      : this.formatBarValue(
          frame.series.reduce((sum, row) => {
            const bar = row.bars.find((entry) => entry.index === index);
            return bar ? sum + bar.value : sum;
          }, 0),
        );
    const horizontal = this.orientation() === 'horizontal';
    const anchor = horizontal
      ? frame.series.reduce((edge, row) => {
          const bar = row.bars.find((entry) => entry.index === index);
          return bar ? Math.max(edge, bar.x + bar.width) : edge;
        }, frame.baseline)
      : (frame.categoryCenters[index] ?? frame.plot.left);
    const rawLeft = (anchor / frame.width) * 100;
    const leftPercent = Math.min(76, Math.max(24, rawLeft));
    return {
      index,
      heading: this.resolvedXLabels()[index] ?? `${index}`,
      leftPercent,
      rows,
      total,
      totalLabel: this.translate('solaris.chart.total', {}),
    };
  });

  protected readonly selectionGuide = computed(() => {
    const frame = this.frame();
    const count = frame.categoryCenters.length;
    if (count === 0) return null;
    const horizontal = this.orientation() === 'horizontal';
    const visible =
      this.guideVisible() &&
      this.hoveredIndex() !== null &&
      this.hoveredMark() === null &&
      !this.morphing() &&
      !this.morphGrow();
    const safeIndex = Math.min(Math.max(this.guideIndex(), 0), count - 1);
    const center = frame.categoryCenters[safeIndex];
    if (center === undefined) return null;
    const inset = 12;
    if (horizontal) {
      const band = frame.plot.height / count;
      const narrow = Math.max(16, band - inset);
      let left = frame.baseline;
      for (const row of frame.series) {
        for (const bar of row.bars) {
          if (bar.index !== safeIndex) continue;
          left = Math.min(left, bar.x);
        }
      }
      const right = frame.plot.left + frame.plot.width;
      return {
        visible,
        index: safeIndex,
        x: left,
        y: center - narrow / 2,
        width: Math.max(1, right - left),
        height: narrow,
        origin: `${frame.baseline}px ${center}px`,
      };
    }
    const band = frame.plot.width / count;
    const narrow = Math.max(16, band - inset);
    let bottom = frame.baseline;
    for (const row of frame.series) {
      for (const bar of row.bars) {
        if (bar.index !== safeIndex) continue;
        bottom = Math.max(bottom, bar.y + bar.height);
      }
    }
    return {
      visible,
      index: safeIndex,
      x: center - narrow / 2,
      y: frame.plot.top,
      width: narrow,
      height: Math.max(1, bottom - frame.plot.top),
      origin: `${center}px ${frame.baseline}px`,
    };
  });

  protected isAxisActive(index: number): boolean {
    return this.hoveredIndex() === index && this.hoveredMark() === null;
  }

  protected markFor(seriesId: string, index: number): SolarisBarChartFocusMark {
    const found = this.focusMarks().find(
      (mark) => mark.seriesId === seriesId && mark.index === index,
    );
    return found ?? { seriesId, index, position: 0 };
  }

  protected markTabIndex(mark: SolarisBarChartFocusMark): number {
    const focused = this.focusedMark();
    if (!focused) return mark.position === 0 ? 0 : -1;
    return focused.seriesId === mark.seriesId && focused.index === mark.index
      ? 0
      : -1;
  }

  protected markTabIndexFor(seriesId: string, index: number): number {
    return this.markTabIndex(this.markFor(seriesId, index));
  }

  protected isMarkActive(seriesId: string, index: number): boolean {
    const single = this.hoveredMark();
    if (single !== null) {
      return single.seriesId === seriesId && single.index === index;
    }
    if (this.hoveredIndex() === index) return true;
    const selected = this.selectedMark();
    return (
      selected !== null &&
      selected.seriesId === seriesId &&
      selected.index === index
    );
  }

  protected isMarkDimmed(seriesId: string, index: number): boolean {
    const single = this.hoveredMark();
    if (single === null) return false;
    if (single.index !== this.hoveredIndex()) return false;
    return single.seriesId !== seriesId || single.index !== index;
  }

  protected barAriaLabel(
    seriesLabel: string,
    index: number,
    value: number,
  ): string {
    const labels = this.resolvedXLabels();
    const category = labels[index] ?? `${index}`;
    return `${seriesLabel}, ${category}: ${this.formatBarValue(value)}`;
  }

  protected truncatedLabel(label: string): string {
    if (this.orientation() !== 'horizontal') return label;
    return truncateBarCategoryLabel(label);
  }

  protected axisHitFor(index: number): {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null {
    const frame = this.frame();
    const count = frame.categoryCenters.length;
    if (count === 0) return null;
    const center = frame.categoryCenters[index];
    if (center === undefined) return null;
    if (this.orientation() === 'horizontal') {
      const band = frame.plot.height / count;
      return {
        x: 0,
        y: center - band / 2,
        width: frame.plot.left,
        height: band,
      };
    }
    const band = frame.plot.width / count;
    return {
      x: center - band / 2,
      y: frame.plot.top + frame.plot.height,
      width: band,
      height: Math.max(1, frame.height - frame.plot.top - frame.plot.height),
    };
  }

  protected categoryCenterY(index: number): number {
    const frame = this.frame();
    const center = frame.categoryCenters[index];
    return (center ?? frame.plot.top) + 4;
  }

  protected onMarksLeave(): void {
    this.hideGuide();
    this.hoveredIndex.set(null);
    this.hoveredMark.set(null);
  }

  protected onBarHover(mark: SolarisBarChartFocusMark): void {
    this.hoveredIndex.set(mark.index);
    this.hoveredMark.set({ seriesId: mark.seriesId, index: mark.index });
    this.guideIndex.set(mark.index);
    this.hideGuide();
  }

  protected onAxisHover(index: number): void {
    this.hoveredIndex.set(index);
    this.hoveredMark.set(null);
    if (this.guideVisible()) {
      this.guideIndex.set(index);
      return;
    }
    // Pre-position the hidden guide on the target column first so the
    // reveal grows in height only, instead of sliding from the old spot.
    this.guideIndex.set(index);
    if (typeof requestAnimationFrame === 'undefined') {
      this.guideVisible.set(true);
      return;
    }
    if (this.guideRaf !== null) return;
    this.guideRaf = requestAnimationFrame(() => {
      this.guideRaf = null;
      this.guideVisible.set(true);
    });
  }

  private startLayoutMorph(): void {
    if (typeof requestAnimationFrame === 'undefined') return;
    if (this.morphRaf !== null) {
      cancelAnimationFrame(this.morphRaf);
      this.morphRaf = null;
    }
    if (this.morphGrowTimer !== null) {
      clearTimeout(this.morphGrowTimer);
      this.morphGrowTimer = null;
    }
    this.morphGrow.set(false);
    this.morphing.set(true);
    this.morphRaf = requestAnimationFrame(() => {
      this.morphRaf = requestAnimationFrame(() => {
        this.morphRaf = null;
        this.morphing.set(false);
        // Regrows bottom-up in chained per-series phases: each phase lasts
        // one motion duration, so a series only starts after the previous
        // one finished instead of growing simultaneously.
        const phase = this.readMotionPhase();
        if (phase === null) return;
        this.morphPhaseMs = phase;
        this.morphGrow.set(true);
        const seriesCount = Math.max(1, this.frame().series.length);
        this.morphGrowTimer = setTimeout(
          () => {
            this.morphGrowTimer = null;
            this.morphGrow.set(false);
          },
          phase * seriesCount + 100,
        );
      });
    });
  }

  private readMotionPhase(): number | null {
    let raw = '';
    try {
      if (typeof getComputedStyle === 'undefined') return null;
      raw = getComputedStyle(
        this.elementRef.nativeElement as HTMLElement,
      ).getPropertyValue('--solaris-motion-duration-normal');
    } catch {
      return null;
    }
    const base = this.parseMotionDurationMs(raw);
    return base !== null && base > 0 ? base : null;
  }

  private hideGuide(): void {
    if (this.guideRaf !== null && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.guideRaf);
      this.guideRaf = null;
    }
    this.guideVisible.set(false);
  }

  protected onMarkFocus(mark: SolarisBarChartFocusMark): void {
    this.focusedMark.set({ ...mark });
    this.hoveredIndex.set(mark.index);
    this.hoveredMark.set({ seriesId: mark.seriesId, index: mark.index });
    this.guideIndex.set(mark.index);
    this.hideGuide();
  }

  protected onMarkActivate(mark: SolarisBarChartFocusMark): void {
    this.selectedMark.set({ seriesId: mark.seriesId, index: mark.index });
    this.pointSelect.emit({ seriesId: mark.seriesId, index: mark.index });
  }

  protected onMarkKeydown(
    event: KeyboardEvent,
    mark: SolarisBarChartFocusMark,
  ): void {
    const marks = this.focusMarks();
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onMarkActivate(mark);
      return;
    }
    let next: number | null = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      next = Math.min(mark.position + 1, marks.length - 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      next = Math.max(mark.position - 1, 0);
    } else if (event.key === 'Home') {
      next = 0;
    } else if (event.key === 'End') {
      next = marks.length - 1;
    }
    if (next === null || next === mark.position) return;
    const target = marks[next];
    if (!target) return;
    event.preventDefault();
    this.focusedMark.set({ ...target });
    this.hoveredIndex.set(target.index);
    this.hoveredMark.set({ seriesId: target.seriesId, index: target.index });
    this.guideIndex.set(target.index);
    this.hideGuide();
    const native = this.elementRef.nativeElement as HTMLElement;
    native
      .querySelector<SVGGraphicsElement>(
        `[data-bar="${target.seriesId}:${target.index}"]`,
      )
      ?.focus();
  }

  private translate(key: string, params: Record<string, string>): string {
    const service = this.translateService;
    if (service) return service.translate(key, params);
    return resolveChartFallback(this.locale(), key, params);
  }
}
