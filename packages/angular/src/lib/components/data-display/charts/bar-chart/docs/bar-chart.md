# Bar chart

## Purpose

`solaris-bar-chart` renders one or more immutable `SolarisChartSeries` as SVG
bars with series-tinted vertical gradients, keyboard-focusable marks, a
category tooltip with the column total, horizontal `referenceLines` (e.g. the
class average, painted above the bars) and a screen-reader data table. It
never fetches data and never mutates the consumer array: geometry is derived
in `computed`s from read-only inputs. Gaps (`y: null`) render no bar; hidden
series (toggled by the `chart-shell` legend) are excluded from bars, tooltip
and summary.

## API

Inputs: `series` (required, immutable), `locale` (required, drives the
default compact `valueFormat` and the fallback summary),
`orientation: 'vertical' | 'horizontal'` (default `'vertical'`; horizontal
grows the viewBox with the category count so rows keep a tappable height),
`layout: 'grouped' | 'stacked' | 'stacked-100'` (default `'grouped'`;
`stacked-100` normalizes each category to 100% and treats negatives as zero),
`barRadius` (default: `--solaris-radius-sm` token; pass a number of pixels to
override), `referenceLines: { value, label?, color? }[]` (painted above the
bars), `xLabels` (defaults to each point's `label ?? x`), `valueFormat`
(default compact `Intl.NumberFormat`; a `%` suffix is appended on ticks,
tooltips and aria labels in `stacked-100` mode), `showValues` (default
`false`; renders the formatted value above each bar tip, hidden during the
collapse and fading back in per series as bars regrow), `size` (`sm | md | lg`),
`density` (falls back to the theme), `ariaLabel`/`ariaLabelKey` (default:
synthesized `seriesSummary`). Dense vertical charts (12+ categories) keep a
minimum column width and scroll horizontally instead of squeezing bars.
With no plottable data (empty or fully hidden series) the chart hides the SVG
and renders a localized empty state (`solaris.chart.emptyTitle` /
`solaris.chart.emptyMessage`).

Output: `pointSelect({ seriesId, index })` on bar click, Enter or Space.
`index` is the category position shared by every series.

Pure geometry lives in `model/chart-bar.utils.ts` (`buildBarChartFrame`,
`resolveBarLabelEvery`, `truncateBarCategoryLabel`, `barChartValuePosition`)
and is SSR-safe with zero dependencies. A future `combo-chart` component will
own line overlays on a second axis; `bar-chart` stays pure bars.

## Accessibility

The SVG carries `role="img"` with a synthesized summary (`ariaLabel`
override supported). Every plottable bar renders a `path` with selective
outer rounding (baseline edges stay square; only free ends round, so stacked
segments join seamlessly) and an `aria-label`
(`"<series>, <category>: <value>"`) with roving tabindex:
`ArrowRight/Down` moves forward, `ArrowLeft/Up` moves back, `Home/End` jump
to the ends, Enter/Space emits `pointSelect`. Hover or focus on a bar opens a
single-series tooltip and dims every other bar with no background guide; hover on the main axis
(x labels in vertical mode, y labels in horizontal mode) opens the full
category tooltip with the column total, shows a narrowed guide (side gaps, bottom
edge exactly on the zero baseline so it never leaks past the axis) that
grows/shrinks in height only from the zero
baseline (`scaleY`/`scaleX` with `--solaris-motion-duration-normal`), and promotes the
active category tick from `--solaris-neutral-text-secondary` to
`--solaris-neutral-text-body`. A full data table is exposed to screen readers. Marks honor
`:focus-visible` rings; the staggered enter animation, layout morphing (bars
collapse onto their own base, then regrow bottom-up in chained per-series
phases without crossing over each other, while tooltip and guide stay hidden)
and hover transitions freeze under `prefers-reduced-motion`. Sizing comes from
the `viewBox`, so SSR renders identically; `ResizeObserver` (browser-only
guard) only thins labels on narrow hosts and scrolls dense charts.

## Examples

```html
<solaris-bar-chart locale="en-US" [series]="series" orientation="vertical" layout="grouped" [referenceLines]="[{ value: 1500, label: 'Class average' }]" [xLabels]="['Mon', 'Tue']" (pointSelect)="onPointSelect($event)" />

<solaris-bar-chart locale="en-US" [series]="series" orientation="horizontal" layout="stacked-100" [barRadius]="6" />
```

## Visual variants

`size` sm/md/lg and theme density via `data-*`; `orientation` vertical
(value axis Y, Image-3 style columns) vs `horizontal` (value axis X, category
labels truncated on the left); `layout` grouped (side-by-side bars),
stacked (diverging stacks: negatives extend below the baseline) vs
`stacked-100` (percent columns, `%` suffix); bars fill with a series-tinted vertical gradient and grow with a per-bar stagger on mount; reference lines render above the bars; bars use
`roundedBarPath` with the `--solaris-bar-chart-bar-radius` token (default `--solaris-radius-sm`, overridable
per instance via the `barRadius` input) so only outer free ends round; the category
guide is narrowed with side gaps, ends exactly on the zero baseline, and grows/shrinks in height
only from the zero baseline with `--solaris-motion-duration-normal`; `showValues` prints the
formatted value above each bar tip. Light, dark and high-contrast come
from tokens (see stories `GroupedVertical`, `WithValues`, `Stacked`, `Stacked100`,
`HorizontalLongLabels`, `HorizontalGrouped`).

## CSS Variables

Layout pins to spacing/typography tokens
(`--solaris-bar-chart-grid-color` → `--solaris-neutral-border-default`,
`--solaris-bar-chart-label-color` →
`--solaris-neutral-text-secondary`); series fills resolve to
`var(--solaris-*-solid)` at runtime; the bar corner uses
`--solaris-bar-chart-bar-radius` (default `--solaris-radius-sm`, overridable
per instance via the `barRadius` input); focus uses
`--solaris-focus-ring-*`; motion uses `--solaris-motion-*`. No hex, no
fallback.
