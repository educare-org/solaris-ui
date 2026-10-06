import { computed, signal, type Signal } from '@angular/core';

import type {
  SolarisTableColumn,
  SolarisTableDataSource,
  SolarisTableResolvedRow,
  SolarisTableSort,
} from './table.types';

type ComparableValue = string | number | null;

export function isTableDataSource<T>(
  value: SolarisTableDataSource<T> | readonly T[],
): value is SolarisTableDataSource<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    typeof (value as SolarisTableDataSource<T>).rows === 'function'
  );
}

export function resolveRowId<T>(
  row: T,
  rowId: keyof T | ((row: T, index: number) => string),
  index: number,
): string {
  const resolved = typeof rowId === 'function' ? rowId(row, index) : row[rowId];
  return String(resolved ?? index);
}

export function resolveCellValue<T>(
  row: T,
  column: SolarisTableColumn<T>,
): unknown {
  if (typeof column.accessor === 'function') {
    return column.accessor(row);
  }
  if (column.accessor) {
    return row[column.accessor] as unknown;
  }
  return (row as Record<string, unknown>)[column.id];
}

export function resolveDisplayValue<T>(
  row: T,
  column: SolarisTableColumn<T>,
): string | null {
  const custom = column.displayValueOf?.(row);
  if (custom !== undefined && custom !== null) {
    const trimmed = custom.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  const value = resolveCellValue(row, column);
  if (value === null || value === undefined) {
    return null;
  }
  const text = String(value).trim();
  return text.length > 0 ? text : null;
}

export function resolveSortValue<T>(
  row: T,
  column: SolarisTableColumn<T>,
): ComparableValue {
  const custom = column.sortValueOf?.(row);
  if (custom !== undefined && custom !== null) {
    return custom;
  }
  return normalizeComparable(resolveCellValue(row, column), column.type);
}

export function resolveRows<T>(
  data: readonly T[],
  rowId: keyof T | ((row: T, index: number) => string),
): readonly SolarisTableResolvedRow<T>[] {
  return data.map((row, index) => ({
    row,
    rowId: resolveRowId(row, rowId, index),
    index,
  }));
}

export function sortRows<T>(
  rows: readonly SolarisTableResolvedRow<T>[],
  columns: readonly SolarisTableColumn<T>[],
  sort: SolarisTableSort | null | undefined,
  locale = 'en-US',
): readonly SolarisTableResolvedRow<T>[] {
  if (!sort?.columnId || !sort.direction) {
    return rows;
  }
  const column = columns.find((candidate) => candidate.id === sort.columnId);
  if (!column || column.sortable !== true) {
    return rows;
  }
  const multiplier = sort.direction === 'asc' ? 1 : -1;
  return rows
    .map((row, stableIndex) => ({ row, stableIndex }))
    .sort((left, right) => {
      const leftValue = resolveSortValue(left.row.row, column);
      const rightValue = resolveSortValue(right.row.row, column);
      if (leftValue === null && rightValue === null) {
        return left.stableIndex - right.stableIndex;
      }
      if (leftValue === null) {
        return 1;
      }
      if (rightValue === null) {
        return -1;
      }
      const comparison = compareValues(leftValue, rightValue, locale);
      if (comparison !== 0) {
        return comparison * multiplier;
      }
      return left.stableIndex - right.stableIndex;
    })
    .map((entry) => entry.row);
}

export function sliceRows<T>(
  rows: readonly SolarisTableResolvedRow<T>[],
  pageIndex: number,
  pageSize: number,
): readonly SolarisTableResolvedRow<T>[] {
  const size = Math.max(1, Math.floor(pageSize) || 1);
  const start = Math.max(0, pageIndex) * size;
  return rows.slice(start, start + size);
}

export function clampPageIndex(
  pageIndex: number,
  pageSize: number,
  total: number | undefined,
): number {
  const normalized = Number.isFinite(pageIndex)
    ? Math.max(0, Math.floor(pageIndex))
    : 0;
  if (total === undefined) {
    return normalized;
  }
  if (total <= 0) {
    return 0;
  }
  const size = Math.max(1, Math.floor(pageSize) || 1);
  const maxPageIndex = Math.max(0, Math.ceil(total / size) - 1);
  return Math.min(normalized, maxPageIndex);
}

export function createClientTableDataSource<T>(
  rows: Signal<readonly T[]> | readonly T[],
  sort: Signal<SolarisTableSort | null>,
  columns:
    | Signal<readonly SolarisTableColumn<T>[]>
    | readonly SolarisTableColumn<T>[],
  rowId:
    | Signal<keyof T | ((row: T, index: number) => string)>
    | keyof T
    | ((row: T, index: number) => string),
  locale = 'en-US',
): SolarisTableDataSource<T> {
  const rowsSignal: Signal<readonly T[]> =
    typeof rows === 'function' ? rows : signal(rows);
  const columnsSignal: Signal<readonly SolarisTableColumn<T>[]> =
    typeof columns === 'function' ? columns : signal(columns);
  const rowIdSignal: Signal<keyof T | ((row: T, index: number) => string)> =
    typeof rowId === 'function' && rowId.length === 0
      ? (rowId as unknown as Signal<
          keyof T | ((row: T, index: number) => string)
        >)
      : signal(rowId as keyof T | ((row: T, index: number) => string));
  const sorted = computed(() =>
    sortRows(
      resolveRows(rowsSignal(), rowIdSignal()),
      columnsSignal(),
      sort(),
      locale,
    ),
  );
  const total = computed(() => sorted().length);
  const loading = signal(false);
  return {
    rows: computed(() => sorted().map((entry) => entry.row)),
    total,
    loading: loading.asReadonly(),
  };
}

export function createServerTableDataSource<T>(
  rows: Signal<readonly T[]>,
  total: Signal<number | undefined>,
  loading: Signal<boolean>,
): SolarisTableDataSource<T> {
  return { rows, total, loading };
}

function normalizeComparable(
  value: unknown,
  type: SolarisTableColumn<unknown>['type'],
): ComparableValue {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === 'string' && value.trim() === '') {
    return null;
  }
  switch (type) {
    case 'number':
      return toNumericValue(value);
    case 'date':
      return toDateValue(value);
    default:
      return String(value).toLowerCase();
  }
}

function compareValues(
  left: ComparableValue,
  right: ComparableValue,
  locale: string,
): number {
  if (left === null && right === null) {
    return 0;
  }
  if (left === null) {
    return 1;
  }
  if (right === null) {
    return -1;
  }
  if (typeof left === 'number' && typeof right === 'number') {
    return left - right;
  }
  return String(left).localeCompare(String(right), locale, {
    numeric: true,
    sensitivity: 'base',
  });
}

function toNumericValue(value: unknown): number | null {
  const numeric = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function toDateValue(value: unknown): number | string | null {
  if (value instanceof Date) {
    const time = value.getTime();
    return Number.isFinite(time) ? time : null;
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }
    const time = Date.parse(trimmed);
    return Number.isFinite(time) ? time : trimmed.toLowerCase();
  }
  return null;
}
