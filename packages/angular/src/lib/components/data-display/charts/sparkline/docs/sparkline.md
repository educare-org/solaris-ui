# Sparkline

## Purpose

`solaris-sparkline` is a label-less, axis-less miniature line for KPI cards:
a single SVG path with a soft area wash and a semantic stroke color derived
from the trend (`positiveIsGood` decides whether a rise reads as good or
bad). Gaps (`null`/`undefined`) are skipped; an empty input renders an
empty frame that still carries its `ariaLabel`.

## API

Inputs: `points` (required, `readonly (number | null | undefined)[]`),
`interpolation: 'smooth' | 'linear'` (default `'smooth'`),
`positiveIsGood` (default `true`), `ariaLabel` (required — there is no
axis or legend to describe the data), `size` (`sm | md | lg`), `density`
(defaults to `'normal'`; the sparkline does not inherit the theme density
because it renders outside card layouts).

No outputs: sparklines are presentational. Geometry comes from the shared
`buildSparklineGeometry` helper (`model/chart-line.utils.ts`), pure and
SSR-safe.

## Accessibility

The SVG carries `role="img"` with the required `ariaLabel`
(e.g. `"Revenue trend, rising"`). Color is never the only signal: the host
exposes `data-trend` (`up | down | flat`) and the label must state the
direction. No keyboard stops, no tooltip, no animation.

## Examples

```html
<solaris-sparkline [points]="[3, 5, 4, 8, 7, 10]" ariaLabel="Revenue trend, rising" />

<solaris-sparkline [points]="[10, 8, 9, 5, 4, 3]" [positiveIsGood]="false" ariaLabel="Error rate trend, falling" />
```

## Visual variants

`size` sm/md/lg via `data-size`; trend colors resolve to
`--solaris-success-solid` (good), `--solaris-danger-solid` (bad) or
`--solaris-neutral-text-secondary` (flat). Light, dark and high-contrast
come from tokens (see stories `Rising`, `Falling`, `FallingIsGood`,
`WithGaps`).

## CSS Variables

The stroke uses the semantic color var directly; the area reuses it at
`--solaris-opacity-20`. Width pins to `--solaris-spacing-17`. No hex, no
fallback.

## Follow-ups

The `charts/sparkline` showcase (KPI cards migrated from the chart shell,
gaps, states) is provisional: revisit it after the next sparkline component
changes (interpolation options, empty-state guidance) land.
