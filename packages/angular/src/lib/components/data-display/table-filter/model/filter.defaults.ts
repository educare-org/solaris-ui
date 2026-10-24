import {
  SOLARIS_TABLE_TOOLBAR_EXPORT_DISPLAYS,
  type SolarisTableFilterOperator,
  type SolarisTableToolbarExportDisplay,
} from './filter.types';

export const FILTER_SEARCH_DEBOUNCE_MS = 150;
export const FILTER_CHIPS_COLLAPSE_DURATION_MS = 300;
export const FILTER_DEFAULT_ORDER_FALLBACK: readonly string[] = [];

export const FILTER_ARIA_LABEL_FALLBACK_KEY =
  'solaris.dataDisplay.tableFilter.ariaLabel';
export const FILTER_ARIA_LABEL_FALLBACK_TEXT = 'Table filters';
export const FILTER_SEARCH_PLACEHOLDER_KEY =
  'solaris.dataDisplay.tableFilter.searchPlaceholder';
export const FILTER_SEARCH_PLACEHOLDER = 'Search';
export const FILTER_SEARCH_LABEL_KEY =
  'solaris.dataDisplay.tableFilter.searchLabel';
export const FILTER_SEARCH_LABEL = 'Search table';
export const FILTER_BUTTON_LABEL_KEY =
  'solaris.dataDisplay.tableFilter.filterButton';
export const FILTER_BUTTON_LABEL = 'Filters';
export const FILTER_ADD_CONDITION_LABEL_KEY =
  'solaris.dataDisplay.tableFilter.addCondition';
export const FILTER_ADD_CONDITION_LABEL = 'Add filter';
export const FILTER_CLEAR_ALL_LABEL_KEY =
  'solaris.dataDisplay.tableFilter.clearAll';
export const FILTER_CLEAR_ALL_LABEL = 'Clear all';
export const FILTER_COLUMN_LABEL_KEY =
  'solaris.dataDisplay.tableFilter.columnLabel';
export const FILTER_COLUMN_LABEL = 'Column';
export const FILTER_OPERATOR_LABEL_KEY =
  'solaris.dataDisplay.tableFilter.operatorLabel';
export const FILTER_OPERATOR_LABEL = 'Operator';
export const FILTER_VALUE_LABEL_KEY =
  'solaris.dataDisplay.tableFilter.valueLabel';
export const FILTER_VALUE_LABEL = 'Value';
export const FILTER_REMOVE_CONDITION_LABEL_KEY =
  'solaris.dataDisplay.tableFilter.removeCondition';
export const FILTER_REMOVE_CONDITION_LABEL = 'Remove filter for {{column}}';
export const FILTER_REMOVE_SEARCH_LABEL_KEY =
  'solaris.dataDisplay.tableFilter.removeSearch';
export const FILTER_REMOVE_SEARCH_LABEL = 'Clear search';
export const FILTER_NO_CONDITIONS_LABEL_KEY =
  'solaris.dataDisplay.tableFilter.noConditions';
export const FILTER_NO_CONDITIONS_LABEL = 'No filters applied';
export const FILTER_VIEWS_LABEL_KEY =
  'solaris.dataDisplay.tableFilter.viewsLabel';
export const FILTER_VIEWS_LABEL = 'Views';
export const FILTER_CREATE_VIEW_LABEL_KEY =
  'solaris.dataDisplay.tableFilter.createView';
export const FILTER_CREATE_VIEW_LABEL = 'Create view';
export const FILTER_CREATE_VIEW_NAME_LABEL_KEY =
  'solaris.dataDisplay.tableFilter.createViewName';
export const FILTER_CREATE_VIEW_NAME_LABEL = 'View name';
export const FILTER_CREATE_VIEW_NAME_PLACEHOLDER_KEY =
  'solaris.dataDisplay.tableFilter.createViewNamePlaceholder';
export const FILTER_CREATE_VIEW_NAME_PLACEHOLDER = 'My view';
export const FILTER_SAVE_LABEL_KEY = 'solaris.dataDisplay.tableFilter.save';
export const FILTER_SAVE_LABEL = 'Save';
export const FILTER_EXPORT_LABEL_KEY =
  'solaris.dataDisplay.tableFilter.exportButton';
export const FILTER_EXPORT_LABEL = 'Export';
export const FILTER_EXPORT_FORMAT_LABEL_KEY =
  'solaris.dataDisplay.tableFilter.exportFormat';
export const FILTER_EXPORT_FORMAT_LABEL = 'Format';
export const FILTER_EXPORT_CSV_LABEL_KEY = 'solaris.export.csv';
export const FILTER_EXPORT_CSV_LABEL = 'Export CSV';
export const FILTER_EXPORT_JSON_LABEL_KEY = 'solaris.export.json';
export const FILTER_EXPORT_JSON_LABEL = 'Export JSON';
export const FILTER_COLUMNS_BUTTON_LABEL_KEY =
  'solaris.dataDisplay.tableFilter.columnsButton';
export const FILTER_COLUMNS_BUTTON = 'Customize columns';
export const FILTER_COLUMNS_TITLE_KEY =
  'solaris.dataDisplay.tableFilter.columnsTitle';
export const FILTER_COLUMNS_TITLE = 'Customize columns';
export const FILTER_COLUMNS_RESET_LABEL_KEY =
  'solaris.dataDisplay.tableFilter.columnsReset';
export const FILTER_COLUMNS_RESET_LABEL = 'Reset';
export const FILTER_COLUMNS_CANCEL_LABEL_KEY =
  'solaris.dataDisplay.tableFilter.columnsCancel';
export const FILTER_COLUMNS_CANCEL_LABEL = 'Cancel';
export const FILTER_COLUMNS_SAVE_LABEL_KEY =
  'solaris.dataDisplay.tableFilter.columnsSave';
export const FILTER_COLUMNS_SAVE_LABEL = 'Save';
export const FILTER_COLUMNS_MOVE_UP_LABEL_KEY =
  'solaris.dataDisplay.tableFilter.columnMoveUp';
export const FILTER_COLUMNS_MOVE_UP_LABEL = 'Move {{column}} up';
export const FILTER_COLUMNS_MOVE_DOWN_LABEL_KEY =
  'solaris.dataDisplay.tableFilter.columnMoveDown';
export const FILTER_COLUMNS_MOVE_DOWN_LABEL = 'Move {{column}} down';

export const FILTER_OPERATOR_LABELS: Readonly<
  Record<SolarisTableFilterOperator, string>
> = {
  contains: 'contains',
  equals: 'is',
  notEquals: 'is not',
  startsWith: 'starts with',
  isEmpty: 'is empty',
  isNotEmpty: 'is not empty',
  gt: 'greater than',
  gte: 'greater than or equal',
  lt: 'less than',
  lte: 'less than or equal',
  between: 'between',
  in: 'is any of',
  notIn: 'is none of',
};

export const FILTER_OPERATOR_LABEL_KEYS: Readonly<
  Record<SolarisTableFilterOperator, string>
> = {
  contains: 'solaris.dataDisplay.tableFilter.operator.contains',
  equals: 'solaris.dataDisplay.tableFilter.operator.equals',
  notEquals: 'solaris.dataDisplay.tableFilter.operator.notEquals',
  startsWith: 'solaris.dataDisplay.tableFilter.operator.startsWith',
  isEmpty: 'solaris.dataDisplay.tableFilter.operator.isEmpty',
  isNotEmpty: 'solaris.dataDisplay.tableFilter.operator.isNotEmpty',
  gt: 'solaris.dataDisplay.tableFilter.operator.gt',
  gte: 'solaris.dataDisplay.tableFilter.operator.gte',
  lt: 'solaris.dataDisplay.tableFilter.operator.lt',
  lte: 'solaris.dataDisplay.tableFilter.operator.lte',
  between: 'solaris.dataDisplay.tableFilter.operator.between',
  in: 'solaris.dataDisplay.tableFilter.operator.in',
  notIn: 'solaris.dataDisplay.tableFilter.operator.notIn',
};

const VALUELESS_OPERATORS: ReadonlySet<SolarisTableFilterOperator> = new Set([
  'isEmpty',
  'isNotEmpty',
]);

const RANGE_OPERATORS: ReadonlySet<SolarisTableFilterOperator> = new Set([
  'between',
]);

const LIST_OPERATORS: ReadonlySet<SolarisTableFilterOperator> = new Set([
  'in',
  'notIn',
]);

export function operatorsForColumnType(
  type: string | undefined,
  hasOptions: boolean,
): readonly SolarisTableFilterOperator[] {
  if (hasOptions) {
    return ['in', 'notIn', 'isEmpty', 'isNotEmpty'];
  }
  switch (type) {
    case 'number':
    case 'date':
      return [
        'equals',
        'notEquals',
        'gt',
        'gte',
        'lt',
        'lte',
        'between',
        'isEmpty',
        'isNotEmpty',
      ];
    case 'checkbox':
      return ['equals', 'notEquals', 'isEmpty', 'isNotEmpty'];
    default:
      return [
        'contains',
        'equals',
        'notEquals',
        'startsWith',
        'isEmpty',
        'isNotEmpty',
      ];
  }
}

export function isValuelessOperator(
  operator: SolarisTableFilterOperator,
): boolean {
  return VALUELESS_OPERATORS.has(operator);
}

export function isRangeOperator(operator: SolarisTableFilterOperator): boolean {
  return RANGE_OPERATORS.has(operator);
}

export function isListOperator(operator: SolarisTableFilterOperator): boolean {
  return LIST_OPERATORS.has(operator);
}

export function defaultOperatorForColumn(
  type: string | undefined,
  hasOptions: boolean,
): SolarisTableFilterOperator {
  if (hasOptions) {
    return 'in';
  }
  switch (type) {
    case 'number':
    case 'date':
      return 'equals';
    default:
      return 'contains';
  }
}

const exportDisplays = new Set<SolarisTableToolbarExportDisplay>(
  SOLARIS_TABLE_TOOLBAR_EXPORT_DISPLAYS,
);

export function normalizeExportDisplay(
  value: string | null | undefined,
): SolarisTableToolbarExportDisplay {
  return exportDisplays.has(value as SolarisTableToolbarExportDisplay)
    ? (value as SolarisTableToolbarExportDisplay)
    : 'icon';
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

export function interpolateFilterText(
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
