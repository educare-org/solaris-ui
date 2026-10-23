# Heatmap

## Purpose

`solaris-heatmap` renders a fixed-size SVG matrix of `rows × columns`
(weekday by class period for attendance tracking) where each cell fills with
an intensity mix of the primary token over the neutral surface. Empty periods
(`null`, no class scheduled) paint with the neutral subtle token and are still
focusable so keyboard users can read the whole grid. The component never
fetches data and never mutates the consumer array: geometry derives in
`computed`s from read-only inputs.

## API

Inputs: `rows: { id, label, values: (number | null)[] }[]` (required),
`columns: string[]` (required, days or periods), `locale` (required, drives
the default `valueFormat` and the fallback summary), `max?` (intensity
ceiling, defaults to the peak plottable value), `valueFormat` (default
`Intl.NumberFormat` with one fraction digit), `showScale` (default `false`;
paints an intensity bar from 0 to the max below the grid), `size`
(`sm | md | lg`), `density` (falls back to the theme), `ariaLabel`/`ariaLabelKey` (default:
synthesized `Heatmap <rows> × <columns>, Total: <peak>` summary). With no
plottable data (empty rows/columns or all `null`) the chart hides the SVG and
renders a localized empty state (`solaris.chart.emptyTitle` /
`solaris.chart.emptyMessage`).

Output: `cellSelect({ rowId, columnIndex })` on cell click, Enter or Space.

Pure geometry lives in `model/chart-heatmap.utils.ts`
(`buildHeatmapFrame`, `resolveHeatmapMax`, `heatmapIntensity`,
`heatmapFillMix`, `heatmapCellFill`, `heatmapEnterDelayMs`) and is SSR-safe
with zero dependencies. The scale splits `max` into five buckets
(0–20, 20–40, 40–60, 60–80, 80–100 at `max=100`), each segment painted with
`heatmapCellFill` at the bucket ceiling and labeled with ticks at
0, 20, 40, 60, 80 and 100.

## Accessibility

The SVG carries `role="img"` with a synthesized summary (`ariaLabel`
override supported). Every cell renders a `rect` with an `aria-label`
(`"<row>, <column>: <value>"`, `—` for empty periods) and roving tabindex in
two dimensions: `ArrowRight/Left` moves across columns, `ArrowUp/Down` across
rows, `Home/End` jumps to the row ends, Enter/Space emits `cellSelect`. Hover
or focus on a cell opens a tooltip with the row, the column and the formatted
value, docked toward the grid center — its inner edge sits on the cell border
and the box grows inward, so edge cells never push the tooltip past the
scrollport or the preview surface and no extra scrollbar appears. A full data table is exposed to screen readers. Marks honor
`:focus-visible` rings; the staggered fade-in freezes under
`prefers-reduced-motion`. Sizing comes from fixed frame geometry, so SSR
renders identically; no `ResizeObserver` is needed.

## Examples

```html
<solaris-heatmap locale="en-US" [rows]="rows" [columns]="columns" [max]="100" (cellSelect)="onCellSelect($event)" />
```

## Visual variants

`size` sm/md/lg and theme density via `data-*`; cells fill with
`color-mix(in srgb, <primary> <mix>%, <neutral surface>)` so light, dark and
high-contrast follow tokens with no hex; empty periods use the neutral subtle
token. On narrow viewports the grid scrolls horizontally while the row gutter
stays sticky on the left (same idea as the week view under 640px). Cells fade
in with a per-cell stagger capped at 540ms; `showScale` adds a segmented
0-to-max intensity bar below the grid with five buckets and six ticks
(see stories `WeeklyAttendance`,
`VariedIntensity`, `Empty`).

## CSS Variables

Layout pins to spacing/typography tokens
(`--solaris-heatmap-label-color` →
`--solaris-neutral-text-secondary`; gutter →
`--solaris-neutral-text-secondary` on `--solaris-neutral-default`); series
fills resolve to `var(--solaris-primary-solid)` at runtime; focus uses
`--solaris-focus-ring-*`; motion uses `--solaris-motion-*`. No hex, no
fallback.
