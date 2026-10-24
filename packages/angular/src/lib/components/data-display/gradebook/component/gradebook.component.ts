import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  contentChild,
  contentChildren,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { SolarisTranslateService } from '../../../../services/translation';
import { GradebookAutofocusDirective } from '../directives/gradebook-autofocus.directive';
import { SolarisBadgeComponent } from '../../badge';
import type { SolarisBadgeColor } from '../../badge';
import { SolarisTooltipDirective } from '../../../interaction/tooltip';
import {
  SolarisTableComponent,
  SolarisTableCellDirective,
  SolarisTableCellEditorDirective,
  SolarisTableDetailDirective,
  SolarisTableEmptyDirective,
  SolarisTableErrorDirective,
  SolarisTableFooterCellDirective,
  SolarisTableFooterDirective,
  SolarisTableHeaderDirective,
  SolarisTableLoadingDirective,
  SolarisTableToolbarDirective,
  resolveCellValue,
  isTableDataSource,
} from '../../table';
import type {
  SolarisTableAppearance,
  SolarisTableCellEditEvent,
  SolarisTableCellPadding,
  SolarisTableColumn,
  SolarisTableDataSource,
  SolarisTableDensity,
  SolarisTableExpandMode,
  SolarisTableHeaderGroup,
  SolarisTableLayout,
  SolarisTableRadius,
  SolarisTableRowClickEvent,
  SolarisTableSelectionChange,
  SolarisTableSelectionMode,
  SolarisTableSort,
  SolarisTableStripedMode,
} from '../../table';
import {
  aggregateGradeValues,
  computeRowGrade,
  defaultScoresOf,
  formatAggregateValue,
  formatGradeCell,
  gradebookAssignmentIdOf,
  normalizeGradeValue,
  resolveGradebookScale,
} from '../model/gradebook.types';
import type {
  SolarisGradebookAggregate,
  SolarisGradebookBulkCommit,
  SolarisGradebookCellStatus,
  SolarisGradebookColumn,
  SolarisGradebookCommitEvent,
  SolarisGradebookEditEvent,
  SolarisGradebookEditableOf,
  SolarisGradebookIdentity,
  SolarisGradebookRounding,
  SolarisGradebookScale,
  SolarisGradebookScaleDef,
  SolarisGradebookScoresOf,
} from '../model/gradebook.types';

export const SOLARIS_GRADEBOOK_EDITOR_TEMPLATE_ID = 'solaris-gradebook-editor';
export const SOLARIS_GRADEBOOK_STATUS_TEMPLATE_ID = 'solaris-gradebook-status';
export const SOLARIS_GRADEBOOK_HEADER_TEMPLATE_ID = 'solaris-gradebook-header';
export const SOLARIS_GRADEBOOK_CELL_TEMPLATE_ID = 'solaris-gradebook-cell';
export const SOLARIS_GRADEBOOK_IDENTITY_COLUMN_ID =
  'solaris-gradebook-identity';

const GRADEBOOK_EDITOR_LABEL_FALLBACK = 'Edit grade';
const GRADEBOOK_EDITOR_LABEL_FALLBACK_KEY =
  'solaris.dataDisplay.gradebook.editorLabel';
const GRADEBOOK_EDITOR_LABEL_LEGACY_KEY = 'gradebook.editor.label';

const GRADEBOOK_STATUS_LABELS: Record<SolarisGradebookCellStatus, string> = {
  graded: '',
  missing: 'Missing',
  late: 'Late',
  excused: 'Excused',
};

function defaultStatusColor(value: string): SolarisBadgeColor {
  const normalized = value.trim().toLowerCase();
  if (
    normalized === 'aprovado' ||
    normalized === 'aprovada' ||
    normalized === 'approved'
  ) {
    return 'success';
  }
  if (
    normalized === 'exame' ||
    normalized === 'exam' ||
    normalized === 'recuperação' ||
    normalized === 'recuperacao'
  ) {
    return 'warning';
  }
  if (
    normalized === 'reprovado' ||
    normalized === 'reprovada' ||
    normalized === 'failed'
  ) {
    return 'danger';
  }
  return 'neutral';
}

@Component({
  selector: 'solaris-gradebook',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    GradebookAutofocusDirective,
    SolarisTableComponent,
    SolarisTableCellDirective,
    SolarisTableCellEditorDirective,
    SolarisTableDetailDirective,
    SolarisTableEmptyDirective,
    SolarisTableErrorDirective,
    SolarisTableFooterCellDirective,
    SolarisTableFooterDirective,
    SolarisTableHeaderDirective,
    SolarisTableLoadingDirective,
    SolarisTableToolbarDirective,
    SolarisTooltipDirective,
    SolarisBadgeComponent,
  ],
  templateUrl: './gradebook.component.html',
  styleUrls: ['./gradebook.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-gradebook',
    '[attr.data-density]': 'density()',
  },
})
export class SolarisGradebookComponent<T = unknown> {
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });

  readonly cellTemplates = contentChildren(SolarisTableCellDirective);
  readonly headerTemplates = contentChildren(SolarisTableHeaderDirective);
  readonly detailTemplates = contentChildren(SolarisTableDetailDirective);
  readonly footerCellTemplates = contentChildren(
    SolarisTableFooterCellDirective,
  );
  readonly editorTemplates = contentChildren(SolarisTableCellEditorDirective);
  readonly emptyTemplate = contentChild(SolarisTableEmptyDirective);
  readonly errorTemplate = contentChild(SolarisTableErrorDirective);
  readonly loadingTemplate = contentChild(SolarisTableLoadingDirective);
  readonly footerTemplate = contentChild(SolarisTableFooterDirective);
  readonly toolbarTemplate = contentChild(SolarisTableToolbarDirective);

  readonly data = input<SolarisTableDataSource<T> | readonly T[]>([]);
  readonly columns = input<readonly SolarisGradebookColumn<T>[]>([]);
  readonly headerGroups = input<readonly SolarisTableHeaderGroup[]>([]);
  readonly rowId = input.required<
    keyof T | ((row: T, index: number) => string)
  >();
  readonly sort = model<SolarisTableSort | null>(null);
  readonly selectedRowIds = model<readonly string[]>([]);
  readonly selectionMode = input<SolarisTableSelectionMode>('none');
  readonly loading = input(false, { transform: booleanAttribute });
  readonly error = input<string | null>(null);
  readonly errorKey = input<string | null>(null);
  readonly emptyText = input<string | null>(null);
  readonly emptyTextKey = input<string | null>(null);
  readonly loadingText = input<string | null>(null);
  readonly loadingTextKey = input<string | null>(null);
  readonly appearance = input<SolarisTableAppearance>('grid');
  readonly radius = input<SolarisTableRadius>('md');
  readonly striped = input(false, { transform: booleanAttribute });
  readonly stripedMode = input<SolarisTableStripedMode>('even');
  readonly stickyFirstColumn = input(true, { transform: booleanAttribute });
  readonly stickyLastColumn = input(false, { transform: booleanAttribute });
  readonly bulkEnabled = input(false, { transform: booleanAttribute });
  readonly enablePaste = input(false, { transform: booleanAttribute });
  readonly hover = input(true, { transform: booleanAttribute });
  readonly rowClickable = input(false, { transform: booleanAttribute });
  readonly expandable = input(false, { transform: booleanAttribute });
  readonly expandMode = input<SolarisTableExpandMode>('row');
  readonly layout = input<SolarisTableLayout>('auto');
  readonly cardTitleOf = input<((row: T) => string | null) | undefined>(
    undefined,
  );
  readonly cardSubtitleOf = input<((row: T) => string | null) | undefined>(
    undefined,
  );
  readonly fullWidth = input(false, { transform: booleanAttribute });
  readonly cellPadding = input<SolarisTableCellPadding>('none');
  readonly density = input<SolarisTableDensity | undefined>(undefined);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelKey = input<string | undefined>(undefined);

  readonly scale = input<SolarisGradebookScale>('score-100');
  readonly scaleDef = input<SolarisGradebookScaleDef | undefined>(undefined);
  readonly rounding = input<SolarisGradebookRounding | undefined>(undefined);
  readonly scoresOf = input<SolarisGradebookScoresOf<T>>(defaultScoresOf);
  readonly gradeStatusOf = input<
    (row: T, assignmentId: string) => SolarisGradebookCellStatus
  >(() => 'graded');
  readonly identity = input<SolarisGradebookIdentity<T> | undefined>(undefined);
  readonly excusedEditable = input(false, { transform: booleanAttribute });
  readonly editableOf = input<SolarisGradebookEditableOf<T> | undefined>(
    undefined,
  );
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly editorLabel = input<string | null>(null);
  readonly editorLabelKey = input<string | null>(null);
  readonly statusColorOf = input<
    ((value: string) => SolarisBadgeColor) | undefined
  >(undefined);

  readonly selectionChange = output<SolarisTableSelectionChange<T>>();
  readonly rowClick = output<SolarisTableRowClickEvent<T>>();
  readonly gradeEditStart = output<SolarisGradebookEditEvent<T>>();
  readonly gradeEditEnd = output<SolarisGradebookEditEvent<T>>();
  readonly gradeCommit = output<SolarisGradebookCommitEvent<T>>();
  readonly gradeBulkCommit = output<SolarisGradebookBulkCommit<T>>();
  readonly gradePasteError = output<{
    readonly rowId: string | null;
    readonly assignmentId: string;
    readonly text: string;
  }>();

  protected readonly effectiveScale = computed(() =>
    resolveGradebookScale(this.scale(), this.scaleDef()),
  );

  protected readonly editable = computed(
    () => !this.readonly() && !this.disabled(),
  );

  protected readonly resolvedColumns = computed(
    (): readonly SolarisTableColumn<T>[] => {
      const scale = this.effectiveScale();
      const locale = this.translateService?.locale() ?? 'en-US';
      const editable = this.editable();
      const identity = this.identity();
      const resolved: SolarisTableColumn<T>[] = [];
      if (identity) {
        resolved.push({
          id: SOLARIS_GRADEBOOK_IDENTITY_COLUMN_ID,
          header: identity.header,
          headerKey: identity.headerKey,
          accessor: () => null,
          displayValueOf: (row) => identity.displayValueOf(row),
          sortValueOf: (row) => identity.displayValueOf(row),
        });
      }
      for (const column of this.columns()) {
        resolved.push(
          this.resolveColumn(
            column,
            scale,
            locale,
            editable,
            this.rounding(),
            this.scoresOf(),
          ),
        );
      }
      return resolved;
    },
  );

  protected readonly resolvedCardTitleOf = computed(
    (): ((row: T) => string | null) | undefined => {
      const explicit = this.cardTitleOf();
      if (explicit) {
        return explicit;
      }
      const identity = this.identity();
      if (identity) {
        return (row) => identity.displayValueOf(row);
      }
      return undefined;
    },
  );

  private resolveColumn(
    column: SolarisGradebookColumn<T>,
    scale: SolarisGradebookScaleDef,
    locale: string,
    editable: boolean,
    rounding: SolarisGradebookRounding | undefined,
    scoresOf: SolarisGradebookScoresOf<T>,
  ): SolarisTableColumn<T> {
    const withTemplates = this.applyInternalTemplates(column);
    if (!this.isGradeColumn(column)) {
      return withTemplates;
    }
    const assignmentId = gradebookAssignmentIdOf(column);
    const statusOf = this.gradeStatusOf();
    const graded = column as SolarisGradebookColumn<T>;
    const aggregate = graded.aggregate;
    const computed = graded.computed;
    const base: SolarisTableColumn<T> =
      computed !== undefined && withTemplates.accessor === undefined
        ? {
            ...withTemplates,
            accessor: (row) => computeRowGrade(scoresOf(row), computed),
          }
        : withTemplates;
    return {
      ...base,
      type: base.type ?? 'number',
      align: base.align ?? 'end',
      sortable: base.sortable ?? true,
      displayValueOf:
        base.displayValueOf ??
        ((row) =>
          this.formatCellText(
            row,
            { ...column, accessor: base.accessor },
            scale,
            locale,
            statusOf,
            assignmentId,
            rounding,
          )),
      sortValueOf:
        base.sortValueOf ??
        ((row) => {
          if (statusOf(row, assignmentId) === 'excused') {
            return null;
          }
          return scale.sortValueOf(
            normalizeGradeValue(resolveCellValue(row, base)),
          );
        }),
      footerValueOf:
        base.footerValueOf ??
        (aggregate !== undefined && aggregate !== 'none'
          ? (rows) =>
              this.formatAggregate(
                rows,
                base,
                aggregate,
                scale,
                locale,
                rounding,
              )
          : undefined),
      editorTemplateId:
        base.editorTemplateId ??
        (editable && computed === undefined
          ? SOLARIS_GRADEBOOK_EDITOR_TEMPLATE_ID
          : undefined),
    };
  }

  private formatAggregate(
    rows: readonly T[],
    column: SolarisTableColumn<T>,
    aggregate: SolarisGradebookAggregate,
    scale: SolarisGradebookScaleDef,
    locale: string,
    rounding: SolarisGradebookRounding | undefined,
  ): string | null {
    const graded = column as SolarisGradebookColumn<T>;
    const values = rows.map((row) =>
      normalizeGradeValue(resolveCellValue(row, column)),
    );
    const weights =
      aggregate === 'weighted' ? rows.map(() => graded.weight ?? 1) : undefined;
    const result = aggregateGradeValues(values, aggregate, weights);
    if (result === null) {
      return null;
    }
    if (scale.id === 'concept') {
      return scale.format(
        Math.round(result),
        graded.maxScore ?? Number.NaN,
        locale,
      );
    }
    const fractionDigits = scale.id === 'score-10' ? 2 : 1;
    return formatAggregateValue(result, fractionDigits, locale, rounding);
  }

  private isGradeColumn(column: SolarisGradebookColumn<T>): boolean {
    return column.assignmentId !== undefined;
  }

  private applyInternalTemplates(
    column: SolarisGradebookColumn<T>,
  ): SolarisTableColumn<T> {
    let resolved: SolarisTableColumn<T> = column;
    if (
      this.isGradeColumn(column) &&
      !column.cellTemplateId &&
      column.status !== true
    ) {
      resolved = {
        ...resolved,
        cellTemplateId: SOLARIS_GRADEBOOK_CELL_TEMPLATE_ID,
      };
    }
    if (column.status === true && !column.cellTemplateId) {
      resolved = {
        ...resolved,
        cellTemplateId: SOLARIS_GRADEBOOK_STATUS_TEMPLATE_ID,
      };
    }
    if (column.status === true && column.align === undefined) {
      resolved = {
        ...resolved,
        align: 'center',
      };
    }
    if (
      (column.hint !== undefined || column.hintKey !== undefined) &&
      !column.headerTemplateId
    ) {
      resolved = {
        ...resolved,
        headerTemplateId: SOLARIS_GRADEBOOK_HEADER_TEMPLATE_ID,
      };
    }
    return resolved;
  }

  protected headerLabel(column: SolarisTableColumn<T>): string {
    if (column.header !== undefined) {
      return column.header;
    }
    const key = column.headerKey;
    if (key && this.translateService) {
      const translated = this.translateService.translate(key);
      if (translated !== key) {
        return translated;
      }
    }
    return key ?? column.id;
  }

  protected headerHint(column: SolarisTableColumn<T>): string | undefined {
    const graded = column as SolarisGradebookColumn<T>;
    if (graded.hint !== undefined) {
      return graded.hint;
    }
    const key = graded.hintKey;
    if (key && this.translateService) {
      const translated = this.translateService.translate(key);
      if (translated !== key) {
        return translated;
      }
    }
    return key;
  }

  protected assignmentIdOf(column: SolarisTableColumn<T>): string {
    return gradebookAssignmentIdOf(column);
  }

  protected cellStatus(row: T, column: SolarisTableColumn<T>): string {
    return this.gradeStatusOf()(row, this.assignmentIdOf(column));
  }

  protected isCellLocked(row: T, column: SolarisTableColumn<T>): boolean {
    if (this.readonly() || this.disabled()) {
      return true;
    }
    const editableOf = this.editableOf();
    if (editableOf && !editableOf(row, this.assignmentIdOf(column))) {
      return true;
    }
    return (
      this.cellStatus(row, column) === 'excused' && !this.excusedEditable()
    );
  }

  protected lockedCellText(row: T, column: SolarisTableColumn<T>): string {
    const locale = this.translateService?.locale() ?? 'en-US';
    return (
      formatGradeCell(
        row,
        column,
        this.effectiveScale(),
        locale,
        this.rounding(),
      ) ?? '—'
    );
  }

  protected formattedCellText(row: T, column: SolarisTableColumn<T>): string {
    return this.lockedCellText(row, column);
  }

  protected editorInputType(): string {
    return this.effectiveScale().id === 'concept' ? 'text' : 'number';
  }

  protected editorMax(column: SolarisTableColumn<T>): number | null {
    const maxScore = (column as SolarisGradebookColumn<T>).maxScore;
    return maxScore ?? null;
  }

  protected editorRawValue(value: unknown): string {
    const normalized = normalizeGradeValue(value);
    return normalized === null ? '' : String(normalized);
  }

  protected commitEditor(
    row: T,
    rowId: string,
    column: SolarisTableColumn<T>,
    text: string,
    close: () => void,
  ): void {
    const trimmed = text.trim();
    if (trimmed === '') {
      this.emitCommit(row, rowId, column, null);
      close();
      return;
    }
    const scale = this.effectiveScale();
    const normalized = trimmed.replace(',', '.');
    const parsed = scale.parse ? scale.parse(normalized) : Number(normalized);
    if (parsed === null || !Number.isFinite(parsed)) {
      return;
    }
    const maxScore = (column as SolarisGradebookColumn<T>).maxScore;
    let next = parsed;
    if (next < 0) {
      next = 0;
    }
    if (
      maxScore !== undefined &&
      Number.isFinite(maxScore) &&
      next > maxScore
    ) {
      next = maxScore;
    }
    this.emitCommit(row, rowId, column, next);
    close();
  }

  private emitCommit(
    row: T,
    rowId: string,
    column: SolarisTableColumn<T>,
    value: number | null,
  ): void {
    this.gradeCommit.emit({
      row,
      rowId,
      assignmentId: this.assignmentIdOf(column),
      column,
      value,
    });
  }

  protected onEditStart(event: SolarisTableCellEditEvent<T>): void {
    this.gradeEditStart.emit({
      row: event.row,
      rowId: event.rowId,
      assignmentId: this.assignmentIdOf(event.column),
      column: event.column,
    });
  }

  protected onEditEnd(event: SolarisTableCellEditEvent<T>): void {
    this.gradeEditEnd.emit({
      row: event.row,
      rowId: event.rowId,
      assignmentId: this.assignmentIdOf(event.column),
      column: event.column,
    });
  }

  protected statusColor(value: unknown): SolarisBadgeColor {
    const text = String(value ?? '');
    return this.statusColorOf()?.(text) ?? defaultStatusColor(text);
  }

  protected resolvedEditorLabel(): string {
    const direct = this.editorLabel();
    if (direct) {
      return direct;
    }
    const key = this.editorLabelKey() ?? GRADEBOOK_EDITOR_LABEL_FALLBACK_KEY;
    if (this.translateService) {
      const translated = this.translateService.translate(key);
      if (translated !== key) {
        return translated;
      }
      if (key === GRADEBOOK_EDITOR_LABEL_FALLBACK_KEY) {
        const legacy = this.translateService.translate(
          GRADEBOOK_EDITOR_LABEL_LEGACY_KEY,
        );
        if (legacy !== GRADEBOOK_EDITOR_LABEL_LEGACY_KEY) {
          return legacy;
        }
      }
    }
    if (this.editorLabelKey()) {
      return key;
    }
    return GRADEBOOK_EDITOR_LABEL_FALLBACK;
  }

  protected cellStatusAttr(
    row: T,
    column: SolarisTableColumn<T>,
  ): SolarisGradebookCellStatus | null {
    if (!this.isGradeColumn(column as SolarisGradebookColumn<T>)) {
      return null;
    }
    return this.gradeStatusOf()(row, this.assignmentIdOf(column));
  }

  protected cellStatusLabel(
    row: T,
    column: SolarisTableColumn<T>,
  ): string | null {
    const status = this.cellStatusAttr(row, column);
    if (status === null || status === 'graded') {
      return null;
    }
    return this.statusText(status);
  }

  private statusText(status: SolarisGradebookCellStatus): string {
    if (this.translateService) {
      const key = `solaris.dataDisplay.gradebook.status.${status}`;
      const translated = this.translateService.translate(key);
      if (translated !== key) {
        return translated;
      }
      const legacyKey = `gradebook.status.${status}`;
      const legacy = this.translateService.translate(legacyKey);
      if (legacy !== legacyKey) {
        return legacy;
      }
    }
    return GRADEBOOK_STATUS_LABELS[status] ?? status;
  }

  private formatCellText(
    row: T,
    column: SolarisTableColumn<T>,
    scale: SolarisGradebookScaleDef,
    locale: string,
    statusOf: (row: T, assignmentId: string) => SolarisGradebookCellStatus,
    assignmentId: string,
    rounding: SolarisGradebookRounding | undefined,
  ): string | null {
    const formatted =
      formatGradeCell(row, column, scale, locale, rounding) ?? '—';
    const status = statusOf(row, assignmentId);
    if (status === 'graded') {
      return formatted === '—' ? null : formatted;
    }
    return `${this.statusText(status)} - ${formatted}`;
  }

  commitBulk(
    rowIds: readonly string[],
    assignmentId: string,
    value: number | null,
  ): void {
    if (!this.bulkEnabled() || this.readonly() || this.disabled()) {
      return;
    }
    const column = this.resolvedColumns().find(
      (candidate) => this.assignmentIdOf(candidate) === assignmentId,
    );
    if (!column) {
      return;
    }
    const rowsById = new Map<string, T>();
    for (const row of this.visibleRowsOf()) {
      rowsById.set(this.resolveRowIdOf(row), row);
    }
    const rows = rowIds
      .map((rowId) => rowsById.get(rowId))
      .filter((row): row is T => row !== undefined);
    if (rows.length === 0) {
      return;
    }
    this.gradeBulkCommit.emit({
      rowIds: rows.map((row) => this.resolveRowIdOf(row)),
      assignmentId,
      column,
      value,
      rows,
    });
  }

  private visibleRowsOf(): readonly T[] {
    const data = this.data();
    if (isTableDataSource(data)) {
      return data.rows();
    }
    return data;
  }

  private resolveRowIdOf(row: T): string {
    const rowId = this.rowId();
    if (typeof rowId === 'function') {
      return String((rowId as (value: T, index: number) => string)(row, 0));
    }
    return String((row as Record<string, unknown>)[rowId as string] ?? '');
  }

  protected handlePaste(
    event: ClipboardEvent,
    assignmentId: string,
    startRowId: string,
  ): void {
    if (!this.enablePaste() || this.readonly() || this.disabled()) {
      return;
    }
    const text = event.clipboardData?.getData('text/plain');
    if (!text) {
      return;
    }
    const values = text
      .split(/\r?\n/)
      .map((line) => line.split('\t')[0]?.trim() ?? '')
      .filter((line) => line.length > 0);
    if (values.length === 0) {
      return;
    }
    event.preventDefault();
    const rows = this.visibleRowsOf();
    const startIndex = rows.findIndex(
      (row) => this.resolveRowIdOf(row) === startRowId,
    );
    const scale = this.effectiveScale();
    values.forEach((raw, offset) => {
      const row = rows[startIndex + offset];
      if (!row) {
        return;
      }
      const rowId = this.resolveRowIdOf(row);
      if (raw === '') {
        this.emitCommit(row, rowId, this.requireColumn(assignmentId), null);
        return;
      }
      const parsed = scale.parse ? scale.parse(raw) : Number(raw);
      if (parsed === null || !Number.isFinite(parsed)) {
        this.gradePasteError.emit({ rowId, assignmentId, text: raw });
        return;
      }
      this.emitCommit(row, rowId, this.requireColumn(assignmentId), parsed);
    });
  }

  private requireColumn(assignmentId: string): SolarisTableColumn<T> {
    const column = this.resolvedColumns().find(
      (candidate) => this.assignmentIdOf(candidate) === assignmentId,
    );
    if (!column) {
      throw new Error(`Unknown assignment ${assignmentId}`);
    }
    return column;
  }
}
