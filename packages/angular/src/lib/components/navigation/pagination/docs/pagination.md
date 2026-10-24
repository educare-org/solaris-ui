# Solaris Pagination

## Purpose

Pagination navigates paged data with first/previous/next/last controls, a page-size selector, and an item-window range label. It is standalone and reusable without `solaris-table`; to share the table border, project it into `ng-template[solaris-table-footer]` (see the table footer docs).

## When to use

- Paging table rows (combine with `solaris-table` in the consumer).
- Paging any list with a known or unknown total.
- Cursor-based paging through `hasMore` when the total is unknown.

## When not to use

- Do not use Pagination for tab navigation.
- Do not use Pagination for wizard steps (use `solaris-stepper`).

## API

### SolarisPaginationComponent

**Selector:** `solaris-pagination`

| Input                                        | Type                                                  | Default        | Description                                                                                               |
| -------------------------------------------- | ----------------------------------------------------- | -------------- | --------------------------------------------------------------------------------------------------------- |
| `pageIndex`                                  | `number`                                              | `0`            | Zero-based page (clamped)                                                                                 |
| `pageSize`                                   | `number`                                              | `10`           | Rows per page                                                                                             |
| `total`                                      | `number \| undefined`                                 | `undefined`    | Known total; `undefined` = unknown                                                                        |
| `hasMore`                                    | `boolean`                                             | `false`        | Next page exists when the total is unknown                                                                |
| `pageSizeOptions`                            | `readonly number[]`                                   | `[10, 25, 50]` | Page-size choices rendered with `solaris-select`                                                          |
| `showFirstLast`                              | `boolean`                                             | `true`         | First/last buttons                                                                                        |
| `showRangeLabel`                             | `boolean`                                             | `true`         | Range label                                                                                               |
| `showPageSize`                               | `boolean`                                             | `true`         | Page-size selector                                                                                        |
| `density`                                    | `'compact' \| 'normal' \| 'comfortable' \| undefined` | inherited      | Density variant                                                                                           |
| `ariaLabel` / `ariaLabelKey`                 | `string \| undefined`                                 | `undefined`    | Accessible navigation name                                                                                |
| `firstPageLabel` / `firstPageLabelKey`       | `string \| undefined`                                 | `undefined`    | First page button label                                                                                   |
| `previousPageLabel` / `previousPageLabelKey` | `string \| undefined`                                 | `undefined`    | Previous page button label                                                                                |
| `nextPageLabel` / `nextPageLabelKey`         | `string \| undefined`                                 | `undefined`    | Next page button label                                                                                    |
| `lastPageLabel` / `lastPageLabelKey`         | `string \| undefined`                                 | `undefined`    | Last page button label                                                                                    |
| `rowsPerPageLabel` / `rowsPerPageLabelKey`   | `string \| undefined`                                 | `undefined`    | Page-size label                                                                                           |
| `rangeLabel` / `rangeLabelKey`               | `string \| undefined`                                 | `undefined`    | Known-total template (`{{start}}–{{end}} of {{total}}`)                                                   |
| `rangeLabelCompact` / `rangeLabelCompactKey` | `string \| undefined`                                 | `undefined`    | Unknown-total template (`{{start}}–{{end}}`)                                                              |
| `description` / `descriptionKey`             | `string \| undefined`                                 | `undefined`    | Optional leading text (e.g. `Task management`); when set, page-size + range + controls group on the right |

| Output       | Type                | Description                                                              |
| ------------ | ------------------- | ------------------------------------------------------------------------ |
| `pageChange` | `SolarisPageChange` | Emitted with `{ pageIndex, pageSize }`; changing page size resets to `0` |

With a known `total`, the range reads the item window `{start}–{end} of {total}` (e.g. `1–10 of 95`) and first/last follow the clamp. With `total === undefined`, the range is the compact item window `{start}–{end}` and next is enabled by `hasMore`.

Without `description`, the layout is page-size (left), range (center), controls (right). With `description`, the text sits alone on the left and page-size + range + controls group on the right. The page-size selector uses the borderless `minimal` select appearance (value + chevron only; the bordered panel appears on open).

On narrow viewports (`matchMedia('(max-width: 720px)')`, same breakpoint as the table card layout) the component sets `data-narrow`: the "rows per page" label is hidden and the page-size selector switches to the bordered `outline` appearance. The accessible name is preserved through the select `aria-label`. The label is also hidden by CSS whenever pagination renders inside a card/mobile table footer (`solaris-table[data-card-layout]` or `solaris-table[data-mobile]`), which covers card layouts forced on wide viewports (e.g. `layout="card"`). The page-size selector is compact: `triggerMinWidth`/`panelMinWidth` are `0` (opting out of the select widest-option floor), the value reserves `3ch`, and the projected options use compact padding.

## Density

Default: inherited from the theme system via `effectiveDensity` (`density() ?? themeService.density`).

## Accessibility

- Controls live in a `<nav>` with an accessible label; every button is real with a translatable `aria-label` and native `disabled` at the limits.
- The range label uses `role="status"`.
- Focus uses `:focus-visible` with `--solaris-focus-ring-*` tokens; motion respects `prefers-reduced-motion`.
- Keyboard: native Tab/Enter/Space on buttons and the page-size select.

## CSS Variables

| Token                                   | Purpose                                             |
| --------------------------------------- | --------------------------------------------------- |
| `--solaris-pagination-gap`              | Gap between sections (`--solaris-spacing-6`)        |
| `--solaris-pagination-min-height`       | Minimum height (`--solaris-spacing-11`)             |
| `--solaris-pagination-range-color`      | Range, description and page-size label color        |
| `--solaris-pagination-button-size`      | Navigation button hit area (`--solaris-spacing-10`) |
| `--solaris-pagination-button-icon-size` | Navigation icon size (`--solaris-spacing-8`)        |
| `--solaris-pagination-button-color`     | Navigation icon color (secondary; body on hover)    |

## Examples

```html
<solaris-pagination [pageIndex]="pageIndex" [pageSize]="pageSize" [total]="total" (pageChange)="onPageChange($event)" />

<solaris-pagination [pageIndex]="cursor" [hasMore]="true" />

<solaris-pagination description="Task management" [pageIndex]="pageIndex" [pageSize]="pageSize" [total]="total" (pageChange)="onPageChange($event)" />

<solaris-table [data]="pageRows" [columns]="columns" rowId="id">
  <ng-template solaris-table-footer>
    <solaris-pagination [pageIndex]="pageIndex" [pageSize]="pageSize" [total]="total" (pageChange)="onPageChange($event)" />
  </ng-template>
</solaris-table>
```
