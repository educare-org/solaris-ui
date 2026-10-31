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
| `size`            | `SolarisButtonSize`       | `'md'`                  | Control size (`sm` \| `md` \| `lg`)     |
| `radius`          | `SolarisButtonRadius`     | `'md'`                  | Border radius                           |
| `density`         | `SolarisButtonDensity`    | inherited or `'normal'` | Height, padding, and typography scale   |
| `shape`           | `SolarisButtonShape`      | `'normal'`              | Button proportions (`normal` \| `wide`) |
| `loading`         | `boolean`                 | `false`                 | Loading state                           |
| `disabled`        | `boolean`                 | `false`                 | Disabled state                          |
| `action`          | `() => Promise<unknown>`  | —                       | Async action (pending disables + loads) |
| `pressed`         | `boolean \| undefined`    | `undefined`             | Toggle state (`aria-pressed` when set)  |
| `fullWidth`       | `boolean`                 | `false`                 | Full width                              |
| `loadingLabel`    | `string`                  | —                       | Accessible label during loading         |
| `loadingLabelKey` | `string`                  | —                       | i18n key for loading label              |
| `ariaLabel`       | `string`                  | —                       | Accessible label (idle, no loading)     |
| `ariaLabelKey`    | `string`                  | —                       | i18n key for accessible label           |
| `icon`            | `SolarisIconName`         | —                       | Icon rendered inside the button         |
| `iconPosition`    | `'start' \| 'end'`        | `'start'`               | Whether the icon sits before or after   |

### Outputs

| Output          | Type      | Description                       |
| --------------- | --------- | --------------------------------- |
| `actionSuccess` | `unknown` | Emitted with the `action` result  |
| `actionError`   | `unknown` | Emitted with the `action` failure |

### Types

```typescript
type SolarisButtonSize = 'sm' | 'md' | 'lg';
type SolarisButtonAppearance = 'solid' | 'outline' | 'ghost' | 'tonal' | 'surface';
type SolarisButtonColor = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'custom';
type SolarisButtonRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';
type SolarisButtonDensity = 'compact' | 'normal' | 'comfortable';
type SolarisButtonShape = 'normal' | 'wide';
type SolarisButtonIconPosition = 'start' | 'end';
```

## Appearances

| Appearance | Use case                                  | Visual                                                             |
| ---------- | ----------------------------------------- | ------------------------------------------------------------------ |
| `solid`    | Primary action, CTA, destructive action   | Filled background, high weight                                     |
| `outline`  | Secondary action                          | Transparent background, visible border                             |
| `ghost`    | Toolbar, dense context, low-weight action | No background or border, subtle hover                              |
| `tonal`    | Action with semantics, medium emphasis    | Soft background, subtle border                                     |
| `surface`  | Low emphasis, inline with content         | Muted background, no border                                        |
| `gradient` | Hero CTA, highest emphasis                | `135deg` ramp (duotone where it stays accessible, depth otherwise) |

### Hover and active

Low-emphasis appearances (`ghost`, `tonal`, `surface`) stay within their own
color family on hover and on press — a surface tint for `ghost`, a stronger border for
`tonal`, a hairline border for `surface` — instead of jumping to the solid
backgrounds. Text keeps the `*-text` token on hover and on press, so quick
clicks never flash an inverted fill. Only `solid` and `outline` commit to the
solid `active` background on press (`:active`, `data-pressed`). Only `neutral`
`solid`/`outline` invert on hover/active, keeping docs
and dense headers quiet.

### Gradient

`appearance="gradient"` crosses with every `color`: the background is
`linear-gradient(135deg, from, to)` where `from` is the `solid` stop of the
color family. `to` is either the `solid` stop of a partner hue
(`primary` → `violet`, `success` → `info`) or the deepest same-hue stop
that keeps text contrast (`warning` → `solid-active`,
`danger` → `solid-deep`, `info` → `foreground`,
`neutral`: `inverse` → `text-secondary`). Same-hue depth is used where a
cross-hue partner would shift identity (red turning pink, yellow turning
green) or break text contrast (dark warning text over orange). Text, border, and focus-ring mirror `solid`, so the accessible name
channel is unchanged. Hover shifts the first stop toward press
(`solid-hover` → deepest stop); press holds the deepest pair under the
standard `0.99` press scale. The angle is a single
documented constant (`135deg`); per-color choice of partner is documented
below. Gradient never animates its stops (no `background-image` transition),
so reduced motion needs no extra guard beyond the shared press-scale rule.
Inside an attached `solaris-button-group`, gradient follows the P1 group rule
(`transform: none` press, no own border).

| Color     | `from` (rest)     | `to` (partner rest)      | Text (`on-solid`)      | Contrast text×from | Contrast text×to |
| --------- | ----------------- | ------------------------ | ---------------------- | ------------------ | ---------------- |
| `neutral` | `neutral-inverse` | `neutral-text-secondary` | `neutral-text-inverse` | 17.62              | 6.41             |
| `primary` | `primary-solid`   | `violet-solid`           | `primary-on-solid`     | 5.79               | 5.71             |
| `success` | `success-solid`   | `info-solid`             | `success-on-solid`     | 3.20               | 5.34             |
| `warning` | `warning-solid`   | `warning-solid-active`   | `warning-on-solid`     | 11.53              | 7.39             |
| `danger`  | `danger-solid`    | `danger-solid-deep`      | `danger-on-solid`      | 4.83               | 10.37            |
| `info`    | `info-solid`      | `info-foreground`        | `info-on-solid`        | 5.34               | 9.08             |

Ratios measured on the light theme. Every idle pair meets 4.5:1 for text
except `success` rest (3.20), which inherits the existing `solid` pairing
verbatim — the gradient is never worse than `solid` at rest because `from` is
`solid` and `to` is a partner of equal or darker weight. `neutral` and
`warning`/`danger`/`info` gradients are monochrome by design (same-hue depth
instead of a hue shift), so the button keeps its semantic color: red stays
red, yellow stays yellow, blue stays blue.

#### Custom gradient

```css
.my-gradient-button {
  --solaris-button-gradient-from: var(--solaris-violet-solid);
  --solaris-button-gradient-to: var(--solaris-primary-solid-active);
  --solaris-button-gradient-hover-from: var(--solaris-violet-solid-hover);
  --solaris-button-gradient-hover-to: var(--solaris-primary-solid-active);
  --solaris-button-gradient-active-from: var(--solaris-violet-solid-active);
  --solaris-button-gradient-active-to: var(--solaris-violet-solid-active);
}
```

```html
<button solaris-button appearance="gradient" color="custom" class="my-gradient-button">Custom</button>
```

Without these variables, `gradient` + `custom` falls back to the flat
`custom` solid (both stops default to the `custom` backgrounds), so the
button stays readable instead of rendering a broken gradient.

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

## Sizes

| Size | Height source (normal density) | Font |
| ---- | ------------------------------ | ---- |
| `sm` | `normal-sm` (36px)             | `xs` |
| `md` | `normal-md` (40px, default)    | `sm` |
| `lg` | `normal-lg` (44px)             | `md` |

Size combines with density into a 3×3 matrix. The rendered outer height
always equals `--solaris-control-height-<density>-<size>`:

|      | `compact`   | `normal`    | `comfortable` |
| ---- | ----------- | ----------- | ------------- |
| `sm` | 28px        | 36px        | 44px          |
| `md` | 32px (base) | 40px (base) | 48px (base)   |
| `lg` | 36px        | 44px        | 52px          |

`md` is the base of each density and aligns with sibling controls that
consume `--solaris-density-min-height`. Always reference the token of your
own combination (e.g. `normal-sm`, never `compact-lg`).

## Density

| Density       | Effect                                       |
| ------------- | -------------------------------------------- |
| `compact`     | Reduced height, padding, gap, and typography |
| `normal`      | Balanced height and spacing. Default         |
| `comfortable` | Increased height, padding, and typography    |

Density is inherited from the theme when not explicitly set. Fallback is `normal`.
The host exposes `data-size` and `data-density` (effective) attributes.

### `data-*` attributes as inputs (SSR-safe)

Every variant input also accepts its `data-*` attribute form
(`data-size`, `data-density`, `data-appearance`, `data-color`, `data-shape`,
`data-radius`). The attribute wins over the same-named input and, inside a
`solaris-button-group`, the group still wins over both. Prefer the attribute
form in server-rendered HTML: it paints correctly with CSS alone, before
hydration runs, avoiding a flash of default variants on reload.

### Post-hydration transitions (`data-hydrated`)

Color, background, border, shadow, and filter transitions are enabled only
once the directive stamps `data-hydrated` (browser-only, in
`afterNextRender` — never rendered on the server, so SSR hydration cannot
diverge on it). The initial paint always applies with `transition: none`:
no appearance/color/size/density change animates from the neutral base.
When `data-size` is present but `data-density` has not resolved yet (theme
CSS still loading, group context attaching), normal-density geometry is
assumed so the resolved density lands without a jump.

### Press and width motion

Press feedback uses dedicated tokens (`--solaris-button-scale-active` /
`--solaris-icon-button-scale-active`, `0.99`) — subtler than the global
`--solaris-motion-scale-active` (`0.97`).

Width-affecting content changes (loading spinner, badge slot, label swap)
animate fluidly via FLIP in `SolarisButtonHostBase`: a `MutationObserver`
(`childList` + `characterData`) flags content edits and a `ResizeObserver`
interpolates the resulting width delta with WAAPI (`motion-normal` /
`standard` easing, read from the tokens at runtime). The host sets
`data-width-animating` for the animation and removes it on `finish`/`cancel`.
While present, the host clips with `overflow: hidden` + `nowrap`, keeps
children at `flex-shrink: 0`, and fades content via `opacity` on the same
duration/easing. `width` layout animation is intentional here: the computed
`width` stays `auto`, so CSS `transition: width` never fires and WAAPI is the
only way to interpolate the used width. Container-driven changes (window
resize, font load, density switch) only re-sync the baseline, and `fullWidth`
buttons plus attached `solaris-button-group` members skip the animation. The
loading spinner additionally enters with `solaris-motion-pop-in`
(`normal` / `decelerate`). Reduced motion (`prefers-reduced-motion` or
`data-reduced-motion="true"`) disables the width animation, the content fade,
the spinner animation, and the press scale.

Inside an attached `solaris-button-group`, the button carries
`data-group="horizontal"` (or `"vertical"`, from the group context). That
attribute scopes the attached styling (square middle, flush edge radius,
divider, hover lift) to group members only, so standalone buttons are
never affected.

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

## Pressed (toggle)

Set `pressed` to turn the button into a toggle (Radix Toggle parity):

```html
<button solaris-button [pressed]="isFavorite">Favorite</button>
```

- `pressed="true"` sets `data-pressed` (active-background treatment — subtle for
  `ghost`/`tonal`/`surface`, solid for `solid`/`outline`) and
  `aria-pressed="true"`.
- `pressed="false"` sets `aria-pressed="false"` (announced as unpressed).
- When `pressed` is unset, no `aria-pressed` is rendered — the button is a
  plain action, not a toggle.

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

## Async action

Pass an async function via `action`. While it runs, the button enters an
internal `pending` state: effective loading is `manual || pending`, the
effective disabled state includes `pending`, `aria-busy="true"` is set, and a
second click is discarded. On success the button emits `actionSuccess` with
the result; on failure it resets, restores focus to the button, and emits
`actionError` with the error. A manual `loading="true"` still wins and is not
cleared when the action settles. The action never runs on the server and the
initial pending state is always `false`.

```html
<button solaris-button [action]="save" (actionSuccess)="onSaved($event)" (actionError)="onFailed($event)">Save</button>
```

On `<a>` with `href`, the directive calls `preventDefault()` before running
the action, so the navigation does not race the async work:

```html
<a solaris-button href="/report" [action]="exportReport">Export</a>
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
- Icon-only content without text logs a dev-mode warning: add an `aria-label`
  or use `[solaris-icon-button]` instead
- `pressed` toggle buttons expose `aria-pressed` (only when `pressed` is set)
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

### Gradient tokens

```css
--solaris-button-gradient-from
--solaris-button-gradient-to
--solaris-button-gradient-hover-from
--solaris-button-gradient-hover-to
--solaris-button-gradient-active-from
--solaris-button-gradient-active-to
```

## Limitations (v1)

- No built-in icon-only variant — use `[solaris-icon-button]`
  (a dev-mode warning guards text-less `solaris-button` without `aria-label`)
- No button group support — use `solaris-button-group`
- No split button support (follow-up)
- No segmented button support
- No toggle group support (single-button `pressed` toggle is supported)
- No toolbar group support
- No public social-button component — compose with `appearance="outline"` (follow-up)
- No badge/count slot parity with `icon-button-badge` (follow-up)
- No harness created for v1 (follow-up)

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
