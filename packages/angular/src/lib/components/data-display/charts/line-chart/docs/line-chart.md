# Line chart

## Purpose

`solaris-line-chart` renders one or more immutable `SolarisChartSeries` as SVG
paths with an optional series-tinted area gradient, keyboard-focusable dots, a
multi-series tooltip with the category total, horizontal `referenceLines`
(e.g. the class average) and a screen-reader data table. It never fetches data
and never mutates the consumer array: geometry is derived in `computed`s from
read-only inputs, gaps (`y: null`) split paths into separate sub-paths.
Hidden series (toggled by the `chart-shell` legend) are excluded from paths,
dots, tooltip and summary.

## API

Inputs: `series` (required, immutable), `locale` (required, drives the
default compact `yFormat` and the fallback summary),
`interpolation: 'smooth' | 'linear'` (default `'smooth'`),
`step` (default `false`; forces stepped paths),
`area` (default `true`; gradient via `color-mix` from the series color),
`showDots` (default `true`), `referenceLines: { value, label?, color? }[]`,
`xLabels` (defaults to each point's `label ?? x`),
`yFormat` (default compact `Intl.NumberFormat`),
`size` (`sm | md | lg`), `density` (falls back to the theme),
`ariaLabel`/`ariaLabelKey` (default: synthesized `seriesSummary`).

Output: `pointSelect({ seriesId, index })` on dot click, Enter or Space.

Pure geometry lives in `model/chart-line.utils.ts` (`buildLineChartFrame`,
`buildSvgLinePath`, `buildSvgAreaPath`, `sumLineChartValuesAt`,
`lineChartYPosition`) and is SSR-safe with zero dependencies.

## Transitions

Period/data changes run a deterministic `idle → exiting → rescaling → entering → idle`
sequence driven by staged (rendered) series, labels and reference lines, so the
requested dataset never leaks into the view early. EXIT erases each line with a
pen stroke (`stroke-dashoffset` 0 → length, last point first) with dots/areas
fading in reverse order; RESCALE fades axes out, swaps the staged data, then
fades the new axes in while the series stay hidden; ENTER draws each line
(`stroke-dashoffset` length → 0, first point first) with a pen dot riding
`getPointAtLength`; each dot governs itself through a backwards-filled reveal,
so markers track the virtual pen tip instead of flashing early or popping in
together, and areas fade with the stroke.
Rapid changes coalesce to the latest pending dataset (generation-guarded
cancellation, no overlapped old/new curves); tooltips and the selection guide
stay disabled until `idle`; `prefers-reduced-motion` applies the new data
synchronously without animation.

## Accessibility

The SVG carries `role="img"` with a synthesized summary (`ariaLabel`
override supported). Every plottable point renders a `circle` with an
`aria-label` (`"<series>, <category>: <value>"`) and roving tabindex:
`ArrowRight/Left/Up/Down/Home/End` move within the series, Enter/Space
emits `pointSelect`. Hover or focus opens a multi-series tooltip
(`aria-hidden` to avoid double announcement) listing each value plus the
total. A full data table is exposed to screen readers. Dots honor
`:focus-visible` rings; transitions freeze under
`prefers-reduced-motion`. Sizing comes from the `viewBox`, so SSR renders
identically; `ResizeObserver` (browser-only guard) only thins x labels on
narrow hosts.

## Examples

```html
<solaris-line-chart locale="en-US" [series]="series" interpolation="smooth" [area]="true" [showDots]="true" [referenceLines]="[{ value: 1500, label: 'Class average' }]" [xLabels]="['Mon', 'Tue', 'Wed']" (pointSelect)="onPointSelect($event)" />

<solaris-line-chart locale="en-US" [series]="series" interpolation="linear" [step]="true" [area]="false" />
```

## Visual variants

`size` sm/md/lg and theme density via `data-*`; `interpolation` smooth
(midpoint quadratics with no overshoot, Image-1 style) vs `linear` (straight
segments, Image-2 style) vs `step` (horizontal-then-vertical); `area`
toggles the `color-mix` gradient wash; dots render per series color. Light,
dark and high-contrast come from tokens (see stories `SmoothArea`,
`LinearMultiSeries`, `WithGaps`, `Stepped`).

## CSS Variables

Layout pins to spacing/typography tokens
(`--solaris-line-chart-grid-color` → `--solaris-neutral-border-default`,
`--solaris-line-chart-label-color` →
`--solaris-neutral-text-secondary`); series strokes resolve to
`var(--solaris-*-solid)` at runtime and area gradients derive from the same
var via `color-mix`; focus uses `--solaris-focus-ring-*`; motion uses
`--solaris-motion-*`. No hex, no fallback.
