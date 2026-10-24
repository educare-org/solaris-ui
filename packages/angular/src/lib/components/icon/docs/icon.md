# SolarisIconComponent

## Purpose

Renders a single SVG icon by name using the `SolarisIconRegistryService`.
Icons are decorative by default and can be made accessible with a semantic
label. See the [Icon System guide](../../../../../docs/guides/icons.md) for
the full icon workflow.

## API

### Inputs

| Input                 | Type                                | Default     | Description                                                              |
| --------------------- | ----------------------------------- | ----------- | ------------------------------------------------------------------------ |
| `name`                | `string`                            | `required`  | Icon name registered in the icon registry.                               |
| `variant`             | `'outline' \| 'solid' \| 'duotone'` | `'outline'` | Render variant; falls back per icon when no dedicated art exists.        |
| `size`                | `number \| string`                  | `undefined` | Host width/height (number is px); defaults to `1em` styling.             |
| `strokeWidth`         | `number`                            | `2`         | Stroke width for line-based variants; overrides icon and global default. |
| `absoluteStrokeWidth` | `boolean`                           | `false`     | Keeps stroke width constant when the icon scales.                        |
| `ariaLabel`           | `string`                            | `undefined` | Accessible label applied as `aria-label`.                                |
| `decorative`          | `boolean`                           | `true`      | Hides the icon from assistive technology.                                |
| `inheritColor`        | `boolean`                           | `true`      | Whether the icon inherits `currentColor` for its stroke.                 |

### Variants

`outline` renders the line art with `currentColor`. `solid` fills `fillable`
icons (e.g. `bookmark`) with `currentColor`; icons without dedicated solid art
(e.g. `chart-spline`, `rss`) render a rounded-square knockout fallback and
expose `isFallback() === true`. `duotone` renders a `currentColor` layer at
20% opacity behind the line art. Icons with embedded brand colors always render
their own fills regardless of variant.

### Colors

Icons that carry their own colors (multi-color brand icons like `google`,
`microsoft`, `android`, and monochrome brand icons like `apple`, `github`)
render with their embedded fills and no inherited stroke, so their brand
colors are preserved regardless of the surrounding text color.

Line-based icons (e.g. `check`, `chevron-right`) use `currentColor` by default,
inheriting the text color from their context. Set `[inheritColor]="false"` to
force such an icon to render without an inherited stroke (useful when you want
to control the color purely via CSS on the SVG elements).

### Outputs

None.

### Accessibility behavior

- When `decorative` is `true`, the SVG is hidden with `aria-hidden="true"`.
- When `decorative` is `false` and `ariaLabel` is set, the icon is announced
  with that label.
- When `decorative` is `false` without an `ariaLabel`, the icon is hidden from
  assistive technology because it is assumed decorative.

## Accessibility

- Uses `aria-hidden` for decorative icons so screen readers ignore them.
- Uses `aria-label` when a semantic label is provided.
- The rendered SVG has `focusable="false"` to keep it out of the tab order.
- Pair icon-only controls with an accessible label on the control itself.

## Examples

```html
<!-- Decorative icon -->
<solaris-icon name="check" />

<!-- Accessible icon -->
<solaris-icon name="alert" [decorative]="false" ariaLabel="Warning" />

<!-- Solid variant with per-instance stroke and size -->
<solaris-icon name="bookmark" variant="solid" [size]="32" [strokeWidth]="1.5" />

<!-- Custom icon registered at runtime -->
<solaris-icon name="my-icon" />
```

## CSS Variables

This component does not define public CSS variables. Icon color inherits from
the current text color via `currentColor`.
