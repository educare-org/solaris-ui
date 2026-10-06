export type SolarisPaginationDensity = 'compact' | 'normal' | 'comfortable';

export interface SolarisPaginationState {
  readonly pageIndex: number;
  readonly pageSize: number;
  readonly total?: number;
  readonly hasMore?: boolean;
  readonly pageSizeOptions?: readonly number[];
  readonly showFirstLast?: boolean;
  readonly showRangeLabel?: boolean;
  readonly showPageSize?: boolean;
}

export interface SolarisPageChange {
  readonly pageIndex: number;
  readonly pageSize: number;
}
