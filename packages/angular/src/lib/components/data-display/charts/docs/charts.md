# Charts model (phase H0)

## Purpose

Shared foundation for the `data-display/charts` family: series/slice types,
pure scale math, the categorical token palette, and `solaris.chart.*` strings.
UI components (`chart-shell`, `line-chart`, `bar-chart`, `pie-chart`,
`sparkline`, `heatmap`, `radar`) build on this model in later phases.
The lib never fetches data and never mutates the consumer array: the host app
resolves `periodChange`/`viewChange` events and passes immutable `series` in.

## API

Types (`model/chart.types.ts`):

- `SolarisChartSeries` — `{ id, label, color?, points, hidden? }`; `hidden`
  is toggled by the shell legend without touching the consumer array.
- `SolarisChartPoint` — `{ x, y: number | null }`; `null` renders a gap.
- `SolarisChartSlice` — `{ id, label, value }` for pie/donut input.
- `SolarisChartReferenceLine` — `{ value, label?, color? }` (e.g. class average).
- `SolarisChartInterpolation` — `'smooth' | 'linear' | 'step'`.
- `SolarisChartView` — `'line' | 'bar' | 'pie'` (shell switcher).
- `SolarisChartPeriod` — `'day' | 'week' | 'month' | 'quarter' | 'year' | 'all'`.

Scale utils (`model/chart-scale.utils.ts`, pure, SSR-safe, zero dependencies):

- `resolveChartDomain(values, { includeZero?, paddingRatio? })` — axis domain;
  empty input resolves to `{ min: 0, max: 1 }`, equal values expand symmetrically.
- `resolveChartTicks(min, max, maxTicks?)` — nice-number ticks, capped count.
- `normalizeStacked100(stacks)` — per-category percentages; zero-total
  categories resolve to 0; negative/non-finite entries count as 0.
- `groupSmallChartSlices(slices, minFraction, othersLabel)` — folds slices
  below the fraction of the total into one trailing entry.
- `isChartSeriesEmpty(series)` / `visibleChartSeries(series)` — empty-state
  detection and legend filtering (returns a new array).

Palette (`model/chart-palette.ts`):

- `SOLARIS_CHART_PALETTE` — fixed categorical order
  (`primary, accent, success, violet, warning, danger, info, neutral`).
- `solarisChartColorVar(color)` / `solarisChartSoftVar(color)` — token
  variable references; `resolveChartSeriesColor(index, override?)` cycles
  the palette. No raw colors anywhere.

Strings (`model/strings/*`, `translation/*.json`): `solaris.chart.*` keys
(view/period labels, legend toggle, others, total, empty/error states,
`seriesSummary` for synthesized aria-labels) in en-US, pt-BR and es-419,
plus `resolveChartFallback(locale, key, params)` for service-level fallback.

## Accessibility

The model feeds the accessibility contract of every chart: `seriesSummary`
templates synthesize `aria-label`s (`role="img"` plus a screen-reader data
table in the UI phases), legend toggles expose `aria-pressed`, points stay
keyboard-focusable with a reduced-motion static rendering path.

## Examples

```ts
import { groupSmallChartSlices, normalizeStacked100, resolveChartDomain, resolveChartSeriesColor, resolveChartTicks } from './model/chart-scale.utils';

const domain = resolveChartDomain([12, 30, 18], { includeZero: true });
const ticks = resolveChartTicks(domain.min, domain.max, 5);
const shares = normalizeStacked100([
  [30, 40],
  [70, 60],
]);
const slices = groupSmallChartSlices(
  [
    { id: 'paid', label: 'Pago', value: 70 },
    { id: 'late', label: 'Atrasado', value: 3 },
  ],
  0.05,
  'Outros',
);
const color = resolveChartSeriesColor(0); // var(--solaris-primary-solid)
```

## Visual variants

No painted output in this phase. Color assignment follows the fixed
`SOLARIS_CHART_PALETTE` order so series keep stable hues across views;
soft variants (`solarisChartSoftVar`) back area fills. Themes (light, dark,
high-contrast) come from the referenced tokens, never from drum-specific CSS.

## CSS Variables

This phase introduces no component CSS. Renderers must consume
`--solaris-*-solid` for series strokes/fills, `--solaris-*-soft` for area
fills, grid/border/text tokens for axes, and motion tokens for animations.

## Release (phase H6)

Family close-out. Pages per type plus the combined page already ship from
H1–H5; H6 adds ink-safe print, release docs and the release changeset.
No new TypeScript in this phase (SCSS/docs only).

Showcase map (`apps/showcase`, `/data-display/charts/`):

- `shell/` — combined page: one immutable `series()` feeds `line|bar|pie`
  through the shell view switcher (Image-3 parity: hero KPI, interval,
  view dropdown, clickable legend, donut total + side values), plus KPI
  sparklines, states and fullscreen.
- `line-chart/`, `bar-chart/`, `pie-chart/`, `heatmap/`, `radar/` — one
  page per type with realistic educational data, event logs and empty states.
- Heatmap/radar stay out of the shell view switcher by design: matrix and
  axes contracts differ from x/y series.

Print (`@media print`, calendar C7 pattern):

| Component     | Hides on paper                                                 | Pins paper/ink                         | Flattens                         |
| ------------- | -------------------------------------------------------------- | -------------------------------------- | -------------------------------- |
| `chart-shell` | toolbar, period/display filters                                | canvas paper, hero/interval/legend ink | —                                |
| `line-chart`  | tooltip                                                        | frame paper, tick ink                  | —                                |
| `bar-chart`   | tooltip                                                        | svg paper, tick ink                    | horizontal scroll                |
| `pie-chart`   | tooltip                                                        | canvas paper, center/gauge/empty ink   | —                                |
| `heatmap`     | tooltip                                                        | gutter paper, gutter/column ink        | horizontal scroll, sticky gutter |
| `radar`       | tooltip                                                        | frame paper, axis/legend ink           | —                                |
| `sparkline`   | — (no print rules: pure inline SVG, no chrome, text or scroll) | —                                      | —                                |

Series/cell fills keep their data-encoded token colors on paper; heatmap
low-intensity cells and radar polygons print as-screen, so light theme is
recommended for printouts.
