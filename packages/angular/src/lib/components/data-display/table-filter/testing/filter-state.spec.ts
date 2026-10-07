import {
  activeTableFilterCount,
  applyColumnOrder,
  applyColumnVisibility,
  applyOrderedVisibleColumns,
  applyTableFilters,
  createEmptyTableFilterState,
  insertColumnBefore,
  isConditionEffective,
  isTableFilterActive,
  matchesTableFilterCondition,
  moveColumnInOrder,
  normalizeTableFilterState,
  orderFromColumns,
  parseTableFilterState,
  readPersistedTableFilterState,
  serializeTableFilterState,
  writePersistedTableFilterState,
} from '../model/filter-state';
import type { SolarisTableFilterableColumn } from '../model/filter.types';

interface Person {
  id: string;
  name: string;
  age: number;
  city: string;
}

const ROWS: readonly Person[] = [
  { id: '1', name: 'Ana Souza', age: 30, city: 'São Paulo' },
  { id: '2', name: 'Beto Lima', age: 25, city: 'Rio de Janeiro' },
  { id: '3', name: 'Carlos Ana', age: 41, city: '' },
];

const COLUMNS: readonly SolarisTableFilterableColumn<Person>[] = [
  { id: 'name', header: 'Name', accessor: 'name', type: 'text' },
  { id: 'age', header: 'Age', accessor: 'age', type: 'number' },
  { id: 'city', header: 'City', accessor: 'city', type: 'text' },
];

describe('normalizeTableFilterState', () => {
  it('should default missing fields', () => {
    expect(normalizeTableFilterState(null)).toEqual({
      globalSearch: '',
      conditions: [],
      columnVisibility: {},
      columnOrder: [],
    });
  });

  it('should drop invalid conditions', () => {
    const normalized = normalizeTableFilterState({
      conditions: [
        { columnId: 'name', operator: 'contains', value: 'ana' },
        { columnId: '', operator: 'contains' },
        { columnId: 'age', operator: 'nope' as never },
      ],
    });
    expect(normalized.conditions).toEqual([
      { columnId: 'name', operator: 'contains', value: 'ana' },
    ]);
  });
});

describe('activeTableFilterCount / isTableFilterActive', () => {
  it('should be inactive when empty', () => {
    const state = createEmptyTableFilterState();
    expect(isTableFilterActive(state)).toBe(false);
    expect(activeTableFilterCount(state)).toBe(0);
  });

  it('should count search plus conditions', () => {
    const state = normalizeTableFilterState({
      globalSearch: 'ana',
      conditions: [{ columnId: 'age', operator: 'gt', value: 20 }],
    });
    expect(isTableFilterActive(state)).toBe(true);
    expect(activeTableFilterCount(state)).toBe(2);
  });
});

describe('matchesTableFilterCondition', () => {
  it('should match contains case-insensitively', () => {
    expect(
      matchesTableFilterCondition(ROWS[0], COLUMNS[0], {
        columnId: 'name',
        operator: 'contains',
        value: 'ANA',
      }),
    ).toBe(true);
    expect(
      matchesTableFilterCondition(ROWS[1], COLUMNS[0], {
        columnId: 'name',
        operator: 'contains',
        value: 'ana',
      }),
    ).toBe(false);
  });

  it('should compare numbers with gt/between', () => {
    expect(
      matchesTableFilterCondition(ROWS[0], COLUMNS[1], {
        columnId: 'age',
        operator: 'gt',
        value: 29,
      }),
    ).toBe(true);
    expect(
      matchesTableFilterCondition(ROWS[0], COLUMNS[1], {
        columnId: 'age',
        operator: 'between',
        value: { from: 20, to: 29 },
      }),
    ).toBe(false);
  });

  it('should match isEmpty on blank city', () => {
    expect(
      matchesTableFilterCondition(ROWS[2], COLUMNS[2], {
        columnId: 'city',
        operator: 'isEmpty',
      }),
    ).toBe(true);
    expect(
      matchesTableFilterCondition(ROWS[0], COLUMNS[2], {
        columnId: 'city',
        operator: 'isNotEmpty',
      }),
    ).toBe(true);
  });

  it('should match in/notIn lists', () => {
    expect(
      matchesTableFilterCondition(ROWS[0], COLUMNS[2], {
        columnId: 'city',
        operator: 'in',
        value: ['são paulo', 'curitiba'],
      }),
    ).toBe(true);
    expect(
      matchesTableFilterCondition(ROWS[0], COLUMNS[2], {
        columnId: 'city',
        operator: 'notIn',
        value: ['são paulo'],
      }),
    ).toBe(false);
  });

  it('should ignore value-requiring conditions without a value', () => {
    for (const operator of [
      'contains',
      'startsWith',
      'equals',
      'notEquals',
      'gt',
      'gte',
      'lt',
      'lte',
      'in',
      'notIn',
      'between',
    ] as const) {
      expect(
        matchesTableFilterCondition(ROWS[0], COLUMNS[1], {
          columnId: 'age',
          operator,
        }),
      ).toBe(true);
      expect(
        matchesTableFilterCondition(ROWS[0], COLUMNS[1], {
          columnId: 'age',
          operator,
          value: '',
        }),
      ).toBe(true);
    }
  });

  it('should report effectiveness by operator and value', () => {
    expect(isConditionEffective({ columnId: 'age', operator: 'isEmpty' })).toBe(
      true,
    );
    expect(
      isConditionEffective({ columnId: 'age', operator: 'equals', value: 0 }),
    ).toBe(true);
    expect(
      isConditionEffective({ columnId: 'age', operator: 'equals', value: '' }),
    ).toBe(false);
    expect(isConditionEffective({ columnId: 'age', operator: 'gt' })).toBe(
      false,
    );
    expect(
      isConditionEffective({
        columnId: 'age',
        operator: 'between',
        value: { from: '', to: '' },
      }),
    ).toBe(false);
    expect(
      isConditionEffective({
        columnId: 'age',
        operator: 'between',
        value: { from: 20, to: '' },
      }),
    ).toBe(true);
    expect(
      isConditionEffective({ columnId: 'city', operator: 'in', value: [] }),
    ).toBe(false);
  });
});

describe('applyTableFilters', () => {
  it('should filter by global search across display text', () => {
    const result = applyTableFilters(
      ROWS,
      COLUMNS,
      normalizeTableFilterState({ globalSearch: 'ana' }),
    );
    expect(result.map((row) => row.id)).toEqual(['1', '3']);
  });

  it('should combine search and conditions with AND', () => {
    const result = applyTableFilters(
      ROWS,
      COLUMNS,
      normalizeTableFilterState({
        globalSearch: 'ana',
        conditions: [{ columnId: 'age', operator: 'gte', value: 40 }],
      }),
    );
    expect(result.map((row) => row.id)).toEqual(['3']);
  });

  it('should ignore conditions for unknown columns', () => {
    const result = applyTableFilters(
      ROWS,
      COLUMNS,
      normalizeTableFilterState({
        conditions: [{ columnId: 'missing', operator: 'contains', value: 'x' }],
      }),
    );
    expect(result.length).toBe(3);
  });

  it('should not filter rows on conditions without a value', () => {
    const result = applyTableFilters(
      ROWS,
      COLUMNS,
      normalizeTableFilterState({
        conditions: [
          { columnId: 'age', operator: 'equals' },
          { columnId: 'age', operator: 'gt', value: '' },
        ],
      }),
    );
    expect(result.length).toBe(3);
  });
});

describe('column order and visibility', () => {
  const ids = (columns: readonly { id: string }[]): readonly string[] =>
    columns.map((column) => column.id);

  it('should reorder by explicit order and append unknown last', () => {
    expect(
      ids(applyColumnOrder(COLUMNS, ['city', 'name'], (column) => column.id)),
    ).toEqual(['city', 'name', 'age']);
  });

  it('should hide columns flagged false', () => {
    expect(
      ids(
        applyColumnVisibility(COLUMNS, { age: false }, (column) => column.id),
      ),
    ).toEqual(['name', 'city']);
  });

  it('should apply order then visibility together', () => {
    const result = applyOrderedVisibleColumns(
      COLUMNS,
      normalizeTableFilterState({
        columnOrder: ['city', 'age', 'name'],
        columnVisibility: { age: false },
      }),
    );
    expect(ids(result)).toEqual(['city', 'name']);
  });

  it('should derive order from columns', () => {
    expect(orderFromColumns(COLUMNS)).toEqual(['name', 'age', 'city']);
  });

  it('should move columns up and down within bounds', () => {
    expect(moveColumnInOrder(['a', 'b', 'c'], 'b', -1)).toEqual([
      'b',
      'a',
      'c',
    ]);
    expect(moveColumnInOrder(['a', 'b', 'c'], 'a', -1)).toEqual([
      'a',
      'b',
      'c',
    ]);
    expect(moveColumnInOrder(['a', 'b', 'c'], 'c', 1)).toEqual(['a', 'b', 'c']);
  });

  it('should insert dragged column before target', () => {
    expect(insertColumnBefore(['a', 'b', 'c'], 'c', 'a')).toEqual([
      'c',
      'a',
      'b',
    ]);
    expect(insertColumnBefore(['a', 'b'], 'a', 'a')).toEqual(['a', 'b']);
  });
});

describe('persistence', () => {
  const KEY = 'solaris-test-filter';

  beforeEach(() => {
    localStorage.clear();
  });

  it('should round-trip through serialize/parse', () => {
    const state = normalizeTableFilterState({
      globalSearch: 'ana',
      conditions: [{ columnId: 'age', operator: 'gt', value: 20 }],
      columnOrder: ['age', 'name'],
      columnVisibility: { city: false },
    });
    expect(parseTableFilterState(serializeTableFilterState(state))).toEqual(
      state,
    );
  });

  it('should return null for invalid payloads', () => {
    expect(parseTableFilterState(null)).toBeNull();
    expect(parseTableFilterState('not-json')).toBeNull();
  });

  it('should read and write localStorage', () => {
    const state = normalizeTableFilterState({ globalSearch: 'beto' });
    writePersistedTableFilterState(KEY, state);
    expect(readPersistedTableFilterState(KEY)).toEqual(state);
  });

  it('should return null without a key', () => {
    expect(readPersistedTableFilterState(undefined)).toBeNull();
  });
});
