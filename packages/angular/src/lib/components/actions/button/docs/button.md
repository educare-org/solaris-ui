# SolarisButtonDirective

## Purpose

SolarisButton is an attribute directive that turns `<button>` and `<a>` elements into Solaris-themed buttons with full token support, accessibility, and interaction states.

## Why directive, not component

`<button>` and `<a>` already have native semantics, keyboard behavior, and form participation. A directive preserves these without creating unnecessary DOM wrappers or fighting the browser.

Consumers write:

```html
<button solaris-button>Salvar</button> <a solaris-button href="/login">Entrar</a>
```

Not:

```html
<solaris-button>Salvar</solaris-button>
```

## When to use

- Any clickable action in the UI
- Form submissions (`type="submit"` preserved)
- Navigation actions (anchor with `href`)
- Primary, secondary, and tertiary actions
- Loading states that need visual feedback

## When not to use

- Icon-only buttons — use `[solaris-icon-button]`
- Button groups — use `solaris-button-group`
- Split buttons — not supported in v1
- Segmented controls — use `solaris-segmented-control`
- Social login buttons — compose with `appearance="outline"` and a projected icon

## Difference between Button and Icon Button

| Feature   | Button (`[solaris-button]`)          | Icon Button (`[solaris-icon-button]`) |
| --------- | ------------------------------------ | ------------------------------------- |
| Text      | Required (projected)                 | Not allowed                           |
| Icon      | Optional via `[solaris-button-icon]` | Required                              |
| Use case  | Actions with labels                  | Toolbar, compact actions              |
| v1 status | ✅ Implemented                       | ✅ Implemented                        |

## API

### Inputs

| Input             | Type                      | Default                 | Description                             |
| ----------------- | ------------------------- | ----------------------- | --------------------------------------- |
| `appearance`      | `SolarisButtonAppearance` | `'solid'`               | Visual style                            |
| `color`           | `SolarisButtonColor`      | `'neutral'`             | Semantic color                          |
| `radius`          | `SolarisButtonRadius`     | `'md'`                  | Border radius                           |
| `density`         | `SolarisButtonDensity`    | inherited or `'normal'` | Height, padding, and typography scale   |
| `shape`           | `SolarisButtonShape`      | `'normal'`              | Button proportions (`normal` \| `wide`) |
| `loading`         | `boolean`                 | `false`                 | Loading state                           |
| `disabled`        | `boolean`                 | `false`                 | Disabled state                          |
| `fullWidth`       | `boolean`                 | `false`                 | Full width                              |
| `loadingLabel`    | `string`                  | —                       | Accessible label during loading         |
| `loadingLabelKey` | `string`                  | —                       | i18n key for loading label              |
| `icon`            | `SolarisIconName`         | —                       | Icon rendered inside the button         |
| `iconPosition`    | `'start' \| 'end'`        | `'start'`               | Whether the icon sits before or after   |

### Types

```typescript
type SolarisButtonAppearance = 'solid' | 'outline' | 'ghost' | 'tonal' | 'surface';
type SolarisButtonColor = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'custom';
type SolarisButtonRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';
type SolarisButtonDensity = 'compact' | 'normal' | 'comfortable';
type SolarisButtonShape = 'normal' | 'wide';
type SolarisButtonIconPosition = 'start' | 'end';
```

## Appearances

| Appearance | Use case                                  | Visual                                 |
| ---------- | ----------------------------------------- | -------------------------------------- |
| `solid`    | Primary action, CTA, destructive action   | Filled background, high weight         |
| `outline`  | Secondary action                          | Transparent background, visible border |
| `ghost`    | Toolbar, dense context, low-weight action | No background or border, subtle hover  |
| `tonal`    | Action with semantics, medium emphasis    | Soft background, subtle border         |
| `surface`  | Low emphasis, inline with content         | Muted background, no border            |

## Colors

| Color     | Use case                       |
| --------- | ------------------------------ |
| `neutral` | Default action (neutral-first) |
| `primary` | Main CTA                       |
| `success` | Positive confirmation          |
| `warning` | Cautionary action              |
| `danger`  | Destructive or critical action |
| `info`    | Informational action           |
| `custom`  | Custom via CSS variables       |

Solaris is neutral-first. A button without explicit color uses `neutral`. Use `color="primary"` for primary actions.

### Custom color

Custom is not an arbitrary input. Use CSS variables:

```css
.my-custom-button {
  --solaris-button-custom-color: #ffffff;
  --solaris-button-custom-background: #7c3aed;
  --solaris-button-custom-border-color: #7c3aed;
  --solaris-button-custom-hover-background: #6d28d9;
  --solaris-button-custom-hover-border-color: #6d28d9;
  --solaris-button-custom-active-background: #5b21b6;
  --solaris-button-custom-active-border-color: #5b21b6;
}
```

```html
<button solaris-button color="custom" class="my-custom-button">Custom</button>
```

## Density

| Density       | Effect                                       |
| ------------- | -------------------------------------------- |
| `compact`     | Reduced height, padding, gap, and typography |
| `normal`      | Balanced height and spacing. Default         |
| `comfortable` | Increased height, padding, and typography    |

Density is inherited from the theme when not explicitly set. Fallback is `normal`.

## Radius

| Radius | Value                       |
| ------ | --------------------------- |
| `none` | 0                           |
| `sm`   | Token `--solaris-radius-sm` |
| `md`   | Token `--solaris-radius-md` |
| `lg`   | Token `--solaris-radius-lg` |
| `full` | Pill shape                  |

## Shape

| Shape    | Description                                     |
| -------- | ----------------------------------------------- |
| `normal` | Standard button proportions. Default            |
| `wide`   | Horizontally elongated button (wider than tall) |

## fullWidth

When `fullWidth` is `true`, the button occupies 100% of the available width. Useful for login forms, social buttons, and mobile layouts.

```html
<button solaris-button fullWidth color="primary">Entrar</button>
<button solaris-button fullWidth appearance="outline">
  <solaris-icon solaris-button-icon name="..." decorative="true" />
  Entrar com Google
</button>
```

## Loading

When `loading` is `true`:

- Interaction is blocked (equivalent to disabled)
- A `solaris-spinner` component appears before the text
  - `aria-busy="true"` is set
- The button is visually disabled
- For `<a>`, click is prevented
- Reduced motion is respected

```html
<button solaris-button [loading]="true">Salvar</button>
```

## Disabled

### On `<button>`

Uses the native `disabled` attribute. Interaction is blocked by the browser.

```html
<button solaris-button [disabled]="true">Salvar</button>
```

### On `<a>`

There is no native `disabled` attribute for anchors. The directive applies:

- `aria-disabled="true"`
- `tabindex="-1"`
- Click prevention via `preventDefault()`

```html
<a solaris-button href="/login" [disabled]="true">Entrar</a>
```

## Icons

Use the `[solaris-button-icon]` directive to add icons before or after text.

```html
<button solaris-button>
  <solaris-icon solaris-button-icon name="check" decorative="true" />
  Confirmar
</button>

<button solaris-button>
  Continuar
  <solaris-icon solaris-button-icon name="chevron-right" decorative="true" />
</button>
```

The icon directive applies the `solaris-button-icon` class for proper sizing and alignment.

### Icon via input

For a registered Solaris icon, use the `icon` input with `iconPosition` to place it before or after the text. The icon is injected into the button and padded toward the edge on the icon side.

```html
<button solaris-button icon="google">Entrar com Google</button> <button solaris-button icon="chevron-right" iconPosition="end">Continuar</button>
```

`iconPosition="start"` (default) reduces the leading padding so the icon sits close to the button edge; `iconPosition="end"` does the same on the trailing side.

### Third-party / custom SVG icons

You are not limited to icons from the Solaris registry. Any inline `<svg>` works with `[solaris-button-icon]` — just place it directly on the SVG element:

```html
<button solaris-button appearance="outline">
  <svg solaris-button-icon viewBox="0 0 16 16" fill="none">
    <path fill="#4285F4" d="..." />
    <path fill="#34A853" d="..." />
    <path fill="#FBBC04" d="..." />
    <path fill="#EA4335" d="..." />
  </svg>
  Entrar com Google
</button>
```

The SCSS targets `[solaris-button] [solaris-button-icon] svg` with `width: 100%; height: 100%`, so the SVG automatically scales to match `--solaris-button-icon-size` for the current button size.

### Provider / brand icons

The registry ships `google`, `microsoft`, `apple`, `android`, and `github` icons for social login buttons. Multi-color brand icons (Google, Microsoft, Android) keep their official brand colors; monochrome brand icons (Apple, GitHub) use `currentColor` so they adapt to the theme.

```html
<button solaris-button icon="google" appearance="outline" fullWidth>Entrar com Google</button>
```

## Accessibility

- Preserves native `<button>` and `<a>` semantics
- No unnecessary `role="button"` on `<button>` elements
- `<button>` without explicit `type` gets `type="button"` to prevent accidental form submission
- Explicit `type="submit"` or `type="reset"` is preserved
- `aria-disabled` is set on disabled/loading anchors
- `aria-busy="true"` during loading
- `focus-visible` ring is visible
- Icons should use `decorative="true"` or `aria-hidden="true"`
- Loading preserves the accessible name
- Color is never the only state indicator

## CSS Variables

The following CSS variables can be customized:

### Component tokens

```css
--solaris-button-background
--solaris-button-color
--solaris-button-border-color
--solaris-button-border-width
--solaris-button-radius
--solaris-button-padding-x
--solaris-button-padding-y
--solaris-button-height
--solaris-button-min-width
--solaris-button-gap
--solaris-button-font-size
--solaris-button-font-weight
--solaris-button-icon-size
--solaris-button-focus-ring-color
--solaris-button-hover-background
--solaris-button-active-background
--solaris-button-disabled-opacity
```

### Custom color tokens

```css
--solaris-button-custom-color
--solaris-button-custom-background
--solaris-button-custom-border-color
--solaris-button-custom-hover-background
--solaris-button-custom-hover-border-color
--solaris-button-custom-active-background
--solaris-button-custom-active-border-color
```

## Limitations (v1)

- No built-in icon-only variant — use `[solaris-icon-button]`
- No button group support — use `solaris-button-group`
- No split button support
- No segmented button support
- No toggle group support
- No toolbar group support
- No public social-button component — compose with `appearance="outline"`
- No harness created for v1

## Button Group

Use `solaris-button-group` to group related actions:

```html
<solaris-button-group aria-label="Editor actions">
  <button solaris-button>Edit</button>
  <button solaris-button>Duplicate</button>
  <button solaris-button disabled>Delete</button>
</solaris-button-group>
```

Button Group supports horizontal/vertical layout, attached/separated items, full width, badges, and icon-only buttons. The Button directive is designed to be used inside it.

## Examples

### Basic

```html
<button solaris-button>Default</button>
<button solaris-button color="primary">Primary</button>
<button solaris-button appearance="outline">Outline</button>
```

### With icon

```html
<button solaris-button>
  <solaris-icon solaris-button-icon name="check" decorative="true" />
  Confirmar
</button>
```

### Full width

```html
<button solaris-button fullWidth color="primary">Entrar</button>
```

### Loading

```html
<button solaris-button [loading]="true">Salvar</button>
```

### Disabled anchor

```html
<a solaris-button href="/dashboard" [disabled]="true">Dashboard</a>
```
