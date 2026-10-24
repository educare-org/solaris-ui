import { Component, PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { vi } from 'vitest';

import { SolarisTableComponent } from '../component/table.component';
import { DETAIL_COLLAPSE_DURATION_MS } from '../model/table.defaults';
import {
  SolarisTableCellDirective,
  SolarisTableCellEditorDirective,
  SolarisTableDetailDirective,
  SolarisTableEmptyDirective,
  SolarisTableFooterCellDirective,
  SolarisTableHeaderDirective,
} from '../directives/table-cell.directive';
import type { SolarisTableColumn } from '../model/table.types';
import type {
  SolarisTableViewColumn,
  SolarisTableViewRow,
} from '../model/table.types';

interface Person {
  id: string;
  name: string;
  age: number;
}

const COLUMNS: readonly SolarisTableColumn<Person>[] = [
  { id: 'name', header: 'Name', accessor: 'name', sortable: true },
  { id: 'age', header: 'Age', accessor: 'age', type: 'number', sortable: true },
];

const ROWS: readonly Person[] = [
  { id: 'b', name: 'Beto', age: 30 },
  { id: 'a', name: 'Ana', age: 25 },
];

function createFixture() {
  TestBed.configureTestingModule({});
  const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
  fixture.componentRef.setInput('columns', COLUMNS);
  fixture.componentRef.setInput('data', ROWS);
  fixture.componentRef.setInput('rowId', 'id');
  fixture.detectChanges();
  return {
    fixture,
    element: fixture.nativeElement as HTMLElement,
  };
}

describe('SolarisTableComponent', () => {
  it('should render columns and rows', () => {
    const { element } = createFixture();
    const headers = Array.from(
      element.querySelectorAll('.solaris-table__head-cell'),
    ).map((cell) => cell.textContent?.trim());
    expect(headers.some((text) => text?.includes('Name'))).toBe(true);
    expect(headers.some((text) => text?.includes('Age'))).toBe(true);
    expect(element.querySelectorAll('tbody tr.solaris-table__row').length).toBe(
      2,
    );
  });

  it('should exclude hidden columns', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', [
      ...COLUMNS,
      { id: 'secret', header: 'Secret', accessor: 'name', hidden: true },
    ]);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('[data-column-id="secret"]')).toBeFalsy();
  });

  it('should cycle sort and update aria-sort with a live announcement', () => {
    const { fixture, element } = createFixture();
    const button = element.querySelector(
      '.solaris-table__head-cell[data-column-id="name"] button',
    ) as HTMLButtonElement;
    expect(
      element
        .querySelector('.solaris-table__head-cell[data-column-id="name"]')
        ?.getAttribute('aria-sort'),
    ).toBe('none');

    button.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.sort()?.direction).toBe('asc');
    expect(
      element
        .querySelector('.solaris-table__head-cell[data-column-id="name"]')
        ?.getAttribute('aria-sort'),
    ).toBe('ascending');

    button.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.sort()?.direction).toBe('desc');

    button.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.sort()).toBe(null);
    expect(element.querySelector('[role="status"]')?.textContent).toContain(
      'cleared',
    );
  });

  it('should sort client rows ascending', () => {
    const { fixture, element } = createFixture();
    (
      element.querySelector(
        '.solaris-table__head-cell[data-column-id="name"] button',
      ) as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    const firstCell = element.querySelector(
      'tbody tr.solaris-table__row .solaris-table__cell[data-column-id="name"]',
    );
    expect(firstCell?.textContent?.trim()).toBe('Ana');
  });

  it('should animate sort arrows independently per direction', () => {
    const { fixture, element } = createFixture();
    const parts = () =>
      Array.from(
        element.querySelectorAll(
          '.solaris-table__head-cell[data-column-id="name"] .solaris-table__sort-part',
        ),
      );
    expect(parts().length).toBe(2);
    expect(parts().every((part) => !part.hasAttribute('data-active'))).toBe(
      true,
    );

    (
      element.querySelector(
        '.solaris-table__head-cell[data-column-id="name"] button',
      ) as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    const active = parts().filter((part) => part.hasAttribute('data-active'));
    expect(active.length).toBe(1);
    expect(active[0].querySelector('svg')).toBeTruthy();
  });

  it('should not render the selection id in single mode headers', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.componentRef.setInput('selectionMode', 'single');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const headerText = element
      .querySelector('thead tr')
      ?.textContent?.replace(/\s+/g, ' ');
    expect(headerText).not.toContain('__solaris');
  });

  it('should trim the selection to one row when switching to single', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.componentRef.setInput('selectionMode', 'multiple');
    fixture.componentRef.setInput('selectedRowIds', ['b', 'a']);
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedRowIds()).toEqual(['b', 'a']);

    const events: unknown[] = [];
    fixture.componentInstance.selectionChange.subscribe((event) =>
      events.push(event),
    );
    fixture.componentRef.setInput('selectionMode', 'single');
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedRowIds()).toEqual(['b']);
    expect(events).toHaveLength(1);
  });

  it('should support single selection through the model', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.componentRef.setInput('selectionMode', 'single');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const checkboxes = Array.from(
      element.querySelectorAll('tbody solaris-checkbox input'),
    ) as HTMLInputElement[];
    expect(checkboxes.length).toBe(2);
    checkboxes[0].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedRowIds()).toEqual(['b']);
    checkboxes[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedRowIds()).toEqual(['a']);
  });

  it('should support multiple selection with a tri-state header', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.componentRef.setInput('selectionMode', 'multiple');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const headerInput = element.querySelector(
      'thead solaris-checkbox input',
    ) as HTMLInputElement;
    const rowInputs = Array.from(
      element.querySelectorAll('tbody solaris-checkbox input'),
    ) as HTMLInputElement[];

    rowInputs[0].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedRowIds()).toEqual(['b']);

    headerInput.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedRowIds()).toEqual(['b', 'a']);

    headerInput.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedRowIds()).toEqual([]);
  });

  it('should emit selectionChange with resolved rows', () => {
    const { fixture, element } = createFixture();
    fixture.componentRef.setInput('selectionMode', 'multiple');
    fixture.detectChanges();
    const events: unknown[] = [];
    fixture.componentInstance.selectionChange.subscribe((event) =>
      events.push(event),
    );
    (
      element.querySelector('tbody solaris-checkbox input') as HTMLInputElement
    ).click();
    fixture.detectChanges();
    expect(events.length).toBe(1);
    expect(events[0]).toMatchObject({
      selectedRowIds: ['b'],
      changedRowId: 'b',
    });
  });

  it('should render custom cell and header slots', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SlotHostComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Custom:Beto');
    expect(element.textContent).toContain('Upper:name');
  });

  it('should prefer state slots over text', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(StateSlotHostComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Empty slot wins');
  });

  it('should render empty text when no rows exist', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput('data', []);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('No results found');
  });

  it('should render the error state with role alert', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.componentRef.setInput('error', 'Boom');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('[role="alert"]')?.textContent).toContain(
      'Boom',
    );
  });

  it('should render skeleton rows while loading', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(
      element.querySelectorAll('.solaris-table__row--loading').length,
    ).toBeGreaterThan(0);
  });

  it('should inherit density from the host input', () => {
    const { element } = createFixture();
    expect(element.getAttribute('data-density')).toBe('normal');
  });

  it('should apply an explicit density', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.componentRef.setInput('density', 'compact');
    fixture.detectChanges();
    expect(
      (fixture.nativeElement as HTMLElement).getAttribute('data-density'),
    ).toBe('compact');
  });

  it('should resolve aria labels and headers through direct text', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.componentRef.setInput('ariaLabel', 'People');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('table')?.getAttribute('aria-label')).toBe(
      'People',
    );
  });

  it('should expand detail rows with priority columns', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', [
      { id: 'name', header: 'Name', accessor: 'name' },
      { id: 'age', header: 'Age', accessor: 'age', priority: 2 },
    ]);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.componentRef.setInput('expandable', true);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const expandButton = element.querySelector(
      '.solaris-table__expand-button',
    ) as HTMLButtonElement;
    expect(expandButton.getAttribute('aria-expanded')).toBe('false');
    expandButton.click();
    fixture.detectChanges();
    expect(expandButton.getAttribute('aria-expanded')).toBe('true');
    expect(element.querySelector('.solaris-table__row--detail')).toBeTruthy();
  });

  it('should render the actions column at the end when expandable', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', [
      { id: 'name', header: 'Name', accessor: 'name' },
    ]);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.componentRef.setInput('expandable', true);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const headers = Array.from(
      element.querySelectorAll('.solaris-table__head-cell'),
    );
    const last = headers[headers.length - 1];
    expect(last.textContent?.trim()).toBe('Actions');
    expect(last.classList.contains('solaris-table__head-cell--expand')).toBe(
      true,
    );
  });

  it('should render per-column detail templates on expansion', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(DetailHostComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    (
      element.querySelector(
        '.solaris-table__expand-button',
      ) as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    expect(element.textContent).toContain('Extra:Beto');
  });

  it('should expose mobile and fullWidth modes as data attributes', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.componentRef.setInput('expandable', true);
    fixture.componentRef.setInput('mobile', true);
    fixture.componentRef.setInput('fullWidth', true);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.getAttribute('data-mobile')).toBeTruthy();
    expect(element.getAttribute('data-fullwidth')).toBeTruthy();
  });

  it('should render cards instead of a table in mobile layout', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.componentRef.setInput('expandable', true);
    fixture.componentRef.setInput('mobile', true);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('table')).toBeFalsy();
    const cards = element.querySelectorAll('.solaris-table__card');
    expect(cards.length).toBe(2);
    expect(element.textContent).toContain('Beto');
  });

  it('should not render sort buttons in card layout', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.componentRef.setInput('expandable', true);
    fixture.componentRef.setInput('mobile', true);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.solaris-table__card-sort')).toBeFalsy();
    expect(
      element.querySelectorAll('.solaris-table__card-label').length,
    ).toBeGreaterThan(0);
    expect(element.getAttribute('data-card-layout')).toBeTruthy();
  });

  it('should support layout=card as an alias of mobile', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.componentRef.setInput('expandable', true);
    fixture.componentRef.setInput('layout', 'card');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('table')).toBeFalsy();
    expect(element.getAttribute('data-layout')).toBe('card');
  });

  it('should expose appearance and striped-mode as data attributes', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.componentRef.setInput('appearance', 'surface');
    fixture.componentRef.setInput('striped', true);
    fixture.componentRef.setInput('stripedMode', 'odd');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.getAttribute('data-appearance')).toBe('surface');
    expect(element.getAttribute('data-striped-mode')).toBe('odd');
  });

  it('should render the error state inside the table chrome', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.componentRef.setInput('error', 'Boom');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('table')).toBeTruthy();
    expect(
      element.querySelector(
        'tbody tr.solaris-table__row--error [role="alert"]',
      ),
    ).toBeTruthy();
  });

  it('should expand cell details in a row below without opening the row', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(CellDetailHostComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const button = element.querySelector(
      '.solaris-table__cell-expand',
    ) as HTMLButtonElement;
    expect(button.getAttribute('aria-expanded')).toBe('false');
    button.click();
    fixture.detectChanges();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    const cellDetail = element.querySelector(
      '.solaris-table__row--cell-detail',
    );
    expect(cellDetail).toBeTruthy();
    expect(cellDetail?.textContent).toContain('Score 30 details');
    expect(
      element.querySelector(
        '.solaris-table__row--detail:not(.solaris-table__row--cell-detail)',
      ),
    ).toBeFalsy();
  });

  it('should render free detail areas without term chrome', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(FreeDetailHostComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    (
      element.querySelector('.solaris-table__cell-expand') as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    const free = element.querySelector('.solaris-table__detail-free');
    expect(free).toBeTruthy();
    expect(free?.textContent).toContain('Free:30');
    expect(
      element.querySelector(
        '.solaris-table__row--cell-detail .solaris-table__detail-term',
      ),
    ).toBeFalsy();
  });

  it('should hide card labels when hideCardLabel is set', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', [
      { id: 'name', header: 'Name', accessor: 'name', hideCardLabel: true },
      { id: 'age', header: 'Age', accessor: 'age', type: 'number' },
    ]);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.componentRef.setInput('expandable', true);
    fixture.componentRef.setInput('layout', 'card');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const labels = Array.from(
      element.querySelectorAll('.solaris-table__card-label'),
    ).map((label) => label.textContent?.trim());
    expect(labels).not.toContain('Name');
    expect(labels).toContain('Age');
    expect(
      element.querySelector('.solaris-table__card-field[data-hidelabel]'),
    ).toBeTruthy();
  });

  it('should sort custom values through sortValueOf', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', [
      {
        id: 'name',
        header: 'Name',
        accessor: 'name',
        sortable: true,
        sortValueOf: (row: Person) => row.age,
      },
      { id: 'age', header: 'Age', accessor: 'age', type: 'number' },
    ]);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    (
      element.querySelector(
        '.solaris-table__head-cell[data-column-id="name"] button',
      ) as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    const firstCell = element.querySelector(
      'tbody tr.solaris-table__row .solaris-table__cell[data-column-id="name"]',
    );
    expect(firstCell?.textContent?.trim()).toContain('Ana');
  });

  it('should select rows from cards in mobile layout', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.componentRef.setInput('selectionMode', 'multiple');
    fixture.componentRef.setInput('expandable', true);
    fixture.componentRef.setInput('mobile', true);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const events: unknown[] = [];
    fixture.componentInstance.selectionChange.subscribe((event) =>
      events.push(event),
    );
    (
      element.querySelector(
        '.solaris-table__card solaris-checkbox input',
      ) as HTMLInputElement
    ).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedRowIds()).toEqual(['b']);
    expect(events).toHaveLength(1);
  });

  it('should expose cellPadding as a data attribute', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.detectChanges();
    expect(
      (fixture.nativeElement as HTMLElement).getAttribute('data-cell-padding'),
    ).toBe('none');
    fixture.componentRef.setInput('cellPadding', 'lg');
    fixture.detectChanges();
    expect(
      (fixture.nativeElement as HTMLElement).getAttribute('data-cell-padding'),
    ).toBe('lg');
  });

  it('should emit rowClick from the first-cell button', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.componentRef.setInput('rowClickable', true);
    fixture.detectChanges();
    const events: unknown[] = [];
    fixture.componentInstance.rowClick.subscribe((event) => events.push(event));
    const element = fixture.nativeElement as HTMLElement;
    (
      element.querySelector('.solaris-table__row-button') as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    expect(events).toHaveLength(1);
  });
});

@Component({
  standalone: true,
  imports: [
    SolarisTableComponent,
    SolarisTableCellDirective,
    SolarisTableHeaderDirective,
  ],
  template: `
    <solaris-table [data]="rows" [columns]="columns" rowId="id">
      <ng-template solaris-table-cell="name" let-row>
        Custom:{{ row.name }}
      </ng-template>
      <ng-template solaris-table-header="name" let-column>
        Upper:{{ column.id }}
      </ng-template>
    </solaris-table>
  `,
})
class SlotHostComponent {
  readonly rows: readonly Person[] = ROWS;
  readonly columns: readonly SolarisTableColumn<Person>[] = [
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      cellTemplateId: 'name',
      headerTemplateId: 'name',
    },
    { id: 'age', header: 'Age', accessor: 'age', type: 'number' },
  ];
}

@Component({
  standalone: true,
  imports: [SolarisTableComponent, SolarisTableDetailDirective],
  template: `
    <solaris-table
      [data]="rows"
      [columns]="columns"
      rowId="id"
      [expandable]="true"
    >
      <ng-template solaris-table-detail="person-detail" let-row>
        Extra:{{ row.name }}
      </ng-template>
    </solaris-table>
  `,
})
class DetailHostComponent {
  readonly rows: readonly Person[] = ROWS;
  readonly columns: readonly SolarisTableColumn<Person>[] = [
    { id: 'name', header: 'Name', accessor: 'name' },
    {
      id: 'age',
      header: 'Age',
      accessor: 'age',
      type: 'number',
      detailTemplateId: 'person-detail',
    },
  ];
}

@Component({
  standalone: true,
  imports: [SolarisTableComponent, SolarisTableEmptyDirective],
  template: `
    <solaris-table [data]="[]" [columns]="columns" rowId="id">
      <ng-template solaris-table-empty>Empty slot wins</ng-template>
    </solaris-table>
  `,
})
class StateSlotHostComponent {
  readonly columns: readonly SolarisTableColumn<Person>[] = COLUMNS;
}

@Component({
  standalone: true,
  imports: [SolarisTableComponent, SolarisTableDetailDirective],
  template: `
    <solaris-table
      [data]="rows"
      [columns]="columns"
      rowId="id"
      [expandable]="true"
      expandMode="cell"
    >
      <ng-template solaris-table-detail="score-detail" let-row>
        Score {{ row.age }} details
      </ng-template>
    </solaris-table>
  `,
})
class CellDetailHostComponent {
  readonly rows: readonly Person[] = ROWS;
  readonly columns: readonly SolarisTableColumn<Person>[] = [
    { id: 'name', header: 'Name', accessor: 'name' },
    {
      id: 'age',
      header: 'Age',
      accessor: 'age',
      type: 'number',
      expandable: true,
      detailTemplateId: 'score-detail',
    },
  ];
}

describe('SolarisTableComponent polish', () => {
  it('should expose radius on the host', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.componentRef.setInput('radius', 'lg');
    fixture.detectChanges();
    expect(
      (fixture.nativeElement as HTMLElement).getAttribute('data-radius'),
    ).toBe('lg');
  });

  it('should render column icons on both positions', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', [
      { id: 'name', header: 'Name', accessor: 'name', icon: 'user' },
      {
        id: 'age',
        header: 'Age',
        accessor: 'age',
        type: 'number',
        icon: 'calendar',
        iconPosition: 'end',
      },
    ]);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('.solaris-table__head-icon').length).toBe(
      2,
    );
  });

  it('should emit addRowRequest from the add row', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.componentRef.setInput('showAddRow', true);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const button = element.querySelector(
      '.solaris-table__add-row',
    ) as HTMLButtonElement;
    expect(button).toBeTruthy();
    let emitted = 0;
    fixture.componentRef.instance.addRowRequest.subscribe(() => {
      emitted += 1;
    });
    button.click();
    expect(emitted).toBe(1);
  });

  it('should hide the add row while loading', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.componentRef.setInput('showAddRow', true);
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector(
        '.solaris-table__add-row',
      ),
    ).toBeFalsy();
  });

  it('should not mark sticky cells by default', () => {
    const { element } = createFixture();
    expect(element.hasAttribute('data-sticky-first-column')).toBe(false);
    expect(element.querySelector('[data-sticky="start"]')).toBeFalsy();
  });

  it('should pin the first column when stickyFirstColumn is true', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.componentRef.setInput('stickyFirstColumn', true);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.hasAttribute('data-sticky-first-column')).toBe(true);
    expect(
      element.querySelector(
        '.solaris-table__head-cell[data-column-id="name"][data-sticky="start"]',
      ),
    ).toBeTruthy();
    expect(
      element.querySelector(
        '.solaris-table__head-cell[data-column-id="age"][data-sticky="start"]',
      ),
    ).toBeFalsy();
    const stickyBodyCells = element.querySelectorAll(
      'tbody tr.solaris-table__row .solaris-table__cell[data-column-id="name"][data-sticky="start"]',
    );
    expect(stickyBodyCells.length).toBe(2);
  });

  it('should pin the selection and first data columns together', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.componentRef.setInput('selectionMode', 'multiple');
    fixture.componentRef.setInput('stickyFirstColumn', true);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const stickyHeaders = element.querySelectorAll(
      'thead .solaris-table__head-cell[data-sticky="start"]',
    );
    expect(stickyHeaders.length).toBe(2);
  });

  it('should not render sticky cells in card layout', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.componentRef.setInput('expandable', true);
    fixture.componentRef.setInput('layout', 'card');
    fixture.componentRef.setInput('stickyFirstColumn', true);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('[data-sticky="start"]')).toBeFalsy();
  });

  it('should not render a footer without footer definitions', () => {
    const { element } = createFixture();
    expect(element.querySelector('tfoot.solaris-table__foot')).toBeFalsy();
  });

  it('should render static footer text with em-dash fallback', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', [
      { id: 'name', header: 'Name', accessor: 'name', footer: 'Average' },
      { id: 'age', header: 'Age', accessor: 'age', type: 'number' },
    ]);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const footer = element.querySelector('tfoot.solaris-table__foot');
    expect(footer).toBeTruthy();
    expect(
      footer?.querySelector('[data-column-id="name"]')?.textContent?.trim(),
    ).toBe('Average');
    expect(
      footer?.querySelector('[data-column-id="age"]')?.textContent?.trim(),
    ).toBe('—');
  });

  it('should aggregate footer values over visible rows', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', [
      { id: 'name', header: 'Name', accessor: 'name', footer: 'Count' },
      {
        id: 'age',
        header: 'Age',
        accessor: 'age',
        type: 'number',
        footerValueOf: (rows: readonly Person[]) =>
          `avg ${(rows.reduce((sum, row) => sum + row.age, 0) / rows.length).toFixed(1)}`,
      },
    ]);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(
      element
        .querySelector('tfoot.solaris-table__foot [data-column-id="age"]')
        ?.textContent?.trim(),
    ).toBe('avg 27.5');
  });

  it('should hide the footer while loading, on error, or when empty', () => {
    const footerColumns: readonly SolarisTableColumn<Person>[] = [
      { id: 'name', header: 'Name', accessor: 'name', footer: 'Average' },
    ];
    for (const props of [
      { loading: true, data: ROWS, error: null },
      { loading: false, data: ROWS, error: 'Unable to load data' },
      { loading: false, data: [], error: null },
    ]) {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
      fixture.componentRef.setInput('columns', footerColumns);
      fixture.componentRef.setInput('data', props.data);
      fixture.componentRef.setInput('rowId', 'id');
      fixture.componentRef.setInput('loading', props.loading);
      if (props.error) {
        fixture.componentRef.setInput('error', props.error);
      }
      fixture.detectChanges();
      expect(
        (fixture.nativeElement as HTMLElement).querySelector(
          'tfoot.solaris-table__foot',
        ),
      ).toBeFalsy();
      TestBed.resetTestingModule();
    }
  });

  it('should prefer the footer cell template over footer text', () => {
    TestBed.configureTestingModule({
      imports: [FooterCellHostComponent],
    });
    const fixture = TestBed.createComponent(FooterCellHostComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(
      element
        .querySelector('tfoot.solaris-table__foot [data-column-id="age"]')
        ?.textContent?.trim(),
    ).toBe('total 2');
  });

  it('should pin sticky footer cells with the first column', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', [
      { id: 'name', header: 'Name', accessor: 'name', footer: 'Average' },
      { id: 'age', header: 'Age', accessor: 'age', type: 'number' },
    ]);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.componentRef.setInput('stickyFirstColumn', true);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(
      element.querySelector(
        'tfoot.solaris-table__foot [data-column-id="name"][data-sticky="start"]',
      ),
    ).toBeTruthy();
  });

  it('should not render a group row without header groups', () => {
    const { element } = createFixture();
    expect(
      element.querySelector('thead tr.solaris-table__head-row--group'),
    ).toBeFalsy();
  });

  it('should render grouped headers with colspan and rowspan', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', [
      { id: 'name', header: 'Name', accessor: 'name' },
      {
        id: 'age',
        header: 'Age',
        accessor: 'age',
        type: 'number',
        headerGroup: 'metrics',
      },
    ]);
    fixture.componentRef.setInput('headerGroups', [
      { id: 'metrics', header: 'Metrics' },
    ]);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const groupRow = element.querySelector(
      'thead tr.solaris-table__head-row--group',
    );
    expect(groupRow).toBeTruthy();
    expect(
      groupRow?.querySelector('th[scope="colgroup"]')?.getAttribute('colspan'),
    ).toBe('1');
    expect(
      groupRow?.querySelector('th[scope="colgroup"]')?.textContent?.trim(),
    ).toBe('Metrics');
    expect(
      groupRow
        ?.querySelector('th[data-column-id="name"]')
        ?.getAttribute('rowspan'),
    ).toBe('2');
    const columnRowCells = element.querySelectorAll(
      'thead tr.solaris-table__head-row:not(.solaris-table__head-row--group) th[data-column-id]',
    );
    expect(columnRowCells.length).toBe(1);
    expect(
      element.querySelector('tbody tr.solaris-table__row[aria-rowindex="3"]'),
    ).toBeTruthy();
  });

  it('should merge consecutive columns of the same group', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', [
      {
        id: 'name',
        header: 'Name',
        accessor: 'name',
        headerGroup: 'identity',
      },
      {
        id: 'age',
        header: 'Age',
        accessor: 'age',
        type: 'number',
        headerGroup: 'identity',
      },
    ]);
    fixture.componentRef.setInput('headerGroups', [
      { id: 'identity', header: 'Identity' },
    ]);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(
      element
        .querySelector(
          'thead tr.solaris-table__head-row--group th[scope="colgroup"]',
        )
        ?.getAttribute('colspan'),
    ).toBe('2');
  });

  it('should ignore unknown header group ids', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', [
      { id: 'name', header: 'Name', accessor: 'name', headerGroup: 'nope' },
      { id: 'age', header: 'Age', accessor: 'age', type: 'number' },
    ]);
    fixture.componentRef.setInput('headerGroups', []);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.detectChanges();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector(
        'thead tr.solaris-table__head-row--group',
      ),
    ).toBeFalsy();
  });

  it('should keep sort working on grouped columns', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', [
      {
        id: 'name',
        header: 'Name',
        accessor: 'name',
        sortable: true,
        headerGroup: 'identity',
      },
      { id: 'age', header: 'Age', accessor: 'age', type: 'number' },
    ]);
    fixture.componentRef.setInput('headerGroups', [
      { id: 'identity', header: 'Identity' },
    ]);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    (
      element.querySelector(
        'thead tr.solaris-table__head-row:not(.solaris-table__head-row--group) [data-column-id="name"] button',
      ) as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    expect(
      element
        .querySelector(
          'tbody tr.solaris-table__row .solaris-table__cell[data-column-id="name"]',
        )
        ?.textContent?.trim(),
    ).toBe('Ana');
  });

  it('should not mark cells editable without an editor template', () => {
    const { element } = createFixture();
    expect(element.querySelector('[data-editable]')).toBeFalsy();
  });

  it('should edit a cell through the editor template', () => {
    TestBed.configureTestingModule({
      imports: [CellEditorHostComponent],
    });
    const fixture = TestBed.createComponent(CellEditorHostComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const cell = element.querySelector(
      'tbody tr.solaris-table__row .solaris-table__cell[data-column-id="name"]',
    ) as HTMLElement;
    expect(cell.hasAttribute('data-editable')).toBe(true);
    expect(cell.getAttribute('tabindex')).toBe('0');
    cell.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    fixture.detectChanges();
    expect(
      element.querySelector('.solaris-table__cell-main--editing'),
    ).toBeTruthy();
    expect(fixture.componentInstance.started.length).toBe(1);
    expect(fixture.componentInstance.started[0].column.id).toBe('name');
    cell.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    fixture.detectChanges();
    expect(
      element.querySelector('.solaris-table__cell-main--editing'),
    ).toBeFalsy();
    expect(fixture.componentInstance.ended.length).toBe(1);
  });

  it('should ignore editing on columns without editorTemplateId', () => {
    TestBed.configureTestingModule({
      imports: [CellEditorHostComponent],
    });
    const fixture = TestBed.createComponent(CellEditorHostComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const cell = element.querySelector(
      'tbody tr.solaris-table__row .solaris-table__cell[data-column-id="age"]',
    ) as HTMLElement;
    expect(cell.hasAttribute('data-editable')).toBe(false);
    cell.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    fixture.detectChanges();
    expect(
      element.querySelector('.solaris-table__cell-main--editing'),
    ).toBeFalsy();
    expect(fixture.componentInstance.started.length).toBe(0);
  });
});

@Component({
  standalone: true,
  imports: [SolarisTableComponent, SolarisTableDetailDirective],
  template: `
    <solaris-table
      [data]="rows"
      [columns]="columns"
      rowId="id"
      [expandable]="true"
      expandMode="cell"
    >
      <ng-template solaris-table-detail="free-detail" let-row>
        Free:{{ row.age }}
      </ng-template>
    </solaris-table>
  `,
})
class FreeDetailHostComponent {
  readonly rows: readonly Person[] = ROWS;
  readonly columns: readonly SolarisTableColumn<Person>[] = [
    { id: 'name', header: 'Name', accessor: 'name' },
    {
      id: 'age',
      header: 'Age',
      accessor: 'age',
      type: 'number',
      expandable: true,
      detailVariant: 'free',
      detailTemplateId: 'free-detail',
    },
  ];
}

@Component({
  standalone: true,
  imports: [SolarisTableComponent, SolarisTableFooterCellDirective],
  template: `
    <solaris-table [data]="rows" [columns]="columns" rowId="id">
      <ng-template solaris-table-footer-cell="age-total" let-rows>
        total {{ rows.length }}
      </ng-template>
    </solaris-table>
  `,
})
class FooterCellHostComponent {
  readonly rows: readonly Person[] = ROWS;
  readonly columns: readonly SolarisTableColumn<Person>[] = [
    { id: 'name', header: 'Name', accessor: 'name', footer: 'Count' },
    {
      id: 'age',
      header: 'Age',
      accessor: 'age',
      type: 'number',
      footer: 'Ignored',
      footerTemplateId: 'age-total',
    },
  ];
}

@Component({
  standalone: true,
  imports: [SolarisTableComponent, SolarisTableCellEditorDirective],
  template: `
    <solaris-table
      [data]="rows"
      [columns]="columns"
      rowId="id"
      (editStart)="started.push($event)"
      (editEnd)="ended.push($event)"
    >
      <ng-template solaris-table-cell-editor="name-editor" let-row>
        editing {{ row.name }}
      </ng-template>
    </solaris-table>
  `,
})
class CellEditorHostComponent {
  readonly rows: readonly Person[] = ROWS;
  readonly columns: readonly SolarisTableColumn<Person>[] = [
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      editorTemplateId: 'name-editor',
    },
    { id: 'age', header: 'Age', accessor: 'age', type: 'number' },
  ];
  readonly started: { column: SolarisTableColumn<Person> }[] = [];
  readonly ended: { column: SolarisTableColumn<Person> }[] = [];
}

interface TableCoverageInternals {
  cellDetailId(row: SolarisTableViewRow<Person>, columnIndex: number): string;
  cellDetailRowId(rowIndex: number): string;
  allVisibleRowsSelected(): boolean;
  someVisibleRowsSelected(): boolean;
  expandedCellColumns(
    row: SolarisTableViewRow<Person>,
  ): readonly SolarisTableViewColumn<Person>[];
  visibleCellColumns(
    row: SolarisTableViewRow<Person>,
  ): readonly SolarisTableViewColumn<Person>[];
  isCellExpanded(
    row: SolarisTableViewRow<Person>,
    column: SolarisTableViewColumn<Person>,
  ): boolean;
  isCellDetailRowOpen(row: SolarisTableViewRow<Person>): boolean;
  isCellDetailRowVisible(row: SolarisTableViewRow<Person>): boolean;
  toggleCellExpanded(
    row: SolarisTableViewRow<Person>,
    column: SolarisTableViewColumn<Person>,
  ): void;
  toggleRowExpanded(row: SolarisTableViewRow<Person>): void;
  prefersReducedMotion(): boolean;
  userColumns(): readonly SolarisTableViewColumn<Person>[];
  visibleRows(): readonly SolarisTableViewRow<Person>[];
  openedCells(): readonly string[];
  isEditingCell(
    row: SolarisTableViewRow<Person>,
    column: SolarisTableViewColumn<Person>,
  ): boolean;
  startEditing(
    row: SolarisTableViewRow<Person>,
    column: SolarisTableViewColumn<Person>,
    event?: Event,
  ): void;
  stopEditing(
    row: SolarisTableViewRow<Person>,
    column: SolarisTableViewColumn<Person>,
  ): void;
  resolveEditorTemplate(column: SolarisTableViewColumn<Person>): unknown;
  toggleSort(column: SolarisTableViewColumn<Person>): void;
  handleAddRow(): void;
}

function internalsOf(fixture: {
  componentInstance: unknown;
}): TableCoverageInternals {
  return fixture.componentInstance as TableCoverageInternals;
}

function viewRow(rowId: string): SolarisTableViewRow<Person> {
  return { rowId } as SolarisTableViewRow<Person>;
}

function stubAnimationFrames(): {
  queue: Map<number, FrameRequestCallback>;
  cancelled: number[];
  restore(): void;
} {
  const queue = new Map<number, FrameRequestCallback>();
  const cancelled: number[] = [];
  let nextId = 0;
  const originalRequest = globalThis.requestAnimationFrame;
  const originalCancel = globalThis.cancelAnimationFrame;
  globalThis.requestAnimationFrame = ((
    callback: FrameRequestCallback,
  ): number => {
    nextId += 1;
    queue.set(nextId, callback);
    return nextId;
  }) as typeof requestAnimationFrame;
  globalThis.cancelAnimationFrame = ((id: number): void => {
    cancelled.push(id);
    queue.delete(id);
  }) as typeof cancelAnimationFrame;
  return {
    queue,
    cancelled,
    restore(): void {
      globalThis.requestAnimationFrame = originalRequest;
      globalThis.cancelAnimationFrame = originalCancel;
    },
  };
}

function flushAnimationFrames(queue: Map<number, FrameRequestCallback>): void {
  while (queue.size > 0) {
    const pending = [...queue.values()];
    queue.clear();
    for (const callback of pending) {
      callback(16);
    }
  }
}

function stubMatchMedia(matches: (query: string) => boolean): () => void {
  TestBed.configureTestingModule({});
  const doc = TestBed.inject(DOCUMENT);
  const view = doc.defaultView as unknown as {
    matchMedia: unknown;
  };
  const original = view.matchMedia;
  const listeners = new Map<string, (event: { matches: boolean }) => void>();
  const removed: string[] = [];
  view.matchMedia = ((query: string) => ({
    matches: matches(query),
    media: query,
    addEventListener: (
      type: string,
      listener: (event: { matches: boolean }) => void,
    ): void => {
      listeners.set(type, listener);
    },
    removeEventListener: (type: string): void => {
      removed.push(type);
      listeners.delete(type);
    },
    dispatchChange(next: boolean): void {
      listeners.get('change')?.({ matches: next });
    },
  })) as unknown as typeof view.matchMedia;
  return () => {
    view.matchMedia = original;
  };
}

describe('SolarisTableComponent cell detail ids', () => {
  it('should build stable cell detail ids per row and column', () => {
    const { fixture } = createFixture();
    const internals = internalsOf(fixture);
    const row = viewRow('b');
    const first = internals.cellDetailId(row, 0);
    expect(first).toBe(internals.cellDetailId(row, 0));
    expect(first).toContain('b');
    expect(first).not.toBe(internals.cellDetailId(row, 1));
    expect(internals.cellDetailRowId(2)).toContain('2');
  });
});

describe('SolarisTableComponent selection flags', () => {
  it('should report selection flags only in multiple mode with visible rows', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.detectChanges();
    const internals = internalsOf(fixture);
    expect(internals.allVisibleRowsSelected()).toBe(false);
    expect(internals.someVisibleRowsSelected()).toBe(false);

    fixture.componentRef.setInput('selectionMode', 'multiple');
    fixture.detectChanges();
    expect(internals.allVisibleRowsSelected()).toBe(false);
    expect(internals.someVisibleRowsSelected()).toBe(false);

    fixture.componentRef.setInput('selectedRowIds', ['b']);
    fixture.detectChanges();
    expect(internals.allVisibleRowsSelected()).toBe(false);
    expect(internals.someVisibleRowsSelected()).toBe(true);

    fixture.componentRef.setInput('selectedRowIds', ['b', 'a']);
    fixture.detectChanges();
    expect(internals.allVisibleRowsSelected()).toBe(true);
    expect(internals.someVisibleRowsSelected()).toBe(false);
  });

  it('should report no selection flags without visible rows', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput('data', []);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.componentRef.setInput('selectionMode', 'multiple');
    fixture.detectChanges();
    const internals = internalsOf(fixture);
    expect(internals.allVisibleRowsSelected()).toBe(false);
    expect(internals.someVisibleRowsSelected()).toBe(false);
  });

  it('should keep an explicit checkbox column instead of injecting one', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', [
      { id: 'select', header: '', type: 'checkbox' },
      ...COLUMNS,
    ]);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.componentRef.setInput('selectionMode', 'multiple');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('thead solaris-checkbox').length).toBe(1);
  });
});

describe('SolarisTableComponent cell expansion', () => {
  it('should report no expanded cell columns outside cell expand mode', () => {
    const { fixture } = createFixture();
    const internals = internalsOf(fixture);
    const row = viewRow('b');
    const column = { id: 'name' } as SolarisTableViewColumn<Person>;
    expect(internals.expandedCellColumns(row)).toEqual([]);
    expect(internals.visibleCellColumns(row)).toEqual([]);
    expect(internals.isCellDetailRowOpen(row)).toBe(false);
    expect(internals.isCellExpanded(row, column)).toBe(false);
    internals.toggleCellExpanded(row, column);
    expect(internals.isCellExpanded(row, column)).toBe(false);
  });

  it('should open cell details on the next frames and collapse after the duration', () => {
    vi.useFakeTimers();
    const frames = stubAnimationFrames();
    try {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(CellDetailHostComponent);
      fixture.detectChanges();
      const element = fixture.nativeElement as HTMLElement;
      const button = element.querySelector(
        '.solaris-table__cell-expand',
      ) as HTMLButtonElement;
      button.click();
      fixture.detectChanges();
      expect(button.getAttribute('aria-expanded')).toBe('true');

      flushAnimationFrames(frames.queue);
      fixture.detectChanges();
      expect(
        element.querySelector('.solaris-table__row--cell-detail[data-open]'),
      ).toBeTruthy();

      button.click();
      fixture.detectChanges();
      expect(button.getAttribute('aria-expanded')).toBe('false');
      expect(
        element.querySelector('.solaris-table__row--cell-detail'),
      ).toBeTruthy();
      vi.advanceTimersByTime(DETAIL_COLLAPSE_DURATION_MS);
      fixture.detectChanges();
      expect(
        element.querySelector('.solaris-table__row--cell-detail'),
      ).toBeFalsy();
      fixture.destroy();
    } finally {
      frames.restore();
      vi.useRealTimers();
    }
  });

  it('should cancel a pending cell open and collapse immediately under reduced motion', () => {
    vi.useFakeTimers();
    const frames = stubAnimationFrames();
    const restoreMatchMedia = stubMatchMedia(() => true);
    try {
      const fixture = TestBed.createComponent(CellDetailHostComponent);
      fixture.detectChanges();
      const element = fixture.nativeElement as HTMLElement;
      const button = element.querySelector(
        '.solaris-table__cell-expand',
      ) as HTMLButtonElement;
      button.click();
      fixture.detectChanges();
      expect(frames.queue.size).toBeGreaterThan(0);

      button.click();
      fixture.detectChanges();
      expect(frames.cancelled.length).toBeGreaterThan(0);
      expect(frames.queue.size).toBe(0);
      vi.advanceTimersByTime(0);
      fixture.detectChanges();
      expect(
        element.querySelector('.solaris-table__row--cell-detail'),
      ).toBeFalsy();
      fixture.destroy();
    } finally {
      restoreMatchMedia();
      frames.restore();
      vi.useRealTimers();
    }
  });

  it('should keep the cell detail row while other cells stay expanded', () => {
    const frames = stubAnimationFrames();
    try {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
      fixture.componentRef.setInput('columns', [
        {
          id: 'name',
          header: 'Name',
          accessor: 'name',
          expandable: true,
          detailTemplateId: 'name-detail',
        },
        {
          id: 'age',
          header: 'Age',
          accessor: 'age',
          type: 'number',
          expandable: true,
          detailTemplateId: 'age-detail',
        },
      ]);
      fixture.componentRef.setInput('data', ROWS);
      fixture.componentRef.setInput('rowId', 'id');
      fixture.componentRef.setInput('expandable', true);
      fixture.componentRef.setInput('expandMode', 'cell');
      fixture.detectChanges();
      const internals = internalsOf(fixture);
      const row = internals.visibleRows()[0];
      const [nameColumn, ageColumn] = internals.userColumns();
      internals.toggleCellExpanded(row, nameColumn);
      internals.toggleCellExpanded(row, ageColumn);
      internals.toggleCellExpanded(row, nameColumn);
      fixture.detectChanges();
      expect(internals.isCellDetailRowVisible(row)).toBe(true);
      expect(
        internals.visibleCellColumns(row).map((column) => column.id),
      ).toEqual(['age']);
    } finally {
      frames.restore();
    }
  });

  it('should clear a pending cell collapse when expanding again', () => {
    vi.useFakeTimers();
    const frames = stubAnimationFrames();
    try {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(CellDetailHostComponent);
      fixture.detectChanges();
      const element = fixture.nativeElement as HTMLElement;
      const button = element.querySelector(
        '.solaris-table__cell-expand',
      ) as HTMLButtonElement;
      button.click();
      fixture.detectChanges();
      button.click();
      fixture.detectChanges();
      expect(
        element.querySelector('.solaris-table__row--cell-detail'),
      ).toBeTruthy();

      button.click();
      fixture.detectChanges();
      expect(button.getAttribute('aria-expanded')).toBe('true');
      vi.advanceTimersByTime(DETAIL_COLLAPSE_DURATION_MS);
      fixture.detectChanges();
      expect(
        element.querySelector('.solaris-table__row--cell-detail'),
      ).toBeTruthy();
      fixture.destroy();
    } finally {
      frames.restore();
      vi.useRealTimers();
    }
  });

  it('should open cell details synchronously outside the browser', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    });
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', [
      { id: 'name', header: 'Name', accessor: 'name' },
      {
        id: 'age',
        header: 'Age',
        accessor: 'age',
        type: 'number',
        expandable: true,
        detailTemplateId: 'age-detail',
      },
    ]);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.componentRef.setInput('expandable', true);
    fixture.componentRef.setInput('expandMode', 'cell');
    fixture.detectChanges();
    const internals = internalsOf(fixture);
    const row = internals.visibleRows()[0];
    const ageColumn = internals.userColumns()[1];
    internals.toggleCellExpanded(row, ageColumn);
    expect(internals.isCellExpanded(row, ageColumn)).toBe(true);
    expect(internals.openedCells().length).toBe(1);
  });
});

describe('SolarisTableComponent row expansion lifecycle', () => {
  it('should cancel a pending row open when collapsing before the frame runs', () => {
    vi.useFakeTimers();
    const frames = stubAnimationFrames();
    try {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
      fixture.componentRef.setInput('columns', [
        { id: 'name', header: 'Name', accessor: 'name' },
        { id: 'age', header: 'Age', accessor: 'age', priority: 2 },
      ]);
      fixture.componentRef.setInput('data', ROWS);
      fixture.componentRef.setInput('rowId', 'id');
      fixture.componentRef.setInput('expandable', true);
      fixture.detectChanges();
      const element = fixture.nativeElement as HTMLElement;
      const button = element.querySelector(
        '.solaris-table__expand-button',
      ) as HTMLButtonElement;
      button.click();
      fixture.detectChanges();
      expect(button.getAttribute('aria-expanded')).toBe('true');
      expect(frames.queue.size).toBeGreaterThan(0);

      button.click();
      fixture.detectChanges();
      expect(frames.cancelled.length).toBeGreaterThan(0);
      expect(button.getAttribute('aria-expanded')).toBe('false');
      expect(element.querySelector('.solaris-table__row--detail')).toBeTruthy();

      button.click();
      fixture.detectChanges();
      expect(button.getAttribute('aria-expanded')).toBe('true');
      flushAnimationFrames(frames.queue);
      fixture.detectChanges();

      button.click();
      fixture.detectChanges();
      vi.advanceTimersByTime(DETAIL_COLLAPSE_DURATION_MS);
      fixture.detectChanges();
      expect(element.querySelector('.solaris-table__row--detail')).toBeFalsy();
      fixture.destroy();
    } finally {
      frames.restore();
      vi.useRealTimers();
    }
  });
});

describe('SolarisTableComponent reduced motion', () => {
  it('should honor the OS reduced-motion preference', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.detectChanges();
    const internals = internalsOf(fixture);
    const doc = TestBed.inject(DOCUMENT);
    const view = doc.defaultView as unknown as {
      matchMedia(query: string): { matches: boolean } | undefined;
    };
    const original = view.matchMedia;
    expect(internals.prefersReducedMotion()).toBe(false);
    view.matchMedia = () => ({ matches: true });
    expect(internals.prefersReducedMotion()).toBe(true);
    view.matchMedia = undefined as unknown as typeof original;
    expect(internals.prefersReducedMotion()).toBe(false);
    view.matchMedia = original;
  });

  it('should track the narrow viewport through matchMedia', () => {
    const restoreMatchMedia = stubMatchMedia(
      (query) => query === '(max-width: 720px)',
    );
    try {
      const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
      fixture.componentRef.setInput('columns', COLUMNS);
      fixture.componentRef.setInput('data', ROWS);
      fixture.componentRef.setInput('rowId', 'id');
      fixture.componentRef.setInput('expandable', true);
      fixture.detectChanges();
      const element = fixture.nativeElement as HTMLElement;
      expect(element.querySelector('table')).toBeFalsy();
      fixture.destroy();
    } finally {
      restoreMatchMedia();
    }
  });
});

describe('SolarisTableComponent date cells', () => {
  interface DatedRow {
    id: string;
    hired: unknown;
  }

  const DATE_COLUMNS: readonly SolarisTableColumn<DatedRow>[] = [
    { id: 'hired', header: 'Hired', accessor: 'hired', type: 'date' },
  ];

  function createDateFixture(rows: readonly DatedRow[]) {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<DatedRow>);
    fixture.componentRef.setInput('columns', DATE_COLUMNS);
    fixture.componentRef.setInput('data', rows);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.detectChanges();
    return {
      fixture,
      element: fixture.nativeElement as HTMLElement,
    };
  }

  it('should format date cells with the locale medium date', () => {
    const { element } = createDateFixture([
      { id: 'a', hired: new Date(2026, 2, 4) },
    ]);
    expect(
      element
        .querySelector(
          'tbody tr.solaris-table__row .solaris-table__cell[data-column-id="hired"]',
        )
        ?.textContent?.trim(),
    ).toBe('Mar 4, 2026');
  });

  it('should fall back to raw text when a date value cannot be formatted', () => {
    const { element } = createDateFixture([{ id: 'a', hired: 'not-a-date' }]);
    expect(
      element
        .querySelector(
          'tbody tr.solaris-table__row .solaris-table__cell[data-column-id="hired"]',
        )
        ?.textContent?.trim(),
    ).toBe('not-a-date');
  });
});

describe('SolarisTableComponent sticky group headers', () => {
  it('should pin trailing group headers when stickyLastColumn is true', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', [
      { id: 'name', header: 'Name', accessor: 'name' },
      {
        id: 'age',
        header: 'Age',
        accessor: 'age',
        type: 'number',
        headerGroup: 'metrics',
      },
    ]);
    fixture.componentRef.setInput('headerGroups', [
      { id: 'metrics', header: 'Metrics' },
    ]);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.componentRef.setInput('stickyLastColumn', true);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(
      element
        .querySelector('th[scope="colgroup"]')
        ?.getAttribute('data-sticky'),
    ).toBe('end');
  });

  it('should pin leading grouped headers with the sticky first columns', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', [
      {
        id: 'name',
        header: 'Name',
        accessor: 'name',
        headerGroup: 'identity',
      },
      { id: 'age', header: 'Age', accessor: 'age', type: 'number' },
    ]);
    fixture.componentRef.setInput('headerGroups', [
      { id: 'identity', header: 'Identity' },
    ]);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.componentRef.setInput('selectionMode', 'multiple');
    fixture.componentRef.setInput('stickyFirstColumn', true);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(
      element
        .querySelector('th[scope="colgroup"]')
        ?.getAttribute('data-sticky'),
    ).toBe('start');
  });
});

describe('SolarisTableComponent editing and action guards', () => {
  function createEditableFixture() {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', [
      {
        id: 'name',
        header: 'Name',
        accessor: 'name',
        editorTemplateId: 'name-editor',
      },
      { id: 'age', header: 'Age', accessor: 'age', type: 'number' },
    ]);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.detectChanges();
    return fixture;
  }

  it('should ignore edit requests from interactive targets', () => {
    const fixture = createEditableFixture();
    const internals = internalsOf(fixture);
    const row = internals.visibleRows()[0];
    const nameColumn = internals.userColumns()[0];
    internals.startEditing(row, nameColumn, {
      target: { closest: (): boolean => true },
    } as unknown as Event);
    expect(internals.isEditingCell(row, nameColumn)).toBe(false);
  });

  it('should ignore stopEditing and resolveEditorTemplate without an editor', () => {
    const fixture = createEditableFixture();
    const internals = internalsOf(fixture);
    const row = internals.visibleRows()[0];
    const ageColumn = internals.userColumns()[1];
    const ended: unknown[] = [];
    fixture.componentInstance.editEnd.subscribe((event) => ended.push(event));
    expect(internals.resolveEditorTemplate(ageColumn)).toBe(null);
    internals.stopEditing(row, ageColumn);
    expect(ended).toEqual([]);
  });

  it('should ignore sort toggles on non-sortable columns', () => {
    const { fixture } = createFixture();
    const internals = internalsOf(fixture);
    internals.toggleSort({ id: 'name' } as SolarisTableViewColumn<Person>);
    expect(fixture.componentInstance.sort()).toBe(null);
  });

  it('should not emit addRowRequest while loading', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.componentRef.setInput('showAddRow', true);
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    const internals = internalsOf(fixture);
    let emitted = 0;
    fixture.componentInstance.addRowRequest.subscribe(() => {
      emitted += 1;
    });
    internals.handleAddRow();
    expect(emitted).toBe(0);
  });
});

describe('SolarisTableComponent card titles', () => {
  it('should render custom card titles and subtitles', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.componentRef.setInput('expandable', true);
    fixture.componentRef.setInput('mobile', true);
    fixture.componentRef.setInput('cardTitleOf', (row: Person) => row.name);
    fixture.componentRef.setInput(
      'cardSubtitleOf',
      (row: Person) => `${row.age} years`,
    );
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(
      element.querySelector('.solaris-table__card-title')?.textContent,
    ).toContain('Beto');
    expect(
      element.querySelector('.solaris-table__card-subtitle')?.textContent,
    ).toContain('30 years');
  });

  it('should ignore blank custom card titles and subtitles', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.componentRef.setInput('expandable', true);
    fixture.componentRef.setInput('mobile', true);
    fixture.componentRef.setInput('cardTitleOf', () => '   ');
    fixture.componentRef.setInput('cardSubtitleOf', () => null);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.solaris-table__card-title')).toBeFalsy();
    expect(element.querySelector('.solaris-table__card-subtitle')).toBeFalsy();
  });
});
