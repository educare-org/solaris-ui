# Chart shell

## Purpose

Generic card wrapper for every chart type (line, bar, pie in later phases).
Renders the title, hero KPI, interval label, view switcher, period filter,
loading/empty/error states and a clickable legend over projected chart
content. The shell owns no data fetching and never mutates the consumer
array: it emits `viewChange`/`periodChange` (two-way `model`s),
`seriesToggle`, `actionRequest` and `retry`, and the host app resolves them.

## API

Inputs: `title`/`titleKey`, `description`/`descriptionKey`, `heroValue`,
`heroLabel`/`heroLabelKey` (the label renders above the value, Image-2 style),
`heroDelta` (consumer-owned delta text, e.g. `+11,4%`) with
`heroDeltaDirection: 'up' | 'down' | 'flat'` (semantic badge with a caret
icon and a translated trend `aria-label`; hidden without `heroDelta`),
`intervalLabel`/`intervalLabelKey` (consumer-owned:
the shell never derives dates — update it on `periodChange`, e.g. after
fetching the new window, as the showcase does per period),
`series` (required, immutable), `view = model('line')`,
`period = model('7D')`, `availableViews`, `availablePeriods`,
`actions` (default `export` + `fullscreen`), `showViewSwitcher`,
`showPeriodFilter`, `showLegend`, `showActions`, `loading`, `error`/`errorKey`,
`size`, `density` (falls back to the theme), `locale` (required, following
the calendar shell), `ariaLabel`/`ariaLabelKey`.

Outputs: `viewChange`, `periodChange` (from the models), `seriesToggle(id)`,
`actionRequest(action)`, `retry()`.

Legend buttons toggle with `aria-pressed`; hidden series render dimmed.
The consumer flips `hidden` on its own copy of `series`.

## Accessibility

Toolbar controls are native segmented/select/menu widgets with labels;
the legend is a labelled group of toggle buttons; the chart region has
`role="img"` with a synthesized summary (`seriesSummary`); state changes
announce through a polite live region; loading uses `role="status"` with
skeletons; errors use `role="alert"` with a retry button. Motion comes from
tokens and honors `prefers-reduced-motion` via the inherited components.

## Examples

```html
<solaris-chart-shell title="Weekly Agent Activity" heroValue="12,450" heroLabel="tasks" intervalLabel="Apr 28, 2026 → May 04, 2026" [(view)]="view" [(period)]="period" [series]="series" (seriesToggle)="onSeriesToggle($event)" (actionRequest)="onAction($event)">
  <!-- projected chart (line/bar/pie in later phases) -->
</solaris-chart-shell>
```

## Visual variants

`solaris-card` surface with `size` sm/md/lg and theme density; legend dots
use the categorical palette tokens; hidden entries dim to
`--solaris-opacity-50`. Light, dark and high-contrast come from tokens.

## Print

`@media print` hides the toolbar and period/display filters, pins the
canvas to paper with hero/interval/legend text in ink, and drops shadows
for ink-safe output (calendar C7 pattern). Projected charts apply their
own print rules (tooltips hidden, scroll flattened). Pair with the browser
`window.print()` preview to export chart PDFs.

## CSS Variables

No component-specific color tokens. Layout uses spacing/typography tokens;
series color resolves to `var(--solaris-*-solid)` at runtime.
