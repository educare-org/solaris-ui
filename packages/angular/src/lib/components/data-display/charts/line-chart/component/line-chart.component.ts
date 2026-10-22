// SECURITY_EXCEPTION_FILE: nativeElement is used only as a ResizeObserver target
// to measure content width for x-label thinning and as a scoped query root to
// move focus between SVG dots. innerHTML receives only a sanitized clone of the
// component's own rendered SVG (no user markup: Angular-escaped text, tabindex
// stripped, dash styles reset) for the slide-out snapshot; style writes target
// only presentation attributes of that snapshot/transition. SSR-safe via
// isPlatformBrowser and typeof guards.
import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
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

interface SolarisLineChartDotView {
  readonly seriesId: string;
  readonly index: number;
  readonly position: number;
  readonly value: number;
  readonly cx: number;
  readonly cy: number;
}

let solarisLineChartInstanceCount = 0;

const SOLARIS_LINE_CHART_AXES_SELECTOR =
  '.solaris-line-chart__grid, .solaris-line-chart__tick, .solaris-line-chart__reference, .solaris-line-chart__reference-label';

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
  protected readonly themeService = inject(SolarisThemeService);
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });

  protected readonly gradientPrefix = `solaris-line-chart-${(solarisLineChartInstanceCount += 1)}`;
  protected readonly viewWidth = SOLARIS_LINE_CHART_WIDTH;
  protected readonly viewHeight = SOLARIS_LINE_CHART_HEIGHT;

  private resizeObserver: ResizeObserver | null = null;
  private readonly measuredWidth = signal<number | null>(null);
  protected readonly hoveredIndex = signal<number | null>(null);

  constructor() {
    effect(() => {
      this.transitionKey();
      untracked(() => this.playDataTransition());
    });
  }

  private transitionSnapshot: string | null = null;
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

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (typeof ResizeObserver === 'undefined') return;
    const native = this.elementRef.nativeElement as HTMLElement;
    this.resizeObserver = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? native.clientWidth ?? null;
      this.ngZone.run(() => this.measuredWidth.set(width));
    });
    this.resizeObserver.observe(native);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.cancelDataTransition();
  }

  protected readonly effectiveDensity = computed(() => {
    return this.density() ?? this.themeService.density;
  });

  protected readonly effectiveInterpolation = computed(() =>
    this.step() ? 'step' : this.interpolation(),
  );

  protected readonly visibleSeries = computed(() =>
    visibleChartSeries(this.series()),
  );

  protected readonly frame = computed(() =>
    buildLineChartFrame(this.series(), {
      interpolation: this.interpolation(),
      step: this.step(),
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
    const custom = this.xLabels();
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
    return this.referenceLines()
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

  protected readonly transitionKey = computed(() => {
    const frame = this.frame();
    const ids = this.visibleSeries()
      .map((entry) => entry.id)
      .join(',');
    return `${ids}|${frame.xPositions.length}|${Math.round(frame.domain.min)}:${Math.round(frame.domain.max)}`;
  });

  private playDataTransition(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (typeof requestAnimationFrame === 'undefined') return;
    if (typeof document === 'undefined') return;
    if (
      typeof matchMedia !== 'undefined' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    requestAnimationFrame(() => {
      const native = this.elementRef.nativeElement as HTMLElement;
      const group = native.querySelector('.solaris-line-chart__series-group');
      if (!group || typeof group.animate !== 'function') return;
      this.cancelDataTransition();
      const isUpdate = this.transitionSnapshot !== null;
      this.setRowVisibility(native, false);
      if (isUpdate) {
        const seriesGroup = group as SVGGElement;
        seriesGroup.style.opacity = '0';
        this.setAxesVisibility(native, false);
        this.slideTransitionOut(native);
        const enterTimer = setTimeout(() => {
          seriesGroup.style.opacity = '';
          this.transitionAnimations.push(
            group.animate(
              [
                { opacity: '0', transform: 'translateX(-56px)' },
                { opacity: '1', transform: 'translateX(0)' },
              ],
              { duration: 340, easing: 'cubic-bezier(0.2, 0, 0, 1)' },
            ),
          );
        }, 300);
        this.transitionTimers.push(enterTimer);
        const axesTimer = setTimeout(() => {
          this.revealAxes(native);
        }, 280);
        this.transitionTimers.push(axesTimer);
      }
      this.drawLines(
        native,
        isUpdate ? 650 : 1000,
        isUpdate,
        isUpdate ? 300 : 0,
      );
      const svg = native.querySelector('svg.solaris-line-chart__svg');
      this.transitionSnapshot =
        svg instanceof SVGSVGElement ? this.snapshotSvg(svg) : null;
    });
  }

  private slideTransitionOut(native: HTMLElement): void {
    const snapshot = this.transitionSnapshot;
    if (!snapshot) return;
    const frame = native.querySelector('.solaris-line-chart__frame');
    if (!frame || typeof frame.animate !== 'function') return;
    const axes = SOLARIS_LINE_CHART_AXES_SELECTOR;
    const data =
      '.solaris-line-chart__line, .solaris-line-chart__area, .solaris-line-chart__dots-row, .solaris-line-chart__pen, .solaris-line-chart__selection-guide';
    const sliding = this.buildTransitionLayer(frame, snapshot, axes);
    if (sliding && typeof sliding.animate === 'function') {
      const out = sliding.animate(
        [
          { opacity: '1', transform: 'translateX(0)' },
          { opacity: '0', transform: 'translateX(56px)' },
        ],
        {
          duration: 300,
          easing: 'cubic-bezier(0.2, 0, 0, 1)',
          fill: 'forwards',
        },
      );
      this.transitionAnimations.push(out);
      out.onfinish = (): void => {
        sliding.remove();
      };
    }
    const fading = this.buildTransitionLayer(frame, snapshot, data);
    if (fading && typeof fading.animate === 'function') {
      const out = fading.animate([{ opacity: '1' }, { opacity: '0' }], {
        duration: 260,
        easing: 'ease-out',
        fill: 'forwards',
      });
      this.transitionAnimations.push(out);
      out.onfinish = (): void => {
        fading.remove();
      };
    }
    const fallback = setTimeout(() => {
      sliding?.remove();
      fading?.remove();
    }, 450);
    this.transitionTimers.push(fallback);
  }

  private buildTransitionLayer(
    frame: Element,
    snapshot: string,
    removeSelector: string,
  ): HTMLDivElement | null {
    const overlay = document.createElement('div');
    overlay.className = 'solaris-line-chart__transition-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.right = '0';
    overlay.style.bottom = '0';
    overlay.style.left = '0';
    overlay.style.overflow = 'hidden';
    overlay.style.pointerEvents = 'none';
    overlay.innerHTML = snapshot;
    overlay.querySelectorAll(removeSelector).forEach((node) => node.remove());
    frame.appendChild(overlay);
    return overlay;
  }

  private snapshotSvg(svg: SVGSVGElement): string {
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone
      .querySelectorAll('[tabindex]')
      .forEach((node) => node.removeAttribute('tabindex'));
    clone
      .querySelectorAll<SVGPathElement>('.solaris-line-chart__line')
      .forEach((path) => {
        path.style.strokeDasharray = '';
        path.style.strokeDashoffset = '';
      });
    clone
      .querySelectorAll('.solaris-line-chart__pen')
      .forEach((node) => node.remove());
    clone.querySelectorAll('.solaris-line-chart__dots-row').forEach((node) => {
      (node as SVGGElement).style.opacity = '';
    });
    clone.querySelectorAll('.solaris-line-chart__area').forEach((node) => {
      const area = node as SVGPathElement;
      area.style.opacity = '';
      area.style.transform = '';
    });
    clone.querySelectorAll(SOLARIS_LINE_CHART_AXES_SELECTOR).forEach((node) => {
      (node as SVGGElement).style.opacity = '';
    });
    return clone.outerHTML;
  }

  private setRowVisibility(native: ParentNode | null, visible: boolean): void {
    if (!native) return;
    const value = visible ? '' : '0';
    native.querySelectorAll('.solaris-line-chart__dots-row').forEach((row) => {
      (row as SVGGElement).style.opacity = value;
    });
    native.querySelectorAll('.solaris-line-chart__area').forEach((area) => {
      (area as SVGPathElement).style.opacity = value;
    });
  }

  private setAxesVisibility(native: ParentNode | null, visible: boolean): void {
    if (!native) return;
    const value = visible ? '' : '0';
    native
      .querySelectorAll(SOLARIS_LINE_CHART_AXES_SELECTOR)
      .forEach((node) => {
        (node as SVGGElement).style.opacity = value;
      });
  }

  private revealAxes(native: HTMLElement): void {
    const axes = Array.from(
      native.querySelectorAll<SVGGElement>(SOLARIS_LINE_CHART_AXES_SELECTOR),
    );
    if (axes.length === 0) return;
    if (axes.some((node) => typeof node.animate !== 'function')) {
      this.setAxesVisibility(native, true);
      return;
    }
    axes.forEach((node) => {
      const fade = node.animate([{ opacity: '0' }, { opacity: '1' }], {
        duration: 220,
        easing: 'ease-out',
      });
      this.transitionAnimations.push(fade);
      fade.onfinish = (): void => {
        node.style.opacity = '';
      };
    });
  }

  private seriesSelector(seriesId: string): string {
    const safe =
      typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
        ? CSS.escape(seriesId)
        : seriesId;
    return `[data-series="${safe}"]`;
  }

  private revealRow(native: HTMLElement, seriesId: string): void {
    const selector = this.seriesSelector(seriesId);
    const dotsRow = native.querySelector(
      `.solaris-line-chart__dots-row${selector}`,
    );
    if (dotsRow) {
      if (typeof dotsRow.animate === 'function') {
        const fade = dotsRow.animate([{ opacity: '0' }, { opacity: '1' }], {
          duration: 220,
          easing: 'ease-out',
        });
        this.transitionAnimations.push(fade);
        fade.onfinish = (): void => {
          (dotsRow as SVGGElement).style.opacity = '';
        };
      } else {
        (dotsRow as SVGGElement).style.opacity = '';
      }
    }
    const area = native.querySelector(`.solaris-line-chart__area${selector}`);
    if (area) {
      if (typeof area.animate === 'function') {
        const slide = area.animate(
          [
            { opacity: '0', transform: 'translateY(-10px)' },
            { opacity: '1', transform: 'translateY(0)' },
          ],
          { duration: 300, easing: 'ease-out' },
        );
        this.transitionAnimations.push(slide);
        slide.onfinish = (): void => {
          const el = area as SVGPathElement;
          el.style.opacity = '';
          el.style.transform = '';
        };
      } else {
        (area as SVGPathElement).style.opacity = '';
      }
    }
  }

  private drawLines(
    native: HTMLElement,
    duration: number,
    staggered: boolean,
    baseDelay = 0,
  ): void {
    const group = native.querySelector('.solaris-line-chart__series-group');
    const penLayer = native.querySelector('.solaris-line-chart__pen-layer');
    if (!group || !penLayer) {
      this.setRowVisibility(native, true);
      return;
    }
    const paths = Array.from(
      group.querySelectorAll<SVGPathElement>('.solaris-line-chart__line'),
    );
    if (paths.length === 0) {
      this.setRowVisibility(native, true);
      return;
    }
    paths.forEach((path, seriesIndex) => {
      const seriesId = path.getAttribute('data-series') ?? `${seriesIndex}`;
      const reveal = (): void => this.revealRow(native, seriesId);
      if (!path.getAttribute('d')) {
        reveal();
        return;
      }
      let length = 0;
      try {
        length = path.getTotalLength();
      } catch {
        reveal();
        return;
      }
      if (!(length > 0) || typeof path.animate !== 'function') {
        reveal();
        return;
      }
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
      const delay =
        baseDelay + (staggered ? seriesIndex * 90 : seriesIndex * 140);
      const timer = setTimeout(() => {
        const draw = path.animate(
          [{ strokeDashoffset: `${length}` }, { strokeDashoffset: '0' }],
          {
            duration,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            fill: 'forwards',
          },
        );
        this.transitionAnimations.push(draw);
        let done = false;
        const finish = (): void => {
          if (done) return;
          done = true;
          path.style.strokeDasharray = '';
          path.style.strokeDashoffset = '';
          reveal();
        };
        draw.onfinish = finish;
        const fallback = setTimeout(finish, duration + delay + 100);
        this.transitionTimers.push(fallback);
        this.runPenDot(native, penLayer, path, length, duration);
      }, delay);
      this.transitionTimers.push(timer);
    });
  }

  private runPenDot(
    native: HTMLElement,
    penLayer: Element,
    path: SVGPathElement,
    length: number,
    duration: number,
  ): void {
    if (typeof document === 'undefined') return;
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
      try {
        const point = path.getPointAtLength(eased * length);
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

  private cancelDataTransition(): void {
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
      ?.querySelectorAll(
        '.solaris-line-chart__transition-overlay, .solaris-line-chart__pen',
      )
      .forEach((node) => node.remove());
    native
      ?.querySelectorAll<SVGPathElement>('.solaris-line-chart__line')
      .forEach((path) => {
        path.style.strokeDasharray = '';
        path.style.strokeDashoffset = '';
      });
    this.setRowVisibility(native, true);
    this.setAxesVisibility(native, true);
    const group = native?.querySelector('.solaris-line-chart__series-group');
    if (group) (group as SVGGElement).style.opacity = '';
  }

  protected readonly selectionGuide = computed(() => {
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
