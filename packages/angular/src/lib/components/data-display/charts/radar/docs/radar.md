# Radar

## Purpose

`solaris-radar` renders one or more overlaid series on a shared set of axes
(competency profile per class) as SVG polygons with focusable vertices. An
integrated legend toggles each series with `aria-pressed` without refetching
anything: the component never fetches data and never mutates the consumer
array — geometry derives in `computed`s from read-only inputs, and toggling
only flips a local hidden set while emitting `seriesToggle`.

## API

Inputs: `axes: string[]` (required, at least three to draw the web),
`series: { id, label, color?, values: (number | null)[], hidden? }[]`
(default `[]`), `locale` (required, drives the default `valueFormat` and the
fallback summary), `max?` (per-axis ceiling, defaults to the peak plottable
value), `levels?` (grid rings, default `4`), `valueFormat` (default
`Intl.NumberFormat` with one fraction digit), `showVertices` (default `true`),
`size` (`sm | md | lg`), `density` (falls back to the theme),
`ariaLabel`/`ariaLabelKey` (default: synthesized
`Radar <n> axes; <label>: <values>` summary). With fewer than three axes or no
visible series the chart hides the SVG and renders a localized empty state
(`solaris.chart.emptyTitle` / `solaris.chart.emptyMessage`).

Outputs: `vertexSelect({ seriesId, axisIndex })` on vertex click, Enter or
Space; `seriesToggle(id)` when a legend button hides or shows a series.

Pure geometry lives in `model/chart-radar.utils.ts` (`buildRadarFrame`,
`radarVertexPoint`, `radarPolygonPath`, `resolveRadarMax`,
`visibleRadarSeries`, enter helpers) and is SSR-safe with zero dependencies.

## Accessibility

The SVG carries `role="img"` with a synthesized summary (`ariaLabel`
override supported). Every vertex renders a `circle` with an `aria-label`
(`"<series>, <axis>: <value>"`, `—` for missing points) and roving tabindex
within its series: `ArrowRight/Down` moves to the next axis,
`ArrowLeft/Up` to the previous one, `Home/End` jumps to the ends, Enter/Space
emits `vertexSelect`. Hover or focus on a vertex opens a tooltip with the
series, the axis and the formatted value, docked outside the vertex on the
axis direction — its inner edge sits off the vertex and the box grows outward,
never over the hovered data. Legend buttons read as filters (a `Filter by:`
title like the chart shell, hover background, struck-through label when
hidden) and expose `aria-pressed`. A full data table is exposed to screen
readers. Marks honor
`:focus-visible` rings; the grow-from-center reveal freezes under
`prefers-reduced-motion` (reduced motion renders the final web with no
animation). Sizing comes from the `viewBox`, so SSR renders identically; no
`ResizeObserver` is needed.

## Examples

```html
<solaris-radar locale="en-US" [axes]="axes" [series]="series" [max]="10" (vertexSelect)="onVertexSelect($event)" (seriesToggle)="onSeriesToggle($event)" />
```

## Visual variants

`size` sm/md/lg and theme density via `data-*`; polygons fill with a
`color-mix` wash of their series token over transparent with a solid stroke,
vertices paint solid; on mount every polygon grows from the center with a
per-series stagger while grid rings fade in; hidden series keep their stable
palette slot so remaining colors never shift. Light, dark and high-contrast
come from tokens (see stories `ClassProfile`, `TwoClasses`, `ManySeries`,
`Empty`).

## CSS Variables

Layout pins to spacing/typography tokens
(`--solaris-radar-label-color` →
`--solaris-neutral-text-secondary`); series fills resolve to
`var(--solaris-*-solid)` at runtime; focus uses `--solaris-focus-ring-*`;
motion uses `--solaris-motion-*`. No hex, no fallback.
