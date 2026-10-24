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

| Input         | Type                                                    | Default   | Description                                                                                                                             |
| ------------- | ------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| variant       | `'text'` \| `'rectangular'` \| `'circular'`             | `'text'`  | Shape variant of the skeleton.                                                                                                          |
| animation     | `'pulse'` \| `'wave'` \| `'none'`                       | `'pulse'` | Animation style.                                                                                                                        |
| size          | `'sm'` \| `'md'` \| `'lg'`                              | `'md'`    | Size preset. Combined with `density` (see matrix).                                                                                      |
| radius        | `'none'` \| `'sm'` \| `'full'`                          | `'text'`  | Border radius. `'text'` resolves based on variant.                                                                                      |
| density       | `'compact'` \| `'normal'` \| `'comfortable'` (optional) | —         | Density preset. Falls back to the theme density (`effectiveDensity`).                                                                   |
| width         | `string` (optional)                                     | —         | Custom width (e.g. `'70%'`, `'192px'`). Overrides the matrix.                                                                           |
| height        | `string` (optional)                                     | —         | Custom height (e.g. `'26px'`, `'192px'`). Overrides the matrix.                                                                         |
| aspectRatio   | `string` (optional)                                     | —         | Custom aspect ratio for `rectangular` (e.g. `'16 / 9'`). Ignored when `height` is set.                                                  |
| lines         | `number` (optional)                                     | `1`       | Number of text lines for variant `text`. Lines have deterministic widths.                                                               |
| lastLineWidth | `string` (optional)                                     | `'68%'`   | Width of the last line when `lines > 1`.                                                                                                |
| delay         | `number` (optional)                                     | `0`       | Milliseconds to wait before rendering. Avoids flashing on fast loads. Host stays hidden (`data-pending`) until then.                    |
| duration      | `string` (optional)                                     | —         | Animation duration (e.g. `'[duration]="\'400ms\'"'`). Sets `--solaris-skeleton-animation-duration` inline; inherits to multi-line rows. |

## Variants

| Variant       | Shape                                     | Default radius |
| ------------- | ----------------------------------------- | -------------- |
| `text`        | Line placeholder                          | `sm`           |
| `rectangular` | Block placeholder (cards, images, etc.)   | `sm`           |
| `circular`    | Circle placeholder (avatars, icons, etc.) | `full`         |

## Sizes

Size combines with density into an explicit matrix (own px scale — skeleton
is a decorative placeholder, so the `--solaris-control-height-*` ladder for
interactive controls does not apply). Every cell below is a dedicated rule;
no value is derived from cascade order.

| Variant \ density    | compact (sm \| md \| lg) | normal (sm \| md \| lg) | comfortable (sm \| md \| lg) |
| -------------------- | ------------------------ | ----------------------- | ---------------------------- |
| `text` height        | 8px \| 12px \| 16px      | 12px \| 16px \| 20px    | 16px \| 20px \| 24px         |
| `rectangular` height | 48px \| 64px \| 80px     | 64px \| 96px \| 128px   | 96px \| 128px \| 160px       |
| `circular` diameter  | 20px \| 24px \| 32px     | 24px \| 32px \| 40px    | 32px \| 40px \| 48px         |

Multiline gap follows density only: `compact` 8px, `normal` 12px,
`comfortable` 16px.

## Radius

| Value  | Token                   |
| ------ | ----------------------- |
| `none` | `--solaris-radius-none` |
| `sm`   | `--solaris-radius-sm`   |
| `full` | `--solaris-radius-full` |

When `radius` is set to `'text'`, it resolves automatically:

- `text` → `sm`
- `rectangular` → `sm`
- `circular` → `full`

## Density

| Density       | Effect                                    |
| ------------- | ----------------------------------------- |
| `compact`     | Reduced height/diameter and tighter gap.  |
| `normal`      | Standard height/diameter (theme default). |
| `comfortable` | Enlarged height/diameter and looser gap.  |

When unset, density falls back to the theme density via `effectiveDensity`
(`density() ?? themeService.density`). The host always exposes the resolved
value in `data-density`. Explicit `width`/`height` override the matrix.

## Animation

| Animation | Description                          |
| --------- | ------------------------------------ |
| `pulse`   | Subtle opacity oscillation. Default. |
| `wave`    | Shimmer effect moving left to right. |
| `none`    | No animation.                        |

The wave shimmer travels right-to-left under `[dir='rtl']` (the symmetric
placeholder is mirrored). Speed is tunable per instance via `duration`
(default `--solaris-motion-duration-slower`, `1200ms`); without it, override
`--solaris-skeleton-animation-duration`.

## Lines (multi-line)

When `variant="text"`, the `lines` input renders multiple text lines with
deterministic widths: the first line is `100%` (or the custom `width`), middle
lines follow a fixed sequence, and the last line uses `lastLineWidth`
(`'68%'` by default) to simulate a natural paragraph ending:

```html
<solaris-skeleton lines="3"></solaris-skeleton> <solaris-skeleton lines="4" lastLineWidth="50%"></solaris-skeleton>
```

`lines` only works with `variant="text"`. Other variants ignore multi-line
behavior. Non-positive values render no lines.

## Delay

`delay` postpones rendering by the given milliseconds — useful to avoid
flashing placeholders on fast loads. While pending, the host carries
`data-pending` and stays `visibility: hidden` (layout space preserved):

```html
<solaris-skeleton [delay]="400"></solaris-skeleton>
```

## Width / Height / Aspect ratio

Custom dimensions override the matrix. Accepts any valid CSS length
(prefer `px` or `%`):

```html
<solaris-skeleton width="70%"></solaris-skeleton>
<solaris-skeleton width="192px" height="26px"></solaris-skeleton>
<solaris-skeleton variant="rectangular" width="100%" aspectRatio="16 / 9"></solaris-skeleton>
<solaris-skeleton variant="rectangular" height="192px"></solaris-skeleton>
```

## CSS Variables

The following CSS variables can be customized:

| Token                                   | Purpose                                        |
| --------------------------------------- | ---------------------------------------------- |
| `--solaris-skeleton-width`              | Skeleton width                                 |
| `--solaris-skeleton-height`             | Skeleton height                                |
| `--solaris-skeleton-gap`                | Gap between multi-line skeleton lines          |
| `--solaris-skeleton-radius`             | Border radius                                  |
| `--solaris-skeleton-background`         | Base background color                          |
| `--solaris-skeleton-highlight`          | Shimmer highlight color for the wave animation |
| `--solaris-skeleton-animation-duration` | Animation duration                             |
| `--solaris-skeleton-animation-easing`   | Animation easing function                      |

## Reduced motion

When reduced motion is active (via `prefers-reduced-motion: reduce` or the
Solaris `[data-reduced-motion='true']` attribute), all animations are
disabled. The skeleton renders as a static placeholder.

## Composition

Skeleton is designed for composition. Combine multiple instances to build loading placeholders for complex layouts (profile cards, dashboard cards, list rows, media blocks — see the showcase presets). No public `SkeletonGroup` component exists in v1; compose using `solaris-skeleton` directly with local CSS classes.

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

## Examples

```html
<!-- Variants -->
<solaris-skeleton></solaris-skeleton>
<solaris-skeleton variant="rectangular"></solaris-skeleton>
<solaris-skeleton variant="circular"></solaris-skeleton>

<!-- Sizes -->
<solaris-skeleton size="sm"></solaris-skeleton>
<solaris-skeleton size="lg"></solaris-skeleton>

<!-- Animations -->
<solaris-skeleton animation="pulse"></solaris-skeleton>
<solaris-skeleton animation="wave"></solaris-skeleton>
<solaris-skeleton animation="none"></solaris-skeleton>

<!-- Multi-line text -->
<solaris-skeleton lines="3"></solaris-skeleton>

<!-- Delayed (no flash on fast loads) -->
<solaris-skeleton [delay]="400"></solaris-skeleton>

<!-- Custom animation speed -->
<solaris-skeleton animation="wave" [duration]="'400ms'"></solaris-skeleton>

<!-- Custom dimensions -->
<solaris-skeleton width="70%"></solaris-skeleton>
<solaris-skeleton variant="rectangular" width="192px" height="96px"></solaris-skeleton>
<solaris-skeleton variant="rectangular" width="100%" aspectRatio="16 / 9"></solaris-skeleton>

<!-- Loading composition -->
<section aria-busy="true" aria-label="Loading profile">
  <div class="profile-skeleton">
    <solaris-skeleton variant="circular" size="lg"></solaris-skeleton>
    <solaris-skeleton width="60%"></solaris-skeleton>
  </div>
</section>
```

## Limitations (v1)

- Skeleton is non-interactive. It is not clickable and does not emit events.
- Individual skeleton is decorative (`aria-hidden="true"`). The context must inform loading.
- No public `SkeletonGroup` component exists in v1.
- No harness is provided in v1.
