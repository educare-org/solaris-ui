import type { SolarisTableColumnType } from '../../table/model/table.types';
import type { SolarisExporter } from '../../../../services/export';

export const SOLARIS_TABLE_FILTER_OPERATORS = [
  'contains',
  'equals',
  'notEquals',
  'startsWith',
  'isEmpty',
  'isNotEmpty',
  'gt',
  'gte',
  'lt',
  'lte',
  'between',
  'in',
  'notIn',
] as const;

export type SolarisTableFilterOperator =
  (typeof SOLARIS_TABLE_FILTER_OPERATORS)[number];

export type SolarisTableFilterConditionValue =
  | string
  | number
  | readonly string[]
  | {
      readonly from?: string | number | null;
      readonly to?: string | number | null;
    }
  | null;

export interface SolarisTableFilterCondition {
  readonly columnId: string;
  readonly operator: SolarisTableFilterOperator;
  readonly value?: SolarisTableFilterConditionValue;
}

export interface SolarisTableFilterState {
  readonly globalSearch: string;
  readonly conditions: readonly SolarisTableFilterCondition[];
  readonly columnVisibility: Readonly<Record<string, boolean>>;
  readonly columnOrder: readonly string[];
}

export interface SolarisTableFilterOption {
  readonly value: string;
  readonly label?: string;
  readonly labelKey?: string;
}

export interface SolarisTableFilterableColumn<T = unknown> {
  readonly id: string;
  readonly header?: string;
  readonly headerKey?: string;
  readonly type?: SolarisTableColumnType;
  readonly accessor?: keyof T | ((row: T) => unknown);
  readonly displayValueOf?: (row: T) => string | null;
  readonly filterable?: boolean;
  readonly filterOptions?: readonly SolarisTableFilterOption[];
}

export interface SolarisTableView {
  readonly id: string;
  readonly name: string;
  readonly nameKey?: string;
  readonly filter: SolarisTableFilterState;
  readonly isDefault?: boolean;
}

export const SOLARIS_TABLE_TOOLBAR_EXPORT_DISPLAYS = [
  'icon',
  'icon-label',
] as const;

export type SolarisTableToolbarExportDisplay =
  (typeof SOLARIS_TABLE_TOOLBAR_EXPORT_DISPLAYS)[number];

export interface SolarisTableExportEvent<T = unknown> {
  readonly exporter: SolarisExporter<T>;
  readonly filename: string;
  readonly truncated: boolean;
}
