import { resolveCellValue } from '../../table/model/table-state';
import type { SolarisTableColumn } from '../../table/model/table.types';
import type { SolarisBadgeColor } from '../../badge/model/badge.types';

export const SOLARIS_GRADEBOOK_SCALES = [
  'score-10',
  'score-100',
  'concept',
  'custom',
] as const;

export type SolarisGradebookScale = (typeof SOLARIS_GRADEBOOK_SCALES)[number];

export const SOLARIS_GRADEBOOK_CELL_STATUSES = [
  'missing',
  'late',
  'excused',
  'graded',
] as const;

export type SolarisGradebookCellStatus =
  (typeof SOLARIS_GRADEBOOK_CELL_STATUSES)[number];

export interface SolarisGradebookScaleDef {
  readonly id: string;
  readonly format: (
    value: number | null,
    maxScore: number,
    locale?: string,
    rounding?: SolarisGradebookRounding,
  ) => string | null;
  readonly parse?: (text: string) => number | null;
  readonly sortValueOf: (value: number | null) => number | null;
  readonly bands?: readonly SolarisGradebookBand[];
  readonly passingScore?: number | null;
}

export interface SolarisGradebookBand {
  readonly min: number;
  readonly label?: string;
  readonly labelKey?: string;
}

export function resolveGradeBand(
  scale: SolarisGradebookScaleDef,
  value: number | null,
): SolarisGradebookBand | null {
  if (value === null || !Number.isFinite(value)) {
    return null;
  }
  const bands = scale.bands;
  if (!bands || bands.length === 0) {
    return null;
  }
  let matched: SolarisGradebookBand | null = null;
  for (const band of bands) {
    if (value >= band.min) {
      matched = band;
    }
  }
  return matched;
}

export function isPassingGrade(
  scale: SolarisGradebookScaleDef,
  value: number | null,
): boolean | null {
  if (value === null || !Number.isFinite(value)) {
    return null;
  }
  const passingScore = scale.passingScore;
  if (passingScore === undefined || passingScore === null) {
    return null;
  }
  return value >= passingScore;
}

export interface SolarisGradebookRounding {
  readonly maximumFractionDigits?: number;
  readonly mode?: 'half-up' | 'half-even' | 'up' | 'down';
}

const ROUNDING_TOLERANCE = 1e-9;

function roundScaled(
  value: number,
  maximumFractionDigits: number,
  mode: SolarisGradebookRounding['mode'],
): number {
  const factor = 10 ** maximumFractionDigits;
  const scaled = value * factor;
  const sign = scaled < 0 ? -1 : 1;
  const abs = Math.abs(scaled);
  switch (mode) {
    case 'up':
      return sign * Math.ceil(abs - ROUNDING_TOLERANCE);
    case 'down':
      return sign * Math.floor(abs + ROUNDING_TOLERANCE);
    case 'half-even': {
      const floor = Math.floor(abs);
      const diff = abs - floor;
      if (diff < 0.5 - ROUNDING_TOLERANCE) {
        return sign * floor;
      }
      if (diff > 0.5 + ROUNDING_TOLERANCE) {
        return sign * (floor + 1);
      }
      return sign * (floor % 2 === 0 ? floor : floor + 1);
    }
    case 'half-up':
    default: {
      const floor = Math.floor(abs + ROUNDING_TOLERANCE);
      return (
        sign * (abs - floor >= 0.5 - ROUNDING_TOLERANCE ? floor + 1 : floor)
      );
    }
  }
}

function formatScore(
  value: number | null,
  maximumFractionDigits: number,
  locale: string,
  rounding?: SolarisGradebookRounding,
): string | null {
  if (value === null || !Number.isFinite(value)) {
    return null;
  }
  const digits = rounding?.maximumFractionDigits ?? maximumFractionDigits;
  const rounded =
    rounding?.mode === undefined
      ? value
      : roundScaled(value, digits, rounding.mode) / 10 ** digits;
  try {
    return new Intl.NumberFormat(locale, {
      maximumFractionDigits: digits,
    }).format(rounded);
  } catch {
    return String(rounded);
  }
}

function parseScore(text: string): number | null {
  const trimmed = text.trim().replace(',', '.');
  if (trimmed === '') {
    return null;
  }
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

export const SOLARIS_GRADEBOOK_SCORE_10_SCALE: SolarisGradebookScaleDef = {
  id: 'score-10',
  format: (value, _maxScore, locale = 'en-US', rounding) =>
    formatScore(value, 2, locale, rounding),
  parse: parseScore,
  sortValueOf: (value) => value,
};

export const SOLARIS_GRADEBOOK_SCORE_100_SCALE: SolarisGradebookScaleDef = {
  id: 'score-100',
  format: (value, _maxScore, locale = 'en-US', rounding) =>
    formatScore(value, 1, locale, rounding),
  parse: parseScore,
  sortValueOf: (value) => value,
};

const CONCEPT_LETTERS: Record<string, number> = {
  A: 4,
  B: 3,
  C: 2,
  D: 1,
  F: 0,
};

const CONCEPT_NUMBERS: Record<number, string> = {
  4: 'A',
  3: 'B',
  2: 'C',
  1: 'D',
  0: 'F',
};

export const SOLARIS_GRADEBOOK_CONCEPT_SCALE: SolarisGradebookScaleDef = {
  id: 'concept',
  format: (value) => {
    if (value === null || !Number.isInteger(value)) {
      return null;
    }
    return CONCEPT_NUMBERS[value] ?? null;
  },
  parse: (text) => {
    const letter = text.trim().toUpperCase();
    if (letter === '') {
      return null;
    }
    return CONCEPT_LETTERS[letter] ?? null;
  },
  sortValueOf: (value) => value,
};

export function resolveGradebookScale(
  scale: SolarisGradebookScale | undefined,
  custom: SolarisGradebookScaleDef | undefined,
): SolarisGradebookScaleDef {
  if (scale === 'custom' && custom) {
    return custom;
  }
  switch (scale) {
    case 'score-10':
      return SOLARIS_GRADEBOOK_SCORE_10_SCALE;
    case 'concept':
      return SOLARIS_GRADEBOOK_CONCEPT_SCALE;
    case 'score-100':
    default:
      return SOLARIS_GRADEBOOK_SCORE_100_SCALE;
  }
}

export function normalizeGradeValue(value: unknown): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const numeric = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

export interface SolarisGradebookAssignment {
  readonly id: string;
  readonly title: string;
  readonly titleKey?: string;
  readonly groupId?: string;
  readonly maxScore: number;
  readonly weight?: number;
}

export interface SolarisGradebookIdentity<T = unknown> {
  readonly header?: string;
  readonly headerKey?: string;
  readonly displayValueOf: (row: T) => string | null;
}

export type SolarisGradebookEditableOf<T = unknown> = (
  row: T,
  assignmentId: string,
) => boolean;

export interface SolarisGradebookRow {
  readonly scores: Readonly<Record<string, number | null>>;
}

export interface SolarisGradebookLegendItem {
  readonly label?: string;
  readonly labelKey?: string;
  readonly color: SolarisBadgeColor;
}

export interface SolarisGradebookColumn<T = unknown>
  extends SolarisTableColumn<T> {
  readonly assignmentId?: string;
  readonly maxScore?: number;
  readonly weight?: number;
  readonly status?: boolean;
  readonly hint?: string;
  readonly hintKey?: string;
  readonly aggregate?: SolarisGradebookAggregate;
  readonly computed?: SolarisGradebookComputed;
  readonly band?: boolean;
}

export interface SolarisGradebookComputed {
  readonly from: readonly string[];
  readonly by: 'average' | 'weighted' | 'sum' | 'min' | 'max';
  readonly weights?: Readonly<Record<string, number>>;
}

export type SolarisGradebookScoresOf<T = unknown> = (
  row: T,
) => Readonly<Record<string, unknown>>;

export function defaultScoresOf<T>(row: T): Readonly<Record<string, unknown>> {
  if (typeof row === 'object' && row !== null && 'scores' in row) {
    const scores = (row as Record<string, unknown>)['scores'];
    if (typeof scores === 'object' && scores !== null) {
      return scores as Readonly<Record<string, unknown>>;
    }
  }
  return {};
}

export function computeRowGrade(
  scores: Readonly<Record<string, unknown>>,
  computed: SolarisGradebookComputed,
): number | null {
  const entries = computed.from.map((id) => ({
    value: normalizeGradeValue(scores[id]),
    weight: computed.weights?.[id] ?? 1,
  }));
  const present = entries.filter(
    (entry): entry is { value: number; weight: number } =>
      entry.value !== null &&
      Number.isFinite(entry.weight) &&
      entry.weight !== 0,
  );
  if (present.length === 0) {
    return null;
  }
  switch (computed.by) {
    case 'sum':
      return present.reduce((sum, entry) => sum + entry.value, 0);
    case 'min':
      return Math.min(...present.map((entry) => entry.value));
    case 'max':
      return Math.max(...present.map((entry) => entry.value));
    case 'weighted': {
      const weightTotal = present.reduce((sum, entry) => sum + entry.weight, 0);
      if (weightTotal === 0) {
        return null;
      }
      return (
        present.reduce((sum, entry) => sum + entry.value * entry.weight, 0) /
        weightTotal
      );
    }
    case 'average':
    default:
      return (
        present.reduce((sum, entry) => sum + entry.value, 0) / present.length
      );
  }
}

export const SOLARIS_GRADEBOOK_AGGREGATES = [
  'average',
  'sum',
  'min',
  'max',
  'median',
  'weighted',
  'none',
] as const;

export type SolarisGradebookAggregate =
  (typeof SOLARIS_GRADEBOOK_AGGREGATES)[number];

export interface SolarisGradebookBulkCommit<T = unknown> {
  readonly rowIds: readonly string[];
  readonly assignmentId: string;
  readonly column: SolarisTableColumn<T>;
  readonly value: number | null;
  readonly rows: readonly T[];
}

export function aggregateGradeValues(
  values: readonly (number | null)[],
  aggregate: SolarisGradebookAggregate,
  weights?: readonly (number | null | undefined)[],
): number | null {
  const present = values.filter(
    (value): value is number => value !== null && Number.isFinite(value),
  );
  if (present.length === 0) {
    return null;
  }
  switch (aggregate) {
    case 'sum':
      return present.reduce((sum, value) => sum + value, 0);
    case 'min':
      return Math.min(...present);
    case 'max':
      return Math.max(...present);
    case 'median': {
      const sorted = [...present].sort((left, right) => left - right);
      const middle = Math.floor(sorted.length / 2);
      if (sorted.length % 2 === 1) {
        return sorted[middle] ?? null;
      }
      return ((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2;
    }
    case 'weighted': {
      let weightedSum = 0;
      let weightTotal = 0;
      present.forEach((value, index) => {
        const weight = weights?.[index] ?? 1;
        if (
          weight === null ||
          weight === undefined ||
          !Number.isFinite(weight)
        ) {
          return;
        }
        weightedSum += value * weight;
        weightTotal += weight;
      });
      return weightTotal > 0 ? weightedSum / weightTotal : null;
    }
    case 'none':
      return null;
    case 'average':
    default:
      return present.reduce((sum, value) => sum + value, 0) / present.length;
  }
}

export function formatAggregateValue(
  value: number | null,
  maximumFractionDigits: number,
  locale: string,
  rounding?: SolarisGradebookRounding,
): string | null {
  if (value === null || !Number.isFinite(value)) {
    return null;
  }
  const digits = rounding?.maximumFractionDigits ?? maximumFractionDigits;
  const rounded =
    rounding?.mode === undefined
      ? value
      : roundScaled(value, digits, rounding.mode) / 10 ** digits;
  try {
    return new Intl.NumberFormat(locale, {
      maximumFractionDigits: digits,
    }).format(rounded);
  } catch {
    return String(rounded);
  }
}

export interface SolarisGradebookEditEvent<T = unknown> {
  readonly row: T;
  readonly rowId: string;
  readonly assignmentId: string;
  readonly column: SolarisTableColumn<T>;
}

export interface SolarisGradebookCommitEvent<T = unknown>
  extends SolarisGradebookEditEvent<T> {
  readonly value: number | null;
}

export function gradebookAssignmentIdOf<T>(
  column: Pick<SolarisTableColumn<T>, 'id'> &
    Partial<Pick<SolarisGradebookColumn<T>, 'assignmentId'>>,
): string {
  return column.assignmentId ?? column.id;
}

export function buildGradebookColumns<T extends SolarisGradebookRow>(
  assignments: readonly SolarisGradebookAssignment[],
  options?: { withMaxColumns?: boolean },
): SolarisGradebookColumn<T>[] {
  const columns: SolarisGradebookColumn<T>[] = [];
  for (const assignment of assignments) {
    columns.push({
      id: assignment.id,
      header: assignment.title,
      headerKey: assignment.titleKey,
      type: 'number',
      align: 'end',
      sortable: true,
      headerGroup: assignment.groupId,
      assignmentId: assignment.id,
      maxScore: assignment.maxScore,
      weight: assignment.weight,
      accessor: (row: T) => row.scores[assignment.id] ?? null,
    });
    if (options?.withMaxColumns === true) {
      columns.push({
        id: `${assignment.id}__max`,
        header: 'MÁX',
        type: 'number',
        align: 'end',
        sortable: false,
        headerGroup: assignment.groupId,
        maxScore: assignment.maxScore,
        displayValueOf: () =>
          assignment.maxScore !== undefined
            ? String(assignment.maxScore)
            : null,
        sortValueOf: () => null,
      });
    }
  }
  return columns;
}

export function formatGradeCell<T>(
  row: T,
  column: SolarisTableColumn<T>,
  scale: SolarisGradebookScaleDef,
  locale?: string,
  rounding?: SolarisGradebookRounding,
): string | null {
  const graded = column as SolarisGradebookColumn<T>;
  const value = normalizeGradeValue(resolveCellValue(row, column));
  const formatted = scale.format(
    value,
    graded.maxScore ?? Number.NaN,
    locale,
    rounding,
  );
  if (graded.band !== true || formatted === null) {
    return formatted;
  }
  const band = resolveGradeBand(scale, value);
  const label = band?.label ?? band?.labelKey ?? null;
  return label === null ? formatted : `${formatted} (${label})`;
}
