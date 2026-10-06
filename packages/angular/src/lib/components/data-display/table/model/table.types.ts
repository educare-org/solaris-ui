import type { Signal } from '@angular/core';

export type SolarisTableDensity = 'compact' | 'normal' | 'comfortable';

export const SOLARIS_TABLE_COLUMN_TYPES = [
  'text',
  'number',
  'date',
  'checkbox',
  'custom',
] as const;

export type SolarisTableColumnType =
  (typeof SOLARIS_TABLE_COLUMN_TYPES)[number];

export type SolarisTableSortDirection = 'asc' | 'desc';

export const SOLARIS_TABLE_SELECTION_MODES = [
  'none',
  'single',
  'multiple',
] as const;

export type SolarisTableSelectionMode =
  (typeof SOLARIS_TABLE_SELECTION_MODES)[number];

export type SolarisTableAlign = 'start' | 'center' | 'end';

export const SOLARIS_TABLE_CELL_PADDINGS = ['none', 'sm', 'md', 'lg'] as const;

export type SolarisTableCellPadding =
  (typeof SOLARIS_TABLE_CELL_PADDINGS)[number];

export interface SolarisTableSort {
  readonly columnId: string;
  readonly direction: SolarisTableSortDirection;
}

export interface SolarisTableColumn<T = unknown> {
  readonly id: string;
  readonly header?: string;
  readonly headerKey?: string;
  readonly type?: SolarisTableColumnType;
  readonly accessor?: keyof T | ((row: T) => unknown);
  readonly displayValueOf?: (row: T) => string | null;
  readonly sortValueOf?: (row: T) => string | number | null;
  readonly sortable?: boolean;
  readonly width?: string;
  readonly minWidth?: string;
  readonly maxWidth?: string;
  readonly align?: SolarisTableAlign;
  readonly headerAlign?: SolarisTableAlign;
  readonly hidden?: boolean;
  readonly priority?: number;
  readonly cellTemplateId?: string;
  readonly headerTemplateId?: string;
  readonly detailTemplateId?: string;
  readonly locale?: string;
  readonly dateFormat?: string;
  readonly numberFormat?: Intl.NumberFormatOptions;
}

export interface SolarisTableSelectionChange<T = unknown> {
  readonly selectedRows: readonly T[];
  readonly selectedRowIds: readonly string[];
  readonly changedRow?: T;
  readonly changedRowId?: string;
}

export interface SolarisTableRowClickEvent<T = unknown> {
  readonly row: T;
  readonly rowId: string;
  readonly originalEvent: Event;
}

export interface SolarisTableDataSource<T = unknown> {
  readonly rows: Signal<readonly T[]>;
  readonly total: Signal<number | undefined>;
  readonly loading: Signal<boolean>;
}

export interface SolarisTableResolvedRow<T = unknown> {
  readonly row: T;
  readonly rowId: string;
  readonly index: number;
}

export interface SolarisTableViewColumn<T = unknown>
  extends SolarisTableColumn<T> {
  readonly type: NonNullable<SolarisTableColumn<T>['type']>;
}

export interface SolarisTableViewRow<T = unknown>
  extends SolarisTableResolvedRow<T> {
  readonly selected: boolean;
}

export interface SolarisTableCellContext<T = unknown> {
  readonly $implicit: T;
  readonly row: T;
  readonly rowId: string;
  readonly value: unknown;
  readonly column: SolarisTableColumn<T>;
  readonly index: number;
}
