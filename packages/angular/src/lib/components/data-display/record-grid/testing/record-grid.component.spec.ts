import { TestBed } from '@angular/core/testing';
import type { ComponentFixture } from '@angular/core/testing';

import { SolarisRecordGridComponent } from '../component/record-grid.component';
import type {
  SolarisRecordGridColumn,
  SolarisRecordGridCommit,
} from '../model/record-grid.types';

interface FixtureRow {
  id: string;
  section: string;
  student: string;
  present: number | null;
  project: number | null;
}

const COLUMNS: readonly SolarisRecordGridColumn<FixtureRow>[] = [
  { id: 'student', header: 'Student', accessor: 'student', sortable: true },
  {
    id: 'present',
    header: 'Present',
    accessor: 'present',
    type: 'number',
    sortable: true,
  },
  {
    id: 'project',
    header: 'Project',
    accessor: 'project',
    type: 'number',
    sortable: true,
  },
  {
    id: 'total',
    header: 'Total',
    type: 'number',
    computed: { from: ['present', 'project'], by: 'sum' },
  },
];

const ROWS: readonly FixtureRow[] = [
  { id: 'a', section: 'morning', student: 'Ada', present: 8, project: 7 },
  { id: 'b', section: 'morning', student: 'Grace', present: null, project: 9 },
  { id: 'c', section: 'evening', student: 'Alan', present: 5, project: 5 },
];

function createFixture(overrides: Record<string, unknown> = {}): {
  fixture: ComponentFixture<SolarisRecordGridComponent<FixtureRow>>;
  element: HTMLElement;
} {
  TestBed.configureTestingModule({});
  const fixture = TestBed.createComponent(
    SolarisRecordGridComponent<FixtureRow>,
  );
  fixture.componentRef.setInput('columns', COLUMNS);
  fixture.componentRef.setInput('data', ROWS);
  fixture.componentRef.setInput('rowId', 'id');
  for (const [key, value] of Object.entries(overrides)) {
    fixture.componentRef.setInput(key, value);
  }
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement };
}

function bodyRows(element: HTMLElement): HTMLElement[] {
  return Array.from(
    element.querySelectorAll('tbody tr.solaris-record-grid__row'),
  ) as HTMLElement[];
}

function cellText(row: HTMLElement, columnId: string): string | null {
  return (
    row
      .querySelector(`td[data-column-id="${columnId}"]`)
      ?.textContent?.trim() ?? null
  );
}

describe('SolarisRecordGridComponent', () => {
  it('should render as a grid with resolved formula cells', () => {
    const { element } = createFixture();
    const rows = bodyRows(element);
    expect(rows.length).toBe(3);
    expect(cellText(rows[0] as HTMLElement, 'total')).toBe('15');
    expect(cellText(rows[1] as HTMLElement, 'total')).toBe('9');
  });

  it('should render empty placeholders for null values', () => {
    const { element } = createFixture();
    const rows = bodyRows(element);
    expect(cellText(rows[1] as HTMLElement, 'present')).toBe('—');
  });

  it('should sort with nulls last', () => {
    const { fixture, element } = createFixture();
    fixture.componentRef.setInput('sort', {
      columnId: 'present',
      direction: 'asc',
    });
    fixture.detectChanges();
    const rows = bodyRows(element);
    expect(
      rows.map((row) =>
        row.querySelector('td[data-column-id="student"]')?.textContent?.trim(),
      ),
    ).toEqual(['Alan', 'Ada', 'Grace']);
  });

  it('should merge rowspan origins and skip covered cells', () => {
    const columns: readonly SolarisRecordGridColumn<FixtureRow>[] = [
      {
        id: 'section',
        header: 'Section',
        accessor: 'section',
        rowspanOf: (_row, index) => (index === 0 ? 2 : 1),
      },
      ...COLUMNS,
    ];
    const { element } = createFixture({ columns });
    const rows = bodyRows(element);
    expect(
      rows[0]
        ?.querySelector('td[data-column-id="section"]')
        ?.getAttribute('rowspan'),
    ).toBe('2');
    expect(rows[1]?.querySelector('td[data-column-id="section"]')).toBeNull();
    expect(
      rows[2]?.querySelector('td[data-column-id="section"]'),
    ).not.toBeNull();
  });

  it('should render section dividers and group footers', () => {
    const columns: readonly SolarisRecordGridColumn<FixtureRow>[] = COLUMNS.map(
      (column) =>
        column.id === 'present'
          ? {
              ...column,
              sectionId: 'morning',
              footerValueOf: (rows: readonly FixtureRow[]) =>
                `Count ${rows.length}`,
            }
          : column,
    );
    const { element } = createFixture({
      columns,
      sections: [
        { id: 'morning', header: 'Morning shift' },
        { id: 'evening', header: 'Evening shift' },
      ],
      sectionOf: (row: FixtureRow) => row.section,
    });
    const dividers = element.querySelectorAll(
      'tr.solaris-record-grid__section-row th[scope="rowgroup"]',
    );
    expect(dividers.length).toBe(2);
    expect(dividers[0]?.textContent?.trim()).toBe('Morning shift');
    const footRows = element.querySelectorAll(
      'tfoot tr.solaris-record-grid__foot-row',
    );
    expect(footRows.length).toBe(3);
    expect(footRows[0]?.textContent).toContain('Count 2');
  });

  it('should keep aria indexes continuous across merged cells', () => {
    const columns: readonly SolarisRecordGridColumn<FixtureRow>[] = [
      {
        id: 'section',
        header: 'Section',
        accessor: 'section',
        rowspanOf: (_row, index) => (index === 0 ? 2 : 1),
      },
      ...COLUMNS,
    ];
    const { element } = createFixture({ columns });
    const rows = bodyRows(element);
    expect(rows[0]?.getAttribute('aria-rowindex')).toBe('2');
    const firstCells = Array.from(
      rows[1]?.querySelectorAll('td[data-column-id]') ?? [],
    ) as HTMLElement[];
    expect(
      firstCells.map((cell) => cell.getAttribute('aria-colindex')),
    ).toEqual(['2', '3', '4', '5']);
  });

  it('should open the editor and commit a diff on change', () => {
    const { fixture, element } = createFixture();
    const commits: SolarisRecordGridCommit<FixtureRow>[] = [];
    fixture.componentInstance.recordCommit.subscribe((commit) =>
      commits.push(commit),
    );
    const cell = element.querySelector(
      'tbody tr.solaris-record-grid__row td[data-column-id="present"] button.solaris-record-grid__cell-button',
    ) as HTMLButtonElement;
    expect(cell).not.toBeNull();
    cell.click();
    fixture.detectChanges();
    const input = element.querySelector(
      'input.solaris-record-grid__editor',
    ) as HTMLInputElement;
    expect(input).not.toBeNull();
    input.value = '9';
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(commits.length).toBe(1);
    expect(commits[0]?.previousValue).toBe(8);
    expect(commits[0]?.value).toBe(9);
    expect(commits[0]?.columnId).toBe('present');
    expect(commits[0]?.rowId).toBe('a');
    expect(typeof commits[0]?.at).toBe('string');
    expect(
      element.querySelector('input.solaris-record-grid__editor'),
    ).toBeNull();
    const rows = bodyRows(element);
    expect(cellText(rows[0] as HTMLElement, 'present')).toBe('9');
    expect(cellText(rows[0] as HTMLElement, 'total')).toBe('16');
  });

  it('should block invalid commits and keep the draft open', () => {
    const columns: readonly SolarisRecordGridColumn<FixtureRow>[] = COLUMNS.map(
      (column) =>
        column.id === 'present'
          ? {
              ...column,
              validateOf: (
                _row: FixtureRow,
                _columnId: string,
                value: unknown,
              ) =>
                typeof value === 'number' && value >= 0 && value <= 10
                  ? null
                  : 'Enter a value between 0 and 10',
            }
          : column,
    );
    const { fixture, element } = createFixture({ columns });
    const commits: SolarisRecordGridCommit<FixtureRow>[] = [];
    fixture.componentInstance.recordCommit.subscribe((commit) =>
      commits.push(commit),
    );
    const cell = element.querySelector(
      'tbody tr.solaris-record-grid__row td[data-column-id="present"] button.solaris-record-grid__cell-button',
    ) as HTMLButtonElement;
    cell.click();
    fixture.detectChanges();
    const input = element.querySelector(
      'input.solaris-record-grid__editor',
    ) as HTMLInputElement;
    input.value = '99';
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(commits.length).toBe(0);
    expect(
      element.querySelector('input.solaris-record-grid__editor'),
    ).not.toBeNull();
    const error = element.querySelector('.solaris-record-grid__cell-error');
    expect(error?.textContent?.trim()).toBe('Enter a value between 0 and 10');
    expect(error?.getAttribute('role')).toBe('alert');
  });

  it('should not open editors for computed, readonly, or disabled cells', () => {
    const { element } = createFixture({ readonly: true });
    const computedCell = element.querySelector(
      'tbody tr.solaris-record-grid__row td[data-column-id="total"]',
    );
    expect(
      computedCell?.querySelector('button.solaris-record-grid__cell-button'),
    ).toBeNull();
    expect(
      element.querySelector('td[data-column-id="present"] button'),
    ).toBeNull();
  });

  it('should discard the draft on escape', () => {
    const { fixture, element } = createFixture();
    const cell = element.querySelector(
      'tbody tr.solaris-record-grid__row td[data-column-id="present"] button.solaris-record-grid__cell-button',
    ) as HTMLButtonElement;
    cell.click();
    fixture.detectChanges();
    expect(
      element.querySelector('input.solaris-record-grid__editor'),
    ).not.toBeNull();
    const input = element.querySelector(
      'input.solaris-record-grid__editor',
    ) as HTMLInputElement;
    input.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    fixture.detectChanges();
    expect(
      element.querySelector('input.solaris-record-grid__editor'),
    ).toBeNull();
  });

  it('should select rows in multiple mode with a tri-state header', () => {
    const { fixture, element } = createFixture({ selectionMode: 'multiple' });
    fixture.detectChanges();
    const firstRowCheckbox = element.querySelector(
      'tbody tr.solaris-record-grid__row solaris-checkbox input',
    ) as HTMLInputElement;
    firstRowCheckbox.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedRowIds()).toEqual(['a']);
  });

  it('should announce loading text while loading', () => {
    const { element } = createFixture({ loading: true });
    expect(element.textContent).toContain('Loading records');
  });

  it('should reflect striped mode and cell padding on the host', () => {
    const { fixture, element } = createFixture({
      striped: true,
      stripedMode: 'odd',
      cellPadding: 'lg',
    });
    fixture.detectChanges();
    expect(element.getAttribute('data-striped')).toBe('true');
    expect(element.getAttribute('data-striped-mode')).toBe('odd');
    expect(element.getAttribute('data-cell-padding')).toBe('lg');
  });
});
