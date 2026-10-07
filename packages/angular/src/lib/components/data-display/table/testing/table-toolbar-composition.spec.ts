import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SolarisTableComponent } from '../component/table.component';
import { SolarisTableToolbarDirective } from '../directives/table-cell.directive';
import { SolarisTableToolbarComponent } from '../../table-filter/component/table-toolbar/table-toolbar.component';
import type { SolarisTableColumn } from '../model/table.types';
import type { SolarisTableFilterableColumn } from '../../table-filter/model/filter.types';

interface Person {
  id: string;
  name: string;
}

const COLUMNS: readonly SolarisTableColumn<Person>[] = [
  { id: 'name', header: 'Name', accessor: 'name', sortable: true },
];

const FILTER_COLUMNS: readonly SolarisTableFilterableColumn<Person>[] = [
  { id: 'name', header: 'Name', accessor: 'name', type: 'text' },
];

const ROWS: readonly Person[] = [
  { id: '1', name: 'Ana' },
  { id: '2', name: 'Beto' },
];

@Component({
  standalone: true,
  imports: [
    SolarisTableComponent,
    SolarisTableToolbarDirective,
    SolarisTableToolbarComponent,
  ],
  template: `
    <solaris-table [data]="rows()" [columns]="columns" rowId="id">
      <ng-template solaris-table-toolbar>
        <solaris-table-toolbar [columns]="filterColumns" />
      </ng-template>
    </solaris-table>
  `,
})
class TableToolbarHostComponent {
  readonly rows = signal(ROWS);
  readonly columns: readonly SolarisTableColumn<Person>[] = COLUMNS;
  readonly filterColumns: readonly SolarisTableFilterableColumn<Person>[] =
    FILTER_COLUMNS;
}

@Component({
  standalone: true,
  imports: [SolarisTableComponent],
  template: `
    <solaris-table [data]="rows()" [columns]="columns" rowId="id" />
  `,
})
class PlainTableHostComponent {
  readonly rows = signal(ROWS);
  readonly columns: readonly SolarisTableColumn<Person>[] = COLUMNS;
}

describe('TableToolbarComposition', () => {
  it('should render the toolbar inside the table frame when projected', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(TableToolbarHostComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(
      element.querySelector('.solaris-table__toolbar solaris-table-toolbar'),
    ).toBeTruthy();
    expect(
      element.querySelector(
        'tbody tr.solaris-table__row .solaris-table__cell[data-column-id="name"]',
      ),
    ).toBeTruthy();
  });

  it('should not render a toolbar slot when none is projected', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(PlainTableHostComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.solaris-table__toolbar')).toBeFalsy();
  });
});
