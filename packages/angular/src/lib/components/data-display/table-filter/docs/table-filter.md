# Solaris Table Filter

## Purpose

Table Filter provides the smart toolbar layer for `solaris-table`: global search,
per-column conditions, saved views, pluggable export (CSV/JSON via the agnostic
`SolarisExportService`) and the `Customize columns` manager with drag-reorder and
visibility toggles. It never filters by itself in server mode — it owns the
`SolarisTableFilterState` and either applies it locally (client adapter) or emits
it for the owner to fetch (server adapter).

When projected into `<solaris-table>` through `ng-template[solaris-table-toolbar]`,
the toolbar renders inside the table frame (mirroring the pagination footer). Without
the slot, the table renders exactly as before.

## When to use

- Any `solaris-table` that needs search, filters, views, export or column management.
- Client tables: combine with `applyTableFilters` + `applyOrderedVisibleColumns`.
- Server tables: listen to `filterChange` (model output) and fetch.

## When not to use

- Do not use the toolbar without a table or list context.
- Do not build CSV strings by hand — use `SolarisExportService` + `createCsvExporter`
  (`delimiter: ','` default, `';'` via `SOLARIS_CSV_DELIMITER_PRESETS.semicolon` for Excel PT-BR).

## API

### SolarisTableToolbarComponent

**Selector:** `solaris-table-toolbar`

| Input                                                           | Type                                                  | Default     | Description                                                                      |
| --------------------------------------------------------------- | ----------------------------------------------------- | ----------- | -------------------------------------------------------------------------------- |
| `columns`                                                       | `readonly SolarisTableFilterableColumn<T>[]`          | `[]`        | Filterable column definitions                                                    |
| `filter`                                                        | `SolarisTableFilterState` (model)                     | empty       | Controlled filter state (two-way)                                                |
| `views`                                                         | `readonly SolarisTableView[]`                         | `[]`        | Saved views rendered as tabs                                                     |
| `selectedViewId`                                                | `string \| null` (model)                              | `null`      | Active view id (two-way)                                                         |
| `showViews` / `showSearch` / `showFilter` / `showColumnManager` | `boolean`                                             | `true`      | Toggles each toolbar zone                                                        |
| `exporters`                                                     | `readonly SolarisExporter<T>[]`                       | `[]`        | Export plugins; empty hides the button, one downloads directly, many open a menu |
| `exportDisplay`                                                 | `'icon' \| 'icon-label'`                              | `'icon'`    | Download button presentation                                                     |
| `exportRows`                                                    | `readonly T[]`                                        | `[]`        | Rows used by export (already filtered)                                           |
| `exportFilename`                                                | `string \| undefined`                                 | `undefined` | Filename base (`name-YYYYMMDD.ext`)                                              |
| `persistenceKey`                                                | `string \| undefined`                                 | `undefined` | `localStorage` key for filter + view                                             |
| `density`                                                       | `'compact' \| 'normal' \| 'comfortable' \| undefined` | inherited   | Density variant                                                                  |
| `searchPlaceholder` / `searchPlaceholderKey`                    | `string \| undefined`                                 | `undefined` | Search placeholder i18n pair                                                     |
| `ariaLabel` / `ariaLabelKey`                                    | `string \| undefined`                                 | `undefined` | Toolbar accessible name                                                          |

| Output                 | Type                         | Description                                                    |
| ---------------------- | ---------------------------- | -------------------------------------------------------------- |
| `filterChange`         | `SolarisTableFilterState`    | Emitted on any filter edit (model output)                      |
| `selectedViewIdChange` | `string \| null`             | Active view change (model output)                              |
| `viewCreate`           | `string`                     | `Create view` confirmation with the typed view name            |
| `exported`             | `SolarisTableExportEvent<T>` | After an export download (`exporter`, `filename`, `truncated`) |

Layout: the search field stays left while filter/export/columns share a right-aligned
action group. The active-filter count uses `solaris-badge`. Condition editors use the
standalone `solaris-select` / `solaris-multi-select` label API (never nested in a
`form-field`); plain text/number/date/range editors use `solaris-form-field`.

### Custom actions (`leading` / `trailing` slots)

Standard zones stay input-driven; extra buttons project through slots so the toolbar
never needs a new input per action:

```html
<solaris-table-toolbar [columns]="columns" [(filter)]="filter">
  <ng-template solaris-table-toolbar-leading>
    <button solaris-button appearance="solid" size="sm">New</button>
  </ng-template>
  <ng-template solaris-table-toolbar-trailing>
    <button solaris-button appearance="outline" size="sm">Audit</button>
  </ng-template>
</solaris-table-toolbar>
```

Disposition: `leading` renders left before search (primary creation, stable first
position, first on wrap); `trailing` renders right after the built-ins with a divider
(secondary actions). Keep at most two custom buttons; beyond that use a
`solaris-dropdown-menu`. Zones wrap on narrow viewports with search full-width first.

### SolarisColumnManagerComponent

**Selector:** `solaris-column-manager`

| Input        | Type                                         | Default | Description                                    |
| ------------ | -------------------------------------------- | ------- | ---------------------------------------------- |
| `columns`    | `readonly SolarisTableFilterableColumn<T>[]` | `[]`    | All columns (labels from `header`/`headerKey`) |
| `order`      | `readonly string[]`                          | `[]`    | Current visual order (empty = column order)    |
| `visibility` | `Readonly<Record<string, boolean>>`          | `{}`    | `false` hides the column                       |
| `density`    | inherited                                    | —       | Density variant                                |

| Output         | Type                       | Description                          |
| -------------- | -------------------------- | ------------------------------------ |
| `save`         | `SolarisColumnManagerSave` | `{ order, visibility }` draft commit |
| `cancelled`    | `void`                     | Discard drafts                       |
| `resetRequest` | `void`                     | Restore defaults                     |

Reorder works with drag-and-drop **and** keyboard `↑/↓` buttons (every row).

### Filter state helpers (`model/filter-state.ts`, pure, no DOM)

`createEmptyTableFilterState`, `normalizeTableFilterState`,
`isTableFilterActive`, `activeTableFilterCount`, `applyTableFilters`,
`applyColumnOrder`, `applyColumnVisibility`, `applyOrderedVisibleColumns`,
`moveColumnInOrder`, `insertColumnBefore`, `orderFromColumns`,
`serializeTableFilterState` / `parseTableFilterState`,
`readPersistedTableFilterState` / `writePersistedTableFilterState` (SSR-safe).

### Export service (`services/export`, agnostic to tables)

`SolarisExportService.exportAndDownload(exporter, { rows, columns, filename? })`
truncates at `maxRows` (default `5000`, via `SOLARIS_EXPORT_CONFIG`) and downloads
through `Blob + URL.createObjectURL` (no-op on SSR). New formats ship as new
`SolarisExporter` implementations registered with `provideSolarisExport([...])` —
tables pick them up with no toolbar changes.

## Density

| Density                              | Toolbar min-height |
| ------------------------------------ | ------------------ |
| `compact` / `normal` / `comfortable` | `36px` (inherited) |

Default: inherited from the theme system via `effectiveDensity`.

## Accessibility

- Toolbar host has `role="toolbar"` with an `aria-label`.
- Search is a labelled `type="search"` input; filter/columns/export are real `<button>`s
  with `aria-expanded` (managed by the popover/dropdown triggers) and descriptive labels.
- Active filter count renders in a `role="status"` badge; chips are removable buttons
  with `aria-label`s (`Remove filter for X`, `Clear search`).
- Column manager rows reorder with drag **and** labelled `↑/↓` buttons; checkbox state
  uses `solaris-checkbox` with per-column `aria-label`s.
- Focus uses `:focus-visible` with `--solaris-focus-ring-*`; motion respects
  `prefers-reduced-motion`.

## CSS Variables

| Token                                 | Purpose                                   |
| ------------------------------------- | ----------------------------------------- |
| `--solaris-table-toolbar-gap`         | Gap between toolbar zones                 |
| `--solaris-table-toolbar-min-height`  | Controls row min-height (`36px`)          |
| `--solaris-table-toolbar-panel-width` | Filter popover width (`420px`)            |
| `--solaris-column-manager-width`      | Customize-columns popover width (`320px`) |

## Examples

```html
<solaris-table [data]="pageRows" [columns]="orderedVisible" rowId="id" [(sort)]="sort">
  <ng-template solaris-table-toolbar>
    <solaris-table-toolbar [columns]="allColumns" [(filter)]="filter" [views]="views" [(selectedViewId)]="viewId" [exporters]="exporters" [exportRows]="filteredRows" exportFilename="contacts" persistenceKey="contacts-toolbar" (viewCreate)="onCreateView()" />
  </ng-template>
  <ng-template solaris-table-footer>
    <solaris-pagination [pageIndex]="pageIndex" [pageSize]="pageSize" [total]="total" (pageChange)="onPageChange($event)" />
  </ng-template>
</solaris-table>
```

```typescript
import { SolarisTableToolbarComponent, applyOrderedVisibleColumns, applyTableFilters, createCsvExporter, createJsonExporter } from '@educarehq/solaris-ui';

const exporters = [createCsvExporter<Contact>(), createJsonExporter<Contact>()];
// Excel PT-BR: createCsvExporter({ delimiter: SOLARIS_CSV_DELIMITER_PRESETS.semicolon })
const filteredRows = applyTableFilters(rows, columns, filter());
const orderedVisible = applyOrderedVisibleColumns(columns, filter());
```

```typescript
import { provideSolarisExport } from '@educarehq/solaris-ui';

bootstrapApplication(App, {
  providers: [provideSolarisExport([createCsvExporter(), createJsonExporter()])],
});
```
