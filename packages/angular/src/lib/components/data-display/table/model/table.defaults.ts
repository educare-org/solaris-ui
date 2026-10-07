import {
  SOLARIS_TABLE_APPEARANCES,
  SOLARIS_TABLE_COLUMN_TYPES,
  SOLARIS_TABLE_EXPAND_MODES,
  SOLARIS_TABLE_LAYOUTS,
  SOLARIS_TABLE_RADII,
  SOLARIS_TABLE_SELECTION_MODES,
  SOLARIS_TABLE_STRIPED_MODES,
  type SolarisTableAppearance,
  type SolarisTableColumnType,
  type SolarisTableExpandMode,
  type SolarisTableIconPosition,
  type SolarisTableLayout,
  type SolarisTableRadius,
  type SolarisTableSelectionMode,
  type SolarisTableSort,
  type SolarisTableStripedMode,
} from './table.types';

export {
  SOLARIS_TABLE_APPEARANCES,
  SOLARIS_TABLE_COLUMN_TYPES,
  SOLARIS_TABLE_EXPAND_MODES,
  SOLARIS_TABLE_LAYOUTS,
  SOLARIS_TABLE_RADII,
  SOLARIS_TABLE_SELECTION_MODES,
  SOLARIS_TABLE_STRIPED_MODES,
};

const columnTypes = new Set<SolarisTableColumnType>(SOLARIS_TABLE_COLUMN_TYPES);
const selectionModes = new Set<SolarisTableSelectionMode>(
  SOLARIS_TABLE_SELECTION_MODES,
);

export const DEFAULT_SOLARIS_TABLE_SELECTION_MODE: SolarisTableSelectionMode =
  'none';
export const DEFAULT_SOLARIS_TABLE_LOADING_ROW_COUNT = 3;
export const DETAIL_COLLAPSE_DURATION_MS = 300;
export const SOLARIS_TABLE_SELECTION_COLUMN_ID = '__solaris_table_selection__';

export const TABLE_ARIA_LABEL_FALLBACK_KEY =
  'solaris.dataDisplay.table.ariaLabel';
export const TABLE_ARIA_LABEL_FALLBACK_TEXT = 'Data table';
export const TABLE_EMPTY_TEXT_KEY = 'solaris.dataDisplay.table.emptyText';
export const TABLE_EMPTY_TEXT = 'No results found';
export const TABLE_LOADING_TEXT_KEY = 'solaris.dataDisplay.table.loadingText';
export const TABLE_LOADING_TEXT = 'Loading data';
export const TABLE_ERROR_TEXT_KEY = 'solaris.dataDisplay.table.errorText';
export const TABLE_ERROR_TEXT = 'Unable to load data';
export const TABLE_SELECT_ALL_LABEL_KEY =
  'solaris.dataDisplay.table.selectAllVisible';
export const TABLE_SELECT_ALL_LABEL = 'Select all visible rows';
export const TABLE_ACTIONS_COLUMN_LABEL_KEY =
  'solaris.dataDisplay.table.actionsColumn';
export const TABLE_ACTIONS_COLUMN_LABEL = 'Actions';
export const TABLE_SELECT_ROW_LABEL_KEY = 'solaris.dataDisplay.table.selectRow';
export const TABLE_SELECT_ROW_LABEL = 'Select row {{rowId}}';
export const TABLE_SORT_ASC_LABEL_KEY = 'solaris.dataDisplay.table.sortAsc';
export const TABLE_SORT_ASC_LABEL = 'Sort {{column}} ascending';
export const TABLE_SORT_DESC_LABEL_KEY = 'solaris.dataDisplay.table.sortDesc';
export const TABLE_SORT_DESC_LABEL = 'Sort {{column}} descending';
export const TABLE_SORT_CLEAR_LABEL_KEY = 'solaris.dataDisplay.table.sortClear';
export const TABLE_SORT_CLEAR_LABEL = 'Clear sorting for {{column}}';
export const TABLE_EXPAND_ROW_LABEL_KEY = 'solaris.dataDisplay.table.expandRow';
export const TABLE_EXPAND_ROW_LABEL = 'Expand row {{rowId}}';
export const TABLE_COLLAPSE_ROW_LABEL_KEY =
  'solaris.dataDisplay.table.collapseRow';
export const TABLE_COLLAPSE_ROW_LABEL = 'Collapse row {{rowId}}';
export const TABLE_SORTED_ANNOUNCE_KEY =
  'solaris.dataDisplay.table.sortedAnnounce';
export const TABLE_SORTED_ANNOUNCE =
  'Table sorted by {{column}}, {{direction}}';
export const TABLE_SORTED_CLEARED_ANNOUNCE = 'Table sorting cleared';
export const TABLE_EXPAND_CELL_LABEL_KEY =
  'solaris.dataDisplay.table.expandCell';
export const TABLE_EXPAND_CELL_LABEL =
  'Expand details for {{column}} in row {{rowId}}';
export const TABLE_COLLAPSE_CELL_LABEL_KEY =
  'solaris.dataDisplay.table.collapseCell';
export const TABLE_COLLAPSE_CELL_LABEL =
  'Collapse details for {{column}} in row {{rowId}}';
export const TABLE_ADD_ROW_LABEL_KEY = 'solaris.dataDisplay.table.addRow';
export const TABLE_ADD_ROW_LABEL = 'Add row';

export const DEFAULT_SOLARIS_TABLE_APPEARANCE: SolarisTableAppearance =
  'outline';
export const DEFAULT_SOLARIS_TABLE_STRIPED_MODE: SolarisTableStripedMode =
  'even';
export const DEFAULT_SOLARIS_TABLE_LAYOUT: SolarisTableLayout = 'auto';
export const DEFAULT_SOLARIS_TABLE_EXPAND_MODE: SolarisTableExpandMode = 'row';
export const DEFAULT_SOLARIS_TABLE_RADIUS: SolarisTableRadius = 'md';
export const DEFAULT_SOLARIS_TABLE_ICON_POSITION: SolarisTableIconPosition =
  'start';

const radii = new Set<SolarisTableRadius>(SOLARIS_TABLE_RADII);
const appearances = new Set<SolarisTableAppearance>(SOLARIS_TABLE_APPEARANCES);
const stripedModes = new Set<SolarisTableStripedMode>(
  SOLARIS_TABLE_STRIPED_MODES,
);
const layouts = new Set<SolarisTableLayout>(SOLARIS_TABLE_LAYOUTS);
const expandModes = new Set<SolarisTableExpandMode>(SOLARIS_TABLE_EXPAND_MODES);

export function normalizeTableAppearance(
  value: string | null | undefined,
): SolarisTableAppearance {
  return appearances.has(value as SolarisTableAppearance)
    ? (value as SolarisTableAppearance)
    : DEFAULT_SOLARIS_TABLE_APPEARANCE;
}

export function normalizeTableStripedMode(
  value: string | null | undefined,
): SolarisTableStripedMode {
  return stripedModes.has(value as SolarisTableStripedMode)
    ? (value as SolarisTableStripedMode)
    : DEFAULT_SOLARIS_TABLE_STRIPED_MODE;
}

export function normalizeTableLayout(
  value: string | null | undefined,
): SolarisTableLayout {
  return layouts.has(value as SolarisTableLayout)
    ? (value as SolarisTableLayout)
    : DEFAULT_SOLARIS_TABLE_LAYOUT;
}

export function normalizeTableExpandMode(
  value: string | null | undefined,
): SolarisTableExpandMode {
  return expandModes.has(value as SolarisTableExpandMode)
    ? (value as SolarisTableExpandMode)
    : DEFAULT_SOLARIS_TABLE_EXPAND_MODE;
}

export function normalizeTableRadius(
  value: string | null | undefined,
): SolarisTableRadius {
  return radii.has(value as SolarisTableRadius)
    ? (value as SolarisTableRadius)
    : DEFAULT_SOLARIS_TABLE_RADIUS;
}

export function normalizeTableIconPosition(
  value: string | null | undefined,
): SolarisTableIconPosition {
  return value === 'end' ? 'end' : DEFAULT_SOLARIS_TABLE_ICON_POSITION;
}

export function cellExpansionKey(rowId: string, columnId: string): string {
  return `${rowId}::${columnId}`;
}

export function normalizeTableColumnType(
  value: string | null | undefined,
): SolarisTableColumnType {
  return columnTypes.has(value as SolarisTableColumnType)
    ? (value as SolarisTableColumnType)
    : 'text';
}

export function normalizeTableSelectionMode(
  value: string | null | undefined,
): SolarisTableSelectionMode {
  return selectionModes.has(value as SolarisTableSelectionMode)
    ? (value as SolarisTableSelectionMode)
    : DEFAULT_SOLARIS_TABLE_SELECTION_MODE;
}

export function normalizeTableSort(
  value: SolarisTableSort | null | undefined,
): SolarisTableSort | null {
  if (!value?.columnId || !value.direction) {
    return null;
  }
  return {
    columnId: value.columnId,
    direction: value.direction,
  };
}

export function normalizeOptionalDimension(
  value: string | null | undefined,
): string | undefined {
  if (!value) {
    return undefined;
  }
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

export function normalizeOptionalString(
  value: string | null | undefined,
): string | null {
  if (!value) {
    return null;
  }
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

export function interpolateTableText(
  template: string,
  params: Record<string, string | number>,
): string {
  return Object.entries(params).reduce((resolved, [key, value]) => {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return resolved
      .replace(
        new RegExp(String.raw`\{\{\s*${escaped}\s*}}`, 'g'),
        String(value),
      )
      .replace(new RegExp(String.raw`\{${escaped}\}`, 'g'), String(value));
  }, template);
}
