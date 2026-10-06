import { Component, computed, signal } from '@angular/core';

import {
  SolarisPaginationComponent,
  SolarisTableComponent,
  sliceRows,
  resolveRows,
  type SolarisPageChange,
} from '@solaris-ui/angular';

import {
  TABLE_SHOWCASE_BASIC_COLUMNS,
  TABLE_SHOWCASE_ROWS,
  type ShowcasePerson,
} from '../../../model/table-showcase.data';

@Component({
  standalone: true,
  selector: 'app-with-pagination-table-example',
  imports: [SolarisTableComponent, SolarisPaginationComponent],
  templateUrl: './with-pagination.component.html',
})
export class WithPaginationTableExample {
  protected readonly columns = TABLE_SHOWCASE_BASIC_COLUMNS;
  protected readonly total = TABLE_SHOWCASE_ROWS.length;
  private readonly allRows: readonly ShowcasePerson[] = TABLE_SHOWCASE_ROWS;

  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(10);

  protected readonly pageRows = computed(() =>
    sliceRows(
      resolveRows(this.allRows, 'id'),
      this.pageIndex(),
      this.pageSize(),
    ).map((entry) => entry.row),
  );

  protected onPageChange(event: SolarisPageChange): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }
}
