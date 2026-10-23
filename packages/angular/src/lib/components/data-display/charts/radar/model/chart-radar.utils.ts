import { resolveChartSeriesColor } from '../../model/chart-palette';
import type { SolarisRadarSeries } from './chart-radar.types';
import type {
  SolarisRadarFrame,
  SolarisRadarFrameOptions,
  SolarisRadarSeriesGeometry,
  SolarisRadarTooltipSide,
} from './chart-radar.types';

export const SOLARIS_RADAR_CHART_WIDTH = 320;
export const SOLARIS_RADAR_CHART_HEIGHT = 300;
export const SOLARIS_RADAR_CHART_RADIUS = 104;
export const SOLARIS_RADAR_CHART_LEVELS = 4;
export const SOLARIS_RADAR_CHART_ANCHOR_OFFSET = 14;
export const SOLARIS_RADAR_CHART_LABEL_OFFSET = 26;
export const SOLARIS_RADAR_ENTER_SERIES_DELAY_MS = 120;
export const SOLARIS_RADAR_ENTER_SERIES_DURATION_MS = 480;

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

export function resolveRadarMax(
  series: readonly SolarisRadarSeries[],
  explicitMax?: number,
): number {
  if (
    explicitMax !== undefined &&
    isPlottable(explicitMax) &&
    explicitMax > 0
  ) {
    return explicitMax;
  }
  let peak = Number.NaN;
  for (const entry of series) {
    for (const value of entry.values) {
      if (!isPlottable(value) || value < 0) continue;
      if (!isPlottable(peak) || value > peak) peak = value;
    }
  }
  if (!isPlottable(peak) || peak <= 0) return 1;
  return peak;
}

export function visibleRadarSeries(
  series: readonly SolarisRadarSeries[],
): SolarisRadarSeries[] {
  return series.filter((entry) => entry.hidden !== true);
}

export function radarVertexPoint(
  centerX: number,
  centerY: number,
  radius: number,
  fraction: number,
  axisIndex: number,
  axisCount: number,
): { readonly x: number; readonly y: number } {
  const clamped = Math.min(Math.max(fraction, 0), 1);
  const safeCount = axisCount > 0 ? axisCount : 1;
  const angle = (-90 + (axisIndex * 360) / safeCount) * (Math.PI / 180);
  return {
    x: roundCoordinate(centerX + radius * clamped * Math.cos(angle)),
    y: roundCoordinate(centerY + radius * clamped * Math.sin(angle)),
  };
}

export function radarPolygonPath(
  points: readonly { readonly x: number; readonly y: number }[],
): string {
  if (points.length === 0) return '';
  const head = points[0];
  if (!head) return '';
  const segments = points.slice(1).map((point) => `L ${point.x} ${point.y}`);
  return [`M ${head.x} ${head.y}`, ...segments, 'Z'].join(' ');
}

export function radarSeriesFill(colorVar: string): string {
  return `color-mix(in srgb, ${colorVar} 22%, transparent)`;
}

export function buildRadarFrame(
  axes: readonly string[],
  series: readonly SolarisRadarSeries[],
  options: SolarisRadarFrameOptions = {},
): SolarisRadarFrame {
  const axisCount = axes.length;
  const centerX = roundCoordinate(SOLARIS_RADAR_CHART_WIDTH / 2);
  const centerY = roundCoordinate(SOLARIS_RADAR_CHART_HEIGHT / 2);
  const radius = SOLARIS_RADAR_CHART_RADIUS;
  const max = resolveRadarMax(series, options.max);
  const levels = Math.max(
    1,
    Math.floor(resolveSize(options.levels, SOLARIS_RADAR_CHART_LEVELS)),
  );
  const empty: SolarisRadarFrame = {
    width: SOLARIS_RADAR_CHART_WIDTH,
    height: SOLARIS_RADAR_CHART_HEIGHT,
    centerX,
    centerY,
    radius,
    max,
    rings: [],
    axisEnds: [],
    series: [],
  };
  if (axisCount < 3) return empty;
  const rings = Array.from({ length: levels }, (_, level) => {
    const fraction = (level + 1) / levels;
    return axes.map((_, axisIndex) =>
      radarVertexPoint(
        centerX,
        centerY,
        radius,
        fraction,
        axisIndex,
        axisCount,
      ),
    );
  });
  const axisEnds = axes.map((_, axisIndex) =>
    radarVertexPoint(centerX, centerY, radius, 1, axisIndex, axisCount),
  );
  const geometries: SolarisRadarSeriesGeometry[] = series.map(
    (entry, seriesIndex) => {
      const fractions = axes.map((_, axisIndex) => {
        const raw = entry.values[axisIndex];
        if (!isPlottable(raw) || raw < 0) return 0;
        return Math.min(Math.max(raw / max, 0), 1);
      });
      const points = fractions.map((fraction, axisIndex) =>
        radarVertexPoint(
          centerX,
          centerY,
          radius,
          fraction,
          axisIndex,
          axisCount,
        ),
      );
      const colorVar = resolveChartSeriesColor(seriesIndex, entry.color);
      return {
        id: entry.id,
        label: entry.label,
        colorVar,
        fractions,
        points,
        path: radarPolygonPath(points),
        vertices: points.map((point, axisIndex) => ({
          seriesId: entry.id,
          axisIndex,
          x: point.x,
          y: point.y,
          value: isPlottable(entry.values[axisIndex])
            ? (entry.values[axisIndex] as number)
            : null,
          fraction: fractions[axisIndex] ?? 0,
        })),
      };
    },
  );
  return { ...empty, rings, axisEnds, series: geometries };
}

export function radarAnchorPoint(
  vertex: { readonly x: number; readonly y: number },
  center: { readonly x: number; readonly y: number },
  offset = SOLARIS_RADAR_CHART_ANCHOR_OFFSET,
): { readonly x: number; readonly y: number } {
  const dx = vertex.x - center.x;
  const dy = vertex.y - center.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  if (distance <= 0) {
    return { x: vertex.x, y: vertex.y - Math.max(0, offset) };
  }
  const scale = (distance + Math.max(0, offset)) / distance;
  return {
    x: roundCoordinate(center.x + dx * scale),
    y: roundCoordinate(center.y + dy * scale),
  };
}

export function radarTooltipSide(
  axisIndex: number,
  axisCount: number,
): SolarisRadarTooltipSide {
  const safeCount = axisCount > 0 ? axisCount : 1;
  const safeIndex = Number.isFinite(axisIndex) ? axisIndex : 0;
  const normalized = ((((safeIndex * 360) / safeCount) % 360) + 360) % 360;
  if (normalized >= 45 && normalized < 135) return 'right';
  if (normalized >= 135 && normalized < 225) return 'bottom';
  if (normalized >= 225 && normalized < 315) return 'left';
  return 'top';
}

export function easeOutRadar(fraction: number): number {
  const clamped = Math.min(Math.max(fraction, 0), 1);
  return 1 - (1 - clamped) ** 3;
}

export function radarEnterProgress(
  elapsedMs: number,
  position: number,
): number {
  const safePosition = Number.isFinite(position) ? Math.max(0, position) : 0;
  return easeOutRadar(
    (elapsedMs - safePosition * SOLARIS_RADAR_ENTER_SERIES_DELAY_MS) /
      SOLARIS_RADAR_ENTER_SERIES_DURATION_MS,
  );
}

export function radarEnterTotalMs(seriesCount: number): number {
  const safeCount = Number.isFinite(seriesCount) ? Math.max(0, seriesCount) : 0;
  if (safeCount === 0) return 0;
  return (
    (safeCount - 1) * SOLARIS_RADAR_ENTER_SERIES_DELAY_MS +
    SOLARIS_RADAR_ENTER_SERIES_DURATION_MS
  );
}

export function clampRadarPercent(value: number): number {
  if (!Number.isFinite(value)) return 50;
  return Math.min(86, Math.max(14, value));
}
