import { Component, computed, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SolarisTableComponent } from '../component/table.component';
import { SolarisPaginationComponent } from '../../../navigation/pagination/component/pagination.component';
import { sliceRows, resolveRows } from '../model/table-state';
import type { SolarisTableColumn } from '../model/table.types';
import type { SolarisPageChange } from '../../../navigation/pagination/model/pagination.types';

interface Person {
  id: string;
  name: string;
}

const COLUMNS: readonly SolarisTableColumn<Person>[] = [
  { id: 'name', header: 'Name', accessor: 'name', sortable: true },
];

function buildRows(count: number): readonly Person[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `id-${index}`,
    name: `Person ${index}`,
  }));
}

@Component({
  standalone: true,
  imports: [SolarisTableComponent, SolarisPaginationComponent],
  template: `
    <solaris-table [data]="pageRows()" [columns]="columns" rowId="id" />
    <solaris-pagination
      [pageIndex]="pageIndex()"
      [pageSize]="pageSize()"
      [total]="rows().length"
      (pageChange)="onPageChange($event)"
    />
  `,
})
class TablePaginationHostComponent {
  readonly rows = signal(buildRows(30));
  readonly columns: readonly SolarisTableColumn<Person>[] = COLUMNS;
  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);

  readonly pageRows = computed(() =>
    sliceRows(
      resolveRows(this.rows(), 'id'),
      this.pageIndex(),
      this.pageSize(),
    ).map((entry) => entry.row),
  );

  onPageChange(event: SolarisPageChange): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }
}

describe('TablePaginationComposition', () => {
  it('should slice client rows when the page changes', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(TablePaginationHostComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    const firstCell = () =>
      element
        .querySelector(
          'tbody tr.solaris-table__row .solaris-table__cell[data-column-id="name"]',
        )
        ?.textContent?.trim();

    expect(firstCell()).toBe('Person 0');
    expect(element.textContent).toContain('Page 1 of 3');

    (
      element.querySelector(
        '.solaris-pagination__button[aria-label="Next page"]',
      ) as HTMLButtonElement
    ).click();
    fixture.detectChanges();

    expect(firstCell()).toBe('Person 10');
    expect(element.textContent).toContain('Page 2 of 3');
  });
});
