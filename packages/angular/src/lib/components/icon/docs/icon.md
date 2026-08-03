# SolarisIconComponent

## Purpose

Renders a single SVG icon by name using the `SolarisIconRegistryService`.
Icons are decorative by default and can be made accessible with a semantic
label. See the [Icon System guide](../../../../../docs/guides/icons.md) for
the full icon workflow.

## API

### Inputs

| Input        | Type      | Default     | Description                                |
| ------------ | --------- | ----------- | ------------------------------------------ |
| `name`       | `string`  | `required`  | Icon name registered in the icon registry. |
| `ariaLabel`  | `string`  | `undefined` | Accessible label applied as `aria-label`.  |
| `decorative` | `boolean` | `false`     | Hides the icon from assistive technology.  |

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
<solaris-icon name="check" decorative="true" />

<!-- Accessible icon -->
<solaris-icon name="alert" ariaLabel="Warning" />

<!-- Custom icon registered at runtime -->
<solaris-icon name="my-icon" />
```

## CSS Variables

This component does not define public CSS variables. Icon color inherits from
the current text color via `currentColor`.
