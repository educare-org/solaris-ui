import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  PLATFORM_ID,
  booleanAttribute,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import {
  NgTemplateOutlet,
  formatDate,
  isPlatformBrowser,
} from '@angular/common';

import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisSkeletonComponent } from '../../../feedback/skeleton';
import { SolarisCheckboxComponent } from '../../../forms/checkbox';
import { SolarisThemeService } from '../../../../services/theme';
import { SolarisIconComponent } from '../../../icon';
import { nextIdFor } from '../../../../core';

import {
  DEFAULT_SOLARIS_TABLE_LOADING_ROW_COUNT,
  DETAIL_COLLAPSE_DURATION_MS,
  SOLARIS_TABLE_SELECTION_COLUMN_ID,
  TABLE_ACTIONS_COLUMN_LABEL,
  TABLE_ACTIONS_COLUMN_LABEL_KEY,
  TABLE_ARIA_LABEL_FALLBACK_KEY,
  TABLE_ARIA_LABEL_FALLBACK_TEXT,
  TABLE_COLLAPSE_CELL_LABEL,
  TABLE_COLLAPSE_CELL_LABEL_KEY,
  TABLE_COLLAPSE_ROW_LABEL,
  TABLE_COLLAPSE_ROW_LABEL_KEY,
  TABLE_EMPTY_TEXT,
  TABLE_EMPTY_TEXT_KEY,
  TABLE_ERROR_TEXT,
  TABLE_ERROR_TEXT_KEY,
  TABLE_EXPAND_CELL_LABEL,
  TABLE_EXPAND_CELL_LABEL_KEY,
  TABLE_EXPAND_ROW_LABEL,
  TABLE_EXPAND_ROW_LABEL_KEY,
  TABLE_LOADING_TEXT,
  TABLE_LOADING_TEXT_KEY,
  TABLE_SELECT_ALL_LABEL,
  TABLE_SELECT_ALL_LABEL_KEY,
  TABLE_SELECT_ROW_LABEL,
  TABLE_SELECT_ROW_LABEL_KEY,
  TABLE_SORTED_ANNOUNCE,
  TABLE_SORTED_ANNOUNCE_KEY,
  TABLE_SORTED_CLEARED_ANNOUNCE,
  TABLE_SORT_ASC_LABEL,
  TABLE_SORT_ASC_LABEL_KEY,
  TABLE_SORT_CLEAR_LABEL,
  TABLE_SORT_CLEAR_LABEL_KEY,
  TABLE_SORT_DESC_LABEL,
  TABLE_SORT_DESC_LABEL_KEY,
  cellExpansionKey,
  interpolateTableText,
  normalizeOptionalString,
  normalizeTableAppearance,
  normalizeTableColumnType,
  normalizeTableExpandMode,
  normalizeTableLayout,
  normalizeTableSelectionMode,
  normalizeTableSort,
  normalizeTableStripedMode,
} from '../model/table.defaults';
import {
  isTableDataSource,
  resolveCellValue,
  resolveRowId,
  resolveRows,
  sortRows,
} from '../model/table-state';
import type {
  SolarisTableAppearance,
  SolarisTableCellContext,
  SolarisTableCellPadding,
  SolarisTableColumn,
  SolarisTableDataSource,
  SolarisTableDensity,
  SolarisTableExpandMode,
  SolarisTableLayout,
  SolarisTableResolvedRow,
  SolarisTableRowClickEvent,
  SolarisTableSelectionChange,
  SolarisTableSelectionMode,
  SolarisTableSort,
  SolarisTableStripedMode,
  SolarisTableViewColumn,
  SolarisTableViewRow,
} from '../model/table.types';
import {
  SolarisTableCellDirective,
  SolarisTableDetailDirective,
  SolarisTableEmptyDirective,
  SolarisTableErrorDirective,
  SolarisTableHeaderDirective,
  SolarisTableLoadingDirective,
} from '../directives/table-cell.directive';

@Component({
  selector: 'solaris-table',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    SolarisCheckboxComponent,
    SolarisSkeletonComponent,
    SolarisIconComponent,
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-appearance]': 'normalizedAppearance()',
    '[attr.data-striped]': 'striped() || undefined',
    '[attr.data-striped-mode]': 'normalizedStripedMode()',
    '[attr.data-hover]': 'hover() || undefined',
    '[attr.data-sticky-header]': 'stickyHeader() || undefined',
    '[attr.data-selectable]': 'isSelectable() || undefined',
    '[attr.data-expandable]': 'expandable() || undefined',
    '[attr.data-expand-mode]': 'normalizedExpandMode()',
    '[attr.data-mobile]': 'isMobileLayout() || undefined',
    '[attr.data-layout]': 'normalizedLayout()',
    '[attr.data-card-layout]': 'isCardLayout() || undefined',
    '[attr.data-fullwidth]': 'fullWidth() || undefined',
    '[attr.data-cell-padding]': 'cellPadding()',
  },
})
export class SolarisTableComponent<T = unknown> {
  protected readonly themeService = inject(SolarisThemeService);
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly hostId = nextIdFor('solaris-table');

  protected readonly loadingRowIndexes = Array.from(
    { length: DEFAULT_SOLARIS_TABLE_LOADING_ROW_COUNT },
    (_, index) => index,
  );

  readonly cellTemplates = contentChildren(SolarisTableCellDirective);
  readonly headerTemplates = contentChildren(SolarisTableHeaderDirective);
  readonly detailTemplates = contentChildren(SolarisTableDetailDirective);
  readonly emptyTemplate = contentChildren(SolarisTableEmptyDirective);
  readonly errorTemplate = contentChildren(SolarisTableErrorDirective);
  readonly loadingTemplate = contentChildren(SolarisTableLoadingDirective);

  readonly data = input<SolarisTableDataSource<T> | readonly T[]>([]);
  readonly columns = input<readonly SolarisTableColumn<T>[]>([]);
  readonly rowId = input.required<
    keyof T | ((row: T, index: number) => string)
  >();
  readonly sort = model<SolarisTableSort | null>(null);
  readonly selectedRowIds = model<readonly string[]>([]);
  readonly selectionMode = input<SolarisTableSelectionMode>('none');
  readonly loading = input(false, { transform: booleanAttribute });
  readonly error = input<string | null>(null);
  readonly errorKey = input<string | null>(null);
  readonly emptyText = input<string | null>(null);
  readonly emptyTextKey = input<string | null>(null);
  readonly loadingText = input<string | null>(null);
  readonly loadingTextKey = input<string | null>(null);
  readonly striped = input(false, { transform: booleanAttribute });
  readonly stripedMode = input<SolarisTableStripedMode>('even');
  readonly stickyHeader = input(true, { transform: booleanAttribute });
  readonly hover = input(true, { transform: booleanAttribute });
  readonly rowClickable = input(false, { transform: booleanAttribute });
  readonly expandable = input(false, { transform: booleanAttribute });
  readonly expandMode = input<SolarisTableExpandMode>('row');
  readonly appearance = input<SolarisTableAppearance>('outline');
  readonly mobile = input(false, { transform: booleanAttribute });
  readonly layout = input<SolarisTableLayout>('auto');
  readonly cardTitleOf = input<((row: T) => string | null) | undefined>(
    undefined,
  );
  readonly cardSubtitleOf = input<((row: T) => string | null) | undefined>(
    undefined,
  );
  readonly fullWidth = input(false, { transform: booleanAttribute });
  readonly cellPadding = input<SolarisTableCellPadding>('none');
  readonly density = input<SolarisTableDensity | undefined>(undefined);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelKey = input<string | undefined>(undefined);

  readonly selectionChange = output<SolarisTableSelectionChange<T>>();
  readonly rowClick = output<SolarisTableRowClickEvent<T>>();

  protected readonly effectiveDensity = computed(
    () => this.density() ?? this.themeService.density,
  );

  protected readonly normalizedSelectionMode = computed(() =>
    normalizeTableSelectionMode(this.selectionMode()),
  );

  protected readonly normalizedAppearance = computed(() =>
    normalizeTableAppearance(this.appearance()),
  );

  protected readonly normalizedStripedMode = computed(() =>
    normalizeTableStripedMode(this.stripedMode()),
  );

  protected readonly normalizedExpandMode = computed(() =>
    normalizeTableExpandMode(this.expandMode()),
  );

  protected readonly normalizedLayout = computed(() => {
    if (this.mobile()) {
      return 'card' as SolarisTableLayout;
    }
    return normalizeTableLayout(this.layout());
  });

  protected readonly isMobileLayout = computed(
    () => this.normalizedLayout() === 'card',
  );

  protected readonly isSelectable = computed(
    () => this.normalizedSelectionMode() !== 'none',
  );

  protected readonly isRowExpandable = computed(() => {
    const mode = this.normalizedExpandMode();
    return this.expandable() && (mode === 'row' || mode === 'both');
  });

  protected readonly isCellExpandable = computed(() => {
    const mode = this.normalizedExpandMode();
    return this.expandable() && (mode === 'cell' || mode === 'both');
  });

  protected readonly isCardLayout = computed(
    () => this.expandable() && (this.isMobileLayout() || this.narrowViewport()),
  );

  protected readonly cardColumns = computed(() =>
    this.userColumns().filter((column) => column.type !== 'checkbox'),
  );

  protected readonly isBrowser = computed(() =>
    isPlatformBrowser(this.platformId),
  );

  private readonly narrowViewport = signal(false);
  private readonly expandedRowIds = signal<readonly string[]>([]);
  private readonly expandedCells = signal<readonly string[]>([]);
  private readonly collapsingRowIds = signal<readonly string[]>([]);
  private readonly openedRowIds = signal<readonly string[]>([]);
  private readonly collapseTimers = new Map<
    string,
    ReturnType<typeof setTimeout>
  >();
  private readonly openFrames = new Map<string, number>();
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    if (
      isPlatformBrowser(this.platformId) &&
      typeof window.matchMedia !== 'undefined'
    ) {
      const query = window.matchMedia('(max-width: 720px)');
      this.narrowViewport.set(query.matches);
      const listener = (event: MediaQueryListEvent): void => {
        this.narrowViewport.set(event.matches);
      };
      query.addEventListener('change', listener);
      this.destroyRef.onDestroy(() =>
        query.removeEventListener('change', listener),
      );
    }
    this.destroyRef.onDestroy(() => {
      for (const timer of this.collapseTimers.values()) {
        clearTimeout(timer);
      }
      this.collapseTimers.clear();
      for (const frame of this.openFrames.values()) {
        cancelAnimationFrame(frame);
      }
      this.openFrames.clear();
    });

    effect(() => {
      if (this.normalizedSelectionMode() !== 'single') {
        return;
      }
      const ids = this.selectedRowIds();
      if (ids.length <= 1) {
        return;
      }
      const next = ids.slice(0, 1);
      this.selectedRowIds.set(next);
      this.selectionChange.emit({
        selectedRowIds: next,
        selectedRows: next
          .map((rowId) => this.selectedRowCache().get(rowId))
          .filter((row): row is T => row !== undefined),
      });
    });
  }

  private readonly externalSource = computed(() => {
    const data = this.data();
    return isTableDataSource(data) ? data : null;
  });

  protected readonly userColumns = computed<
    readonly SolarisTableViewColumn<T>[]
  >(() =>
    this.columns()
      .filter((column) => !column.hidden)
      .map((column) => ({
        ...column,
        type: normalizeTableColumnType(column.type),
      })),
  );

  protected readonly renderedColumns = computed<
    readonly SolarisTableViewColumn<T>[]
  >(() => {
    const columns = this.userColumns();
    if (!this.isSelectable()) {
      return columns;
    }
    if (columns.some((column) => column.type === 'checkbox')) {
      return columns;
    }
    return [
      {
        id: SOLARIS_TABLE_SELECTION_COLUMN_ID,
        type: 'checkbox',
        width: '44px',
        minWidth: '44px',
        maxWidth: '44px',
        align: 'center',
        headerAlign: 'center',
      } as SolarisTableViewColumn<T>,
      ...columns,
    ];
  });

  protected readonly detailColumns = computed(() =>
    this.userColumns().filter(
      (column) =>
        (column.priority !== undefined ||
          column.detailTemplateId !== undefined) &&
        column.type !== 'checkbox',
    ),
  );

  protected readonly cellExpandableColumns = computed(() =>
    this.userColumns().filter(
      (column) =>
        (column.expandable === true || column.detailTemplateId !== undefined) &&
        column.type !== 'checkbox',
    ),
  );

  protected readonly resolvedRows = computed(
    (): readonly SolarisTableResolvedRow<T>[] => {
      const source = this.externalSource();
      if (source) {
        return source.rows().map((row, index) => ({
          row,
          rowId: resolveRowId(row, this.rowId(), index),
          index,
        }));
      }
      return resolveRows(this.data() as readonly T[], this.rowId());
    },
  );

  protected readonly sortedRows = computed(() => {
    if (this.externalSource()) {
      return this.resolvedRows();
    }
    return sortRows(
      this.resolvedRows(),
      this.userColumns(),
      normalizeTableSort(this.sort()),
      this.locale(),
    );
  });

  protected readonly visibleRows = computed(
    (): readonly SolarisTableViewRow<T>[] => {
      const selectedIds = new Set(this.selectedRowIds());
      return this.sortedRows().map((row) => ({
        ...row,
        selected: selectedIds.has(row.rowId),
      }));
    },
  );

  private readonly selectedRowCache = computed(() => {
    const cache = new Map<string, T>();
    for (const row of this.resolvedRows()) {
      cache.set(row.rowId, row.row);
    }
    return cache;
  });

  protected readonly effectiveLoading = computed(
    () => this.loading() || (this.externalSource()?.loading() ?? false),
  );

  protected readonly total = computed<number | undefined>(
    () => this.externalSource()?.total() ?? this.sortedRows().length,
  );

  protected readonly resolvedTableAriaLabel = computed(() =>
    this.resolveText(
      this.ariaLabel(),
      this.ariaLabelKey() ?? TABLE_ARIA_LABEL_FALLBACK_KEY,
      TABLE_ARIA_LABEL_FALLBACK_TEXT,
    ).trim(),
  );

  protected readonly resolvedLoadingText = computed(() =>
    this.resolveText(
      this.loadingText(),
      this.loadingTextKey() ?? TABLE_LOADING_TEXT_KEY,
      TABLE_LOADING_TEXT,
    ).trim(),
  );

  protected readonly resolvedErrorText = computed(() =>
    !normalizeOptionalString(this.error()) &&
    !normalizeOptionalString(this.errorKey())
      ? ''
      : this.resolveText(
          this.error(),
          this.errorKey() ?? TABLE_ERROR_TEXT_KEY,
          TABLE_ERROR_TEXT,
        ).trim(),
  );

  protected readonly resolvedEmptyText = computed(() =>
    this.resolveText(
      this.emptyText(),
      this.emptyTextKey() ?? TABLE_EMPTY_TEXT_KEY,
      TABLE_EMPTY_TEXT,
    ).trim(),
  );

  protected readonly resolvedSelectAllLabel = computed(() =>
    this.resolveText(
      null,
      TABLE_SELECT_ALL_LABEL_KEY,
      TABLE_SELECT_ALL_LABEL,
    ).trim(),
  );

  protected readonly resolvedExpandColumnLabel = computed(() =>
    this.resolveText(
      null,
      TABLE_ACTIONS_COLUMN_LABEL_KEY,
      TABLE_ACTIONS_COLUMN_LABEL,
    ).trim(),
  );

  protected readonly hasError = computed(
    () => this.resolvedErrorText().length > 0 && !this.effectiveLoading(),
  );

  protected readonly hasEmptyState = computed(
    () =>
      !this.effectiveLoading() &&
      !this.hasError() &&
      this.visibleRows().length === 0,
  );

  protected readonly allVisibleRowsSelected = computed(() => {
    const visibleRows = this.visibleRows();
    if (!visibleRows.length || this.normalizedSelectionMode() !== 'multiple') {
      return false;
    }
    return visibleRows.every((row) => row.selected);
  });

  protected readonly someVisibleRowsSelected = computed(() => {
    if (this.normalizedSelectionMode() !== 'multiple') {
      return false;
    }
    const visibleRows = this.visibleRows();
    if (!visibleRows.length) {
      return false;
    }
    const selectedCount = visibleRows.filter((row) => row.selected).length;
    return selectedCount > 0 && selectedCount < visibleRows.length;
  });

  protected readonly sortAnnouncement = signal('');

  protected readonly detailColumnCount = computed(
    () => this.renderedColumns().length + (this.isRowExpandable() ? 1 : 0),
  );

  protected isCellExpandableColumn(column: SolarisTableViewColumn<T>): boolean {
    if (!this.isCellExpandable() || column.type === 'checkbox') {
      return false;
    }
    return column.expandable === true || column.detailTemplateId !== undefined;
  }

  protected isCellExpanded(
    row: SolarisTableViewRow<T>,
    column: SolarisTableViewColumn<T>,
  ): boolean {
    return this.expandedCells().includes(
      cellExpansionKey(row.rowId, column.id),
    );
  }

  protected cellDetailId(
    row: SolarisTableViewRow<T>,
    columnIndex: number,
  ): string {
    return `${this.hostId}-cell-detail-${row.rowId}-${columnIndex}`;
  }

  protected cellDetailRowId(rowIndex: number): string {
    return `${this.hostId}-cell-detail-row-${rowIndex}`;
  }

  protected expandedCellColumns(
    row: SolarisTableViewRow<T>,
  ): readonly SolarisTableViewColumn<T>[] {
    if (!this.isCellExpandable()) {
      return [];
    }
    const expanded = new Set(this.expandedCells());
    return this.userColumns().filter(
      (column) =>
        column.type !== 'checkbox' &&
        expanded.has(cellExpansionKey(row.rowId, column.id)),
    );
  }

  protected hasExpandedCells(row: SolarisTableViewRow<T>): boolean {
    return this.expandedCellColumns(row).length > 0;
  }

  protected toggleCellExpanded(
    row: SolarisTableViewRow<T>,
    column: SolarisTableViewColumn<T>,
  ): void {
    if (!this.isCellExpandableColumn(column)) {
      return;
    }
    const key = cellExpansionKey(row.rowId, column.id);
    const current = this.expandedCells();
    this.expandedCells.set(
      current.includes(key)
        ? current.filter((entry) => entry !== key)
        : [...current, key],
    );
  }

  protected resolveCellExpandLabel(
    row: SolarisTableViewRow<T>,
    column: SolarisTableViewColumn<T>,
  ): string {
    const columnLabel = this.resolveColumnHeader(column);
    const expanded = this.isCellExpanded(row, column);
    return interpolateTableText(
      this.resolveText(
        null,
        expanded ? TABLE_COLLAPSE_CELL_LABEL_KEY : TABLE_EXPAND_CELL_LABEL_KEY,
        expanded ? TABLE_COLLAPSE_CELL_LABEL : TABLE_EXPAND_CELL_LABEL,
      ),
      { column: columnLabel, rowId: row.rowId },
    );
  }

  protected resolveCardTitle(row: SolarisTableViewRow<T>): string | null {
    const custom = this.cardTitleOf?.();
    if (custom) {
      const value = custom(row.row);
      if (value !== null && value.trim() !== '') {
        return value;
      }
    }
    return null;
  }

  protected resolveCardSubtitle(row: SolarisTableViewRow<T>): string | null {
    const custom = this.cardSubtitleOf?.();
    if (custom) {
      const value = custom(row.row);
      if (value !== null && value.trim() !== '') {
        return value;
      }
    }
    return null;
  }

  protected trackByColumnId(
    index: number,
    column: SolarisTableViewColumn<T>,
  ): string {
    return `${index}-${column.id}`;
  }

  protected trackByRowId(index: number, row: SolarisTableViewRow<T>): string {
    return `${index}-${row.rowId}`;
  }

  protected resolveColumnHeader(column: SolarisTableViewColumn<T>): string {
    return this.resolveText(column.header, column.headerKey, column.id).trim();
  }

  protected resolveColumnWidthStyles(
    column: SolarisTableViewColumn<T>,
  ): Record<string, string> | null {
    const styles: Record<string, string> = {};
    if (column.width?.trim()) {
      styles['width'] = column.width.trim();
    }
    if (column.minWidth?.trim()) {
      styles['min-width'] = column.minWidth.trim();
    }
    if (column.maxWidth?.trim()) {
      styles['max-width'] = column.maxWidth.trim();
    }
    return Object.keys(styles).length > 0 ? styles : null;
  }

  protected isColumnSortable(column: SolarisTableViewColumn<T>): boolean {
    return column.sortable === true && column.type !== 'checkbox';
  }

  protected getAriaSort(column: SolarisTableViewColumn<T>): string | null {
    if (!this.isColumnSortable(column)) {
      return null;
    }
    const direction = this.currentSortDirection(column.id);
    if (direction === 'asc') {
      return 'ascending';
    }
    if (direction === 'desc') {
      return 'descending';
    }
    return 'none';
  }

  protected currentSortDirection(
    columnId: string,
  ): SolarisTableSort['direction'] | null {
    const sort = normalizeTableSort(this.sort());
    if (sort?.columnId !== columnId) {
      return null;
    }
    return sort.direction;
  }

  protected sortButtonLabel(column: SolarisTableViewColumn<T>): string {
    const columnLabel = this.resolveColumnHeader(column);
    const direction = this.currentSortDirection(column.id);
    if (direction === 'asc') {
      return interpolateTableText(
        this.resolveText(
          null,
          TABLE_SORT_DESC_LABEL_KEY,
          TABLE_SORT_DESC_LABEL,
        ),
        { column: columnLabel },
      );
    }
    if (direction === 'desc') {
      return interpolateTableText(
        this.resolveText(
          null,
          TABLE_SORT_CLEAR_LABEL_KEY,
          TABLE_SORT_CLEAR_LABEL,
        ),
        { column: columnLabel },
      );
    }
    return interpolateTableText(
      this.resolveText(null, TABLE_SORT_ASC_LABEL_KEY, TABLE_SORT_ASC_LABEL),
      { column: columnLabel },
    );
  }

  protected toggleSort(column: SolarisTableViewColumn<T>): void {
    if (!this.isColumnSortable(column)) {
      return;
    }
    const direction = this.currentSortDirection(column.id);
    let nextSort: SolarisTableSort | null;
    if (direction === null) {
      nextSort = { columnId: column.id, direction: 'asc' };
    } else if (direction === 'asc') {
      nextSort = { columnId: column.id, direction: 'desc' };
    } else {
      nextSort = null;
    }
    this.sort.set(nextSort);
    this.announceSort(column, nextSort);
  }

  private announceSort(
    column: SolarisTableViewColumn<T>,
    nextSort: SolarisTableSort | null,
  ): void {
    if (!nextSort) {
      this.sortAnnouncement.set(TABLE_SORTED_CLEARED_ANNOUNCE);
      return;
    }
    const columnLabel = this.resolveColumnHeader(column);
    this.sortAnnouncement.set(
      interpolateTableText(
        this.resolveText(
          null,
          TABLE_SORTED_ANNOUNCE_KEY,
          TABLE_SORTED_ANNOUNCE,
        ),
        { column: columnLabel, direction: nextSort.direction },
      ),
    );
  }

  protected toggleSelectAllVisibleRows(): void {
    if (this.normalizedSelectionMode() !== 'multiple') {
      return;
    }
    const currentIds = new Set(this.selectedRowIds());
    const shouldSelectAll = !this.allVisibleRowsSelected();
    for (const row of this.visibleRows()) {
      if (shouldSelectAll) {
        currentIds.add(row.rowId);
      } else {
        currentIds.delete(row.rowId);
      }
    }
    this.commitSelection(Array.from(currentIds));
  }

  protected toggleRowSelection(row: SolarisTableViewRow<T>): void {
    const currentIds = new Set(this.selectedRowIds());
    if (this.normalizedSelectionMode() === 'single') {
      currentIds.clear();
      if (!row.selected) {
        currentIds.add(row.rowId);
      }
    } else if (this.normalizedSelectionMode() === 'multiple') {
      if (currentIds.has(row.rowId)) {
        currentIds.delete(row.rowId);
      } else {
        currentIds.add(row.rowId);
      }
    } else {
      return;
    }
    this.commitSelection(Array.from(currentIds), row.row, row.rowId);
  }

  private commitSelection(
    nextSelectedIds: readonly string[],
    changedRow?: T,
    changedRowId?: string,
  ): void {
    this.selectedRowIds.set(nextSelectedIds);
    this.selectionChange.emit({
      selectedRowIds: nextSelectedIds,
      selectedRows: nextSelectedIds
        .map((rowId) => this.selectedRowCache().get(rowId))
        .filter((row): row is T => row !== undefined),
      changedRow,
      changedRowId,
    });
  }

  protected handleRowClick(row: SolarisTableViewRow<T>, event: Event): void {
    if (!this.rowClickable()) {
      return;
    }
    this.rowClick.emit({
      row: row.row,
      rowId: row.rowId,
      originalEvent: event,
    });
  }

  protected resolveRowSelectionLabel(row: SolarisTableViewRow<T>): string {
    return interpolateTableText(
      this.resolveText(
        null,
        TABLE_SELECT_ROW_LABEL_KEY,
        TABLE_SELECT_ROW_LABEL,
      ),
      { rowId: row.rowId },
    );
  }

  protected resolveExpandLabel(row: SolarisTableViewRow<T>): string {
    return interpolateTableText(
      this.resolveText(
        null,
        this.isRowExpanded(row)
          ? TABLE_COLLAPSE_ROW_LABEL_KEY
          : TABLE_EXPAND_ROW_LABEL_KEY,
        this.isRowExpanded(row)
          ? TABLE_COLLAPSE_ROW_LABEL
          : TABLE_EXPAND_ROW_LABEL,
      ),
      { rowId: row.rowId },
    );
  }

  protected isRowExpanded(row: SolarisTableViewRow<T>): boolean {
    return this.expandedRowIds().includes(row.rowId);
  }

  protected isDetailRowVisible(row: SolarisTableViewRow<T>): boolean {
    return (
      this.isRowExpanded(row) || this.collapsingRowIds().includes(row.rowId)
    );
  }

  protected isDetailOpen(row: SolarisTableViewRow<T>): boolean {
    return this.openedRowIds().includes(row.rowId);
  }

  protected toggleRowExpanded(row: SolarisTableViewRow<T>): void {
    if (this.isRowExpanded(row)) {
      this.cancelPendingOpen(row.rowId);
      this.expandedRowIds.set(
        this.expandedRowIds().filter((id) => id !== row.rowId),
      );
      this.openedRowIds.set(
        this.openedRowIds().filter((id) => id !== row.rowId),
      );
      this.collapsingRowIds.set([...this.collapsingRowIds(), row.rowId]);
      const pending = this.collapseTimers.get(row.rowId);
      if (pending !== undefined) {
        clearTimeout(pending);
      }
      const timer = setTimeout(
        () => {
          this.collapseTimers.delete(row.rowId);
          this.collapsingRowIds.set(
            this.collapsingRowIds().filter((id) => id !== row.rowId),
          );
        },
        this.prefersReducedMotion() ? 0 : DETAIL_COLLAPSE_DURATION_MS,
      );
      this.collapseTimers.set(row.rowId, timer);
      return;
    }
    const pending = this.collapseTimers.get(row.rowId);
    if (pending !== undefined) {
      clearTimeout(pending);
      this.collapseTimers.delete(row.rowId);
      this.collapsingRowIds.set(
        this.collapsingRowIds().filter((id) => id !== row.rowId),
      );
    }
    this.expandedRowIds.set([...this.expandedRowIds(), row.rowId]);
    if (!isPlatformBrowser(this.platformId)) {
      this.openedRowIds.set([...this.openedRowIds(), row.rowId]);
      return;
    }
    const first = requestAnimationFrame(() => {
      const second = requestAnimationFrame(() => {
        this.openFrames.delete(row.rowId);
        if (this.isRowExpanded(row)) {
          this.openedRowIds.set([...this.openedRowIds(), row.rowId]);
        }
      });
      this.openFrames.set(row.rowId, second);
    });
    this.openFrames.set(row.rowId, first);
  }

  private cancelPendingOpen(rowId: string): void {
    const frame = this.openFrames.get(rowId);
    if (frame !== undefined) {
      cancelAnimationFrame(frame);
      this.openFrames.delete(rowId);
    }
  }

  private prefersReducedMotion(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }
    return (
      typeof window.matchMedia !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  protected detailRowId(index: number): string {
    return `${this.hostId}-detail-${index}`;
  }

  protected resolveCellText(
    row: SolarisTableViewRow<T>,
    column: SolarisTableViewColumn<T>,
  ): string {
    const custom = column.displayValueOf?.(row.row);
    if (custom !== undefined && custom !== null && custom.trim() !== '') {
      return custom;
    }
    const value = resolveCellValue(row.row, column);
    if (value === null || value === undefined || value === '') {
      return '—';
    }
    switch (column.type) {
      case 'number':
        return this.formatNumberValue(value, column);
      case 'date':
        return this.formatDateValue(value, column);
      default:
        return String(value);
    }
  }

  protected resolveCellTitle(
    row: SolarisTableViewRow<T>,
    column: SolarisTableViewColumn<T>,
  ): string | null {
    if (column.type === 'checkbox') {
      return null;
    }
    const text = this.resolveCellText(row, column);
    return text === '—' ? null : text;
  }

  protected resolveCellTemplate(
    column: SolarisTableViewColumn<T>,
  ): SolarisTableCellDirective | null {
    if (!column.cellTemplateId) {
      return null;
    }
    return (
      this.cellTemplates().find(
        (template) => template.templateId() === column.cellTemplateId,
      ) ?? null
    );
  }

  protected resolveHeaderTemplate(
    column: SolarisTableViewColumn<T>,
  ): SolarisTableHeaderDirective | null {
    if (!column.headerTemplateId) {
      return null;
    }
    return (
      this.headerTemplates().find(
        (template) => template.templateId() === column.headerTemplateId,
      ) ?? null
    );
  }

  protected resolveDetailTemplate(
    column: SolarisTableViewColumn<T>,
  ): SolarisTableDetailDirective | null {
    if (!column.detailTemplateId) {
      return null;
    }
    return (
      this.detailTemplates().find(
        (template) => template.templateId() === column.detailTemplateId,
      ) ?? null
    );
  }

  protected customCellContext(
    row: SolarisTableViewRow<T>,
    column: SolarisTableViewColumn<T>,
  ): SolarisTableCellContext<T> {
    return {
      $implicit: row.row,
      row: row.row,
      rowId: row.rowId,
      value: resolveCellValue(row.row, column),
      column,
      index: row.index,
    };
  }

  protected resolveText(
    directText?: string | null,
    translationKey?: string | null,
    fallbackText = '',
    params?: Record<string, string | number>,
  ): string {
    const direct = normalizeOptionalString(directText);
    if (direct) {
      return interpolateTableText(direct, params ?? {});
    }
    const key = normalizeOptionalString(translationKey);
    if (key && this.translateService) {
      const translated = this.translateService.translate(key, params);
      if (translated !== key) {
        return translated;
      }
    }
    return interpolateTableText(fallbackText, params ?? {});
  }

  private formatNumberValue(
    value: unknown,
    column: SolarisTableViewColumn<T>,
  ): string {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
      return String(value);
    }
    try {
      return new Intl.NumberFormat(
        column.locale ?? this.locale(),
        column.numberFormat,
      ).format(numericValue);
    } catch {
      return String(value);
    }
  }

  private formatDateValue(
    value: unknown,
    column: SolarisTableViewColumn<T>,
  ): string {
    try {
      return formatDate(
        value as string | number | Date,
        column.dateFormat ?? 'mediumDate',
        column.locale ?? this.locale(),
      );
    } catch {
      return String(value);
    }
  }

  private locale(): string {
    return this.translateService?.locale ?? 'en-US';
  }
}
