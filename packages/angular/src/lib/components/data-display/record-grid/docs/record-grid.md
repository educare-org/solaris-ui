# Solaris Record Grid

## Purpose

Record grid renders an attendance/launch sheet (sections → row groups → per-group
footers) with merged body cells and controlled editing with internal commit. It
imports table types, state, tokens, and density without copying them: sorting,
selection, sticky column, header groups, and slots all follow the `solaris-table`
contract. Pagination (`solaris-pagination` in the footer slot) and filtering
(`solaris-table-toolbar`) stay outside, by composition.

## When to use

- Launching attendance or grades per class with section groupings and group totals.
- Merging body cells (`rowspan` for section labels, `colspan` for notes).
- Editing cells with draft, validation, and internal commit that emits a
  ready-to-audit diff (`recordCommit`).
- Computing result columns reactively inside the component (`computed`).

## When not to use

- Do not use Record grid to present read-only matrices; that belongs to
  `solaris-table` or `solaris-gradebook`. Record grid owns drafts and commits.
- Do not use Record grid for virtualized sheets or column drag; those are
  future follow-ups.
- Do not copy table types or state; import them from `@educarehq/solaris-ui`.

## API

### SolarisRecordGridComponent

**Selector:** `solaris-record-grid`

| Input                                                       | Type                                       | Default            | Description                                         |
| ----------------------------------------------------------- | ------------------------------------------ | ------------------ | --------------------------------------------------- |
| `data`                                                      | `readonly T[]`                             | `[]`               | Initial rows; the internal working copy starts here |
| `records`                                                   | `readonly T[] \| undefined` (model)        | `undefined`        | Two-way working copy when bound                     |
| `columns`                                                   | `readonly SolarisRecordGridColumn<T>[]`    | `[]`               | Declared columns; computed columns never edit       |
| `sections`                                                  | `readonly SolarisRecordGridSection[]`      | `[]`               | Section headers and per-group footers               |
| `sectionOf`                                                 | `(row, index) => string \| null`           | `() => null`       | Section owning a row                                |
| `headerGroups`                                              | `readonly SolarisTableHeaderGroup[]`       | `[]`               | Semester or unit groupings                          |
| `rowId`                                                     | `keyof T \| ((row, index) => string)`      | required           | Stable row identity                                 |
| `sort`                                                      | `SolarisTableSort \| null` (model)         | `null`             | Controlled sort state                               |
| `selectedRowIds`                                            | `readonly string[]` (model)                | `[]`               | Two-way selected row ids                            |
| `selectionMode`                                             | `'none' \| 'single' \| 'multiple'`         | `'none'`           | Selection behavior                                  |
| `validateOf`                                                | `(row, columnId, value) => string \| null` | `undefined`        | Global validator; column `validateOf` wins          |
| `appearance`                                                | table appearances                          | `'grid'`           | Record grid defaults to the full cell grid          |
| `stickyFirstColumn`                                         | `boolean`                                  | `true`             | First column stays visible (skipped with selection) |
| `radius`                                                    | table radii                                | `'md'`             | Frame corner radius                                 |
| `striped` / `stripedMode`                                   | `boolean` / `'even' \| 'odd'`              | `false` / `'even'` | Zebra rows                                          |
| `cellPadding`                                               | `'none' \| 'sm' \| 'md' \| 'lg'`           | `'none'`           | Vertical cell padding                               |
| `readonly` / `disabled`                                     | `boolean`                                  | `false`            | Block editing                                       |
| `loading` / `error`+`errorKey` / `emptyText`+`emptyTextKey` | herdado table                              | —                  | State parity with i18n                              |
| `ariaLabel` / `ariaLabelKey`                                | `string \| undefined`                      | fallback traduzido | No hardcoded text                                   |

| Output / method                | Type                         | Description                                                                       |
| ------------------------------ | ---------------------------- | --------------------------------------------------------------------------------- |
| `recordCommit`                 | `SolarisRecordGridCommit<T>` | Audit-ready diff per commit (`rowId`, `columnId`, `previousValue`, `value`, `at`) |
| `recordsChange`                | `readonly T[]`               | Working copy after each commit                                                    |
| `selectionChange` / `rowClick` | reexport table               | Delegated                                                                         |
| `commitAll()` / `discardAll()` | methods                      | Commit or discard the open draft                                                  |

### SolarisRecordGridColumn

Extends `SolarisTableColumn` with `sectionId`, `computed` (`from`, `by`,
`weights?`), `validateOf` (returns an error message or `null`),
`writeOf` (custom row writer; defaults to a shallow copy by accessor or id),
`rowspanOf`, and `colspanOf` (return `>= 1`; clamped to the grid edges).

### Reactive engine

`buildFormulaGraph` → `topoSortFormulaColumns` (throws
`SolarisRecordGridFormulaError` on cycles or unknown columns) →
`resolveRecordValues` (topological order; computed cells never open the editor).
`resolveBodySpans` merges origins and skips covered cells; hidden columns are
excluded. Merged span origins (`rowSpan`/`colSpan` > 1) render as text and
never open the editor; the write target would be ambiguous.
`resolveSectionGroups` groups rows in first-seen order.

### Future contracts (specified, not implemented)

- **Audit trail**: every `recordCommit` is appendable to an institutional log;
  persisting stays with the consumer.
- These stay out of `solaris-table` and `solaris-gradebook`: merged body cells,
  internal commit, and reactive formulas across arbitrary columns.

### Slots

Consumer templates declared inside `solaris-record-grid` reuse the table slot
directives: `solaris-table-cell`, `solaris-table-header`,
`solaris-table-footer-cell`, `solaris-table-empty`, `solaris-table-error`,
`solaris-table-loading`, `solaris-table-footer` (e.g. `solaris-pagination`),
and `solaris-table-toolbar`. Cell editing is internal (no editor slot).

## Visual variants

Record grid inherits the table density scale (36/44/52px) and defaults to
`appearance="grid"` with `stickyFirstColumn`. Editable cells render as text
buttons; computed cells use medium weight; open drafts tint with the draft
background and invalid drafts carry an error shadow plus a `role="alert"`
message. Section dividers are `th scope="rowgroup"` rows; group footers and
the grand total are `<tfoot>` rows via `footer`/`footerValueOf`/
`footerTemplateId`.

## Accessibility

WCAG 2.2 AA, table parity plus spans: `role="region"` with a translatable
`aria-label`; `th scope="col"` with `aria-sort`; section dividers as
`th scope="rowgroup"`; `aria-rowindex` and `aria-colindex` count merged cells
so numbering stays continuous; sort is a real `<button>` with a live
`role="status"` announcement; selection uses `solaris-checkbox` with a
tri-state header; editors expose `aria-invalid` and `aria-describedby` with a
`role="alert"` error; `:focus-visible` everywhere; keyboard skips covered cells;
card layout shows consolidated text without editors.

## Examples

```html
<solaris-record-grid [data]="rows" [columns]="columns" [sections]="sections" [sectionOf]="sectionOf" rowId="id" (recordCommit)="onRecordCommit($event)" />
```

```ts
const columns: SolarisRecordGridColumn<Row>[] = [
  { id: 'student', header: 'Student', accessor: 'student' },
  {
    id: 'present',
    header: 'Present',
    accessor: 'present',
    type: 'number',
    sortable: true,
    sectionId: 'morning',
    validateOf: (_row, _columnId, value) => (typeof value === 'number' && value >= 0 && value <= 10 ? null : 'Enter a value between 0 and 10'),
  },
  {
    id: 'total',
    header: 'Total',
    type: 'number',
    computed: { from: ['present', 'project'], by: 'sum' },
  },
];
```

## CSS Variables

| Variable                                 | Description                                                        |
| ---------------------------------------- | ------------------------------------------------------------------ |
| `--solaris-record-grid-draft-background` | Draft cell background (defaults to `--solaris-primary-soft`)       |
| `--solaris-record-grid-error-color`      | Validation error color (defaults to `--solaris-danger-foreground`) |

All table tokens (`--solaris-table-*`) apply; no other new tokens.
