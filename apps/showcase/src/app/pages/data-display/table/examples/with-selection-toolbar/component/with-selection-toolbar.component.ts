import { Component, computed, signal } from '@angular/core';

import {
  SolarisTableComponent,
  SolarisTableToolbarComponent,
  SolarisTableToolbarDirective,
  applyOrderedVisibleColumns,
  applyTableFilters,
  createEmptyTableFilterState,
  type SolarisTableColumn,
  type SolarisTableFilterState,
  type SolarisTableFilterableColumn,
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
  selector: 'app-with-selection-toolbar-table-example',
  imports: [
    SolarisTableComponent,
    SolarisTableToolbarDirective,
    SolarisTableToolbarComponent,
  ],
  templateUrl: './with-selection-toolbar.component.html',
})
export class WithSelectionToolbarTableExample {
  protected readonly columns: readonly ShowcaseFilterColumn[] = [
    {
      id: 'name',
      headerKey: 'table.col.name',
      accessor: 'name',
      sortable: true,
    },
    {
      id: 'age',
      headerKey: 'table.col.age',
      accessor: 'age',
      type: 'number',
      sortable: true,
    },
    {
      id: 'city',
      headerKey: 'table.col.city',
      accessor: 'city',
      sortable: true,
      filterOptions: TABLE_SHOWCASE_CITY_OPTIONS,
    },
  ];

  protected readonly filter = signal<SolarisTableFilterState>(
    createEmptyTableFilterState(),
  );
  protected readonly selectedRowIds = signal<readonly string[]>([]);

  private readonly allRows: readonly ShowcasePerson[] =
    TABLE_SHOWCASE_ROWS.slice(0, 5);

  protected readonly rows = computed(() =>
    applyTableFilters(this.allRows, this.columns, this.filter()),
  );

  protected readonly orderedVisibleColumns = computed(() =>
    applyOrderedVisibleColumns(this.columns, this.filter()),
  );
}
