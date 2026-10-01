# Solaris Progress

## Purpose

Progress communicates the progress of a task, either with a measurable determinate value or as an indeterminate indicator when the duration is unknown. It is a non-interactive status feedback component.

## When to use

- Showing measurable progress toward completion (`value` 0-100).
- Indicating an ongoing operation with unknown duration (`indeterminate`).
- Complementing uploads, downloads, form saves, and multi-step processes.
- Displaying a live percentage next to the bar.

## When not to use

- Do not use Progress when a compact circular indicator fits better — use `solaris-spinner variant="progress"` for overlays and tight spaces with a percent.
- Do not use Progress as the only feedback for critical, non-recoverable actions.
- Do not place multiple progress bars for the same logical operation.

## API

### Inputs

| Input             | Type                                                                                 | Default     | Description                                                                                               |
| ----------------- | ------------------------------------------------------------------------------------ | ----------- | --------------------------------------------------------------------------------------------------------- |
| `value`           | `number`                                                                             | `0`         | Determinate progress value, clamped to `0-100`.                                                           |
| `bufferValue`     | `number`                                                                             | —           | Buffered value rendered behind the fill (streaming), clamped to `0-100`.                                  |
| `indeterminate`   | `boolean`                                                                            | `false`     | Renders an animated indeterminate bar instead of a determinate value.                                     |
| `size`            | `'sm' \| 'md' \| 'lg'`                                                               | `'md'`      | Bar thickness.                                                                                            |
| `density`         | `'compact' \| 'normal' \| 'comfortable'`                                             | theme       | Label density (adapted matrix: only the label scale reacts). Falls back to `SolarisThemeService.density`. |
| `color`           | `'neutral' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'custom'` | `'primary'` | Bar color. Overridden by `status` when it is `success` or `exception`.                                    |
| `status`          | `'active' \| 'success' \| 'exception'`                                               | `'active'`  | Operation status. `success` tints the bar green, `exception` red.                                         |
| `striped`         | `boolean`                                                                            | `false`     | Renders diagonal stripes over the fill.                                                                   |
| `animatedStripes` | `boolean`                                                                            | `false`     | Animates the stripes (implies `striped`). Static under reduced motion.                                    |
| `label`           | `string`                                                                             | —           | Visible label shown to the left of the bar.                                                               |
| `labelKey`        | `string`                                                                             | —           | i18n key for the visible label.                                                                           |
| `showPercent`     | `boolean`                                                                            | `false`     | Shows the numeric percentage to the right of the bar (determinate only).                                  |
| `ariaLabel`       | `string`                                                                             | —           | Accessible name override.                                                                                 |
| `ariaLabelKey`    | `string`                                                                             | —           | i18n key for the accessible name.                                                                         |

## Behavior

- Determinate progress exposes `role="progressbar"` with `aria-valuemin="0"`, `aria-valuemax="100"`, and `aria-valuenow` set to the clamped value.
- Indeterminate progress hides `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` per the WAI-ARIA guidance.
- The accessible name is resolved in the following order: `ariaLabel`, `ariaLabelKey`, `label`, `labelKey`.
- `aria-valuetext` combines the resolved label with the percentage or `indeterminate`.

## Sizes and density

Progress uses an adapted `size` × `density` matrix: `size` drives the bar thickness, while `density` (default from `SolarisThemeService`) only scales the visible label (`compact → xs`, `normal → sm`, `comfortable → md`). Progress is not a form control, so it intentionally does not use the `--solaris-control-height-*` ladder.

| Size | Height                            |
| ---- | --------------------------------- |
| `sm` | `--solaris-border-width-xl` (4px) |
| `md` | `--solaris-spacing-2` (8px)       |
| `lg` | `--solaris-spacing-3` (12px)      |

## Status

| Status      | Bar color                |
| ----------- | ------------------------ |
| `active`    | `color` input            |
| `success`   | `--solaris-success-base` |
| `exception` | `--solaris-danger-base`  |

```html
<solaris-progress value="100" status="success" label="Complete" /> <solaris-progress value="65" status="exception" label="Upload failed" showPercent />
```

## Stripes and buffer

```html
<solaris-progress value="55" striped />
<solaris-progress value="55" animatedStripes />
<solaris-progress value="40" bufferValue="70" label="Buffering" showPercent />
```

The buffer renders the bar color at `--solaris-progress-buffer-opacity` behind the fill — useful for streaming and chunked uploads.

## Colors

| Color     | Token                             |
| --------- | --------------------------------- |
| `neutral` | `--solaris-text-muted`            |
| `primary` | `--solaris-primary-base`          |
| `success` | `--solaris-success-base`          |
| `warning` | `--solaris-warning-base`          |
| `danger`  | `--solaris-danger-base`           |
| `info`    | `--solaris-info-base`             |
| `custom`  | `--solaris-progress-custom-color` |

When `color="custom"`, define `--solaris-progress-custom-color` in your theme to use your own brand color.

## Accessibility

- The host has `role="progressbar"` and exposes the value to assistive technology.
- The bar itself is decorative and carries `aria-hidden="true"`.
- Progress is not focusable and does not capture keyboard events.
- Under reduced motion (`prefers-reduced-motion: reduce` or `[data-reduced-motion='true']`), the indeterminate animation is disabled.

## CSS Variables

| Token                                   | Default                          | Description                  |
| --------------------------------------- | -------------------------------- | ---------------------------- |
| `--solaris-progress-height`             | `--solaris-spacing-2`            | Bar thickness.               |
| `--solaris-progress-radius`             | `--solaris-radius-full`          | Bar radius.                  |
| `--solaris-progress-color`              | `--solaris-primary-base`         | Fill color.                  |
| `--solaris-progress-custom-color`       | `--solaris-primary-base`         | Custom color override.       |
| `--solaris-progress-track-color`        | `--solaris-surface-muted`        | Track background.            |
| `--solaris-progress-buffer-opacity`     | `--solaris-opacity-40`           | Buffer fill opacity.         |
| `--solaris-progress-stripe-color`       | `--solaris-text-inverse`         | Stripe line color.           |
| `--solaris-progress-label-font-size`    | `--solaris-font-size-sm`         | Label size (density-driven). |
| `--solaris-progress-animation-duration` | `--solaris-motion-duration-slow` | Indeterminate duration.      |

## Examples

### Determinate basic

```html
<solaris-progress value="40" />
```

### With label and percent

```html
<solaris-progress value="60" label="Uploading" showPercent />
```

### Sizes

```html
<solaris-progress value="50" size="sm" />
<solaris-progress value="50" size="md" />
<solaris-progress value="50" size="lg" />
```

### Colors

```html
<solaris-progress value="50" color="neutral" />
<solaris-progress value="50" color="primary" />
<solaris-progress value="50" color="success" />
<solaris-progress value="50" color="warning" />
<solaris-progress value="50" color="danger" />
<solaris-progress value="50" color="info" />
```

### Status

```html
<solaris-progress value="100" status="success" label="Complete" /> <solaris-progress value="65" status="exception" label="Upload failed" showPercent />
```

### Stripes and buffer

```html
<solaris-progress value="55" striped />
<solaris-progress value="55" animatedStripes />
<solaris-progress value="40" bufferValue="70" label="Buffering" showPercent />
```

### Indeterminate

```html
<solaris-progress indeterminate label="Loading" />
```

### Custom brand color

```html
<solaris-progress value="50" color="custom" />
```

```scss
.solaris-brand-progress {
  --solaris-progress-custom-color: #4253a1;
}
```

## Limitations

- Progress only handles visual presentation; it does not drive the underlying operation.
- Indeterminate mode does not expose a numeric value to assistive tech.
- The component does not manage `aria-busy` of its parent context.
