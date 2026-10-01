# Solaris Loading Text

## Purpose

Loading Text is an animated loading state that displays a short text with a shimmer sweep across it. It communicates that a process is in progress without requiring a spinner ring, and it is useful for inline regions where text already describes the operation.

## When to use

- Showing a short loading caption such as "Loading..." or "Preparing workspace".
- Complementing content regions that are busy but where a spinner would be visually heavy.
- Communicating an in-progress, indeterminate operation in a compact form.

## When not to use

- Do not use Loading Text when progress is measurable — use `solaris-progress`.
- Do not use Loading Text as the only feedback for critical, non-recoverable actions.
- Do not use Loading Text for decorative text that is not loading feedback.

## API

### Inputs

| Input          | Type                                                                                 | Default     | Description                                                                     |
| -------------- | ------------------------------------------------------------------------------------ | ----------- | ------------------------------------------------------------------------------- |
| `text`         | `string`                                                                             | —           | Visible text. Defaults to `solaris.loadingText.loading`.                        |
| `textKey`      | `string`                                                                             | —           | i18n key for the visible text.                                                  |
| `size`         | `'sm' \| 'md' \| 'lg' \| 'xl'`                                                       | —           | Opt-in fixed font size override. Omitido = herda o `font-size` do contexto.     |
| `density`      | `'compact' \| 'normal' \| 'comfortable'`                                             | —           | Opt-in fixed line-height override. Omitido = herda o `line-height` do contexto. |
| `color`        | `'neutral' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'custom'` | `'primary'` | Text color.                                                                     |
| `speed`        | `'slow' \| 'normal' \| 'fast'`                                                       | `'normal'`  | Shimmer sweep speed.                                                            |
| `maxLines`     | `number`                                                                             | `0`         | Clamps the text to N lines with ellipsis (`0` = no clamp).                      |
| `dots`         | `boolean`                                                                            | `false`     | Appends three pulsing dots after the text (decorative, `aria-hidden`).          |
| `ariaLabel`    | `string`                                                                             | —           | Accessible name override.                                                       |
| `ariaLabelKey` | `string`                                                                             | —           | i18n key for the accessible name.                                               |

## Behavior

- The visible text is resolved in the following order: `text`, `textKey`, default `solaris.loadingText.loading`.
- The accessible name is resolved in the following order: `ariaLabel`, `ariaLabelKey`, then the resolved text.
- The text always renders in its base color. A translucent shimmer band sweeps across it from left to right and loops infinitely, so the text never becomes invisible.
- Under reduced motion (`prefers-reduced-motion: reduce` or `[data-reduced-motion='true']`), the animation is disabled, the shimmer overlay is hidden, and the text renders as a solid color.

## Sizes and density

Loading Text inherits the surrounding `font-size`/`line-height` by default — it is animated body copy, not a fixed-size control. `size`/`density` are opt-in fixed overrides (omit both to inherit):

| Size | Font token               |
| ---- | ------------------------ |
| `sm` | `--solaris-font-size-sm` |
| `md` | `--solaris-font-size-md` |
| `lg` | `--solaris-font-size-lg` |
| `xl` | `--solaris-font-size-xl` |

## Speed

| Speed    | Duration token                      |
| -------- | ----------------------------------- |
| `slow`   | `--solaris-motion-duration-slowest` |
| `normal` | `--solaris-motion-duration-slower`  |
| `fast`   | `--solaris-motion-duration-slow`    |

## Colors

| Color     | Token                                 |
| --------- | ------------------------------------- |
| `neutral` | `--solaris-text-muted`                |
| `primary` | `--solaris-primary-base`              |
| `success` | `--solaris-success-base`              |
| `warning` | `--solaris-warning-base`              |
| `danger`  | `--solaris-danger-base`               |
| `info`    | `--solaris-info-base`                 |
| `custom`  | `--solaris-loading-text-custom-color` |

When `color="custom"`, define `--solaris-loading-text-custom-color` in your theme to use your own brand color.

## Accessibility

- The host has `role="status"` and `aria-live="polite"`, so the loading text is announced to assistive technology.
- The base text node carries the readable content; the shimmer overlay is decorative and repeats the text for visual effect only.
- Loading Text is not focusable and does not capture keyboard events.
- Under reduced motion, the shimmer animation is disabled and the text renders as a solid color.

## CSS Variables

| Token                                       | Default                            | Description                                                |
| ------------------------------------------- | ---------------------------------- | ---------------------------------------------------------- |
| `--solaris-loading-text-color`              | `--solaris-text-default`           | Base text color.                                           |
| `--solaris-loading-text-shimmer-color`      | `--solaris-text-inverse`           | Shimmer highlight color.                                   |
| `--solaris-loading-text-shimmer-opacity`    | `--solaris-opacity-40`             | Shimmer overlay opacity.                                   |
| `--solaris-loading-text-custom-color`       | `--solaris-primary-base`           | Custom color override.                                     |
| `--solaris-loading-text-font-size`          | `inherit`                          | Font size (inherits context; `size` overrides).            |
| `--solaris-loading-text-line-height`        | `inherit`                          | Line height (inherits context; `density` overrides).       |
| `--solaris-loading-text-dot-size`           | `0.25em`                           | Pulsing dots diameter (scales with text).                  |
| `--solaris-loading-text-dots-gap`           | `0.25em`                           | Gap between text/dots and between dots (scales with text). |
| `--solaris-loading-text-animation-duration` | `--solaris-motion-duration-slower` | Shimmer sweep duration.                                    |
| `--solaris-loading-text-animation-easing`   | `--solaris-motion-easing-linear`   | Shimmer sweep easing.                                      |

## Examples

### Basic

```html
<solaris-loading-text />
```

### With custom text

```html
<solaris-loading-text text="Preparing your workspace..." />
```

### Sizes

```html
<solaris-loading-text text="Loading" size="sm" />
<solaris-loading-text text="Loading" size="md" />
<solaris-loading-text text="Loading" size="lg" />
<solaris-loading-text text="Loading" size="xl" />
```

### Colors

```html
<solaris-loading-text text="Loading" color="neutral" />
<solaris-loading-text text="Loading" color="primary" />
<solaris-loading-text text="Loading" color="success" />
<solaris-loading-text text="Loading" color="warning" />
<solaris-loading-text text="Loading" color="danger" />
<solaris-loading-text text="Loading" color="info" />
```

### Speed

```html
<solaris-loading-text text="Loading" speed="slow" />
<solaris-loading-text text="Loading" speed="normal" />
<solaris-loading-text text="Loading" speed="fast" />
```

### With pulsing dots

```html
<solaris-loading-text text="Uploading" dots />
```

### Clamped to two lines

```html
<solaris-loading-text text="Preparing your workspace and syncing every document…" [maxLines]="2" />
```

### Custom brand color

```html
<solaris-loading-text text="Loading" color="custom" />
```

```scss
.solaris-brand-loading {
  --solaris-loading-text-custom-color: #4253a1;
}
```

### i18n

```html
<solaris-loading-text textKey="app.messages.loading" />
```

## Limitations

- Loading Text is indeterminate only and does not communicate measurable progress — use `solaris-progress` for determinate operations.
- Loading Text is non-interactive and emits no events.
- The component does not manage `aria-busy` of its parent context.
