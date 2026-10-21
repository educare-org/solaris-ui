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
- `SolarisChartPeriod` — `'1D' | '7D' | '1M' | '3M' | 'YTD' | 'all'`.

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
