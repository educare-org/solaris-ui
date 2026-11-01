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

| Input                   | Type                                         | Default     | Description                                                |
| ----------------------- | -------------------------------------------- | ----------- | ---------------------------------------------------------- |
| `values`                | `model<number[]>`                            | `[25, 75]`  | Ordered ascending, length 2..N (+ `valuesChange`)          |
| `minThumbs`             | `number`                                     | `2`         | Locked v1 floor (single-thumb belongs to `solaris-slider`) |
| `maxThumbs`             | `number`                                     | `5`         | v1 cap (larger → dev warning + clamp)                      |
| `minStepsBetweenThumbs` | `number`                                     | `0`         | Minimum step gap between adjacent thumbs                   |
| `valueDisplay`          | `'inline' \| 'tooltip' \| 'thumb' \| 'none'` | `'tooltip'` | Bubble above each thumb by default                         |
| `showMinMax`            | `boolean`                                    | `false`     | Static min/max scale bounds (decorative)                   |

### Outputs

| Output         | Payload    | Description                                            |
| -------------- | ---------- | ------------------------------------------------------ |
| `valuesChange` | `number[]` | New ordered array (every move, never mutated in place) |
| `valueCommit`  | `number[]` | Committed array (pointer-up / blur-after-key)          |
| `thumbFocus`   | `number`   | Index of the focused thumb (a11y helper)               |

### Types

```typescript
export type SolarisRangeSliderValues = number[];
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

## CSS Variables

Range Slider owns no token family: it shares the `--solaris-slider-*`
track/thumb language with `solaris-slider` (see its `## CSS Variables`),
including the thumb ring (`--solaris-slider-thumb-border-width/color`) that
keeps the knob visible on the sunken track in dark theme.
`--solaris-slider-custom-fill-color` applies to both.

## Motion

Same signature as `solaris-slider`: inter-thumb fill glides via
`transform: translate + scale` (`normal + decelerate`, origin at the segment
start), `transition: none` while `data-dragging`; thumb hover/`focus-visible`
scale, active press, and pointer-release spring pop identical; tooltip and
per-thumb value reveal with `opacity + translate-sm(4px)`, `fast`, enter
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

## Limitations (v1)

- `maxThumbs` is capped at 5 (larger requests warn and clamp).
- Thumbs never cross or reorder (ordered clamp, no free-crossing mode).
- `minThumbs` below 2 is out of v1 (use `solaris-slider`).
- Linear `min/max/step` scales only; no per-thumb colors, per-tick labels,
  or custom thumb templates.
- `required` is a visual marker + form-field concern, not native validation.

```

```
