# Solaris Gradebook

## Purpose

Gradebook displays a grade matrix (rows such as subjects or students versus
assessments) with grouped headers, per-assessment maxima, result columns, and
footer totals. It composes `solaris-table` without copying its types, state,
tokens, or density: sorting, selection, sticky columns, aggregates, header
groups, and cell editing all come from the table. Pagination (`solaris-pagination`
in the table footer slot) and filtering (`solaris-table-toolbar`) stay outside,
by composition.

## When to use

- Presenting grades per subject or student with semester or unit groupings.
- Editing existing grade cells inline (Enter or double-click to open, change/Enter commits, Escape or blur closes).
- Showing result columns (`MP`, `EXA`, `MF`) and a `SITUAÇÃO` badge.
- Server-driven grade data through `SolarisTableDataSource`.

## When not to use

- Do not use Gradebook to create subjects or students inline; that belongs to
  another screen. Gradebook presents rows and edits existing cells only.
- Do not use Gradebook for merged body cells or controlled editing with internal
  commit; that is the future `record-grid`.
- Do not copy table types or state; import them from `@educarehq/solaris-ui`.

## API

### SolarisGradebookComponent

**Selector:** `solaris-gradebook`

| Input                                                        | Type                                                                  | Default            | Description                                                                                               |
| ------------------------------------------------------------ | --------------------------------------------------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------- |
| `data`                                                       | `SolarisTableDataSource<T> \| readonly T[]`                           | `[]`               | Rows or a server data source                                                                              |
| `columns`                                                    | `readonly SolarisGradebookColumn<T>[]`                                | `[]`               | Declared columns; grade columns carry `assignmentId`                                                      |
| `rowId`                                                      | `keyof T \| ((row, index) => string)`                                 | required           | Stable row identity                                                                                       |
| `sort`                                                       | `SolarisTableSort \| null` (model)                                    | `null`             | Controlled sort state                                                                                     |
| `selectedRowIds`                                             | `readonly string[]` (model)                                           | `[]`               | Two-way selected row ids                                                                                  |
| `selectionMode`                                              | `'none' \| 'single' \| 'multiple'`                                    | `'none'`           | Selection behavior                                                                                        |
| `scale`                                                      | `'score-10' \| 'score-100' \| 'concept' \| 'custom'`                  | `'score-100'`      | Grade scale                                                                                               |
| `scaleDef`                                                   | `SolarisGradebookScaleDef \| undefined`                               | `undefined`        | Required when `scale` is `'custom'`; carries optional `bands` + `passingScore`                            |
| `rounding`                                                   | `SolarisGradebookRounding \| undefined`                               | `undefined`        | `{ maximumFractionDigits?, mode?: 'half-up' \| 'half-even' \| 'up' \| 'down' }`; scale default when unset |
| `scoresOf`                                                   | `(row: T) => Record<string, unknown>`                                 | `defaultScoresOf`  | How to read the per-assignment score record; override for foreign row shapes                              |
| `gradeStatusOf`                                              | `(row, assignmentId) => 'missing' \| 'late' \| 'excused' \| 'graded'` | `() => 'graded'`   | Per-cell status (subtle dot + screen-reader label; never color-only)                                      |
| `bulkEnabled` / `enablePaste`                                | `boolean`                                                             | `false`            | Bulk commit for selected rows and TSV paste from spreadsheets                                             |
| `aggregate` (per column)                                     | `'average' \| 'sum' \| 'min' \| 'max' \| 'median' \| 'weighted'`      | —                  | Optional footer aggregation; explicit `footerValueOf` always wins                                         |
| `identity`                                                   | `SolarisGradebookIdentity<T> \| undefined`                            | `undefined`        | Prepended identity column (subject, student, class)                                                       |
| `excusedEditable`                                            | `boolean`                                                             | `false`            | `excused` cells open the editor when `true`                                                               |
| `editableOf`                                                 | `((row, assignmentId) => boolean) \| undefined`                       | `undefined`        | Per-cell permission; returning `false` locks the cell to view-only (formatted text, no input, no commit)  |
| `readonly` / `disabled`                                      | `boolean`                                                             | `false`            | Block editing                                                                                             |
| `editorLabel` / `editorLabelKey`                             | `string \| null`                                                      | `null`             | Editor input label (fallback `Edit grade`)                                                                |
| `statusColorOf`                                              | `((value: string) => SolarisBadgeColor) \| undefined`                 | `undefined`        | Badge color for `status` columns                                                                          |
| `headerGroups`                                               | `readonly SolarisTableHeaderGroup[]`                                  | `[]`               | Semester or unit groupings                                                                                |
| `appearance`                                                 | table appearances                                                     | `'grid'`           | Gradebook defaults to the full cell grid                                                                  |
| `stickyFirstColumn`                                          | `boolean`                                                             | `true`             | Identity stays visible in wide tables                                                                     |
| `stickyLastColumn`                                           | `boolean`                                                             | `false`            | Last column (e.g. result) stays visible in wide tables                                                    |
| `radius`                                                     | table radii                                                           | `'md'`             | Frame corner radius                                                                                       |
| `striped` / `stripedMode`                                    | `boolean` / `'even' \| 'odd'`                                         | `false` / `'even'` | Zebra rows                                                                                                |
| `loading` / `error` / `emptyText` / `loadingText` (+ `*Key`) | table states                                                          | —                  | Parity with the table                                                                                     |
| `density`                                                    | table densities                                                       | inherited          | Density variant                                                                                           |
| `ariaLabel` / `ariaLabelKey`                                 | `string \| undefined`                                                 | `undefined`        | Accessible name                                                                                           |

| Output                            | Type                             | Description                                                             |
| --------------------------------- | -------------------------------- | ----------------------------------------------------------------------- |
| `gradeEditStart` / `gradeEditEnd` | `SolarisGradebookEditEvent<T>`   | Editing opened or closed (`{ row, rowId, assignmentId, column }`)       |
| `gradeCommit`                     | `SolarisGradebookCommitEvent<T>` | Parsed grade value (`{ ..., value }`); persisting is the consumer's job |
| `gradeBulkCommit`                 | `SolarisGradebookBulkCommit<T>`  | Bulk value for selected rows (`{ rowIds, assignmentId, value, rows }`)  |
| `gradePasteError`                 | `{ rowId, assignmentId, text }`  | TSV cell that could not be parsed                                       |
| `selectionChange`                 | `SolarisTableSelectionChange<T>` | Delegated from the table                                                |
| `rowClick`                        | `SolarisTableRowClickEvent<T>`   | Delegated from the table                                                |

### SolarisGradebookColumn

Extends `SolarisTableColumn` with `assignmentId`, `maxScore`, `weight`,
`status`, `hint`, `hintKey`, `aggregate`, `computed`, and `band`. A column with
`assignmentId` is a grade column: it defaults to
`type: 'number'`, `align: 'end'`, `sortable: true`, scale formatting via
`displayValueOf`, null-last sorting via `sortValueOf`, and the internal grade
editor (unless `readonly`/`disabled` or the consumer sets `editorTemplateId`).
A column with `status: true` renders the internal badge cell and defaults to
`align: 'center'` (explicit `align` still wins). A column with
`hint`/`hintKey` renders its header label with a hover tooltip explaining the
assessment (supplementary information only, never the single source of meaning).
A column with `computed: { from, by, weights? }` is a read-only result column
(`MP`): its value is derived per row from the referenced `assignmentId`s via
`scoresOf` (`average` ignores missing parts; `weighted` uses `weights`),
never opens the editor, and still sorts, aggregates in the footer, and shows
status dots. A column with `band: true` appends the scale band label
(`85.9 (B)`). Explicit consumer values always win over these defaults.

### Institution configuration (minimal friction)

A school onboards by declaring data shape only — no fork of the component:

1. **Row shape**: use `SolarisGradebookRow` (`{ scores: Record<assignmentId,
number | null> }`) or keep the institutional shape and provide `scoresOf`.
2. **Assignments**: `buildGradebookColumns(assignments, { withMaxColumns })`
   generates grade columns (`MÁX` included when requested).
3. **Result rule**: add `{ assignmentId: 'mp', computed: { from: ['gs1',
'gs2'], by: 'average' } }` (or `weighted` with `weights`) instead of typing
   `MP` by hand.
4. **Scale**: pick `score-10` / `score-100` / `concept`, or `custom` with
   `bands` (`[{ min: 0, label: 'F' }, { min: 60, label: 'D' }, …]`) and
   `passingScore`; add `band: true` to show the band next to the value.
5. **Rounding**: `[rounding]="{ maximumFractionDigits: 1, mode: 'half-up' }"`
   (`half-even` for banker's rounding, `up`/`down` for always up/down).
6. **Statuses**: `[gradeStatusOf]` maps each cell to
   `graded`/`late`/`missing`/`excused` (dot + whole-cell `title`
   `"<label> - <value>"` + screen-reader label; never color-only).

```typescript
import { SolarisGradebookComponent, buildGradebookColumns, computeRowGrade, isPassingGrade, resolveGradeBand } from '@educarehq/solaris-ui';

const columns = [
  ...buildGradebookColumns(
    [
      { id: 'gs1', title: 'GS1', groupId: 's1', maxScore: 20 },
      { id: 'gs2', title: 'GS2', groupId: 's2', maxScore: 20 },
    ],
    { withMaxColumns: true },
  ),
  {
    id: 'mp',
    header: 'MP',
    assignmentId: 'mp',
    maxScore: 20,
    aggregate: 'average',
    computed: { from: ['gs1', 'gs2'], by: 'average' },
  },
];
```

### Future contracts (specified, not implemented)

- **Audit trail**: every `gradeCommit` / `gradeBulkCommit` should be appendable
  to an institutional log `{ rowId, assignmentId, previousValue, value,
at, actor }`. The component emits enough to build it; persisting stays with
  the consumer (same boundary as grades). Log ids only — never student names,
  emails, or other PII. The `actor` comes from the consumer's auth context,
  never from the component.
- **Draft vs published**: a future `publishState` (`'draft' | 'published'`)
  input will mark whether the matrix is being edited or is visible to
  students/guardians. Until then, gate visibility in the consumer.
- These stay out of `record-grid`: no merged body cells, no reactive formulas
  across arbitrary columns — only the declared `computed.from` dependencies.

## ERP operations (consumer guidance)

No business logic lives in the gradebook; the patterns below stay in consumer code.

- **States**: `loading` / `error` / `emptyText` (+ `*Key`) mirror the table, including slot overrides forwarded to the inner table. Show the empty state for classes without enrolled students, the error state when the grade service fails.
- **Bulk actions**: `bulkEnabled` + `selectionMode="multiple"` commit one value across selected rows via `gradeBulkCommit`; `enablePaste` accepts TSV paste with per-cell `gradePasteError`. Confirm bulk writes before applying — the component never persists.
- **Keyboard-first**: Enter or double-click opens a cell editor, change/Enter commits, Escape or blur closes without committing. Tab moves across cells in reading order; `editableOf` locks view-only cells to text (no focus trap).
- **1000+ rows**: never render unbounded. Page large cohorts with `solaris-pagination` in the table footer slot over a server `SolarisTableDataSource`, or split by class/section. Bulk commit operates on the selected ids within the loaded page.
- **translation growth**: `pt-BR`/`es-419` headers run ~30% longer than `en-US`. Header groups and assessment hints wrap or truncate with tooltips — never clip, never fix widths to English text.
- **Print**: the print baseline is ink-safe (paper background, editor chrome neutralized, status dots as ink outlines; the inner table expands scrollers and hides pagination nav). Print published matrices from the full source rows, not the current page.

### SolarisGradebookLegendComponent

**Selector:** `solaris-gradebook-legend`

| Input                        | Type                                    | Default     | Description                                 |
| ---------------------------- | --------------------------------------- | ----------- | ------------------------------------------- |
| `items`                      | `readonly SolarisGradebookLegendItem[]` | `[]`        | Dotted badges (`{ label/labelKey, color }`) |
| `ariaLabel` / `ariaLabelKey` | `string \| undefined`                   | `undefined` | Accessible list name                        |

### Slots

Consumer templates declared inside `solaris-gradebook` are forwarded to the
inner table: `solaris-table-cell`, `solaris-table-header`,
`solaris-table-detail`, `solaris-table-footer-cell`, `solaris-table-cell-editor`,
`solaris-table-empty`, `solaris-table-error`, `solaris-table-loading`,
`solaris-table-footer` (e.g. `solaris-pagination`), and `solaris-table-toolbar`.
The `solaris-gradebook-editor`, `solaris-gradebook-status`, and
`solaris-gradebook-header` template ids are reserved for the internal defaults.

### Helpers

`buildGradebookColumns(assignments, { withMaxColumns })` builds grade columns for
`SolarisGradebookRow` (`{ scores: Record<string, number | null> }`);
`resolveGradebookScale(scale, custom)` resolves the scale definition;
`normalizeGradeValue(value)` coerces raw values; `formatGradeCell(row, column,
scale, locale, rounding?)` formats one cell (appends `(band)` when the column
sets `band: true`); `computeRowGrade(scores, computed)` derives a result value;
`defaultScoresOf(row)` reads the `scores` record; `aggregateGradeValues(values,
aggregate, weights?)` aggregates a column; `formatAggregateValue(value,
digits, locale, rounding?)` formats a footer; `resolveGradeBand(scale, value)`
returns the matching band; `isPassingGrade(scale, value)` compares against
`passingScore` (`null` when unconfigured).

## Visual variants

Gradebook inherits the table density scale (36/44/52px) and defaults to
`appearance="grid"` with `stickyFirstColumn`. Result columns use `align: 'end'`;
`SITUAÇÃO` uses `align: 'center'` with a badge. `MÁX` columns are readonly
`type: 'number'` with `sortable: false`. The `TOTAL` row is a `<tfoot>` via
`footer`/`footerValueOf`/`footerTemplateId`.

## CSS Variables

Gradebook defines no new tokens. It consumes:

| Token                                                      | Purpose                    |
| ---------------------------------------------------------- | -------------------------- |
| `--solaris-spacing-1`, `--solaris-spacing-2`               | Editor input padding       |
| `--solaris-spacing-13`                                     | Editor input minimum width |
| `--solaris-radius-sm`                                      | Editor input corner radius |
| `--solaris-neutral-default`, `--solaris-neutral-text-body` | Editor background and text |
| `--solaris-neutral-text-secondary`                         | Locked (excused) cell text |
| `--solaris-neutral-border-default`                         | Editor border              |
| `--solaris-focus-ring-*`                                   | Editor focus indicator     |

## Accessibility

- Region and table carry the translated `aria-label`; rows expose `aria-rowindex`.
- Sortable headers use `th scope="col"` with `aria-sort`; sorting is a real
  `<button>` announced in a `role="status"` live region.
- The grade editor is a labeled native input (`type="number"`, `max` from
  `maxScore`, `type="text"` for the concept scale) styled like the cell text
  (inherited font, no spinners); it autofocuses on open. Escape or blur closes without
  committing; change/Enter commits.
- Status is never color-only: an 8px dot accompanies the value, the whole
  cell carries `title="<label> - <value>"` on hover, and a screen-reader-only
  label mirrors it; badge text always accompanies the color in `SITUAÇÃO`.
- Focus uses `:focus-visible` with `--solaris-focus-ring-*` tokens; motion
  respects `prefers-reduced-motion`; empty cells render `—` with a `title`.
- Card layout (`≤720px` or `layout="card"`) shows plain labels without sort
  buttons; `cardTitleOf` defaults to the identity text.

## Examples

```html
<solaris-gradebook [data]="rows" [columns]="columns" [headerGroups]="semesters" rowId="id" />

<solaris-gradebook [data]="source" [columns]="columns" rowId="id" scale="score-10" [gradeStatusOf]="statusOf" (gradeCommit)="onCommit($event)" />

<solaris-gradebook [data]="rows" [columns]="columns" rowId="id" [identity]="{ header: 'Disciplina', displayValueOf: subjectOf }" />
```

```typescript
import { SolarisGradebookComponent, buildGradebookColumns } from '@educarehq/solaris-ui';

const columns = buildGradebookColumns([
  { id: 'gs1', title: 'GS1', groupId: 's1', maxScore: 20 },
  { id: 'mp', title: 'MP', groupId: 'result', maxScore: 100 },
]);
```
