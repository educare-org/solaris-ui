# Solaris Badge

## Purpose

Badge displays short informational content such as status labels, counts, or semantic indicators. It is a non-interactive visual element.

## When to use

- Displaying a status label (e.g., "Active", "Processing", "Shipped").
- Showing a count or notification number.
- Tagging content with a semantic color.
- Providing lightweight visual distinction without interaction.

## When not to use

- Do not use Badge as a button, link, or clickable chip.
- Do not use Badge for dismissible tags.
- Do not use Badge for navigation.
- For interactive chips or tags, create a separate Chip component.

## API

### SolarisBadgeComponent

**Selector:** `solaris-badge`

| Input        | Type                                                                                 | Default      | Description       |
| ------------ | ------------------------------------------------------------------------------------ | ------------ | ----------------- |
| `appearance` | `'solid' \| 'tonal' \| 'outline' \| 'ghost'`                                         | `'tonal'`    | Visual appearance |
| `color`      | `'neutral' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'custom'` | `'neutral'`  | Semantic color    |
| `size`       | `'sm' \| 'md' \| 'lg'`                                                               | `'md'`       | Size variant      |
| `radius`     | `'sm' \| 'md' \| 'full'`                                                             | `'full'`     | Border radius     |
| `variant`    | `'standard' \| 'count'`                                                              | `'standard'` | Visual variant    |
| `density`    | `'compact' \| 'normal' \| 'comfortable'`                                             | inherited    | Density variant   |

### SolarisBadgeIconDirective

**Selector:** `[solaris-badge-icon]`

Marks an element inside the badge as the icon slot for sizing and alignment.

## Appearances

| Appearance | Visual                                  |
| ---------- | --------------------------------------- |
| `solid`    | Filled background, high visual weight   |
| `tonal`    | Low-intensity background, medium weight |
| `outline`  | Transparent background, visible border  |
| `ghost`    | No background or border, text only      |

Default: `tonal`

## Colors

| Color     | Usage                              |
| --------- | ---------------------------------- |
| `neutral` | Default, no semantic meaning       |
| `primary` | Brand accent                       |
| `success` | Positive states                    |
| `warning` | Attention states                   |
| `danger`  | Error or destructive states        |
| `info`    | Informational states               |
| `custom`  | Consumer-defined via CSS variables |

Default: `neutral`

## Sizes

| Size | Height   |
| ---- | -------- |
| `sm` | 1.125rem |
| `md` | 1.25rem  |
| `lg` | 1.5rem   |

Default: `md`

## Radius

| Radius | Value                      |
| ------ | -------------------------- |
| `sm`   | var(--solaris-radius-sm)   |
| `md`   | var(--solaris-radius-md)   |
| `full` | var(--solaris-radius-full) |

Default: `full`

## Density

| Density       | Effect                             |
| ------------- | ---------------------------------- |
| `compact`     | Reduced vertical padding and gap   |
| `comfortable` | Increased vertical padding and gap |

When not provided, Badge inherits density from the theme system.

## Variant

| Variant    | Usage                             |
| ---------- | --------------------------------- |
| `standard` | Default text/status badge         |
| `count`    | Circular count/notification badge |

For `count` variant with `radius="full"`, the badge maintains a circular aspect ratio.

## Icon usage

Use the `[solaris-badge-icon]` directive on an element inside the badge to mark it as an icon slot.

```html
<solaris-badge color="success">
  <solaris-icon solaris-badge-icon name="check" decorative="true" />
  Shipped
</solaris-badge>

<solaris-badge color="info">
  Processing
  <solaris-icon solaris-badge-icon name="loader" decorative="true" />
</solaris-badge>
```

Icons should be marked as `decorative="true"` when they do not add meaning beyond the text.

## Customization via CSS variables

For the `custom` color, set CSS variables on the host or a parent:

```css
.my-custom-badge {
  --solaris-badge-custom-background: #9333ea;
  --solaris-badge-custom-color: #ffffff;
  --solaris-badge-custom-border-color: #9333ea;
}
```

Available custom tokens:

| Token                                 | Purpose          |
| ------------------------------------- | ---------------- |
| `--solaris-badge-custom-background`   | Background color |
| `--solaris-badge-custom-color`        | Text color       |
| `--solaris-badge-custom-border-color` | Border color     |

General component tokens available for advanced customization:

| Token                          | Purpose                   |
| ------------------------------ | ------------------------- |
| `--solaris-badge-background`   | Background color          |
| `--solaris-badge-color`        | Text color                |
| `--solaris-badge-border-color` | Border color              |
| `--solaris-badge-gap`          | Gap between icon and text |
| `--solaris-badge-padding-x`    | Horizontal padding        |
| `--solaris-badge-padding-y`    | Vertical padding          |
| `--solaris-badge-font-size`    | Font size                 |
| `--solaris-badge-line-height`  | Line height               |
| `--solaris-badge-radius`       | Border radius             |
| `--solaris-badge-min-height`   | Minimum height            |
| `--solaris-badge-min-width`    | Minimum width             |
| `--solaris-badge-icon-size`    | Icon width/height         |

## Accessibility

- Badge is non-interactive and does not receive focus.
- Badge does not have `role="button"` or any interactive ARIA attributes.
- Content text is preserved for screen readers.
- Decorative icons inside Badge should use `decorative="true"` or `aria-hidden="true"`.
- Badge does not rely solely on color to convey meaning when text is present.

### Icon-only usage

If a Badge is used with only an icon and no text, the consumer must provide an accessible label via `aria-label` on the badge element or ensure the icon has an accessible name.

## Examples

```html
<!-- Appearances -->
<solaris-badge appearance="solid">Solid</solaris-badge>
<solaris-badge appearance="tonal">Tonal</solaris-badge>
<solaris-badge appearance="outline">Outline</solaris-badge>
<solaris-badge appearance="ghost">Ghost</solaris-badge>

<!-- Colors -->
<solaris-badge color="neutral">Neutral</solaris-badge>
<solaris-badge color="primary">Primary</solaris-badge>
<solaris-badge color="success">Success</solaris-badge>
<solaris-badge color="warning">Warning</solaris-badge>
<solaris-badge color="danger">Danger</solaris-badge>
<solaris-badge color="info">Info</solaris-badge>

<!-- Sizes -->
<solaris-badge size="sm">Small</solaris-badge>
<solaris-badge size="md">Medium</solaris-badge>
<solaris-badge size="lg">Large</solaris-badge>

<!-- Radius -->
<solaris-badge radius="sm">SM</solaris-badge>
<solaris-badge radius="md">MD</solaris-badge>
<solaris-badge radius="full">Full</solaris-badge>

<!-- Variants -->
<solaris-badge variant="standard">Standard</solaris-badge>
<solaris-badge variant="count" radius="full">3</solaris-badge>

<!-- Density -->
<solaris-badge density="compact">Compact</solaris-badge>
<solaris-badge density="comfortable">Comfortable</solaris-badge>

<!-- With icon -->
<solaris-badge color="success">
  <solaris-icon solaris-badge-icon name="check" decorative="true" />
  Active
</solaris-badge>

<!-- Custom color -->
<div class="my-custom-badge">
  <solaris-badge color="custom">Custom</solaris-badge>
</div>
```

## Limitations (v1)

- Not interactive.
- No click, dismiss, or keyboard events.
- No link support.
- No routerLink.
- No tooltip built-in.
- No avatar or flag mode.
- No glass or surface appearance.
- No harness in v1 (may be added later if pattern proves useful for simple components).
- Custom color is only available via CSS variables, not arbitrary input props.
