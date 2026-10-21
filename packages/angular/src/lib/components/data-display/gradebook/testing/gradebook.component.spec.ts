import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { ComponentFixture } from '@angular/core/testing';

import { createServerTableDataSource } from '../../table';
import {
  SolarisTableFooterCellDirective,
  SolarisTableFooterDirective,
} from '../../table/directives/table-cell.directive';
import { SolarisPaginationComponent } from '../../../navigation/pagination/component/pagination.component';
import {
  SOLARIS_GRADEBOOK_IDENTITY_COLUMN_ID,
  SolarisGradebookComponent,
} from '../component/gradebook.component';
import type {
  SolarisGradebookColumn,
  SolarisGradebookRow,
} from '../model/gradebook.types';
import { SolarisTranslateService } from '../../../../services/translation';

interface FixtureRow extends SolarisGradebookRow {
  id: string;
  name: string;
}

const COLUMNS: readonly SolarisGradebookColumn<FixtureRow>[] = [
  { id: 'name', header: 'Disciplina', accessor: 'name', sortable: true },
  {
    id: 'gs1',
    header: 'GS1',
    assignmentId: 'gs1',
    maxScore: 20,
    accessor: (row: FixtureRow) => row.scores['gs1'] ?? null,
  },
];

const ROWS: readonly FixtureRow[] = [
  { id: 'a', name: 'Java Advanced', scores: { gs1: 18 } },
  { id: 'b', name: 'Mobile Development', scores: { gs1: null } },
];

function createFixture(overrides: Record<string, unknown> = {}): {
  fixture: ComponentFixture<SolarisGradebookComponent<FixtureRow>>;
  element: HTMLElement;
} {
  TestBed.configureTestingModule({});
  const fixture = TestBed.createComponent(
    SolarisGradebookComponent<FixtureRow>,
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
    element.querySelectorAll('tbody tr.solaris-table__row'),
  ) as HTMLElement[];
}

function rowAt(rows: HTMLElement[], index: number): HTMLElement {
  const row = rows[index];
  expect(row).toBeDefined();
  return row as HTMLElement;
}

function rowCellText(row: HTMLElement, columnId: string): string | null {
  return (
    row
      .querySelector(`td[data-column-id="${columnId}"]`)
      ?.textContent?.trim() ?? null
  );
}

describe('SolarisGradebookComponent', () => {
  it('should render as a grid with a sticky first column', () => {
    const { element } = createFixture();
    const table = element.querySelector('solaris-table');
    expect(table).toBeTruthy();
    expect(table?.getAttribute('data-appearance')).toBe('grid');
    expect(table?.hasAttribute('data-sticky-first-column')).toBe(true);
    expect(bodyRows(element)).toHaveLength(2);
  });

  it('should format grades and render an em-dash for missing values', () => {
    const { element } = createFixture();
    const rows = bodyRows(element);
    expect(rowCellText(rowAt(rows, 0), 'gs1')).toContain('18');
    expect(rowCellText(rowAt(rows, 1), 'gs1')).toContain('—');
  });

  it('should prepend the identity column when configured', () => {
    const { element } = createFixture({
      identity: {
        header: 'Disciplina',
        displayValueOf: (row: FixtureRow) => row.name,
      },
    });
    const firstCell = bodyRows(element)[0]?.querySelector('td');
    expect(firstCell?.textContent?.trim()).toContain('Java Advanced');
  });

  it('should sort null grades last ascending', () => {
    const { fixture, element } = createFixture();
    fixture.componentRef.setInput('sort', {
      columnId: 'gs1',
      direction: 'asc',
    });
    fixture.detectChanges();
    const rows = bodyRows(element);
    expect(rowCellText(rowAt(rows, 0), 'name')).toContain('Java Advanced');
    expect(rowCellText(rowAt(rows, 1), 'name')).toContain('Mobile Development');
  });

  it('should render header groups and footer aggregates', () => {
    const { element } = createFixture({
      headerGroups: [{ id: 's1', header: '1º Semestre' }],
      columns: [
        { id: 'name', header: 'Disciplina', accessor: 'name' },
        {
          id: 'gs1',
          header: 'GS1',
          assignmentId: 'gs1',
          maxScore: 20,
          headerGroup: 's1',
          footer: 'Total',
          accessor: (row: FixtureRow) => row.scores['gs1'] ?? null,
        },
      ],
    });
    expect(element.querySelector('thead')?.textContent).toContain(
      '1º Semestre',
    );
    const foot = element.querySelector('tfoot.solaris-table__foot');
    expect(foot?.textContent).toContain('Total');
  });

  it('should open the grade editor on double-click and commit on change', () => {
    const { fixture, element } = createFixture();
    const committed: unknown[] = [];
    fixture.componentInstance.gradeCommit.subscribe((event) =>
      committed.push(event),
    );
    const cell = bodyRows(element)[0]?.querySelector(
      'td[data-column-id="gs1"]',
    ) as HTMLElement;
    cell.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    fixture.detectChanges();
    const input = element.querySelector(
      'input.solaris-gradebook__editor',
    ) as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.getAttribute('aria-label')).toBe('Edit grade');
    input.value = '19';
    input.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();
    expect(committed).toHaveLength(1);
    expect(committed[0]).toMatchObject({
      rowId: 'a',
      assignmentId: 'gs1',
      value: 19,
    });
  });

  it('should close the editor on escape without committing', () => {
    const { fixture, element } = createFixture();
    const committed: unknown[] = [];
    fixture.componentInstance.gradeCommit.subscribe((event) =>
      committed.push(event),
    );
    const cell = bodyRows(element)[0]?.querySelector(
      'td[data-column-id="gs1"]',
    ) as HTMLElement;
    cell.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    fixture.detectChanges();
    expect(
      element.querySelector('input.solaris-gradebook__editor'),
    ).toBeTruthy();
    cell.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    fixture.detectChanges();
    expect(committed).toHaveLength(0);
    expect(element.querySelector('input.solaris-gradebook__editor')).toBeNull();
  });

  it('should close the editor on blur without committing', () => {
    const { fixture, element } = createFixture();
    const committed: unknown[] = [];
    fixture.componentInstance.gradeCommit.subscribe((event) =>
      committed.push(event),
    );
    const cell = bodyRows(element)[0]?.querySelector(
      'td[data-column-id="gs1"]',
    ) as HTMLElement;
    cell.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    fixture.detectChanges();
    const input = element.querySelector(
      'input.solaris-gradebook__editor',
    ) as HTMLInputElement;
    expect(input).toBeTruthy();
    input.dispatchEvent(new FocusEvent('blur'));
    fixture.detectChanges();
    expect(committed).toHaveLength(0);
    expect(element.querySelector('input.solaris-gradebook__editor')).toBeNull();
  });

  it('should render a status dot for late cells without changing the value', () => {
    const { element } = createFixture({
      gradeStatusOf: () => 'late',
    });
    const cell = bodyRows(element)[0]?.querySelector(
      'td[data-column-id="gs1"] .solaris-gradebook__cell',
    ) as HTMLElement;
    expect(cell?.getAttribute('data-status')).toBe('late');
    expect(cell?.querySelector('.solaris-gradebook__status-dot')).toBeTruthy();
    expect(cell?.textContent).toContain('18');
  });

  it('should render computed columns and keep them read-only', () => {
    const { element } = createFixture({
      columns: [
        {
          id: 'gs1',
          header: 'GS1',
          assignmentId: 'gs1',
          maxScore: 20,
          accessor: (row: FixtureRow) => row.scores['gs1'] ?? null,
        },
        {
          id: 'mp',
          header: 'MP',
          assignmentId: 'mp',
          maxScore: 20,
          computed: { from: ['gs1'], by: 'average' },
        },
      ],
    });
    const rows = bodyRows(element);
    expect(rowCellText(rowAt(rows, 0), 'mp')).toContain('18');
    const cell = rowAt(rows, 0)?.querySelector(
      'td[data-column-id="mp"]',
    ) as HTMLElement;
    expect(cell?.hasAttribute('data-editable')).toBe(false);
  });

  it('should apply the rounding input to grade cells', () => {
    const { element } = createFixture({
      columns: [
        { id: 'name', header: 'Disciplina', accessor: 'name' },
        {
          id: 'mp',
          header: 'MP',
          assignmentId: 'mp',
          maxScore: 100,
          accessor: () => 87.85,
        },
      ],
      rounding: { maximumFractionDigits: 1, mode: 'down' },
    });
    const rows = bodyRows(element);
    expect(rowCellText(rowAt(rows, 0), 'mp')).toContain('87.8');
  });

  it('should expose status and value in the whole-cell title', () => {
    const { element } = createFixture({
      gradeStatusOf: () => 'late',
    });
    const cell = bodyRows(element)[0]?.querySelector(
      'td[data-column-id="gs1"]',
    ) as HTMLElement;
    expect(cell?.getAttribute('title')).toBe('Late - 18');
  });

  it('should compute footer aggregates when aggregate is set', () => {
    const { element } = createFixture({
      columns: [
        { id: 'name', header: 'Disciplina', accessor: 'name' },
        {
          id: 'gs1',
          header: 'GS1',
          assignmentId: 'gs1',
          maxScore: 20,
          aggregate: 'average',
          accessor: (row: FixtureRow) => row.scores['gs1'] ?? null,
        },
      ],
    });
    const foot = element.querySelector('tfoot.solaris-table__foot');
    expect(foot?.textContent).toContain('18');
  });

  it('should forward stickyLastColumn to the inner table', () => {
    const { element } = createFixture({ stickyLastColumn: true });
    const table = element.querySelector('solaris-table');
    expect(table?.hasAttribute('data-sticky-last-column')).toBe(true);
  });

  it('should emit bulk commit for selected rows', () => {
    const { fixture } = createFixture({ bulkEnabled: true });
    const bulk: unknown[] = [];
    fixture.componentInstance.gradeBulkCommit.subscribe((event) =>
      bulk.push(event),
    );
    fixture.componentInstance.commitBulk(['a', 'b'], 'gs1', 19);
    expect(bulk).toHaveLength(1);
    expect(bulk[0]).toMatchObject({
      assignmentId: 'gs1',
      value: 19,
    });
  });

  it('should lock excused cells instead of rendering an editor', () => {
    const { fixture, element } = createFixture({
      gradeStatusOf: () => 'excused',
    });
    const cell = bodyRows(element)[0]?.querySelector(
      'td[data-column-id="gs1"]',
    ) as HTMLElement;
    cell.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    fixture.detectChanges();
    expect(
      element.querySelector(
        '.solaris-gradebook__locked,input.solaris-gradebook__editor',
      )?.className,
    ).toContain('solaris-gradebook__locked');
  });

  it('should lock cells denied by editableOf instead of rendering an editor', () => {
    const { fixture, element } = createFixture({
      editableOf: () => false,
    });
    const committed: unknown[] = [];
    fixture.componentInstance.gradeCommit.subscribe((event) =>
      committed.push(event),
    );
    const cell = bodyRows(element)[0]?.querySelector(
      'td[data-column-id="gs1"]',
    ) as HTMLElement;
    cell.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    fixture.detectChanges();
    expect(
      element.querySelector(
        '.solaris-gradebook__locked,input.solaris-gradebook__editor',
      )?.className,
    ).toContain('solaris-gradebook__locked');
    expect(element.querySelector('input.solaris-gradebook__editor')).toBeNull();
    expect(committed).toHaveLength(0);
  });

  it('should keep cells editable when editableOf allows', () => {
    const { fixture, element } = createFixture({
      editableOf: (row: FixtureRow) => row.id === 'a',
    });
    const rows = bodyRows(element);
    const allowedCell = rowAt(rows, 0)?.querySelector(
      'td[data-column-id="gs1"]',
    ) as HTMLElement;
    allowedCell.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    fixture.detectChanges();
    expect(
      element.querySelector('input.solaris-gradebook__editor'),
    ).toBeTruthy();
  });

  it('should focus the editor on open so escape closes it', () => {
    const { fixture, element } = createFixture();
    const cell = bodyRows(element)[0]?.querySelector(
      'td[data-column-id="gs1"]',
    ) as HTMLElement;
    cell.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    fixture.detectChanges();
    const input = element.querySelector(
      'input.solaris-gradebook__editor',
    ) as HTMLInputElement;
    expect(document.activeElement).toBe(input);
  });

  it('should render header hints with a tooltip', () => {
    const { element } = createFixture({
      columns: [
        { id: 'name', header: 'Disciplina', accessor: 'name' },
        {
          id: 'gs1',
          header: 'GS1',
          assignmentId: 'gs1',
          maxScore: 20,
          hint: 'Global Solution, peso 2',
          accessor: (row: FixtureRow) => row.scores['gs1'] ?? null,
        },
      ],
    });
    const hint = element.querySelector(
      'th[data-column-id="gs1"] .solaris-gradebook__head-hint',
    ) as HTMLElement;
    expect(hint?.textContent?.trim()).toContain('GS1');
  });

  it('should remap edit events with the assignment id', () => {
    const { fixture, element } = createFixture();
    const started: unknown[] = [];
    fixture.componentInstance.gradeEditStart.subscribe((event) =>
      started.push(event),
    );
    const cell = bodyRows(element)[0]?.querySelector(
      'td[data-column-id="gs1"]',
    ) as HTMLElement;
    cell.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    fixture.detectChanges();
    expect(started).toHaveLength(1);
    expect(started[0]).toMatchObject({ rowId: 'a', assignmentId: 'gs1' });
  });

  it('should render status columns as centered badges', () => {
    const { element } = createFixture({
      columns: [
        { id: 'name', header: 'Disciplina', accessor: 'name' },
        {
          id: 'result',
          header: 'Situação',
          status: true,
          accessor: () => 'Aprovado',
        },
      ],
    });
    const badge = element.querySelector(
      'td[data-column-id="result"] solaris-badge',
    );
    expect(badge).toBeTruthy();
    expect(badge?.getAttribute('data-color')).toBe('success');
    expect(badge?.textContent?.trim()).toContain('Aprovado');
  });

  it('should center status columns by default unless aligned explicitly', () => {
    const { element } = createFixture({
      columns: [
        { id: 'name', header: 'Disciplina', accessor: 'name' },
        {
          id: 'result',
          header: 'Situação',
          status: true,
          accessor: () => 'Aprovado',
        },
      ],
    });
    const cell = bodyRows(element)[0]?.querySelector(
      'td[data-column-id="result"]',
    ) as HTMLElement;
    expect(cell?.getAttribute('data-align')).toBe('center');
  });

  it('should render rows from a server data source', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(
      SolarisGradebookComponent<FixtureRow>,
    );
    const source = createServerTableDataSource<FixtureRow>(
      signal(ROWS),
      signal(ROWS.length),
      signal(false),
    );
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput('data', source);
    fixture.componentRef.setInput('rowId', 'id');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(bodyRows(element)).toHaveLength(2);
  });

  it('should expose an accessible table with sortable headers', () => {
    const { element } = createFixture();
    expect(element.querySelector('table[role="table"], table')).toBeTruthy();
    const sortButton = element.querySelector(
      'th button[aria-label]',
    ) as HTMLElement;
    expect(sortButton).toBeTruthy();
  });

  it('should project a footer slot through to the inner table', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(GradebookFooterHostComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(
      element.querySelector('.solaris-table__footer solaris-pagination'),
    ).toBeTruthy();
  });

  it('should resolve editor and status text through solaris keys with documented fallbacks', () => {
    const { fixture } = createFixture({ editorLabel: 'Custom editor' });
    const instance = fixture.componentInstance as unknown as {
      resolvedEditorLabel: () => string;
    };
    expect(instance.resolvedEditorLabel()).toBe('Custom editor');
    fixture.componentRef.setInput('editorLabel', null);
    fixture.detectChanges();
    expect(instance.resolvedEditorLabel()).toBe('Edit grade');
  });

  it('should register solaris gradebook and sortedCleared keys in both locales', async () => {
    const { SOLARIS_TRANSLATE_DEFAULT_CONFIG } = await import(
      '../../../../services/translation/model/solaris-translate-defaults'
    );
    const en = SOLARIS_TRANSLATE_DEFAULT_CONFIG.translations['en-US'];
    const pt = SOLARIS_TRANSLATE_DEFAULT_CONFIG.translations['pt-BR'];
    for (const key of [
      'solaris.dataDisplay.gradebook.editorLabel',
      'solaris.dataDisplay.gradebook.status.missing',
      'solaris.dataDisplay.gradebook.status.late',
      'solaris.dataDisplay.gradebook.status.excused',
      'solaris.dataDisplay.table.sortedCleared',
      'solaris.dataDisplay.recordGrid.sortedCleared',
    ]) {
      expect(en[key]).toBeTruthy();
      expect(pt[key]).toBeTruthy();
    }
    expect(pt['solaris.dataDisplay.gradebook.editorLabel']).toBe('Editar nota');
  });
});

@Component({
  standalone: true,
  imports: [
    SolarisGradebookComponent,
    SolarisTableFooterDirective,
    SolarisPaginationComponent,
  ],
  template: `
    <solaris-gradebook [data]="rows()" [columns]="columns" rowId="id">
      <ng-template solaris-table-footer>
        <solaris-pagination
          [pageIndex]="pageIndex()"
          [pageSize]="pageSize()"
          [total]="rows().length"
        />
      </ng-template>
    </solaris-gradebook>
  `,
})
class GradebookFooterHostComponent {
  protected readonly rows = signal<readonly FixtureRow[]>(ROWS);
  protected readonly columns = COLUMNS;
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(3);
}

type GradebookResolvedColumn = {
  readonly id: string;
  readonly sortValueOf?: (row: FixtureRow) => unknown;
  readonly displayValueOf?: (row: FixtureRow) => unknown;
};

type GradebookTestApi = {
  commitEditor(
    row: FixtureRow,
    rowId: string,
    column: GradebookResolvedColumn,
    text: string,
    close: () => void,
  ): void;
  handlePaste(
    event: ClipboardEvent,
    assignmentId: string,
    startRowId: string,
  ): void;
  headerLabel(column: GradebookResolvedColumn): string;
  headerHint(column: GradebookResolvedColumn): string | undefined;
  cellStatusAttr(
    row: FixtureRow,
    column: GradebookResolvedColumn,
  ): string | null;
  cellStatusLabel(
    row: FixtureRow,
    column: GradebookResolvedColumn,
  ): string | null;
  isCellLocked(row: FixtureRow, column: GradebookResolvedColumn): boolean;
  resolvedEditorLabel(): string;
  resolvedColumns(): readonly GradebookResolvedColumn[];
  resolvedCardTitleOf(): ((row: FixtureRow) => string | null) | undefined;
  commitBulk(
    rowIds: readonly string[],
    assignmentId: string,
    value: number | null,
  ): void;
};

function gradebookApiOf(
  fixture: ComponentFixture<SolarisGradebookComponent<FixtureRow>>,
): GradebookTestApi {
  return fixture.componentInstance as unknown as GradebookTestApi;
}

function firstFixtureRow(): FixtureRow {
  const row = ROWS[0];
  expect(row).toBeDefined();
  return row as FixtureRow;
}

function gradeColumnOf(
  fixture: ComponentFixture<SolarisGradebookComponent<FixtureRow>>,
): GradebookResolvedColumn {
  const column = gradebookApiOf(fixture)
    .resolvedColumns()
    .find((candidate) => candidate.id === 'gs1');
  expect(column).toBeDefined();
  return column as GradebookResolvedColumn;
}

function createTranslatedFixture(
  translations: Record<string, string>,
  overrides: Record<string, unknown> = {},
): {
  fixture: ComponentFixture<SolarisGradebookComponent<FixtureRow>>;
  element: HTMLElement;
} {
  TestBed.configureTestingModule({
    providers: [
      {
        provide: SolarisTranslateService,
        useValue: {
          locale: signal('en-US'),
          translate: (key: string): string => translations[key] ?? key,
        },
      },
    ],
  });
  const fixture = TestBed.createComponent(
    SolarisGradebookComponent<FixtureRow>,
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

function statusColumns(
  accessor: () => string,
): readonly SolarisGradebookColumn<FixtureRow>[] {
  return [
    { id: 'name', header: 'Disciplina', accessor: 'name' },
    { id: 'result', header: 'Situação', status: true, accessor },
  ];
}

function fakePaste(text: string | null): {
  event: ClipboardEvent;
  prevented(): boolean;
} {
  let prevented = false;
  const event = {
    preventDefault: (): void => {
      prevented = true;
    },
    clipboardData: text === null ? undefined : { getData: (): string => text },
  } as unknown as ClipboardEvent;
  return {
    event,
    prevented: (): boolean => prevented,
  };
}

function commitWithText(
  fixture: ComponentFixture<SolarisGradebookComponent<FixtureRow>>,
  text: string,
): { committed: unknown[]; closed: boolean } {
  const committed: unknown[] = [];
  fixture.componentInstance.gradeCommit.subscribe((event) =>
    committed.push(event),
  );
  let closed = false;
  gradebookApiOf(fixture).commitEditor(
    firstFixtureRow(),
    'a',
    gradeColumnOf(fixture),
    text,
    () => {
      closed = true;
    },
  );
  return { committed, closed };
}

describe('SolarisGradebookComponent status colors', () => {
  it('should map exame to warning', () => {
    const { element } = createFixture({
      columns: statusColumns(() => 'Exame'),
    });
    expect(
      element
        .querySelector('td[data-column-id="result"] solaris-badge')
        ?.getAttribute('data-color'),
    ).toBe('warning');
  });

  it('should map recuperação to warning', () => {
    const { element } = createFixture({
      columns: statusColumns(() => 'Recuperação'),
    });
    expect(
      element
        .querySelector('td[data-column-id="result"] solaris-badge')
        ?.getAttribute('data-color'),
    ).toBe('warning');
  });

  it('should map reprovado to danger', () => {
    const { element } = createFixture({
      columns: statusColumns(() => 'Reprovado'),
    });
    expect(
      element
        .querySelector('td[data-column-id="result"] solaris-badge')
        ?.getAttribute('data-color'),
    ).toBe('danger');
  });

  it('should fall back to neutral for unknown status text', () => {
    const { element } = createFixture({
      columns: statusColumns(() => 'Cursando'),
    });
    const badge = element.querySelector(
      'td[data-column-id="result"] solaris-badge',
    );
    expect(badge?.getAttribute('data-color')).toBe('neutral');
    expect(badge?.textContent?.trim()).toContain('Cursando');
  });

  it('should prefer a custom statusColorOf over defaults', () => {
    const { element } = createFixture({
      columns: statusColumns(() => 'Aprovado'),
      statusColorOf: () => 'warning' as const,
    });
    expect(
      element
        .querySelector('td[data-column-id="result"] solaris-badge')
        ?.getAttribute('data-color'),
    ).toBe('warning');
  });
});

describe('SolarisGradebookComponent translated headers', () => {
  const keyed = [
    {
      id: 'name',
      headerKey: 'gradebook.code',
      hintKey: 'gradebook.code.hint',
      accessor: 'name',
    },
  ] as readonly SolarisGradebookColumn<FixtureRow>[];

  function namedColumnOf(
    fixture: ComponentFixture<SolarisGradebookComponent<FixtureRow>>,
  ): GradebookResolvedColumn {
    const column = gradebookApiOf(fixture)
      .resolvedColumns()
      .find((candidate) => candidate.id === 'name');
    expect(column).toBeDefined();
    return column as GradebookResolvedColumn;
  }

  it('should resolve header labels through the translation service', () => {
    const { fixture } = createTranslatedFixture(
      { 'gradebook.code': 'Código' },
      { columns: keyed },
    );
    expect(gradebookApiOf(fixture).headerLabel(namedColumnOf(fixture))).toBe(
      'Código',
    );
  });

  it('should fall back to the key and column id without translations', () => {
    const { fixture } = createTranslatedFixture({}, { columns: keyed });
    const api = gradebookApiOf(fixture);
    expect(api.headerLabel(namedColumnOf(fixture))).toBe('gradebook.code');
    expect(api.headerLabel({ id: 'plain' })).toBe('plain');
  });

  it('should resolve header hints through the translation service', () => {
    const { fixture } = createTranslatedFixture(
      { 'gradebook.code.hint': 'Dica da coluna' },
      { columns: keyed },
    );
    expect(gradebookApiOf(fixture).headerHint(namedColumnOf(fixture))).toBe(
      'Dica da coluna',
    );
  });

  it('should fall back to the hint key without translations', () => {
    const { fixture } = createTranslatedFixture({}, { columns: keyed });
    expect(gradebookApiOf(fixture).headerHint(namedColumnOf(fixture))).toBe(
      'gradebook.code.hint',
    );
  });
});

describe('SolarisGradebookComponent editor commit', () => {
  it('should commit null and close on blank input', () => {
    const { fixture } = createFixture();
    const { committed, closed } = commitWithText(fixture, '   ');
    expect(committed).toHaveLength(1);
    expect(committed[0]).toMatchObject({
      rowId: 'a',
      assignmentId: 'gs1',
      value: null,
    });
    expect(closed).toBe(true);
  });

  it('should ignore unparseable input without closing', () => {
    const { fixture } = createFixture();
    const { committed, closed } = commitWithText(fixture, 'not-a-grade');
    expect(committed).toHaveLength(0);
    expect(closed).toBe(false);
  });

  it('should clamp negative input to zero', () => {
    const { fixture } = createFixture();
    const { committed, closed } = commitWithText(fixture, '-3');
    expect(committed).toHaveLength(1);
    expect(committed[0]).toMatchObject({ value: 0 });
    expect(closed).toBe(true);
  });

  it('should clamp input above maxScore', () => {
    const { fixture } = createFixture();
    const { committed, closed } = commitWithText(fixture, '99');
    expect(committed).toHaveLength(1);
    expect(committed[0]).toMatchObject({ value: 20 });
    expect(closed).toBe(true);
  });

  it('should parse comma decimal separators', () => {
    const { fixture } = createFixture();
    const { committed, closed } = commitWithText(fixture, '17,5');
    expect(committed).toHaveLength(1);
    expect(committed[0]).toMatchObject({ value: 17.5 });
    expect(closed).toBe(true);
  });
});

describe('SolarisGradebookComponent editor label', () => {
  it('should resolve the fallback key through translations', () => {
    const { fixture } = createTranslatedFixture({
      'solaris.dataDisplay.gradebook.editorLabel': 'Nota',
    });
    expect(gradebookApiOf(fixture).resolvedEditorLabel()).toBe('Nota');
  });

  it('should resolve the legacy key when the fallback key is missing', () => {
    const { fixture } = createTranslatedFixture({
      'gradebook.editor.label': 'Nota (legado)',
    });
    expect(gradebookApiOf(fixture).resolvedEditorLabel()).toBe('Nota (legado)');
  });

  it('should echo a custom editorLabelKey without translations', () => {
    const { fixture } = createTranslatedFixture(
      {},
      { editorLabelKey: 'custom.editor.key' },
    );
    expect(gradebookApiOf(fixture).resolvedEditorLabel()).toBe(
      'custom.editor.key',
    );
  });
});

describe('SolarisGradebookComponent cell status', () => {
  it('should return a null status for non-grade columns', () => {
    const { fixture } = createFixture();
    expect(
      gradebookApiOf(fixture).cellStatusAttr(firstFixtureRow(), {
        id: 'name',
      }),
    ).toBeNull();
  });

  it('should return a null label for graded cells', () => {
    const { fixture } = createFixture();
    expect(
      gradebookApiOf(fixture).cellStatusLabel(
        firstFixtureRow(),
        gradeColumnOf(fixture),
      ),
    ).toBeNull();
  });

  it('should translate status labels through solaris keys', () => {
    const { fixture } = createTranslatedFixture(
      { 'solaris.dataDisplay.gradebook.status.late': 'Atrasada' },
      { gradeStatusOf: () => 'late' },
    );
    expect(
      gradebookApiOf(fixture).cellStatusLabel(
        firstFixtureRow(),
        gradeColumnOf(fixture),
      ),
    ).toBe('Atrasada');
  });

  it('should translate status labels through legacy keys', () => {
    const { fixture } = createTranslatedFixture(
      { 'gradebook.status.late': 'Atrasada (legado)' },
      { gradeStatusOf: () => 'late' },
    );
    expect(
      gradebookApiOf(fixture).cellStatusLabel(
        firstFixtureRow(),
        gradeColumnOf(fixture),
      ),
    ).toBe('Atrasada (legado)');
  });

  it('should fall back to built-in status labels', () => {
    const { fixture } = createTranslatedFixture(
      {},
      { gradeStatusOf: () => 'late' },
    );
    expect(
      gradebookApiOf(fixture).cellStatusLabel(
        firstFixtureRow(),
        gradeColumnOf(fixture),
      ),
    ).toBe('Late');
  });

  it('should lock every cell when readonly', () => {
    const { fixture } = createFixture({ readonly: true });
    expect(
      gradebookApiOf(fixture).isCellLocked(
        firstFixtureRow(),
        gradeColumnOf(fixture),
      ),
    ).toBe(true);
  });

  it('should lock every cell when disabled', () => {
    const { fixture } = createFixture({ disabled: true });
    expect(
      gradebookApiOf(fixture).isCellLocked(
        firstFixtureRow(),
        gradeColumnOf(fixture),
      ),
    ).toBe(true);
  });
});

describe('SolarisGradebookComponent aggregates and identity', () => {
  it('should render no digits when an average has no values', () => {
    const { element } = createFixture({
      columns: [
        { id: 'name', header: 'Disciplina', accessor: 'name' },
        {
          id: 'gs1',
          header: 'GS1',
          assignmentId: 'gs1',
          maxScore: 20,
          aggregate: 'average',
          accessor: () => null,
        },
      ],
    });
    const foot = element.querySelector('tfoot.solaris-table__foot');
    expect(foot).toBeTruthy();
    expect(foot?.textContent ?? '').not.toMatch(/\d/);
  });

  it('should format concept aggregates as letters', () => {
    const { element } = createFixture({
      scale: 'concept',
      columns: [
        { id: 'name', header: 'Disciplina', accessor: 'name' },
        {
          id: 'gs1',
          header: 'GS1',
          assignmentId: 'gs1',
          maxScore: 4,
          aggregate: 'average',
          accessor: (row: FixtureRow) => (row.id === 'a' ? 4 : 2),
        },
      ],
    });
    expect(
      element.querySelector('tfoot.solaris-table__foot')?.textContent,
    ).toContain('B');
  });

  it('should sort excused grades as null', () => {
    const { fixture } = createFixture({ gradeStatusOf: () => 'excused' });
    expect(gradeColumnOf(fixture).sortValueOf?.(firstFixtureRow())).toBeNull();
  });

  it('should resolve identity display and sort values', () => {
    const { fixture } = createFixture({
      identity: {
        header: 'Disciplina',
        displayValueOf: (row: FixtureRow) => row.name,
      },
    });
    const identity = gradebookApiOf(fixture)
      .resolvedColumns()
      .find(
        (candidate) => candidate.id === SOLARIS_GRADEBOOK_IDENTITY_COLUMN_ID,
      );
    expect(identity?.displayValueOf?.(firstFixtureRow())).toBe('Java Advanced');
    expect(identity?.sortValueOf?.(firstFixtureRow())).toBe('Java Advanced');
  });

  it('should prefer an explicit card title over identity', () => {
    const { fixture } = createFixture({ cardTitleOf: () => 'Card title' });
    expect(
      gradebookApiOf(fixture).resolvedCardTitleOf()?.(firstFixtureRow()),
    ).toBe('Card title');
  });
});

describe('SolarisGradebookComponent bulk guards', () => {
  function bulkWith(
    overrides: Record<string, unknown>,
    rowIds: readonly string[],
    assignmentId: string,
  ): unknown[] {
    const { fixture } = createFixture(overrides);
    const bulk: unknown[] = [];
    fixture.componentInstance.gradeBulkCommit.subscribe((event) =>
      bulk.push(event),
    );
    gradebookApiOf(fixture).commitBulk(rowIds, assignmentId, 19);
    return bulk;
  }

  it('should ignore bulk commits when bulk is disabled', () => {
    expect(bulkWith({}, ['a', 'b'], 'gs1')).toHaveLength(0);
  });

  it('should ignore bulk commits when readonly', () => {
    expect(
      bulkWith({ bulkEnabled: true, readonly: true }, ['a', 'b'], 'gs1'),
    ).toHaveLength(0);
  });

  it('should ignore bulk commits for unknown assignments', () => {
    expect(bulkWith({ bulkEnabled: true }, ['a'], 'nope')).toHaveLength(0);
  });

  it('should ignore bulk commits without matching rows', () => {
    expect(bulkWith({ bulkEnabled: true }, ['zzz'], 'gs1')).toHaveLength(0);
  });

  it('should resolve rows from a server source with a function rowId', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(
      SolarisGradebookComponent<FixtureRow>,
    );
    const source = createServerTableDataSource<FixtureRow>(
      signal(ROWS),
      signal(ROWS.length),
      signal(false),
    );
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput('data', source);
    fixture.componentRef.setInput('rowId', (row: FixtureRow) => row.id);
    fixture.componentRef.setInput('bulkEnabled', true);
    fixture.detectChanges();
    const bulk: unknown[] = [];
    fixture.componentInstance.gradeBulkCommit.subscribe((event) =>
      bulk.push(event),
    );
    gradebookApiOf(fixture).commitBulk(['b'], 'gs1', 12);
    expect(bulk).toHaveLength(1);
    expect(bulk[0]).toMatchObject({
      assignmentId: 'gs1',
      value: 12,
      rowIds: ['b'],
    });
  });
});

describe('SolarisGradebookComponent paste', () => {
  function pasteWith(
    text: string | null,
    overrides: Record<string, unknown>,
    assignmentId = 'gs1',
    startRowId = 'a',
  ): {
    committed: unknown[];
    errors: unknown[];
    prevented: boolean;
  } {
    const { fixture } = createFixture(overrides);
    const committed: unknown[] = [];
    const errors: unknown[] = [];
    fixture.componentInstance.gradeCommit.subscribe((event) =>
      committed.push(event),
    );
    fixture.componentInstance.gradePasteError.subscribe((event) =>
      errors.push(event),
    );
    const paste = fakePaste(text);
    gradebookApiOf(fixture).handlePaste(paste.event, assignmentId, startRowId);
    return { committed, errors, prevented: paste.prevented() };
  }

  it('should ignore paste when disabled', () => {
    const { committed, errors, prevented } = pasteWith('15', {});
    expect(committed).toHaveLength(0);
    expect(errors).toHaveLength(0);
    expect(prevented).toBe(false);
  });

  it('should ignore paste when readonly', () => {
    const { committed, errors, prevented } = pasteWith('15', {
      enablePaste: true,
      readonly: true,
    });
    expect(committed).toHaveLength(0);
    expect(errors).toHaveLength(0);
    expect(prevented).toBe(false);
  });

  it('should ignore paste without clipboard data', () => {
    const { committed, errors, prevented } = pasteWith(null, {
      enablePaste: true,
    });
    expect(committed).toHaveLength(0);
    expect(errors).toHaveLength(0);
    expect(prevented).toBe(false);
  });

  it('should ignore paste with empty clipboard text', () => {
    const { committed, errors, prevented } = pasteWith('', {
      enablePaste: true,
    });
    expect(committed).toHaveLength(0);
    expect(errors).toHaveLength(0);
    expect(prevented).toBe(false);
  });

  it('should ignore paste with only blank lines', () => {
    const { committed, errors, prevented } = pasteWith('  \n\t \n', {
      enablePaste: true,
    });
    expect(committed).toHaveLength(0);
    expect(errors).toHaveLength(0);
    expect(prevented).toBe(false);
  });

  it('should commit tab-separated values across rows from the start row', () => {
    const { committed, errors, prevented } = pasteWith('15\textra\n17', {
      enablePaste: true,
    });
    expect(errors).toHaveLength(0);
    expect(prevented).toBe(true);
    expect(committed).toHaveLength(2);
    expect(committed[0]).toMatchObject({
      rowId: 'a',
      assignmentId: 'gs1',
      value: 15,
    });
    expect(committed[1]).toMatchObject({
      rowId: 'b',
      assignmentId: 'gs1',
      value: 17,
    });
  });

  it('should stop pasting at the last visible row', () => {
    const { committed } = pasteWith(
      '15\n17',
      { enablePaste: true },
      'gs1',
      'b',
    );
    expect(committed).toHaveLength(1);
    expect(committed[0]).toMatchObject({ rowId: 'b', value: 15 });
  });

  it('should emit paste errors for unparseable cells', () => {
    const { committed, errors, prevented } = pasteWith('oops', {
      enablePaste: true,
    });
    expect(committed).toHaveLength(0);
    expect(prevented).toBe(true);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatchObject({
      rowId: 'a',
      assignmentId: 'gs1',
      text: 'oops',
    });
  });

  it('should throw for unknown paste assignments', () => {
    const { fixture } = createFixture({ enablePaste: true });
    expect(() =>
      gradebookApiOf(fixture).handlePaste(fakePaste('15').event, 'nope', 'a'),
    ).toThrow('Unknown assignment nope');
  });
});

describe('SolarisGradebookComponent footer cells', () => {
  it('should project footer-cell templates into the table footer', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(GradebookFooterCellHostComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(
      element.querySelector('tfoot.solaris-table__foot')?.textContent,
    ).toContain('2 notas');
  });
});

@Component({
  standalone: true,
  imports: [SolarisGradebookComponent, SolarisTableFooterCellDirective],
  template: `
    <solaris-gradebook [data]="rows()" [columns]="columns" rowId="id">
      <ng-template solaris-table-footer-cell="gs1-total" let-rows="rows">
        {{ rows.length }} notas
      </ng-template>
    </solaris-gradebook>
  `,
})
class GradebookFooterCellHostComponent {
  protected readonly rows = signal<readonly FixtureRow[]>(ROWS);
  protected readonly columns: readonly SolarisGradebookColumn<FixtureRow>[] = [
    { id: 'name', header: 'Disciplina', accessor: 'name', footer: 'Total' },
    {
      id: 'gs1',
      header: 'GS1',
      assignmentId: 'gs1',
      maxScore: 20,
      footerTemplateId: 'gs1-total',
      accessor: (row: FixtureRow) => row.scores['gs1'] ?? null,
    },
  ];
}
