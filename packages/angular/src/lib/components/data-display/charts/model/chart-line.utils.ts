import { resolveChartSeriesColor } from './chart-palette';
import { resolveChartDomain, resolveChartTicks } from './chart-scale.utils';
import type {
  SolarisChartInterpolation,
  SolarisChartSeries,
} from './chart.types';
import type {
  SolarisLineChartDomain,
  SolarisLineChartFrame,
  SolarisLineChartFrameOptions,
  SolarisLineChartPadding,
  SolarisLineChartPixel,
  SolarisLineChartPlot,
  SolarisLineChartSeriesGeometry,
  SolarisSparklineGeometry,
  SolarisSparklineGeometryOptions,
} from './chart-line.types';

export const SOLARIS_LINE_CHART_WIDTH = 600;
export const SOLARIS_LINE_CHART_HEIGHT = 260;

export const SOLARIS_LINE_CHART_PADDING: SolarisLineChartPadding = {
  top: 12,
  right: 12,
  bottom: 28,
  left: 56,
};

export const SOLARIS_SPARKLINE_WIDTH = 120;
export const SOLARIS_SPARKLINE_HEIGHT = 40;
const SPARKLINE_PAD = 3;

function isPlottable(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function roundCoordinate(value: number): number {
  return Number(value.toFixed(2));
}

function formatCoordinate(value: number): string {
  return `${roundCoordinate(value)}`;
}

function resolveSize(value: number | undefined, fallback: number): number {
  if (value === undefined || !Number.isFinite(value) || value <= 0) {
    return fallback;
  }
  return value;
}

function resolveMode(
  interpolation: SolarisChartInterpolation | undefined,
  step: boolean | undefined,
): SolarisChartInterpolation {
  if (step === true) return 'step';
  return interpolation ?? 'smooth';
}

function smoothSegmentPath(points: readonly SolarisLineChartPixel[]): string {
  let path = `M${formatCoordinate(points[0].x)},${formatCoordinate(points[0].y)}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    path += `C${formatCoordinate(c1x)},${formatCoordinate(c1y)} ${formatCoordinate(c2x)},${formatCoordinate(c2y)} ${formatCoordinate(p2.x)},${formatCoordinate(p2.y)}`;
  }
  return path;
}

export function buildSvgLinePath(
  points: readonly SolarisLineChartPixel[],
  mode: SolarisChartInterpolation = 'smooth',
): string {
  if (points.length === 0) return '';
  if (points.length === 1) {
    return `M${formatCoordinate(points[0].x)},${formatCoordinate(points[0].y)}`;
  }
  if (mode === 'step') {
    let path = `M${formatCoordinate(points[0].x)},${formatCoordinate(points[0].y)}`;
    for (let i = 1; i < points.length; i += 1) {
      path += `H${formatCoordinate(points[i].x)}V${formatCoordinate(points[i].y)}`;
    }
    return path;
  }
  if (mode === 'linear') {
    return points
      .map(
        (point) => `${formatCoordinate(point.x)},${formatCoordinate(point.y)}`,
      )
      .join('L')
      .replace(/^/, 'M');
  }
  return smoothSegmentPath(points);
}

export function buildSvgAreaPath(
  points: readonly SolarisLineChartPixel[],
  baselineY: number,
  mode: SolarisChartInterpolation = 'smooth',
): string {
  if (points.length < 2) return '';
  const base = formatCoordinate(baselineY);
  const line = buildSvgLinePath(points, mode);
  const first = points[0];
  const last = points[points.length - 1];
  return `${line}L${formatCoordinate(last.x)},${base}L${formatCoordinate(first.x)},${base}Z`;
}

function scaleY(
  value: number,
  domain: SolarisLineChartDomain,
  plot: SolarisLineChartPlot,
): number {
  const span = domain.max - domain.min;
  const ratio = span === 0 ? 0.5 : 1 - (value - domain.min) / span;
  return plot.top + ratio * plot.height;
}

export function lineChartYPosition(
  value: number,
  domain: SolarisLineChartDomain,
  plot: SolarisLineChartPlot,
): number {
  return roundCoordinate(scaleY(value, domain, plot));
}

function resolvePlot(
  width: number,
  height: number,
  padding: SolarisLineChartPadding,
): SolarisLineChartPlot {
  return {
    left: padding.left,
    top: padding.top,
    width: Math.max(1, width - padding.left - padding.right),
    height: Math.max(1, height - padding.top - padding.bottom),
  };
}

function resolveXPositions(
  count: number,
  plot: SolarisLineChartPlot,
): number[] {
  if (count <= 1) return [roundCoordinate(plot.left + plot.width / 2)];
  return Array.from({ length: count }, (_, index) =>
    roundCoordinate(plot.left + (index * plot.width) / (count - 1)),
  );
}

export function buildLineChartFrame(
  series: readonly SolarisChartSeries[],
  options: SolarisLineChartFrameOptions = {},
): SolarisLineChartFrame {
  const width = resolveSize(options.width, SOLARIS_LINE_CHART_WIDTH);
  const height = resolveSize(options.height, SOLARIS_LINE_CHART_HEIGHT);
  const mode = resolveMode(options.interpolation, options.step);
  const plot = resolvePlot(width, height, SOLARIS_LINE_CHART_PADDING);
  const visible = series.filter((entry) => entry.hidden !== true);

  const pointCount = visible.reduce(
    (max, entry) => Math.max(max, entry.points.length),
    0,
  );
  const xPositions = resolveXPositions(pointCount, plot);

  const values: number[] = [];
  for (const entry of visible) {
    for (const point of entry.points) {
      if (isPlottable(point.y)) values.push(point.y);
    }
  }
  const paddedDomain = resolveChartDomain(values, { paddingRatio: 0.08 });
  const rawTicks = resolveChartTicks(paddedDomain.min, paddedDomain.max, 5);
  const domain =
    rawTicks.length === 0
      ? paddedDomain
      : {
          min: Math.min(paddedDomain.min, rawTicks[0]),
          max: Math.max(paddedDomain.max, rawTicks[rawTicks.length - 1]),
        };
  const baselineValue = Math.min(Math.max(0, domain.min), domain.max);
  const baselineY = roundCoordinate(scaleY(baselineValue, domain, plot));

  const yTicks = rawTicks.map((value) => ({
    value,
    y: roundCoordinate(scaleY(value, domain, plot)),
  }));

  const geometries: SolarisLineChartSeriesGeometry[] = visible.map((entry) => {
    const originalIndex = series.indexOf(entry);
    const dots = entry.points.map((point, index) => ({
      seriesId: entry.id,
      index,
      value: point.y,
      cx: xPositions[index] ?? plot.left,
      cy: isPlottable(point.y)
        ? roundCoordinate(scaleY(point.y, domain, plot))
        : null,
    }));
    const segments: SolarisLineChartPixel[][] = [];
    let current: SolarisLineChartPixel[] = [];
    for (const dot of dots) {
      if (dot.cy === null) {
        if (current.length > 0) {
          segments.push(current);
          current = [];
        }
        continue;
      }
      current.push({ x: dot.cx, y: dot.cy });
    }
    if (current.length > 0) segments.push(current);
    const linePath = segments
      .map((segment) => buildSvgLinePath(segment, mode))
      .filter((path) => path !== '')
      .join(' ');
    const areaPath = segments
      .map((segment) => buildSvgAreaPath(segment, baselineY, mode))
      .filter((path) => path !== '')
      .join(' ');
    return {
      id: entry.id,
      label: entry.label,
      colorVar: resolveChartSeriesColor(originalIndex, entry.color),
      linePath,
      areaPath,
      dots,
    };
  });

  return {
    width,
    height,
    plot,
    domain,
    baselineY,
    xPositions,
    yTicks,
    series: geometries,
  };
}

export function sumLineChartValuesAt(
  series: readonly SolarisChartSeries[],
  index: number,
): number | null {
  let total = 0;
  let found = false;
  for (const entry of series) {
    if (entry.hidden === true) continue;
    const value = entry.points[index]?.y;
    if (isPlottable(value)) {
      total += value;
      found = true;
    }
  }
  return found ? total : null;
}

export function buildSparklineGeometry(
  values: readonly (number | null | undefined)[],
  options: SolarisSparklineGeometryOptions = {},
): SolarisSparklineGeometry {
  const width = resolveSize(options.width, SOLARIS_SPARKLINE_WIDTH);
  const height = resolveSize(options.height, SOLARIS_SPARKLINE_HEIGHT);
  const mode = options.interpolation ?? 'smooth';
  const plot: SolarisLineChartPlot = {
    left: SPARKLINE_PAD,
    top: SPARKLINE_PAD,
    width: Math.max(1, width - SPARKLINE_PAD * 2),
    height: Math.max(1, height - SPARKLINE_PAD * 2),
  };
  const plottable = values.filter(isPlottable);
  if (plottable.length === 0) {
    return { width, height, linePath: '', areaPath: '', trend: 'flat' };
  }
  const domain = resolveChartDomain(plottable);
  const pixels: SolarisLineChartPixel[] = plottable.map((value, index) => ({
    x: roundCoordinate(
      plottable.length === 1
        ? plot.left + plot.width / 2
        : plot.left + (index * plot.width) / (plottable.length - 1),
    ),
    y: roundCoordinate(scaleY(value, domain, plot)),
  }));
  const baselineValue = Math.min(Math.max(0, domain.min), domain.max);
  const baselineY = roundCoordinate(scaleY(baselineValue, domain, plot));
  const first = plottable[0];
  const last = plottable[plottable.length - 1];
  return {
    width,
    height,
    linePath: buildSvgLinePath(pixels, mode),
    areaPath: buildSvgAreaPath(pixels, baselineY, mode),
    trend: last > first ? 'up' : last < first ? 'down' : 'flat',
  };
}
