# Solaris Spinner

## Purpose

Spinner is a loading indicator that communicates that a process is in progress. It is a non-interactive, status feedback component. The `ring` and `stacked` variants are indeterminate; the `progress` variant communicates measurable progress.

## When to use

- Indicating that a process is running with unknown duration (`ring`, `stacked`).
- Communicating determinate progress with a circular indicator (`progress`).
- Complementing buttons, forms, or content regions that are busy.
- Showing inline loading feedback next to a label.
- Blocking a full page or region with `backdrop` while content loads.

## When not to use

- Do not use Spinner when a linear progress bar is more appropriate — use `solaris-progress`. Rule of thumb: circular determinate (`spinner variant="progress"`) for compact/overlay contexts with a percent, linear bar for uploads, downloads, and multi-step flows.
- Do not use Spinner as the only feedback for critical, non-recoverable actions.
- Do not place multiple spinners for the same logical operation.

## API

### Inputs

| Input            | Type                                                                                 | Default     | Description                                                                                                                      |
| ---------------- | ------------------------------------------------------------------------------------ | ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `variant`        | `'ring' \| 'stacked' \| 'progress'`                                                  | `'ring'`    | Appearance variant. `progress` is the circular determinate indicator (percent), distinct from the linear `solaris-progress` bar. |
| `size`           | `'sm' \| 'md' \| 'lg' \| 'xl'`                                                       | `'md'`      | Indicator size. `xl` targets full-screen loading.                                                                                |
| `density`        | `'compact' \| 'normal' \| 'comfortable'`                                             | theme       | Indicator-to-text gap (adapted matrix). Falls back to `SolarisThemeService.density`.                                             |
| `color`          | `'neutral' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'custom'` | `'primary'` | Indicator color.                                                                                                                 |
| `speed`          | `'slow' \| 'normal' \| 'fast'`                                                       | `'normal'`  | Rotation speed. Applies to `ring` and `stacked`.                                                                                 |
| `easing`         | `'linear' \| 'ease' \| 'ease-in' \| 'ease-out' \| 'ease-in-out' \| 'spring'`         | `'linear'`  | Rotation easing. Applies to `ring` and `stacked`.                                                                                |
| `value`          | `number`                                                                             | `0`         | Determinate progress value, clamped to `0-100`. Used with `progress`.                                                            |
| `showPercent`    | `boolean`                                                                            | `false`     | Shows the numeric percent beside the indicator in `progress`.                                                                    |
| `description`    | `string[]`                                                                           | `[]`        | Optional lines rendered under the percent in `progress`.                                                                         |
| `descriptionKey` | `string[]`                                                                           | `[]`        | i18n keys for the description lines.                                                                                             |
| `backdrop`       | `boolean`                                                                            | `false`     | Renders a fixed full-screen overlay behind the spinner.                                                                          |
| `overlay`        | `boolean`                                                                            | `false`     | Renders an absolute overlay centered over the nearest positioned ancestor. Use inside `solarisLoadingZone`.                      |
| `lockScroll`     | `boolean`                                                                            | `true`      | Locks body scroll while `backdrop` is visible.                                                                                   |
| `label`          | `string`                                                                             | —           | Visible loading label. No default — indicator-only when omitted.                                                                 |
| `labelKey`       | `string`                                                                             | —           | i18n key for the visible label.                                                                                                  |
| `ariaLabel`      | `string`                                                                             | —           | Accessible name override.                                                                                                        |
| `ariaLabelKey`   | `string`                                                                             | —           | i18n key for the accessible name.                                                                                                |
| `ariaHidden`     | `boolean`                                                                            | `false`     | Hides the spinner from assistive technology (`aria-hidden`).                                                                     |

## Variants

### Ring

The default variant. A single arc rotates around the track. Use it for indeterminate operations.

```html
<solaris-spinner variant="ring" />
```

### Stacked

A classic stacked radial spinner: 8 independent rounded bars arranged around the center, 45 degrees apart. A single strongly visible bar leads a clockwise fading trail while inactive bars stay subtly visible. Use it as an alternative indeterminate style.

```html
<solaris-spinner variant="stacked" />
```

### Progress

A determinate arc that fills as `value` increases, starting at 12 o'clock. Use it when progress is measurable. The arc transitions smoothly as the value changes.

```html
<solaris-spinner variant="progress" [value]="40" [showPercent]="true" />
```

When `showPercent` is enabled, the numeric percent and the label share the first row; description lines render beneath them, aligned to the same left edge:

```html
<solaris-spinner variant="progress" [value]="60" label="Uploading" [showPercent]="true" [description]="['File size: 12 MB', 'Time left: 30 s']" />
```

```
[spinner]  100%  Downloading
           File size: 12 MB
           Time left: 30 s
```

## Behavior

- The accessible name is resolved in the following order: `ariaLabel`, `ariaLabelKey`, `label`, `labelKey`, default `solaris.spinner.loading`.
- The visible label has no default: without `label`/`labelKey` the spinner renders only the animated indicator and exposes `solaris.spinner.loading` as its accessible name.
- In `progress` variant, the host uses `role="progressbar"` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, and an `aria-valuetext` that combines the label, percent, and description lines.
- In `ring` and `stacked` variants, the host uses `role="status"` and `aria-live="polite"`.
- The `description` lines are resolved per index: `description[i]`, then `descriptionKey[i]` via i18n. Empty or unresolvable entries are omitted.
- In `progress`, the percentage and label render on a shared baseline; description lines render below them, left-aligned to the header.

## Sizes and density

The SVG geometry is defined in a fixed `viewBox="0 0 120 120"` with a safe internal margin so rounded caps stay fully inside the canvas at every size. The stroke width is expressed in SVG user-space units and scales together with the whole geometry (`--solaris-spinner-thickness: 15`), which keeps rendering consistent and crisp at 100% browser zoom.

Spinner uses an adapted `size` × `density` matrix: `size` drives the indicator geometry together with the label and percent type scale, while `density` (default from `SolarisThemeService`) only adjusts the gap between indicator and text. Spinner is not a form control, so it intentionally does not use the `--solaris-control-height-*` ladder.

| Size | Indicator size         | Label                    | Percent (progress)       | Rendered stroke |
| ---- | ---------------------- | ------------------------ | ------------------------ | --------------- |
| `sm` | `--solaris-spacing-6`  | `--solaris-font-size-xs` | `--solaris-font-size-sm` | 1.5px           |
| `md` | `--solaris-spacing-8`  | `--solaris-font-size-sm` | `--solaris-font-size-md` | 2.5px           |
| `lg` | `--solaris-spacing-10` | `--solaris-font-size-md` | `--solaris-font-size-lg` | 4px             |
| `xl` | `--solaris-spacing-16` | `--solaris-font-size-lg` | `--solaris-font-size-xl` | 10px            |

The ring variant renders one subtle background track circle and one continuous active arc. The progress variant uses a full circle with `pathLength="100"` so the arc length maps directly to the `value` percentage.

## Speed

| Speed    | Duration token                     |
| -------- | ---------------------------------- |
| `slow`   | `--solaris-motion-duration-slower` |
| `normal` | `--solaris-motion-duration-slow`   |
| `fast`   | `--solaris-motion-duration-normal` |

## Easing

| Easing        | Motion token                         |
| ------------- | ------------------------------------ |
| `linear`      | `--solaris-motion-easing-linear`     |
| `ease`        | `--solaris-motion-easing-standard`   |
| `ease-in`     | `--solaris-motion-easing-accelerate` |
| `ease-out`    | `--solaris-motion-easing-decelerate` |
| `ease-in-out` | `--solaris-motion-easing-standard`   |
| `spring`      | `--solaris-motion-easing-spring`     |

## Backdrop

When `backdrop` is `true`, the spinner renders as a fixed overlay covering the viewport with a `--solaris-backdrop` background. The indicator and label are centered in a column. Body scroll is locked while the backdrop is visible (opt out with `[lockScroll]="false"`).

```html
<solaris-spinner size="xl" backdrop label="Loading application..." />
```

The label uses the inverse text color over the dark backdrop. Backdrop uses `--solaris-z-index-overlay`.

## Loading zone (blocking a form or region)

A bare spinner cannot disable the fields around it. Wrap the region with the `solaris-loading-zone` directive and render an `overlay` spinner inside it: the zone exposes `aria-busy="true"` and becomes `inert` (fields below lose focus and AT interaction), while the overlay spinner centers itself over the zone and blocks pointer events.

```html
<form [solaris-loading-zone]="saving()">
  <!-- fields… -->
  @if (saving()) {
  <solaris-spinner overlay label="Saving…" />
  }
</form>
```

Set `--solaris-spinner-overlay-background` on the spinner to veil the zone (default `transparent`). For full-screen loading, prefer `backdrop` instead.

## Colors

| Color     | Token                            |
| --------- | -------------------------------- |
| `neutral` | `--solaris-text-muted`           |
| `primary` | `--solaris-primary-base`         |
| `success` | `--solaris-success-base`         |
| `warning` | `--solaris-warning-base`         |
| `danger`  | `--solaris-danger-base`          |
| `info`    | `--solaris-info-base`            |
| `custom`  | `--solaris-spinner-custom-color` |

When `color="custom"`, define `--solaris-spinner-custom-color` in your theme to use your own brand color.

The track is the indicator color at a reduced opacity (`--solaris-spinner-track-opacity`, default `--solaris-opacity-20`), so the static ring reads as a background and the active arc stays clearly dominant.

## Accessibility

- The `ring` and `stacked` variants use `role="status"` and `aria-live="polite"`, so the loading state is announced to assistive technology.
- The `progress` variant uses `role="progressbar"` and exposes `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, and `aria-valuetext`.
- The animated indicator is decorative and carries `aria-hidden="true"`.
- Spinner is not focusable and does not capture keyboard events.
- Under reduced motion (`prefers-reduced-motion: reduce` or `[data-reduced-motion='true']`), the rotation animation is disabled and the indicator is rendered static. The `progress` variant is static by nature.

## CSS Variables

| Token                                  | Default                          | Description                               |
| -------------------------------------- | -------------------------------- | ----------------------------------------- |
| `--solaris-spinner-size`               | `--solaris-spacing-6`            | Indicator size.                           |
| `--solaris-spinner-thickness`          | `15` (viewBox units)             | Stroke thickness.                         |
| `--solaris-spinner-color`              | `--solaris-primary-base`         | Indicator color.                          |
| `--solaris-spinner-track-color`        | `--solaris-spinner-color`        | Static track color.                       |
| `--solaris-spinner-track-opacity`      | `--solaris-opacity-20`           | Static track opacity.                     |
| `--solaris-spinner-custom-color`       | `--solaris-primary-base`         | Custom color override.                    |
| `--solaris-spinner-label-font-size`    | `--solaris-font-size-sm`         | Visible label size (size-driven).         |
| `--solaris-spinner-percent-font-size`  | `--solaris-font-size-md`         | Percent size in `progress` (size-driven). |
| `--solaris-spinner-gap`                | `--solaris-spacing-3`            | Indicator-to-text gap (density-driven).   |
| `--solaris-spinner-overlay-background` | `transparent`                    | Zone overlay veil.                        |
| `--solaris-spinner-animation-duration` | `--solaris-motion-duration-slow` | Rotation duration.                        |
| `--solaris-spinner-animation-easing`   | `--solaris-motion-easing-linear` | Rotation easing.                          |

## Examples

### Basic

```html
<solaris-spinner />
```

### Stacked

```html
<solaris-spinner variant="stacked" />
```

### Progress

```html
<solaris-spinner variant="progress" [value]="40" [showPercent]="true" />
```

### Progress with details

```html
<solaris-spinner variant="progress" [value]="60" label="Uploading" [showPercent]="true" [description]="['File size: 12 MB', 'Time left: 30 s']" />
```

### With label

```html
<solaris-spinner label="Saving..." />
```

### Sizes

```html
<solaris-spinner size="sm" />
<solaris-spinner size="md" />
<solaris-spinner size="lg" />
<solaris-spinner size="xl" />
```

### Colors

```html
<solaris-spinner color="neutral" />
<solaris-spinner color="primary" />
<solaris-spinner color="success" />
<solaris-spinner color="warning" />
<solaris-spinner color="danger" />
<solaris-spinner color="info" />
```

### Speed

```html
<solaris-spinner speed="slow" />
<solaris-spinner speed="normal" />
<solaris-spinner speed="fast" />
```

### Easing

```html
<solaris-spinner easing="linear" />
<solaris-spinner easing="ease" />
<solaris-spinner easing="ease-in" />
<solaris-spinner easing="ease-out" />
<solaris-spinner easing="ease-in-out" />
<solaris-spinner easing="spring" />
```

### Full-screen with backdrop

```html
<solaris-spinner size="xl" backdrop label="Loading application..." />
```

### Blocking a form region

```html
<form [solaris-loading-zone]="saving()">
  @if (saving()) {
  <solaris-spinner overlay label="Saving…" />
  }
</form>
```

### Custom brand color

```html
<solaris-spinner color="custom" />
```

```scss
.solaris-brand-loading {
  --solaris-spinner-custom-color: #4253a1;
}
```

### i18n

```html
<solaris-spinner labelKey="app.messages.saving" />
```

## Limitations

- Spinner is non-interactive and emits no events.
- The component does not manage `aria-busy` of its parent context.
- `speed` and `easing` do not affect the `progress` variant, which is static and transitions on `stroke-dasharray`.
