# Icon Button

## Purpose

Icon Button is a Solaris UI attribute directive that turns `<button>` and `<a>` elements into icon-only action buttons. It represents an action through an icon alone, without visible text label, requiring an accessible name for screen readers.

## Why Directive

Icon Button is implemented as a **directive** (`[solaris-icon-button]`), not a component. This preserves native semantics:

- `<button>` keeps its native button role, form submission behavior, and keyboard interactivity.
- `<a>` keeps its native link role, navigation capability, and keyboard interactivity.
- No wrapper elements, no ARIA role overrides, no extra DOM nodes.

## Difference Between Button and Icon Button

| Aspect             | Button (`[solaris-button]`)           | Icon Button (`[solaris-icon-button]`)                           |
| ------------------ | ------------------------------------- | --------------------------------------------------------------- |
| Content            | Text + optional icon                  | Icon only                                                       |
| Shape              | Rectangular (text-driven width)       | Square (equal width/height)                                     |
| Default appearance | `solid`                               | `solid`                                                         |
| Accessible name    | Usually visible text                  | Must be provided via `aria-label`/`aria-labelledby`/`ariaLabel` |
| Use case           | Primary/secondary actions with labels | Toolbar, header, card, action icon buttons                      |

## When to Use

- Toolbar actions (e.g., edit, delete, settings)
- Header actions (e.g., close, back, search)
- Card actions (e.g., favorite, share, options)
- Data table row actions
- Any action where the icon alone communicates the purpose

## When Not to Use

- When the action needs visible text label → use `[solaris-button]`
- When you need multiple icon buttons grouped → use `solaris-button-group`
- When you need toggle/pressed state → Toggle Button (not available in v1)
- When you need a menu trigger → Menu Button (not available in v1)

## API

### SolarisIconButtonDirective

Selector: `[solaris-icon-button]`

| Input          | Type                                                                                 | Default     | Description                  |
| -------------- | ------------------------------------------------------------------------------------ | ----------- | ---------------------------- |
| `appearance`   | `'solid' \| 'outline' \| 'ghost' \| 'tonal' \| 'surface'`                            | `'solid'`   | Visual style                 |
| `color`        | `'neutral' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'custom'` | `'neutral'` | Semantic color               |
| `size`         | `'sm' \| 'md' \| 'lg'`                                                               | `'md'`      | Button size                  |
| `radius`       | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'`                                           | `'md'`      | Border radius                |
| `density`      | `'compact' \| 'normal' \| 'comfortable'`                                             | inherited   | Spacing density              |
| `loading`      | `boolean`                                                                            | `false`     | Loading state                |
| `disabled`     | `boolean`                                                                            | `false`     | Disabled state               |
| `ariaLabel`    | `string \| undefined`                                                                | —           | Accessible name input        |
| `ariaLabelKey` | `string \| undefined`                                                                | —           | i18n key for accessible name |

### SolarisIconButtonBadgeDirective

Selector: `[solaris-icon-button-badge]`

Used on a badge element projected inside the icon button to position it correctly.

## Appearances

| Appearance | Visual                                 |
| ---------- | -------------------------------------- |
| `solid`    | Filled background, high visual weight  |
| `outline`  | Transparent background, visible border |
| `ghost`    | No background or border, subtle hover  |
| `tonal`    | Soft background, subtle border         |
| `surface`  | Muted background, no border            |

Default: `solid`

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

| Size | Width/Height |
| ---- | ------------ |
| `sm` | 2rem         |
| `md` | 2.5rem       |
| `lg` | 3rem         |

Default: `md`

## Radius

| Radius | Value                       |
| ------ | --------------------------- |
| `none` | 0                           |
| `sm`   | Token `--solaris-radius-sm` |
| `md`   | Token `--solaris-radius-md` |
| `lg`   | Token `--solaris-radius-lg` |
| `full` | Pill shape                  |

Default: `md`

## Density

| Density       | Effect                                                 |
| ------------- | ------------------------------------------------------ |
| `compact`     | Size from `--solaris-density-min-height`, smaller text |
| `normal`      | Size from `--solaris-density-min-height`, default text |
| `comfortable` | Size from `--solaris-density-min-height`, larger text  |

When not provided, Icon Button inherits density from the theme system. All values set `--solaris-icon-button-size` to `--solaris-density-min-height`; the icon font size follows the density typography token.

## Accessible Name (Required)

Icon Button **requires** an accessible name. Without one, the button is inaccessible to screen readers.

### Forms:

1. Native `aria-label`:

```html
<button solaris-icon-button aria-label="Close">
  <solaris-icon name="x" decorative="true" />
</button>
```

2. Native `aria-labelledby`:

```html
<button solaris-icon-button aria-labelledby="close-label">
  <solaris-icon name="x" decorative="true" />
</button>
<span id="close-label" solaris-visually-hidden>Close</span>
```

3. `ariaLabel` input:

```html
<button solaris-icon-button ariaLabel="Close">
  <solaris-icon name="x" decorative="true" />
</button>
```

4. `ariaLabelKey` input (with i18n):

```html
<button solaris-icon-button ariaLabelKey="actions.close">
  <solaris-icon name="x" decorative="true" />
</button>
```

The decorative icon does not contribute to the accessible name.

## States

- **Default**: Normal appearance.
- **Hover**: Background change (varies by appearance/color).
- **Active**: Pressed visual state.
- **Focus-visible**: Focus ring using `focus-visible` (not `:focus`).
- **Disabled**: Reduced opacity, no interaction.
- **Loading**: Spinner indicator, no interaction.

## Disabled

### On `<button>`:

Uses native `disabled` attribute. Interaction is blocked by the browser.

### On `<a>`:

No native `disabled` for anchors. The directive applies:

- `aria-disabled="true"`
- `tabindex="-1"`
- Prevents click events and navigation

## Loading

When `loading` is `true`:

- Interaction is blocked (same as disabled)
- A CSS-only spinner is shown via `::before` pseudo-element
- Accessible name is preserved
- Respects `prefers-reduced-motion`

## Badge

Use the `[solaris-icon-button-badge]` directive on a badge element inside the icon button:

```html
<button solaris-icon-button aria-label="Notifications, 3 new">
  <solaris-icon name="info" decorative="true" />
  <solaris-badge solaris-icon-button-badge variant="count" color="primary" size="sm" radius="full"> 3 </solaris-badge>
</button>
```

The badge is positioned in the top-right corner. The badge does not replace the accessible name — the consumer must include badge context in `aria-label`.

## Custom Color (CSS Variables)

For the `custom` color value, use CSS custom properties:

```css
.my-icon-button {
  --solaris-icon-button-custom-color: #ffffff;
  --solaris-icon-button-custom-background: #9333ea;
  --solaris-icon-button-custom-border-color: #9333ea;
  --solaris-icon-button-custom-hover-background: #7e22ce;
  --solaris-icon-button-custom-hover-border-color: #7e22ce;
  --solaris-icon-button-custom-active-background: #6b21a8;
  --solaris-icon-button-custom-active-border-color: #6b21a8;
}
```

## CSS Variables

The following CSS variables can be customized:

| Token                                       | Purpose                    |
| ------------------------------------------- | -------------------------- |
| `--solaris-icon-button-size`                | Width/height of the button |
| `--solaris-icon-button-radius`              | Border radius              |
| `--solaris-icon-button-color`               | Icon color                 |
| `--solaris-icon-button-background`          | Background color           |
| `--solaris-icon-button-border-color`        | Border color               |
| `--solaris-icon-button-border-width`        | Border width               |
| `--solaris-icon-button-hover-background`    | Hover background           |
| `--solaris-icon-button-hover-border-color`  | Hover border color         |
| `--solaris-icon-button-active-background`   | Active background          |
| `--solaris-icon-button-active-border-color` | Active border color        |
| `--solaris-icon-button-focus-ring-color`    | Focus ring color           |
| `--solaris-icon-button-disabled-opacity`    | Disabled opacity           |

### Custom color tokens

| Token                                              | Purpose             |
| -------------------------------------------------- | ------------------- |
| `--solaris-icon-button-custom-color`               | Icon color          |
| `--solaris-icon-button-custom-background`          | Background color    |
| `--solaris-icon-button-custom-border-color`        | Border color        |
| `--solaris-icon-button-custom-hover-background`    | Hover background    |
| `--solaris-icon-button-custom-hover-border-color`  | Hover border color  |
| `--solaris-icon-button-custom-active-background`   | Active background   |
| `--solaris-icon-button-custom-active-border-color` | Active border color |

## Accessibility

- Native `<button>` and `<a>` semantics are preserved.
- Focus-visible ring is styled, never removed.
- Decorative icon uses `decorative="true"` (equivalent to `aria-hidden="true"`).
- Accessible name requirement enforced.
- Loading state preserves accessible name.
- Disabled anchor is not keyboard navigable.
- Badge is visual only; accessible name must be set on the button.

## Examples

```html
<!-- Appearances -->
<button solaris-icon-button appearance="solid" aria-label="Check">
  <solaris-icon name="check" decorative="true" />
</button>
<button solaris-icon-button appearance="outline" aria-label="Check">
  <solaris-icon name="check" decorative="true" />
</button>
<button solaris-icon-button appearance="ghost" aria-label="Check">
  <solaris-icon name="check" decorative="true" />
</button>

<!-- Colors -->
<button solaris-icon-button color="primary" aria-label="Edit">
  <solaris-icon name="edit" decorative="true" />
</button>
<button solaris-icon-button color="danger" aria-label="Delete">
  <solaris-icon name="trash" decorative="true" />
</button>
<button solaris-icon-button color="success" aria-label="Check">
  <solaris-icon name="success" decorative="true" />
</button>

<!-- Sizes -->
<button solaris-icon-button size="sm" aria-label="Settings">
  <solaris-icon name="gear" decorative="true" />
</button>
<button solaris-icon-button size="md" aria-label="Settings">
  <solaris-icon name="gear" decorative="true" />
</button>
<button solaris-icon-button size="lg" color="primary" aria-label="Settings">
  <solaris-icon name="gear" decorative="true" />
</button>

<!-- Radius -->
<button solaris-icon-button radius="full" color="primary" aria-label="Check">
  <solaris-icon name="check" decorative="true" />
</button>

<!-- With badge -->
<button solaris-icon-button aria-label="Notifications, 3 new">
  <solaris-icon name="info" decorative="true" />
  <solaris-badge solaris-icon-button-badge variant="count" color="primary" size="sm" radius="full">3</solaris-badge>
</button>

<!-- Loading -->
<button solaris-icon-button [loading]="true" aria-label="Saving">
  <solaris-icon name="check" decorative="true" />
</button>
```

## Limitations (v1)

- No toggle/pressed/selected state.
- No embedded tooltip.
- No automatic menu/dropdown semantics.
- No Button Group.
- No floating action button.
- Badge does not automatically update accessible name.

## Button Group

Use `solaris-button-group` to group multiple icon buttons:

```html
<solaris-button-group aria-label="Mood">
  <button solaris-icon-button aria-label="Happy">
    <solaris-icon name="success" decorative="true" />
  </button>
  <button solaris-icon-button aria-label="Neutral">
    <solaris-icon name="info" decorative="true" />
  </button>
  <button solaris-icon-button aria-label="Sad">
    <solaris-icon name="danger" decorative="true" />
  </button>
</solaris-button-group>
```

Button Group supports horizontal/vertical layout, attached/separated items, and badge integration. Icon Button is designed to be composed inside it.
