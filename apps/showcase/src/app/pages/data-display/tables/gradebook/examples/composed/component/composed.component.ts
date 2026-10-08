import { Component, computed, signal } from '@angular/core';

import {
  SolarisGradebookComponent,
  SolarisPaginationComponent,
  SolarisTableFooterDirective,
  resolveRows,
  sliceRows,
  type SolarisPageChange,
} from '@solaris-ui/angular';

import {
  GRADEBOOK_SHOWCASE_BASIC_COLUMNS,
  GRADEBOOK_SHOWCASE_IDENTITY,
  GRADEBOOK_SHOWCASE_ROWS,
} from '../../../model/gradebook-showcase.data';

@Component({
  standalone: true,
  selector: 'app-composed-gradebook-example',
  imports: [
    SolarisGradebookComponent,
    SolarisTableFooterDirective,
    SolarisPaginationComponent,
  ],
  templateUrl: './composed.component.html',
})
export class ComposedGradebookExample {
  protected readonly columns = GRADEBOOK_SHOWCASE_BASIC_COLUMNS;
  protected readonly identity = GRADEBOOK_SHOWCASE_IDENTITY;
  protected readonly total = GRADEBOOK_SHOWCASE_ROWS.length;

  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(3);

  protected readonly pageRows = computed(() =>
    sliceRows(
      resolveRows(GRADEBOOK_SHOWCASE_ROWS, 'id'),
      this.pageIndex(),
      this.pageSize(),
    ).map((entry) => entry.row),
  );

  protected onPageChange(event: SolarisPageChange): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }
}
