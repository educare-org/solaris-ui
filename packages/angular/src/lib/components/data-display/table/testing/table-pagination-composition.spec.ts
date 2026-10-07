import { Component, computed, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SolarisTableComponent } from '../component/table.component';
import { SolarisTableFooterDirective } from '../directives/table-cell.directive';
import { SolarisPaginationComponent } from '../../../navigation/pagination/component/pagination.component';
import { sliceRows, resolveRows } from '../model/table-state';
import type {
  SolarisTableColumn,
  SolarisTableLayout,
} from '../model/table.types';
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
  imports: [
    SolarisTableComponent,
    SolarisTableFooterDirective,
    SolarisPaginationComponent,
  ],
  template: `
    <solaris-table
      [data]="pageRows()"
      [columns]="columns"
      rowId="id"
      [layout]="layout()"
      [expandable]="expandable()"
    >
      <ng-template solaris-table-footer>
        <solaris-pagination
          [pageIndex]="pageIndex()"
          [pageSize]="pageSize()"
          [total]="rows().length"
          (pageChange)="onPageChange($event)"
        />
      </ng-template>
    </solaris-table>
  `,
})
class TablePaginationHostComponent {
  readonly rows = signal(buildRows(30));
  readonly columns: readonly SolarisTableColumn<Person>[] = COLUMNS;
  readonly layout = signal<SolarisTableLayout>('auto');
  readonly expandable = signal(false);
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
    expect(element.textContent).toContain('1–10 of 30');
    expect(
      element.querySelector('.solaris-table__footer solaris-pagination'),
    ).toBeTruthy();

    (
      element.querySelector(
        '.solaris-pagination__button[aria-label="Next page"]',
      ) as HTMLButtonElement
    ).click();
    fixture.detectChanges();

    expect(firstCell()).toBe('Person 10');
    expect(element.textContent).toContain('11–20 of 30');
  });

  it('should keep pagination in the footer on card layout', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(TablePaginationHostComponent);
    fixture.componentInstance.layout.set('card');
    fixture.componentInstance.expandable.set(true);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.solaris-table__cards-list')).toBeTruthy();
    expect(
      element.querySelector('.solaris-table__footer solaris-pagination'),
    ).toBeTruthy();
    expect(element.textContent).toContain('1–10 of 30');

    (
      element.querySelector(
        '.solaris-pagination__button[aria-label="Next page"]',
      ) as HTMLButtonElement
    ).click();
    fixture.detectChanges();

    expect(element.textContent).toContain('11–20 of 30');
  });

  it('should not render a footer when none is projected', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(PlainTableHostComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.solaris-table__footer')).toBeFalsy();
    expect(
      element
        .querySelector(
          'tbody tr.solaris-table__row .solaris-table__cell[data-column-id="name"]',
        )
        ?.textContent?.trim(),
    ).toBe('Person 0');
  });
});

@Component({
  standalone: true,
  imports: [SolarisTableComponent],
  template: `
    <solaris-table [data]="rows()" [columns]="columns" rowId="id" />
  `,
})
class PlainTableHostComponent {
  readonly rows = signal(buildRows(30));
  readonly columns: readonly SolarisTableColumn<Person>[] = COLUMNS;
}
