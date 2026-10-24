import {
  SOLARIS_GRADEBOOK_CONCEPT_SCALE,
  SOLARIS_GRADEBOOK_SCORE_10_SCALE,
  SOLARIS_GRADEBOOK_SCORE_100_SCALE,
  aggregateGradeValues,
  buildGradebookColumns,
  computeRowGrade,
  defaultScoresOf,
  formatGradeCell,
  gradebookAssignmentIdOf,
  isPassingGrade,
  normalizeGradeValue,
  resolveGradeBand,
  resolveGradebookScale,
} from '../model/gradebook.types';
import type {
  SolarisGradebookAssignment,
  SolarisGradebookRow,
} from '../model/gradebook.types';

function columnAt<T>(columns: readonly T[], index: number): T {
  const column = columns[index];
  expect(column).toBeDefined();
  return column as T;
}

const ASSIGNMENTS: readonly SolarisGradebookAssignment[] = [
  { id: 'gs1', title: 'GS1', groupId: 's1', maxScore: 20 },
  { id: 'mp', title: 'MP', groupId: 'result', maxScore: 100 },
];

interface FixtureRow extends SolarisGradebookRow {
  id: string;
}

const ROW: FixtureRow = { id: 'a', scores: { gs1: 18, mp: 85.9 } };

describe('resolveGradebookScale', () => {
  it('should resolve known scales', () => {
    expect(resolveGradebookScale('score-10', undefined).id).toBe('score-10');
    expect(resolveGradebookScale('concept', undefined).id).toBe('concept');
  });

  it('should fall back to score-100 for unknown or missing custom def', () => {
    expect(resolveGradebookScale(undefined, undefined).id).toBe('score-100');
    expect(resolveGradebookScale('custom', undefined).id).toBe('score-100');
  });

  it('should use the custom def when provided', () => {
    const custom = {
      id: 'custom',
      format: () => 'x',
      sortValueOf: () => 0,
    };
    expect(resolveGradebookScale('custom', custom)).toBe(custom);
  });
});

describe('normalizeGradeValue', () => {
  it('should return null for empty values', () => {
    expect(normalizeGradeValue(null)).toBeNull();
    expect(normalizeGradeValue(undefined)).toBeNull();
    expect(normalizeGradeValue('')).toBeNull();
    expect(normalizeGradeValue('abc')).toBeNull();
  });

  it('should keep finite numbers', () => {
    expect(normalizeGradeValue(18)).toBe(18);
    expect(normalizeGradeValue('85.9')).toBe(85.9);
  });
});

describe('score scales', () => {
  it('should format score-100 with one fraction digit', () => {
    expect(SOLARIS_GRADEBOOK_SCORE_100_SCALE.format(85.9, 100, 'en-US')).toBe(
      '85.9',
    );
  });

  it('should format score-10 with two fraction digits', () => {
    expect(SOLARIS_GRADEBOOK_SCORE_10_SCALE.format(11.25, 10, 'en-US')).toBe(
      '11.25',
    );
  });

  it('should return null for null values', () => {
    expect(SOLARIS_GRADEBOOK_SCORE_100_SCALE.format(null, 100)).toBeNull();
  });

  it('should parse scores and sort nulls last', () => {
    expect(SOLARIS_GRADEBOOK_SCORE_100_SCALE.parse?.('')).toBeNull();
    expect(SOLARIS_GRADEBOOK_SCORE_100_SCALE.parse?.('18')).toBe(18);
    expect(SOLARIS_GRADEBOOK_SCORE_100_SCALE.sortValueOf(null)).toBeNull();
    expect(SOLARIS_GRADEBOOK_SCORE_100_SCALE.sortValueOf(18)).toBe(18);
  });
});

describe('concept scale', () => {
  it('should map numbers to letters', () => {
    expect(SOLARIS_GRADEBOOK_CONCEPT_SCALE.format(4, 4)).toBe('A');
    expect(SOLARIS_GRADEBOOK_CONCEPT_SCALE.format(0, 4)).toBe('F');
    expect(SOLARIS_GRADEBOOK_CONCEPT_SCALE.format(null, 4)).toBeNull();
    expect(SOLARIS_GRADEBOOK_CONCEPT_SCALE.format(2.5, 4)).toBeNull();
  });

  it('should parse letters case-insensitively', () => {
    expect(SOLARIS_GRADEBOOK_CONCEPT_SCALE.parse?.('b')).toBe(3);
    expect(SOLARIS_GRADEBOOK_CONCEPT_SCALE.parse?.('')).toBeNull();
    expect(SOLARIS_GRADEBOOK_CONCEPT_SCALE.parse?.('Z')).toBeNull();
  });
});

describe('buildGradebookColumns', () => {
  it('should build sortable number columns with assignment metadata', () => {
    const columns = buildGradebookColumns<FixtureRow>(ASSIGNMENTS);
    expect(columns).toHaveLength(2);
    expect(columnAt(columns, 0)).toMatchObject({
      id: 'gs1',
      header: 'GS1',
      type: 'number',
      align: 'end',
      sortable: true,
      headerGroup: 's1',
      assignmentId: 'gs1',
      maxScore: 20,
    });
    const accessor = columnAt(columns, 0).accessor;
    expect(typeof accessor === 'function' ? accessor(ROW) : null).toBe(18);
  });

  it('should append readonly max columns when requested', () => {
    const columns = buildGradebookColumns<FixtureRow>(ASSIGNMENTS, {
      withMaxColumns: true,
    });
    expect(columns).toHaveLength(4);
    expect(columnAt(columns, 1)).toMatchObject({
      id: 'gs1__max',
      sortable: false,
    });
  });
});

describe('aggregateGradeValues', () => {
  it('should average ignoring nulls', () => {
    expect(aggregateGradeValues([10, null, 20], 'average')).toBe(15);
  });

  it('should return null when every value is null', () => {
    expect(aggregateGradeValues([null, null], 'average')).toBeNull();
    expect(aggregateGradeValues([null], 'sum')).toBeNull();
  });

  it('should support sum min max median and weighted', () => {
    expect(aggregateGradeValues([10, 20], 'sum')).toBe(30);
    expect(aggregateGradeValues([10, 20], 'min')).toBe(10);
    expect(aggregateGradeValues([10, 20], 'max')).toBe(20);
    expect(aggregateGradeValues([10, 20, 30], 'median')).toBe(20);
    expect(aggregateGradeValues([10, 20], 'median')).toBe(15);
    expect(aggregateGradeValues([10, 20], 'weighted', [1, 3])).toBe(17.5);
  });
});

describe('gradebookAssignmentIdOf', () => {
  it('should prefer assignmentId over column id', () => {
    expect(gradebookAssignmentIdOf({ id: 'col', assignmentId: 'gs1' })).toBe(
      'gs1',
    );
    expect(gradebookAssignmentIdOf({ id: 'col' })).toBe('col');
  });
});

describe('formatGradeCell', () => {
  it('should format the accessor value with the scale', () => {
    const columns = buildGradebookColumns<FixtureRow>(ASSIGNMENTS);
    expect(
      formatGradeCell(
        ROW,
        columnAt(columns, 1),
        SOLARIS_GRADEBOOK_SCORE_100_SCALE,
        'en-US',
      ),
    ).toBe('85.9');
  });

  it('should return null for missing grades', () => {
    const columns = buildGradebookColumns<FixtureRow>(ASSIGNMENTS);
    const empty: FixtureRow = { id: 'b', scores: {} };
    expect(
      formatGradeCell(
        empty,
        columnAt(columns, 0),
        SOLARIS_GRADEBOOK_SCORE_100_SCALE,
        'en-US',
      ),
    ).toBeNull();
  });

  it('should apply the rounding mode when provided', () => {
    const columns = buildGradebookColumns<FixtureRow>(ASSIGNMENTS);
    const row: FixtureRow = { id: 'c', scores: { mp: 87.85 } };
    expect(
      formatGradeCell(
        row,
        columnAt(columns, 1),
        SOLARIS_GRADEBOOK_SCORE_100_SCALE,
        'en-US',
        {
          maximumFractionDigits: 1,
          mode: 'down',
        },
      ),
    ).toBe('87.8');
    expect(
      formatGradeCell(
        row,
        columnAt(columns, 1),
        SOLARIS_GRADEBOOK_SCORE_100_SCALE,
        'en-US',
        {
          maximumFractionDigits: 1,
          mode: 'up',
        },
      ),
    ).toBe('87.9');
  });

  it('should append the band label when requested', () => {
    const banded = {
      ...SOLARIS_GRADEBOOK_SCORE_100_SCALE,
      bands: [
        { min: 0, label: 'F' },
        { min: 60, label: 'D' },
      ],
    };
    const columns = buildGradebookColumns<FixtureRow>(ASSIGNMENTS);
    const column = { ...columnAt(columns, 1), band: true as const };
    expect(formatGradeCell(ROW, column, banded, 'en-US')).toBe('85.9 (D)');
  });
});

describe('computeRowGrade', () => {
  it('should average the referenced assignments ignoring nulls', () => {
    expect(
      computeRowGrade(
        { gs1: 18, gs2: null },
        { from: ['gs1', 'gs2'], by: 'average' },
      ),
    ).toBe(18);
    expect(
      computeRowGrade(
        { gs1: 10, gs2: 20 },
        { from: ['gs1', 'gs2'], by: 'average' },
      ),
    ).toBe(15);
  });

  it('should weight parts when requested', () => {
    expect(
      computeRowGrade(
        { ftat: 10, gs1: 20 },
        { from: ['ftat', 'gs1'], by: 'weighted', weights: { ftat: 1, gs1: 3 } },
      ),
    ).toBe(17.5);
  });

  it('should return null when every part is missing', () => {
    expect(
      computeRowGrade({}, { from: ['gs1', 'gs2'], by: 'average' }),
    ).toBeNull();
  });
});

describe('defaultScoresOf', () => {
  it('should read the scores record of SolarisGradebookRow rows', () => {
    expect(defaultScoresOf(ROW)).toEqual({ gs1: 18, mp: 85.9 });
  });

  it('should return an empty record for foreign shapes', () => {
    expect(defaultScoresOf({ id: 'x' })).toEqual({});
  });
});

describe('resolveGradeBand and isPassingGrade', () => {
  const banded = {
    ...SOLARIS_GRADEBOOK_SCORE_100_SCALE,
    passingScore: 60,
    bands: [
      { min: 0, label: 'F' },
      { min: 60, label: 'D' },
      { min: 70, label: 'C' },
    ],
  };

  it('should resolve the highest matching band', () => {
    expect(resolveGradeBand(banded, 85.9)?.label).toBe('C');
    expect(resolveGradeBand(banded, 59.9)?.label).toBe('F');
    expect(resolveGradeBand(banded, null)).toBeNull();
  });

  it('should compare against the passing score', () => {
    expect(isPassingGrade(banded, 60)).toBe(true);
    expect(isPassingGrade(banded, 59.9)).toBe(false);
    expect(isPassingGrade(banded, null)).toBeNull();
    expect(isPassingGrade(SOLARIS_GRADEBOOK_SCORE_100_SCALE, 90)).toBeNull();
  });
});
