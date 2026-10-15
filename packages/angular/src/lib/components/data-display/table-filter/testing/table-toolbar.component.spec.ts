import { TestBed, type ComponentFixture } from '@angular/core/testing';

import {
  createCsvExporter,
  createJsonExporter,
  SolarisExportService,
} from '../../../../services/export';
import { SolarisTableToolbarComponent } from '../component/table-toolbar/table-toolbar.component';
import { normalizeTableFilterState } from '../model/filter-state';
import type {
  SolarisTableFilterableColumn,
  SolarisTableFilterCondition,
  SolarisTableFilterOperator,
} from '../model/filter.types';

interface Row {
  id: string;
  name: string;
  city: string;
}

const COLUMNS: readonly SolarisTableFilterableColumn<Row>[] = [
  { id: 'name', header: 'Name', accessor: 'name', type: 'text' },
  { id: 'city', header: 'City', accessor: 'city', type: 'text' },
];

function createFixture(): ComponentFixture<SolarisTableToolbarComponent<Row>> {
  TestBed.configureTestingModule({});
  const fixture = TestBed.createComponent(SolarisTableToolbarComponent<Row>);
  fixture.componentRef.setInput('columns', COLUMNS);
  fixture.detectChanges();
  return fixture;
}

describe('SolarisTableToolbarComponent', () => {
  it('should render search and filter controls by default', () => {
    const fixture = createFixture();
    const root = fixture.nativeElement as HTMLElement;
    expect(
      root.querySelector('.solaris-table-toolbar__search input'),
    ).toBeTruthy();
    expect(root.textContent).toContain('Filters');
    expect(root.textContent).toContain('Customize columns');
  });

  it('should hide the export button without exporters', () => {
    const fixture = createFixture();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[title="Export"]')).toBeNull();
  });

  it('should render a direct export button for a single exporter', () => {
    const fixture = createFixture();
    fixture.componentRef.setInput('exporters', [createCsvExporter<Row>()]);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[title="Export CSV"]')).toBeTruthy();
  });

  it('should render the export menu for multiple exporters', () => {
    const fixture = createFixture();
    fixture.componentRef.setInput('exporters', [
      createCsvExporter<Row>(),
      createJsonExporter<Row>(),
    ]);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[title="Export"]')).toBeTruthy();
    expect(root.querySelector('solaris-dropdown-menu')).toBeTruthy();
  });

  it('should add a condition for the first unused column', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance as unknown as {
      addCondition: () => void;
    };
    component.addCondition();
    expect(fixture.componentInstance.filter().conditions).toEqual([
      { columnId: 'name', operator: 'contains' },
    ]);
    component.addCondition();
    expect(
      fixture.componentInstance
        .filter()
        .conditions.map((entry) => entry.columnId),
    ).toEqual(['name', 'city']);
  });

  it('should expose ordered visible columns for export', () => {
    const fixture = createFixture();
    fixture.componentInstance.filter.set(
      normalizeTableFilterState({
        columnOrder: ['city', 'name'],
        columnVisibility: { name: false },
      }),
    );
    const component = fixture.componentInstance as unknown as {
      orderedVisibleColumns: () => readonly { id: string }[];
    };
    expect(
      component.orderedVisibleColumns().map((column) => column.id),
    ).toEqual(['city']);
  });

  it('should select a view and apply its filter', () => {
    const fixture = createFixture();
    fixture.componentRef.setInput('views', [
      {
        id: 'mine',
        name: 'Mine',
        filter: normalizeTableFilterState({ globalSearch: 'ana' }),
      },
    ]);
    fixture.detectChanges();
    const component = fixture.componentInstance as unknown as {
      selectView: (view: {
        id: string;
        name: string;
        filter: ReturnType<typeof normalizeTableFilterState>;
      }) => void;
    };
    component.selectView({
      id: 'mine',
      name: 'Mine',
      filter: normalizeTableFilterState({ globalSearch: 'ana' }),
    });
    expect(fixture.componentInstance.selectedViewId()).toBe('mine');
    expect(fixture.componentInstance.filter().globalSearch).toBe('ana');
  });

  it('should render the active count with solaris-badge', () => {
    const fixture = createFixture();
    fixture.componentInstance.filter.set(
      normalizeTableFilterState({
        conditions: [{ columnId: 'name', operator: 'contains', value: 'ana' }],
      }),
    );
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const badge = root.querySelector(
      '.solaris-table-toolbar__actions solaris-badge',
    );
    expect(badge?.textContent).toContain('1');
  });

  it('should emit the typed view name on create', () => {
    const fixture = createFixture();
    const names: string[] = [];
    fixture.componentInstance.viewCreate.subscribe((name) => names.push(name));
    const component = fixture.componentInstance as unknown as {
      handleViewNameInput: (value: string) => void;
      handleCreateView: () => void;
    };
    component.handleViewNameInput('  Mine  ');
    component.handleCreateView();
    expect(names).toEqual(['Mine']);
  });

  it('should ignore empty view names', () => {
    const fixture = createFixture();
    const names: string[] = [];
    fixture.componentInstance.viewCreate.subscribe((name) => names.push(name));
    const component = fixture.componentInstance as unknown as {
      handleCreateView: () => void;
    };
    component.handleCreateView();
    expect(names).toEqual([]);
  });

  it('should clear all filters at once', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance as unknown as {
      addCondition: () => void;
      handleSearchInput: (value: string) => void;
      clearAll: () => void;
    };
    component.addCondition();
    component.handleSearchInput('ana');
    component.clearAll();
    expect(fixture.componentInstance.filter().conditions).toEqual([]);
    expect(fixture.componentInstance.filter().globalSearch).toBe('');
  });
});

describe('SolarisTableToolbarComponent export menu', () => {
  it('should resolve the format group label', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance as unknown as {
      resolveExportFormatLabel: () => string;
    };
    expect(component.resolveExportFormatLabel()).toBe('Format');
  });

  it('should keep the count wrap mounted and toggle data-open with the count', () => {
    const fixture = createFixture();
    const root = fixture.nativeElement as HTMLElement;
    const closed = root.querySelector('.solaris-table-toolbar__count');
    expect(closed).toBeTruthy();
    expect(closed?.hasAttribute('data-open')).toBe(false);
    fixture.componentInstance.filter.set(
      normalizeTableFilterState({
        conditions: [{ columnId: 'name', operator: 'contains', value: 'ana' }],
      }),
    );
    fixture.detectChanges();
    const open = root.querySelector('.solaris-table-toolbar__count');
    expect(open?.hasAttribute('data-open')).toBe(true);
  });
});

describe('SolarisTableToolbarComponent chips animation', () => {
  const withCondition = () =>
    normalizeTableFilterState({
      conditions: [{ columnId: 'name', operator: 'contains', value: 'ana' }],
    });

  it('should render chips open without animation when filter starts active', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableToolbarComponent<Row>);
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput('filter', withCondition());
    fixture.detectChanges();
    const chips = (fixture.nativeElement as HTMLElement).querySelector(
      '.solaris-table-toolbar__chips',
    );
    expect(chips).toBeTruthy();
    expect(chips?.hasAttribute('data-open')).toBe(true);
  });

  it('should render chips closed on the first frame when a filter activates', () => {
    const fixture = createFixture();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('.solaris-table-toolbar__chips')).toBeNull();
    fixture.componentInstance.filter.set(withCondition());
    fixture.detectChanges();
    TestBed.flushEffects();
    fixture.detectChanges();
    const chips = root.querySelector('.solaris-table-toolbar__chips');
    expect(chips).toBeTruthy();
    expect(chips?.hasAttribute('data-open')).toBe(false);
  });

  it('should keep chips rendered while collapsing after filters clear', async () => {
    const fixture = createFixture();
    const root = fixture.nativeElement as HTMLElement;
    fixture.componentInstance.filter.set(withCondition());
    fixture.detectChanges();
    TestBed.flushEffects();
    fixture.detectChanges();
    expect(root.querySelector('.solaris-table-toolbar__chips')).toBeTruthy();
    fixture.componentInstance.filter.set(normalizeTableFilterState({}));
    fixture.detectChanges();
    TestBed.flushEffects();
    fixture.detectChanges();
    const collapsing = root.querySelector('.solaris-table-toolbar__chips');
    expect(collapsing).toBeTruthy();
    expect(collapsing?.hasAttribute('data-open')).toBe(false);
    expect(collapsing?.textContent).toContain('ana');
    expect(collapsing?.textContent).toContain('Clear all');
    await new Promise((resolve) => setTimeout(resolve, 400));
    fixture.detectChanges();
    expect(root.querySelector('.solaris-table-toolbar__chips')).toBeNull();
  });

  it('should render without leading or trailing slots by default', () => {
    const fixture = createFixture();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('.solaris-table-toolbar__leading')).toBeNull();
    expect(root.querySelector('.solaris-table-toolbar__trailing')).toBeNull();
  });
});

describe('SolarisTableToolbarComponent condition editing', () => {
  type ConditionHarness = {
    addCondition: () => void;
    clearSearch: () => void;
    updateConditionColumn: (index: number, columnId: string) => void;
    updateConditionOperator: (index: number, operator: string) => void;
    updateConditionValue: (
      index: number,
      value: SolarisTableFilterCondition['value'],
    ) => void;
    updateConditionRange: (
      index: number,
      side: 'from' | 'to',
      value: string,
    ) => void;
    removeCondition: (index: number) => void;
    operatorsFor: (
      column: SolarisTableFilterableColumn<Row> | null,
    ) => readonly SolarisTableFilterOperator[];
  };

  function harness(
    fixture: ComponentFixture<SolarisTableToolbarComponent<Row>>,
  ): ConditionHarness {
    return fixture.componentInstance as unknown as ConditionHarness;
  }

  function withOneCondition(): ComponentFixture<
    SolarisTableToolbarComponent<Row>
  > {
    const fixture = createFixture();
    harness(fixture).addCondition();
    return fixture;
  }

  it('should return no operators without a column', () => {
    const fixture = createFixture();
    expect(harness(fixture).operatorsFor(null)).toEqual([]);
  });

  it('should resolve operators per column type', () => {
    const fixture = createFixture();
    const component = harness(fixture);
    expect(
      component.operatorsFor({ id: 'name', header: 'Name', type: 'text' }),
    ).toContain('contains');
    const numeric = component.operatorsFor({
      id: 'age',
      header: 'Age',
      type: 'number',
    });
    expect(numeric).toContain('between');
    expect(numeric).not.toContain('contains');
    expect(
      component.operatorsFor({
        id: 'tag',
        header: 'Tag',
        type: 'text',
        filterOptions: [{ value: 'a' }],
      }),
    ).toEqual(['in', 'notIn', 'isEmpty', 'isNotEmpty']);
  });

  it('should clear the committed search', () => {
    const fixture = createFixture();
    fixture.componentInstance.filter.set(
      normalizeTableFilterState({ globalSearch: 'ana' }),
    );
    harness(fixture).clearSearch();
    expect(fixture.componentInstance.filter().globalSearch).toBe('');
    fixture.detectChanges();
    const input = (fixture.nativeElement as HTMLElement).querySelector(
      '.solaris-table-toolbar__search input',
    ) as HTMLInputElement | null;
    expect(input?.value).toBe('');
  });

  it('should switch a condition to another column with its default operator', () => {
    const fixture = withOneCondition();
    harness(fixture).updateConditionColumn(0, 'city');
    const [condition] = fixture.componentInstance.filter().conditions;
    expect(condition?.columnId).toBe('city');
    expect(condition?.operator).toBe('contains');
  });

  it('should apply number and option defaults when switching columns', () => {
    const fixture = createFixture();
    fixture.componentRef.setInput('columns', [
      ...COLUMNS,
      { id: 'age', header: 'Age', type: 'number' as const },
      {
        id: 'tag',
        header: 'Tag',
        type: 'text' as const,
        filterOptions: [{ value: 'a' }],
      },
    ]);
    const component = harness(fixture);
    component.addCondition();
    component.updateConditionColumn(0, 'age');
    expect(fixture.componentInstance.filter().conditions[0]?.operator).toBe(
      'equals',
    );
    component.updateConditionColumn(0, 'tag');
    expect(fixture.componentInstance.filter().conditions[0]?.operator).toBe(
      'in',
    );
  });

  it('should ignore unknown columns when switching condition column', () => {
    const fixture = withOneCondition();
    harness(fixture).updateConditionColumn(0, 'unknown');
    const [condition] = fixture.componentInstance.filter().conditions;
    expect(condition?.columnId).toBe('name');
  });

  it('should update the condition operator and keep its value', () => {
    const fixture = createFixture();
    fixture.componentInstance.filter.set(
      normalizeTableFilterState({
        conditions: [{ columnId: 'name', operator: 'contains', value: 'ana' }],
      }),
    );
    harness(fixture).updateConditionOperator(0, 'startsWith');
    expect(fixture.componentInstance.filter().conditions).toEqual([
      { columnId: 'name', operator: 'startsWith', value: 'ana' },
    ]);
  });

  it('should drop the value when switching to a valueless operator', () => {
    const fixture = createFixture();
    fixture.componentInstance.filter.set(
      normalizeTableFilterState({
        conditions: [{ columnId: 'name', operator: 'contains', value: 'ana' }],
      }),
    );
    harness(fixture).updateConditionOperator(0, 'isEmpty');
    const [condition] = fixture.componentInstance.filter().conditions;
    expect(condition?.operator).toBe('isEmpty');
    expect(condition?.value).toBeUndefined();
  });

  it('should ignore invalid operators and missing conditions', () => {
    const fixture = withOneCondition();
    const before = fixture.componentInstance.filter().conditions;
    harness(fixture).updateConditionOperator(0, 'nope');
    harness(fixture).updateConditionOperator(4, 'equals');
    expect(fixture.componentInstance.filter().conditions).toEqual(before);
  });

  it('should update the condition value', () => {
    const fixture = withOneCondition();
    harness(fixture).updateConditionValue(0, 'ana');
    const [condition] = fixture.componentInstance.filter().conditions;
    expect(condition?.value).toBe('ana');
  });

  it('should ignore value updates for missing conditions', () => {
    const fixture = createFixture();
    harness(fixture).updateConditionValue(2, 'ana');
    expect(fixture.componentInstance.filter().conditions).toEqual([]);
  });

  it('should update range sides and clear empties to null', () => {
    const fixture = createFixture();
    fixture.componentInstance.filter.set(
      normalizeTableFilterState({
        conditions: [
          {
            columnId: 'name',
            operator: 'between',
            value: { from: '2024-01-01', to: '2024-02-01' },
          },
        ],
      }),
    );
    const component = harness(fixture);
    component.updateConditionRange(0, 'from', '2024-03-01');
    component.updateConditionRange(0, 'to', '');
    const [condition] = fixture.componentInstance.filter().conditions;
    expect(condition?.value).toEqual({ from: '2024-03-01', to: null });
  });

  it('should ignore range updates for missing conditions', () => {
    const fixture = createFixture();
    harness(fixture).updateConditionRange(3, 'from', '2024-01-01');
    expect(fixture.componentInstance.filter().conditions).toEqual([]);
  });

  it('should remove the condition at the given index', () => {
    const fixture = createFixture();
    const component = harness(fixture);
    component.addCondition();
    component.addCondition();
    component.removeCondition(0);
    expect(
      fixture.componentInstance
        .filter()
        .conditions.map((entry) => entry.columnId),
    ).toEqual(['city']);
  });

  it('should remove a condition through its chip button', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisTableToolbarComponent<Row>);
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput(
      'filter',
      normalizeTableFilterState({
        conditions: [{ columnId: 'name', operator: 'contains', value: 'ana' }],
      }),
    );
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const chip = root.querySelector(
      '.solaris-table-toolbar__chips-inner button',
    ) as HTMLButtonElement | null;
    expect(chip?.textContent).toContain('ana');
    chip?.click();
    expect(fixture.componentInstance.filter().conditions).toEqual([]);
  });
});

describe('SolarisTableToolbarComponent export, columns and value helpers', () => {
  it('should export through the service and emit the result', () => {
    const fixture = createFixture();
    const exporter = createCsvExporter<Row>();
    fixture.componentRef.setInput('exporters', [exporter]);
    fixture.componentRef.setInput('exportRows', [
      { id: '1', name: 'Ana', city: 'Sao Paulo' },
    ]);
    fixture.detectChanges();
    const service = TestBed.inject(SolarisExportService);
    const exportSpy = vi.spyOn(service, 'exportAndDownload').mockReturnValue({
      filename: 'rows.csv',
      mime: 'text/csv',
      truncated: false,
    });
    const filenames: string[] = [];
    fixture.componentInstance.exported.subscribe((event) =>
      filenames.push(event.filename),
    );
    const component = fixture.componentInstance as unknown as {
      handleExport: (selected: typeof exporter) => void;
    };
    component.handleExport(exporter);
    expect(exportSpy).toHaveBeenCalledTimes(1);
    expect(exportSpy.mock.calls[0]?.[0]).toBe(exporter);
    expect(exportSpy.mock.calls[0]?.[1].rows).toHaveLength(1);
    expect(filenames).toEqual(['rows.csv']);
    exportSpy.mockRestore();
  });

  it('should trigger export from the single-exporter button', () => {
    const fixture = createFixture();
    fixture.componentRef.setInput('exporters', [createCsvExporter<Row>()]);
    fixture.detectChanges();
    const service = TestBed.inject(SolarisExportService);
    const exportSpy = vi.spyOn(service, 'exportAndDownload').mockReturnValue({
      filename: 'rows.csv',
      mime: 'text/csv',
      truncated: false,
    });
    const button = (fixture.nativeElement as HTMLElement).querySelector(
      '[title="Export CSV"]',
    ) as HTMLButtonElement | null;
    expect(button).toBeTruthy();
    button?.click();
    expect(exportSpy).toHaveBeenCalledTimes(1);
    exportSpy.mockRestore();
  });

  it('should apply saved column order and visibility', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance as unknown as {
      handleColumnSave: (save: {
        order: readonly string[];
        visibility: Readonly<Record<string, boolean>>;
      }) => void;
    };
    component.handleColumnSave({
      order: ['city', 'name'],
      visibility: { name: false },
    });
    expect(fixture.componentInstance.filter().columnOrder).toEqual([
      'city',
      'name',
    ]);
    expect(fixture.componentInstance.filter().columnVisibility).toEqual({
      name: false,
    });
  });

  it('should reset column order and visibility', () => {
    const fixture = createFixture();
    fixture.componentInstance.filter.set(
      normalizeTableFilterState({
        columnOrder: ['city', 'name'],
        columnVisibility: { name: false },
      }),
    );
    const component = fixture.componentInstance as unknown as {
      handleColumnReset: () => void;
    };
    component.handleColumnReset();
    expect(fixture.componentInstance.filter().columnOrder).toEqual([]);
    expect(fixture.componentInstance.filter().columnVisibility).toEqual({});
  });

  it('should tolerate closing the columns panel without an open popover', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance as unknown as {
      closeColumnsPanel: () => void;
    };
    expect(() => component.closeColumnsPanel()).not.toThrow();
  });

  it('should resolve the column for a condition', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance as unknown as {
      columnOf: (
        condition: SolarisTableFilterCondition,
      ) => SolarisTableFilterableColumn<Row> | null;
    };
    expect(
      component.columnOf({ columnId: 'name', operator: 'contains' })?.id,
    ).toBe('name');
    expect(
      component.columnOf({ columnId: 'missing', operator: 'contains' }),
    ).toBeNull();
  });

  it('should map column types to input types', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance as unknown as {
      inputTypeFor: (
        column: SolarisTableFilterableColumn<Row> | null,
      ) => string;
    };
    expect(component.inputTypeFor({ id: 'age', type: 'number' })).toBe(
      'number',
    );
    expect(component.inputTypeFor({ id: 'day', type: 'date' })).toBe('date');
    expect(component.inputTypeFor({ id: 'name', type: 'text' })).toBe('text');
    expect(component.inputTypeFor({ id: 'other' })).toBe('text');
    expect(component.inputTypeFor(null)).toBe('text');
  });

  it('should read single-value text', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance as unknown as {
      singleValueText: (condition: SolarisTableFilterCondition) => string;
    };
    expect(
      component.singleValueText({
        columnId: 'name',
        operator: 'contains',
        value: 'ana',
      }),
    ).toBe('ana');
    expect(
      component.singleValueText({
        columnId: 'age',
        operator: 'equals',
        value: 3 as unknown as string,
      }),
    ).toBe('3');
    expect(
      component.singleValueText({ columnId: 'name', operator: 'contains' }),
    ).toBe('');
    expect(
      component.singleValueText({
        columnId: 'name',
        operator: 'contains',
        value: null,
      }),
    ).toBe('');
    expect(
      component.singleValueText({
        columnId: 'name',
        operator: 'contains',
        value: { from: 'a', to: 'b' },
      }),
    ).toBe('');
  });

  it('should normalize list values', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance as unknown as {
      listValue: (condition: SolarisTableFilterCondition) => unknown[];
    };
    const source = ['a', 'b'];
    const copied = component.listValue({
      columnId: 'city',
      operator: 'in',
      value: source,
    });
    expect(copied).toEqual(['a', 'b']);
    expect(copied).not.toBe(source);
    expect(component.listValue({ columnId: 'city', operator: 'in' })).toEqual(
      [],
    );
    expect(
      component.listValue({
        columnId: 'city',
        operator: 'in',
        value: '',
      }),
    ).toEqual([]);
    expect(
      component.listValue({
        columnId: 'city',
        operator: 'in',
        value: 'a' as unknown as readonly string[],
      }),
    ).toEqual(['a']);
  });

  it('should read range parts', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance as unknown as {
      rangePart: (
        condition: SolarisTableFilterCondition,
        side: 'from' | 'to',
      ) => string;
    };
    const condition: SolarisTableFilterCondition = {
      columnId: 'day',
      operator: 'between',
      value: { from: '2024-01-01', to: 5 },
    };
    expect(component.rangePart(condition, 'from')).toBe('2024-01-01');
    expect(component.rangePart(condition, 'to')).toBe('5');
    expect(
      component.rangePart(
        { columnId: 'day', operator: 'between', value: null },
        'from',
      ),
    ).toBe('');
    expect(
      component.rangePart({ columnId: 'day', operator: 'between' }, 'to'),
    ).toBe('');
  });

  it('should stringify values', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance as unknown as {
      toStringValue: (value: unknown) => string;
    };
    expect(component.toStringValue(7)).toBe('7');
    expect(component.toStringValue('a')).toBe('a');
    expect(component.toStringValue(null)).toBe('');
    expect(component.toStringValue(undefined)).toBe('');
  });
});

describe('SolarisTableToolbarComponent filter labels', () => {
  function labels(
    fixture: ComponentFixture<SolarisTableToolbarComponent<Row>>,
  ): {
    resolveAddConditionLabel: () => string;
    resolveColumnFieldLabel: () => string;
    resolveOperatorFieldLabel: () => string;
    resolveValueFieldLabel: () => string;
    resolveNoConditionsLabel: () => string;
    resolveCreateViewNameLabel: () => string;
    resolveCreateViewNamePlaceholder: () => string;
    resolveSaveLabel: () => string;
    resolveRemoveSearchLabel: () => string;
  } {
    return fixture.componentInstance as unknown as {
      resolveAddConditionLabel: () => string;
      resolveColumnFieldLabel: () => string;
      resolveOperatorFieldLabel: () => string;
      resolveValueFieldLabel: () => string;
      resolveNoConditionsLabel: () => string;
      resolveCreateViewNameLabel: () => string;
      resolveCreateViewNamePlaceholder: () => string;
      resolveSaveLabel: () => string;
      resolveRemoveSearchLabel: () => string;
    };
  }

  it('should resolve builder field labels', () => {
    const resolve = labels(createFixture());
    expect(resolve.resolveAddConditionLabel()).toBe('Add filter');
    expect(resolve.resolveColumnFieldLabel()).toBe('Column');
    expect(resolve.resolveOperatorFieldLabel()).toBe('Operator');
    expect(resolve.resolveValueFieldLabel()).toBe('Value');
  });

  it('should resolve empty-state, view and action labels', () => {
    const resolve = labels(createFixture());
    expect(resolve.resolveNoConditionsLabel()).toBe('No filters applied');
    expect(resolve.resolveCreateViewNameLabel()).toBe('View name');
    expect(resolve.resolveCreateViewNamePlaceholder()).toBe('My view');
    expect(resolve.resolveSaveLabel()).toBe('Save');
    expect(resolve.resolveRemoveSearchLabel()).toBe('Clear search');
  });
});

describe('SolarisTableToolbarComponent persistence', () => {
  const KEY = 'solaris-toolbar-coverage';

  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('should persist the filter and selected view id to storage', () => {
    const fixture = createFixture();
    fixture.componentRef.setInput('persistenceKey', KEY);
    fixture.componentInstance.filter.set(
      normalizeTableFilterState({ globalSearch: 'ana' }),
    );
    fixture.componentRef.setInput('selectedViewId', 'view-1');
    TestBed.flushEffects();
    expect(window.localStorage.getItem(`${KEY}:filter`)).toContain('ana');
    expect(window.localStorage.getItem(`${KEY}:view`)).toContain('view-1');
  });

  it('should tolerate a failing storage write', () => {
    const fixture = createFixture();
    const setItem = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('denied');
      });
    fixture.componentRef.setInput('persistenceKey', KEY);
    fixture.componentInstance.filter.set(
      normalizeTableFilterState({ globalSearch: 'beto' }),
    );
    expect(() => TestBed.flushEffects()).not.toThrow();
    expect(window.localStorage.getItem(`${KEY}:filter`)).toBeNull();
    setItem.mockRestore();
  });
});
