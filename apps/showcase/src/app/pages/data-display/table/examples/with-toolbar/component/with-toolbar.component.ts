import { Component, computed, effect, inject, signal } from '@angular/core';

import {
  SolarisPaginationComponent,
  SolarisTableComponent,
  SolarisTableFooterDirective,
  SolarisTableToolbarComponent,
  SolarisTableToolbarDirective,
  SolarisTranslateService,
  applyOrderedVisibleColumns,
  applyTableFilters,
  clampPageIndex,
  createCsvExporter,
  createEmptyTableFilterState,
  createJsonExporter,
  normalizeTableFilterState,
  resolveRows,
  sliceRows,
  type SolarisExporter,
  type SolarisPageChange,
  type SolarisTableColumn,
  type SolarisTableFilterState,
  type SolarisTableFilterableColumn,
  type SolarisTableView,
} from '@solaris-ui/angular';

import {
  TABLE_SHOWCASE_CITY_OPTIONS,
  TABLE_SHOWCASE_ROWS,
  type ShowcasePerson,
} from '../../../model/table-showcase.data';

type ShowcaseFilterColumn = SolarisTableColumn<ShowcasePerson> &
  SolarisTableFilterableColumn<ShowcasePerson>;

@Component({
  standalone: true,
  selector: 'app-with-toolbar-table-example',
  imports: [
    SolarisTableComponent,
    SolarisTableToolbarDirective,
    SolarisTableToolbarComponent,
    SolarisTableFooterDirective,
    SolarisPaginationComponent,
  ],
  templateUrl: './with-toolbar.component.html',
})
export class WithToolbarTableExample {
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });

  protected readonly allColumns: readonly ShowcaseFilterColumn[] = [
    {
      id: 'name',
      header: this.translate('table.with-toolbar.col.name', 'Name'),
      accessor: 'name',
      sortable: true,
    },
    {
      id: 'age',
      header: this.translate('table.with-toolbar.col.age', 'Age'),
      accessor: 'age',
      type: 'number',
      sortable: true,
    },
    {
      id: 'city',
      header: this.translate('table.with-toolbar.col.city', 'City'),
      accessor: 'city',
      sortable: true,
      filterOptions: TABLE_SHOWCASE_CITY_OPTIONS,
    },
  ];
  private readonly allRows: readonly ShowcasePerson[] = TABLE_SHOWCASE_ROWS;

  protected readonly filter = signal<SolarisTableFilterState>(
    createEmptyTableFilterState(),
  );
  protected readonly selectedViewId = signal<string | null>('all');
  protected readonly views = signal<readonly SolarisTableView[]>([
    {
      id: 'all',
      name: this.translate('table.with-toolbar.view.all', 'All contacts'),
      filter: createEmptyTableFilterState(),
    },
    {
      id: 'adults',
      name: this.translate('table.with-toolbar.view.adults', 'Age 30+'),
      filter: normalizeTableFilterState({
        conditions: [{ columnId: 'age', operator: 'gte', value: 30 }],
      }),
    },
  ]);

  protected readonly exporters: readonly SolarisExporter<ShowcasePerson>[] = [
    createCsvExporter<ShowcasePerson>(),
    createJsonExporter<ShowcasePerson>(),
  ];

  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(10);

  protected readonly orderedVisibleColumns = computed(() =>
    applyOrderedVisibleColumns(this.allColumns, this.filter()),
  );

  protected readonly filteredRows = computed(() =>
    applyTableFilters(this.allRows, this.allColumns, this.filter()),
  );

  protected readonly pageRows = computed(() =>
    sliceRows(
      resolveRows(this.filteredRows(), 'id'),
      clampPageIndex(
        this.pageIndex(),
        this.pageSize(),
        this.filteredRows().length,
      ),
      this.pageSize(),
    ).map((entry) => entry.row),
  );

  constructor() {
    effect(() => {
      this.filter();
      this.pageIndex.set(0);
    });
  }

  protected onCreateView(name: string): void {
    const id = `view-${Date.now()}`;
    this.views.set([...this.views(), { id, name, filter: this.filter() }]);
    this.selectedViewId.set(id);
  }

  protected onPageChange(event: SolarisPageChange): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  private translate(key: string, fallback: string): string {
    if (!this.translateService) {
      return fallback;
    }
    const translated = this.translateService.translate(key);
    return translated === key ? fallback : translated;
  }
}
