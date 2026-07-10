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
| Default appearance | `solid`                               | `ghost`                                                         |
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
- When you need multiple icon buttons grouped → wait for Button Group (future)
- When you need toggle/pressed state → Toggle Button (future)
- When you need a menu trigger → Menu Button (future)

## API

### SolarisIconButtonDirective

Selector: `[solaris-icon-button]`

| Input          | Type                                                                                 | Default     | Description                  |
| -------------- | ------------------------------------------------------------------------------------ | ----------- | ---------------------------- |
| `appearance`   | `'solid' \| 'outline' \| 'ghost' \| 'tonal' \| 'surface' \| 'glass'`                 | `'ghost'`   | Visual style                 |
| `color`        | `'neutral' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'custom'` | `'neutral'` | Semantic color               |
| `size`         | `'sm' \| 'md' \| 'lg'`                                                               | `'md'`      | Button size                  |
| `radius`       | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'`                                           | `'md'`      | Border radius                |
| `density`      | `'compact' \| 'comfortable'`                                                         | inherited   | Spacing density              |
| `loading`      | `boolean`                                                                            | `false`     | Loading state                |
| `disabled`     | `boolean`                                                                            | `false`     | Disabled state               |
| `ariaLabel`    | `string \| undefined`                                                                | —           | Accessible name input        |
| `ariaLabelKey` | `string \| undefined`                                                                | —           | i18n key for accessible name |

### SolarisIconButtonBadgeDirective

Selector: `[solaris-icon-button-badge]`

Used on a badge element projected inside the icon button to position it correctly.

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

## Component CSS Variables

| Variable                                  | Description                |
| ----------------------------------------- | -------------------------- |
| `--solaris-icon-button-size`              | Width/height of the button |
| `--solaris-icon-button-icon-size`         | Icon dimensions            |
| `--solaris-icon-button-radius`            | Border radius              |
| `--solaris-icon-button-color`             | Icon color                 |
| `--solaris-icon-button-background`        | Background color           |
| `--solaris-icon-button-border-color`      | Border color               |
| `--solaris-icon-button-border-width`      | Border width               |
| `--solaris-icon-button-hover-background`  | Hover background           |
| `--solaris-icon-button-active-background` | Active background          |
| `--solaris-icon-button-focus-ring-color`  | Focus ring color           |
| `--solaris-icon-button-disabled-opacity`  | Disabled opacity           |

| `--solaris-icon-button-custom-*` | Custom color overrides |

## Accessibility

- Native `<button>` and `<a>` semantics are preserved.
- Focus-visible ring is styled, never removed.
- Decorative icon uses `decorative="true"` (equivalent to `aria-hidden="true"`).
- Accessible name requirement enforced.
- Loading state preserves accessible name.
- Disabled anchor is not keyboard navigable.
- Badge is visual only; accessible name must be set on the button.

## Limitations (v1)

- No toggle/pressed/selected state.
- No embedded tooltip.
- No automatic menu/dropdown semantics.
- No Button Group.
- No floating action button.
- Badge does not automatically update accessible name.

## Button Group (Future)

Button Group is planned for a future release. It will support:

- Horizontal and vertical layout
- Disabled states
- Badge integration
- Icon-only buttons
- Combined actions (e.g., Save with badge)
- Fork/Star with counter
- Dropdown integration
- Active/selected states

The current Icon Button is designed to be compatible with future Button Group composition.
