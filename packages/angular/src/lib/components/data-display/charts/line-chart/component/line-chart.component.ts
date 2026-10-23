// SECURITY_EXCEPTION_FILE: nativeElement is used only as a ResizeObserver target
// to measure content width for x-label thinning and as a scoped query root for
// transition animations and dot focus moves. Style writes target only
// presentation attributes of the component's own SVG. SSR-safe via
// isPlatformBrowser and typeof guards.
import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';

import { SolarisThemeService } from '../../../../../services/theme';
import { SolarisTranslateService } from '../../../../../services/translation';
import {
  SOLARIS_LINE_CHART_HEIGHT,
  SOLARIS_LINE_CHART_WIDTH,
  buildLineChartFrame,
  lineChartYPosition,
  sumLineChartValuesAt,
} from '../../model/chart-line.utils';
import { solarisChartColorVar } from '../../model/chart-palette';
import { visibleChartSeries } from '../../model/chart-scale.utils';
import { resolveChartFallback } from '../../model/strings/chart-strings';
import type {
  SolarisChartInterpolation,
  SolarisChartReferenceLine,
  SolarisChartSeries,
} from '../../model/chart.types';
import type {
  SolarisLineChartDensity,
  SolarisLineChartPointEvent,
  SolarisLineChartSize,
  SolarisLineChartTooltip,
  SolarisLineChartValueFormatter,
} from '../model/line-chart.types';
import {
  SOLARIS_LINE_CHART_AXES_SELECTOR,
  SOLARIS_LINE_CHART_DOT_FADE_MS,
  SOLARIS_LINE_CHART_EASING_DECELERATE,
  SOLARIS_LINE_CHART_EASING_STANDARD,
  SOLARIS_LINE_CHART_ENTER_MS,
  SOLARIS_LINE_CHART_EXIT_MS,
  SOLARIS_LINE_CHART_RESCALE_FADE_MS,
  nextLineChartInstanceId,
  type SolarisLineChartDotView,
  type SolarisLineChartTransitionPhase,
} from '../model/line-chart.utils';

interface SolarisLineChartPendingRequest {
  readonly series: readonly SolarisChartSeries[];
  readonly xLabels: readonly string[] | undefined;
  readonly referenceLines: readonly SolarisChartReferenceLine[];
  readonly interpolation: SolarisChartInterpolation;
  readonly step: boolean;
}

@Component({
  selector: 'solaris-line-chart',
  standalone: true,
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-line-chart',
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-interpolation]': 'effectiveInterpolation()',
    '[attr.data-transition]': 'transitionPhase()',
  },
})
export class SolarisLineChartComponent implements AfterViewInit, OnDestroy {
  readonly series = input.required<readonly SolarisChartSeries[]>();
  readonly interpolation = input<SolarisChartInterpolation>('smooth');
  readonly step = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  readonly area = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
  readonly showDots = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
  readonly referenceLines = input<readonly SolarisChartReferenceLine[]>([]);
  readonly xLabels = input<readonly string[] | undefined>(undefined);
  readonly tooltipSubtitle = input<string | readonly string[] | undefined>(
    undefined,
  );
  readonly yFormat = input<SolarisLineChartValueFormatter | undefined>(
    undefined,
  );
  readonly locale = input.required<string>();
  readonly size = input<SolarisLineChartSize>('md');
  readonly density = input<SolarisLineChartDensity | undefined>(undefined);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelKey = input<string | undefined>(undefined);

  readonly pointSelect = output<SolarisLineChartPointEvent>();

  private readonly platformId = inject(PLATFORM_ID);
  private readonly elementRef = inject(ElementRef);
  private readonly ngZone = inject(NgZone);
  private readonly cdr = inject(ChangeDetectorRef);
  protected readonly themeService = inject(SolarisThemeService);
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });

  protected readonly gradientPrefix = `solaris-line-chart-${nextLineChartInstanceId()}`;
  protected readonly viewWidth = SOLARIS_LINE_CHART_WIDTH;
  protected readonly viewHeight = SOLARIS_LINE_CHART_HEIGHT;

  private resizeObserver: ResizeObserver | null = null;
  private readonly measuredWidth = signal<number | null>(null);
  protected readonly hoveredIndex = signal<number | null>(null);
  private readonly renderedSeries = signal<readonly SolarisChartSeries[]>([]);
  private readonly renderedXLabels = signal<readonly string[] | undefined>(
    undefined,
  );
  private readonly renderedReferenceLines = signal<
    readonly SolarisChartReferenceLine[]
  >([]);
  private readonly renderedInterpolation =
    signal<SolarisChartInterpolation>('smooth');
  private readonly renderedStep = signal<boolean>(false);
  protected readonly transitionPhase =
    signal<SolarisLineChartTransitionPhase>('idle');

  /**
   * Declarative marker gate: dots and areas are born hidden whenever a new
   * dataset is rendered during RESCALE, before any imperative ENTER prep runs.
   * During EXIT/ENTER/IDLE the rows stay out of the way and each dot governs
   * itself through its own backwards-filled reveal animation.
   */
  protected readonly markersOpacity = computed(() =>
    this.transitionPhase() === 'rescaling' ? '0' : '',
  );

  private pendingRequest: SolarisLineChartPendingRequest | null = null;
  private transitionGen = 0;
  private loopRunning = false;
  private viewReady = false;

  private transitionTimers: ReturnType<typeof setTimeout>[] = [];
  private transitionFrames: number[] = [];
  private transitionAnimations: Animation[] = [];
  private readonly selectedDot = signal<{
    seriesId: string;
    index: number;
  } | null>(null);
  private readonly focusedDot = signal<{
    seriesId: string;
    position: number;
  } | null>(null);

  constructor() {
    effect(() => {
      const request: SolarisLineChartPendingRequest = {
        series: this.series(),
        xLabels: this.xLabels(),
        referenceLines: this.referenceLines(),
        interpolation: this.interpolation(),
        step: this.step(),
      };
      untracked(() => this.handleDataRequest(request));
    });
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    if (isPlatformBrowser(this.platformId)) {
      if (typeof ResizeObserver !== 'undefined') {
        const native = this.elementRef.nativeElement as HTMLElement;
        this.resizeObserver = new ResizeObserver((entries) => {
          const width =
            entries[0]?.contentRect.width ?? native.clientWidth ?? null;
          this.ngZone.run(() => this.measuredWidth.set(width));
        });
        this.resizeObserver.observe(native);
      }
      if (this.pendingRequest !== null || this.renderedSeries().length === 0) {
        void this.runTransitionLoop();
      }
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.transitionGen += 1;
    this.cancelTransitionAnimations();
  }

  protected readonly effectiveDensity = computed(() => {
    return this.density() ?? this.themeService.density;
  });

  protected readonly effectiveInterpolation = computed(() =>
    this.step() ? 'step' : this.interpolation(),
  );

  protected readonly visibleSeries = computed(() =>
    visibleChartSeries(this.renderedSeries()),
  );

  protected readonly frame = computed(() =>
    buildLineChartFrame(this.renderedSeries(), {
      interpolation: this.renderedInterpolation(),
      step: this.renderedStep(),
    }),
  );

  protected readonly resolvedYFormat = computed(() => {
    const custom = this.yFormat();
    if (custom !== undefined) return custom;
    const formatter = new Intl.NumberFormat(this.locale(), {
      notation: 'compact',
    });
    return (value: number): string => formatter.format(value);
  });

  protected readonly resolvedXLabels = computed(() => {
    const custom = this.renderedXLabels();
    if (custom !== undefined) return [...custom];
    const first = this.visibleSeries()[0];
    if (!first) return [];
    return first.points.map((point) => point.label ?? `${point.x}`);
  });

  protected readonly labelEvery = computed(() => {
    const width = this.measuredWidth() ?? 800;
    const count = this.resolvedXLabels().length;
    if (width < 420) return Math.max(2, Math.ceil(count / 6));
    return Math.max(1, Math.ceil(count / 15));
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

  protected readonly dotRows = computed(() =>
    this.frame().series.map((geometry) => ({
      geometry,
      dots: geometry.dots
        .filter(
          (dot): dot is typeof dot & { cy: number; value: number } =>
            dot.cy !== null &&
            typeof dot.value === 'number' &&
            Number.isFinite(dot.value),
        )
        .map(
          (dot, position): SolarisLineChartDotView => ({
            seriesId: dot.seriesId,
            index: dot.index,
            position,
            value: dot.value,
            cx: dot.cx,
            cy: dot.cy as number,
          }),
        ),
    })),
  );

  protected readonly referenceViews = computed(() => {
    const { domain, plot } = this.frame();
    const top = plot.top;
    const bottom = plot.top + plot.height;
    return this.renderedReferenceLines()
      .map((reference) => ({
        reference,
        y: lineChartYPosition(reference.value, domain, plot),
        color: reference.color
          ? solarisChartColorVar(reference.color)
          : 'var(--solaris-danger-solid)',
      }))
      .filter((view) => view.y >= top && view.y <= bottom)
      .map((view) => ({
        ...view,
        labelY: view.y - 6 <= top ? view.y + 14 : view.y - 6,
      }));
  });

  protected readonly tooltip = computed<SolarisLineChartTooltip | null>(() => {
    if (this.transitionPhase() !== 'idle') return null;
    const index = this.hoveredIndex();
    if (index === null) return null;
    const format = this.resolvedYFormat();
    const frame = this.frame();
    const rows = this.visibleSeries()
      .map((entry) => {
        const value = entry.points[index]?.y;
        if (typeof value !== 'number' || !Number.isFinite(value)) return null;
        const geometry = frame.series.find((item) => item.id === entry.id);
        return {
          seriesId: entry.id,
          label: entry.label,
          colorVar: geometry?.colorVar ?? 'var(--solaris-primary-solid)',
          formattedValue: format(value),
        };
      })
      .filter((row) => row !== null);
    if (rows.length === 0) return null;
    const total = sumLineChartValuesAt(this.visibleSeries(), index);
    const x = frame.xPositions[index] ?? frame.plot.left;
    const rawLeft = (x / frame.width) * 100;
    const leftPercent = Math.min(76, Math.max(24, rawLeft));
    return {
      index,
      heading: this.resolvedXLabels()[index] ?? `${index}`,
      subheading: this.resolvedTooltipSubtitle(index),
      leftPercent,
      rows,
      total: total === null ? null : format(total),
      totalLabel: this.translate('solaris.chart.total', {}),
    };
  });

  private isReducedMotion(): boolean {
    return (
      typeof matchMedia !== 'undefined' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  private handleDataRequest(request: SolarisLineChartPendingRequest): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.applyRequestSync(request);
      return;
    }
    if (this.isReducedMotion()) {
      this.transitionGen += 1;
      this.pendingRequest = null;
      this.cancelTransitionAnimations();
      this.applyRequestSync(request);
      this.transitionPhase.set('idle');
      return;
    }
    this.pendingRequest = request;
    if (this.loopRunning) {
      this.transitionGen += 1;
      this.cancelTransitionAnimations();
      return;
    }
    if (!this.viewReady) return;
    void this.runTransitionLoop();
  }

  private applyRequestSync(request: SolarisLineChartPendingRequest): void {
    this.renderedSeries.set(request.series);
    this.renderedXLabels.set(request.xLabels);
    this.renderedReferenceLines.set(request.referenceLines);
    this.renderedInterpolation.set(request.interpolation);
    this.renderedStep.set(request.step);
    try {
      this.cdr.detectChanges();
    } catch {
      // Ignore: detectChanges may be unavailable during construction/SSR.
    }
  }

  private async runTransitionLoop(): Promise<void> {
    if (this.loopRunning) return;
    if (!isPlatformBrowser(this.platformId)) return;
    this.loopRunning = true;
    try {
      await this.drainPendingRequests();
    } finally {
      this.loopRunning = false;
      this.resumeOrDrainAfterLoop();
    }
  }

  private async drainPendingRequests(): Promise<void> {
    const next = this.takePendingRequest();
    if (next === null) return;
    const gen = this.claimTransitionGen();
    this.hoveredIndex.set(null);
    await this.runSingleTransition(next, gen);
    if (this.pendingRequest !== null) {
      await this.drainPendingRequests();
    }
  }

  private takePendingRequest(): SolarisLineChartPendingRequest | null {
    const next = this.pendingRequest;
    this.pendingRequest = null;
    return next;
  }

  private claimTransitionGen(): number {
    const gen = this.transitionGen + 1;
    this.transitionGen = gen;
    return gen;
  }

  private async runSingleTransition(
    next: SolarisLineChartPendingRequest,
    gen: number,
  ): Promise<void> {
    if (this.renderedSeries().length === 0) {
      await this.runInitialTransition(next, gen);
      return;
    }
    await this.runUpdateTransition(next, gen);
  }

  private async runInitialTransition(
    next: SolarisLineChartPendingRequest,
    gen: number,
  ): Promise<void> {
    this.applyRequestSync(next);
    this.transitionPhase.set('entering');
    this.prepareEnterState(this.elementRef.nativeElement as HTMLElement);
    const entered = await this.doEnter(gen);
    if (!entered || this.pendingRequest !== null) return;
    this.transitionPhase.set('idle');
    this.releaseFinishedTransitionResources();
  }

  private async runUpdateTransition(
    next: SolarisLineChartPendingRequest,
    gen: number,
  ): Promise<void> {
    this.transitionPhase.set('exiting');
    const exited = await this.doExit(gen);
    if (!exited || this.pendingRequest !== null) return;
    this.transitionPhase.set('rescaling');
    const rescaled = await this.doRescale(gen, next);
    if (!rescaled || this.pendingRequest !== null) return;
    this.transitionPhase.set('entering');
    const entered = await this.doEnter(gen);
    if (!entered || this.pendingRequest !== null) return;
    this.transitionPhase.set('idle');
    this.releaseFinishedTransitionResources();
  }

  private resumeOrDrainAfterLoop(): void {
    if (this.pendingRequest === null) return;
    if (isPlatformBrowser(this.platformId) && !this.isReducedMotion()) {
      void this.runTransitionLoop();
      return;
    }
    const drained = this.takePendingRequest();
    if (drained) this.applyRequestSync(drained);
    this.transitionPhase.set('idle');
  }

  private playTransition(
    node: Element,
    keyframes: Keyframe[],
    options: KeyframeAnimationOptions,
  ): Animation | null {
    if (typeof node.animate !== 'function') return null;
    const played = node.animate(keyframes, options) as
      | Animation
      | null
      | undefined;
    return played ?? null;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => resolve(), ms);
    });
  }

  private async waitForAnimations(
    animations: readonly (Animation | null)[],
    gen: number,
    timeoutMs: number,
  ): Promise<boolean> {
    const live = animations.filter((item): item is Animation => item !== null);
    if (live.length === 0) {
      if (timeoutMs > 0) await this.sleep(Math.min(timeoutMs, 32));
      return this.isCurrentGen(gen);
    }
    const settled = Promise.allSettled(
      live.map((animation) => this.animationSettled(animation)),
    );
    await Promise.race([settled, this.sleep(timeoutMs + 200)]);
    return this.isCurrentGen(gen);
  }

  private async animationSettled(animation: Animation): Promise<void> {
    try {
      await animation.finished;
    } catch {
      // Ignore: canceled animations reject.
    }
  }

  private isCurrentGen(gen: number): boolean {
    return this.transitionGen === gen && this.pendingRequest === null;
  }

  private seriesPaths(native: HTMLElement): SVGPathElement[] {
    return Array.from(
      native.querySelectorAll<SVGPathElement>(
        '.solaris-line-chart__series-group .solaris-line-chart__line',
      ),
    ).filter((path) => (path.getAttribute('d') ?? '') !== '');
  }

  private pathLength(path: SVGPathElement): number {
    try {
      const length = path.getTotalLength();
      return Number.isFinite(length) && length > 0 ? length : 0;
    } catch {
      return 0;
    }
  }

  private seriesSelector(seriesId: string): string {
    const safe =
      typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
        ? CSS.escape(seriesId)
        : seriesId;
    return `[data-series="${safe}"]`;
  }

  private setSeriesGroupVisibility(
    native: HTMLElement | null,
    visible: boolean,
  ): void {
    const group = native?.querySelector('.solaris-line-chart__series-group');
    if (group) (group as SVGGElement).style.opacity = visible ? '' : '0';
  }

  private setAxesVisibility(
    native: HTMLElement | null,
    visible: boolean,
  ): void {
    if (!native) return;
    native
      .querySelectorAll(SOLARIS_LINE_CHART_AXES_SELECTOR)
      .forEach((node) => {
        (node as SVGGElement).style.opacity = visible ? '' : '0';
      });
  }

  private setRowsVisibility(
    native: HTMLElement | null,
    visible: boolean,
  ): void {
    if (!native) return;
    const value = visible ? '' : '0';
    native.querySelectorAll('.solaris-line-chart__dots-row').forEach((row) => {
      (row as SVGGElement).style.opacity = value;
    });
    native.querySelectorAll('.solaris-line-chart__area').forEach((area) => {
      (area as SVGPathElement).style.opacity = value;
    });
  }

  private clearLineDash(native: HTMLElement | null): void {
    native
      ?.querySelectorAll<SVGPathElement>('.solaris-line-chart__line')
      .forEach((path) => {
        path.style.strokeDasharray = '';
        path.style.strokeDashoffset = '';
      });
  }

  private restoreVisibleState(native: HTMLElement | null): void {
    this.clearLineDash(native);
    this.setRowsVisibility(native, true);
    this.setAxesVisibility(native, true);
    this.setSeriesGroupVisibility(native as HTMLElement, true);
  }

  private prepareEnterState(native: HTMLElement): void {
    this.setRowsVisibility(native, false);
    const paths = this.seriesPaths(native);
    if (paths.length === 0) {
      return;
    }
    this.setSeriesGroupVisibility(native, true);
    for (const path of paths) {
      const length = this.pathLength(path);
      if (length <= 0) continue;
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
    }
  }

  private async doExit(gen: number): Promise<boolean> {
    const native = this.elementRef.nativeElement as HTMLElement;
    const group = native.querySelector('.solaris-line-chart__series-group');
    if (!group) return this.transitionGen === gen;
    if ((group as SVGGElement).style.opacity === '0') {
      return this.isCurrentGen(gen);
    }
    const paths = this.seriesPaths(native);
    if (paths.length === 0) {
      this.setSeriesGroupVisibility(native, false);
      return this.isCurrentGen(gen);
    }
    const animations: (Animation | null)[] = [];
    this.fadeOutPaths(native, paths, animations);
    this.fadeOutAreas(native, animations);
    const completed = await this.waitForAnimations(
      animations,
      gen,
      SOLARIS_LINE_CHART_EXIT_MS,
    );
    if (!completed) return false;
    this.setSeriesGroupVisibility(native, false);
    return true;
  }

  private fadeOutPaths(
    native: HTMLElement,
    paths: SVGPathElement[],
    animations: (Animation | null)[],
  ): void {
    for (const path of paths) {
      this.fadeOutSinglePath(native, path, animations);
    }
  }

  private fadeOutSinglePath(
    native: HTMLElement,
    path: SVGPathElement,
    animations: (Animation | null)[],
  ): void {
    const length = this.pathLength(path);
    if (length <= 0) return;
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = '0';
    this.trackAnimation(
      animations,
      this.playTransition(
        path,
        [{ strokeDashoffset: '0' }, { strokeDashoffset: `${length}` }],
        {
          duration: SOLARIS_LINE_CHART_EXIT_MS,
          easing: SOLARIS_LINE_CHART_EASING_STANDARD,
          fill: 'forwards',
        },
      ),
      () => {
        path.style.strokeDashoffset = `${length}`;
      },
    );
    this.fadeOutPathDots(native, path, animations);
    this.runPenDot(native, path, length, SOLARIS_LINE_CHART_EXIT_MS, true);
  }

  private fadeOutPathDots(
    native: HTMLElement,
    path: SVGPathElement,
    animations: (Animation | null)[],
  ): void {
    const seriesId = path.getAttribute('data-series') ?? '';
    if (!seriesId) return;
    const dots = Array.from(
      native.querySelectorAll(
        `.solaris-line-chart__dots-row${this.seriesSelector(seriesId)} circle`,
      ),
    );
    const total = dots.length;
    dots.forEach((dot, position) => {
      this.fadeOutSingleDot(dot, total, position, animations);
    });
  }

  private fadeOutSingleDot(
    dot: Element,
    total: number,
    position: number,
    animations: (Animation | null)[],
  ): void {
    const delay =
      total <= 1
        ? 0
        : ((total - 1 - position) / total) *
          (SOLARIS_LINE_CHART_EXIT_MS - SOLARIS_LINE_CHART_DOT_FADE_MS);
    this.trackAnimation(
      animations,
      this.playTransition(dot, [{ opacity: '1' }, { opacity: '0' }], {
        duration: SOLARIS_LINE_CHART_DOT_FADE_MS,
        delay: Math.max(0, delay),
        easing: SOLARIS_LINE_CHART_EASING_DECELERATE,
        fill: 'forwards',
      }),
      () => {
        (dot as SVGGElement).style.opacity = '0';
      },
    );
  }

  private fadeOutAreas(
    native: HTMLElement,
    animations: (Animation | null)[],
  ): void {
    const areas = Array.from(
      native.querySelectorAll('.solaris-line-chart__area'),
    );
    for (const area of areas) {
      this.trackAnimation(
        animations,
        this.playTransition(area, [{ opacity: '1' }, { opacity: '0' }], {
          duration: SOLARIS_LINE_CHART_EXIT_MS,
          easing: SOLARIS_LINE_CHART_EASING_DECELERATE,
          fill: 'forwards',
        }),
        () => {
          (area as SVGPathElement).style.opacity = '0';
        },
      );
    }
  }

  private trackAnimation(
    animations: (Animation | null)[],
    animation: Animation | null,
    fallback: () => void,
  ): void {
    if (animation) {
      animations.push(animation);
      this.transitionAnimations.push(animation);
      return;
    }
    fallback();
  }

  private async doRescale(
    gen: number,
    next: SolarisLineChartPendingRequest,
  ): Promise<boolean> {
    const native = this.elementRef.nativeElement as HTMLElement;
    this.setSeriesGroupVisibility(native, false);
    const axes = Array.from(
      native.querySelectorAll(SOLARIS_LINE_CHART_AXES_SELECTOR),
    );
    const outAnims = axes.map((node) => {
      const fade = this.playTransition(
        node,
        [{ opacity: '1' }, { opacity: '0' }],
        {
          duration: Math.round(SOLARIS_LINE_CHART_RESCALE_FADE_MS / 2),
          easing: SOLARIS_LINE_CHART_EASING_DECELERATE,
          fill: 'forwards',
        },
      );
      if (fade) this.transitionAnimations.push(fade);
      return fade;
    });
    const fadedOut = await this.waitForAnimations(
      outAnims,
      gen,
      SOLARIS_LINE_CHART_RESCALE_FADE_MS,
    );
    if (!fadedOut) return false;
    this.ngZone.run(() => {
      this.renderedSeries.set(next.series);
      this.renderedXLabels.set(next.xLabels);
      this.renderedReferenceLines.set(next.referenceLines);
      this.renderedInterpolation.set(next.interpolation);
      this.renderedStep.set(next.step);
    });
    try {
      this.cdr.detectChanges();
    } catch {
      // Ignore: tests or SSR may drive change detection manually.
    }
    await this.sleep(0);
    if (this.transitionGen !== gen || this.pendingRequest !== null) {
      return false;
    }
    this.prepareEnterState(native);
    const freshAxes = Array.from(
      native.querySelectorAll<SVGGElement>(SOLARIS_LINE_CHART_AXES_SELECTOR),
    );
    freshAxes.forEach((node) => {
      node.style.opacity = '0';
    });
    const inAnims = freshAxes.map((node) => {
      const fade = this.playTransition(
        node,
        [{ opacity: '0' }, { opacity: '1' }],
        {
          duration: SOLARIS_LINE_CHART_RESCALE_FADE_MS,
          easing: SOLARIS_LINE_CHART_EASING_DECELERATE,
          fill: 'forwards',
        },
      );
      if (fade) this.transitionAnimations.push(fade);
      return fade;
    });
    const fadedIn = await this.waitForAnimations(
      inAnims,
      gen,
      SOLARIS_LINE_CHART_RESCALE_FADE_MS,
    );
    if (!fadedIn) return false;
    freshAxes.forEach((node) => {
      node.style.opacity = '';
    });
    return true;
  }

  private revealPathDots(
    dots: Element[],
    animations: (Animation | null)[],
    immediate: boolean,
  ): void {
    const total = dots.length;
    dots.forEach((dot, position) => {
      const delay =
        immediate || total <= 1
          ? 0
          : (position / total) *
            (SOLARIS_LINE_CHART_ENTER_MS - SOLARIS_LINE_CHART_DOT_FADE_MS);
      this.trackAnimation(
        animations,
        this.playTransition(dot, [{ opacity: '0' }, { opacity: '1' }], {
          duration: SOLARIS_LINE_CHART_DOT_FADE_MS,
          delay: Math.max(0, delay),
          easing: SOLARIS_LINE_CHART_EASING_DECELERATE,
          fill: 'both',
        }),
        () => {
          (dot as SVGGElement).style.opacity = '';
        },
      );
    });
  }

  private async doEnter(gen: number): Promise<boolean> {
    const native = this.elementRef.nativeElement as HTMLElement;
    this.setSeriesGroupVisibility(native, true);
    this.setRowsVisibility(native, true);
    const paths = this.seriesPaths(native);
    if (paths.length === 0) {
      this.restoreVisibleState(native);
      return this.transitionGen === gen && this.pendingRequest === null;
    }
    const animations: (Animation | null)[] = [];
    for (const path of paths) {
      const seriesId = path.getAttribute('data-series') ?? '';
      const dots = seriesId
        ? Array.from(
            native.querySelectorAll(
              `.solaris-line-chart__dots-row${this.seriesSelector(seriesId)} circle`,
            ),
          )
        : [];
      const length = this.pathLength(path);
      if (length <= 0) {
        this.revealPathDots(dots, animations, true);
        continue;
      }
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
      const draw = this.playTransition(
        path,
        [{ strokeDashoffset: `${length}` }, { strokeDashoffset: '0' }],
        {
          duration: SOLARIS_LINE_CHART_ENTER_MS,
          easing: SOLARIS_LINE_CHART_EASING_STANDARD,
          fill: 'forwards',
        },
      );
      if (draw) {
        animations.push(draw);
        this.transitionAnimations.push(draw);
      } else {
        path.style.strokeDasharray = '';
        path.style.strokeDashoffset = '';
      }
      this.revealPathDots(dots, animations, false);
      this.runPenDot(native, path, length, SOLARIS_LINE_CHART_ENTER_MS, false);
    }
    const areas = Array.from(
      native.querySelectorAll('.solaris-line-chart__area'),
    );
    for (const area of areas) {
      const reveal = this.playTransition(
        area,
        [{ opacity: '0' }, { opacity: '1' }],
        {
          duration: SOLARIS_LINE_CHART_ENTER_MS,
          easing: SOLARIS_LINE_CHART_EASING_DECELERATE,
          fill: 'forwards',
        },
      );
      if (reveal) {
        animations.push(reveal);
        this.transitionAnimations.push(reveal);
      } else {
        (area as SVGPathElement).style.opacity = '';
      }
    }
    const completed = await this.waitForAnimations(
      animations,
      gen,
      SOLARIS_LINE_CHART_ENTER_MS,
    );
    this.clearLineDash(native);
    native
      .querySelectorAll('.solaris-line-chart__pen')
      .forEach((node) => node.remove());
    this.setRowsVisibility(native, true);
    this.setSeriesGroupVisibility(native, true);
    this.setAxesVisibility(native, true);
    return completed;
  }

  private runPenDot(
    native: HTMLElement,
    path: SVGPathElement,
    length: number,
    duration: number,
    reverse: boolean,
  ): void {
    if (typeof document === 'undefined') return;
    if (typeof requestAnimationFrame === 'undefined') return;
    const penLayer = native.querySelector('.solaris-line-chart__pen-layer');
    if (!penLayer) return;
    if (this.isReducedMotion()) return;
    const pen = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle',
    );
    pen.setAttribute('class', 'solaris-line-chart__pen');
    pen.setAttribute('r', '4');
    pen.style.fill = path.style.stroke || 'var(--solaris-primary-solid)';
    pen.style.stroke = 'var(--solaris-neutral-default)';
    pen.style.strokeWidth = '2';
    pen.style.pointerEvents = 'none';
    penLayer.appendChild(pen);
    const host = this.elementRef.nativeElement as HTMLElement;
    const start =
      typeof performance !== 'undefined' ? performance.now() : Date.now();
    const tick = (now: number): void => {
      if (!host.isConnected) {
        pen.remove();
        return;
      }
      const raw = (now - start) / duration;
      const progress = Math.min(1, Math.max(0, raw));
      const eased = this.easeDrawIn(progress);
      const distance = reverse ? (1 - eased) * length : eased * length;
      try {
        const point = path.getPointAtLength(
          Math.min(length, Math.max(0, distance)),
        );
        pen.setAttribute('cx', `${point.x}`);
        pen.setAttribute('cy', `${point.y}`);
      } catch {
        pen.remove();
        return;
      }
      if (progress < 1) {
        this.transitionFrames.push(requestAnimationFrame(tick));
      } else {
        pen.remove();
      }
    };
    this.transitionFrames.push(requestAnimationFrame(tick));
  }

  private easeDrawIn(progress: number): number {
    const x1 = 0.4;
    const y1 = 0;
    const x2 = 0.2;
    const y2 = 1;
    let t = Math.min(1, Math.max(0, progress));
    for (let i = 0; i < 5; i += 1) {
      const complement = 1 - t;
      const x =
        3 * x1 * t * complement * complement +
        3 * x2 * t * t * complement +
        t * t * t -
        progress;
      if (Math.abs(x) < 1e-4) break;
      const dx =
        3 * x1 * complement * complement +
        6 * (x2 - x1) * t * complement +
        3 * (1 - x2) * t * t;
      if (Math.abs(dx) < 1e-4) break;
      t -= x / dx;
    }
    t = Math.min(1, Math.max(0, t));
    const complement = 1 - t;
    return (
      3 * y1 * t * complement * complement +
      3 * y2 * t * t * complement +
      t * t * t
    );
  }

  private hideSeriesForAbort(): void {
    const native = this.elementRef.nativeElement as HTMLElement | null;
    this.setSeriesGroupVisibility(native, false);
    this.setRowsVisibility(native, false);
  }

  private releaseFinishedTransitionResources(): void {
    this.transitionTimers = [];
    this.transitionFrames = [];
    this.transitionAnimations = [];
  }

  private cancelTransitionAnimations(): void {
    for (const timer of this.transitionTimers) clearTimeout(timer);
    this.transitionTimers = [];
    for (const frame of this.transitionFrames) cancelAnimationFrame(frame);
    this.transitionFrames = [];
    for (const animation of this.transitionAnimations) {
      try {
        animation.cancel();
      } catch {
        //
      }
    }
    this.transitionAnimations = [];
    const native = this.elementRef.nativeElement as HTMLElement | null;
    native
      ?.querySelectorAll('.solaris-line-chart__pen')
      .forEach((node) => node.remove());
  }

  protected readonly selectionGuide = computed(() => {
    if (this.transitionPhase() !== 'idle') return null;
    const index = this.hoveredIndex();
    if (index === null) return null;
    const frame = this.frame();
    const x = frame.xPositions[index];
    if (x === undefined) return null;
    const bandWidth = Math.max(
      24,
      frame.plot.width / Math.max(frame.xPositions.length * 2, 1),
    );
    return {
      x: x - bandWidth / 2,
      width: bandWidth,
      y: frame.plot.top,
      height: frame.plot.height,
    };
  });

  protected isDotActive(dot: SolarisLineChartDotView): boolean {
    if (this.hoveredIndex() === dot.index) return true;
    const selected = this.selectedDot();
    return (
      selected !== null &&
      selected.seriesId === dot.seriesId &&
      selected.index === dot.index
    );
  }

  protected resolvedTooltipSubtitle(index: number): string | null {
    const subtitle = this.tooltipSubtitle();
    if (subtitle === undefined) return null;
    if (typeof subtitle === 'string') return subtitle;
    return subtitle[index] ?? null;
  }
  protected gradientId(seriesId: string): string {
    return `${this.gradientPrefix}-${seriesId}`;
  }

  protected dotTabIndex(seriesId: string, position: number): number {
    const focused = this.focusedDot();
    if (!focused) return position === 0 ? 0 : -1;
    return focused.seriesId === seriesId && focused.position === position
      ? 0
      : -1;
  }

  protected dotAriaLabel(
    seriesLabel: string,
    index: number,
    value: number,
  ): string {
    const labels = this.resolvedXLabels();
    const category = labels[index] ?? `${index}`;
    return `${seriesLabel}, ${category}: ${this.resolvedYFormat()(value)}`;
  }

  protected onDotsLeave(): void {
    this.hoveredIndex.set(null);
  }

  protected onDotFocus(dot: SolarisLineChartDotView): void {
    if (this.transitionPhase() !== 'idle') return;
    this.focusedDot.set({ seriesId: dot.seriesId, position: dot.position });
    this.hoveredIndex.set(dot.index);
  }

  protected onDotActivate(dot: SolarisLineChartDotView): void {
    this.selectedDot.set({ seriesId: dot.seriesId, index: dot.index });
    this.pointSelect.emit({ seriesId: dot.seriesId, index: dot.index });
  }

  protected onDotKeydown(
    event: KeyboardEvent,
    dot: SolarisLineChartDotView,
    dots: readonly SolarisLineChartDotView[],
  ): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onDotActivate(dot);
      return;
    }
    let next: number | null = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      next = Math.min(dot.position + 1, dots.length - 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      next = Math.max(dot.position - 1, 0);
    } else if (event.key === 'Home') {
      next = 0;
    } else if (event.key === 'End') {
      next = dots.length - 1;
    }
    if (next === null || next === dot.position) return;
    const target = dots[next];
    if (!target) return;
    event.preventDefault();
    this.focusedDot.set({
      seriesId: target.seriesId,
      position: target.position,
    });
    this.hoveredIndex.set(target.index);
    const native = this.elementRef.nativeElement as HTMLElement;
    const node = native.querySelector<SVGCircleElement>(
      `circle[data-dot="${target.seriesId}:${target.position}"]`,
    );
    node?.focus();
  }

  private translate(key: string, params: Record<string, string>): string {
    const service = this.translateService;
    if (service) return service.translate(key, params);
    return resolveChartFallback(this.locale(), key, params);
  }
}
