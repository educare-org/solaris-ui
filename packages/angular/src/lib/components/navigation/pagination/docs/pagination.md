# Solaris Pagination

## Purpose

Pagination navigates paged data with first/previous/next/last controls, a page-size selector, and a range label. It is standalone and reusable without `solaris-table`; the table never renders pagination itself.

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

| Input                                        | Type                                                  | Default        | Description                                        |
| -------------------------------------------- | ----------------------------------------------------- | -------------- | -------------------------------------------------- |
| `pageIndex`                                  | `number`                                              | `0`            | Zero-based page (clamped)                          |
| `pageSize`                                   | `number`                                              | `10`           | Rows per page                                      |
| `total`                                      | `number \| undefined`                                 | `undefined`    | Known total; `undefined` = unknown                 |
| `hasMore`                                    | `boolean`                                             | `false`        | Next page exists when the total is unknown         |
| `pageSizeOptions`                            | `readonly number[]`                                   | `[10, 25, 50]` | Page-size choices rendered with `solaris-select`   |
| `showFirstLast`                              | `boolean`                                             | `true`         | First/last buttons                                 |
| `showRangeLabel`                             | `boolean`                                             | `true`         | Range label                                        |
| `showPageSize`                               | `boolean`                                             | `true`         | Page-size selector                                 |
| `density`                                    | `'compact' \| 'normal' \| 'comfortable' \| undefined` | inherited      | Density variant                                    |
| `ariaLabel` / `ariaLabelKey`                 | `string \| undefined`                                 | `undefined`    | Accessible navigation name                         |
| `firstPageLabel` / `firstPageLabelKey`       | `string \| undefined`                                 | `undefined`    | First page button label                            |
| `previousPageLabel` / `previousPageLabelKey` | `string \| undefined`                                 | `undefined`    | Previous page button label                         |
| `nextPageLabel` / `nextPageLabelKey`         | `string \| undefined`                                 | `undefined`    | Next page button label                             |
| `lastPageLabel` / `lastPageLabelKey`         | `string \| undefined`                                 | `undefined`    | Last page button label                             |
| `rowsPerPageLabel` / `rowsPerPageLabelKey`   | `string \| undefined`                                 | `undefined`    | Page-size label                                    |
| `rangeLabel` / `rangeLabelKey`               | `string \| undefined`                                 | `undefined`    | Known-total template (`Page {{start}} of {{end}}`) |
| `rangeLabelCompact` / `rangeLabelCompactKey` | `string \| undefined`                                 | `undefined`    | Unknown-total template (`{{start}}–{{end}}`)       |

| Output       | Type                | Description                                                              |
| ------------ | ------------------- | ------------------------------------------------------------------------ |
| `pageChange` | `SolarisPageChange` | Emitted with `{ pageIndex, pageSize }`; changing page size resets to `0` |

With a known `total`, the range reads `Page {start} of {end}` and first/last follow the clamp. With `total === undefined`, the range is the compact item window `{start}–{end}` and next is enabled by `hasMore`.

## Density

Default: inherited from the theme system via `effectiveDensity` (`density() ?? themeService.density`).

## Accessibility

- Controls live in a `<nav>` with an accessible label; every button is real with a translatable `aria-label` and native `disabled` at the limits.
- The range label uses `role="status"`.
- Focus uses `:focus-visible` with `--solaris-focus-ring-*` tokens; motion respects `prefers-reduced-motion`.
- Keyboard: native Tab/Enter/Space on buttons and the page-size select.

## CSS Variables

| Token                              | Purpose                         |
| ---------------------------------- | ------------------------------- |
| `--solaris-pagination-gap`         | Gap between sections (12px)     |
| `--solaris-pagination-min-height`  | Minimum height (36px)           |
| `--solaris-pagination-range-color` | Range and page-size label color |
| `--solaris-pagination-button-size` | Navigation button size (32px)   |

## Examples

```html
<solaris-pagination [pageIndex]="pageIndex" [pageSize]="pageSize" [total]="total" (pageChange)="onPageChange($event)" />

<solaris-pagination [pageIndex]="cursor" [hasMore]="true" />
```
