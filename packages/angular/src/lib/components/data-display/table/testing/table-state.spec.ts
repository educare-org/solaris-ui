import { signal } from '@angular/core';

import {
  clampPageIndex,
  createClientTableDataSource,
  createServerTableDataSource,
  resolveCellValue,
  resolveDisplayValue,
  resolveFooterValue,
  resolveHeaderGroupSpans,
  resolveRowId,
  resolveRows,
  resolveSortValue,
  sliceRows,
  sortRows,
} from '../model/table-state';
import type { SolarisTableColumn } from '../model/table.types';

interface Person {
  id: string;
  name: string;
  age: number | null;
}

const COLUMNS: readonly SolarisTableColumn<Person>[] = [
  { id: 'name', header: 'Name', accessor: 'name', sortable: true },
  { id: 'age', header: 'Age', accessor: 'age', type: 'number', sortable: true },
];

const ROWS: readonly Person[] = [
  { id: 'b', name: 'Beto', age: 30 },
  { id: 'a', name: 'ana', age: null },
  { id: 'c', name: 'Carlos', age: 25 },
];

function resolved() {
  return resolveRows(ROWS, 'id');
}

describe('resolveRowId', () => {
  it('should resolve by key', () => {
    expect(resolveRowId(ROWS[0], 'id', 0)).toBe('b');
  });

  it('should resolve by function', () => {
    expect(resolveRowId(ROWS[0], (row) => `row-${row.id}`, 0)).toBe('row-b');
  });

  it('should fall back to the index', () => {
    expect(resolveRowId({} as Person, 'id' as keyof Person, 7)).toBe('7');
  });
});

describe('resolveCellValue / resolveDisplayValue', () => {
  it('should read the accessor key', () => {
    expect(resolveCellValue(ROWS[0], COLUMNS[0])).toBe('Beto');
  });

  it('should read the accessor function', () => {
    expect(
      resolveCellValue(ROWS[0], {
        id: 'upper',
        accessor: (row: Person) => row.name.toUpperCase(),
      }),
    ).toBe('BETO');
  });

  it('should prefer displayValueOf', () => {
    expect(
      resolveDisplayValue(ROWS[0], {
        id: 'name',
        accessor: 'name',
        displayValueOf: () => 'Custom',
      }),
    ).toBe('Custom');
  });

  it('should return null for empty values', () => {
    expect(
      resolveDisplayValue({ id: 'x', name: '', age: null }, COLUMNS[0]),
    ).toBe(null);
  });
});

describe('sortRows', () => {
  it('should sort ascending case-insensitively', () => {
    const sorted = sortRows(resolved(), COLUMNS, {
      columnId: 'name',
      direction: 'asc',
    });
    expect(sorted.map((row) => row.rowId)).toEqual(['a', 'b', 'c']);
  });

  it('should sort descending', () => {
    const sorted = sortRows(resolved(), COLUMNS, {
      columnId: 'name',
      direction: 'desc',
    });
    expect(sorted.map((row) => row.rowId)).toEqual(['c', 'b', 'a']);
  });

  it('should keep null values last in both directions', () => {
    const asc = sortRows(resolved(), COLUMNS, {
      columnId: 'age',
      direction: 'asc',
    });
    expect(asc.map((row) => row.rowId)).toEqual(['c', 'b', 'a']);
    const desc = sortRows(resolved(), COLUMNS, {
      columnId: 'age',
      direction: 'desc',
    });
    expect(desc[desc.length - 1].rowId).toBe('a');
  });

  it('should be stable on ties', () => {
    const rows = resolveRows(
      [
        { id: 'x', name: 'Same', age: 1 },
        { id: 'y', name: 'same', age: 2 },
      ],
      'id',
    );
    const sorted = sortRows(rows, COLUMNS, {
      columnId: 'name',
      direction: 'asc',
    });
    expect(sorted.map((row) => row.rowId)).toEqual(['x', 'y']);
  });

  it('should ignore non-sortable columns', () => {
    const columns: readonly SolarisTableColumn<Person>[] = [
      { id: 'name', accessor: 'name' },
    ];
    const sorted = sortRows(resolved(), columns, {
      columnId: 'name',
      direction: 'asc',
    });
    expect(sorted.map((row) => row.rowId)).toEqual(['b', 'a', 'c']);
  });

  it('should return rows untouched without sort', () => {
    expect(sortRows(resolved(), COLUMNS, null)).toEqual(resolved());
  });

  it('should use sortValueOf over the accessor', () => {
    const columns: readonly SolarisTableColumn<Person>[] = [
      {
        id: 'name',
        accessor: 'name',
        sortable: true,
        sortValueOf: (row) => row.id,
      },
    ];
    const sorted = sortRows(resolved(), columns, {
      columnId: 'name',
      direction: 'asc',
    });
    expect(sorted.map((row) => row.rowId)).toEqual(['a', 'b', 'c']);
  });
});

describe('sliceRows / clampPageIndex', () => {
  it('should slice the page window', () => {
    expect(sliceRows(resolved(), 1, 2).map((row) => row.rowId)).toEqual(['c']);
  });

  it('should clamp to zero when total is zero', () => {
    expect(clampPageIndex(5, 10, 0)).toBe(0);
  });

  it('should clamp to the last page', () => {
    expect(clampPageIndex(9, 10, 25)).toBe(2);
  });

  it('should not clamp unknown totals', () => {
    expect(clampPageIndex(9, 10, undefined)).toBe(9);
  });

  it('should guard pageSize zero', () => {
    expect(clampPageIndex(0, 0, 10)).toBe(0);
  });
});

describe('adapters', () => {
  it('should sort client rows and expose the total', () => {
    const source = createClientTableDataSource(
      signal(ROWS),
      signal({ columnId: 'name', direction: 'asc' as const }),
      signal(COLUMNS),
      'id',
    );
    expect(source.rows().map((row) => row.name)).toEqual([
      'ana',
      'Beto',
      'Carlos',
    ]);
    expect(source.total()).toBe(3);
    expect(source.loading()).toBe(false);
  });

  it('should pass server signals through', () => {
    const source = createServerTableDataSource(
      signal(ROWS),
      signal<number | undefined>(100),
      signal(true),
    );
    expect(source.rows()).toEqual(ROWS);
    expect(source.total()).toBe(100);
    expect(source.loading()).toBe(true);
  });

  it('should expose resolveSortValue', () => {
    expect(resolveSortValue(ROWS[0], COLUMNS[0])).toBe('beto');
  });
});

describe('resolveFooterValue', () => {
  it('should return null without footerValueOf', () => {
    expect(resolveFooterValue(ROWS, COLUMNS[0])).toBe(null);
  });

  it('should aggregate over all rows', () => {
    const column: SolarisTableColumn<Person> = {
      id: 'age',
      header: 'Age',
      accessor: 'age',
      type: 'number',
      footerValueOf: (rows) =>
        `avg ${rows.reduce((sum, row) => sum + (row.age ?? 0), 0) / rows.length}`,
    };
    expect(resolveFooterValue(ROWS, column)).toBe('avg 18.333333333333332');
  });

  it('should return null for blank aggregates', () => {
    const column: SolarisTableColumn<Person> = {
      id: 'age',
      header: 'Age',
      accessor: 'age',
      footerValueOf: () => '   ',
    };
    expect(resolveFooterValue(ROWS, column)).toBe(null);
  });
});

describe('resolveHeaderGroupSpans', () => {
  it('should return single spans without groups', () => {
    const spans = resolveHeaderGroupSpans<Person, SolarisTableColumn<Person>>(
      COLUMNS,
      [],
    );
    expect(spans.length).toBe(2);
    expect(spans.every((span) => span.group === null)).toBe(true);
  });

  it('should merge consecutive columns of the same group', () => {
    const spans = resolveHeaderGroupSpans<Person, SolarisTableColumn<Person>>(
      [
        { id: 'a', headerGroup: 'g' },
        { id: 'b', headerGroup: 'g' },
        { id: 'c' },
      ],
      [{ id: 'g', header: 'Group' }],
    );
    expect(spans.length).toBe(2);
    expect(spans[0].group?.id).toBe('g');
    expect(spans[0].columns.map((column) => column.id)).toEqual(['a', 'b']);
    expect(spans[1].group).toBe(null);
  });

  it('should split non-consecutive columns of the same group', () => {
    const spans = resolveHeaderGroupSpans<Person, SolarisTableColumn<Person>>(
      [
        { id: 'a', headerGroup: 'g' },
        { id: 'b' },
        { id: 'c', headerGroup: 'g' },
      ],
      [{ id: 'g', header: 'Group' }],
    );
    expect(spans.length).toBe(3);
    expect(spans[0].group?.id).toBe('g');
    expect(spans[1].group).toBe(null);
    expect(spans[2].group?.id).toBe('g');
  });

  it('should treat unknown group ids as ungrouped', () => {
    const spans = resolveHeaderGroupSpans<Person, SolarisTableColumn<Person>>(
      [{ id: 'a', headerGroup: 'missing' }],
      [],
    );
    expect(spans.length).toBe(1);
    expect(spans[0].group).toBe(null);
  });
});

describe('coverage - resolveDisplayValue null inputs', () => {
  it('should return null for null cell values', () => {
    expect(
      resolveDisplayValue({ id: 'x', name: 'Zed', age: null }, COLUMNS[1]),
    ).toBe(null);
  });

  it('should return null for undefined cell values', () => {
    const row = { id: 'x', name: undefined as unknown as string, age: 1 };
    expect(resolveDisplayValue(row, COLUMNS[0])).toBe(null);
  });
});

describe('coverage - normalizeComparable empty strings', () => {
  it('should normalize blank strings to null', () => {
    expect(resolveSortValue({ id: 'x', name: '   ', age: 1 }, COLUMNS[0])).toBe(
      null,
    );
  });

  it('should sort blank names last', () => {
    const rows = resolveRows([...ROWS, { id: 'z', name: '', age: 20 }], 'id');
    const sorted = sortRows(rows, COLUMNS, {
      columnId: 'name',
      direction: 'asc',
    });
    expect(sorted[sorted.length - 1].rowId).toBe('z');
  });
});

describe('coverage - sortRows null stability', () => {
  it('should keep the original order when both values are null', () => {
    const rows = resolveRows(
      [
        { id: 'm', name: 'Zed', age: null },
        { id: 'n', name: 'Amy', age: null },
      ],
      'id',
    );
    const sorted = sortRows(rows, COLUMNS, {
      columnId: 'age',
      direction: 'asc',
    });
    expect(sorted.map((row) => row.rowId)).toEqual(['m', 'n']);
  });
});

describe('coverage - toDateValue via date columns', () => {
  interface DatedRow {
    id: string;
    when: unknown;
  }

  const DATE_COLUMN: SolarisTableColumn<DatedRow> = {
    id: 'when',
    header: 'When',
    accessor: 'when',
    type: 'date',
    sortable: true,
  };

  function dated(
    entries: readonly { id: string; when: unknown }[],
  ): ReturnType<typeof resolveRows<DatedRow>> {
    return resolveRows(
      entries.map((entry) => ({ id: entry.id, when: entry.when })),
      'id',
    );
  }

  it('should use the timestamp for Date instances', () => {
    const date = new Date('2024-03-01T00:00:00.000Z');
    expect(resolveSortValue({ id: 'a', when: date }, DATE_COLUMN)).toBe(
      date.getTime(),
    );
  });

  it('should return null for invalid dates', () => {
    expect(
      resolveSortValue({ id: 'a', when: new Date('not-a-date') }, DATE_COLUMN),
    ).toBe(null);
  });

  it('should keep finite numbers and drop non-finite numbers', () => {
    expect(
      resolveSortValue({ id: 'a', when: 1700000000000 }, DATE_COLUMN),
    ).toBe(1700000000000);
    expect(resolveSortValue({ id: 'a', when: Number.NaN }, DATE_COLUMN)).toBe(
      null,
    );
    expect(
      resolveSortValue(
        { id: 'a', when: Number.POSITIVE_INFINITY },
        DATE_COLUMN,
      ),
    ).toBe(null);
  });

  it('should return null for blank strings', () => {
    expect(resolveSortValue({ id: 'a', when: '' }, DATE_COLUMN)).toBe(null);
    expect(resolveSortValue({ id: 'a', when: '   ' }, DATE_COLUMN)).toBe(null);
  });

  it('should parse date strings to timestamps', () => {
    expect(resolveSortValue({ id: 'a', when: '2024-05-01' }, DATE_COLUMN)).toBe(
      Date.parse('2024-05-01'),
    );
  });

  it('should fall back to the lowercased string for unparseable input', () => {
    expect(resolveSortValue({ id: 'a', when: 'NOT-A-DATE' }, DATE_COLUMN)).toBe(
      'not-a-date',
    );
  });

  it('should return null for other value kinds', () => {
    expect(resolveSortValue({ id: 'a', when: true }, DATE_COLUMN)).toBe(null);
    expect(resolveSortValue({ id: 'a', when: {} }, DATE_COLUMN)).toBe(null);
    expect(resolveSortValue({ id: 'a', when: null }, DATE_COLUMN)).toBe(null);
    expect(resolveSortValue({ id: 'a', when: undefined }, DATE_COLUMN)).toBe(
      null,
    );
  });

  it('should sort valid dates before fallback strings and nulls last', () => {
    const sorted = sortRows(
      dated([
        { id: 'a', when: 'not-a-date-zzz' },
        { id: 'b', when: new Date('2024-01-02T00:00:00.000Z') },
        { id: 'c', when: '2024-01-01T00:00:00.000Z' },
        { id: 'd', when: null },
        { id: 'e', when: Number.NaN },
      ]),
      [DATE_COLUMN],
      { columnId: 'when', direction: 'asc' },
    );
    expect(sorted.map((row) => row.rowId)).toEqual(['c', 'b', 'a', 'd', 'e']);
  });
});
