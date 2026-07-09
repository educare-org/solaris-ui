# Solaris Skeleton

## Purpose

Skeleton displays a visual placeholder while content is loading. It is a non-interactive, decorative element that communicates loading state through shape and animation.

## When to use

- Indicating that content is loading.
- Providing a visual placeholder for text, images, cards, avatars, and other UI blocks.
- Reducing perceived loading time in layouts.
- Communicating that a section is not yet ready.

## When not to use

- Do not use Skeleton as an interactive element.
- Do not use Skeleton as the only loading indicator for critical operations.
- Do not use Skeleton as a progress indicator.
- Do not rely solely on Skeleton to communicate loading to screen readers.
- For full-page loading, consider a top-level loading indicator or overlay.

## API

| Input     | Type                                                         | Default   | Description                                                             |
| --------- | ------------------------------------------------------------ | --------- | ----------------------------------------------------------------------- |
| variant   | `'text'` \| `'rectangular'` \| `'circular'`                  | `'text'`  | Shape variant of the skeleton.                                          |
| animation | `'pulse'` \| `'wave'` \| `'none'`                            | `'pulse'` | Animation style.                                                        |
| size      | `'sm'` \| `'md'` \| `'lg'`                                   | `'md'`    | Size preset.                                                            |
| radius    | `'none'` \| `'sm'` \| `'md'` \| `'lg'` \| `'xl'` \| `'full'` | `'text'`  | Border radius. `'text'` resolves based on variant.                      |
| density   | `'compact'` \| `'comfortable'` (optional)                    | —         | Density preset. Inherits from theme when possible.                      |
| width     | `string` (optional)                                          | —         | Custom width (e.g. `'70%'`, `'12rem'`).                                 |
| height    | `string` (optional)                                          | —         | Custom height (e.g. `'1.6rem'`, `'12rem'`).                             |
| lines     | `number` (optional)                                          | `1`       | Number of text lines for variant `text`. Lines have auto-varied widths. |

## Variants

| Variant       | Shape                                     | Default height | Default radius |
| ------------- | ----------------------------------------- | -------------- | -------------- |
| `text`        | Line placeholder                          | `1rem`         | `sm`           |
| `rectangular` | Block placeholder (cards, images, etc.)   | `8rem`         | `md`           |
| `circular`    | Circle placeholder (avatars, icons, etc.) | `3rem`         | `full`         |

## Sizes

| Size | Text height | Rectangular height | Circular diameter |
| ---- | ----------- | ------------------ | ----------------- |
| `sm` | `0.75rem`   | `6rem`             | `2.25rem`         |
| `md` | `1rem`      | `8rem`             | `3rem`            |
| `lg` | `1.25rem`   | `10rem`            | `3.75rem`         |

## Radius

| Value  | Token                   |
| ------ | ----------------------- |
| `none` | `--solaris-radius-none` |
| `sm`   | `--solaris-radius-sm`   |
| `md`   | `--solaris-radius-md`   |
| `lg`   | `--solaris-radius-lg`   |
| `xl`   | `--solaris-radius-xl`   |
| `full` | `--solaris-radius-full` |

When `radius` is set to `'text'`, it resolves automatically:

- `text` → `sm`
- `rectangular` → `md`
- `circular` → `full`

## Density

| Density       | Effect                    |
| ------------- | ------------------------- |
| `compact`     | Reduced height/diameter.  |
| `comfortable` | Standard height/diameter. |

If `width` or `height` are explicitly set, density does not affect dimensions.

## Animation

| Animation | Description                          |
| --------- | ------------------------------------ |
| `pulse`   | Subtle opacity oscillation. Default. |
| `wave`    | Shimmer effect moving left to right. |
| `none`    | No animation.                        |

## Lines (multi-line)

When `variant="text"`, the `lines` input renders multiple text lines with automatically varied widths:

```html
<solaris-skeleton lines="3"></solaris-skeleton>
```

This produces 3 text lines with widths like 100%, 92%, 85% — simulating natural text flow.

When `width` is set, the first line respects the custom width; subsequent lines use the auto-varied sequence.

`lines` only works with `variant="text"`. Other variants ignore multi-line behavior.

## Width / Height

Custom dimensions override defaults. Accepts any valid CSS length:

```html
<solaris-skeleton width="70%"></solaris-skeleton>
<solaris-skeleton width="12rem" height="1.6rem"></solaris-skeleton>
<solaris-skeleton variant="rectangular" height="12rem"></solaris-skeleton>
```

## Reduced motion

When reduced motion is active (via `prefers-reduced-motion: reduce` or `[data-reduced-motion='true']`), all animations are disabled. The skeleton renders as a static placeholder.

Skeleton respects both:

- The CSS media query `prefers-reduced-motion: reduce`
- The Solaris `[data-reduced-motion='true']` attribute

## Composition

Skeleton is designed for composition. Combine multiple instances to build loading placeholders for complex layouts. No public `SkeletonGroup` component exists in v1; compose using `solaris-skeleton` directly with local CSS classes.

```html
<section aria-busy="true" aria-label="Loading profile">
  <div class="profile-skeleton">
    <solaris-skeleton variant="circular" size="lg"></solaris-skeleton>
    <div class="profile-skeleton__lines">
      <solaris-skeleton width="60%"></solaris-skeleton>
      <solaris-skeleton width="40%"></solaris-skeleton>
    </div>
  </div>
</section>
```

## Accessibility

- Skeleton has `aria-hidden="true"` by default.
- Skeleton is not focusable.
- Skeleton has no `role` attribute.
- Skeleton does not capture keyboard events.
- The external context must communicate loading state using `aria-busy` and/or `aria-label`.

```html
<section aria-busy="true" aria-label="Loading report data">
  <solaris-skeleton></solaris-skeleton>
</section>
```

Skeleton is visual only. It must not be the sole mechanism for communicating loading state.

## Limitations (v1)

- Skeleton is non-interactive. It is not clickable and does not emit events.
- Individual skeleton is decorative (`aria-hidden="true"`). The context must inform loading.
- No public `SkeletonGroup` component exists in v1.
- No presets (skeleton-card, skeleton-list, skeleton-table, etc.) in v1.
- Skeleton does not manage `aria-busy` of parent context.
- No harness is provided in v1.
