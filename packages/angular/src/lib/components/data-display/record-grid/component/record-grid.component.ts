import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  inject,
  input,
  linkedSignal,
  model,
  output,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisThemeService } from '../../../../services/theme';
import { SolarisButtonDirective } from '../../../actions/button';
import { SolarisCheckboxComponent } from '../../../forms/checkbox';
import { SolarisIconComponent } from '../../../icon';
import { SolarisSkeletonComponent } from '../../../feedback/skeleton';
import { GradebookAutofocusDirective } from '../../gradebook';
import {
  SolarisTableCellDirective,
  SolarisTableEmptyDirective,
  SolarisTableErrorDirective,
  SolarisTableFooterCellDirective,
  SolarisTableFooterDirective,
  SolarisTableHeaderDirective,
  SolarisTableLoadingDirective,
  SolarisTableToolbarDirective,
  resolveCellValue,
  resolveFooterValue,
  resolveHeaderGroupSpans,
  resolveRows,
} from '../../table';
import {
  interpolateTableText,
  normalizeOptionalString,
  normalizeTableSelectionMode,
} from '../../table/model/table.defaults';
import type {
  SolarisTableAppearance,
  SolarisTableCellPadding,
  SolarisTableColumn,
  SolarisTableDensity,
  SolarisTableHeaderGroup,
  SolarisTableHeaderGroupSpan,
  SolarisTableLayout,
  SolarisTableRadius,
  SolarisTableRowClickEvent,
  SolarisTableSelectionChange,
  SolarisTableSelectionMode,
  SolarisTableSort,
  SolarisTableStripedMode,
} from '../../table';
import {
  compareRecordSortable,
  defaultWriteRecordValue,
  resolveBodySpans,
  resolveRecordValues,
  toRecordSortable,
} from '../model/record-grid.types';
import type {
  SolarisRecordGridColumn,
  SolarisRecordGridCommit,
  SolarisRecordGridEntry,
  SolarisRecordGridSection,
  SolarisRecordGridSpanCell,
} from '../model/record-grid.types';

import {
  RECORD_GRID_ARIA_LABEL_FALLBACK,
  RECORD_GRID_ARIA_LABEL_FALLBACK_KEY,
  RECORD_GRID_COMMIT_ALL_LABEL,
  RECORD_GRID_COMMIT_ALL_LABEL_KEY,
  RECORD_GRID_DISCARD_ALL_LABEL,
  RECORD_GRID_DISCARD_ALL_LABEL_KEY,
  RECORD_GRID_EMPTY_TEXT,
  RECORD_GRID_EMPTY_TEXT_KEY,
  RECORD_GRID_ERROR_TEXT,
  RECORD_GRID_ERROR_TEXT_KEY,
  RECORD_GRID_LOADING_TEXT,
  RECORD_GRID_LOADING_TEXT_KEY,
  RECORD_GRID_SELECT_ALL_LABEL,
  RECORD_GRID_SELECT_ALL_LABEL_KEY,
  RECORD_GRID_SELECT_ROW_LABEL,
  RECORD_GRID_SELECT_ROW_LABEL_KEY,
  RECORD_GRID_SORTED_ANNOUNCE,
  RECORD_GRID_SORTED_ANNOUNCE_KEY,
  RECORD_GRID_SORTED_CLEARED_ANNOUNCE,
  RECORD_GRID_SORTED_CLEARED_ANNOUNCE_KEY,
  RECORD_GRID_SORT_ASC_LABEL,
  RECORD_GRID_SORT_ASC_LABEL_KEY,
  RECORD_GRID_SORT_CLEAR_LABEL,
  RECORD_GRID_SORT_CLEAR_LABEL_KEY,
  RECORD_GRID_SORT_DESC_LABEL,
  RECORD_GRID_SORT_DESC_LABEL_KEY,
} from '../model/record-grid.defaults';

@Component({
  selector: 'solaris-record-grid',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    GradebookAutofocusDirective,
    SolarisButtonDirective,
    SolarisCheckboxComponent,
    SolarisIconComponent,
    SolarisSkeletonComponent,
  ],
  templateUrl: './record-grid.component.html',
  styleUrls: ['./record-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-record-grid',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-radius]': 'radius()',
    '[attr.data-striped]': 'striped() || undefined',
    '[attr.data-striped-mode]': 'stripedMode()',
    '[attr.data-cell-padding]': 'cellPadding()',
    '[attr.data-hover]': 'hover() || undefined',
    '[attr.data-sticky-first-column]': 'stickyFirstColumn() || undefined',
    '[attr.data-fullwidth]': 'fullWidth() || undefined',
  },
})
export class SolarisRecordGridComponent<T = unknown> {
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });
  private readonly themeService = inject(SolarisThemeService);

  readonly cellTemplates = contentChildren(SolarisTableCellDirective);
  readonly headerTemplates = contentChildren(SolarisTableHeaderDirective);
  readonly footerCellTemplates = contentChildren(
    SolarisTableFooterCellDirective,
  );
  readonly emptyTemplate = contentChild(SolarisTableEmptyDirective);
  readonly errorTemplate = contentChild(SolarisTableErrorDirective);
  readonly loadingTemplate = contentChild(SolarisTableLoadingDirective);
  readonly footerTemplate = contentChild(SolarisTableFooterDirective);
  readonly toolbarTemplate = contentChild(SolarisTableToolbarDirective);

  readonly data = input<readonly T[]>([]);
  readonly records = model<readonly T[] | undefined>(undefined);
  readonly columns = input<readonly SolarisRecordGridColumn<T>[]>([]);
  readonly sections = input<readonly SolarisRecordGridSection[]>([]);
  readonly sectionOf = input<(row: T, index: number) => string | null>(
    () => null,
  );
  readonly headerGroups = input<readonly SolarisTableHeaderGroup[]>([]);
  readonly rowId = input.required<
    keyof T | ((row: T, index: number) => string)
  >();
  readonly sort = model<SolarisTableSort | null>(null);
  readonly selectedRowIds = model<readonly string[]>([]);
  readonly selectionMode = input<SolarisTableSelectionMode>('none');
  readonly validateOf = input<
    ((row: T, columnId: string, value: unknown) => string | null) | undefined
  >(undefined);
  readonly loading = input(false, { transform: booleanAttribute });
  readonly error = input<string | null>(null);
  readonly errorKey = input<string | null>(null);
  readonly emptyText = input<string | null>(null);
  readonly emptyTextKey = input<string | null>(null);
  readonly loadingText = input<string | null>(null);
  readonly loadingTextKey = input<string | null>(null);
  readonly appearance = input<SolarisTableAppearance>('grid');
  readonly radius = input<SolarisTableRadius>('md');
  readonly striped = input(false, { transform: booleanAttribute });
  readonly stripedMode = input<SolarisTableStripedMode>('even');
  readonly stickyFirstColumn = input(true, { transform: booleanAttribute });
  readonly hover = input(true, { transform: booleanAttribute });
  readonly rowClickable = input(false, { transform: booleanAttribute });
  readonly layout = input<SolarisTableLayout>('auto');
  readonly fullWidth = input(false, { transform: booleanAttribute });
  readonly cellPadding = input<SolarisTableCellPadding>('none');
  readonly density = input<SolarisTableDensity | undefined>(undefined);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelKey = input<string | undefined>(undefined);
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });

  readonly selectionChange = output<SolarisTableSelectionChange<T>>();
  readonly rowClick = output<SolarisTableRowClickEvent<T>>();
  readonly recordCommit = output<SolarisRecordGridCommit<T>>();
  readonly recordsChange = output<readonly T[]>();

  protected readonly editingKey = signal<string | null>(null);
  protected readonly drafts = signal<Record<string, string>>({});
  protected readonly draftErrors = signal<Record<string, string | null>>({});
  protected readonly sortAnnouncement = signal('');

  protected readonly effectiveDensity = computed(
    () => this.density() ?? this.themeService.density,
  );

  protected readonly visibleColumns = computed(
    (): readonly SolarisRecordGridColumn<T>[] =>
      this.columns().filter((column) => column.hidden !== true),
  );

  protected readonly workingRows = linkedSignal(
    (): readonly T[] => this.records() ?? this.data(),
  );

  protected readonly resolvedEntries = computed(
    (): readonly SolarisRecordGridEntry<T>[] => {
      const columns = this.visibleColumns();
      const selected = new Set(this.selectedRowIds());
      const sectionOf = this.sectionOf();
      const resolved = resolveRows(this.workingRows(), this.rowId());
      return resolved.map((entry) => {
        const record: Record<string, unknown> = {};
        for (const column of columns) {
          record[column.id] = resolveCellValue(entry.row, column);
        }
        return {
          row: entry.row,
          rowId: entry.rowId,
          index: entry.index,
          values: resolveRecordValues(record, columns),
          sectionId: sectionOf(entry.row, entry.index),
          selected: selected.has(entry.rowId),
        };
      });
    },
  );

  protected readonly sortedEntries = computed(
    (): readonly SolarisRecordGridEntry<T>[] => {
      const sort = this.sort();
      const entries = this.resolvedEntries();
      if (sort === null) {
        return entries;
      }
      const column = this.visibleColumns().find(
        (candidate) => candidate.id === sort.columnId,
      );
      if (column?.sortable !== true) {
        return entries;
      }
      const locale = this.translateService?.locale ?? 'en-US';
      const multiplier = sort.direction === 'asc' ? 1 : -1;
      return entries
        .map((entry, stableIndex) => ({ entry, stableIndex }))
        .sort((left, right) => {
          const customLeft = column.sortValueOf?.(left.entry.row);
          const customRight = column.sortValueOf?.(right.entry.row);
          const leftValue =
            customLeft ?? toRecordSortable(left.entry.values[column.id]);
          const rightValue =
            customRight ?? toRecordSortable(right.entry.values[column.id]);
          const comparison = compareRecordSortable(
            leftValue,
            rightValue,
            locale,
          );
          if (comparison !== 0) {
            return comparison * multiplier;
          }
          return left.stableIndex - right.stableIndex;
        })
        .map((item) => item.entry);
    },
  );

  protected readonly spanGrid = computed(
    (): readonly (readonly SolarisRecordGridSpanCell<T>[])[] => {
      const entries = this.sortedEntries();
      return resolveBodySpans(
        entries.map((entry) => entry.row),
        this.visibleColumns(),
      );
    },
  );

  protected readonly groupSpans = computed(
    (): readonly SolarisTableHeaderGroupSpan<T, SolarisRecordGridColumn<T>>[] =>
      resolveHeaderGroupSpans(this.visibleColumns(), this.headerGroups()),
  );

  protected readonly hasGroups = computed(() =>
    this.groupSpans().some((span) => span.group !== null),
  );

  protected readonly normalizedSelectionMode = computed(() =>
    normalizeTableSelectionMode(this.selectionMode()),
  );

  protected readonly isSelectable = computed(
    () => this.normalizedSelectionMode() !== 'none',
  );

  protected readonly isCardLayout = computed(() => this.layout() === 'card');

  protected readonly hasError = computed(
    () => this.resolvedErrorText().length > 0 && !this.loading(),
  );
  protected readonly hasEmptyState = computed(
    () =>
      !this.loading() && !this.hasError() && this.sortedEntries().length === 0,
  );

  protected readonly allVisibleRowsSelected = computed(() => {
    const entries = this.sortedEntries();
    if (entries.length === 0 || this.normalizedSelectionMode() !== 'multiple') {
      return false;
    }
    return entries.every((entry) => entry.selected);
  });

  protected readonly someVisibleRowsSelected = computed(() => {
    if (this.normalizedSelectionMode() !== 'multiple') {
      return false;
    }
    const entries = this.sortedEntries();
    if (entries.length === 0) {
      return false;
    }
    const selectedCount = entries.filter((entry) => entry.selected).length;
    return selectedCount > 0 && selectedCount < entries.length;
  });

  protected readonly draftCount = computed(
    () => Object.keys(this.drafts()).length,
  );

  protected resolveText(
    direct: string | null | undefined,
    key: string | null | undefined,
    fallback: string,
  ): string {
    if (direct !== undefined && direct !== null) {
      return direct;
    }
    if (key && this.translateService) {
      const translated = this.translateService.translate(key);
      if (translated !== key) {
        return translated;
      }
    }
    return fallback;
  }

  protected headerLabel(column: SolarisTableColumn<T>): string {
    if (column.header !== undefined) {
      return column.header;
    }
    const key = column.headerKey;
    if (key && this.translateService) {
      const translated = this.translateService.translate(key);
      if (translated !== key) {
        return translated;
      }
    }
    return key ?? column.id;
  }

  protected groupLabel(group: SolarisTableHeaderGroup): string {
    if (group.header !== undefined) {
      return group.header;
    }
    if (group.headerKey && this.translateService) {
      const translated = this.translateService.translate(group.headerKey);
      if (translated !== group.headerKey) {
        return translated;
      }
    }
    return group.headerKey ?? group.id;
  }

  protected sectionLabel(sectionId: string): string {
    const section = this.sections().find(
      (candidate) => candidate.id === sectionId,
    );
    if (section?.header !== undefined) {
      return section.header;
    }
    const key = section?.headerKey;
    if (key && this.translateService) {
      const translated = this.translateService.translate(key);
      if (translated !== key) {
        return translated;
      }
    }
    return key ?? sectionId;
  }

  protected resolvedAriaLabel(): string {
    return this.resolveText(
      this.ariaLabel(),
      this.ariaLabelKey() ?? RECORD_GRID_ARIA_LABEL_FALLBACK_KEY,
      RECORD_GRID_ARIA_LABEL_FALLBACK,
    );
  }

  protected resolvedEmptyText(): string {
    return this.resolveText(
      this.emptyText(),
      this.emptyTextKey() ?? RECORD_GRID_EMPTY_TEXT_KEY,
      RECORD_GRID_EMPTY_TEXT,
    );
  }

  protected resolvedLoadingText(): string {
    return this.resolveText(
      this.loadingText(),
      this.loadingTextKey() ?? RECORD_GRID_LOADING_TEXT_KEY,
      RECORD_GRID_LOADING_TEXT,
    );
  }

  protected resolvedErrorText(): string {
    if (
      normalizeOptionalString(this.error()) === null &&
      normalizeOptionalString(this.errorKey()) === null
    ) {
      return '';
    }
    return this.resolveText(
      this.error(),
      this.errorKey() ?? RECORD_GRID_ERROR_TEXT_KEY,
      RECORD_GRID_ERROR_TEXT,
    ).trim();
  }

  protected resolvedSelectAllLabel(): string {
    return this.resolveText(
      null,
      RECORD_GRID_SELECT_ALL_LABEL_KEY,
      RECORD_GRID_SELECT_ALL_LABEL,
    );
  }

  protected resolveRowSelectionLabel(entry: SolarisRecordGridEntry<T>): string {
    return interpolateTableText(
      this.resolveText(
        null,
        RECORD_GRID_SELECT_ROW_LABEL_KEY,
        RECORD_GRID_SELECT_ROW_LABEL,
      ),
      { rowId: entry.rowId },
    );
  }

  protected cellText(
    entry: SolarisRecordGridEntry<T>,
    column: SolarisRecordGridColumn<T>,
  ): string {
    const custom = column.displayValueOf?.(entry.row);
    if (custom !== undefined && custom !== null) {
      const trimmed = custom.trim();
      if (trimmed.length > 0) {
        return trimmed;
      }
    }
    const value = entry.values[column.id];
    if (value === null || value === undefined) {
      return '—';
    }
    if (typeof value === 'number') {
      if (!Number.isFinite(value)) {
        return '—';
      }
      try {
        return new Intl.NumberFormat(
          this.translateService?.locale ?? 'en-US',
          column.numberFormat ?? { maximumFractionDigits: 2 },
        ).format(value);
      } catch {
        return String(value);
      }
    }
    const text = String(value).trim();
    return text.length > 0 ? text : '—';
  }

  protected footerText(
    rows: readonly T[],
    column: SolarisRecordGridColumn<T>,
  ): string | null {
    const resolved = rows.map((row) => {
      const record: Record<string, unknown> = {};
      for (const visible of this.visibleColumns()) {
        record[visible.id] = resolveCellValue(row, visible);
      }
      return resolveRecordValues(record, this.visibleColumns());
    });
    const mapped = rows.map(
      (row, index) =>
        ({
          ...row,
          ...Object.fromEntries(
            Object.entries(resolved[index] ?? {}).map(([id, value]) => [
              `__record_grid_${id}`,
              value,
            ]),
          ),
        }) as T,
    );
    const mappedColumn: SolarisTableColumn<T> = {
      ...column,
      accessor: (row) =>
        (row as Record<string, unknown>)[
          `__record_grid_${column.id}`
        ] as unknown,
    };
    return resolveFooterValue(mapped, mappedColumn);
  }

  protected isComputed(column: SolarisRecordGridColumn<T>): boolean {
    return column.computed !== undefined;
  }

  protected isColumnSortable(column: SolarisRecordGridColumn<T>): boolean {
    return column.sortable === true;
  }

  protected currentSortDirection(columnId: string): 'asc' | 'desc' | null {
    const sort = this.sort();
    if (sort?.columnId !== columnId) {
      return null;
    }
    return sort.direction;
  }

  protected getAriaSort(column: SolarisRecordGridColumn<T>): string | null {
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

  protected headerColIndex(column: SolarisRecordGridColumn<T>): number {
    const offset = this.isSelectable() ? 2 : 1;
    const position = this.visibleColumns().findIndex(
      (candidate) => candidate.id === column.id,
    );
    return (position < 0 ? 0 : position) + offset;
  }

  protected sortButtonLabel(column: SolarisRecordGridColumn<T>): string {
    const columnLabel = this.headerLabel(column);
    const direction = this.currentSortDirection(column.id);
    if (direction === 'asc') {
      return interpolateTableText(
        this.resolveText(
          null,
          RECORD_GRID_SORT_DESC_LABEL_KEY,
          RECORD_GRID_SORT_DESC_LABEL,
        ),
        { column: columnLabel },
      );
    }
    if (direction === 'desc') {
      return interpolateTableText(
        this.resolveText(
          null,
          RECORD_GRID_SORT_CLEAR_LABEL_KEY,
          RECORD_GRID_SORT_CLEAR_LABEL,
        ),
        { column: columnLabel },
      );
    }
    return interpolateTableText(
      this.resolveText(
        null,
        RECORD_GRID_SORT_ASC_LABEL_KEY,
        RECORD_GRID_SORT_ASC_LABEL,
      ),
      { column: columnLabel },
    );
  }

  protected toggleSort(column: SolarisRecordGridColumn<T>): void {
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
    if (!nextSort) {
      this.sortAnnouncement.set(
        this.resolveText(
          null,
          RECORD_GRID_SORTED_CLEARED_ANNOUNCE_KEY,
          RECORD_GRID_SORTED_CLEARED_ANNOUNCE,
        ),
      );
      return;
    }
    this.sortAnnouncement.set(
      interpolateTableText(
        this.resolveText(
          null,
          RECORD_GRID_SORTED_ANNOUNCE_KEY,
          RECORD_GRID_SORTED_ANNOUNCE,
        ),
        { column: this.headerLabel(column), direction: nextSort.direction },
      ),
    );
  }

  protected isCellEditable(
    _entry: SolarisRecordGridEntry<T>,
    column: SolarisRecordGridColumn<T>,
    cell?: SolarisRecordGridSpanCell<T>,
  ): boolean {
    if (this.readonly() || this.disabled() || this.isComputed(column)) {
      return false;
    }
    if (
      cell !== undefined &&
      (cell.covered || cell.rowSpan > 1 || cell.colSpan > 1)
    ) {
      return false;
    }
    return true;
  }

  protected draftKey(rowId: string, columnId: string): string {
    return `${rowId}::${columnId}`;
  }

  protected isEditing(rowId: string, columnId: string): boolean {
    return this.editingKey() === this.draftKey(rowId, columnId);
  }

  protected draftValue(rowId: string, columnId: string): string {
    return this.drafts()[this.draftKey(rowId, columnId)] ?? '';
  }

  protected draftError(rowId: string, columnId: string): string | null {
    return this.draftErrors()[this.draftKey(rowId, columnId)] ?? null;
  }

  protected openEditor(
    entry: SolarisRecordGridEntry<T>,
    column: SolarisRecordGridColumn<T>,
    cell?: SolarisRecordGridSpanCell<T>,
  ): void {
    if (!this.isCellEditable(entry, column, cell)) {
      return;
    }
    const key = this.draftKey(entry.rowId, column.id);
    const current = entry.values[column.id];
    this.editingKey.set(key);
    this.drafts.update((drafts) => ({
      ...drafts,
      [key]: current === null || current === undefined ? '' : String(current),
    }));
    this.draftErrors.update((errors) => ({ ...errors, [key]: null }));
  }

  protected closeEditor(): void {
    const key = this.editingKey();
    if (key === null) {
      return;
    }
    this.editingKey.set(null);
    this.drafts.update((drafts) => {
      const next = { ...drafts };
      delete next[key];
      return next;
    });
    this.draftErrors.update((errors) => {
      const next = { ...errors };
      delete next[key];
      return next;
    });
  }

  protected validateCell(
    entry: SolarisRecordGridEntry<T>,
    column: SolarisRecordGridColumn<T>,
    value: unknown,
  ): string | null {
    const columnError = column.validateOf?.(entry.row, column.id, value);
    if (columnError !== undefined && columnError !== null) {
      const trimmed = columnError.trim();
      if (trimmed.length > 0) {
        return trimmed;
      }
    }
    const globalError = this.validateOf()?.(entry.row, column.id, value);
    if (globalError !== undefined && globalError !== null) {
      const trimmed = globalError.trim();
      if (trimmed.length > 0) {
        return trimmed;
      }
    }
    return null;
  }

  protected parseDraftValue(text: string): unknown {
    const trimmed = text.trim();
    if (trimmed === '') {
      return null;
    }
    const numeric = Number(trimmed.replace(',', '.'));
    return Number.isFinite(trimmed) || trimmed === String(numeric)
      ? numeric
      : trimmed;
  }

  protected commitEditor(
    entry: SolarisRecordGridEntry<T>,
    column: SolarisRecordGridColumn<T>,
    text: string,
  ): void {
    const key = this.draftKey(entry.rowId, column.id);
    const value = this.parseDraftValue(text);
    const error = this.validateCell(entry, column, value);
    if (error !== null) {
      this.draftErrors.update((errors) => ({ ...errors, [key]: error }));
      return;
    }
    const previousValue = entry.values[column.id] ?? null;
    const nextRows = this.workingRows().map((row, index) =>
      index === entry.index ? defaultWriteRecordValue(row, column, value) : row,
    );
    this.applyWorkingRows(nextRows);
    this.closeEditor();
    this.recordCommit.emit({
      row: nextRows[entry.index] as T,
      rowId: entry.rowId,
      columnId: column.id,
      column,
      previousValue,
      value,
      at: new Date().toISOString(),
    });
  }

  protected commitAll(): void {
    const key = this.editingKey();
    if (key === null) {
      return;
    }
    const [rowId, columnId] = key.split('::');
    const entry = this.sortedEntries().find(
      (candidate) => candidate.rowId === rowId,
    );
    const column = this.visibleColumns().find(
      (candidate) => candidate.id === columnId,
    );
    if (entry === undefined || column === undefined) {
      this.closeEditor();
      return;
    }
    this.commitEditor(
      entry,
      column,
      this.draftValue(rowId as string, column.id),
    );
  }

  protected discardAll(): void {
    this.closeEditor();
  }

  private applyWorkingRows(nextRows: readonly T[]): void {
    this.workingRows.set(nextRows);
    if (this.records() !== undefined) {
      this.records.set(nextRows);
    }
    this.recordsChange.emit(nextRows);
  }

  protected toggleRowSelection(entry: SolarisRecordGridEntry<T>): void {
    const mode = this.normalizedSelectionMode();
    if (mode === 'none') {
      return;
    }
    if (mode === 'single') {
      const next = entry.selected ? [] : [entry.rowId];
      this.selectedRowIds.set(next);
      this.emitSelectionChange(next, entry);
      return;
    }
    const current = new Set(this.selectedRowIds());
    if (current.has(entry.rowId)) {
      current.delete(entry.rowId);
    } else {
      current.add(entry.rowId);
    }
    const next = [...current];
    this.selectedRowIds.set(next);
    this.emitSelectionChange(next, entry);
  }

  protected toggleSelectAllVisibleRows(): void {
    if (this.normalizedSelectionMode() !== 'multiple') {
      return;
    }
    const entries = this.sortedEntries();
    const next = this.allVisibleRowsSelected()
      ? []
      : entries.map((entry) => entry.rowId);
    this.selectedRowIds.set(next);
    this.emitSelectionChange(next);
  }

  private emitSelectionChange(
    next: readonly string[],
    changed?: SolarisRecordGridEntry<T>,
  ): void {
    const byId = new Map(
      this.sortedEntries().map((entry) => [entry.rowId, entry.row]),
    );
    this.selectionChange.emit({
      selectedRows: next
        .map((rowId) => byId.get(rowId))
        .filter((row) => row !== undefined) as readonly T[],
      selectedRowIds: next,
      changedRow: changed?.row,
      changedRowId: changed?.rowId,
    });
  }

  protected onRowClick(entry: SolarisRecordGridEntry<T>, event: Event): void {
    if (!this.rowClickable()) {
      return;
    }
    this.rowClick.emit({
      row: entry.row,
      rowId: entry.rowId,
      originalEvent: event,
    });
  }

  protected trackByRowId(
    _index: number,
    entry: SolarisRecordGridEntry<T>,
  ): string {
    return entry.rowId;
  }

  protected trackByColumnId(
    _index: number,
    column: SolarisRecordGridColumn<T>,
  ): string {
    return column.id;
  }

  protected resolveCellTemplate(
    column: SolarisRecordGridColumn<T>,
  ): SolarisTableCellDirective | undefined {
    if (column.cellTemplateId === undefined) {
      return undefined;
    }
    return this.cellTemplates().find(
      (template) => template.templateId() === column.cellTemplateId,
    );
  }

  protected resolveHeaderTemplate(
    column: SolarisRecordGridColumn<T>,
  ): SolarisTableHeaderDirective | undefined {
    if (column.headerTemplateId === undefined) {
      return undefined;
    }
    return this.headerTemplates().find(
      (template) => template.templateId() === column.headerTemplateId,
    );
  }

  protected resolveFooterCellTemplate(
    column: SolarisRecordGridColumn<T>,
  ): SolarisTableFooterCellDirective | undefined {
    if (column.footerTemplateId === undefined) {
      return undefined;
    }
    return this.footerCellTemplates().find(
      (template) => template.templateId() === column.footerTemplateId,
    );
  }

  protected readonly sectionFooterGroups = computed(
    (): readonly { sectionId: string | null; rows: readonly T[] }[] => {
      const declared = this.sections();
      const entries = this.sortedEntries();
      if (declared.length === 0 || entries.length === 0) {
        return [];
      }
      const groups: { sectionId: string | null; rows: readonly T[] }[] = [];
      for (const section of declared) {
        const rows = entries
          .filter((entry) => entry.sectionId === section.id)
          .map((entry) => entry.row);
        if (rows.length > 0 && this.hasFooterContent(rows)) {
          groups.push({ sectionId: section.id, rows });
        }
      }
      const all = entries.map((entry) => entry.row);
      if (this.hasFooterContent(all)) {
        groups.push({ sectionId: null, rows: all });
      }
      return groups;
    },
  );

  private hasFooterContent(rows: readonly T[]): boolean {
    return this.visibleColumns().some(
      (column) =>
        column.footerTemplateId !== undefined ||
        this.footerText(rows, column) !== null,
    );
  }

  protected isStickyColumn(columnId: string): boolean {
    return (
      this.stickyFirstColumn() && this.visibleColumns()[0]?.id === columnId
    );
  }

  protected showSectionDivider(entryIndex: number): boolean {
    if (this.sections().length === 0) {
      return false;
    }
    const entries = this.sortedEntries();
    const entry = entries[entryIndex];
    const previous = entries[entryIndex - 1];
    if (entry === undefined) {
      return false;
    }
    return entry.sectionId !== null && previous?.sectionId !== entry.sectionId;
  }

  protected totalColumnCount(): number {
    return this.visibleColumns().length + (this.isSelectable() ? 1 : 0);
  }

  protected headRowCount(): number {
    return this.hasGroups() ? 2 : 1;
  }

  protected ariaRowIndex(entryIndex: number): number {
    let dividers = 0;
    for (let index = 0; index <= entryIndex; index += 1) {
      if (this.showSectionDivider(index)) {
        dividers += 1;
      }
    }
    return this.headRowCount() + dividers + entryIndex + 1;
  }

  protected spanCells(
    entryIndex: number,
  ): readonly SolarisRecordGridSpanCell<T>[] {
    const row = this.spanGrid()[entryIndex] as
      | readonly SolarisRecordGridSpanCell<T>[]
      | undefined;
    return row ?? [];
  }

  protected ariaColIndex(
    cells: readonly SolarisRecordGridSpanCell<T>[],
    cellPosition: number,
  ): number {
    let index = this.isSelectable() ? 2 : 1;
    for (let position = 0; position < cellPosition; position += 1) {
      index += cells[position]?.colSpan ?? 1;
    }
    return index;
  }

  protected commitAllLabel(): string {
    return this.resolveText(
      null,
      RECORD_GRID_COMMIT_ALL_LABEL_KEY,
      RECORD_GRID_COMMIT_ALL_LABEL,
    );
  }

  protected discardAllLabel(): string {
    return this.resolveText(
      null,
      RECORD_GRID_DISCARD_ALL_LABEL_KEY,
      RECORD_GRID_DISCARD_ALL_LABEL,
    );
  }
}
