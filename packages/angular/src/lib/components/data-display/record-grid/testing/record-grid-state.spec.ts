import {
  buildFormulaGraph,
  buildRecordGridColumns,
  normalizeRecordValue,
  resolveBodySpans,
  resolveRecordValues,
  resolveSectionGroups,
  SolarisRecordGridFormulaError,
  topoSortFormulaColumns,
} from '../model/record-grid.types';
import {
  normalizeRecordGridCellPadding,
  normalizeRecordGridStripedMode,
} from '../model/record-grid.defaults';
import type { SolarisRecordGridColumn } from '../model/record-grid.types';

interface FixtureRow {
  id: string;
  section: string | null;
  present: number | null;
  project: number | null;
}

const COLUMNS: readonly SolarisRecordGridColumn<FixtureRow>[] = [
  { id: 'present', header: 'Present', accessor: 'present', type: 'number' },
  { id: 'project', header: 'Project', accessor: 'project', type: 'number' },
  {
    id: 'total',
    header: 'Total',
    type: 'number',
    computed: { from: ['present', 'project'], by: 'sum' },
  },
];

const ROWS: readonly FixtureRow[] = [
  { id: 'a', section: 's1', present: 8, project: 7 },
  { id: 'b', section: 's1', present: null, project: 9 },
  { id: 'c', section: 's2', present: 5, project: 5 },
];

describe('normalizeRecordValue', () => {
  it('should read numbers, numeric strings, and nullish values', () => {
    expect(normalizeRecordValue(8)).toBe(8);
    expect(normalizeRecordValue('7.5')).toBe(7.5);
    expect(normalizeRecordValue(null)).toBeNull();
    expect(normalizeRecordValue(undefined)).toBeNull();
    expect(normalizeRecordValue('')).toBeNull();
    expect(normalizeRecordValue('abc')).toBeNull();
  });
});

describe('buildFormulaGraph', () => {
  it('should map computed columns to their dependencies', () => {
    const graph = buildFormulaGraph(COLUMNS);
    expect(graph.get('total')).toEqual(['present', 'project']);
    expect(graph.has('present')).toBe(false);
  });

  it('should reject dependencies on unknown columns', () => {
    const columns: readonly SolarisRecordGridColumn<FixtureRow>[] = [
      {
        id: 'total',
        header: 'Total',
        computed: { from: ['ghost'], by: 'sum' },
      },
    ];
    try {
      buildFormulaGraph(columns);
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(SolarisRecordGridFormulaError);
      expect((error as SolarisRecordGridFormulaError).reason).toBe(
        'unknown-column',
      );
    }
  });
});

describe('topoSortFormulaColumns', () => {
  it('should order computed columns after their computed dependencies', () => {
    const columns: readonly SolarisRecordGridColumn<FixtureRow>[] = [
      { id: 'present', header: 'Present' },
      {
        id: 'total',
        header: 'Total',
        computed: { from: ['present', 'sub'], by: 'sum' },
      },
      {
        id: 'sub',
        header: 'Sub',
        computed: { from: ['present'], by: 'average' },
      },
    ];
    expect(topoSortFormulaColumns(columns)).toEqual(['sub', 'total']);
  });

  it('should detect dependency cycles', () => {
    const columns: readonly SolarisRecordGridColumn<FixtureRow>[] = [
      { id: 'a', header: 'A', computed: { from: ['b'], by: 'sum' } },
      { id: 'b', header: 'B', computed: { from: ['a'], by: 'sum' } },
    ];
    try {
      topoSortFormulaColumns(columns);
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(SolarisRecordGridFormulaError);
      expect((error as SolarisRecordGridFormulaError).reason).toBe('cycle');
      expect(
        (error as SolarisRecordGridFormulaError).columns.length,
      ).toBeGreaterThan(0);
    }
  });
});

describe('resolveRecordValues', () => {
  it('should compute formula columns in topological order', () => {
    const resolved = resolveRecordValues({ present: 8, project: 7 }, COLUMNS);
    expect(resolved['total']).toBe(15);
  });

  it('should skip missing inputs and return null without present values', () => {
    const resolved = resolveRecordValues(
      { present: null, project: 9 },
      COLUMNS,
    );
    expect(resolved['total']).toBe(9);
    const empty = resolveRecordValues({ present: null }, COLUMNS);
    expect(empty['total']).toBeNull();
  });

  it('should chain computed columns through intermediate results', () => {
    const columns: readonly SolarisRecordGridColumn<FixtureRow>[] = [
      { id: 'present', header: 'Present' },
      {
        id: 'doubled',
        header: 'Doubled',
        computed: { from: ['present'], by: 'sum' },
      },
      {
        id: 'quadrupled',
        header: 'Quadrupled',
        computed: { from: ['doubled'], by: 'sum' },
      },
    ];
    const resolved = resolveRecordValues({ present: 4 }, columns);
    expect(resolved['doubled']).toBe(4);
    expect(resolved['quadrupled']).toBe(4);
  });

  it('should weight formula inputs', () => {
    const columns: readonly SolarisRecordGridColumn<FixtureRow>[] = [
      { id: 'present', header: 'Present' },
      { id: 'project', header: 'Project' },
      {
        id: 'final',
        header: 'Final',
        computed: {
          from: ['present', 'project'],
          by: 'weighted',
          weights: { present: 2, project: 1 },
        },
      },
    ];
    const resolved = resolveRecordValues({ present: 8, project: 5 }, columns);
    expect(resolved['final']).toBeCloseTo(7, 5);
  });
});

describe('resolveSectionGroups', () => {
  it('should group rows by section in first-seen order', () => {
    const groups = resolveSectionGroups(ROWS, (row) => row.section);
    expect(groups.map((group) => group.sectionId)).toEqual(['s1', 's2']);
    expect(groups[0]?.rows.map((row) => row.id)).toEqual(['a', 'b']);
    expect(groups[1]?.rows.map((row) => row.id)).toEqual(['c']);
  });
});

describe('resolveBodySpans', () => {
  it('should merge rowspan origins and mark covered cells', () => {
    const columns: readonly SolarisRecordGridColumn<FixtureRow>[] = [
      {
        id: 'section',
        header: 'Section',
        rowspanOf: (_row, index) => (index === 0 ? 2 : 1),
      },
      { id: 'present', header: 'Present', accessor: 'present' },
    ];
    const grid = resolveBodySpans(ROWS, columns);
    expect(grid[0]?.[0]?.rowSpan).toBe(2);
    expect(grid[0]?.[0]?.covered).toBe(false);
    expect(grid[1]?.[0]?.covered).toBe(true);
    expect(grid[2]?.[0]?.covered).toBe(false);
    expect(grid[0]?.[1]?.covered).toBe(false);
  });

  it('should merge colspan origins and clamp to the grid edges', () => {
    const columns: readonly SolarisRecordGridColumn<FixtureRow>[] = [
      { id: 'present', header: 'Present', accessor: 'present' },
      {
        id: 'note',
        header: 'Note',
        colspanOf: () => 5,
      },
    ];
    const grid = resolveBodySpans([ROWS[0] as FixtureRow], columns);
    expect(grid[0]?.[1]?.colSpan).toBe(1);
    expect(grid[0]?.[1]?.covered).toBe(false);
  });

  it('should skip hidden columns', () => {
    const columns: readonly SolarisRecordGridColumn<FixtureRow>[] = [
      { id: 'ghost', header: 'Ghost', hidden: true },
      { id: 'present', header: 'Present', accessor: 'present' },
    ];
    const grid = resolveBodySpans([ROWS[0] as FixtureRow], columns);
    expect(grid[0]?.length).toBe(1);
    expect(grid[0]?.[0]?.column.id).toBe('present');
  });
});

describe('buildRecordGridColumns', () => {
  it('should drop section assignments for unknown sections', () => {
    const columns = buildRecordGridColumns(
      [{ id: 's1', header: 'Section 1' }],
      [
        { id: 'present', header: 'Present', sectionId: 's1' },
        { id: 'project', header: 'Project', sectionId: 'ghost' },
      ],
    );
    expect(columns[0]?.sectionId).toBe('s1');
    expect(columns[1]?.sectionId).toBeUndefined();
  });
});

describe('record-grid defaults', () => {
  it('should normalize cell padding and striped mode', () => {
    expect(normalizeRecordGridCellPadding('lg')).toBe('lg');
    expect(normalizeRecordGridCellPadding('huge')).toBe('none');
    expect(normalizeRecordGridCellPadding(undefined)).toBe('none');
    expect(normalizeRecordGridStripedMode('odd')).toBe('odd');
    expect(normalizeRecordGridStripedMode('sideways')).toBe('even');
  });
});
