import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SolarisTableComponent } from '../component/table.component';
import {
  SolarisTableCellDirective,
  SolarisTableDetailDirective,
  SolarisTableEmptyDirective,
  SolarisTableHeaderDirective,
} from '../directives/table-cell.directive';
import type { SolarisTableColumn } from '../model/table.types';

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

  it('should sort from card labels in mobile layout', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableComponent<Person>);
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.componentRef.setInput('expandable', true);
    fixture.componentRef.setInput('mobile', true);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    (
      element.querySelectorAll(
        '.solaris-table__card-sort',
      )[0] as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.sort()).toEqual({
      columnId: 'name',
      direction: 'asc',
    });
    const firstValue = element.querySelector(
      '.solaris-table__card .solaris-table__card-value',
    );
    expect(firstValue?.textContent?.trim()).toBe('Ana');
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
