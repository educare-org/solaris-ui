import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { ComponentFixture } from '@angular/core/testing';

import { createServerTableDataSource } from '../../table';
import { SolarisTableFooterDirective } from '../../table/directives/table-cell.directive';
import { SolarisPaginationComponent } from '../../../navigation/pagination/component/pagination.component';
import { SolarisGradebookComponent } from '../component/gradebook.component';
import type {
  SolarisGradebookColumn,
  SolarisGradebookRow,
} from '../model/gradebook.types';

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
