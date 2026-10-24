import { afterEach, vi } from 'vitest';

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
  isValidCondition,
  matchesTableFilterCondition,
  moveColumnInOrder,
  normalizeTableFilterState,
  orderFromColumns,
  parseTableFilterState,
  readPersistedTableFilterState,
  resolveFilterDisplayText,
  resolveFilterValue,
  serializeTableFilterState,
  writePersistedTableFilterState,
} from '../model/filter-state';
import type {
  SolarisTableFilterCondition,
  SolarisTableFilterableColumn,
} from '../model/filter.types';

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

describe('isValidCondition edge cases', () => {
  it('should reject missing or non-string column ids', () => {
    expect(isValidCondition(null)).toBe(false);
    expect(isValidCondition(undefined)).toBe(false);
    expect(
      isValidCondition({
        columnId: 42 as unknown as string,
        operator: 'contains',
        value: 'x',
      }),
    ).toBe(false);
  });

  it('should drop nullish entries while normalizing', () => {
    const normalized = normalizeTableFilterState({
      conditions: [
        null as unknown as SolarisTableFilterCondition,
        { columnId: 'name', operator: 'contains', value: 'ana' },
      ],
    });
    expect(normalized.conditions).toEqual([
      { columnId: 'name', operator: 'contains', value: 'ana' },
    ]);
  });
});

describe('resolveFilterValue and resolveFilterDisplayText', () => {
  it('should support function accessors', () => {
    const column: SolarisTableFilterableColumn<Person> = {
      id: 'shouty',
      header: 'Shouty',
      accessor: (row) => row.name.toUpperCase(),
    };
    expect(resolveFilterValue(ROWS[0], column)).toBe('ANA SOUZA');
  });

  it('should fall back to the column id without an accessor', () => {
    const column: SolarisTableFilterableColumn<Person> = {
      id: 'city',
      header: 'City',
    };
    expect(resolveFilterValue(ROWS[0], column)).toBe('São Paulo');
  });

  it('should prefer custom display text and blank on nullish values', () => {
    const custom: SolarisTableFilterableColumn<Person> = {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      displayValueOf: (row) => ` ${row.name} `,
    };
    expect(resolveFilterDisplayText(ROWS[0], custom)).toBe(' Ana Souza ');

    const blank: SolarisTableFilterableColumn<Person> = {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      displayValueOf: () => '   ',
    };
    expect(resolveFilterDisplayText(ROWS[0], blank)).toBe('Ana Souza');

    const missing: SolarisTableFilterableColumn<Record<string, unknown>> = {
      id: 'nick',
      header: 'Nick',
    };
    expect(resolveFilterDisplayText({ nick: null }, missing)).toBe('');
    expect(resolveFilterDisplayText({}, missing)).toBe('');
    expect(resolveFilterDisplayText({ nick: 30 }, missing)).toBe('30');
  });
});

describe('matchesTableFilterCondition uncovered operators', () => {
  it('should match startsWith case-insensitively', () => {
    expect(
      matchesTableFilterCondition(ROWS[0], COLUMNS[0], {
        columnId: 'name',
        operator: 'startsWith',
        value: 'ana',
      }),
    ).toBe(true);
    expect(
      matchesTableFilterCondition(ROWS[1], COLUMNS[0], {
        columnId: 'name',
        operator: 'startsWith',
        value: 'ana',
      }),
    ).toBe(false);
  });

  it('should compare numbers loosely against numeric strings', () => {
    const age = COLUMNS[1];
    expect(
      matchesTableFilterCondition(ROWS[0], age, {
        columnId: 'age',
        operator: 'equals',
        value: '30',
      }),
    ).toBe(true);
    expect(
      matchesTableFilterCondition(ROWS[0], age, {
        columnId: 'age',
        operator: 'equals',
        value: '31',
      }),
    ).toBe(false);
    expect(
      matchesTableFilterCondition(ROWS[0], age, {
        columnId: 'age',
        operator: 'equals',
        value: 'abc',
      }),
    ).toBe(false);
    expect(
      matchesTableFilterCondition(ROWS[0], age, {
        columnId: 'age',
        operator: 'equals',
        value: '   ',
      }),
    ).toBe(false);
    expect(
      matchesTableFilterCondition(ROWS[0], age, {
        columnId: 'age',
        operator: 'notEquals',
        value: '31',
      }),
    ).toBe(true);
  });

  it('should compare text case-insensitively across booleans and nullish', () => {
    const active: SolarisTableFilterableColumn<Record<string, unknown>> = {
      id: 'active',
    };
    expect(
      matchesTableFilterCondition({ active: true }, active, {
        columnId: 'active',
        operator: 'equals',
        value: 'TRUE',
      }),
    ).toBe(true);
    expect(
      matchesTableFilterCondition({ active: false }, active, {
        columnId: 'active',
        operator: 'notEquals',
        value: 'true',
      }),
    ).toBe(true);
    expect(
      matchesTableFilterCondition(ROWS[0], COLUMNS[2], {
        columnId: 'city',
        operator: 'equals',
        value: 'SÃO PAULO',
      }),
    ).toBe(true);
    expect(
      matchesTableFilterCondition(ROWS[0], COLUMNS[2], {
        columnId: 'city',
        operator: 'notEquals',
        value: 'SÃO PAULO',
      }),
    ).toBe(false);
    const nick: SolarisTableFilterableColumn<Record<string, unknown>> = {
      id: 'nick',
    };
    expect(
      matchesTableFilterCondition({ nick: null }, nick, {
        columnId: 'nick',
        operator: 'equals',
        value: 'x',
      }),
    ).toBe(false);
    expect(
      matchesTableFilterCondition({ nick: null }, nick, {
        columnId: 'nick',
        operator: 'notEquals',
        value: 'x',
      }),
    ).toBe(true);
  });

  it('should read object values as blank text', () => {
    const meta: SolarisTableFilterableColumn<Record<string, unknown>> = {
      id: 'meta',
      accessor: 'meta',
    };
    expect(
      matchesTableFilterCondition({ meta: { tag: 'x' } }, meta, {
        columnId: 'meta',
        operator: 'contains',
        value: 'x',
      }),
    ).toBe(false);
    expect(
      matchesTableFilterCondition({ meta: { tag: 'x' } }, meta, {
        columnId: 'meta',
        operator: 'isEmpty',
      }),
    ).toBe(false);
  });

  it('should order with lt and lte', () => {
    const age = COLUMNS[1];
    expect(
      matchesTableFilterCondition(ROWS[0], age, {
        columnId: 'age',
        operator: 'lt',
        value: 31,
      }),
    ).toBe(true);
    expect(
      matchesTableFilterCondition(ROWS[0], age, {
        columnId: 'age',
        operator: 'lt',
        value: 30,
      }),
    ).toBe(false);
    expect(
      matchesTableFilterCondition(ROWS[0], age, {
        columnId: 'age',
        operator: 'lte',
        value: 30,
      }),
    ).toBe(true);
  });

  it('should enforce both between bounds', () => {
    const age = COLUMNS[1];
    expect(
      matchesTableFilterCondition(ROWS[0], age, {
        columnId: 'age',
        operator: 'between',
        value: { from: 35 },
      }),
    ).toBe(false);
    expect(
      matchesTableFilterCondition(ROWS[0], age, {
        columnId: 'age',
        operator: 'between',
        value: { from: 20 },
      }),
    ).toBe(true);
    expect(
      matchesTableFilterCondition(ROWS[0], age, {
        columnId: 'age',
        operator: 'between',
        value: { to: 40 },
      }),
    ).toBe(true);
    expect(
      matchesTableFilterCondition(ROWS[0], age, {
        columnId: 'age',
        operator: 'between',
        value: { from: 20, to: 40 },
      }),
    ).toBe(true);
    expect(
      matchesTableFilterCondition(ROWS[0], age, {
        columnId: 'age',
        operator: 'between',
        value: { from: 20, to: 29 },
      }),
    ).toBe(false);
  });

  it('should accept single values for in and notIn', () => {
    expect(
      matchesTableFilterCondition(ROWS[0], COLUMNS[2], {
        columnId: 'city',
        operator: 'in',
        value: 'São Paulo',
      }),
    ).toBe(true);
    expect(
      matchesTableFilterCondition(ROWS[0], COLUMNS[2], {
        columnId: 'city',
        operator: 'notIn',
        value: 'Curitiba',
      }),
    ).toBe(true);
  });

  it('should treat empty in and notIn lists as no-ops', () => {
    expect(
      matchesTableFilterCondition(ROWS[0], COLUMNS[2], {
        columnId: 'city',
        operator: 'in',
        value: [],
      }),
    ).toBe(true);
    expect(
      matchesTableFilterCondition(ROWS[0], COLUMNS[2], {
        columnId: 'city',
        operator: 'notIn',
        value: [],
      }),
    ).toBe(true);
    expect(
      isConditionEffective({
        columnId: 'city',
        operator: 'in',
        value: null,
      }),
    ).toBe(false);
    expect(
      isConditionEffective({ columnId: 'city', operator: 'notIn', value: '' }),
    ).toBe(false);
  });

  it('should keep the defensive empty-list guards', () => {
    // The effectiveness pre-check normally short-circuits empty lists, so
    // sequenced reads force the inner guards inside the matchers.
    let inReads = 0;
    const inCondition: SolarisTableFilterCondition = {
      columnId: 'city',
      operator: 'in',
      get value() {
        inReads += 1;
        return inReads === 1 ? ['são paulo'] : [];
      },
    };
    expect(matchesTableFilterCondition(ROWS[0], COLUMNS[2], inCondition)).toBe(
      true,
    );

    let notInReads = 0;
    const notInCondition: SolarisTableFilterCondition = {
      columnId: 'city',
      operator: 'notIn',
      get value() {
        notInReads += 1;
        return notInReads === 1 ? ['curitiba'] : [];
      },
    };
    expect(
      matchesTableFilterCondition(ROWS[0], COLUMNS[2], notInCondition),
    ).toBe(true);
  });

  it('should ignore unknown operators', () => {
    expect(
      matchesTableFilterCondition(ROWS[0], COLUMNS[1], {
        columnId: 'age',
        operator: 'unknown' as never,
        value: 30,
      }),
    ).toBe(true);
  });

  it('should treat non-finite numbers as missing numbers', () => {
    const age = COLUMNS[1];
    expect(
      matchesTableFilterCondition(ROWS[0], age, {
        columnId: 'age',
        operator: 'equals',
        value: Number.POSITIVE_INFINITY,
      }),
    ).toBe(false);
    expect(
      matchesTableFilterCondition(
        { age: Number.POSITIVE_INFINITY },
        age as unknown as SolarisTableFilterableColumn<Record<string, number>>,
        {
          columnId: 'age',
          operator: 'equals',
          value: Number.POSITIVE_INFINITY,
        },
      ),
    ).toBe(true);
  });
});

describe('ordered comparisons across numbers, dates and text', () => {
  const at: SolarisTableFilterableColumn<Record<string, unknown>> = {
    id: 'at',
  };

  it('should compare numbers against numeric strings', () => {
    expect(
      matchesTableFilterCondition(ROWS[0], COLUMNS[1], {
        columnId: 'age',
        operator: 'gt',
        value: '29',
      }),
    ).toBe(true);
    expect(
      matchesTableFilterCondition(ROWS[0], COLUMNS[1], {
        columnId: 'age',
        operator: 'lt',
        value: '31',
      }),
    ).toBe(true);
  });

  it('should order dates and date strings by time', () => {
    expect(
      matchesTableFilterCondition(
        { at: new Date('2024-02-01T00:00:00Z') },
        at,
        { columnId: 'at', operator: 'gt', value: '2024-01-01' },
      ),
    ).toBe(true);
    expect(
      matchesTableFilterCondition(
        { at: new Date('2024-01-01T00:00:00Z') },
        at,
        {
          columnId: 'at',
          operator: 'lt',
          value: '2024-02-01',
        },
      ),
    ).toBe(true);
    expect(
      matchesTableFilterCondition(
        { at: new Date('2024-01-01T00:00:00Z') },
        at,
        { columnId: 'at', operator: 'lte', value: '2024-01-01' },
      ),
    ).toBe(true);
  });

  it('should fall back to text for invalid dates and non-date values', () => {
    expect(
      matchesTableFilterCondition({ at: 'not-a-date' }, at, {
        columnId: 'at',
        operator: 'gt',
        value: '2024-01-01',
      }),
    ).toBe(true);
    expect(
      matchesTableFilterCondition({ at: new Date(Number.NaN) }, at, {
        columnId: 'at',
        operator: 'lt',
        value: '2024-01-01',
      }),
    ).toBe(true);
    expect(
      matchesTableFilterCondition({ at: 5 }, at, {
        columnId: 'at',
        operator: 'gt',
        value: '2024-01-01',
      }),
    ).toBe(true);
  });

  it('should compare a scalar against an array condition value', () => {
    const tags: SolarisTableFilterableColumn<Record<string, unknown>> = {
      id: 'tags',
    };
    expect(
      matchesTableFilterCondition({ tags: 'a' }, tags, {
        columnId: 'tags',
        operator: 'gt',
        value: ['a'],
      }),
    ).toBe(true);
  });

  it('should treat equal text as ordered-equal', () => {
    expect(
      matchesTableFilterCondition(ROWS[0], COLUMNS[2], {
        columnId: 'city',
        operator: 'gte',
        value: 'SÃO PAULO',
      }),
    ).toBe(true);
    expect(
      matchesTableFilterCondition(ROWS[0], COLUMNS[2], {
        columnId: 'city',
        operator: 'lte',
        value: 'são paulo',
      }),
    ).toBe(true);
    expect(
      matchesTableFilterCondition(ROWS[0], COLUMNS[2], {
        columnId: 'city',
        operator: 'gt',
        value: 'SÃO PAULO',
      }),
    ).toBe(false);
  });

  it('should compare arrays as blank text', () => {
    const tags: SolarisTableFilterableColumn<Record<string, unknown>> = {
      id: 'tags',
    };
    expect(
      matchesTableFilterCondition({ tags: [] }, tags, {
        columnId: 'tags',
        operator: 'lt',
        value: 'a',
      }),
    ).toBe(true);
    expect(
      matchesTableFilterCondition({ tags: [] }, tags, {
        columnId: 'tags',
        operator: 'gt',
        value: 'a',
      }),
    ).toBe(false);
    expect(
      matchesTableFilterCondition({ tags: [] }, tags, {
        columnId: 'tags',
        operator: 'lte',
        value: '',
      }),
    ).toBe(true);
    expect(
      matchesTableFilterCondition({ tags: [] }, tags, {
        columnId: 'tags',
        operator: 'gte',
        value: '',
      }),
    ).toBe(true);
  });
});

describe('isEmpty and isNotEmpty value shapes', () => {
  const nick: SolarisTableFilterableColumn<Record<string, unknown>> = {
    id: 'nick',
  };

  it('should treat nullish, blank text and empty arrays as empty', () => {
    expect(
      matchesTableFilterCondition({ nick: null }, nick, {
        columnId: 'nick',
        operator: 'isEmpty',
      }),
    ).toBe(true);
    expect(
      matchesTableFilterCondition({}, nick, {
        columnId: 'nick',
        operator: 'isEmpty',
      }),
    ).toBe(true);
    expect(
      matchesTableFilterCondition({ nick: '   ' }, nick, {
        columnId: 'nick',
        operator: 'isEmpty',
      }),
    ).toBe(true);
    expect(
      matchesTableFilterCondition({ nick: [] }, nick, {
        columnId: 'nick',
        operator: 'isEmpty',
      }),
    ).toBe(true);
  });

  it('should treat filled values as not empty', () => {
    expect(
      matchesTableFilterCondition(ROWS[0], COLUMNS[2], {
        columnId: 'city',
        operator: 'isEmpty',
      }),
    ).toBe(false);
    expect(
      matchesTableFilterCondition({ nick: ['a'] }, nick, {
        columnId: 'nick',
        operator: 'isEmpty',
      }),
    ).toBe(false);
    expect(
      matchesTableFilterCondition({ nick: 0 }, nick, {
        columnId: 'nick',
        operator: 'isEmpty',
      }),
    ).toBe(false);
    expect(
      matchesTableFilterCondition({ nick: 0 }, nick, {
        columnId: 'nick',
        operator: 'isNotEmpty',
      }),
    ).toBe(true);
  });
});

describe('column order helper edge cases', () => {
  const ids = (columns: readonly { id: string }[]): readonly string[] =>
    columns.map((column) => column.id);

  it('should skip order ids without a matching column', () => {
    expect(
      ids(
        applyColumnOrder(
          COLUMNS,
          ['city', 'ghost', 'name'],
          (column) => column.id,
        ),
      ),
    ).toEqual(['city', 'name', 'age']);
  });

  it('should return columns untouched when order is empty', () => {
    expect(applyColumnOrder(COLUMNS, [], (column) => column.id)).toBe(COLUMNS);
  });

  it('should return the same order when the column is missing', () => {
    const order = ['a', 'b'];
    expect(moveColumnInOrder(order, 'z', 1)).toBe(order);
  });

  it('should move a column down', () => {
    expect(moveColumnInOrder(['a', 'b', 'c'], 'a', 1)).toEqual(['b', 'a', 'c']);
  });

  it('should append when the target is missing', () => {
    expect(insertColumnBefore(['a', 'b'], 'a', 'missing')).toEqual(['b', 'a']);
  });

  it('should insert a dragged column that is not yet ordered', () => {
    expect(insertColumnBefore(['a', 'b'], 'c', 'a')).toEqual(['c', 'a', 'b']);
  });

  it('should keep the derived order helper covered', () => {
    expect(ids(COLUMNS)).toEqual(['name', 'age', 'city']);
  });
});

describe('parseTableFilterState edge cases', () => {
  it('should return null for valid JSON that is not an object', () => {
    expect(parseTableFilterState('"just a string"')).toBeNull();
    expect(parseTableFilterState('42')).toBeNull();
    expect(parseTableFilterState('null')).toBeNull();
  });
});

describe('persisted state storage branches', () => {
  const KEY = 'solaris-test-filter-branches';

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it('should return null when no storage is available', () => {
    vi.stubGlobal('localStorage', undefined);
    expect(readPersistedTableFilterState(KEY)).toBeNull();
  });

  it('should return null when accessing storage throws', () => {
    const descriptor = Object.getOwnPropertyDescriptor(
      globalThis,
      'localStorage',
    );
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      get(): never {
        throw new Error('denied');
      },
    });
    try {
      expect(readPersistedTableFilterState(KEY)).toBeNull();
    } finally {
      if (descriptor) {
        Object.defineProperty(globalThis, 'localStorage', descriptor);
      }
    }
  });

  it('should return null when reading throws', () => {
    vi.stubGlobal('localStorage', {
      getItem(): never {
        throw new Error('denied');
      },
    });
    expect(readPersistedTableFilterState(KEY)).toBeNull();
  });

  it('should ignore writes without a key or storage', () => {
    const state = normalizeTableFilterState({ globalSearch: 'ana' });
    expect(() =>
      writePersistedTableFilterState(undefined, state),
    ).not.toThrow();
    vi.stubGlobal('localStorage', undefined);
    expect(() => writePersistedTableFilterState(KEY, state)).not.toThrow();
  });

  it('should swallow write errors', () => {
    const state = normalizeTableFilterState({ globalSearch: 'ana' });
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem(): never {
        throw new Error('denied');
      },
    });
    expect(() => writePersistedTableFilterState(KEY, state)).not.toThrow();
  });
});
