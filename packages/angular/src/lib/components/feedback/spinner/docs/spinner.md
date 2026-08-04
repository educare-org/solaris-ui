# Solaris Spinner

## Purpose

Spinner is an indeterminate loading indicator that communicates that a process is in progress. It is a non-interactive, status feedback component used when the duration of the operation is unknown.

## When to use

- Indicating that a process is running with unknown duration.
- Complementing buttons, forms, or content regions that are busy.
- Showing inline loading feedback next to a label.
- Blocking a full page or region with `backdrop` while content loads.

## When not to use

- Do not use Spinner when the progress is measurable — use `solaris-progress`.
- Do not use Spinner as the only feedback for critical, non-recoverable actions.
- Do not place multiple spinners for the same logical operation.

## API

### Inputs

| Input          | Type                                                                                 | Default     | Description                                                  |
| -------------- | ------------------------------------------------------------------------------------ | ----------- | ------------------------------------------------------------ |
| `size`         | `'sm' \| 'md' \| 'lg' \| 'xl'`                                                       | `'md'`      | Indicator size. `xl` targets full-screen loading.            |
| `color`        | `'neutral' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'custom'` | `'primary'` | Indicator color.                                             |
| `speed`        | `'slow' \| 'normal' \| 'fast'`                                                       | `'normal'`  | Rotation speed.                                              |
| `easing`       | `'linear' \| 'ease' \| 'ease-in' \| 'ease-out' \| 'ease-in-out' \| 'spring'`         | `'linear'`  | Rotation easing (movement feel).                             |
| `backdrop`     | `boolean`                                                                            | `false`     | Renders a fixed full-screen overlay behind the spinner.      |
| `label`        | `string`                                                                             | —           | Visible loading label.                                       |
| `labelKey`     | `string`                                                                             | —           | i18n key for the visible label.                              |
| `ariaLabel`    | `string`                                                                             | —           | Accessible name override.                                    |
| `ariaLabelKey` | `string`                                                                             | —           | i18n key for the accessible name.                            |
| `ariaHidden`   | `boolean`                                                                            | `false`     | Hides the spinner from assistive technology (`aria-hidden`). |

## Behavior

- The accessible name is resolved in the following order: `ariaLabel`, `ariaLabelKey`, `label`, `labelKey`, default `solaris.spinner.loading`.
- When no label resolves, the spinner renders only the animated indicator and exposes `solaris.spinner.loading` as its accessible name.

## Sizes and thickness

Thickness scales with size so larger indicators keep visible borders.

| Size | Indicator size         | Border thickness                  |
| ---- | ---------------------- | --------------------------------- |
| `sm` | `--solaris-spacing-4`  | `--solaris-border-width-sm` (1px) |
| `md` | `--solaris-spacing-6`  | `--solaris-border-width-md` (2px) |
| `lg` | `--solaris-spacing-8`  | `--solaris-spacing-1` (4px)       |
| `xl` | `--solaris-spacing-16` | `--solaris-spacing-2` (8px)       |

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

When `backdrop` is `true`, the spinner renders as a fixed overlay covering the viewport with a `--solaris-backdrop` background. The indicator and label are centered. Use `size="xl"` for a prominent full-screen loading experience.

```html
<solaris-spinner size="xl" backdrop label="Loading application..." />
```

The label uses the inverse text color over the dark backdrop. Backdrop uses `--solaris-z-index-overlay`.

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

## Accessibility

- The host has `role="status"` and `aria-live="polite"`, so the loading state is announced to assistive technology.
- The animated indicator is decorative and carries `aria-hidden="true"`.
- Spinner is not focusable and does not capture keyboard events.
- Under reduced motion (`prefers-reduced-motion: reduce` or `[data-reduced-motion='true']`), the rotation animation is disabled and the indicator is rendered static.

## CSS Variables

| Token                                  | Default                          | Description                |
| -------------------------------------- | -------------------------------- | -------------------------- |
| `--solaris-spinner-size`               | `--solaris-spacing-6`            | Indicator size.            |
| `--solaris-spinner-thickness`          | `--solaris-border-width-md`      | Border thickness.          |
| `--solaris-spinner-color`              | `--solaris-primary-base`         | Indicator color.           |
| `--solaris-spinner-track-color`        | `--solaris-border-default`       | Static track border color. |
| `--solaris-spinner-custom-color`       | `--solaris-primary-base`         | Custom color override.     |
| `--solaris-spinner-animation-duration` | `--solaris-motion-duration-slow` | Rotation duration.         |
| `--solaris-spinner-animation-easing`   | `--solaris-motion-easing-linear` | Rotation easing.           |

## Examples

### Basic

```html
<solaris-spinner />
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

- Spinner is indeterminate only. For measurable progress, use `solaris-progress`.
- Spinner is non-interactive and emits no events.
- The component does not manage `aria-busy` of its parent context.
