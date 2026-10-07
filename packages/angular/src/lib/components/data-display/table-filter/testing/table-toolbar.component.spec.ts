import { TestBed, type ComponentFixture } from '@angular/core/testing';

import {
  createCsvExporter,
  createJsonExporter,
} from '../../../../services/export';
import { SolarisTableToolbarComponent } from '../component/table-toolbar/table-toolbar.component';
import { normalizeTableFilterState } from '../model/filter-state';
import type { SolarisTableFilterableColumn } from '../model/filter.types';

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
