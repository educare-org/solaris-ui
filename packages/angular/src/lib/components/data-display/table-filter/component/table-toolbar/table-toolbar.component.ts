import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  DestroyRef,
  DOCUMENT,
  effect,
  inject,
  input,
  model,
  OnInit,
  output,
  PLATFORM_ID,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';

import { SolarisTranslateService } from '../../../../../services/translation';
import {
  type SolarisExporter,
  SolarisExportService,
} from '../../../../../services/export';
import { SolarisThemeService } from '../../../../../services/theme';
import { SolarisIconComponent } from '../../../../icon';
import { SolarisButtonDirective } from '../../../../actions/button';
import { SolarisIconButtonDirective } from '../../../../actions/icon-button';
import { SolarisBadgeComponent } from '../../../badge';
import { SolarisFormFieldComponent } from '../../../../forms/form-field';
import { SolarisInputDirective } from '../../../../forms/input';
import { SolarisSelectComponent } from '../../../../forms/select';
import { SolarisMultiSelectComponent } from '../../../../forms/multi-select';
import { SolarisOptionComponent } from '../../../../forms/option';
import {
  SolarisPopoverDirective,
  SolarisPopoverTriggerDirective,
} from '../../../../interaction/popover';
import {
  SolarisDropdownMenuComponent,
  SolarisDropdownMenuItemComponent,
  SolarisDropdownMenuLabelComponent,
  SolarisDropdownMenuTriggerDirective,
} from '../../../../interaction/dropdown-menu';

import {
  defaultOperatorForColumn,
  FILTER_ADD_CONDITION_LABEL,
  FILTER_ADD_CONDITION_LABEL_KEY,
  FILTER_ARIA_LABEL_FALLBACK_KEY,
  FILTER_ARIA_LABEL_FALLBACK_TEXT,
  FILTER_BUTTON_LABEL,
  FILTER_BUTTON_LABEL_KEY,
  FILTER_CHIPS_COLLAPSE_DURATION_MS,
  FILTER_CLEAR_ALL_LABEL,
  FILTER_CLEAR_ALL_LABEL_KEY,
  FILTER_COLUMN_LABEL,
  FILTER_COLUMN_LABEL_KEY,
  FILTER_COLUMNS_BUTTON,
  FILTER_COLUMNS_BUTTON_LABEL_KEY,
  FILTER_CREATE_VIEW_LABEL,
  FILTER_CREATE_VIEW_LABEL_KEY,
  FILTER_CREATE_VIEW_NAME_LABEL,
  FILTER_CREATE_VIEW_NAME_LABEL_KEY,
  FILTER_CREATE_VIEW_NAME_PLACEHOLDER,
  FILTER_CREATE_VIEW_NAME_PLACEHOLDER_KEY,
  FILTER_EXPORT_FORMAT_LABEL,
  FILTER_EXPORT_FORMAT_LABEL_KEY,
  FILTER_EXPORT_LABEL,
  FILTER_EXPORT_LABEL_KEY,
  FILTER_NO_CONDITIONS_LABEL,
  FILTER_NO_CONDITIONS_LABEL_KEY,
  FILTER_OPERATOR_LABEL,
  FILTER_OPERATOR_LABEL_KEY,
  FILTER_OPERATOR_LABEL_KEYS,
  FILTER_OPERATOR_LABELS,
  FILTER_REMOVE_CONDITION_LABEL,
  FILTER_REMOVE_CONDITION_LABEL_KEY,
  FILTER_REMOVE_SEARCH_LABEL,
  FILTER_REMOVE_SEARCH_LABEL_KEY,
  FILTER_SAVE_LABEL,
  FILTER_SAVE_LABEL_KEY,
  FILTER_SEARCH_DEBOUNCE_MS,
  FILTER_SEARCH_LABEL,
  FILTER_SEARCH_LABEL_KEY,
  FILTER_SEARCH_PLACEHOLDER,
  FILTER_SEARCH_PLACEHOLDER_KEY,
  FILTER_VALUE_LABEL,
  FILTER_VALUE_LABEL_KEY,
  FILTER_VIEWS_LABEL,
  FILTER_VIEWS_LABEL_KEY,
  interpolateFilterText,
  isListOperator,
  isRangeOperator,
  isValuelessOperator,
  normalizeExportDisplay,
  normalizeOptionalString,
  operatorsForColumnType,
} from '../../model/filter.defaults';
import type {
  SolarisTableExportEvent,
  SolarisTableFilterableColumn,
  SolarisTableFilterCondition,
  SolarisTableFilterOperator,
  SolarisTableFilterRangeValue,
  SolarisTableFilterState,
  SolarisTableToolbarExportDisplay,
  SolarisTableView,
} from '../../model/filter.types';
import {
  activeTableFilterCount,
  applyOrderedVisibleColumns,
  createEmptyTableFilterState,
  isTableFilterActive,
  normalizeTableFilterState,
  parseTableFilterState,
  readPersistedTableFilterState,
  writePersistedTableFilterState,
} from '../../model/filter-state';
import type { SolarisTableDensity } from '../../../table';
import {
  SolarisColumnManagerComponent,
  type SolarisColumnManagerSave,
} from '../column-manager/column-manager.component';
import {
  SolarisTableToolbarLeadingDirective,
  SolarisTableToolbarTrailingDirective,
} from './table-toolbar-slots.directive';

interface PersistedToolbarState {
  readonly filter?: Partial<SolarisTableFilterState>;
  readonly selectedViewId?: string | null;
}

@Component({
  selector: 'solaris-table-toolbar',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    SolarisIconComponent,
    SolarisButtonDirective,
    SolarisIconButtonDirective,
    SolarisBadgeComponent,
    SolarisFormFieldComponent,
    SolarisInputDirective,
    SolarisSelectComponent,
    SolarisMultiSelectComponent,
    SolarisOptionComponent,
    SolarisPopoverDirective,
    SolarisPopoverTriggerDirective,
    SolarisDropdownMenuComponent,
    SolarisDropdownMenuTriggerDirective,
    SolarisDropdownMenuItemComponent,
    SolarisDropdownMenuLabelComponent,
    SolarisColumnManagerComponent,
  ],
  templateUrl: './table-toolbar.component.html',
  styleUrls: ['./table-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.role]': '"toolbar"',
    '[attr.aria-label]': 'resolvedAriaLabel()',
  },
})
export class SolarisTableToolbarComponent<T = unknown> implements OnInit {
  protected readonly themeService = inject(SolarisThemeService);
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });
  private readonly exportService = inject(SolarisExportService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);

  readonly columns = input<readonly SolarisTableFilterableColumn<T>[]>([]);
  readonly filter = model<SolarisTableFilterState>(
    createEmptyTableFilterState(),
  );
  readonly views = input<readonly SolarisTableView[]>([]);
  readonly selectedViewId = model<string | null>(null);
  readonly showViews = input(true, { transform: booleanAttribute });
  readonly showSearch = input(true, { transform: booleanAttribute });
  readonly showFilter = input(true, { transform: booleanAttribute });
  readonly showColumnManager = input(true, { transform: booleanAttribute });
  readonly exporters = input<readonly SolarisExporter<T>[]>([]);
  readonly exportDisplay = input<SolarisTableToolbarExportDisplay>('icon');
  readonly exportRows = input<readonly T[]>([]);
  readonly exportFilename = input<string | undefined>(undefined);
  readonly persistenceKey = input<string | undefined>(undefined);
  readonly density = input<SolarisTableDensity | undefined>(undefined);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelKey = input<string | undefined>(undefined);
  readonly searchPlaceholder = input<string | undefined>(undefined);
  readonly searchPlaceholderKey = input<string | undefined>(undefined);

  readonly viewCreate = output<string>();
  readonly exported = output<SolarisTableExportEvent<T>>();

  readonly leadingTemplate = contentChild(SolarisTableToolbarLeadingDirective);
  readonly trailingTemplate = contentChild(
    SolarisTableToolbarTrailingDirective,
  );

  private readonly columnsTrigger = viewChild('columnsTrigger', {
    read: SolarisPopoverTriggerDirective,
  });
  private readonly createViewTrigger = viewChild('createViewTrigger', {
    read: SolarisPopoverTriggerDirective,
  });

  protected readonly searchDraft = signal('');
  protected readonly viewNameDraft = signal('');
  protected readonly chipsRendered = signal(false);
  protected readonly chipsOpen = signal(false);
  private readonly closingSnapshot = signal<{
    readonly globalSearch: string;
    readonly conditions: readonly SolarisTableFilterCondition[];
  } | null>(null);
  private searchTimer: ReturnType<typeof setTimeout> | null = null;
  private chipsCollapseTimer: ReturnType<typeof setTimeout> | null = null;
  private chipsOpenFrame: number | null = null;

  constructor() {
    effect(() => {
      if (this.searchTimer) {
        return;
      }
      const committed = this.filter().globalSearch;
      if (committed !== this.searchDraft()) {
        this.searchDraft.set(committed);
      }
    });
    effect(() => {
      const key = this.persistenceKey();
      if (!key) {
        return;
      }
      writePersistedTableFilterState(
        `${key}:filter`,
        normalizeTableFilterState(this.filter()),
      );
      writePersistedViewId(`${key}:view`, this.selectedViewId());
    });
    this.destroyRef.onDestroy(() => {
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
        this.searchTimer = null;
      }
      if (this.chipsCollapseTimer) {
        clearTimeout(this.chipsCollapseTimer);
        this.chipsCollapseTimer = null;
      }
      this.cancelPendingChipsOpen();
    });
    const persisted = readPersistedToolbarState(this.persistenceKey());
    if (persisted) {
      if (isDefaultFilterState(this.filter()) && persisted.filter) {
        this.filter.set(normalizeTableFilterState(persisted.filter));
      }
      if (this.selectedViewId() === null && persisted.selectedViewId) {
        this.selectedViewId.set(persisted.selectedViewId);
      }
    }
    this.searchDraft.set(this.filter().globalSearch);
    effect(() => {
      if (this.hasActiveFilters()) {
        untracked(() => {
          this.closingSnapshot.set({
            globalSearch: this.filter().globalSearch,
            conditions: this.filter().conditions,
          });
          this.openChips();
        });
      } else {
        untracked(() => this.closeChips());
      }
    });
  }

  ngOnInit(): void {
    if (this.hasActiveFilters()) {
      this.chipsRendered.set(true);
      this.chipsOpen.set(true);
    }
  }

  private openChips(): void {
    if (this.chipsCollapseTimer) {
      clearTimeout(this.chipsCollapseTimer);
      this.chipsCollapseTimer = null;
    }
    if (!this.chipsRendered()) {
      this.chipsRendered.set(true);
    }
    if (this.chipsOpen()) {
      return;
    }
    this.cancelPendingChipsOpen();
    if (!isPlatformBrowser(this.platformId)) {
      this.chipsOpen.set(true);
      return;
    }

    this.chipsOpenFrame = requestAnimationFrame(() => {
      this.chipsOpenFrame = requestAnimationFrame(() => {
        this.chipsOpenFrame = null;
        if (this.hasActiveFilters()) {
          this.chipsOpen.set(true);
        }
      });
    });
  }

  private closeChips(): void {
    this.cancelPendingChipsOpen();
    if (!this.chipsRendered()) {
      return;
    }
    this.chipsOpen.set(false);
    if (this.chipsCollapseTimer) {
      clearTimeout(this.chipsCollapseTimer);
    }
    this.chipsCollapseTimer = setTimeout(
      () => {
        this.chipsCollapseTimer = null;
        this.chipsRendered.set(false);
      },
      this.prefersReducedMotion() ? 0 : FILTER_CHIPS_COLLAPSE_DURATION_MS,
    );
  }

  private cancelPendingChipsOpen(): void {
    if (this.chipsOpenFrame !== null) {
      cancelAnimationFrame(this.chipsOpenFrame);
      this.chipsOpenFrame = null;
    }
  }

  private prefersReducedMotion(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }
    // SECURITY_EXCEPTION: reads the OS reduced-motion preference via the Angular DOCUMENT token (defaultView.matchMedia); SSR-safe via the isPlatformBrowser guard above; matchMedia has no Renderer2 alternative; read-only query.
    const view = this.document.defaultView;
    if (!view || typeof view.matchMedia !== 'function') {
      return false;
    }
    return view.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  protected readonly effectiveDensity = computed(
    () => this.density() ?? this.themeService.density,
  );

  protected readonly normalizedExportDisplay = computed(() =>
    normalizeExportDisplay(this.exportDisplay()),
  );

  protected readonly filterableColumns = computed(() =>
    this.columns().filter((column) => column.filterable !== false),
  );

  protected readonly activeCount = computed(() =>
    activeTableFilterCount(this.filter()),
  );

  protected readonly hasActiveFilters = computed(() =>
    isTableFilterActive(this.filter()),
  );

  protected readonly displayedSearch = computed(() => {
    if (this.hasActiveFilters()) {
      return this.filter().globalSearch;
    }
    return this.closingSnapshot()?.globalSearch ?? '';
  });

  protected readonly displayedConditions = computed(
    (): readonly SolarisTableFilterCondition[] => {
      if (this.hasActiveFilters()) {
        return this.filter().conditions;
      }
      return this.closingSnapshot()?.conditions ?? [];
    },
  );

  protected readonly showExport = computed(() => this.exporters().length > 0);

  protected readonly singleExporter = computed(() =>
    this.exporters().length === 1 ? this.exporters()[0] : null,
  );

  protected readonly orderedVisibleColumns = computed(() =>
    applyOrderedVisibleColumns(this.columns(), this.filter()),
  );

  protected resolvedAriaLabel(): string {
    return this.resolveText(
      this.ariaLabel(),
      this.ariaLabelKey() ?? FILTER_ARIA_LABEL_FALLBACK_KEY,
      FILTER_ARIA_LABEL_FALLBACK_TEXT,
    ).trim();
  }

  protected resolveColumnLabel(
    column: SolarisTableFilterableColumn<T>,
  ): string {
    return this.resolveText(column.header, column.headerKey, column.id).trim();
  }

  protected resolveViewName(view: SolarisTableView): string {
    return this.resolveText(view.name, view.nameKey, view.id).trim();
  }

  protected readonly isValueless = isValuelessOperator;
  protected readonly isRange = isRangeOperator;
  protected readonly isList = isListOperator;

  protected operatorsFor(
    column: SolarisTableFilterableColumn<T> | null,
  ): readonly SolarisTableFilterOperator[] {
    if (!column) {
      return [];
    }
    return operatorsForColumnType(
      column.type,
      (column.filterOptions?.length ?? 0) > 0,
    );
  }

  protected operatorLabel(operator: SolarisTableFilterOperator): string {
    return this.resolveText(
      null,
      FILTER_OPERATOR_LABEL_KEYS[operator],
      FILTER_OPERATOR_LABELS[operator],
    ).trim();
  }

  protected conditionValueText(condition: SolarisTableFilterCondition): string {
    if (isValuelessOperator(condition.operator)) {
      return '';
    }
    if (isListOperator(condition.operator)) {
      const raw = condition.value;
      if (Array.isArray(raw)) {
        return raw.map(String).join(', ');
      }
      if (raw === null || raw === undefined || raw === '') {
        return '';
      }
      return String(raw);
    }
    if (isRangeOperator(condition.operator)) {
      const range = condition.value as
        | SolarisTableFilterRangeValue
        | null
        | undefined;
      const from = range?.from ?? '';
      const to = range?.to ?? '';
      return `${String(from)} – ${String(to)}`;
    }
    return condition.value === null || condition.value === undefined
      ? ''
      : String(condition.value);
  }

  protected chipLabel(condition: SolarisTableFilterCondition): string {
    const column = this.columns().find(
      (candidate) => candidate.id === condition.columnId,
    );
    const columnLabel = column
      ? this.resolveColumnLabel(column)
      : condition.columnId;
    const operator = this.operatorLabel(condition.operator);
    const value = this.conditionValueText(condition);
    return value
      ? `${columnLabel} ${operator} ${value}`
      : `${columnLabel} ${operator}`;
  }

  protected handleSearchInput(value: string): void {
    this.searchDraft.set(value);
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }
    this.searchTimer = setTimeout(() => {
      this.searchTimer = null;
      this.patchFilter({ globalSearch: this.searchDraft() });
    }, FILTER_SEARCH_DEBOUNCE_MS);
  }

  protected clearSearch(): void {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
      this.searchTimer = null;
    }
    this.searchDraft.set('');
    this.patchFilter({ globalSearch: '' });
  }

  protected addCondition(): void {
    const used = new Set(
      this.filter().conditions.map((condition) => condition.columnId),
    );
    const column =
      this.filterableColumns().find((candidate) => !used.has(candidate.id)) ??
      this.filterableColumns()[0];
    if (!column) {
      return;
    }
    const operator = defaultOperatorForColumn(
      column.type,
      (column.filterOptions?.length ?? 0) > 0,
    );
    this.patchFilter({
      conditions: [
        ...this.filter().conditions,
        { columnId: column.id, operator },
      ],
    });
  }

  protected updateConditionColumn(index: number, columnId: string): void {
    const column = this.columns().find(
      (candidate) => candidate.id === columnId,
    );
    if (!column) {
      return;
    }
    const operator = defaultOperatorForColumn(
      column.type,
      (column.filterOptions?.length ?? 0) > 0,
    );
    this.patchCondition(index, { columnId, operator, value: undefined });
  }

  protected updateConditionOperator(index: number, operator: string): void {
    if (!isFilterOperator(operator)) {
      return;
    }
    const current = this.filter().conditions[index];
    if (!current) {
      return;
    }
    this.patchCondition(index, {
      columnId: current.columnId,
      operator,
      value: isValuelessOperator(operator) ? undefined : current.value,
    });
  }

  protected updateConditionValue(
    index: number,
    value: SolarisTableFilterCondition['value'],
  ): void {
    const current = this.filter().conditions[index];
    if (!current) {
      return;
    }
    this.patchCondition(index, {
      columnId: current.columnId,
      operator: current.operator,
      value,
    });
  }

  protected updateConditionRange(
    index: number,
    side: 'from' | 'to',
    value: string,
  ): void {
    const current = this.filter().conditions[index];
    if (!current) {
      return;
    }
    const range = (current.value ?? {}) as SolarisTableFilterRangeValue;
    this.patchCondition(index, {
      columnId: current.columnId,
      operator: current.operator,
      value: { ...range, [side]: value === '' ? null : value },
    });
  }

  protected removeCondition(index: number): void {
    this.patchFilter({
      conditions: this.filter().conditions.filter(
        (_, position) => position !== index,
      ),
    });
  }

  protected clearAll(): void {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
      this.searchTimer = null;
    }
    this.searchDraft.set('');
    this.filter.set(createEmptyTableFilterState());
  }

  protected selectView(view: SolarisTableView): void {
    this.selectedViewId.set(view.id);
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
      this.searchTimer = null;
    }
    this.searchDraft.set(view.filter.globalSearch);
    this.filter.set(normalizeTableFilterState(view.filter));
  }

  protected handleExport(exporter: SolarisExporter<T>): void {
    const columns = this.orderedVisibleColumns().map((column) => ({
      id: column.id,
      header: this.resolveColumnLabel(column),
      accessor: column.accessor,
      displayValueOf: column.displayValueOf,
    }));
    const result = this.exportService.exportAndDownload(exporter, {
      rows: this.exportRows(),
      columns,
      filename: this.exportFilename() ?? undefined,
    });
    this.exported.emit({
      exporter,
      filename: result.filename,
      truncated: result.truncated,
    });
  }

  protected handleColumnSave(save: SolarisColumnManagerSave): void {
    this.patchFilter({
      columnOrder: [...save.order],
      columnVisibility: { ...save.visibility },
    });
    this.columnsTrigger()?.close();
  }

  protected handleColumnReset(): void {
    this.patchFilter({ columnOrder: [], columnVisibility: {} });
  }

  protected columnOf(
    condition: SolarisTableFilterCondition,
  ): SolarisTableFilterableColumn<T> | null {
    return (
      this.columns().find((column) => column.id === condition.columnId) ?? null
    );
  }

  protected inputTypeFor(
    column: SolarisTableFilterableColumn<T> | null,
  ): string {
    if (column?.type === 'number') {
      return 'number';
    }
    if (column?.type === 'date') {
      return 'date';
    }
    return 'text';
  }

  protected singleValueText(condition: SolarisTableFilterCondition): string {
    if (
      condition.value === null ||
      condition.value === undefined ||
      typeof condition.value === 'object'
    ) {
      return '';
    }
    return String(condition.value);
  }

  protected listValue(condition: SolarisTableFilterCondition): unknown[] {
    if (Array.isArray(condition.value)) {
      return [...condition.value];
    }
    if (
      condition.value === null ||
      condition.value === undefined ||
      condition.value === ''
    ) {
      return [];
    }
    return [condition.value];
  }

  protected rangePart(
    condition: SolarisTableFilterCondition,
    side: 'from' | 'to',
  ): string {
    const range = condition.value as
      | SolarisTableFilterRangeValue
      | null
      | undefined;
    const part = side === 'from' ? range?.from : range?.to;
    return part === null || part === undefined ? '' : String(part);
  }

  protected closeColumnsPanel(): void {
    this.columnsTrigger()?.close();
  }

  protected toStringValue(value: unknown): string {
    return String(value ?? '');
  }

  protected resolveSearchPlaceholder(): string {
    return this.resolveText(
      this.searchPlaceholder(),
      this.searchPlaceholderKey() ?? FILTER_SEARCH_PLACEHOLDER_KEY,
      FILTER_SEARCH_PLACEHOLDER,
    ).trim();
  }

  protected resolveSearchLabel(): string {
    return this.resolveText(
      null,
      FILTER_SEARCH_LABEL_KEY,
      FILTER_SEARCH_LABEL,
    ).trim();
  }

  protected resolveFilterButtonLabel(): string {
    return this.resolveText(
      null,
      FILTER_BUTTON_LABEL_KEY,
      FILTER_BUTTON_LABEL,
    ).trim();
  }

  protected resolveAddConditionLabel(): string {
    return this.resolveText(
      null,
      FILTER_ADD_CONDITION_LABEL_KEY,
      FILTER_ADD_CONDITION_LABEL,
    ).trim();
  }

  protected resolveClearAllLabel(): string {
    return this.resolveText(
      null,
      FILTER_CLEAR_ALL_LABEL_KEY,
      FILTER_CLEAR_ALL_LABEL,
    ).trim();
  }

  protected resolveColumnFieldLabel(): string {
    return this.resolveText(
      null,
      FILTER_COLUMN_LABEL_KEY,
      FILTER_COLUMN_LABEL,
    ).trim();
  }

  protected resolveOperatorFieldLabel(): string {
    return this.resolveText(
      null,
      FILTER_OPERATOR_LABEL_KEY,
      FILTER_OPERATOR_LABEL,
    ).trim();
  }

  protected resolveValueFieldLabel(): string {
    return this.resolveText(
      null,
      FILTER_VALUE_LABEL_KEY,
      FILTER_VALUE_LABEL,
    ).trim();
  }

  protected resolveNoConditionsLabel(): string {
    return this.resolveText(
      null,
      FILTER_NO_CONDITIONS_LABEL_KEY,
      FILTER_NO_CONDITIONS_LABEL,
    ).trim();
  }

  protected resolveViewsLabel(): string {
    return this.resolveText(
      null,
      FILTER_VIEWS_LABEL_KEY,
      FILTER_VIEWS_LABEL,
    ).trim();
  }

  protected resolveCreateViewLabel(): string {
    return this.resolveText(
      null,
      FILTER_CREATE_VIEW_LABEL_KEY,
      FILTER_CREATE_VIEW_LABEL,
    ).trim();
  }

  protected resolveExportLabel(): string {
    return this.resolveText(
      null,
      FILTER_EXPORT_LABEL_KEY,
      FILTER_EXPORT_LABEL,
    ).trim();
  }

  protected resolveExporterLabel(exporter: SolarisExporter<T>): string {
    return this.resolveText(null, exporter.labelKey, exporter.label).trim();
  }

  protected resolveExportFormatLabel(): string {
    return this.resolveText(
      null,
      FILTER_EXPORT_FORMAT_LABEL_KEY,
      FILTER_EXPORT_FORMAT_LABEL,
    ).trim();
  }

  protected handleViewNameInput(value: string): void {
    this.viewNameDraft.set(value);
  }

  protected handleCreateView(): void {
    const name = this.viewNameDraft().trim();
    if (name === '') {
      return;
    }
    this.viewNameDraft.set('');
    this.createViewTrigger()?.close();
    this.viewCreate.emit(name);
  }

  protected resolveCreateViewNameLabel(): string {
    return this.resolveText(
      null,
      FILTER_CREATE_VIEW_NAME_LABEL_KEY,
      FILTER_CREATE_VIEW_NAME_LABEL,
    ).trim();
  }

  protected resolveCreateViewNamePlaceholder(): string {
    return this.resolveText(
      null,
      FILTER_CREATE_VIEW_NAME_PLACEHOLDER_KEY,
      FILTER_CREATE_VIEW_NAME_PLACEHOLDER,
    ).trim();
  }

  protected resolveSaveLabel(): string {
    return this.resolveText(
      null,
      FILTER_SAVE_LABEL_KEY,
      FILTER_SAVE_LABEL,
    ).trim();
  }

  protected resolveColumnsButtonLabel(): string {
    return this.resolveText(
      null,
      FILTER_COLUMNS_BUTTON_LABEL_KEY,
      FILTER_COLUMNS_BUTTON,
    ).trim();
  }

  protected removeConditionLabel(
    condition: SolarisTableFilterCondition,
  ): string {
    const column = this.columns().find(
      (candidate) => candidate.id === condition.columnId,
    );
    return interpolateFilterText(
      this.resolveText(
        null,
        FILTER_REMOVE_CONDITION_LABEL_KEY,
        FILTER_REMOVE_CONDITION_LABEL,
      ),
      { column: column ? this.resolveColumnLabel(column) : condition.columnId },
    );
  }

  protected resolveRemoveSearchLabel(): string {
    return this.resolveText(
      null,
      FILTER_REMOVE_SEARCH_LABEL_KEY,
      FILTER_REMOVE_SEARCH_LABEL,
    ).trim();
  }

  private patchFilter(patch: Partial<SolarisTableFilterState>): void {
    this.filter.set(normalizeTableFilterState({ ...this.filter(), ...patch }));
  }

  private patchCondition(
    index: number,
    condition: SolarisTableFilterCondition,
  ): void {
    this.patchFilter({
      conditions: this.filter().conditions.map((entry, position) =>
        position === index ? condition : entry,
      ),
    });
  }

  private resolveText(
    directText?: string | null,
    translationKey?: string | null,
    fallbackText = '',
    params?: Record<string, string | number>,
  ): string {
    const direct = normalizeOptionalString(directText);
    if (direct) {
      return interpolateFilterText(direct, params ?? {});
    }
    const key = normalizeOptionalString(translationKey);
    if (key && this.translateService) {
      const translated = this.translateService.translate(key, params);
      if (translated !== key) {
        return translated;
      }
    }
    return interpolateFilterText(fallbackText, params ?? {});
  }
}

function isFilterOperator(value: string): value is SolarisTableFilterOperator {
  return (
    value === 'contains' ||
    value === 'equals' ||
    value === 'notEquals' ||
    value === 'startsWith' ||
    value === 'isEmpty' ||
    value === 'isNotEmpty' ||
    value === 'gt' ||
    value === 'gte' ||
    value === 'lt' ||
    value === 'lte' ||
    value === 'between' ||
    value === 'in' ||
    value === 'notIn'
  );
}

function isDefaultFilterState(state: SolarisTableFilterState): boolean {
  return (
    state.globalSearch === '' &&
    state.conditions.length === 0 &&
    state.columnOrder.length === 0 &&
    Object.keys(state.columnVisibility).length === 0
  );
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

function writePersistedViewId(
  key: string,
  selectedViewId: string | null,
): void {
  const storage = readStorage();
  if (!storage) {
    return;
  }
  try {
    storage.setItem(key, JSON.stringify({ selectedViewId }));
  } catch {
    return;
  }
}

function readPersistedToolbarState(
  storageKey: string | undefined,
): PersistedToolbarState | null {
  if (!storageKey) {
    return null;
  }
  const filter = readPersistedTableFilterState(`${storageKey}:filter`);
  const selectedViewId = readPersistedViewId(`${storageKey}:view`);
  if (!filter && !selectedViewId) {
    const legacy = parseTableFilterState(readRawStorage(`${storageKey}`));
    if (!legacy) {
      return null;
    }
    return { filter: legacy, selectedViewId: null };
  }
  return { filter: filter ?? undefined, selectedViewId };
}

function readPersistedViewId(key: string): string | null {
  const storage = readStorage();
  if (!storage) {
    return null;
  }
  try {
    const raw = storage.getItem(key);
    if (!raw) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === 'object' &&
      typeof (parsed as { selectedViewId?: unknown }).selectedViewId ===
        'string'
    ) {
      return (parsed as { selectedViewId: string }).selectedViewId;
    }
    return null;
  } catch {
    return null;
  }
}

function readRawStorage(key: string): string | null {
  const storage = readStorage();
  if (!storage) {
    return null;
  }
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}
