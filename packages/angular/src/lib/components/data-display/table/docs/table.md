# Solaris Table

## Purpose

Table displays structured rows and columns with sorting, selection, and loading/empty/error states. It receives already-filtered `data` and exposes extension points (`sortValueOf`, `SolarisTableDataSource`, slots) for future filtering without changing the component. Pagination is a separate standalone component (`solaris-pagination`).

## When to use

- Displaying comparable rows with sortable columns.
- Single or multiple row selection with two-way binding.
- Custom cell or header rendering via slots.
- Server-driven data through `SolarisTableDataSource`.

## When not to use

- Do not use Table for page layout.
- Do not use Table for simple key-value pairs (use a description list).
- Filtering toolbars, search, and CSV export are separate future components.

## API

### SolarisTableComponent

**Selector:** `solaris-table`

| Input                                           | Type                                                    | Default     | Description                                                                                                 |
| ----------------------------------------------- | ------------------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------- |
| `data`                                          | `SolarisTableDataSource<T> \| readonly T[]`             | `[]`        | Rows or an external data source (server mode)                                                               |
| `columns`                                       | `readonly SolarisTableColumn<T>[]`                      | `[]`        | Column definitions                                                                                          |
| `rowId`                                         | `keyof T \| ((row, index) => string)`                   | required    | Stable row identity                                                                                         |
| `sort`                                          | `SolarisTableSort \| null` (model)                      | `null`      | Controlled sort state (cycle null → asc → desc → null)                                                      |
| `selectedRowIds`                                | `readonly string[]` (model)                             | `[]`        | Two-way selected row ids                                                                                    |
| `selectionMode`                                 | `'none' \| 'single' \| 'multiple'`                      | `'none'`    | Selection behavior                                                                                          |
| `loading`                                       | `boolean`                                               | `false`     | Loading state (skeleton rows)                                                                               |
| `error` / `errorKey`                            | `string \| null`                                        | `null`      | Error state text (rendered inside the table chrome, keeps headers)                                          |
| `emptyText` / `emptyTextKey`                    | `string \| null`                                        | `null`      | Empty state text (default covers en-US/pt-BR)                                                               |
| `loadingText` / `loadingTextKey`                | `string \| null`                                        | `null`      | Loading announcement text                                                                                   |
| `appearance`                                    | `'outline' \| 'surface' \| 'soft' \| 'plain' \| 'grid'` | `'outline'` | `outline` bordered, `surface` solid header, `soft` borderless, `plain` dividers only, `grid` full cell grid |
| `radius`                                        | `'none' \| 'sm' \| 'md' \| 'lg'`                        | `'md'`      | Frame corner radius                                                                                         |
| `showAddRow` / `addRowLabel` / `addRowLabelKey` | `boolean` / `string \| null`                            | `false`     | Inline creation row emitting `addRowRequest`; toolbar action buttons stay separate                          |
| `striped`                                       | `boolean`                                               | `false`     | Zebra rows                                                                                                  |
| `stripedMode`                                   | `'even' \| 'odd'`                                       | `'even'`    | Which rows get the zebra background                                                                         |
| `stickyHeader`                                  | `boolean`                                               | `true`      | Sticky header                                                                                               |
| `stickyFirstColumn`                             | `boolean`                                               | `false`     | Pins the first data column (plus selection when selectable) to the viewport start                           |
| `headerGroups`                                  | `readonly SolarisTableHeaderGroup[]`                    | `[]`        | Two-level grouped headers (`id`, `header`/`headerKey`); columns opt in via `headerGroup`                    |
| `hover`                                         | `boolean`                                               | `true`      | Row hover highlight                                                                                         |
| `rowClickable`                                  | `boolean`                                               | `false`     | Row action button in the first cell                                                                         |
| `expandable`                                    | `boolean`                                               | `false`     | Enables row and/or cell expansion                                                                           |
| `expandMode`                                    | `'row' \| 'cell' \| 'both'`                             | `'row'`     | `row` detail row for priority columns, `cell` inline chevron per expandable column                          |
| `layout`                                        | `'auto' \| 'card'`                                      | `'auto'`    | `card` forces the card layout regardless of viewport (requires `expandable`)                                |
| `mobile`                                        | `boolean`                                               | `false`     | Deprecated alias of `layout="card"`                                                                         |
| `cardTitleOf` / `cardSubtitleOf`                | `(row) => string \| null`                               | —           | Optional card header lines in card layout                                                                   |
| `fullWidth`                                     | `boolean`                                               | `false`     | Fixed table layout distributing columns across the container                                                |
| `cellPadding`                                   | `'none' \| 'sm' \| 'md' \| 'lg'`                        | `'none'`    | Extra vertical cell breathing room (spacing-3/5/6)                                                          |
| `density`                                       | `'compact' \| 'normal' \| 'comfortable' \| undefined`   | inherited   | Density variant                                                                                             |
| `ariaLabel` / `ariaLabelKey`                    | `string \| undefined`                                   | `undefined` | Accessible table name                                                                                       |

| Output                  | Type                             | Description                                           |
| ----------------------- | -------------------------------- | ----------------------------------------------------- |
| `addRowRequest`         | `void`                           | Emitted by the inline add row (`showAddRow`)          |
| `sortChange`            | `SolarisTableSort \| null`       | Emitted on sort cycle (model output)                  |
| `selectedRowIdsChange`  | `readonly string[]`              | Emitted on selection change (model output)            |
| `selectionChange`       | `SolarisTableSelectionChange<T>` | Selected rows, ids, and changed row                   |
| `rowClick`              | `SolarisTableRowClickEvent<T>`   | Row action button activation                          |
| `editStart` / `editEnd` | `SolarisTableCellEditEvent<T>`   | Cell editing opened/closed (`{ row, rowId, column }`) |

### Column

| Field                                    | Type                                                     | Description                                                                        |
| ---------------------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `id`                                     | `string`                                                 | Unique column id                                                                   |
| `header` / `headerKey`                   | `string`                                                 | Header text (`xs`, smaller than row text)                                          |
| `icon` / `iconPosition`                  | `string` / `'start' \| 'end'`                            | Decorative header icon shortcut; `headerTemplateId` stays for rich headers         |
| `type`                                   | `'text' \| 'number' \| 'date' \| 'checkbox' \| 'custom'` | Rendering and sort semantics                                                       |
| `accessor`                               | `keyof T \| ((row) => unknown)`                          | Raw value                                                                          |
| `displayValueOf`                         | `(row) => string \| null`                                | Displayed text                                                                     |
| `sortValueOf`                            | `(row) => string \| number \| null`                      | Comparable value (e.g. badge/status `active → 0, pending → 1, blocked → 2`)        |
| `footer` / `footerKey`                   | `string`                                                 | Static footer aggregate text                                                       |
| `footerValueOf`                          | `(rows) => string \| null`                               | Footer aggregate over visible rows (e.g. average, total)                           |
| `footerAlign`                            | `'start' \| 'center' \| 'end'`                           | Footer alignment (defaults to `align`)                                             |
| `footerTemplateId`                       | `string`                                                 | Footer cell slot template id                                                       |
| `headerGroup`                            | `string`                                                 | Groups the column under `headerGroups` by id (consecutive columns merge)           |
| `editorTemplateId`                       | `string`                                                 | Cell editor slot template id (Enter/double-click edits, Escape closes)             |
| `sortable`                               | `boolean`                                                | Enables the sort button                                                            |
| `expandable`                             | `boolean`                                                | Renders an inline chevron when `expandMode` includes `cell`                        |
| `detailVariant`                          | `'list' \| 'free'`                                       | Free-form detail area without the label column (`free` skips term/value chrome)    |
| `hideCardLabel`                          | `boolean`                                                | Hides the field label in card layout (value spans full width, desktop header kept) |
| `width` / `minWidth` / `maxWidth`        | `string`                                                 | Dimensions in px                                                                   |
| `align` / `headerAlign`                  | `'start' \| 'center' \| 'end'`                           | Alignment (text `start`, numbers `end`, badges/status `center`)                    |
| `hidden`                                 | `boolean`                                                | Excludes the column                                                                |
| `priority`                               | `number`                                                 | `1` = most important; higher collapses first when `expandable`                     |
| `cellTemplateId` / `headerTemplateId`    | `string`                                                 | Slot template ids                                                                  |
| `detailTemplateId`                       | `string`                                                 | Per-column detail template with extra information                                  |
| `locale` / `dateFormat` / `numberFormat` | `string`                                                 | `Intl` formatting                                                                  |

### Slots

| Directive                                | Description                                                                                                            |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `ng-template[solaris-table-cell]`        | Custom cell (`templateId`, context `{$implicit, row, rowId, value, column, index}`)                                    |
| `ng-template[solaris-table-header]`      | Custom header (`templateId`)                                                                                           |
| `ng-template[solaris-table-empty]`       | Empty state (wins over `emptyText`)                                                                                    |
| `ng-template[solaris-table-error]`       | Error state (wins over `error`)                                                                                        |
| `ng-template[solaris-table-loading]`     | Loading state (wins over skeleton rows)                                                                                |
| `ng-template[solaris-table-detail]`      | Per-column detail content (`templateId`, same context as cells; may host a nested `solaris-table appearance="plain"`)  |
| `ng-template[solaris-table-footer-cell]` | Custom footer cell (`templateId` matching `footerTemplateId`, context `{$implicit, rows, column}`)                     |
| `ng-template[solaris-table-cell-editor]` | Cell editor (`templateId` matching `editorTemplateId`, context `{$implicit, row, rowId, value, column, index, close}`) |
| `ng-template[solaris-table-footer]`      | Optional footer inside the frame (e.g. `solaris-pagination`); nothing renders when absent                              |

## Footer

Project `ng-template[solaris-table-footer]` to render a footer row inside `.solaris-table__frame`, below the viewport — the pagination then shares the table border instead of sitting outside it:

```html
<solaris-table [data]="pageRows" [columns]="columns" rowId="id">
  <ng-template solaris-table-footer>
    <solaris-pagination [pageIndex]="pageIndex" [pageSize]="pageSize" [total]="total" (pageChange)="onPageChange($event)" />
  </ng-template>
</solaris-table>
```

The footer has a top divider and the table cell padding; tables without a footer render exactly as before. In card layout the footer drops its divider and padding so it stacks cleanly below the cards.

## Sorting

The sort indicator overlays the `sort-asc` and `sort-desc` arrows in an 18px box. Each arrow animates independently: the active direction switches to the body color at full opacity and nudges toward its direction (`translateY(-2px)` for ascending, `translateY(2px)` for descending, both with a slight scale), while the other stays muted. Transitions follow `--solaris-motion-duration-normal` and are disabled under `prefers-reduced-motion`.

Custom ordering (badges, status pills, enums) goes through `sortValueOf` — the displayed text stays human-readable while sorting uses your comparable value.

## Sticky first column

`stickyFirstColumn` pins the leading column to the viewport start (`data-sticky="start"`) so row identity stays visible in wide tables. With `selectionMode` other than `none`, the selection checkbox column pins alongside it with the selection width as offset. DOM order never changes, so screen readers and keyboard order are unaffected. Card layout ignores it (cards stack vertically with no horizontal scroll).

```html
<solaris-table [data]="rows" [columns]="wideColumns" rowId="id" [stickyFirstColumn]="true" />
```

## Footer aggregates

A column with `footer`, `footerKey`, `footerValueOf`, or `footerTemplateId` renders a semantic `<tfoot>` after the body rows. `footerValueOf` receives the visible rows and returns display-ready text (format with `Intl` in the callback); static `footer`/`footerKey` covers labels like `Average`. The footer cell template wins over text. The footer hides while loading, on error, or when empty, and card layout ignores it.

```html
<solaris-table [data]="rows" [columns]="aggregateColumns" rowId="id" />
```

```typescript
const aggregateColumns = [
  { id: 'name', header: 'Name', accessor: 'name', footer: 'Average' },
  {
    id: 'score',
    header: 'Score',
    accessor: 'score',
    type: 'number',
    footerValueOf: (rows) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(rows.reduce((sum, row) => sum + row.score, 0) / rows.length),
  },
];
```

## Header groups

`headerGroups` renders a second header row: consecutive columns sharing a known `headerGroup` id merge under one `th scope="colgroup"` (`colspan`), while ungrouped columns span both rows (`rowspan="2"`). Sorting, selection, and sticky columns keep working; unknown group ids render ungrouped. Card layout ignores groups.

```html
<solaris-table [data]="rows" [columns]="groupedColumns" [headerGroups]="groups" rowId="id" />
```

```typescript
const groups = [{ id: 'metrics', header: 'Metrics' }];
const groupedColumns = [
  { id: 'name', header: 'Name', accessor: 'name' },
  { id: 'score', header: 'Score', accessor: 'score', type: 'number', headerGroup: 'metrics' },
];
```

## Cell editing

A column with `editorTemplateId` is editable: Enter or double-click opens the `solaris-table-cell-editor` template in place, Escape (or the context `close()`) ends editing. The table owns only the editing state — committing values stays with the consumer (update `data` on your own events). `editStart`/`editEnd` carry `{ row, rowId, column }`. Card layout shows plain text (no inline editors).

```html
<solaris-table [data]="rows" [columns]="columns" rowId="id" (editEnd)="onEditEnd($event)">
  <ng-template solaris-table-cell-editor="name-editor" let-row let-close="close">
    <input [value]="row.name" (change)="rename(row, $event); close()" />
  </ng-template>
</solaris-table>
```

## Expandable rows

With `expandable` (default `expandMode="row"`), an `Actions` column is rendered last with one expand button per row (chevron rotates 180 degrees). Expanded rows reveal a detail row that animates open and closed (`grid-template-rows`, `--solaris-motion-duration-normal`, disabled under `prefers-reduced-motion`). Priority columns leave the row below 720px and move into the detail list; any column can also contribute its own `detailTemplateId` content. The detail row keeps the table dividers, so `outline` tables keep their lines inside the expansion.

## Cell expansion

With `expandMode="cell"` (or `"both"`), every column with `expandable: true` (or a `detailTemplateId`) renders a chevron next to the value. Activating it opens a detail row **below the row** with only that column's content (`detailTemplateId` content, same context as cells) — one item per expanded column, like the responsive detail list. Each chevron carries `aria-expanded`/`aria-controls` pointing at the shared detail row. In card layout the same chevron opens an accordion field below the value.

Columns with `detailVariant: 'free'` skip the term/value chrome and render the template as a free area — useful for custom breakdowns (e.g. earned/lost/total rows with `space-between` and semantic colors) without the label column rules.

## Subtables

A `solaris-table-detail` template may render anything, including a nested `<solaris-table appearance="plain">` for master/detail (e.g. property → units A1/A2/A3). The detail container removes the nested outer frame and inherits density so the subtable reads as part of the parent.

## Card layout

Columns with `hideCardLabel: true` render value-only fields in card layout (no label, value spans full width) while keeping the desktop header — useful for identity columns like person/avatar.

On viewports of 720px and below (or anywhere with `layout="card"`), expandable tables render as cards instead of a draggable table: one card per row with compact label/value fields (labels `xs`/tertiary, values `sm`/medium, dividers between fields), card-level selection, and per-field expansion accordions. Cards show **plain labels only — no sort buttons**; sorting moves to the future filter bar. Optional `cardTitleOf`/`cardSubtitleOf` render a header line (title + subtitle) above the fields. The outer `.solaris-table__frame` border is removed in card layout so there is no double frame. Density (`compact`/`comfortable`) adjusts card padding.

## Selection

`selectedRowIds` is two-way. Switching `selectionMode` to `single` while several rows are selected trims the model to the first id and emits `selectionChange`, so single mode never holds more than one row. Checkbox column headers never render the internal selection id.

## Density

| Density       | Row height |
| ------------- | ---------- |
| `compact`     | 36px       |
| `normal`      | 44px       |
| `comfortable` | 52px       |

Default: inherited from the theme system via `effectiveDensity` (`density() ?? themeService.density`).

## ERP operations (consumer guidance)

No business logic lives in the table; the patterns below stay in consumer code.

- **States**: `loading` shows skeleton rows, `error`/`errorKey` keeps headers with an inline message, empty `data` shows `emptyText`/`emptyTextKey` or the `solaris-table-empty` slot. Cover all three in enrollment and roster screens.
- **Bulk actions**: `selectionMode="multiple"` + `[(selectedRowIds)]` + `selectionChange` drive toolbar actions (approve, export, reassign). The header checkbox is tri-state and selects visible rows only.
- **Keyboard-first**: sort, selection, expand, and row actions are real `<button>`s — Tab reaches them, Enter/Space activates. Keep row order stable so screen-reader and keyboard order match.
- **1000+ rows**: never render unbounded. Page with `solaris-pagination` in the `solaris-table-footer` slot over a `SolarisTableDataSource` (server mode), or cap client rows per page. The table renders only the rows it receives.
- **Audit trail**: log `selectionChange`/`sortChange`/`rowClick` with row ids and timestamps in the consumer. Never log cell PII (names, emails, grades) — ids only.
- **i18n growth**: `pt-BR`/`es` labels run ~30% longer than `en-US`. Headers and cells truncate with ellipsis and expose the full value in `title`; never fix column widths to English text.
- **Print**: the print baseline is ink-safe (paper background, hidden pagination footer, row actions, and expand buttons; scrollers expanded; sticky reset to static). Print from the full source rows, not the current page — open a print view with all rows, then call print.

## Accessibility

- Viewport uses `role="region"` with `aria-label`; the `<table>` carries `aria-label`, `aria-rowcount` (known total or `-1`), and each row carries `aria-rowindex`.
- Sortable headers use `th scope="col"` with `aria-sort` (`ascending` / `descending` / `none`); sorting is a real `<button>` with a descriptive `aria-label`, and results are announced in a `role="status"` live region.
- Selection uses `solaris-checkbox` with `aria-label` (`Select row {rowId}`, `Select all visible rows`); the header checkbox is tri-state (`checked` / `indeterminate`).
- Expandable rows and cells use real `<button>`s with `aria-expanded` and `aria-controls`.
- `rowClickable` renders a stretched `<button>` in the first cell (never `tr(click)`).
- Focus uses `:focus-visible` with `--solaris-focus-ring-*` tokens; motion respects `prefers-reduced-motion`.
- Empty cell values render `—` (em-dash); truncated text exposes the full value in `title`.

## CSS Variables

| Token                                      | Purpose                                                    |
| ------------------------------------------ | ---------------------------------------------------------- |
| `--solaris-table-row-height-compact`       | Row height in compact density (`--solaris-spacing-11`)     |
| `--solaris-table-row-height-normal`        | Row height in normal density (spacing-12 + spacing-3)      |
| `--solaris-table-row-height-comfortable`   | Row height in comfortable density (spacing-13 + spacing-3) |
| `--solaris-table-cell-padding-compact`     | Cell horizontal padding in compact density                 |
| `--solaris-table-cell-padding-normal`      | Cell horizontal padding in normal density                  |
| `--solaris-table-cell-padding-comfortable` | Cell horizontal padding in comfortable density             |
| `--solaris-table-header-background`        | Header background                                          |
| `--solaris-table-min-width`                | Table minimum width (720px)                                |

## Examples

```html
<solaris-table [data]="rows" [columns]="columns" rowId="id" [(sort)]="sort" [(selectedRowIds)]="selected" selectionMode="multiple" />

<solaris-table [data]="rows" [columns]="columns" rowId="id" appearance="grid" radius="lg" />

<solaris-table [data]="rows" [columns]="columns" rowId="id" [showAddRow]="true" (addRowRequest)="onAddRow()" />
```

Toolbar custom actions use the leading/trailing slots; they are independent
from the inline add row:

```html
<solaris-table-toolbar [columns]="columns" [(filter)]="filter">
  <ng-template solaris-table-toolbar-trailing>
    <button solaris-button appearance="solid">New</button>
  </ng-template>
</solaris-table-toolbar>
```

<ng-template solaris-table-cell="actions" let-row>
  <button type="button" (click)="edit(row)">Edit</button>
</ng-template>
```

```html
<!-- Avatar + badge composition with vertical rhythm -->
<!-- Tables use avatar size="sm" textSize="sm" with cellPadding="lg" -->
<solaris-table [data]="rows" [columns]="columns" rowId="id" cellPadding="lg">
  <ng-template solaris-table-cell="person" let-row>
    <solaris-avatar-profile size="sm" textSize="sm" [title]="row.name" [subtitle]="row.email" />
  </ng-template>
  <ng-template solaris-table-cell="status" let-row>
    <solaris-badge size="sm" appearance="solid" [color]="statusColorOf(row.status)"> {{ row.status }} </solaris-badge>
  </ng-template>
</solaris-table>

<!-- Forced card layout (mobile anywhere) -->
<solaris-table [data]="rows" [columns]="columns" rowId="id" [expandable]="true" layout="card" />

<!-- Cell expansion (chevron next to score) -->
<solaris-table [data]="rows" [columns]="columns" rowId="id" [expandable]="true" expandMode="cell">
  <ng-template solaris-table-detail="score-detail" let-row> Score {{ row.score }} of 1000 </ng-template>
</solaris-table>

<!-- Appearance + odd striping -->
<solaris-table [data]="rows" [columns]="columns" rowId="id" appearance="surface" [striped]="true" stripedMode="odd" />
```

```typescript
import { SolarisTableComponent } from '@educarehq/solaris-ui';

const dataSource = createServerTableDataSource(rows, total, loading);
```
