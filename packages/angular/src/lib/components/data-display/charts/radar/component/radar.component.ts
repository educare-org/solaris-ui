// SECURITY_EXCEPTION_FILE: nativeElement is used only as a scoped query
// root to move focus between SVG vertices. No innerHTML is used; style writes
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
import { resolveChartFallback } from '../../model/strings/chart-strings';
import {
  SOLARIS_RADAR_CHART_ANCHOR_OFFSET,
  SOLARIS_RADAR_CHART_LABEL_OFFSET,
  SOLARIS_RADAR_ENTER_SERIES_DURATION_MS,
  buildRadarFrame,
  clampRadarPercent,
  radarAnchorPoint,
  radarEnterProgress,
  radarEnterTotalMs,
  radarPolygonPath,
  radarSeriesFill,
  radarTooltipSide,
  radarVertexPoint,
  visibleRadarSeries,
} from '../model/chart-radar.utils';
import type {
  SolarisRadarDensity,
  SolarisRadarSeries,
  SolarisRadarSize,
  SolarisRadarValueFormatter,
  SolarisRadarVertexEvent,
} from '../model/chart-radar.types';

interface SolarisRadarFocusMark {
  readonly seriesId: string;
  readonly axisIndex: number;
  readonly position: number;
}

function sameVertex(
  left: { seriesId: string; axisIndex: number } | null,
  right: { seriesId: string; axisIndex: number } | null,
): boolean {
  if (left === null || right === null) return left === right;
  return left.seriesId === right.seriesId && left.axisIndex === right.axisIndex;
}

@Component({
  selector: 'solaris-radar',
  standalone: true,
  templateUrl: './radar.component.html',
  styleUrls: ['./radar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-radar',
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-entering]': 'entering() ? "" : null',
  },
})
export class SolarisRadarComponent implements OnDestroy {
  readonly axes = input.required<readonly string[]>();
  readonly series = input<readonly SolarisRadarSeries[]>([]);
  readonly locale = input.required<string>();
  readonly max = input<number | undefined>(undefined);
  readonly levels = input<number | undefined>(undefined);
  readonly valueFormat = input<SolarisRadarValueFormatter | undefined>(
    undefined,
  );
  readonly showVertices = input(true);
  readonly size = input<SolarisRadarSize>('md');
  readonly density = input<SolarisRadarDensity | undefined>(undefined);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelKey = input<string | undefined>(undefined);

  readonly vertexSelect = output<SolarisRadarVertexEvent>();
  readonly seriesToggle = output<string>();

  private readonly platformId = inject(PLATFORM_ID);
  private readonly elementRef = inject(ElementRef);
  protected readonly themeService = inject(SolarisThemeService);
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });

  private readonly hiddenIds = signal<readonly string[]>([]);
  private readonly hoveredVertex = signal<SolarisRadarVertexEvent | null>(null);
  private readonly selectedVertex = signal<SolarisRadarVertexEvent | null>(
    null,
  );
  private readonly focusedVertex = signal<SolarisRadarVertexEvent | null>(null);
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

  protected readonly toggledSeries = computed(() =>
    visibleRadarSeries(this.series()),
  );

  protected readonly frame = computed(() =>
    buildRadarFrame(this.axes(), this.toggledSeries(), {
      max: this.max(),
      levels: this.levels(),
    }),
  );

  protected readonly isEmpty = computed(
    () => this.axes().length < 3 || this.displayFrame().series.length === 0,
  );

  protected readonly enterKey = computed(() => {
    const data = this.series()
      .map(
        (entry) =>
          `${entry.id}:${entry.hidden === true}:${entry.values.join(',')}`,
      )
      .join('|');
    return `${this.axes().join('|')}|${data}|${this.max() ?? ''}|${this.levels() ?? ''}`;
  });

  protected readonly enterTotalMs = computed(() =>
    Math.max(
      radarEnterTotalMs(this.frame().series.length),
      SOLARIS_RADAR_ENTER_SERIES_DURATION_MS,
    ),
  );

  protected readonly entering = computed(
    () => this.enterElapsed() < this.enterTotalMs(),
  );

  protected readonly displayFrame = computed(() => {
    const target = this.frame();
    const hidden = this.hiddenIds();
    const visible = target.series.filter(
      (geometry) => !hidden.includes(geometry.id),
    );
    const total = this.enterTotalMs();
    const elapsed = this.enterElapsed();
    const axisCount = this.axes().length;
    if (elapsed >= total || visible.length === 0) {
      return { ...target, series: visible };
    }
    const series = visible.map((geometry) => {
      const position = target.series.findIndex(
        (entry) => entry.id === geometry.id,
      );
      const progress = radarEnterProgress(elapsed, Math.max(0, position));
      if (progress >= 1) return geometry;
      const fractions = geometry.fractions.map(
        (fraction) => Math.round(fraction * progress * 100) / 100,
      );
      const points = fractions.map((fraction, axisIndex) =>
        radarVertexPoint(
          target.centerX,
          target.centerY,
          target.radius,
          fraction,
          axisIndex,
          axisCount,
        ),
      );
      return {
        ...geometry,
        points,
        path: radarPolygonPath(points),
        vertices: geometry.vertices.map((vertex, axisIndex) => ({
          ...vertex,
          x: points[axisIndex]?.x ?? vertex.x,
          y: points[axisIndex]?.y ?? vertex.y,
        })),
      };
    });
    return { ...target, series };
  });

  protected readonly focusMarks = computed<SolarisRadarFocusMark[]>(() => {
    const marks: SolarisRadarFocusMark[] = [];
    for (const geometry of this.displayFrame().series) {
      for (const vertex of geometry.vertices) {
        marks.push({
          seriesId: vertex.seriesId,
          axisIndex: vertex.axisIndex,
          position: marks.length,
        });
      }
    }
    return marks;
  });

  protected readonly resolvedValueFormat = computed(() => {
    const custom = this.valueFormat();
    if (custom !== undefined) return custom;
    const formatter = new Intl.NumberFormat(this.locale(), {
      maximumFractionDigits: 1,
    });
    return (value: number): string => formatter.format(value);
  });

  protected formatVertexValue(value: number | null): string {
    if (value === null) return '—';
    return this.resolvedValueFormat()(value);
  }

  protected readonly summary = computed(() => {
    if (this.ariaLabel() !== undefined) return this.ariaLabel();
    if (this.ariaLabelKey() !== undefined) {
      return this.translate(this.ariaLabelKey() as string, {});
    }
    const frame = this.displayFrame();
    const visibleParts = frame.series.map((geometry) => {
      const values = geometry.vertices.map((vertex) =>
        this.formatVertexValue(vertex.value),
      );
      return `${geometry.label}: ${values.join(', ')}`;
    });
    return `Radar ${this.axes().length} axes; ${visibleParts.join('; ')}`;
  });

  protected readonly tooltip = computed(() => {
    const mark = this.hoveredVertex() ?? this.focusedVertex();
    if (mark === null || this.isEmpty()) return null;
    const geometry = this.displayFrame().series.find(
      (entry) => entry.id === mark.seriesId,
    );
    const vertex = geometry?.vertices.find(
      (entry) => entry.axisIndex === mark.axisIndex,
    );
    if (!geometry || !vertex) return null;
    const frame = this.frame();
    const anchor = radarAnchorPoint(
      vertex,
      { x: frame.centerX, y: frame.centerY },
      SOLARIS_RADAR_CHART_ANCHOR_OFFSET,
    );
    const axisLabel = this.axes()[vertex.axisIndex] ?? '';
    return {
      seriesLabel: geometry.label,
      axisLabel,
      formattedValue:
        vertex.value === null ? null : this.resolvedValueFormat()(vertex.value),
      leftPercent: clampRadarPercent((anchor.x / frame.width) * 100),
      topPercent: clampRadarPercent((anchor.y / frame.height) * 100),
      side: radarTooltipSide(vertex.axisIndex, this.axes().length),
    };
  });

  protected axisLabelPosition(axisIndex: number): {
    readonly x: number;
    readonly y: number;
  } {
    const frame = this.frame();
    const end = frame.axisEnds[axisIndex] ?? {
      x: frame.centerX,
      y: frame.centerY,
    };
    return radarAnchorPoint(
      end,
      { x: frame.centerX, y: frame.centerY },
      SOLARIS_RADAR_CHART_LABEL_OFFSET,
    );
  }

  protected vertexKey(seriesId: string, axisIndex: number): string {
    return `${seriesId}:${axisIndex}`;
  }

  protected seriesFill(colorVar: string): string {
    return radarSeriesFill(colorVar);
  }

  protected isSeriesHidden(id: string): boolean {
    return this.hiddenIds().includes(id);
  }

  protected legendPressed(id: string): boolean {
    return !this.isSeriesHidden(id);
  }

  protected legendFilterLabel(): string {
    return this.translate('solaris.chart.legendFilter', {});
  }

  protected legendToggleLabel(label: string): string {
    return this.translate('solaris.chart.legendToggle', { label });
  }

  protected onLegendToggle(id: string): void {
    const hidden = this.hiddenIds();
    this.hiddenIds.set(
      hidden.includes(id)
        ? hidden.filter((entry) => entry !== id)
        : [...hidden, id],
    );
    this.seriesToggle.emit(id);
  }

  protected markTabIndex(seriesId: string, axisIndex: number): number {
    const focused = this.focusedVertex();
    if (focused === null) {
      const first = this.focusMarks()[0];
      return first?.seriesId === seriesId && first.axisIndex === axisIndex
        ? 0
        : -1;
    }
    return focused.seriesId === seriesId && focused.axisIndex === axisIndex
      ? 0
      : -1;
  }

  protected isMarkActive(seriesId: string, axisIndex: number): boolean {
    const candidate = { seriesId, axisIndex };
    const hovered = this.hoveredVertex();
    if (hovered !== null) return sameVertex(hovered, candidate);
    const selected = this.selectedVertex();
    if (selected !== null) return sameVertex(selected, candidate);
    return sameVertex(this.focusedVertex(), candidate);
  }

  protected vertexAriaLabel(seriesId: string, axisIndex: number): string {
    const geometry = this.frame().series.find((entry) => entry.id === seriesId);
    const vertex = geometry?.vertices.find(
      (entry) => entry.axisIndex === axisIndex,
    );
    if (!geometry || !vertex) return seriesId;
    const axisLabel = this.axes()[axisIndex] ?? '';
    return `${geometry.label}, ${axisLabel}: ${this.formatVertexValue(vertex.value)}`;
  }

  protected onVertexHover(seriesId: string, axisIndex: number): void {
    this.hoveredVertex.set({ seriesId, axisIndex });
  }

  protected onVerticesLeave(): void {
    this.hoveredVertex.set(null);
  }

  protected onVertexFocus(seriesId: string, axisIndex: number): void {
    this.focusedVertex.set({ seriesId, axisIndex });
    this.hoveredVertex.set({ seriesId, axisIndex });
  }

  protected onVertexBlur(): void {
    this.focusedVertex.set(null);
    this.hoveredVertex.set(null);
  }

  protected onVertexActivate(seriesId: string, axisIndex: number): void {
    this.selectedVertex.set({ seriesId, axisIndex });
    this.vertexSelect.emit({ seriesId, axisIndex });
  }

  protected onVertexKeydown(
    event: KeyboardEvent,
    seriesId: string,
    axisIndex: number,
  ): void {
    const marks = this.focusMarks();
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onVertexActivate(seriesId, axisIndex);
      return;
    }
    const position = marks.findIndex(
      (mark) => mark.seriesId === seriesId && mark.axisIndex === axisIndex,
    );
    if (position === -1) return;
    const axisCount = this.axes().length;
    const seriesStart = position - axisIndex;
    let nextAxis = axisIndex;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextAxis = Math.min(axisIndex + 1, axisCount - 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextAxis = Math.max(axisIndex - 1, 0);
    } else if (event.key === 'Home') {
      nextAxis = 0;
    } else if (event.key === 'End') {
      nextAxis = axisCount - 1;
    } else {
      return;
    }
    if (nextAxis === axisIndex) return;
    const target = marks[seriesStart + nextAxis];
    if (!target) return;
    event.preventDefault();
    this.focusedVertex.set({
      seriesId: target.seriesId,
      axisIndex: target.axisIndex,
    });
    this.hoveredVertex.set({
      seriesId: target.seriesId,
      axisIndex: target.axisIndex,
    });
    const native = this.elementRef.nativeElement as HTMLElement;
    native
      .querySelector<SVGGraphicsElement>(
        `[data-vertex="${this.vertexKey(target.seriesId, target.axisIndex)}"]`,
      )
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
