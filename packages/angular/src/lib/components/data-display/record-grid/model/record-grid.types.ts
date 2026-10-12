import type { SolarisTableColumn } from '../../table/model/table.types';

export const SOLARIS_RECORD_GRID_FORMULAS = [
  'sum',
  'average',
  'min',
  'max',
  'weighted',
] as const;

export type SolarisRecordGridFormula =
  (typeof SOLARIS_RECORD_GRID_FORMULAS)[number];

export interface SolarisRecordGridComputed {
  readonly from: readonly string[];
  readonly by: SolarisRecordGridFormula;
  readonly weights?: Readonly<Record<string, number>>;
}

export interface SolarisRecordGridSection {
  readonly id: string;
  readonly header?: string;
  readonly headerKey?: string;
}

export interface SolarisRecordGridColumn<T = unknown>
  extends SolarisTableColumn<T> {
  readonly sectionId?: string;
  readonly computed?: SolarisRecordGridComputed;
  readonly validateOf?: (
    row: T,
    columnId: string,
    value: unknown,
  ) => string | null;
  readonly writeOf?: (row: T, value: unknown) => T;
  readonly rowspanOf?: (row: T, index: number) => number;
  readonly colspanOf?: (row: T, index: number) => number;
}

export interface SolarisRecordGridCommit<T = unknown> {
  readonly row: T;
  readonly rowId: string;
  readonly columnId: string;
  readonly column: SolarisTableColumn<T>;
  readonly previousValue: unknown;
  readonly value: unknown;
  readonly at: string;
}

export interface SolarisRecordGridSectionGroup<T = unknown> {
  readonly sectionId: string | null;
  readonly rows: readonly T[];
}

export interface SolarisRecordGridEntry<T = unknown> {
  readonly row: T;
  readonly rowId: string;
  readonly index: number;
  readonly values: Record<string, unknown>;
  readonly sectionId: string | null;
  readonly selected: boolean;
}

export function toRecordSortable(value: unknown): string | number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  const text = String(value).trim();
  return text.length > 0 ? text : null;
}

export function compareRecordSortable(
  left: string | number | null,
  right: string | number | null,
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
    return left < right ? -1 : left > right ? 1 : 0;
  }
  return String(left).localeCompare(String(right), locale);
}

export interface SolarisRecordGridSpanCell<T = unknown> {
  readonly column: SolarisRecordGridColumn<T>;
  readonly columnIndex: number;
  readonly rowSpan: number;
  readonly colSpan: number;
  readonly covered: boolean;
}

export class SolarisRecordGridFormulaError extends Error {
  readonly reason: 'cycle' | 'unknown-column';
  readonly columns: readonly string[];

  constructor(reason: 'cycle' | 'unknown-column', columns: readonly string[]) {
    super(
      reason === 'cycle'
        ? `Solaris record-grid formula cycle detected: ${columns.join(' -> ')}`
        : `Solaris record-grid formula references unknown columns: ${columns.join(', ')}`,
    );
    this.name = 'SolarisRecordGridFormulaError';
    this.reason = reason;
    this.columns = columns;
  }
}

export function normalizeRecordValue(value: unknown): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const numeric = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

export function recordGridColumnIdOf<T>(
  column: Pick<SolarisTableColumn<T>, 'id'>,
): string {
  return column.id;
}

export function defaultWriteRecordValue<T>(
  row: T,
  column: SolarisRecordGridColumn<T>,
  value: unknown,
): T {
  const custom = column.writeOf?.(row, value);
  if (custom !== undefined) {
    return custom;
  }
  if (typeof row === 'object' && row !== null) {
    const key =
      typeof column.accessor === 'string' ? column.accessor : column.id;
    return { ...(row as Record<string, unknown>), [key]: value } as T;
  }
  return row;
}

export function buildFormulaGraph<T>(
  columns: readonly SolarisRecordGridColumn<T>[],
): ReadonlyMap<string, readonly string[]> {
  const known = new Set(columns.map((column) => column.id));
  const graph = new Map<string, readonly string[]>();
  for (const column of columns) {
    if (column.computed === undefined) {
      continue;
    }
    const unknown = column.computed.from.filter((id) => !known.has(id));
    if (unknown.length > 0) {
      throw new SolarisRecordGridFormulaError('unknown-column', unknown);
    }
    graph.set(column.id, column.computed.from);
  }
  return graph;
}

export function topoSortFormulaColumns<T>(
  columns: readonly SolarisRecordGridColumn<T>[],
): readonly string[] {
  const graph = buildFormulaGraph(columns);
  const visited = new Map<string, 'visiting' | 'visited'>();
  const order: string[] = [];

  const visit = (id: string, trail: readonly string[]): void => {
    const state = visited.get(id);
    if (state === 'visited') {
      return;
    }
    if (state === 'visiting') {
      const start = trail.indexOf(id);
      throw new SolarisRecordGridFormulaError(
        'cycle',
        start >= 0 ? [...trail.slice(start), id] : [...trail, id],
      );
    }
    visited.set(id, 'visiting');
    for (const dependency of graph.get(id) ?? []) {
      if (graph.has(dependency)) {
        visit(dependency, [...trail, id]);
      }
    }
    visited.set(id, 'visited');
    order.push(id);
  };

  for (const id of graph.keys()) {
    visit(id, []);
  }
  return order;
}

function computeFormulaValue(
  values: Readonly<Record<string, unknown>>,
  computed: SolarisRecordGridComputed,
): number | null {
  const entries = computed.from.map((id) => ({
    value: normalizeRecordValue(values[id]),
    weight: computed.weights?.[id] ?? 1,
  }));
  const present = entries.filter(
    (entry): entry is { value: number; weight: number } =>
      entry.value !== null &&
      Number.isFinite(entry.weight) &&
      entry.weight !== 0,
  );
  if (present.length === 0) {
    return null;
  }
  switch (computed.by) {
    case 'sum':
      return present.reduce((sum, entry) => sum + entry.value, 0);
    case 'min':
      return Math.min(...present.map((entry) => entry.value));
    case 'max':
      return Math.max(...present.map((entry) => entry.value));
    case 'weighted': {
      const weightTotal = present.reduce((sum, entry) => sum + entry.weight, 0);
      if (weightTotal === 0) {
        return null;
      }
      return (
        present.reduce((sum, entry) => sum + entry.value * entry.weight, 0) /
        weightTotal
      );
    }
    case 'average':
    default:
      return (
        present.reduce((sum, entry) => sum + entry.value, 0) / present.length
      );
  }
}

export function resolveRecordValues<T>(
  values: Readonly<Record<string, unknown>>,
  columns: readonly SolarisRecordGridColumn<T>[],
): Record<string, unknown> {
  const order = topoSortFormulaColumns(columns);
  const byId = new Map(columns.map((column) => [column.id, column]));
  const resolved: Record<string, unknown> = { ...values };
  for (const id of order) {
    const column = byId.get(id);
    if (column?.computed === undefined) {
      continue;
    }
    resolved[id] = computeFormulaValue(resolved, column.computed);
  }
  return resolved;
}

export function resolveSectionGroups<T>(
  rows: readonly T[],
  sectionOf: (row: T, index: number) => string | null,
): readonly SolarisRecordGridSectionGroup<T>[] {
  const groups: {
    sectionId: string | null;
    rows: T[];
  }[] = [];
  const byId = new Map<
    string | null,
    { sectionId: string | null; rows: T[] }
  >();
  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    if (row === undefined) {
      continue;
    }
    const sectionId = sectionOf(row, index);
    const current = byId.get(sectionId);
    if (current !== undefined) {
      current.rows.push(row);
    } else {
      const group = { sectionId, rows: [row] };
      byId.set(sectionId, group);
      groups.push(group);
    }
  }
  return groups;
}

function normalizeSpanSize(value: number): number {
  if (!Number.isFinite(value)) {
    return 1;
  }
  return Math.max(1, Math.floor(value));
}

export function resolveBodySpans<T>(
  rows: readonly T[],
  columns: readonly SolarisRecordGridColumn<T>[],
): readonly (readonly SolarisRecordGridSpanCell<T>[])[] {
  const visible = columns.filter((column) => column.hidden !== true);
  const covered: boolean[][] = rows.map(() => visible.map(() => false));
  return rows.map((row, rowIndex) => {
    const cells: SolarisRecordGridSpanCell<T>[] = [];
    visible.forEach((column, columnIndex) => {
      if (covered[rowIndex]?.[columnIndex] === true) {
        cells.push({
          column,
          columnIndex,
          rowSpan: 1,
          colSpan: 1,
          covered: true,
        });
        return;
      }
      const rowSpan = Math.min(
        normalizeSpanSize(column.rowspanOf?.(row, rowIndex) ?? 1),
        rows.length - rowIndex,
      );
      const colSpan = Math.min(
        normalizeSpanSize(column.colspanOf?.(row, rowIndex) ?? 1),
        visible.length - columnIndex,
      );
      for (
        let coverRow = rowIndex;
        coverRow < rowIndex + rowSpan;
        coverRow += 1
      ) {
        for (
          let coverColumn = columnIndex;
          coverColumn < columnIndex + colSpan;
          coverColumn += 1
        ) {
          if (coverRow === rowIndex && coverColumn === columnIndex) {
            continue;
          }
          const rowCover = covered[coverRow];
          if (rowCover !== undefined) {
            rowCover[coverColumn] = true;
          }
        }
      }
      cells.push({ column, columnIndex, rowSpan, colSpan, covered: false });
    });
    return cells;
  });
}

export function buildRecordGridColumns<T>(
  sections: readonly SolarisRecordGridSection[],
  columns: readonly SolarisRecordGridColumn<T>[],
): SolarisRecordGridColumn<T>[] {
  const known = new Set(sections.map((section) => section.id));
  return columns.map((column) => {
    if (column.sectionId === undefined || known.has(column.sectionId)) {
      return column;
    }
    return { ...column, sectionId: undefined };
  });
}
