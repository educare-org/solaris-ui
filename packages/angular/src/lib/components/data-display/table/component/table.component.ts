import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  DOCUMENT,
  PLATFORM_ID,
  booleanAttribute,
  computed,
  contentChild,
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
  TABLE_ADD_ROW_LABEL,
  TABLE_ADD_ROW_LABEL_KEY,
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
  TABLE_SORTED_CLEARED_ANNOUNCE_KEY,
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
  normalizeTableIconPosition,
  normalizeTableLayout,
  normalizeTableRadius,
  normalizeTableSelectionMode,
  normalizeTableSort,
  normalizeTableStripedMode,
} from '../model/table.defaults';
import {
  isTableDataSource,
  resolveCellValue,
  resolveFooterValue,
  resolveHeaderGroupSpans,
  resolveRowId,
  resolveRows,
  sortRows,
} from '../model/table-state';
import type {
  SolarisTableAppearance,
  SolarisTableCellContext,
  SolarisTableCellEditorContext,
  SolarisTableCellEditEvent,
  SolarisTableCellPadding,
  SolarisTableColumn,
  SolarisTableDataSource,
  SolarisTableDensity,
  SolarisTableExpandMode,
  SolarisTableFooterCellContext,
  SolarisTableHeaderGroup,
  SolarisTableHeaderGroupSpan,
  SolarisTableLayout,
  SolarisTableRadius,
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
  SolarisTableCellEditorDirective,
  SolarisTableDetailDirective,
  SolarisTableEmptyDirective,
  SolarisTableErrorDirective,
  SolarisTableFooterCellDirective,
  SolarisTableFooterDirective,
  SolarisTableHeaderDirective,
  SolarisTableLoadingDirective,
  SolarisTableToolbarDirective,
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
    '[attr.data-radius]': 'normalizedRadius()',
    '[attr.data-striped]': 'striped() || undefined',
    '[attr.data-striped-mode]': 'normalizedStripedMode()',
    '[attr.data-hover]': 'hover() || undefined',
    '[attr.data-sticky-header]': 'stickyHeader() || undefined',
    '[attr.data-sticky-first-column]': 'stickyFirstColumn() || undefined',
    '[attr.data-sticky-last-column]': 'stickyLastColumn() || undefined',
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
  readonly footerCellTemplates = contentChildren(
    SolarisTableFooterCellDirective,
  );
  readonly editorTemplates = contentChildren(SolarisTableCellEditorDirective);
  readonly emptyTemplate = contentChildren(SolarisTableEmptyDirective);
  readonly errorTemplate = contentChildren(SolarisTableErrorDirective);
  readonly loadingTemplate = contentChildren(SolarisTableLoadingDirective);
  readonly footerTemplate = contentChild(SolarisTableFooterDirective);
  readonly toolbarTemplate = contentChild(SolarisTableToolbarDirective);

  readonly data = input<SolarisTableDataSource<T> | readonly T[]>([]);
  readonly columns = input<readonly SolarisTableColumn<T>[]>([]);
  readonly headerGroups = input<readonly SolarisTableHeaderGroup[]>([]);
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
  readonly stickyFirstColumn = input(false, { transform: booleanAttribute });
  readonly stickyLastColumn = input(false, { transform: booleanAttribute });
  readonly hover = input(true, { transform: booleanAttribute });
  readonly rowClickable = input(false, { transform: booleanAttribute });
  readonly expandable = input(false, { transform: booleanAttribute });
  readonly expandMode = input<SolarisTableExpandMode>('row');
  readonly appearance = input<SolarisTableAppearance>('outline');
  readonly radius = input<SolarisTableRadius>('md');
  readonly showAddRow = input(false, { transform: booleanAttribute });
  readonly addRowLabel = input<string | null>(null);
  readonly addRowLabelKey = input<string | null>(null);
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
  readonly addRowRequest = output<void>();
  readonly editStart = output<SolarisTableCellEditEvent<T>>();
  readonly editEnd = output<SolarisTableCellEditEvent<T>>();

  protected readonly effectiveDensity = computed(
    () => this.density() ?? this.themeService.density,
  );

  protected readonly normalizedSelectionMode = computed(() =>
    normalizeTableSelectionMode(this.selectionMode()),
  );

  protected readonly normalizedAppearance = computed(() =>
    normalizeTableAppearance(this.appearance()),
  );

  protected readonly normalizedRadius = computed(() =>
    normalizeTableRadius(this.radius()),
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

  private readonly narrowViewport = signal(false);
  private readonly expandedRowIds = signal<readonly string[]>([]);
  private readonly expandedCells = signal<readonly string[]>([]);
  private readonly openedCells = signal<readonly string[]>([]);
  private readonly collapsingCells = signal<readonly string[]>([]);
  private readonly collapsingRowIds = signal<readonly string[]>([]);
  private readonly openedRowIds = signal<readonly string[]>([]);
  private readonly collapseTimers = new Map<
    string,
    ReturnType<typeof setTimeout>
  >();
  private readonly openFrames = new Map<string, number>();
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);

  constructor() {
    // SECURITY_EXCEPTION: narrow-viewport tracking uses matchMedia via the Angular DOCUMENT token (defaultView) instead of the global window; SSR-safe via isPlatformBrowser guard; matchMedia has no Renderer2 alternative; read-only query with the change listener removed on destroy; covered by narrow-viewport tests.
    const view = isPlatformBrowser(this.platformId)
      ? this.document.defaultView
      : null;
    if (view?.matchMedia !== undefined) {
      const query = view.matchMedia('(max-width: 720px)');
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
        width: 'var(--solaris-table-selection-col-width)',
        minWidth: 'var(--solaris-table-selection-col-width)',
        maxWidth: 'var(--solaris-table-selection-col-width)',
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

  protected readonly resolvedAddRowLabel = computed(() =>
    this.resolveText(
      this.addRowLabel(),
      this.addRowLabelKey() ?? TABLE_ADD_ROW_LABEL_KEY,
      TABLE_ADD_ROW_LABEL,
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

  protected readonly footerRows = computed((): readonly T[] =>
    this.visibleRows().map((row) => row.row),
  );

  protected readonly hasFooterDefinition = computed(() =>
    this.userColumns().some(
      (column) =>
        normalizeOptionalString(column.footer) !== null ||
        normalizeOptionalString(column.footerKey) !== null ||
        column.footerValueOf !== undefined ||
        normalizeOptionalString(column.footerTemplateId) !== null,
    ),
  );

  protected readonly showFooter = computed(
    () =>
      this.hasFooterDefinition() &&
      !this.effectiveLoading() &&
      !this.hasError() &&
      this.visibleRows().length > 0,
  );

  protected readonly headerSpans = computed(
    (): readonly (SolarisTableHeaderGroupSpan<T, SolarisTableViewColumn<T>> & {
      readonly startIndex: number;
    })[] => {
      const spans = resolveHeaderGroupSpans<T, SolarisTableViewColumn<T>>(
        this.renderedColumns(),
        this.headerGroups(),
      );
      let startIndex = 0;
      return spans.map((span) => {
        const view = { ...span, startIndex };
        startIndex += span.columns.length;
        return view;
      });
    },
  );

  protected readonly hasHeaderGroups = computed(() =>
    this.headerSpans().some((span) => span.group !== null),
  );

  protected readonly headerRowCount = computed(() =>
    this.hasHeaderGroups() ? 2 : 1,
  );

  protected readonly groupedColumnIds = computed(
    (): ReadonlySet<string> =>
      new Set(
        this.headerSpans()
          .filter((span) => span.group !== null)
          .flatMap((span) => span.columns.map((column) => column.id)),
      ),
  );

  private readonly editingCell = signal<{
    rowId: string;
    columnId: string;
  } | null>(null);

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

  protected visibleCellColumns(
    row: SolarisTableViewRow<T>,
  ): readonly SolarisTableViewColumn<T>[] {
    if (!this.isCellExpandable()) {
      return [];
    }
    const visible = new Set([
      ...this.expandedCells(),
      ...this.collapsingCells(),
    ]);
    return this.userColumns().filter(
      (column) =>
        column.type !== 'checkbox' &&
        visible.has(cellExpansionKey(row.rowId, column.id)),
    );
  }

  protected isCellDetailRowVisible(row: SolarisTableViewRow<T>): boolean {
    return this.visibleCellColumns(row).length > 0;
  }

  protected isCellDetailRowOpen(row: SolarisTableViewRow<T>): boolean {
    const expanded = this.expandedCellColumns(row);
    if (expanded.length === 0) {
      return false;
    }
    const opened = new Set(this.openedCells());
    return expanded.some((column) =>
      opened.has(cellExpansionKey(row.rowId, column.id)),
    );
  }

  protected toggleCellExpanded(
    row: SolarisTableViewRow<T>,
    column: SolarisTableViewColumn<T>,
  ): void {
    if (!this.isCellExpandableColumn(column)) {
      return;
    }
    const key = cellExpansionKey(row.rowId, column.id);
    if (this.expandedCells().includes(key)) {
      this.cancelPendingCellOpen(key);
      this.expandedCells.set(
        this.expandedCells().filter((entry) => entry !== key),
      );
      this.openedCells.set(this.openedCells().filter((entry) => entry !== key));
      if (this.expandedCellColumns(row).length > 0) {
        const pending = this.collapseTimers.get(key);
        if (pending !== undefined) {
          clearTimeout(pending);
          this.collapseTimers.delete(key);
        }
        this.collapsingCells.set(
          this.collapsingCells().filter((entry) => entry !== key),
        );
        return;
      }
      this.collapsingCells.set([...this.collapsingCells(), key]);
      const pending = this.collapseTimers.get(key);
      if (pending !== undefined) {
        clearTimeout(pending);
      }
      const timer = setTimeout(
        () => {
          this.collapseTimers.delete(key);
          this.collapsingCells.set(
            this.collapsingCells().filter((entry) => entry !== key),
          );
        },
        this.prefersReducedMotion() ? 0 : DETAIL_COLLAPSE_DURATION_MS,
      );
      this.collapseTimers.set(key, timer);
      return;
    }
    const pending = this.collapseTimers.get(key);
    if (pending !== undefined) {
      clearTimeout(pending);
      this.collapseTimers.delete(key);
      this.collapsingCells.set(
        this.collapsingCells().filter((entry) => entry !== key),
      );
    }
    this.expandedCells.set([...this.expandedCells(), key]);
    if (!isPlatformBrowser(this.platformId)) {
      this.openedCells.set([...this.openedCells(), key]);
      return;
    }
    const first = requestAnimationFrame(() => {
      const second = requestAnimationFrame(() => {
        this.openFrames.delete(key);
        if (this.expandedCells().includes(key)) {
          this.openedCells.set([...this.openedCells(), key]);
        }
      });
      this.openFrames.set(key, second);
    });
    this.openFrames.set(key, first);
  }

  private cancelPendingCellOpen(key: string): void {
    const frame = this.openFrames.get(key);
    if (frame !== undefined) {
      cancelAnimationFrame(frame);
      this.openFrames.delete(key);
    }
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

  protected isStickyStartColumn(columnIndex: number): boolean {
    if (!this.stickyFirstColumn()) {
      return false;
    }
    if (!this.isSelectable()) {
      return columnIndex === 0;
    }
    return columnIndex <= 1;
  }

  protected isStickyEndColumn(columnIndex: number): boolean {
    if (!this.stickyLastColumn()) {
      return false;
    }
    const total = this.renderedColumns().length;
    const endCount = this.isRowExpandable() ? 2 : 1;
    return columnIndex >= total - endCount;
  }

  protected stickyOf(columnIndex: number): string | null {
    if (this.isStickyStartColumn(columnIndex)) {
      return 'start';
    }
    if (this.isStickyEndColumn(columnIndex)) {
      return 'end';
    }
    return null;
  }

  protected isGroupedColumn(column: SolarisTableViewColumn<T>): boolean {
    return this.groupedColumnIds().has(column.id);
  }

  protected isSpanSticky(startIndex: number, span: number): boolean {
    if (!this.stickyFirstColumn()) {
      return false;
    }
    const stickyCount = this.isSelectable() ? 2 : 1;
    return startIndex < stickyCount && startIndex + span <= stickyCount;
  }

  protected isSpanStickyEnd(startIndex: number, span: number): boolean {
    if (!this.stickyLastColumn()) {
      return false;
    }
    const total = this.renderedColumns().length;
    const endCount = this.isRowExpandable() ? 2 : 1;
    return startIndex >= total - endCount && startIndex + span <= total;
  }

  protected spanStickyOf(startIndex: number, span: number): string | null {
    if (this.isSpanSticky(startIndex, span)) {
      return 'start';
    }
    if (this.isSpanStickyEnd(startIndex, span)) {
      return 'end';
    }
    return null;
  }

  protected isGroupStart(columnIndex: number): boolean {
    if (!this.hasHeaderGroups()) {
      return false;
    }
    return this.headerSpans().some(
      (span) => span.group !== null && span.startIndex === columnIndex,
    );
  }

  protected resolveHeaderGroupText(group: SolarisTableHeaderGroup): string {
    return this.resolveText(group.header, group.headerKey, group.id).trim();
  }

  protected isEditableColumn(column: SolarisTableViewColumn<T>): boolean {
    return (
      normalizeOptionalString(column.editorTemplateId) !== null &&
      column.type !== 'checkbox'
    );
  }

  protected isEditingCell(
    row: SolarisTableViewRow<T>,
    column: SolarisTableViewColumn<T>,
  ): boolean {
    const editing = this.editingCell();
    return (
      editing !== null &&
      editing.rowId === row.rowId &&
      editing.columnId === column.id
    );
  }

  protected startEditing(
    row: SolarisTableViewRow<T>,
    column: SolarisTableViewColumn<T>,
    event?: Event,
  ): void {
    if (!this.isEditableColumn(column) || this.isEditingCell(row, column)) {
      return;
    }
    const target = event?.target as HTMLElement | null;
    if (
      target?.closest?.('button, input, select, textarea, a, [contenteditable]')
    ) {
      return;
    }
    this.editingCell.set({ rowId: row.rowId, columnId: column.id });
    this.editStart.emit({ row: row.row, rowId: row.rowId, column });
  }

  protected stopEditing(
    row: SolarisTableViewRow<T>,
    column: SolarisTableViewColumn<T>,
  ): void {
    if (!this.isEditingCell(row, column)) {
      return;
    }
    this.editingCell.set(null);
    this.editEnd.emit({ row: row.row, rowId: row.rowId, column });
  }

  protected resolveEditorTemplate(
    column: SolarisTableViewColumn<T>,
  ): SolarisTableCellEditorDirective | null {
    if (!column.editorTemplateId) {
      return null;
    }
    return (
      this.editorTemplates().find(
        (template) => template.templateId() === column.editorTemplateId,
      ) ?? null
    );
  }

  protected cellEditorContext(
    row: SolarisTableViewRow<T>,
    column: SolarisTableViewColumn<T>,
  ): SolarisTableCellEditorContext<T> {
    return {
      $implicit: row.row,
      row: row.row,
      rowId: row.rowId,
      value: resolveCellValue(row.row, column),
      column,
      index: row.index,
      close: () => this.stopEditing(row, column),
    };
  }

  protected resolveColumnHeader(column: SolarisTableViewColumn<T>): string {
    return this.resolveText(column.header, column.headerKey, column.id).trim();
  }

  protected resolveColumnIcon(
    column: SolarisTableViewColumn<T>,
  ): string | null {
    const icon = column.icon?.trim();
    return icon && icon.length > 0 ? icon : null;
  }

  protected resolveColumnIconPosition(
    column: SolarisTableViewColumn<T>,
  ): 'start' | 'end' {
    return normalizeTableIconPosition(column.iconPosition);
  }

  protected handleAddRow(): void {
    if (!this.showAddRow() || this.effectiveLoading()) {
      return;
    }
    this.addRowRequest.emit();
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
      this.sortAnnouncement.set(
        this.resolveText(
          null,
          TABLE_SORTED_CLEARED_ANNOUNCE_KEY,
          TABLE_SORTED_CLEARED_ANNOUNCE,
        ),
      );
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
    // SECURITY_EXCEPTION: reads the OS reduced-motion preference via the Angular DOCUMENT token (defaultView.matchMedia); SSR-safe via the isPlatformBrowser guard above; matchMedia has no Renderer2 alternative; read-only query, covered by reduced-motion tests.
    const view = this.document.defaultView;
    if (!view || typeof view.matchMedia !== 'function') {
      return false;
    }
    return view.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

  protected resolveFooterCellTemplate(
    column: SolarisTableViewColumn<T>,
  ): SolarisTableFooterCellDirective | null {
    if (!column.footerTemplateId) {
      return null;
    }
    return (
      this.footerCellTemplates().find(
        (template) => template.templateId() === column.footerTemplateId,
      ) ?? null
    );
  }

  protected resolveFooterText(column: SolarisTableViewColumn<T>): string {
    const aggregated = resolveFooterValue(this.footerRows(), column);
    if (aggregated !== null) {
      return aggregated;
    }
    const staticText = this.resolveText(
      column.footer,
      column.footerKey,
      '',
    ).trim();
    return staticText === '' ? '—' : staticText;
  }

  protected resolveFooterAlign(
    column: SolarisTableViewColumn<T>,
  ): 'start' | 'center' | 'end' {
    return column.footerAlign ?? column.align ?? 'start';
  }

  protected resolveFooterTitle(
    column: SolarisTableViewColumn<T>,
  ): string | null {
    if (column.type === 'checkbox' && this.isSelectable()) {
      return null;
    }
    if (this.resolveFooterCellTemplate(column)) {
      return null;
    }
    const text = this.resolveFooterText(column);
    return text === '—' ? null : text;
  }

  protected footerCellContext(
    column: SolarisTableViewColumn<T>,
  ): SolarisTableFooterCellContext<T> {
    const rows = this.footerRows();
    return { $implicit: rows, rows, column };
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
    return this.translateService?.locale() ?? 'en-US';
  }
}
