import type {
  SolarisTableFilterCondition,
  SolarisTableFilterOperator,
  SolarisTableFilterState,
  SolarisTableFilterableColumn,
} from './filter.types';
import { SOLARIS_TABLE_FILTER_OPERATORS } from './filter.types';
import { isValuelessOperator } from './filter.defaults';

const operatorSet = new Set<SolarisTableFilterOperator>(
  SOLARIS_TABLE_FILTER_OPERATORS,
);

export function createEmptyTableFilterState(): SolarisTableFilterState {
  return {
    globalSearch: '',
    conditions: [],
    columnVisibility: {},
    columnOrder: [],
  };
}

export function normalizeTableFilterState(
  value: Partial<SolarisTableFilterState> | null | undefined,
): SolarisTableFilterState {
  return {
    globalSearch:
      typeof value?.globalSearch === 'string' ? value.globalSearch : '',
    conditions: Array.isArray(value?.conditions)
      ? (value.conditions as SolarisTableFilterCondition[]).filter(
          (condition) => isValidCondition(condition),
        )
      : [],
    columnVisibility:
      value?.columnVisibility && typeof value.columnVisibility === 'object'
        ? { ...value.columnVisibility }
        : {},
    columnOrder: Array.isArray(value?.columnOrder)
      ? [...(value.columnOrder as readonly string[])]
      : [],
  };
}

export function isValidCondition(
  condition: SolarisTableFilterCondition | null | undefined,
): condition is SolarisTableFilterCondition {
  if (!condition || typeof condition.columnId !== 'string') {
    return false;
  }
  if (condition.columnId.trim() === '') {
    return false;
  }
  return operatorSet.has(condition.operator);
}

export function isTableFilterActive(state: SolarisTableFilterState): boolean {
  return activeTableFilterCount(state) > 0;
}

export function activeTableFilterCount(state: SolarisTableFilterState): number {
  let count = state.conditions.length;
  if (state.globalSearch.trim() !== '') {
    count += 1;
  }
  return count;
}

export function resolveFilterValue<T>(
  row: T,
  column: SolarisTableFilterableColumn<T>,
): unknown {
  if (typeof column.accessor === 'function') {
    return column.accessor(row);
  }
  if (column.accessor) {
    return row[column.accessor] as unknown;
  }
  return (row as Record<string, unknown>)[column.id];
}

export function resolveFilterDisplayText<T>(
  row: T,
  column: SolarisTableFilterableColumn<T>,
): string {
  const custom = column.displayValueOf?.(row);
  if (custom !== undefined && custom !== null && custom.trim() !== '') {
    return custom;
  }
  const value = resolveFilterValue(row, column);
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
}

export function matchesTableFilterCondition<T>(
  row: T,
  column: SolarisTableFilterableColumn<T>,
  condition: SolarisTableFilterCondition,
): boolean {
  if (!isConditionEffective(condition)) {
    return true;
  }
  const value = resolveFilterValue(row, column);
  switch (condition.operator) {
    case 'isEmpty':
      return isEmptyValue(value);
    case 'isNotEmpty':
      return !isEmptyValue(value);
    case 'contains':
      return toText(value).includes(toText(condition.value));
    case 'startsWith':
      return toText(value).startsWith(toText(condition.value));
    case 'equals':
      return compareLoose(value, condition.value);
    case 'notEquals':
      return !compareLoose(value, condition.value);
    case 'gt':
      return compareOrdered(value, condition.value) > 0;
    case 'gte':
      return compareOrdered(value, condition.value) >= 0;
    case 'lt':
      return compareOrdered(value, condition.value) < 0;
    case 'lte':
      return compareOrdered(value, condition.value) <= 0;
    case 'between': {
      const range = condition.value as
        | {
            readonly from?: string | number | null;
            readonly to?: string | number | null;
          }
        | null
        | undefined;
      if (
        range?.from !== undefined &&
        range.from !== null &&
        range.from !== ''
      ) {
        if (compareOrdered(value, range.from) < 0) {
          return false;
        }
      }
      if (range?.to !== undefined && range.to !== null && range.to !== '') {
        if (compareOrdered(value, range.to) > 0) {
          return false;
        }
      }
      return true;
    }
    case 'in': {
      const accepted = toStringList(condition.value);
      if (accepted.length === 0) {
        return true;
      }
      return accepted.includes(toText(value));
    }
    case 'notIn': {
      const rejected = toStringList(condition.value);
      if (rejected.length === 0) {
        return true;
      }
      return !rejected.includes(toText(value));
    }
    default:
      return true;
  }
}

export function applyTableFilters<T>(
  rows: readonly T[],
  columns: readonly SolarisTableFilterableColumn<T>[],
  state: SolarisTableFilterState,
): readonly T[] {
  const search = state.globalSearch.trim().toLowerCase();
  const byId = new Map(columns.map((column) => [column.id, column]));
  return rows.filter((row) => {
    if (search !== '') {
      const haystack = columns
        .map((column) => resolveFilterDisplayText(row, column).toLowerCase())
        .join(' ');
      if (!haystack.includes(search)) {
        return false;
      }
    }
    for (const condition of state.conditions) {
      const column = byId.get(condition.columnId);
      if (!column) {
        continue;
      }
      if (!matchesTableFilterCondition(row, column, condition)) {
        return false;
      }
    }
    return true;
  });
}

export function applyColumnOrder<T>(
  columns: readonly T[],
  order: readonly string[],
  idOf: (column: T) => string,
): readonly T[] {
  if (order.length === 0) {
    return columns;
  }
  const byId = new Map(columns.map((column) => [idOf(column), column]));
  const ordered: T[] = [];
  for (const id of order) {
    const column = byId.get(id);
    if (column) {
      ordered.push(column);
      byId.delete(id);
    }
  }
  for (const column of columns) {
    if (byId.has(idOf(column))) {
      ordered.push(column);
    }
  }
  return ordered;
}

export function applyColumnVisibility<T>(
  columns: readonly T[],
  visibility: Readonly<Record<string, boolean>>,
  idOf: (column: T) => string,
): readonly T[] {
  return columns.filter((column) => visibility[idOf(column)] !== false);
}

export function applyOrderedVisibleColumns<T>(
  columns: readonly SolarisTableFilterableColumn<T>[],
  state: SolarisTableFilterState,
): readonly SolarisTableFilterableColumn<T>[] {
  return applyColumnVisibility(
    applyColumnOrder(columns, state.columnOrder, (column) => column.id),
    state.columnVisibility,
    (column) => column.id,
  );
}

export function moveColumnInOrder(
  order: readonly string[],
  columnId: string,
  delta: -1 | 1,
): readonly string[] {
  const index = order.indexOf(columnId);
  if (index === -1) {
    return order;
  }
  const next = index + delta;
  if (next < 0 || next >= order.length) {
    return order;
  }
  const copy = [...order];
  const [moved] = copy.splice(index, 1);
  copy.splice(next, 0, moved);
  return copy;
}

export function insertColumnBefore(
  order: readonly string[],
  draggedId: string,
  targetId: string,
): readonly string[] {
  if (draggedId === targetId) {
    return order;
  }
  const without = order.filter((id) => id !== draggedId);
  const targetIndex = without.indexOf(targetId);
  if (targetIndex === -1) {
    return [...without, draggedId];
  }
  return [
    ...without.slice(0, targetIndex),
    draggedId,
    ...without.slice(targetIndex),
  ];
}

export function orderFromColumns<T>(
  columns: readonly SolarisTableFilterableColumn<T>[],
): readonly string[] {
  return columns.map((column) => column.id);
}

export function serializeTableFilterState(
  state: SolarisTableFilterState,
): string {
  return JSON.stringify(state);
}

export function parseTableFilterState(
  raw: string | null | undefined,
): SolarisTableFilterState | null {
  if (!raw) {
    return null;
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }
    return normalizeTableFilterState(
      parsed as Partial<SolarisTableFilterState>,
    );
  } catch {
    return null;
  }
}

function readStorage(): Storage | null {
  try {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    return localStorage;
  } catch {
    return null;
  }
}

export function readPersistedTableFilterState(
  storageKey: string | undefined,
): SolarisTableFilterState | null {
  if (!storageKey) {
    return null;
  }
  const storage = readStorage();
  if (!storage) {
    return null;
  }
  try {
    return parseTableFilterState(storage.getItem(storageKey));
  } catch {
    return null;
  }
}

export function writePersistedTableFilterState(
  storageKey: string | undefined,
  state: SolarisTableFilterState,
): void {
  if (!storageKey) {
    return;
  }
  const storage = readStorage();
  if (!storage) {
    return;
  }
  try {
    storage.setItem(storageKey, serializeTableFilterState(state));
  } catch {
    return;
  }
}

export function isConditionEffective(
  condition: SolarisTableFilterCondition,
): boolean {
  if (isValuelessOperator(condition.operator)) {
    return true;
  }
  if (condition.operator === 'between') {
    const range = condition.value as
      | {
          readonly from?: string | number | null;
          readonly to?: string | number | null;
        }
      | null
      | undefined;
    return isSingleValue(range?.from) || isSingleValue(range?.to);
  }
  if (condition.operator === 'in' || condition.operator === 'notIn') {
    return toStringList(condition.value).length > 0;
  }
  return isSingleValue(condition.value);
}

function isSingleValue(value: unknown): boolean {
  return value !== undefined && value !== null && value !== '';
}

function isEmptyValue(value: unknown): boolean {
  if (value === null || value === undefined) {
    return true;
  }
  if (typeof value === 'string') {
    return value.trim() === '';
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  return false;
}

function toText(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'object') {
    return '';
  }
  return String(value).toLowerCase();
}

function toStringList(value: unknown): readonly string[] {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry).toLowerCase());
  }
  if (value === null || value === undefined || value === '') {
    return [];
  }
  return [String(value).toLowerCase()];
}

function compareLoose(left: unknown, right: unknown): boolean {
  if (typeof left === 'number' || typeof right === 'number') {
    return toComparableNumber(left) === toComparableNumber(right);
  }
  return toText(left) === toText(right);
}

function compareOrdered(left: unknown, right: unknown): number {
  const leftNumber = toComparableNumber(left);
  const rightNumber = toComparableNumber(right);
  if (leftNumber !== null && rightNumber !== null) {
    return leftNumber - rightNumber;
  }
  const leftTime = toComparableTime(left);
  const rightTime = toComparableTime(right);
  if (leftTime !== null && rightTime !== null) {
    return leftTime - rightTime;
  }
  const leftText = Array.isArray(left) ? '' : toText(left);
  const rightText = Array.isArray(right) ? '' : toText(right);
  if (leftText === rightText) {
    return 0;
  }
  return leftText < rightText ? -1 : 1;
}

function toComparableNumber(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function toComparableTime(value: unknown): number | null {
  if (value instanceof Date) {
    const time = value.getTime();
    return Number.isFinite(time) ? time : null;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const time = Date.parse(value);
    return Number.isFinite(time) ? time : null;
  }
  return null;
}
