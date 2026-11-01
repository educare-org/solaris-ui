# Solaris Range Slider

## Purpose

Range Slider is a form control for choosing two or more ordered numeric values
from one continuous range. It renders one `role="slider"` thumb per value on a
token-driven track with a fill spanning the outermost thumbs, per-thumb values,
optional tick marks, and an opt-in tooltip. It implements
`ControlValueAccessor` over the ordered array, so it works with Reactive Forms
and template-driven forms. For a single value, use `solaris-slider` instead.
Both components share the pure-math foundation in `forms/slider/functions`.

## API

### Inputs

Shared scale/paint inputs behave exactly like `solaris-slider` (`min/max/step/
pageStep/orientation/size/color`, `label/description/aria` pairs,
`startIcon/endIcon/thumbIcon`, `disabled/readonly/required/invalid/name`,
`showTicks/tickStep/showMinMax`, `formatValue/valueText/unit`).

| Input                   | Type                                         | Default              | Description                                                |
| ----------------------- | -------------------------------------------- | -------------------- | ---------------------------------------------------------- |
| `values`                | `model<number[]>`                            | `[25, 75]`           | Ordered ascending, length 2..N (+ `valuesChange`)          |
| `minThumbs`             | `number`                                     | `2`                  | Locked v1 floor (single-thumb belongs to `solaris-slider`) |
| `maxThumbs`             | `number`                                     | `5`                  | v1 cap (larger → dev warning + clamp)                      |
| `minStepsBetweenThumbs` | `number`                                     | `0`                  | Minimum step gap between adjacent thumbs                   |
| `scale`                 | `SolarisSliderScale`                         | `{ kind: 'linear' }` | Position mapping (`linear` = v1 behavior)                  |
| `tickValues`            | `number[]`                                   | —                    | Explicit tick positions (wins over `tickStep`)             |
| `zones`                 | `SolarisSliderZone[]`                        | —                    | First-match on the first thumb resolves `data-color`       |
| `distribution`          | `number[]`                                   | —                    | Decorative histogram densities (`aria-hidden`)             |
| `valueDisplay`          | `'inline' \| 'tooltip' \| 'thumb' \| 'none'` | `'tooltip'`          | Bubble above each thumb by default                         |
| `showMinMax`            | `boolean`                                    | `false`              | Static min/max scale bounds (decorative)                   |

### Outputs

| Output         | Payload    | Description                                            |
| -------------- | ---------- | ------------------------------------------------------ |
| `valuesChange` | `number[]` | New ordered array (every move, never mutated in place) |
| `valueCommit`  | `number[]` | Committed array (pointer-up / blur-after-key)          |
| `thumbFocus`   | `number`   | Index of the focused thumb (a11y helper)               |

### Types

```typescript
export type SolarisRangeSliderValues = number[];
export type SolarisSliderScaleKind = 'linear' | 'log' | 'pow' | 'time' | 'custom';
export type SolarisSliderScale = { kind: 'linear' } | { kind: 'log'; base?: number } | { kind: 'pow'; exponent?: number } | { kind: 'time' } | { kind: 'custom'; toRatio: (value: number) => number; fromRatio: (ratio: number) => number };
export interface SolarisSliderZone {
  from: number;
  to: number;
  color: SolarisSliderColor;
}
```

Shared scale types (`SolarisSliderSize`, `SolarisSliderColor`,
`SolarisSliderOrientation`, `SolarisSliderValueDisplay`,
`SolarisSliderValueFormatter`) are imported from `solaris-slider`.

Range Slider implements `ControlValueAccessor` over the array:

```typescript
const control = new FormControl([25, 75]);

// Reactive Forms
<solaris-range-slider [formControl]="control" />

// Template-driven
<solaris-range-slider [(ngModel)]="prices" />
```

- `writeValue` orders, clamps, snaps, and caps into `min/max/step/maxThumbs`.
- `registerOnChange` fires with a new array on every move; `valueCommit`
  fires on pointer-up or blur after keyboard changes.
- Crossing is structurally impossible: a dragged thumb clamps against its
  live neighbors (plus `minStepsBetweenThumbs`), it never reorders.
- Negative bounds are supported: `min` may sit below zero (e.g. `min="-50"`
  `max="50"` for a balance scale) — snapping, percents, ticks, and fills all
  anchor on `min`.

## Sizes

Same optical scale as `solaris-slider` (`16/20/24px` thumbs,
`4/6/8px` tracks), same `44px` minimum hit target via the invisible
token-sized extension.

## Colors

Same fill language as `solaris-slider` (`neutral/primary/success/warning/
danger/info/custom` via `--solaris-slider-custom-fill-color`).

## Orientation

`horizontal` fills left-to-right between the outermost thumbs; `vertical`
fills bottom-to-top. Keyboard is identical on both axes.

## Value display

| Mode      | Behavior                                                                                                                                     |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `tooltip` | Default bubble with arrow above each thumb, revealed on hover, focus, or drag                                                                |
| `thumb`   | Opt-in per-thumb value beside (vertical) or under (horizontal) the thumb, revealed on hover, focus, or drag so gathered thumbs never collide |
| `inline`  | Label plus joined values (`25% – 75%`) in the header                                                                                         |
| `none`    | No visual values (state stays in `aria-valuenow/text`)                                                                                       |

## Scale bounds

`showMinMax` renders the static scale bounds — the minimum at the start,
the maximum at the end — as `aria-hidden` decoration, formatted with the
`formatValue`/`unit` pipeline. Horizontal places them on either side of the
track; vertical stacks them above and below. They print as-is.

## Scale

`scale` changes WHERE each thumb sits without changing the value grammar:
keyboard steps, `step`/`pageStep` snapping, `minStepsBetweenThumbs` gaps, and
`aria-valuenow/text` stay in value space on every scale. `linear` (default)
is the v1 behavior. Each thumb positions through `thumbRatios`; the fill
spans the outermost thumbs through the same ratios.

| Kind     | Mapping                                                          |
| -------- | ---------------------------------------------------------------- |
| `linear` | Uniform (v1 behavior)                                            |
| `log`    | Decades share the track (`base`, default `10`; needs `min > 0`)  |
| `pow`    | `value = min + span * ratio^exponent` (default `2`; `min >= 0`)  |
| `time`   | Linear over epoch ms; dates come from `formatValue`/`valueText`  |
| `custom` | Consumer `toRatio`/`fromRatio` (non-finite falls back to linear) |

Invalid log/pow domains fall back to linear positioning (plus a dev-mode
warning). Pointer drags invert through the same scale, so a mid-track click
on `log` lands on the geometric mean, snapped to `step` and clamped against
live neighbors.

## Explicit ticks

`tickValues` lists tick positions in value space, placed through the active
scale. It wins over `tickStep` (dev-mode warning). `tickStep` counts linear
value steps and is ignored on `log`/`pow`/`custom` (dev-mode warning, no
ticks) — those scales need explicit values because auto-grids are ambiguous
(log minors, irregular months).

## Zones

`zones` resolves the host `data-color` from the **first thumb value**: the
first zone with `from <= value <= to` wins, else the `color` input applies.
Zone switches fade the previous color out over the new one (`normal +
standard`, instant under reduced motion, hidden in print).
Single-host coloring is locked — per-thumb colors are a non-goal. Zones
reuse the `SolarisSliderColor` token palette — never raw colors — and never
carry state alone (`aria-valuetext` always mirrors each thumb value).

## Distribution

`distribution` renders a decorative density strip behind the fill
(`aria-hidden`, static, prints as-is). Values are normalized by the peak;
non-finite and negative entries count as zero. It shares the decorative
tick color and has no motion, so no reduced-motion guard applies.

## CSS Variables

Range Slider owns no token family: it shares the `--solaris-slider-*`
track/thumb language with `solaris-slider` (see its `## CSS Variables`),
including the thumb ring (`--solaris-slider-thumb-border-width/color`) that
keeps the knob visible on the sunken track in dark theme.
`--solaris-slider-custom-fill-color` applies to both.

## Motion

Same signature as `solaris-slider`: inter-thumb fill glides via
`transform: translate + scale` (`normal + decelerate`, origin at the segment
start), `transition: none` while `data-dragging`; zone-driven `data-color`
switches (locked to the first thumb) play an overlay fade — the previous
color lingers on an `aria-hidden` layer that tracks the fill segment and
fades out (`opacity`, `normal + standard`) with no muddy midpoint, and is
instant under the doubled reduced-motion guards and hidden in print; thumb hover/`focus-visible`
scale, active press, and pointer-release spring pop identical; tooltip and
per-thumb value reveal with `opacity + translate-sm(4px)`, `normal`, enter
`decelerate` / exit `accelerate`; same doubled reduced-motion guards (pop,
slide, and scale all removed; state stays per thumb in
`aria-valuenow/text`). The pop is vestibular-sensitive by design (spring is
opt-in) and never fires for keyboard commits.

## Accessibility

- One `role="slider"` per thumb, each with its own
  `aria-valuemin/max/now/text` and `aria-orientation`.
- Naming is a single composed `aria-label` per thumb (consumer
  `ariaLabel/ariaLabelKey` wins; else the visible label plus the positional
  name): two thumbs use the translated `solaris.slider.minHandle/maxHandle`,
  three or more use `solaris.slider.thumbN` (`{{index}}`/`{{total}}`).
- Keyboard per thumb (WAI-APG): ArrowUp/Right `+step`, ArrowDown/Left
  `-step`, Home minimum, End maximum, PageUp/Down `±pageStep`. `thumbFocus`
  reports the focused index for group announcements.
- `44px` minimum pointer target per thumb (same extension as single);
  thumbs stay in tab order when enabled, `tabindex="-1"` + `aria-disabled`
  when disabled; `readonly` keeps focus and ignores edits.
- Ticks, icons, tooltips, and thumb values are `aria-hidden` decoration.
- Fill/track colors come from themed token pairs (light/dark/high
  contrast); state never relies on color alone.

## Examples

```html
<!-- Basic range -->
<solaris-range-slider label="Price" [(values)]="prices" />

<!-- Three thumbs -->
<solaris-range-slider label="Segments" [values]="[10, 50, 90]" />

<!-- Minimum gap -->
<solaris-range-slider label="Gap" [values]="[20, 80]" [minStepsBetweenThumbs]="10" />

<!-- Vertical -->
<solaris-range-slider label="Range" orientation="vertical" [values]="[20, 80]" />

<!-- Ticks -->
<solaris-range-slider label="Brightness range" [showTicks]="true" [tickStep]="10" />

<!-- Logarithmic scale with explicit ticks -->
<solaris-range-slider label="Frequency range" [min]="20" [max]="20000" [values]="[100, 5000]" [scale]="{ kind: 'log' }" [showTicks]="true" [tickValues]="[20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000]" />

<!-- Time scale with explicit ticks -->
<solaris-range-slider label="Booking window" [min]="1704067200000" [max]="1735689600000" [values]="[1709251200000, 1725148800000]" [scale]="{ kind: 'time' }" [showTicks]="true" [tickValues]="[1704067200000, 1711929600000, 1719792000000, 1727740800000, 1735689600000]" />

<!-- Zones (host color follows the first thumb) -->
<solaris-range-slider label="Risk band" [values]="[10, 70]" [zones]="[{ from: 0, to: 33, color: 'success' }, { from: 33, to: 66, color: 'warning' }, { from: 66, to: 100, color: 'danger' }]" />

<!-- Distribution backdrop -->
<solaris-range-slider label="Demand band" [distribution]="[2, 5, 9, 7, 3]" />

<!-- States -->
<solaris-range-slider label="Range" [disabled]="true" />
<solaris-range-slider label="Range" [readonly]="true" />
<solaris-range-slider label="Range" [invalid]="true" />

<!-- Reactive Forms -->
<solaris-range-slider [formControl]="pricesControl" />
```

## Print

`@media print` renders committed values statically: the opt-in tooltip
hides (its reserve collapses), per-thumb `thumb` values print revealed, the
thumb cursors go static, and fill/thumb motion stops. Tooltip-mode values
are hover-only by design, so paper shows no bubble — prefer `thumb` or
`inline` display when the page must print.

## Limitations (v1 + v2 range)

- `maxThumbs` is capped at 5 (larger requests warn and clamp).
- Thumbs never cross or reorder (ordered clamp, no free-crossing mode).
- `minThumbs` below 2 is out of v1 (use `solaris-slider`).
- No per-thumb colors (host `data-color` resolves from the first thumb),
  per-tick labels, or custom thumb templates.
- `tickStep` is linear-only; non-linear scales require `tickValues`.
- `required` is a visual marker + form-field concern, not native validation.

```

```
