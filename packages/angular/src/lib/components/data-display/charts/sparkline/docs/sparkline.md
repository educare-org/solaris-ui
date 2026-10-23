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
axis or legend to describe the data), `size` (`sm | md | lg`, default
`md`; `sm` narrows to `spacing-15`, `lg` widens to `spacing-18`, `md` is
unchanged), `density` (default `'normal'`; the sparkline does not inherit
the theme density because it renders outside card layouts —
`compact` keeps the `sm` stroke, `comfortable` uses the `lg` stroke),
`appearance: 'plain' | 'card'` (default `'plain'`), plus the card-only
display strings `title`, `value`, `delta` and `deltaDirection:
'up' | 'down' | 'flat'` (defaults to the computed data trend; the badge
color reuses `positiveIsGood`, so a falling error rate still reads as good).

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

<solaris-sparkline appearance="card" [points]="[820, 940, 880, 1010, 990, 1120, 1240]" title="Active users" value="12,480" delta="+8.2%" ariaLabel="Active users trend, rising" />
```

Card mode projects the KPI trio (title, value, delta badge) over
`solaris-card` (`padding="md"`) with the sparkline below; badge color
follows `deltaDirection` (default: data trend) crossed with
`positiveIsGood` (`up` good → `success`, bad → `danger`, `flat` →
`neutral`). Color is never the only signal: the host keeps
`data-trend` and the delta text carries the direction.

## Visual variants

`size` sm/md/lg via `data-size`; trend colors resolve to
`--solaris-success-solid` (good), `--solaris-danger-solid` (bad) or
`--solaris-neutral-text-secondary` (flat). Light, dark and high-contrast
come from tokens (see stories `Rising`, `Falling`, `FallingIsGood`,
`WithGaps`, `Card`, `SizeDensity`).

## CSS Variables

The stroke uses the semantic color var directly; the area reuses it at
`--solaris-opacity-20`. Width pins to `--solaris-sparkline-width`
(default `spacing-17`; `sm` → `spacing-15`, `lg` → `spacing-18`). No hex, no
fallback.

## Follow-ups

- ~~The `charts/sparkline` showcase (KPI cards migrated from the chart shell,
  gaps, states) is provisional: revisit it after the next sparkline component
  changes (interpolation options, empty-state guidance) land.~~ DONE in V2-C:
  `appearance="card"` ships with the `Card` story and the KPI section keeps
  manual badge+sparkline compositions alongside card demos. Empty-state
  guidance stays out of scope (no V2 follow-up scheduled).
