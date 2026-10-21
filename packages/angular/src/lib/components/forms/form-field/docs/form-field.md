# Solaris Form Field

## Purpose

Form Field is the visual, semantic, and accessible shell for form controls. It provides consistent layout, labeling, hint text, error messages, prefix/suffix content, and state visualisation (focused, invalid, disabled, readonly).

Form Field is part of the **Forms Release 0.2.0** and is a **recommended but not required** wrapper for form controls.

## When to use

- Grouping a form control (input, select, textarea, checkbox, radio, switch) with its label, hint, and error message.
- When you need consistent form field appearance across your application.
- When you need automatic `aria-describedby` associations between controls and their hint/error messages.
- When you need prefix or suffix content (currency symbols, icons, action buttons).

## When not to use

- For layout-only purposes without a form control.
- When you need to compose multiple independent controls inside a single Form Field (v1 supports one main control).
- Inside tight inline layouts where a label or hint is unnecessary.

## Form Field vs controls

- **Form Field** organises context: label, hint, error, prefix, suffix, states.
- **Controls** (Input, Textarea, Select, etc.) collect values.
- **Error** communicates validation.

Controls should work standalone without Form Field, but the complete experience (label, hint, error, prefix, suffix, visual states, `aria-describedby`) requires Form Field.

## One control per Form Field

Form Field v1 supports **one main control**.

If multiple controls are placed inside, a warning is emitted in development. Production does not break, but behavior is not officially supported.

## No control inside Form Field

Using Form Field without a form control is **incorrect usage**.

In development, a clear warning is emitted. In production, the component renders safely without breaking.

Implementation makes every effort to prevent this through documentation, tests, and examples.

## API

### SolarisFormFieldComponent

Selector: `solaris-form-field`

#### Inputs

| Input              | Type                                     | Default     | Description                                                   |
| ------------------ | ---------------------------------------- | ----------- | ------------------------------------------------------------- |
| `label`            | `string`                                 | `''`        | Label text                                                    |
| `labelKey`         | `string`                                 | —           | Translation key for label                                     |
| `hint`             | `string`                                 | `''`        | Hint text                                                     |
| `hintKey`          | `string`                                 | —           | Translation key for hint                                      |
| `error`            | `string`                                 | `''`        | Error text                                                    |
| `errorKey`         | `string`                                 | —           | Translation key for error                                     |
| `required`         | `boolean \| undefined`                   | —           | Required state (marker + native propagation)                  |
| `optional`         | `boolean`                                | `false`     | Shows optional marker                                         |
| `optionalLabel`    | `string`                                 | —           | Custom optional label text                                    |
| `optionalLabelKey` | `string`                                 | —           | Translation key for optional label                            |
| `requiredLabel`    | `string`                                 | —           | Custom required label text                                    |
| `requiredLabelKey` | `string`                                 | —           | Translation key for required label                            |
| `invalid`          | `boolean \| undefined`                   | —           | Manual invalid state (overrides auto-detection)               |
| `disabled`         | `boolean \| undefined`                   | —           | Manual disabled state (overrides auto-detection)              |
| `readonly`         | `boolean \| undefined`                   | —           | Manual readonly state (overrides auto-detection)              |
| `appearance`       | `'outline' \| 'surface' \| 'filled'`     | `'outline'` | Visual style                                                  |
| `size`             | `'sm' \| 'md' \| 'lg'`                   | `'md'`      | Control size (outer height follows the size × density matrix) |
| `density`          | `'compact' \| 'normal' \| 'comfortable'` | inherited   | Spacing density                                               |
| `radius`           | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'`      | Border radius                                                 |
| `prefix`           | `SolarisIconName`                        | —           | Prefix icon rendered in the leading affix slot                |
| `suffix`           | `SolarisIconName`                        | —           | Suffix icon rendered in the trailing affix slot               |
| `loading`          | `boolean`                                | `false`     | Shows a spinner in the suffix slot, suppresses suffix content |
| `loadingLabel`     | `string`                                 | —           | Accessible label for the loading spinner                      |
| `loadingLabelKey`  | `string`                                 | —           | Translation key for the loading spinner label                 |

### SolarisFormLabelComponent

Selector: `solaris-form-label`

Projected content component for custom label markup.

### SolarisFormHintComponent

Selector: `solaris-form-hint`

Projected content component for custom hint markup.

### SolarisFormErrorComponent

Selector: `solaris-form-error`

Projected content component for custom error markup. Has `role="alert"`.

### SolarisFormPrefixDirective

Selector: `[solaris-form-prefix]`

Attribute directive for prefix content (text, icon, button).

### SolarisFormSuffixDirective

Selector: `[solaris-form-suffix]`

Attribute directive for suffix content (text, icon, button).

### SolarisFormSuffixActionDirective

Selector: `[solaris-form-suffix-action]`

Attribute directive for non-square suffix actions (e.g. a CTA button).
The suffix cell switches to the `action` variant: it hugs the content
instead of keeping the standardised square, and the field sizes a nested
`[solaris-button]` to fit inside the wrapper. Combine with
`[solaris-form-suffix]` when the content is projected through a preset
field (`solaris-email-field`), so the outer wrapper still forwards it:

```html
<solaris-email-field prefix="mail">
  <button solaris-button solaris-form-suffix solaris-form-suffix-action size="sm">Register</button>
</solaris-email-field>
```

## Label

Label can be provided via input:

```html
<solaris-form-field label="Name">
  <input solaris-input />
</solaris-form-field>
```

Or via projection:

```html
<solaris-form-field>
  <solaris-form-label>Name</solaris-form-label>
  <input solaris-input />
</solaris-form-field>
```

If a projected `<solaris-form-label>` exists, it wins over the `label`/`labelKey` inputs. No duplicate label is rendered.

The label is connected to the control via `for`/`id`. If the control has no `id`, the system generates an SSR-safe ID.

### Label action

Use `[solaris-form-label-action]` to place a link or action on the same row as the label, aligned to the opposite side. This is useful for "Forgot password?" links next to a password field label.

```html
<solaris-form-field label="Password">
  <input solaris-input type="password" />
  <a solaris-form-label-action href="/forgot-password">Forgot password?</a>
</solaris-form-field>
```

The action is placed at the end of the label row (pushed to the right via `margin-inline-start: auto`) and kept on the same line as the label. The same slot is forwarded by the preset fields (`solaris-email-field`, `solaris-password-field`, `solaris-select`, `solaris-multi-select`).

## Hint

Hint can be provided via input:

```html
<solaris-form-field label="Password" hint="Use at least 12 characters.">
  <input solaris-input type="password" />
</solaris-form-field>
```

Or via projection:

```html
<solaris-form-field label="Password">
  <input solaris-input type="password" />
  <solaris-form-hint>Use at least 12 characters.</solaris-form-hint>
</solaris-form-field>
```

If a projected `<solaris-form-hint>` exists, it wins over `hint`/`hintKey`.

## Error

Error can be provided via input:

```html
<solaris-form-field label="Email" error="Enter a valid email.">
  <input solaris-input />
</solaris-form-field>
```

Or via projection:

```html
<solaris-form-field label="Email">
  <input solaris-input />
  <solaris-form-error>Enter a valid email.</solaris-form-error>
</solaris-form-field>
```

If a projected `<solaris-form-error>` exists, it wins over `error`/`errorKey`.

## Priority rules (input vs projection)

1. Projected `<solaris-form-label>` wins over `label`/`labelKey`.
2. Projected `<solaris-form-hint>` wins over `hint`/`hintKey`.
3. Projected `<solaris-form-error>` wins over `error`/`errorKey`.
4. Manual `invalid` wins over automatic detection.

## Required / Optional

- `required=true`: renders a `*` marker next to an inline label (decorative,
  `aria-hidden`) and propagates `required` to the native control, mirroring
  the checkbox/radio required indicator. A native `required` attribute on
  the projected control is auto-detected and renders the marker too.
- `optional=true`: renders a visible "(optional)" marker instead; it wins
  over the required marker when both are set.

## Prefix / Suffix

Use `prefix` / `suffix` inputs for icons, or `[solaris-form-prefix]` /
`[solaris-form-suffix]` for any projected content (text, icon, button).

Icons via inputs:

```html
<solaris-form-field label="Search" prefix="search">
  <input solaris-input />
</solaris-form-field>
```

Projected content (text, buttons, anything):

```html
<solaris-form-field label="Search">
  <solaris-icon solaris-form-prefix name="search" decorative="true" />
  <input solaris-input />
</solaris-form-field>

<solaris-form-field label="Value">
  <span solaris-form-prefix>R$</span>
  <input solaris-input />
  <span solaris-form-suffix>BRL</span>
</solaris-form-field>
```

Accepts (via projection):

- text
- icon
- button
- any projected content

Affix cells are standardised squares (`--solaris-form-field-affix-size`,
derived from the size × density matrix), so every icon occupies the same
area. The prefix cell carries a divider towards the control; the suffix
cell has no divider. Longer text (e.g. `USD`) keeps the square as a minimum
and grows past it instead of overflowing.

For rectangular actions such as a CTA button, use
`[solaris-form-suffix-action]` instead: the cell switches to the `action`
variant and sizes the button to fit. Prefer a button one size step below
the field (field `md` → button `sm`).

## Loading

Set `[loading]="true"` to render a spinner in the suffix slot while async
work runs (e.g. validating a postal code). Loading suppresses any other
suffix content, renders a square overlay at the suffix position, and sets
`aria-busy="true"` on the field. The overlay takes no layout space, so
toggling `loading` never changes the field width; the input reserves text
space on the right instead. The spinner size follows the field size (`sm`/`md` → spinner `sm`,
`lg` → spinner `md`). Pass `loadingLabel`/`loadingLabelKey` for a custom
accessible name; otherwise the spinner falls back to its default label.

```html
<solaris-form-field label="Postal code" [loading]="true">
  <input solaris-input formControlName="postalCode" />
</solaris-form-field>
```

Preset fields (`solaris-email-field`, `solaris-password-field`, …) forward
`loading` in their own refactor lot; until then, use `solaris-form-field`
directly for loading states.

## Appearances

| Value     | Description                                                            |
| --------- | ---------------------------------------------------------------------- |
| `outline` | Clear border, neutral background. Default, good for traditional forms. |
| `surface` | Card/panel surface, subtle border.                                     |
| `filled`  | Subtle filled background, modern style.                                |

## Density

| Value         | Description                             |
| ------------- | --------------------------------------- |
| `compact`     | Reduced vertical spacing and typography |
| `normal`      | Balanced vertical spacing. Default      |
| `comfortable` | Increased vertical spacing              |

## Sizes

Form Field owns the control height. `size` (`sm | md | lg`, default `md`)
combined with `density` selects one of the 9 `--solaris-control-height-*`
tokens, so the outer height always matches the matrix:

| Size | compact | normal | comfortable |
| ---- | ------- | ------ | ----------- |
| `sm` | 28px    | 36px   | 44px        |
| `md` | 32px    | 40px   | 48px        |
| `lg` | 36px    | 44px   | 52px        |

Wrapper controls (`select`, `multi-select`, `email-field`, `password-field`,
`phone-field`, `date-picker`, `otp-input`) expose the same `size` input and
forward it to the inner Form Field together with the effective density.

Projected `solaris-input` / `solaris-textarea` controls inherit `size` and
`density` from the enclosing field through `SOLARIS_FORM_FIELD` (own input
→ field → default). Explicit inputs on the control always win, and
standalone controls keep their own defaults (`md` / theme density).

A projected `solaris-input` renders with zero vertical padding inside the
field: the wrapper owns the full vertical rhythm (text is vertically
centred), so the outer box matches the matrix token exactly in every
combination the text line fits.

### Textarea controls

When the projected control is a `textarea`, the host reports
`data-control-type="textarea"` and owns the minimum height while the
textarea delegates to it (`height: auto`, `min-height: 0`). The `resize`
input (`none | vertical | horizontal | both`, default `vertical`) is
reflected as `data-control-resize`; `horizontal` and `both` resize the
wrapper so no second handle appears on the textarea.

## Radius

| Value  | Description                   |
| ------ | ----------------------------- |
| `none` | Sharp corners                 |
| `sm`   | Small rounding (2px). Default |
| `md`   | Medium rounding (8px)         |
| `lg`   | Pill shape                    |

Fields use their own radius scale (`md` maps to the 8px token, `lg`
renders as a pill) so `sm` and `md` stay visually distinct. Other
components keep the global scale.

## CSS Variables

General component tokens available for advanced customization:

| Token                                       | Purpose                            |
| ------------------------------------------- | ---------------------------------- |
| `--solaris-form-field-focus-ring-width`     | Focus ring width                   |
| `--solaris-form-field-focus-ring-color`     | Focus ring color                   |
| `--solaris-form-field-control-color`        | Control text color                 |
| `--solaris-form-field-control-radius`       | Control border radius              |
| `--solaris-form-field-control-height`       | Control wrapper height             |
| `--solaris-form-field-control-gap`          | Gap inside control wrapper         |
| `--solaris-form-field-control-padding-x`    | Control wrapper horizontal padding |
| `--solaris-form-field-control-background`   | Control wrapper background         |
| `--solaris-form-field-control-border-color` | Control wrapper border color       |
| `--solaris-form-field-control-border-width` | Control wrapper border width       |
| `--solaris-form-field-affix-size`           | Square prefix/suffix cell size     |
| `--solaris-form-field-action-inset`         | Vertical inset of suffix actions   |
| `--solaris-form-field-readonly-background`  | Readonly background                |
| `--solaris-form-field-disabled-opacity`     | Disabled opacity                   |
| `--solaris-form-field-label-color`          | Label text color                   |
| `--solaris-form-field-label-font-size`      | Label font size                    |
| `--solaris-form-field-label-font-weight`    | Label font weight                  |
| `--solaris-form-field-label-margin-bottom`  | Margin below label                 |
| `--solaris-form-field-hint-color`           | Hint text color                    |
| `--solaris-form-field-hint-font-size`       | Hint font size                     |
| `--solaris-form-field-error-color`          | Error text color                   |
| `--solaris-form-field-error-font-size`      | Error font size                    |
| `--solaris-form-field-error-border-color`   | Invalid border color               |
| `--solaris-form-field-message-margin-top`   | Margin above hint/error row        |
| `--solaris-form-field-prefix-color`         | Prefix content color               |
| `--solaris-form-field-suffix-color`         | Suffix content color               |
| `--solaris-form-field-optional-color`       | Optional marker color              |
| `--solaris-form-field-optional-font-size`   | Optional marker font size          |
| `--solaris-form-field-font-size`            | Base font size                     |

## States

### Focused

When the internal control is focused, the Form Field reflects the focused state with a focus ring using the primary token (border color plus a `box-shadow` ring at `--solaris-form-field-focus-ring-width`). While invalid and focused, the ring uses the danger token.

### Invalid

Automatic detection (with Angular Forms):

```
control.invalid && (control.touched || control.dirty) && !control.focused
```

Manual: `[invalid]="true"` overrides auto-detection.

Error does **not** appear while the control is focused. This prevents shouting at the user while they are still correcting.

### Disabled

Visual: reduced contrast, non-interactive appearance. Does not hide label/hint/error.

### Readonly

Visual: indicates value is not editable. Preserves readability. Does not look disabled.

## Integration with Angular Forms

Form Field reads `NgControl` when available. It automatically detects:

- `invalid`
- `touched`
- `dirty`
- `focused` (via event listeners)

Manual state (`[invalid]`, `[disabled]`, `[readonly]`) overrides automatic detection.

Template-driven forms are compatible but Reactive Forms are the primary target.

## IDs and aria-describedby

Form Field automatically orchestrates:

- Control `id` (preserves consumer-provided ID or generates SSR-safe one)
- Label `for`/`id`
- Hint `id`
- Error `id`
- Control `aria-describedby`

Rules:

- Hint visible → included in `aria-describedby`
- Error visible → included in `aria-describedby`
- No duplicate IDs
- No non-existent IDs
- When error replaces hint visually, `aria-describedby` reflects the visible content

## Accessibility

- Label is associated with the control via `for`/`id` or `aria-labelledby`.
- Hint/error are associated via `aria-describedby`.
- Wrapper is **not** focusable.
- Wrapper does **not** have `role="button"`.
- Tab order is **not** altered.
- Error is communicated with both colour and text (not colour-only).
- Optional marker is accessible.
- Interactive suffix (e.g. icon button) remains focusable.
- Decorative prefix/suffix do not pollute the accessible name.

## Examples

```html
<!-- Basic -->
<solaris-form-field label="Name">
  <input solaris-input formControlName="name" />
</solaris-form-field>

<!-- Appearance variants -->
<solaris-form-field label="Outline" appearance="outline">
  <input solaris-input />
</solaris-form-field>
<solaris-form-field label="Surface" appearance="surface">
  <input solaris-input />
</solaris-form-field>
<solaris-form-field label="Filled" appearance="filled">
  <input solaris-input />
</solaris-form-field>

<!-- Hint and error -->
<solaris-form-field label="Password" hint="Use at least 12 characters." error="This field is required.">
  <input solaris-input type="password" formControlName="password" />
</solaris-form-field>

<!-- Prefix and suffix -->
<solaris-form-field label="Search">
  <solaris-icon solaris-form-prefix name="search" decorative="true" />
  <input solaris-input formControlName="search" />
</solaris-form-field>
<solaris-form-field label="Value">
  <span solaris-form-prefix>R$</span>
  <input solaris-input formControlName="amount" />
  <span solaris-form-suffix>BRL</span>
</solaris-form-field>

<!-- Projected label and hint -->
<solaris-form-field>
  <solaris-form-label>Email</solaris-form-label>
  <input solaris-input type="email" formControlName="email" />
  <solaris-form-hint>We never share your email.</solaris-form-hint>
</solaris-form-field>
```

## Limitations (v1)

- One main control per Form Field.
- No automatic validation messages by validator type.
- No global form container.
- No glass appearance.
- No `xl` or `full` radius for form fields (use `md` or `lg`).
- Prefix/suffix action content uses `[solaris-form-suffix-action]` (rectangular variant of the suffix cell).
- `aria-describedby` does not update dynamically for projected content in all edge cases.

## Upcoming components in Forms Release

- Input
- Textarea
- Checkbox
- Radio
- Switch
- Select
