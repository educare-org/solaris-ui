import { resolveChartSeriesColor } from '../../model/chart-palette';
import {
  normalizeStacked100,
  resolveChartDomain,
  resolveChartTicks,
} from '../../model/chart-scale.utils';
import type { SolarisChartSeries } from '../../model/chart.types';
import type {
  SolarisBarChartBarGeometry,
  SolarisBarChartDomain,
  SolarisBarChartFrame,
  SolarisBarChartFrameOptions,
  SolarisBarChartLayout,
  SolarisBarChartOrientation,
  SolarisBarChartPadding,
  SolarisBarChartPlot,
  SolarisBarChartSeriesGeometry,
} from './chart-bar.types';

export const SOLARIS_BAR_CHART_WIDTH = 600;
export const SOLARIS_BAR_CHART_HEIGHT = 280;

export const SOLARIS_BAR_CHART_PADDING: SolarisBarChartPadding = {
  top: 12,
  right: 12,
  bottom: 28,
  left: 56,
};

export const SOLARIS_BAR_CHART_HORIZONTAL_PADDING: SolarisBarChartPadding = {
  top: 12,
  right: 12,
  bottom: 28,
  left: 128,
};

const GROUP_FRACTION = 0.64;

function isPlottable(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function roundCoordinate(value: number): number {
  return Number(value.toFixed(2));
}

function resolveSize(value: number | undefined, fallback: number): number {
  if (value === undefined || !Number.isFinite(value) || value <= 0) {
    return fallback;
  }
  return value;
}

function resolvePlot(
  width: number,
  height: number,
  padding: SolarisBarChartPadding,
): SolarisBarChartPlot {
  return {
    left: padding.left,
    top: padding.top,
    width: Math.max(1, width - padding.left - padding.right),
    height: Math.max(1, height - padding.top - padding.bottom),
  };
}

function toRatio(min: number, max: number): (value: number) => number {
  const span = max - min;
  return (value: number): number => (span === 0 ? 0.5 : (value - min) / span);
}

function resolveTicks(
  domain: SolarisBarChartDomain,
  maxTicks: number,
): { readonly domain: SolarisBarChartDomain; readonly ticks: number[] } {
  const raw = resolveChartTicks(domain.min, domain.max, maxTicks);
  if (raw.length === 0) return { domain, ticks: [] };
  return {
    domain: {
      min: Math.min(domain.min, raw[0]),
      max: Math.max(domain.max, raw[raw.length - 1]),
    },
    ticks: raw,
  };
}

export function resolveBarLabelEvery(count: number, available: number): number {
  if (count <= 0) return 1;
  if (!(available > 0)) return 1;
  if (available < 420) return Math.max(2, Math.ceil(count / 6));
  return Math.max(1, Math.ceil(count / 15));
}

export function truncateBarCategoryLabel(
  label: string,
  maxLength = 18,
): string {
  if (maxLength < 2) return '…';
  if (label.length <= maxLength) return label;
  return `${label.slice(0, maxLength - 1).trimEnd()}…`;
}

export function resolveMorphSeriesDelay(
  seriesIndex: number,
  phaseMs: number,
): string {
  const safeSeries = Number.isFinite(seriesIndex)
    ? Math.max(0, seriesIndex)
    : 0;
  const safePhase = Number.isFinite(phaseMs) ? Math.max(0, phaseMs) : 0;
  return `${safeSeries * safePhase}ms`;
}

export interface SolarisBarCornerFlags {
  readonly roundTop: boolean;
  readonly roundBottom: boolean;
  readonly roundLeft: boolean;
  readonly roundRight: boolean;
}

function groupedCorners(
  value: number,
  horizontal: boolean,
): SolarisBarCornerFlags {
  if (horizontal) {
    return {
      roundTop: true,
      roundBottom: true,
      roundLeft: value < 0,
      roundRight: value >= 0,
    };
  }
  return {
    roundTop: value >= 0,
    roundBottom: value < 0,
    roundLeft: true,
    roundRight: true,
  };
}

function applyStackedCorners(
  seriesGeometries: SolarisBarChartSeriesGeometry[],
  count: number,
  horizontal: boolean,
): void {
  for (let index = 0; index < count; index += 1) {
    const ordered: SolarisBarChartBarGeometry[] = [];
    for (const row of seriesGeometries) {
      const bar = row.bars.find((entry) => entry.index === index);
      if (bar) ordered.push(bar);
    }
    const positives = ordered.filter((bar) => bar.value > 0);
    const negatives = ordered.filter((bar) => bar.value < 0);
    const lastPositive = positives.at(-1);
    const lastNegative = negatives.at(-1);
    for (const row of seriesGeometries) {
      const bars = row.bars as SolarisBarChartBarGeometry[];
      for (let i = 0; i < bars.length; i += 1) {
        const bar = bars[i];
        if (bar?.index !== index) continue;
        if (bar.value > 0) {
          const isTip = bar === lastPositive;
          bars[i] = {
            ...bar,
            roundTop: horizontal ? true : isTip,
            roundBottom: !!horizontal,
            roundLeft: !horizontal,
            roundRight: horizontal ? isTip : true,
          };
        } else if (bar.value < 0) {
          const isTip = bar === lastNegative;
          bars[i] = {
            ...bar,
            roundTop: !!horizontal,
            roundBottom: horizontal ? true : isTip,
            roundLeft: horizontal ? isTip : true,
            roundRight: !horizontal,
          };
        }
      }
    }
  }
}

function applyGroupedCorners(
  seriesGeometries: SolarisBarChartSeriesGeometry[],
  horizontal: boolean,
): void {
  for (const row of seriesGeometries) {
    const bars = row.bars as SolarisBarChartBarGeometry[];
    for (let i = 0; i < bars.length; i += 1) {
      const bar = bars[i];
      if (!bar) continue;
      bars[i] = { ...bar, ...groupedCorners(bar.value, horizontal) };
    }
  }
}

export function roundedBarPath(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  corners: SolarisBarCornerFlags,
): string {
  // Always emits the same segment structure (M H A V A H A V A Z) so CSS
  // `d` transitions can interpolate between any two bar geometries, e.g.
  // grouped <-> stacked or collapsed <-> grown. Square corners use
  // zero-radius arcs, which render as straight lines.
  const w = Math.max(0, width);
  const h = Math.max(0, height);
  const r = radius > 0 ? Math.min(radius, w / 2, h / 2) : 0;
  const tl = corners.roundTop && corners.roundLeft ? r : 0;
  const tr = corners.roundTop && corners.roundRight ? r : 0;
  const br = corners.roundBottom && corners.roundRight ? r : 0;
  const bl = corners.roundBottom && corners.roundLeft ? r : 0;
  const fixed = (value: number): string => Number(value.toFixed(2)).toString();
  let d = `M ${fixed(x + tl)} ${fixed(y)}`;
  d += ` H ${fixed(x + w - tr)}`;
  d += ` A ${fixed(tr)} ${fixed(tr)} 0 0 1 ${fixed(x + w)} ${fixed(y + tr)}`;
  d += ` V ${fixed(y + h - br)}`;
  d += ` A ${fixed(br)} ${fixed(br)} 0 0 1 ${fixed(x + w - br)} ${fixed(y + h)}`;
  d += ` H ${fixed(x + bl)}`;
  d += ` A ${fixed(bl)} ${fixed(bl)} 0 0 1 ${fixed(x)} ${fixed(y + h - bl)}`;
  d += ` V ${fixed(y + tl)}`;
  d += ` A ${fixed(tl)} ${fixed(tl)} 0 0 1 ${fixed(x + tl)} ${fixed(y)}`;
  d += ' Z';
  return d;
}

export function barChartValuePosition(
  value: number,
  domain: { readonly min: number; readonly max: number },
  plot: SolarisBarChartPlot,
  orientation: SolarisBarChartOrientation,
): number {
  const ratio = toRatio(domain.min, domain.max);
  return orientation === 'vertical'
    ? roundCoordinate(plot.top + (1 - ratio(value)) * plot.height)
    : roundCoordinate(plot.left + ratio(value) * plot.width);
}

function visibleEntries(
  series: readonly SolarisChartSeries[],
): SolarisChartSeries[] {
  return series.filter((entry) => entry.hidden !== true);
}

function categoryCount(series: readonly SolarisChartSeries[]): number {
  return series.reduce((max, entry) => Math.max(max, entry.points.length), 0);
}

function pointValue(
  series: readonly SolarisChartSeries[],
  seriesIndex: number,
  categoryIndex: number,
): number | null {
  const value = series[seriesIndex]?.points[categoryIndex]?.y;
  return isPlottable(value) ? value : null;
}

function resolveValueDomain(
  visible: readonly SolarisChartSeries[],
  layout: SolarisBarChartLayout,
  count: number,
): SolarisBarChartDomain {
  if (layout === 'stacked-100') return { min: 0, max: 100 };
  if (layout === 'stacked') {
    const extremes: number[] = [];
    for (let index = 0; index < count; index += 1) {
      let up = 0;
      let down = 0;
      for (const entry of visible) {
        const value = entry.points[index]?.y;
        if (!isPlottable(value)) continue;
        if (value >= 0) up += value;
        else down += value;
      }
      extremes.push(up, down);
    }
    return resolveChartDomain(extremes, {
      includeZero: true,
      paddingRatio: 0.08,
    });
  }
  const values: number[] = [];
  for (const entry of visible) {
    for (const point of entry.points) {
      if (isPlottable(point.y)) values.push(point.y);
    }
  }
  return resolveChartDomain(values, {
    includeZero: true,
    paddingRatio: 0.08,
  });
}

export function buildBarChartFrame(
  series: readonly SolarisChartSeries[],
  options: SolarisBarChartFrameOptions = {},
): SolarisBarChartFrame {
  const width = resolveSize(options.width, SOLARIS_BAR_CHART_WIDTH);
  const height = resolveSize(options.height, SOLARIS_BAR_CHART_HEIGHT);
  const orientation: SolarisBarChartOrientation =
    options.orientation ?? 'vertical';
  const layout: SolarisBarChartLayout = options.layout ?? 'grouped';
  const visible = visibleEntries(series);
  const count = categoryCount(visible);
  const padding: SolarisBarChartPadding =
    orientation === 'horizontal'
      ? SOLARIS_BAR_CHART_HORIZONTAL_PADDING
      : SOLARIS_BAR_CHART_PADDING;
  const plot = resolvePlot(width, height, padding);

  if (count === 0) {
    return {
      width,
      height,
      plot,
      domain: { min: 0, max: 1 },
      baseline: plot.top + plot.height,
      categoryCenters: [],
      valueTicks: [],
      series: [],
    };
  }

  const horizontal = orientation === 'horizontal';
  const band = horizontal ? plot.height / count : plot.width / count;
  const centers = Array.from({ length: count }, (_, index) =>
    roundCoordinate(
      horizontal
        ? plot.top + band * (index + 0.5)
        : plot.left + band * (index + 0.5),
    ),
  );

  const domain = resolveTicks(resolveValueDomain(visible, layout, count), 5);
  const ratio = toRatio(domain.domain.min, domain.domain.max);
  const project = (value: number): number =>
    horizontal
      ? roundCoordinate(plot.left + ratio(value) * plot.width)
      : roundCoordinate(plot.top + (1 - ratio(value)) * plot.height);
  const clamp = (pixel: number, start: number, end: number): number =>
    Math.min(Math.max(pixel, start), end);
  const baseline = horizontal
    ? clamp(project(0), plot.left, plot.left + plot.width)
    : clamp(project(0), plot.top, plot.top + plot.height);

  const normalized =
    layout === 'stacked-100'
      ? normalizeStacked100(
          visible.map((entry) => entry.points.map((point) => point.y)),
        )
      : null;

  const groupWidth = band * GROUP_FRACTION;
  const slotCount = Math.max(visible.length, 1);
  const gap = slotCount > 1 ? Math.min(3, groupWidth * 0.06) : 0;
  const barThickness =
    layout === 'grouped'
      ? Math.max(1, (groupWidth - gap * (slotCount - 1)) / slotCount)
      : groupWidth;

  const positives = new Array<number>(count).fill(0);
  const negatives = new Array<number>(count).fill(0);
  const seriesGeometries: SolarisBarChartSeriesGeometry[] = visible.map(
    (entry, seriesIndex) => {
      const colorVar = resolveChartSeriesColor(
        series.indexOf(entry),
        entry.color,
      );
      const bars: SolarisBarChartBarGeometry[] = [];
      for (let index = 0; index < count; index += 1) {
        const center = centers[index] ?? 0;
        if (layout === 'stacked' || layout === 'stacked-100') {
          const raw =
            layout === 'stacked-100'
              ? (normalized?.[seriesIndex]?.[index] ?? 0)
              : pointValue(visible, seriesIndex, index);
          if (raw === null || raw === 0) continue;
          const from = raw >= 0 ? positives[index] : negatives[index];
          const to = from + raw;
          if (raw >= 0) positives[index] = to;
          else negatives[index] = to;
          const start = project(from);
          const end = project(to);
          const stackedCorners: SolarisBarCornerFlags = horizontal
            ? {
                roundTop: true,
                roundBottom: true,
                roundLeft: false,
                roundRight: false,
              }
            : {
                roundTop: false,
                roundBottom: false,
                roundLeft: true,
                roundRight: true,
              };
          bars.push(
            horizontal
              ? {
                  seriesId: entry.id,
                  index,
                  value: raw,
                  x: Math.min(start, end),
                  y: roundCoordinate(center - groupWidth / 2),
                  width: Math.abs(end - start),
                  height: groupWidth,
                  colorVar,
                  ...stackedCorners,
                }
              : {
                  seriesId: entry.id,
                  index,
                  value: raw,
                  x: roundCoordinate(center - groupWidth / 2),
                  y: Math.min(start, end),
                  width: groupWidth,
                  height: Math.abs(end - start),
                  colorVar,
                  ...stackedCorners,
                },
          );
          continue;
        }
        const value = pointValue(visible, seriesIndex, index);
        if (value === null) continue;
        const edge = project(value);
        const slot =
          center - groupWidth / 2 + seriesIndex * (barThickness + gap);
        const corners = groupedCorners(value, horizontal);
        bars.push(
          horizontal
            ? {
                seriesId: entry.id,
                index,
                value,
                x: Math.min(baseline, edge),
                y: roundCoordinate(slot),
                width: Math.abs(edge - baseline),
                height: barThickness,
                colorVar,
                ...corners,
              }
            : {
                seriesId: entry.id,
                index,
                value,
                x: roundCoordinate(slot),
                y: Math.min(baseline, edge),
                width: barThickness,
                height: Math.abs(edge - baseline),
                colorVar,
                ...corners,
              },
        );
      }
      return { id: entry.id, label: entry.label, colorVar, bars };
    },
  );

  if (layout === 'stacked' || layout === 'stacked-100') {
    applyStackedCorners(seriesGeometries, count, horizontal);
  } else {
    applyGroupedCorners(seriesGeometries, horizontal);
  }

  return {
    width,
    height,
    plot,
    domain: domain.domain,
    baseline,
    categoryCenters: centers,
    valueTicks: domain.ticks.map((value) => ({
      value,
      position: project(value),
    })),
    series: seriesGeometries,
  };
}
