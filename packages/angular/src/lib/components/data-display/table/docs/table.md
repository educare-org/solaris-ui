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

| Input                            | Type                                                  | Default     | Description                                                                          |
| -------------------------------- | ----------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------ |
| `data`                           | `SolarisTableDataSource<T> \| readonly T[]`           | `[]`        | Rows or an external data source (server mode)                                        |
| `columns`                        | `readonly SolarisTableColumn<T>[]`                    | `[]`        | Column definitions                                                                   |
| `rowId`                          | `keyof T \| ((row, index) => string)`                 | required    | Stable row identity                                                                  |
| `sort`                           | `SolarisTableSort \| null` (model)                    | `null`      | Controlled sort state (cycle null → asc → desc → null)                               |
| `selectedRowIds`                 | `readonly string[]` (model)                           | `[]`        | Two-way selected row ids                                                             |
| `selectionMode`                  | `'none' \| 'single' \| 'multiple'`                    | `'none'`    | Selection behavior                                                                   |
| `loading`                        | `boolean`                                             | `false`     | Loading state (skeleton rows)                                                        |
| `error` / `errorKey`             | `string \| null`                                      | `null`      | Error state text (rendered inside the table chrome, keeps headers)                   |
| `emptyText` / `emptyTextKey`     | `string \| null`                                      | `null`      | Empty state text (default covers en-US/pt-BR)                                        |
| `loadingText` / `loadingTextKey` | `string \| null`                                      | `null`      | Loading announcement text                                                            |
| `appearance`                     | `'outline' \| 'surface' \| 'soft' \| 'plain'`         | `'outline'` | `outline` bordered, `surface` solid header, `soft` borderless, `plain` dividers only |
| `striped`                        | `boolean`                                             | `false`     | Zebra rows                                                                           |
| `stripedMode`                    | `'even' \| 'odd'`                                     | `'even'`    | Which rows get the zebra background                                                  |
| `stickyHeader`                   | `boolean`                                             | `true`      | Sticky header                                                                        |
| `hover`                          | `boolean`                                             | `true`      | Row hover highlight                                                                  |
| `rowClickable`                   | `boolean`                                             | `false`     | Row action button in the first cell                                                  |
| `expandable`                     | `boolean`                                             | `false`     | Enables row and/or cell expansion                                                    |
| `expandMode`                     | `'row' \| 'cell' \| 'both'`                           | `'row'`     | `row` detail row for priority columns, `cell` inline chevron per expandable column   |
| `layout`                         | `'auto' \| 'card'`                                    | `'auto'`    | `card` forces the card layout regardless of viewport (requires `expandable`)         |
| `mobile`                         | `boolean`                                             | `false`     | Deprecated alias of `layout="card"`                                                  |
| `cardTitleOf` / `cardSubtitleOf` | `(row) => string \| null`                             | —           | Optional card header lines in card layout                                            |
| `fullWidth`                      | `boolean`                                             | `false`     | Fixed table layout distributing columns across the container                         |
| `cellPadding`                    | `'none' \| 'sm' \| 'md' \| 'lg'`                      | `'none'`    | Extra vertical cell breathing room (4/8/12px)                                        |
| `density`                        | `'compact' \| 'normal' \| 'comfortable' \| undefined` | inherited   | Density variant                                                                      |
| `ariaLabel` / `ariaLabelKey`     | `string \| undefined`                                 | `undefined` | Accessible table name                                                                |

| Output                 | Type                             | Description                                |
| ---------------------- | -------------------------------- | ------------------------------------------ |
| `sortChange`           | `SolarisTableSort \| null`       | Emitted on sort cycle (model output)       |
| `selectedRowIdsChange` | `readonly string[]`              | Emitted on selection change (model output) |
| `selectionChange`      | `SolarisTableSelectionChange<T>` | Selected rows, ids, and changed row        |
| `rowClick`             | `SolarisTableRowClickEvent<T>`   | Row action button activation               |

### Column

| Field                                    | Type                                                     | Description                                                                        |
| ---------------------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `id`                                     | `string`                                                 | Unique column id                                                                   |
| `header` / `headerKey`                   | `string`                                                 | Header text                                                                        |
| `type`                                   | `'text' \| 'number' \| 'date' \| 'checkbox' \| 'custom'` | Rendering and sort semantics                                                       |
| `accessor`                               | `keyof T \| ((row) => unknown)`                          | Raw value                                                                          |
| `displayValueOf`                         | `(row) => string \| null`                                | Displayed text                                                                     |
| `sortValueOf`                            | `(row) => string \| number \| null`                      | Comparable value (e.g. badge/status `active → 0, pending → 1, blocked → 2`)        |
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

| Directive                            | Description                                                                                                           |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `ng-template[solaris-table-cell]`    | Custom cell (`templateId`, context `{$implicit, row, rowId, value, column, index}`)                                   |
| `ng-template[solaris-table-header]`  | Custom header (`templateId`)                                                                                          |
| `ng-template[solaris-table-empty]`   | Empty state (wins over `emptyText`)                                                                                   |
| `ng-template[solaris-table-error]`   | Error state (wins over `error`)                                                                                       |
| `ng-template[solaris-table-loading]` | Loading state (wins over skeleton rows)                                                                               |
| `ng-template[solaris-table-detail]`  | Per-column detail content (`templateId`, same context as cells; may host a nested `solaris-table appearance="plain"`) |

## Sorting

The sort indicator overlays the `sort-asc` and `sort-desc` arrows in an 18px box. Each arrow animates independently: the active direction switches to the body color at full opacity and nudges toward its direction (`translateY(-2px)` for ascending, `translateY(2px)` for descending, both with a slight scale), while the other stays muted. Transitions follow `--solaris-motion-duration-normal` and are disabled under `prefers-reduced-motion`.

Custom ordering (badges, status pills, enums) goes through `sortValueOf` — the displayed text stays human-readable while sorting uses your comparable value.

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

## Accessibility

- Viewport uses `role="region"` with `aria-label`; the `<table>` carries `aria-label`, `aria-rowcount` (known total or `-1`), and each row carries `aria-rowindex`.
- Sortable headers use `th scope="col"` with `aria-sort` (`ascending` / `descending` / `none`); sorting is a real `<button>` with a descriptive `aria-label`, and results are announced in a `role="status"` live region.
- Selection uses `solaris-checkbox` with `aria-label` (`Select row {rowId}`, `Select all visible rows`); the header checkbox is tri-state (`checked` / `indeterminate`).
- Expandable rows and cells use real `<button>`s with `aria-expanded` and `aria-controls`.
- `rowClickable` renders a stretched `<button>` in the first cell (never `tr(click)`).
- Focus uses `:focus-visible` with `--solaris-focus-ring-*` tokens; motion respects `prefers-reduced-motion`.
- Empty cell values render `—` (em-dash); truncated text exposes the full value in `title`.

## CSS Variables

| Token                                      | Purpose                                        |
| ------------------------------------------ | ---------------------------------------------- |
| `--solaris-table-row-height-compact`       | Row height in compact density (36px)           |
| `--solaris-table-row-height-normal`        | Row height in normal density (44px)            |
| `--solaris-table-row-height-comfortable`   | Row height in comfortable density (52px)       |
| `--solaris-table-cell-padding-compact`     | Cell horizontal padding in compact density     |
| `--solaris-table-cell-padding-normal`      | Cell horizontal padding in normal density      |
| `--solaris-table-cell-padding-comfortable` | Cell horizontal padding in comfortable density |
| `--solaris-table-header-background`        | Header background                              |
| `--solaris-table-min-width`                | Table minimum width (720px)                    |

## Examples

```html
<solaris-table [data]="rows" [columns]="columns" rowId="id" [(sort)]="sort" [(selectedRowIds)]="selected" selectionMode="multiple" />

<ng-template solaris-table-cell="actions" let-row>
  <button type="button" (click)="edit(row)">Edit</button>
</ng-template>
```

```html
<!-- Avatar + badge composition with vertical rhythm -->
<solaris-table [data]="rows" [columns]="columns" rowId="id" cellPadding="lg">
  <ng-template solaris-table-cell="person" let-row>
    <solaris-avatar-profile size="xs" [title]="row.name" [subtitle]="row.email" />
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
