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

| Input                            | Type                                                  | Default     | Description                                                           |
| -------------------------------- | ----------------------------------------------------- | ----------- | --------------------------------------------------------------------- |
| `data`                           | `SolarisTableDataSource<T> \| readonly T[]`           | `[]`        | Rows or an external data source (server mode)                         |
| `columns`                        | `readonly SolarisTableColumn<T>[]`                    | `[]`        | Column definitions                                                    |
| `rowId`                          | `keyof T \| ((row, index) => string)`                 | required    | Stable row identity                                                   |
| `sort`                           | `SolarisTableSort \| null` (model)                    | `null`      | Controlled sort state (cycle null → asc → desc → null)                |
| `selectedRowIds`                 | `readonly string[]` (model)                           | `[]`        | Two-way selected row ids                                              |
| `selectionMode`                  | `'none' \| 'single' \| 'multiple'`                    | `'none'`    | Selection behavior                                                    |
| `loading`                        | `boolean`                                             | `false`     | Loading state (skeleton rows)                                         |
| `error` / `errorKey`             | `string \| null`                                      | `null`      | Error state text                                                      |
| `emptyText` / `emptyTextKey`     | `string \| null`                                      | `null`      | Empty state text                                                      |
| `loadingText` / `loadingTextKey` | `string \| null`                                      | `null`      | Loading announcement text                                             |
| `striped`                        | `boolean`                                             | `false`     | Zebra rows                                                            |
| `stickyHeader`                   | `boolean`                                             | `true`      | Sticky header                                                         |
| `hover`                          | `boolean`                                             | `true`      | Row hover highlight                                                   |
| `rowClickable`                   | `boolean`                                             | `false`     | Row action button in the first cell                                   |
| `expandable`                     | `boolean`                                             | `false`     | Collapsible priority columns with detail rows                         |
| `mobile`                         | `boolean`                                             | `false`     | Forces the card layout regardless of viewport (requires `expandable`) |
| `fullWidth`                      | `boolean`                                             | `false`     | Fixed table layout distributing columns across the container          |
| `cellPadding`                    | `'none' \| 'sm' \| 'md' \| 'lg'`                      | `'none'`    | Extra vertical cell breathing room (4/8/12px)                         |
| `density`                        | `'compact' \| 'normal' \| 'comfortable' \| undefined` | inherited   | Density variant                                                       |
| `ariaLabel` / `ariaLabelKey`     | `string \| undefined`                                 | `undefined` | Accessible table name                                                 |

| Output                 | Type                             | Description                                |
| ---------------------- | -------------------------------- | ------------------------------------------ |
| `sortChange`           | `SolarisTableSort \| null`       | Emitted on sort cycle (model output)       |
| `selectedRowIdsChange` | `readonly string[]`              | Emitted on selection change (model output) |
| `selectionChange`      | `SolarisTableSelectionChange<T>` | Selected rows, ids, and changed row        |
| `rowClick`             | `SolarisTableRowClickEvent<T>`   | Row action button activation               |

### Column

| Field                                    | Type                                                     | Description                                                    |
| ---------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------- |
| `id`                                     | `string`                                                 | Unique column id                                               |
| `header` / `headerKey`                   | `string`                                                 | Header text                                                    |
| `type`                                   | `'text' \| 'number' \| 'date' \| 'checkbox' \| 'custom'` | Rendering and sort semantics                                   |
| `accessor`                               | `keyof T \| ((row) => unknown)`                          | Raw value                                                      |
| `displayValueOf`                         | `(row) => string \| null`                                | Displayed text                                                 |
| `sortValueOf`                            | `(row) => string \| number \| null`                      | Comparable value                                               |
| `sortable`                               | `boolean`                                                | Enables the sort button                                        |
| `width` / `minWidth` / `maxWidth`        | `string`                                                 | Dimensions in px                                               |
| `align` / `headerAlign`                  | `'start' \| 'center' \| 'end'`                           | Alignment                                                      |
| `hidden`                                 | `boolean`                                                | Excludes the column                                            |
| `priority`                               | `number`                                                 | `1` = most important; higher collapses first when `expandable` |
| `cellTemplateId` / `headerTemplateId`    | `string`                                                 | Slot template ids                                              |
| `detailTemplateId`                       | `string`                                                 | Per-column detail template with extra information              |
| `locale` / `dateFormat` / `numberFormat` | `string`                                                 | `Intl` formatting                                              |

### Slots

| Directive                            | Description                                                                         |
| ------------------------------------ | ----------------------------------------------------------------------------------- |
| `ng-template[solaris-table-cell]`    | Custom cell (`templateId`, context `{$implicit, row, rowId, value, column, index}`) |
| `ng-template[solaris-table-header]`  | Custom header (`templateId`)                                                        |
| `ng-template[solaris-table-empty]`   | Empty state (wins over `emptyText`)                                                 |
| `ng-template[solaris-table-error]`   | Error state (wins over `error`)                                                     |
| `ng-template[solaris-table-loading]` | Loading state (wins over skeleton rows)                                             |
| `ng-template[solaris-table-detail]`  | Per-column detail content (`templateId`, same context as cells)                     |

## Sorting

The sort indicator overlays the `sort-asc` and `sort-desc` arrows in an 18px box. Each arrow animates independently: the active direction switches to the body color at full opacity and nudges toward its direction (`translateY(-2px)` for ascending, `translateY(2px)` for descending, both with a slight scale), while the other stays muted. Transitions follow `--solaris-motion-duration-fast` and are disabled under `prefers-reduced-motion`.

## Expandable rows

With `expandable`, an `Actions` column is rendered last with one expand button per row (chevron rotates 180 degrees). Expanded rows reveal a detail row that animates open and closed (`grid-template-rows`, `--solaris-motion-duration-normal`, disabled under `prefers-reduced-motion`). Priority columns leave the row below 720px and move into the detail list; any column can also contribute its own `detailTemplateId` content.

## Card layout

On viewports of 720px and below (or anywhere with `mobile`), expandable tables render as cards instead of a draggable table: one card per row with stacked label/value fields, per-field sort buttons for sortable columns, and card-level selection. No horizontal dragging, no expand step — every column is visible.

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
- Expandable detail rows use a real `<button>` with `aria-expanded` and `aria-controls`.
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
    <solaris-badge [color]="statusColorOf(row.status)"> {{ row.status }} </solaris-badge>
  </ng-template>
</solaris-table>

<!-- Forced card layout (mobile anywhere) -->
<solaris-table [data]="rows" [columns]="columns" rowId="id" [expandable]="true" [mobile]="true" />
```

```typescript
import { SolarisTableComponent } from '@educarehq/solaris-ui';

const dataSource = createServerTableDataSource(rows, total, loading);
```
