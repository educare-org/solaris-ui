# Solaris Slider

## Purpose

Slider is a form control for choosing a single numeric value from a continuous
range. It renders one `role="slider"` thumb on a token-driven track with a
fill from the minimum edge to the thumb, an inline label/value header, optional
tick marks, decorative edge icons, and an opt-in tooltip. It implements
`ControlValueAccessor`, so it works with Reactive Forms and template-driven
forms. For two or more ordered values, use `solaris-range-slider` instead.

## API

### Inputs

| Input                            | Type                                                                                 | Default            | Description                                            |
| -------------------------------- | ------------------------------------------------------------------------------------ | ------------------ | ------------------------------------------------------ |
| `value`                          | `model<number>`                                                                      | `50`               | Two-way single value (+ `valueChange`)                 |
| `min`                            | `number`                                                                             | `0`                | Range floor                                            |
| `max`                            | `number`                                                                             | `100`              | Range ceiling (`max > min` enforced, else dev warning) |
| `step`                           | `number`                                                                             | `1`                | Snap interval (`> 0` enforced)                         |
| `pageStep`                       | `number`                                                                             | `10 * step`        | PageUp/Down jump (clamped to range)                    |
| `orientation`                    | `'horizontal' \| 'vertical'`                                                         | `'horizontal'`     | Axis                                                   |
| `size`                           | `'sm' \| 'md' \| 'lg'`                                                               | `'md'`             | Thumb/track scale                                      |
| `color`                          | `'neutral' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'custom'` | `'neutral'`        | Fill/thumb color                                       |
| `valueDisplay`                   | `'inline' \| 'tooltip' \| 'thumb' \| 'none'`                                         | `'inline'`         | Where the value shows                                  |
| `formatValue`                    | `(v: number) => string`                                                              | `String(v)` + unit | Display formatter                                      |
| `valueText`                      | `(v: number) => string`                                                              | `formatValue(v)`   | `aria-valuetext` builder                               |
| `unit` / `unitKey`               | `string`                                                                             | `'%'`              | Suffix appended by the default formatter               |
| `showTicks`                      | `boolean`                                                                            | `false`            | Render tick marks                                      |
| `tickStep`                       | `number`                                                                             | `step`             | Tick interval (decorative)                             |
| `showMinMax`                     | `boolean`                                                                            | `false`            | Static min/max scale bounds (decorative)               |
| `label` / `labelKey`             | `string`                                                                             | —                  | Field label (header row)                               |
| `description` / `descriptionKey` | `string`                                                                             | —                  | Help text below the track                              |
| `ariaLabel` / `ariaLabelKey`     | `string`                                                                             | —                  | Fallback name when no visible label                    |
| `startIcon` / `endIcon`          | `SolarisIconName`                                                                    | —                  | Decorative extremities (e.g. volume)                   |
| `thumbIcon`                      | `SolarisIconName`                                                                    | —                  | Free icon inside the thumb (grip suggestion)           |
| `disabled`                       | `boolean`                                                                            | `false`            | CVA-disabled                                           |
| `readonly`                       | `boolean`                                                                            | `false`            | Focusable, non-editable                                |
| `required`                       | `boolean`                                                                            | `false`            | Shows the required marker                              |
| `invalid`                        | `boolean`                                                                            | `false`            | Error state (+ `aria-invalid`)                         |
| `name`                           | `string`                                                                             | —                  | Form field name (hidden input)                         |

### Outputs

| Output        | Payload  | Description                            |
| ------------- | -------- | -------------------------------------- |
| `valueChange` | `number` | Two-way pair with `value` (every move) |
| `valueCommit` | `number` | Pointer-up / blur-after-key commit     |

### Types

```typescript
export type SolarisSliderSize = 'sm' | 'md' | 'lg';
export type SolarisSliderColor = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'custom';
export type SolarisSliderOrientation = 'horizontal' | 'vertical';
export type SolarisSliderValueDisplay = 'inline' | 'tooltip' | 'thumb' | 'none';
export type SolarisSliderValueFormatter = (value: number) => string;
```

Slider implements `ControlValueAccessor`, so it works with Reactive Forms
(`[formControl]`, `formControlName`) and template-driven forms (`[(ngModel)]`).

```typescript
const control = new FormControl(50);

// Reactive Forms
<solaris-slider [formControl]="control" />
<solaris-slider formControlName="volume" />

// Template-driven
<solaris-slider [(ngModel)]="volume" />
```

- `writeValue` clamps and snaps into `min/max/step`.
- `registerOnChange` fires on every move; `valueCommit` fires on pointer-up or
  blur after keyboard changes.
- `registerOnTouched` fires on blur and pointer-up.
- `setDisabledState` reflects the form control disabled state.

## Sizes

| Size | Thumb (optical) | Track thickness |
| ---- | --------------- | --------------- |
| `sm` | `16px`          | `4px`           |
| `md` | `20px`          | `6px`           |
| `lg` | `24px`          | `8px`           |

Every size extends the pointer target to at least `48px` via an invisible
token-sized thumb extension (see Accessibility).

## Colors

| Color     | Fill                                                      |
| --------- | --------------------------------------------------------- |
| `neutral` | Neutral body text token (default)                         |
| `primary` | Primary solid                                             |
| `success` | Success solid                                             |
| `warning` | Warning solid                                             |
| `danger`  | Danger solid                                              |
| `info`    | Info solid                                                |
| `custom`  | Consumer-defined via `--solaris-slider-custom-fill-color` |

## Orientation

`horizontal` fills left-to-right from the minimum edge; `vertical` fills
bottom-to-top. Keyboard is identical on both axes (ArrowUp/Right increase).
The vertical track length defaults to `--solaris-slider-track-length`
(`128px`) and can be overridden per instance.

## Value display

| Mode      | Behavior                                                          |
| --------- | ----------------------------------------------------------------- |
| `inline`  | Label left + formatted value right in the header (single default) |
| `tooltip` | Opt-in bubble above the thumb on hover, focus, or drag            |
| `thumb`   | Value rendered under the thumb                                    |
| `none`    | No visual value (state stays in `aria-valuenow/text`)             |

## Scale bounds

`showMinMax` renders the static scale bounds — the minimum at the start,
the maximum at the end — as `aria-hidden` decoration, formatted with the
`formatValue`/`unit` pipeline. Horizontal places them on either side of the
track; vertical stacks them above and below. They print as-is.

## CSS Variables

```txt
--solaris-slider-track-height, --solaris-slider-track-length,
--solaris-slider-track-color, --solaris-slider-fill-color,
--solaris-slider-thumb-size, --solaris-slider-thumb-icon-size,
--solaris-slider-thumb-border-width, --solaris-slider-thumb-border-color,
--solaris-slider-tick-size, --solaris-slider-value-gap,
--solaris-slider-header-gap, --solaris-slider-edge-icon-size,
--solaris-slider-tooltip-arrow-size, --solaris-slider-tooltip-reserve
```

For the `custom` color, set the fill on the host or a parent:

```css
.my-slider {
  --solaris-slider-custom-fill-color: #9333ea;
}
```

## Motion

Intent: the fill glides on committed moves while dragging stays instant, so
pointer feedback never lags the hand.

- Fill: `transform: scaleX` (horizontal) / `scaleY` (vertical) with origin at
  the minimum edge, `normal + decelerate`; `transition: none` while
  `data-dragging`.
- Thumb: hover and `focus-visible` `scale(1.15)` `fast + standard`; active
  `scale(var(--solaris-motion-scale-active))`; `focus-visible` ring.
- Release pop: one-shot `solaris-slider-release-pop` (dip to
  `scale-active`, overshoot, rest) on `[data-released]` after pointer
  release, `normal + spring`. The spring token is opt-in and
  vestibular-sensitive by design: the pop is pointer-only (keyboard commits
  do not pop) and the doubled reduced-motion guards remove it entirely.
- Tooltip: `opacity + translate-sm(4px)`, `fast`, enter `decelerate` / exit
  `accelerate`. The tooltip is hover-driven (no detach delay), so the
  transitions hold the end state instead of an animation fill mode.
- Every transition/animation ships the doubled reduced-motion guard
  (`prefers-reduced-motion: reduce` +
  `:host-context([data-reduced-motion='true'])` → `transition: none`,
  `animation: none`, hover/focus scale reset). State is always mirrored in
  `aria-valuenow/text` synchronously — never motion-only.

## Accessibility

- One `role="slider"` thumb with `aria-valuemin/max/now/text`,
  `aria-orientation`, and `aria-labelledby` (visible label) or
  `aria-label`/`ariaLabelKey` fallback.
- Keyboard (WAI-APG): ArrowUp/Right `+step`, ArrowDown/Left `-step`, Home
  minimum, End maximum, PageUp/Down `±pageStep`. Handled keys call
  `preventDefault`.
- `44px` minimum pointer target per thumb: the optical thumb (`16–24px`) is
  extended by an invisible token-sized hit area (at least `48px` on every
  size). Thumbs stay in tab order
  when enabled (`tabindex="0"`); disabled removes the thumb from tab order
  (`tabindex="-1"`) with `aria-disabled`.
- `readonly` keeps focus but ignores edits (`aria-readonly`); `invalid`
  sets `aria-invalid` (error text comes from the surrounding form field,
  linked via `describedByIds`); `disabled` dims to `--solaris-opacity-40`.
- Ticks, edge icons, thumb icon, tooltip, and thumb value are `aria-hidden`
  decoration. The `required` marker (`*`) is visual; native `required`
  validation is owned by the surrounding form.
- Fill and track colors come from themed token pairs (light/dark/high
  contrast); state never relies on color alone (`aria-valuenow/text` always
  current).

## Examples

```html
<!-- Basic -->
<solaris-slider label="Volume" [(value)]="volume" />

<!-- Ticks -->
<solaris-slider label="Brightness" [showTicks]="true" [tickStep]="10" />

<!-- Vertical -->
<solaris-slider label="Balance" orientation="vertical" />

<!-- Icons -->
<solaris-slider label="Volume" startIcon="minus" endIcon="plus" thumbIcon="grip-vertical" />

<!-- Tooltip value -->
<solaris-slider label="Opacity" valueDisplay="tooltip" />

<!-- Custom formatting -->
<solaris-slider label="Volume" unit="db" [formatValue]="formatDb" [valueText]="describeDb" />

<!-- States -->
<solaris-slider label="Volume" [disabled]="true" />
<solaris-slider label="Volume" [readonly]="true" />
<solaris-slider label="Volume" [invalid]="true" />

<!-- Reactive Forms -->
<solaris-slider [formControl]="volumeControl" />
```

## Print

`@media print` renders committed values statically: the opt-in tooltip
hides (its reserve collapses), the thumb cursor goes static, and fill/thumb
motion stops. Tooltip-mode values are hover-only by design, so paper shows
no bubble — prefer `inline` or `thumb` display when the page must print.

## Limitations (v1)

- Single thumb only; multi-thumb belongs to `solaris-range-slider`.
- Linear `min/max/step` scales only (no log/date scales).
- No custom thumb templates (only `thumbIcon` name).
- No per-tick labels or tick tooltips.
- `required` is a visual marker + form-field concern, not native validation.

```

```
