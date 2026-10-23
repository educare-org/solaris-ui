# Solaris Badge

## Purpose

Badge displays short informational content such as status labels, counts, or semantic indicators. It is a non-interactive visual element.

## When to use

- Displaying a status label (e.g., "Active", "Processing", "Shipped").
- Showing a count or notification number with `count`/`max`.
- Signaling presence or unread state with the `dot` variant.
- Tagging content with a semantic color.
- Anchoring a counter to an avatar, icon or tab with `placement`.
- Providing lightweight visual distinction without interaction.

## When not to use

- Do not use Badge as a button, link, or clickable chip.
- Do not use Badge for dismissible tags.
- Do not use Badge for navigation.
- For interactive chips or tags, create a separate Chip component.

## API

### SolarisBadgeComponent

**Selector:** `solaris-badge`

| Input          | Type                                                                                 | Default      | Description                                        |
| -------------- | ------------------------------------------------------------------------------------ | ------------ | -------------------------------------------------- |
| `appearance`   | `'solid' \| 'tonal' \| 'surface' \| 'outline' \| 'ghost'`                            | `'tonal'`    | Visual appearance                                  |
| `color`        | `'neutral' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'custom'` | `'neutral'`  | Semantic color                                     |
| `size`         | `'sm' \| 'md' \| 'lg'`                                                               | `'md'`       | Size variant                                       |
| `radius`       | `'sm' \| 'md' \| 'full'`                                                             | `'full'`     | Border radius                                      |
| `variant`      | `'standard' \| 'count'`                                                              | `'standard'` | Visual variant (kept for compatibility, see Count) |
| `density`      | `'compact' \| 'normal' \| 'comfortable'`                                             | inherited    | Density variant                                    |
| `count`        | `number \| undefined`                                                                | `undefined`  | Counter value; renders the badge in count mode     |
| `max`          | `number`                                                                             | `99`         | Cap before the `"+"` suffix (`103` → `"99+"`)      |
| `showZero`     | `boolean`                                                                            | `false`      | Render `0` instead of hiding the badge             |
| `dot`          | `boolean`                                                                            | `false`      | Dot-only mode (wins over `count`)                  |
| `pulse`        | `boolean`                                                                            | `false`      | Pulsing ring around the dot                        |
| `iconOnly`     | `boolean`                                                                            | `false`      | Square geometry for icon-only badges               |
| `placement`    | `'inline' \| 'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'`           | `'inline'`   | Anchor the badge to a positioned ancestor          |
| `offset`       | `readonly [number, number] \| undefined`                                             | `undefined`  | Extra `[x, y]` displacement in px when placed      |
| `truncate`     | `boolean`                                                                            | `true`       | Clip long labels with ellipsis + automatic `title` |
| `ariaLabel`    | `string \| undefined`                                                                | `undefined`  | Accessible name (required for `dot`/`iconOnly`)    |
| `ariaLabelKey` | `string \| undefined`                                                                | `undefined`  | i18n key for the accessible name                   |

### SolarisBadgeIconDirective

**Selector:** `[solaris-badge-icon]`

Marks an element inside the badge as the icon slot. Sizing comes from
`--solaris-badge-icon-size` through the directive host — no `::ng-deep` needed.

## Appearances

| Appearance | Visual                                   |
| ---------- | ---------------------------------------- |
| `solid`    | Filled background, high visual weight    |
| `tonal`    | Low-intensity background, visible border |
| `surface`  | Low-intensity background, no border      |
| `outline`  | Transparent background, visible border   |
| `ghost`    | No background or border, text only       |

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

## Sizes × Density

Badge keeps its own compact height ladder (it is a display element, not a
form control, so it does not follow `--solaris-control-height-*`). Every
`size × density` combination has a deterministic outer height:

|      | `compact` | `normal` | `comfortable` |
| ---- | --------- | -------- | ------------- |
| `sm` | 18px      | 20px     | 22px          |
| `md` | 22px      | 24px     | 28px          |
| `lg` | 26px      | 30px     | 34px          |

Typography follows `sm → xs`, `md → sm`, `lg → md`
(`--solaris-font-size-xs/sm/md` with `--solaris-line-height-sm`; rows keep a
fixed height so text never clips).
Icon size follows the text size (`14px / 16px / 18px`), gap follows density.

Default: `size="md"`, density inherited from the theme system.

When not provided, Badge inherits density from the theme system via
`effectiveDensity` (`density() ?? themeService.density`).

## Radius

| Radius | Value                      |
| ------ | -------------------------- |
| `sm`   | var(--solaris-radius-sm)   |
| `md`   | var(--solaris-radius-md)   |
| `full` | var(--solaris-radius-full) |

Default: `full`

## Count

Prefer the `count`/`max` inputs over projecting numbers by hand:

```html
<solaris-badge color="danger" [count]="3" />
<solaris-badge color="primary" [count]="42" />
<solaris-badge color="success" [count]="103" />
<!-- renders "99+" with title="103" -->
```

- `count > max` renders `"${max}+"` and exposes the full value in `title`.
- `count === 0` hides the badge unless `showZero` is `true`.
- Count badges keep a circular footprint for a single digit (`aspect-ratio`
  - `min-width` equal to the row height) and grow horizontally for more digits.
- `variant="count"` is still supported for projected content and shares the
  same circular geometry. Pair counts with `radius="full"`.

## Dot

```html
<solaris-badge color="success" [dot]="true" ariaLabel="Online" /> <solaris-badge color="danger" [dot]="true" [pulse]="true" ariaLabel="Live" />
```

- `dot` renders a status point sized per `size` (`8px / 10px / 12px`) and wins
  over `count`.
- `pulse` adds an expanding ring. It is disabled under
  `prefers-reduced-motion` and `[data-reduced-motion='true']`.
- A dot carries no text: always provide `ariaLabel` (or `ariaLabelKey`).

## Icon usage

Use the `[solaris-badge-icon]` directive on an element inside the badge to mark it as an icon slot.

```html
<solaris-badge color="success">
  <solaris-icon solaris-badge-icon name="check" decorative="true" />
  Shipped
</solaris-badge>

<solaris-badge color="info">
  Processing
  <solaris-icon solaris-badge-icon name="info" decorative="true" />
</solaris-badge>
```

Icons should be marked as `decorative="true"` when they do not add meaning beyond the text.

### Icon-only usage

```html
<solaris-badge color="primary" [iconOnly]="true" ariaLabel="Notifications">
  <solaris-icon solaris-badge-icon name="info" decorative="true" />
</solaris-badge>
```

`iconOnly` switches to the square count geometry with zero side padding so
the badge stays circular. The consumer must provide an accessible label via
`ariaLabel` (or `ariaLabelKey`), or ensure the icon has an accessible name.

## Placement

```html
<div style="position: relative">
  <solaris-avatar ... />
  <solaris-badge color="success" dot placement="bottom-right" ariaLabel="Online" />
</div>
```

- `placement="inline"` (default) keeps the badge in normal flow.
- Any other value positions the badge absolutely in the corner of the nearest
  positioned ancestor (which needs `position: relative`).
- `offset` adds an extra `[x, y]` displacement in px, exposed as
  `--solaris-badge-offset-x/y` (e.g. `[offset]="[4, 8]"`).
- Placed badges render above content with `--solaris-z-index-raised`.

## Truncation

Long `standard` labels are clipped to `--solaris-badge-max-width`
(`128px / 160px / 192px` per `size`) with ellipsis, and the full text is
exposed automatically in `title` once overflow is measured. Set
`truncate="false"` to opt out.

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

| Token                             | Purpose                         |
| --------------------------------- | ------------------------------- |
| `--solaris-badge-background`      | Background color                |
| `--solaris-badge-color`           | Text color                      |
| `--solaris-badge-border-color`    | Border color                    |
| `--solaris-badge-height`          | Outer height (per size×density) |
| `--solaris-badge-gap`             | Gap between icon and text       |
| `--solaris-badge-padding-x`       | Horizontal padding              |
| `--solaris-badge-padding-y`       | Vertical padding (default 0)    |
| `--solaris-badge-font-size`       | Font size                       |
| `--solaris-badge-line-height`     | Line height                     |
| `--solaris-badge-radius`          | Border radius                   |
| `--solaris-badge-min-height`      | Minimum height                  |
| `--solaris-badge-min-width`       | Minimum width                   |
| `--solaris-badge-icon-size`       | Icon width/height               |
| `--solaris-badge-dot-size`        | Dot diameter                    |
| `--solaris-badge-max-width`       | Truncation width                |
| `--solaris-badge-count-padding-x` | Side padding in count mode      |
| `--solaris-badge-offset-x`        | Placed horizontal displacement  |
| `--solaris-badge-offset-y`        | Placed vertical displacement    |

## Accessibility

- Badge is non-interactive and does not receive focus.
- Badge does not have `role="button"` or any interactive ARIA attributes.
- Content text is preserved for screen readers.
- Decorative icons inside Badge should use `decorative="true"` or `aria-hidden="true"`.
- Badge does not rely solely on color to convey meaning when text is present.
- `dot` and `iconOnly` badges carry no text: provide `ariaLabel`/`ariaLabelKey`.
- Capped counts (`"99+"`) expose the full value in `title`; prefer a full
  `ariaLabel` when the exact number matters to screen readers.
- A zero count hidden via `showZero="false"` uses the native `hidden`
  attribute and is removed from the accessibility tree.

## Examples

```html
<!-- Appearances -->
<solaris-badge appearance="solid">Solid</solaris-badge>
<solaris-badge appearance="tonal">Tonal</solaris-badge>
<solaris-badge appearance="surface">Surface</solaris-badge>
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

<!-- Count -->
<solaris-badge color="danger" [count]="3" />
<solaris-badge color="primary" [count]="42" />
<solaris-badge color="success" [count]="103" />

<!-- Dot -->
<solaris-badge color="success" [dot]="true" ariaLabel="Online" />
<solaris-badge color="danger" [dot]="true" [pulse]="true" ariaLabel="Live" />

<!-- Density -->
<solaris-badge density="compact">Compact</solaris-badge>
<solaris-badge density="comfortable">Comfortable</solaris-badge>

<!-- With icon -->
<solaris-badge color="success">
  <solaris-icon solaris-badge-icon name="check" decorative="true" />
  Active
</solaris-badge>

<!-- Icon only -->
<solaris-badge color="primary" [iconOnly]="true" ariaLabel="Notifications">
  <solaris-icon solaris-badge-icon name="info" decorative="true" />
</solaris-badge>

<!-- Placed -->
<div style="position: relative">
  <solaris-badge color="danger" [count]="3" placement="top-right" />
</div>

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
- No avatar or flag mode.
- No glass appearance.
- No harness in v1 (may be added later if pattern proves useful for simple components).
- Custom color is only available via CSS variables, not arbitrary input props.
