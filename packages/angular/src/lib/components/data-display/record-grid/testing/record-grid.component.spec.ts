import { TestBed } from '@angular/core/testing';
import type { ComponentFixture } from '@angular/core/testing';

import { configureSolarisTesting } from '../../../../testing/solaris-test-utilities';
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

  it('should expose cell text as title and omit it for empty cells', () => {
    const { element } = createFixture();
    const rows = bodyRows(element);
    const total = rows[0]?.querySelector(
      'td[data-column-id="total"] .solaris-record-grid__cell-text',
    );
    expect(total?.getAttribute('title')).toBe('15');
    const empty = rows[1]?.querySelector(
      'td[data-column-id="present"] .solaris-record-grid__cell-button',
    );
    expect(empty?.getAttribute('title')).toBeNull();
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

  it('should show the error state from errorKey alone', () => {
    const { element } = createFixture({
      errorKey: 'solaris.dataDisplay.recordGrid.errorText',
    });
    const alert = element.querySelector(
      '.solaris-record-grid__state[role="alert"]',
    );
    expect(alert).not.toBeNull();
    expect(
      element.querySelector('table.solaris-record-grid__table'),
    ).toBeNull();
  });

  it('should hide the empty state while a resolved error is shown', () => {
    const { element } = createFixture({ error: 'Backend exploded' });
    expect(
      element.querySelector('.solaris-record-grid__state[role="alert"]'),
    ).not.toBeNull();
    expect(element.textContent).toContain('Backend exploded');
    expect(
      element.querySelector('table.solaris-record-grid__table'),
    ).toBeNull();
  });

  it('should render a functional select-all checkbox with header groups', () => {
    const grouped = COLUMNS.map((column) =>
      column.id === 'present' || column.id === 'project'
        ? { ...column, headerGroup: 'scores' }
        : column,
    );
    const { fixture, element } = createFixture({
      columns: grouped,
      selectionMode: 'multiple',
      headerGroups: [{ id: 'scores', header: 'Scores' }],
    });
    fixture.detectChanges();
    const selectAll = element.querySelector(
      'thead tr.solaris-record-grid__head-row--group th[rowspan="2"] solaris-checkbox input',
    ) as HTMLInputElement | null;
    expect(selectAll).not.toBeNull();
    selectAll?.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedRowIds()).toEqual(['a', 'b', 'c']);
  });

  it('should omit aria-sort on non-sortable columns', () => {
    const columns: readonly SolarisRecordGridColumn<FixtureRow>[] = [
      { id: 'student', header: 'Student', accessor: 'student' },
      ...COLUMNS.slice(1),
    ];
    const { element } = createFixture({ columns });
    const header = element.querySelector('thead th[data-column-id="student"]');
    expect(header?.getAttribute('aria-sort')).toBeNull();
  });

  it('should keep aria-colindex continuous on the grouped second header row', () => {
    const grouped = COLUMNS.map((column) =>
      column.id === 'present' || column.id === 'project'
        ? { ...column, headerGroup: 'scores' }
        : column,
    );
    const { element } = createFixture({
      columns: grouped,
      selectionMode: 'multiple',
      headerGroups: [{ id: 'scores', header: 'Scores' }],
    });
    const secondRow = element.querySelectorAll(
      'thead tr.solaris-record-grid__head-row',
    )[1];
    const cells = Array.from(
      secondRow?.querySelectorAll('th[data-column-id]') ?? [],
    ) as HTMLElement[];
    expect(cells.length).toBe(2);
    const indexes = cells.map((cell) => cell.getAttribute('aria-colindex'));
    expect(indexes).toEqual(['3', '4']);
    expect(new Set(indexes).size).toBe(cells.length);
  });

  it('should not report select-all states in single mode with a prefilled model', () => {
    const { fixture } = createFixture({
      selectionMode: 'single',
      selectedRowIds: ['a'],
    });
    fixture.detectChanges();
    const instance = fixture.componentInstance as unknown as {
      allVisibleRowsSelected: () => boolean;
      someVisibleRowsSelected: () => boolean;
    };
    expect(instance.allVisibleRowsSelected()).toBe(false);
    expect(instance.someVisibleRowsSelected()).toBe(false);
  });

  it('should keep the first data column sticky when selection is enabled', () => {
    const { element } = createFixture({
      selectionMode: 'multiple',
      stickyFirstColumn: true,
    });
    const header = element.querySelector('thead th[data-column-id="student"]');
    expect(header?.getAttribute('data-sticky')).toBe('start');
  });

  it('should collapse table borders into single lines', () => {
    const { element } = createFixture();
    const table = element.querySelector(
      'table.solaris-record-grid__table',
    ) as HTMLElement;
    expect(getComputedStyle(table).borderCollapse).toBe('collapse');
  });

  // NOTE: getComputedStyle-heavy; needs headroom under v8 coverage load.
  it('should keep editor text aligned with its cell', () => {
    const columns: readonly SolarisRecordGridColumn<FixtureRow>[] = COLUMNS.map(
      (column) =>
        column.id === 'present' ? { ...column, align: 'end' as const } : column,
    );
    const { fixture, element } = createFixture({ columns });
    const cell = element.querySelector(
      'tbody tr.solaris-record-grid__row td[data-column-id="present"] button.solaris-record-grid__cell-button',
    ) as HTMLButtonElement;
    cell.click();
    fixture.detectChanges();
    const input = element.querySelector(
      'input.solaris-record-grid__editor',
    ) as HTMLInputElement;
    const td = element.querySelector(
      'tbody tr.solaris-record-grid__row td[data-column-id="present"]',
    ) as HTMLElement;
    expect(input).not.toBeNull();
    expect(getComputedStyle(td).textAlign).toBe('end');
    expect(getComputedStyle(input).textAlign).toBe('inherit');
  }, 15000);

  it('should not open editors on rowspan origins', () => {
    const columns: readonly SolarisRecordGridColumn<FixtureRow>[] = [
      {
        id: 'section',
        header: 'Section',
        accessor: 'section',
        rowspanOf: (_row, index) => (index === 0 ? 2 : 1),
      },
      ...COLUMNS,
    ];
    const { fixture, element } = createFixture({ columns });
    const origin = element.querySelector(
      'tbody tr.solaris-record-grid__row td[data-column-id="section"]',
    ) as HTMLElement | null;
    expect(origin).not.toBeNull();
    expect(
      origin?.querySelector('button.solaris-record-grid__cell-button'),
    ).toBeNull();
    origin?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    fixture.detectChanges();
    expect(
      element.querySelector('input.solaris-record-grid__editor'),
    ).toBeNull();
  });

  it('should not open editors on colspan origins', () => {
    const columns: readonly SolarisRecordGridColumn<FixtureRow>[] = COLUMNS.map(
      (column) =>
        column.id === 'student' ? { ...column, colspanOf: () => 2 } : column,
    );
    const { fixture, element } = createFixture({ columns });
    const origin = element.querySelector(
      'tbody tr.solaris-record-grid__row td[data-column-id="student"]',
    ) as HTMLElement | null;
    expect(origin).not.toBeNull();
    expect(origin?.getAttribute('colspan')).toBe('2');
    expect(
      origin?.querySelector('button.solaris-record-grid__cell-button'),
    ).toBeNull();
    origin?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    fixture.detectChanges();
    expect(
      element.querySelector('input.solaris-record-grid__editor'),
    ).toBeNull();
  });

  it('should render draftbar actions with solaris-button aligned to the end', () => {
    const { fixture, element } = createFixture();
    const cell = element.querySelector(
      'tbody tr.solaris-record-grid__row td[data-column-id="present"] button.solaris-record-grid__cell-button',
    ) as HTMLButtonElement;
    cell.click();
    fixture.detectChanges();
    const bar = element.querySelector(
      '.solaris-record-grid__draftbar',
    ) as HTMLElement;
    expect(bar).not.toBeNull();
    expect(getComputedStyle(bar).justifyContent).toBe('flex-end');
    expect(bar.querySelectorAll('button[solaris-button]').length).toBe(2);
  });
});

describe('SolarisRecordGridComponent coverage: cell text', () => {
  function createCoverageFixture(
    overrides: Record<string, unknown> = {},
  ): ReturnType<typeof createFixture> {
    configureSolarisTesting();
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

  function firstRowCells(element: HTMLElement): {
    rows: HTMLElement[];
    presentButton: HTMLButtonElement | null;
  } {
    const rows = bodyRows(element);
    const presentButton = rows[0]?.querySelector(
      'td[data-column-id="present"] button.solaris-record-grid__cell-button',
    ) as HTMLButtonElement | null;
    return { rows, presentButton };
  }

  it('should prefer a trimmed displayValueOf for text and title', () => {
    const columns: readonly SolarisRecordGridColumn<FixtureRow>[] = COLUMNS.map(
      (column) =>
        column.id === 'student'
          ? { ...column, displayValueOf: () => '  Top student  ' }
          : column,
    );
    const { element } = createCoverageFixture({ columns });
    const rows = bodyRows(element);
    const button = rows[0]?.querySelector(
      'td[data-column-id="student"] button.solaris-record-grid__cell-button',
    );
    expect(button?.textContent?.trim()).toBe('Top student');
    expect(button?.getAttribute('title')).toBe('Top student');
  });

  it('should fall back to the value when displayValueOf is blank', () => {
    const columns: readonly SolarisRecordGridColumn<FixtureRow>[] = COLUMNS.map(
      (column) =>
        column.id === 'student'
          ? { ...column, displayValueOf: () => '   ' }
          : column,
    );
    const { element } = createCoverageFixture({ columns });
    const rows = bodyRows(element);
    expect(cellText(rows[0] as HTMLElement, 'student')).toBe('Ada');
  });

  it('should render a placeholder for non-finite numbers', () => {
    const { element } = createCoverageFixture({
      data: [
        {
          id: 'a',
          section: 'morning',
          student: 'Ada',
          present: NaN,
          project: 7,
        },
        ROWS[1],
        ROWS[2],
      ],
    });
    const { rows, presentButton } = firstRowCells(element);
    expect(cellText(rows[0] as HTMLElement, 'present')).toBe('—');
    expect(presentButton?.getAttribute('title')).toBeNull();
  });

  it('should render a placeholder for empty string values', () => {
    const { element } = createCoverageFixture({
      data: [
        { id: 'a', section: 'morning', student: '', present: 8, project: 7 },
      ],
    });
    const rows = bodyRows(element);
    expect(cellText(rows[0] as HTMLElement, 'student')).toBe('—');
  });
});

describe('SolarisRecordGridComponent coverage: sorting', () => {
  function createCoverageFixture(
    overrides: Record<string, unknown> = {},
  ): ReturnType<typeof createFixture> {
    configureSolarisTesting();
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

  function sortButton(
    element: HTMLElement,
    columnId: string,
  ): HTMLButtonElement {
    return element.querySelector(
      `th[data-column-id="${columnId}"] button.solaris-record-grid__sort-button`,
    ) as HTMLButtonElement;
  }

  function announcement(element: HTMLElement): string {
    return (
      element
        .querySelector('.solaris-record-grid__announcement')
        ?.textContent?.trim() ?? ''
    );
  }

  function studentOrder(element: HTMLElement): (string | null | undefined)[] {
    return bodyRows(element).map((row) =>
      row.querySelector('td[data-column-id="student"]')?.textContent?.trim(),
    );
  }

  it('should cycle sort asc, desc, then cleared with announcements', () => {
    const { fixture, element } = createCoverageFixture();
    sortButton(element, 'student').click();
    fixture.detectChanges();
    expect(fixture.componentInstance.sort()).toEqual({
      columnId: 'student',
      direction: 'asc',
    });
    expect(announcement(element)).toContain('Sorted by Student asc');
    sortButton(element, 'student').click();
    fixture.detectChanges();
    expect(fixture.componentInstance.sort()).toEqual({
      columnId: 'student',
      direction: 'desc',
    });
    expect(announcement(element)).toContain('Sorted by Student desc');
    sortButton(element, 'student').click();
    fixture.detectChanges();
    expect(fixture.componentInstance.sort()).toBeNull();
    expect(announcement(element)).toContain('sorting cleared');
  });

  it('should expose ascending and descending aria-sort states', () => {
    const { fixture, element } = createCoverageFixture();
    const header = element.querySelector('thead th[data-column-id="present"]');
    expect(header?.getAttribute('aria-sort')).toBe('none');
    fixture.componentRef.setInput('sort', {
      columnId: 'present',
      direction: 'asc',
    });
    fixture.detectChanges();
    expect(header?.getAttribute('aria-sort')).toBe('ascending');
    fixture.componentRef.setInput('sort', {
      columnId: 'present',
      direction: 'desc',
    });
    fixture.detectChanges();
    expect(header?.getAttribute('aria-sort')).toBe('descending');
  });

  it('should label sort buttons for the next direction', () => {
    const { fixture, element } = createCoverageFixture();
    expect(sortButton(element, 'student').getAttribute('aria-label')).toContain(
      'ascending',
    );
    fixture.componentRef.setInput('sort', {
      columnId: 'student',
      direction: 'asc',
    });
    fixture.detectChanges();
    expect(sortButton(element, 'student').getAttribute('aria-label')).toContain(
      'descending',
    );
    fixture.componentRef.setInput('sort', {
      columnId: 'student',
      direction: 'desc',
    });
    fixture.detectChanges();
    expect(sortButton(element, 'student').getAttribute('aria-label')).toContain(
      'Clear sorting',
    );
  });

  it('should ignore sort input for a non-sortable column', () => {
    const columns: readonly SolarisRecordGridColumn<FixtureRow>[] = [
      { id: 'student', header: 'Student', accessor: 'student' },
      ...COLUMNS.slice(1),
    ];
    const { fixture, element } = createCoverageFixture({ columns });
    fixture.componentRef.setInput('sort', {
      columnId: 'student',
      direction: 'asc',
    });
    fixture.detectChanges();
    expect(studentOrder(element)).toEqual(['Ada', 'Grace', 'Alan']);
  });

  it('should sort by a custom sortValueOf', () => {
    const columns: readonly SolarisRecordGridColumn<FixtureRow>[] = COLUMNS.map(
      (column) =>
        column.id === 'student'
          ? { ...column, sortValueOf: (row: FixtureRow) => row.student.length }
          : column,
    );
    const { fixture, element } = createCoverageFixture({ columns });
    fixture.componentRef.setInput('sort', {
      columnId: 'student',
      direction: 'asc',
    });
    fixture.detectChanges();
    expect(studentOrder(element)).toEqual(['Ada', 'Alan', 'Grace']);
  });

  it('should not toggle sort from a non-sortable header', () => {
    const columns: readonly SolarisRecordGridColumn<FixtureRow>[] = [
      { id: 'student', header: 'Student', accessor: 'student' },
      ...COLUMNS.slice(1),
    ];
    const { fixture, element } = createCoverageFixture({ columns });
    expect(
      element.querySelector(
        'th[data-column-id="student"] button.solaris-record-grid__sort-button',
      ),
    ).toBeNull();
    expect(fixture.componentInstance.sort()).toBeNull();
  });
});

describe('SolarisRecordGridComponent coverage: selection', () => {
  function createCoverageFixture(
    overrides: Record<string, unknown> = {},
  ): ReturnType<typeof createFixture> {
    configureSolarisTesting();
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

  function rowCheckbox(element: HTMLElement, index: number): HTMLInputElement {
    const rows = bodyRows(element);
    return rows[index]?.querySelector(
      'solaris-checkbox input',
    ) as HTMLInputElement;
  }

  function headerCheckbox(element: HTMLElement): HTMLInputElement | null {
    return element.querySelector(
      'thead solaris-checkbox input',
    ) as HTMLInputElement | null;
  }

  it('should select and deselect a row in single mode with change events', () => {
    const { fixture, element } = createCoverageFixture({
      selectionMode: 'single',
    });
    const emitted: {
      selectedRowIds: readonly string[];
      changedRowId?: string;
    }[] = [];
    fixture.componentInstance.selectionChange.subscribe((change) =>
      emitted.push({
        selectedRowIds: change.selectedRowIds,
        changedRowId: change.changedRowId,
      }),
    );
    rowCheckbox(element, 0).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedRowIds()).toEqual(['a']);
    expect(emitted[0]).toEqual({ selectedRowIds: ['a'], changedRowId: 'a' });
    rowCheckbox(element, 0).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedRowIds()).toEqual([]);
    expect(emitted[1]).toEqual({ selectedRowIds: [], changedRowId: 'a' });
  });

  it('should switch rows in single mode when another row is picked', () => {
    const { fixture, element } = createCoverageFixture({
      selectionMode: 'single',
    });
    rowCheckbox(element, 0).click();
    fixture.detectChanges();
    rowCheckbox(element, 1).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedRowIds()).toEqual(['b']);
  });

  it('should remove a row when toggled off in multiple mode', () => {
    const { fixture, element } = createCoverageFixture({
      selectionMode: 'multiple',
      selectedRowIds: ['a', 'b'],
    });
    rowCheckbox(element, 0).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedRowIds()).toEqual(['b']);
  });

  it('should report a partial selection as indeterminate', () => {
    const { fixture } = createCoverageFixture({
      selectionMode: 'multiple',
      selectedRowIds: ['a'],
    });
    fixture.detectChanges();
    const instance = fixture.componentInstance as unknown as {
      allVisibleRowsSelected: () => boolean;
      someVisibleRowsSelected: () => boolean;
    };
    expect(instance.allVisibleRowsSelected()).toBe(false);
    expect(instance.someVisibleRowsSelected()).toBe(true);
  });

  it('should deselect all visible rows when select-all is toggled off', () => {
    const { fixture, element } = createCoverageFixture({
      selectionMode: 'multiple',
      selectedRowIds: ['a', 'b', 'c'],
    });
    headerCheckbox(element)?.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedRowIds()).toEqual([]);
  });

  it('should emit selected rows when select-all is used', () => {
    const { fixture, element } = createCoverageFixture({
      selectionMode: 'multiple',
    });
    let selectedCount = 0;
    fixture.componentInstance.selectionChange.subscribe(
      (change) => (selectedCount = change.selectedRows.length),
    );
    headerCheckbox(element)?.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedRowIds()).toEqual(['a', 'b', 'c']);
    expect(selectedCount).toBe(3);
  });

  it('should render no row checkboxes when selection is disabled', () => {
    const { element } = createCoverageFixture({ selectionMode: 'none' });
    expect(element.querySelector('tbody solaris-checkbox')).toBeNull();
    expect(element.querySelector('thead solaris-checkbox')).toBeNull();
  });

  it('should label row selection checkboxes with the row id', () => {
    const { element } = createCoverageFixture({ selectionMode: 'multiple' });
    const input = element.querySelector(
      'tbody tr.solaris-record-grid__row solaris-checkbox input',
    );
    expect(input?.getAttribute('aria-label')).toContain('a');
  });
});

describe('SolarisRecordGridComponent coverage: drafts', () => {
  function createCoverageFixture(
    overrides: Record<string, unknown> = {},
  ): ReturnType<typeof createFixture> {
    configureSolarisTesting();
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

  function openPresentEditor(
    fixture: ReturnType<typeof createFixture>['fixture'],
    element: HTMLElement,
  ): HTMLInputElement | null {
    const cell = element.querySelector(
      'tbody tr.solaris-record-grid__row td[data-column-id="present"] button.solaris-record-grid__cell-button',
    ) as HTMLButtonElement;
    cell.click();
    fixture.detectChanges();
    return element.querySelector(
      'input.solaris-record-grid__editor',
    ) as HTMLInputElement | null;
  }

  function draftbarButtons(element: HTMLElement): HTMLButtonElement[] {
    return Array.from(
      element.querySelectorAll('.solaris-record-grid__draftbar button'),
    ) as HTMLButtonElement[];
  }

  it('should commit the open editor from the draftbar', () => {
    const { fixture, element } = createCoverageFixture();
    const commits: SolarisRecordGridCommit<FixtureRow>[] = [];
    fixture.componentInstance.recordCommit.subscribe((commit) =>
      commits.push(commit),
    );
    const input = openPresentEditor(fixture, element) as HTMLInputElement;
    expect(input).not.toBeNull();
    draftbarButtons(element)[0]?.click();
    fixture.detectChanges();
    expect(commits.length).toBe(1);
    expect(commits[0]?.value).toBe(8);
    expect(commits[0]?.rowId).toBe('a');
    expect(
      element.querySelector('input.solaris-record-grid__editor'),
    ).toBeNull();
  });

  it('should discard the open editor from the draftbar without committing', () => {
    const { fixture, element } = createCoverageFixture();
    const commits: SolarisRecordGridCommit<FixtureRow>[] = [];
    fixture.componentInstance.recordCommit.subscribe((commit) =>
      commits.push(commit),
    );
    openPresentEditor(fixture, element);
    fixture.detectChanges();
    expect(draftbarButtons(element).length).toBe(2);
    draftbarButtons(element)[1]?.click();
    fixture.detectChanges();
    expect(commits.length).toBe(0);
    expect(
      element.querySelector('input.solaris-record-grid__editor'),
    ).toBeNull();
    const rows = bodyRows(element);
    expect(cellText(rows[0] as HTMLElement, 'present')).toBe('8');
  });

  it('should parse decimal text when committing a draft', () => {
    const { fixture, element } = createCoverageFixture();
    const commits: SolarisRecordGridCommit<FixtureRow>[] = [];
    fixture.componentInstance.recordCommit.subscribe((commit) =>
      commits.push(commit),
    );
    const input = openPresentEditor(fixture, element) as HTMLInputElement;
    input.value = '8.5';
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(commits[0]?.value).toBe(8.5);
  });

  it('should commit null when the draft text is blank', () => {
    const { fixture, element } = createCoverageFixture();
    const commits: SolarisRecordGridCommit<FixtureRow>[] = [];
    fixture.componentInstance.recordCommit.subscribe((commit) =>
      commits.push(commit),
    );
    const input = openPresentEditor(fixture, element) as HTMLInputElement;
    input.value = '   ';
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(commits.length).toBe(1);
    expect(commits[0]?.value).toBeNull();
    const rows = bodyRows(element);
    expect(cellText(rows[0] as HTMLElement, 'present')).toBe('—');
  });

  it('should keep text drafts as strings', () => {
    const { fixture, element } = createCoverageFixture();
    const commits: SolarisRecordGridCommit<FixtureRow>[] = [];
    fixture.componentInstance.recordCommit.subscribe((commit) =>
      commits.push(commit),
    );
    const cell = element.querySelector(
      'tbody tr.solaris-record-grid__row td[data-column-id="student"] button.solaris-record-grid__cell-button',
    ) as HTMLButtonElement;
    cell.click();
    fixture.detectChanges();
    const input = element.querySelector(
      'input.solaris-record-grid__editor',
    ) as HTMLInputElement;
    input.value = 'Ada Lovelace';
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(commits[0]?.value).toBe('Ada Lovelace');
  });

  it('should block commits rejected by the global validateOf', () => {
    const { fixture, element } = createCoverageFixture({
      validateOf: () => 'Grid is locked',
    });
    const commits: SolarisRecordGridCommit<FixtureRow>[] = [];
    fixture.componentInstance.recordCommit.subscribe((commit) =>
      commits.push(commit),
    );
    const input = openPresentEditor(fixture, element) as HTMLInputElement;
    input.value = '9';
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(commits.length).toBe(0);
    expect(
      element
        .querySelector('.solaris-record-grid__cell-error')
        ?.textContent?.trim(),
    ).toBe('Grid is locked');
  });

  it('should sync the records model on commit', () => {
    const { fixture, element } = createCoverageFixture({ records: ROWS });
    const input = openPresentEditor(fixture, element) as HTMLInputElement;
    input.value = '9';
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(fixture.componentInstance.records()?.[0]?.present).toBe(9);
  });
});

describe('SolarisRecordGridComponent coverage: states and layout', () => {
  function createCoverageFixture(
    overrides: Record<string, unknown> = {},
  ): ReturnType<typeof createFixture> {
    configureSolarisTesting();
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

  it('should show the custom empty text when there are no rows', () => {
    const { element } = createCoverageFixture({
      data: [],
      emptyText: 'Nothing enrolled yet',
    });
    expect(
      element.querySelector('table.solaris-record-grid__table'),
    ).toBeNull();
    expect(element.textContent).toContain('Nothing enrolled yet');
  });

  it('should show the default empty text when there are no rows', () => {
    const { element } = createCoverageFixture({ data: [] });
    expect(element.textContent).toContain('No records found');
  });

  it('should prefer loading over the error state', () => {
    const { element } = createCoverageFixture({
      loading: true,
      error: 'Backend exploded',
    });
    expect(element.textContent).toContain('Loading records');
    expect(
      element.querySelector('.solaris-record-grid__state[role="alert"]'),
    ).toBeNull();
  });

  it('should render cards in card layout', () => {
    const { element } = createCoverageFixture({ layout: 'card' });
    const cards = element.querySelectorAll(
      '.solaris-record-grid__cards .solaris-record-grid__card',
    );
    expect(cards.length).toBe(3);
    expect(cards[0]?.textContent).toContain('Ada');
    expect(
      element.querySelector('table.solaris-record-grid__table'),
    ).toBeNull();
  });

  it('should omit hidden columns from header and body', () => {
    const columns: readonly SolarisRecordGridColumn<FixtureRow>[] = [
      { id: 'student', header: 'Student', accessor: 'student' },
      { id: 'present', header: 'Present', accessor: 'present', type: 'number' },
      {
        id: 'project',
        header: 'Project',
        accessor: 'project',
        type: 'number',
        hidden: true,
      },
    ];
    const { element } = createCoverageFixture({ columns });
    expect(
      element.querySelector('thead th[data-column-id="project"]'),
    ).toBeNull();
    expect(
      element.querySelector('tbody td[data-column-id="project"]'),
    ).toBeNull();
    expect(
      element.querySelector('thead th[data-column-id="present"]'),
    ).not.toBeNull();
  });

  it('should reflect density and appearance inputs on the host', () => {
    const { element } = createCoverageFixture({
      density: 'compact',
      appearance: 'table',
      radius: 'sm',
      hover: false,
      fullWidth: true,
    });
    const host = element as HTMLElement;
    expect(host.getAttribute('data-density')).toBe('compact');
    expect(host.getAttribute('data-appearance')).toBe('table');
    expect(host.getAttribute('data-radius')).toBe('sm');
    expect(host.hasAttribute('data-hover')).toBe(false);
    expect(host.getAttribute('data-fullwidth')).toBe('true');
  });

  it('should fall back to the theme density when none is set', () => {
    const { element } = createCoverageFixture();
    expect((element as HTMLElement).getAttribute('data-density')).toBe(
      'normal',
    );
  });

  it('should render no footer rows without footer content', () => {
    const { element } = createCoverageFixture();
    expect(
      element.querySelectorAll('tfoot tr.solaris-record-grid__foot-row').length,
    ).toBe(0);
  });

  it('should emit rowClick when rows are clickable', () => {
    const { fixture, element } = createCoverageFixture({ rowClickable: true });
    const emitted: string[] = [];
    fixture.componentInstance.rowClick.subscribe((event) =>
      emitted.push(event.rowId),
    );
    const row = element.querySelector(
      'tbody tr.solaris-record-grid__row',
    ) as HTMLElement;
    row.click();
    expect(emitted).toEqual(['a']);
  });

  it('should not emit rowClick when rows are not clickable', () => {
    const { fixture, element } = createCoverageFixture();
    const emitted: string[] = [];
    fixture.componentInstance.rowClick.subscribe((event) =>
      emitted.push(event.rowId),
    );
    const row = element.querySelector(
      'tbody tr.solaris-record-grid__row',
    ) as HTMLElement;
    row.click();
    expect(emitted).toEqual([]);
  });

  it('should use the ariaLabel input for the table region', () => {
    const { element } = createCoverageFixture({
      ariaLabel: 'Enrollment grid',
    });
    expect(
      element
        .querySelector('.solaris-record-grid__viewport')
        ?.getAttribute('aria-label'),
    ).toBe('Enrollment grid');
  });
});
