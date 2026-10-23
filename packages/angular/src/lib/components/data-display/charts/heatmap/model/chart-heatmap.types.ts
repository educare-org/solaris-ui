export type SolarisHeatmapSize = 'sm' | 'md' | 'lg';

export type SolarisHeatmapDensity = 'compact' | 'normal' | 'comfortable';

export type SolarisHeatmapTooltipSide = 'top' | 'right' | 'bottom' | 'left';

export type SolarisHeatmapValueFormatter = (value: number) => string;

export interface SolarisHeatmapRow {
  readonly id: string;
  readonly label: string;
  readonly values: readonly (number | null)[];
}

export interface SolarisHeatmapCellEvent {
  readonly rowId: string;
  readonly columnIndex: number;
}

export interface SolarisHeatmapCellGeometry {
  readonly rowId: string;
  readonly rowIndex: number;
  readonly columnIndex: number;
  readonly rowLabel: string;
  readonly columnLabel: string;
  readonly value: number | null;
  readonly intensity: number;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly fillMix: number;
}

export interface SolarisHeatmapFrame {
  readonly width: number;
  readonly height: number;
  readonly headerHeight: number;
  readonly rowHeight: number;
  readonly columnCount: number;
  readonly rowCount: number;
  readonly max: number;
  readonly cells: readonly SolarisHeatmapCellGeometry[];
}

export interface SolarisHeatmapFrameOptions {
  readonly max?: number;
  readonly cellSize?: number;
  readonly gap?: number;
  readonly headerHeight?: number;
}

export interface SolarisHeatmapTooltip {
  readonly rowId: string;
  readonly rowLabel: string;
  readonly columnLabel: string;
  readonly formattedValue: string | null;
  readonly intensity: number;
  readonly leftPercent: number;
  readonly topPercent: number;
  readonly side: SolarisHeatmapTooltipSide;
}

export interface SolarisHeatmapInputs {
  readonly rows: readonly SolarisHeatmapRow[];
  readonly columns: readonly string[];
}
