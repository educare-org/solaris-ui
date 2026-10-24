# Pie chart

## Purpose

`solaris-pie-chart` renders one immutable data set as SVG `pie`, `donut`
(total in the center) or `gauge` (semicircular arc with a target tick for
class goals such as attendance or approval rate). Each slice is a
keyboard-focusable `path` with a tooltip, a screen-reader data table and a
`sliceSelect(id)` output that the showcase uses for drill-down (click a slice
to see the per-class detail). The component never fetches data and never
mutates the consumer array: geometry is derived in `computed`s from read-only
inputs. Small slices below `minSlicePercent` collapse into a single "Others"
slice via the shared `groupSmallChartSlices` util. A compact `donut` with a
single slice and `centerValue`/`centerLabel` doubles as a score-ring for report
cards. Gaps and negatives never reach the pie: slice values are clamped at
zero and an all-zero set renders a localized empty state instead of a circle.

## API

Inputs: `series` (immutable; one slice per visible series using the
sum of its plottable points, negatives treated as zero; defaults to `[]`
when `slices` is given) or `slices:
{ id, label, value }[]` (takes precedence when provided), `locale`
(required, drives the default compact `valueFormat`, percent labels and the
fallback summary), `variant: 'pie' | 'donut' | 'gauge'` (default `'pie'`;
`donut` opens a center hole with `centerValue`/`centerLabel`, defaulting to
the formatted total and `solaris.chart.total`; `gauge` draws a semicircular
track with the first slice as the needle value), `centerValue?`,
`centerLabel?`, `minSlicePercent` (default `2`; slices below this percent of
the total group into `solaris.chart.others`), `showValues` (default `false`;
prints the percent inside slices covering at least 5% of the circle),
`gaugeMin` (default `0`), `gaugeMax` (default `100`),
`gaugeTarget?` (paints a tick on the arc), `valueFormat` (default compact
`Intl.NumberFormat`), `size` (`sm | md | lg`), `density` (falls back to the
theme), `ariaLabel`/`ariaLabelKey` (default: synthesized
`Total: X; <label>: <pct>%` summary, or `<label>: <value>` with the target for
gauges). With no plottable data (empty or fully hidden series) the chart hides
the SVG and renders a localized empty state (`solaris.chart.emptyTitle` /
`solaris.chart.emptyMessage`).

Output: `sliceSelect(id)` on slice click, Enter or Space.

Pure geometry lives in `model/chart-pie.utils.ts` (`buildPieChartFrame`,
`buildGaugeGeometry`, `pieSlicePath`, `gaugeArcPath`, `gaugeTargetTick`,
`pieSliceLabelPosition`, `seriesToPieSlices`) and is SSR-safe with zero
dependencies.

## Accessibility

The SVG carries `role="img"` with a synthesized summary (`ariaLabel`
override supported). Every slice renders a `path` with an `aria-label`
(`"<label>: <value> (<pct>%)"`) and roving tabindex: `ArrowRight/Down` moves
forward, `ArrowLeft/Up` moves back, `Home/End` jump to the ends, Enter/Space
emits `sliceSelect`. Hover or focus on a slice opens a tooltip with the value,
the percent and the total, and dims every other slice. Gauges expose the same
keyboard contract on the value arc, with the target announced in the label. A
full data table is exposed to screen readers. Marks honor `:focus-visible`
rings; the sweep reveal and the pie-to-donut `d` morph freeze under
`prefers-reduced-motion` (reduced motion renders the final chart with no
animation). The tooltip docks outside the hovered slice edge on the wedge's
outer side — its inner edge sits on the anchor point and the box grows
outward, never over the data and never detached from the slice. Sizing comes from the `viewBox`, so SSR renders identically; no
`ResizeObserver` is needed.

## Examples

```html
<solaris-pie-chart locale="en-US" variant="donut" [slices]="slices" [showValues]="true" (sliceSelect)="onSliceSelect($event)" />

<solaris-pie-chart locale="en-US" variant="gauge" [slices]="[{ id: 'attendance', label: 'Attendance', value: 87 }]" [gaugeMin]="0" [gaugeMax]="100" [gaugeTarget]="90" centerLabel="Attendance" />

<solaris-pie-chart locale="en-US" variant="donut" size="sm" [slices]="[{ id: 'score', label: 'Score', value: 7.5 }]" centerValue="7.5" centerLabel="Average" />
```

## Visual variants

`size` sm/md/lg and theme density via `data-*`; `variant` pie (filled
wedges), donut (center hole with total) vs gauge (semicircular track, value
arc and target tick); the SVG caps at 400px wide so the circle stays
proportional next to line and bar charts; pie and donut share one path
structure so switching variants morphs through the CSS `d` transition;
slices fill with a series-tinted radial gradient anchored on each slice,
solid at the center with a soft shadow only at the rim; on mount every slice sweeps from
zero to its final angle with a per-slice stagger, the gauge arc fills from
zero to its value, and `showValues` percents fade in only once their slice
finished revealing (slices under 5% of the circle never print a percent); the
gauge track uses the border token and the target tick the danger token.
Light, dark and high-contrast come from tokens (see stories `Pie`,
`Donut`, `DonutWithValues`, `GroupedOthers`, `Gauge`, `ScoreRing`, `Empty`).

## CSS Variables

Layout pins to spacing/typography tokens
(`--solaris-pie-chart-label-color` →
`--solaris-neutral-text-secondary`; center value →
`--solaris-neutral-text-heading`); series fills resolve to
`var(--solaris-*-solid)` at runtime; in-slice percents (`.value`) use
`--solaris-neutral-text-light` for contrast on colored slices; focus uses `--solaris-focus-ring-*`;
motion uses `--solaris-motion-*`. No hex, no fallback.
