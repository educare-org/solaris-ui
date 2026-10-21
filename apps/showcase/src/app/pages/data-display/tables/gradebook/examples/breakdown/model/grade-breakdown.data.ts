export interface GradeBreakdownPart {
  readonly labelKey: string;
  readonly value: number | null;
  readonly weight: string;
}

export interface GradeBreakdownData {
  readonly subject: string;
  readonly parts: readonly GradeBreakdownPart[];
  readonly result: number | null;
}
