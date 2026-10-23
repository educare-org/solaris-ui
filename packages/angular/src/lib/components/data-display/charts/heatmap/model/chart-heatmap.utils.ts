import type {
  SolarisHeatmapFrame,
  SolarisHeatmapFrameOptions,
  SolarisHeatmapRow,
  SolarisHeatmapTooltipSide,
} from './chart-heatmap.types';

export const SOLARIS_HEATMAP_CELL_SIZE = 32;
export const SOLARIS_HEATMAP_GAP = 4;
export const SOLARIS_HEATMAP_HEADER_HEIGHT = 28;
export const SOLARIS_HEATMAP_MIN_FILL_MIX = 8;
export const SOLARIS_HEATMAP_MAX_FILL_MIX = 92;
export const SOLARIS_HEATMAP_ENTER_CELL_DELAY_MS = 18;
export const SOLARIS_HEATMAP_ENTER_MAX_DELAY_MS = 540;
export const SOLARIS_HEATMAP_ANCHOR_GAP = 8;

function isPlottable(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function resolveSize(value: number | undefined, fallback: number): number {
  if (value === undefined || !Number.isFinite(value) || value <= 0) {
    return fallback;
  }
  return value;
}

export function resolveHeatmapMax(
  rows: readonly SolarisHeatmapRow[],
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
  for (const row of rows) {
    for (const value of row.values) {
      if (!isPlottable(value) || value < 0) continue;
      if (!isPlottable(peak) || value > peak) peak = value;
    }
  }
  if (!isPlottable(peak) || peak <= 0) return 1;
  return peak;
}

export function heatmapIntensity(value: number | null, max: number): number {
  if (!isPlottable(value) || value < 0) return 0;
  if (!isPlottable(max) || max <= 0) return 0;
  return Math.min(Math.max(value / max, 0), 1);
}

export function heatmapFillMix(intensity: number): number {
  const clamped = Math.min(Math.max(intensity, 0), 1);
  return Math.round(
    SOLARIS_HEATMAP_MIN_FILL_MIX +
      clamped * (SOLARIS_HEATMAP_MAX_FILL_MIX - SOLARIS_HEATMAP_MIN_FILL_MIX),
  );
}

export function heatmapCellFill(value: number | null, max: number): string {
  if (!isPlottable(value) || value < 0) return 'var(--solaris-neutral-subtle)';
  const mix = heatmapFillMix(heatmapIntensity(value, max));
  return `color-mix(in srgb, var(--solaris-primary-solid) ${mix}%, var(--solaris-neutral-default))`;
}

export function buildHeatmapFrame(
  rows: readonly SolarisHeatmapRow[],
  columns: readonly string[],
  options: SolarisHeatmapFrameOptions = {},
): SolarisHeatmapFrame {
  const cellSize = resolveSize(options.cellSize, SOLARIS_HEATMAP_CELL_SIZE);
  const gap = resolveSize(options.gap, SOLARIS_HEATMAP_GAP);
  const headerHeight = resolveSize(
    options.headerHeight,
    SOLARIS_HEATMAP_HEADER_HEIGHT,
  );
  const columnCount = columns.length;
  const rowCount = rows.length;
  const max = resolveHeatmapMax(rows, options.max);
  const width = gap + columnCount * (cellSize + gap);
  const height = headerHeight + gap + rowCount * (cellSize + gap);
  if (columnCount === 0 || rowCount === 0) {
    return {
      width,
      height,
      headerHeight,
      rowHeight: cellSize + gap,
      columnCount,
      rowCount,
      max,
      cells: [],
    };
  }
  const cells = rows.flatMap((row, rowIndex) =>
    columns.map((columnLabel, columnIndex) => {
      const raw = row.values[columnIndex];
      const value = isPlottable(raw) && raw >= 0 ? raw : null;
      return {
        rowId: row.id,
        rowIndex,
        columnIndex,
        rowLabel: row.label,
        columnLabel,
        value,
        intensity: heatmapIntensity(value, max),
        x: gap + columnIndex * (cellSize + gap),
        y: headerHeight + gap + rowIndex * (cellSize + gap),
        width: cellSize,
        height: cellSize,
        fillMix: heatmapFillMix(heatmapIntensity(value, max)),
      };
    }),
  );
  return {
    width,
    height,
    headerHeight,
    rowHeight: cellSize + gap,
    columnCount,
    rowCount,
    max,
    cells,
  };
}

export function heatmapCellKey(rowId: string, columnIndex: number): string {
  return `${rowId}:${columnIndex}`;
}

export function heatmapEnterDelayMs(position: number): number {
  const safe = Number.isFinite(position) ? Math.max(0, position) : 0;
  return Math.min(
    safe * SOLARIS_HEATMAP_ENTER_CELL_DELAY_MS,
    SOLARIS_HEATMAP_ENTER_MAX_DELAY_MS,
  );
}

export function heatmapTooltipSide(
  cellCenter: { readonly x: number; readonly y: number },
  frameCenter: { readonly x: number; readonly y: number },
): SolarisHeatmapTooltipSide {
  // Dock toward the grid center so the tooltip stays inside the canvas
  // instead of growing outward past the scrollport (which clipped edge
  // cells and created scrollbars in the preview surface).
  const dx = cellCenter.x - frameCenter.x;
  const dy = cellCenter.y - frameCenter.y;
  if (Math.abs(dx) > Math.abs(dy)) return dx >= 0 ? 'left' : 'right';
  return dy >= 0 ? 'top' : 'bottom';
}

export function heatmapAnchorPoint(
  cell: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  },
  frameCenter: { readonly x: number; readonly y: number },
  offset = SOLARIS_HEATMAP_ANCHOR_GAP,
): {
  readonly x: number;
  readonly y: number;
  readonly side: SolarisHeatmapTooltipSide;
} {
  const centerX = cell.x + cell.width / 2;
  const centerY = cell.y + cell.height / 2;
  const side = heatmapTooltipSide({ x: centerX, y: centerY }, frameCenter);
  const gap = Math.max(0, offset);
  if (side === 'right') {
    return { x: cell.x + cell.width + gap, y: centerY, side };
  }
  if (side === 'left') {
    return { x: cell.x - gap, y: centerY, side };
  }
  if (side === 'bottom') {
    return { x: centerX, y: cell.y + cell.height + gap, side };
  }
  return { x: centerX, y: cell.y - gap, side };
}

export function clampHeatmapPercent(value: number): number {
  if (!Number.isFinite(value)) return 50;
  return Math.min(86, Math.max(14, value));
}
