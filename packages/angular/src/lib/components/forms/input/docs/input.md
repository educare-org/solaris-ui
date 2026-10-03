# Solaris Input

## Purpose

Input is a styling and integration directive for native `<input>` text-like elements.

## Why a directive

Input is a directive, not a component, because:

- `<input>` is a native void element that cannot contain children;
- a component wrapper would create unnecessary DOM;
- native semantics, focus, value, and form behavior are preserved;
- Angular Forms integration works naturally via the native `ControlValueAccessor`.

## Host selector

```
[solaris-input]
```

## Host restriction

`[solaris-input]` must be used on `<input>` elements only.

Applying it to other elements generates a development warning and is unsupported.

## Supported types

- `text`
- `email`
- `password`
- `search`
- `tel`
- `url`
- `number`
- `date`
- `time`
- `datetime-local`
- `month`
- `week`

## Unsupported types

- `file`
- `color`
- `range`
- `checkbox`
- `radio`
- `submit`
- `button`
- `reset`
- `image`
- `hidden`

Using an unsupported type generates a development warning. In production, no crash occurs.

## Standalone usage

```html
<input solaris-input placeholder="Nome" />

<input solaris-input type="email" placeholder="email@empresa.com" />

<input solaris-input type="password" />
```

When standalone, the input has its own visual shell: border, background, padding, radius, focus ring, disabled state, readonly state, and manual invalid state.

## Recommended usage with Form Field

```html
<solaris-form-field label="E-mail">
  <input solaris-input type="email" formControlName="email" />
</solaris-form-field>
```

When inside Form Field, the visual shell is managed by Form Field. The input keeps text, caret, selection, placeholder, and native behavior. Avoid double border and focus ring by letting Form Field control the shell.

## Form Field integration

Input extends `SolarisFormControl` and registers with Form Field when projected inside it.

The contract provides:

| Property/Method     | Purpose                                        |
| ------------------- | ---------------------------------------------- |
| `id`                | Control ID for label association               |
| `focused`           | Focus state                                    |
| `disabled`          | Disabled state                                 |
| `readonly`          | Readonly state                                 |
| `invalid`           | Invalid state                                  |
| `required`          | Required state                                 |
| `setDescribedByIds` | Receives hint/error IDs for `aria-describedby` |
| `focus()`           | Programmatic focus                             |

## API

### Appearance

- `outline` (default): visible border, field background, clear focus and error.
- `surface`: lighter, for cards and panels.
- `filled`: subtle filled background, less dominant border.

### Size

- `sm`
- `md` (default)
- `lg`

Standalone, `size` combined with `density` selects one of the 9
`--solaris-control-height-*` tokens for the input height:

| Size | compact | normal | comfortable |
| ---- | ------- | ------ | ----------- |
| `sm` | 28px    | 36px   | 44px        |
| `md` | 32px    | 40px   | 48px        |
| `lg` | 36px    | 44px   | 52px        |

Inside `solaris-form-field`, the wrapper owns the outer height and the
input delegates to it (`height: auto`, only density padding applies).
Keep `size` in sync on both so font and padding match the wrapper height.

### Density

- `compact`: reduced height and padding
- `normal`: balanced spacing (theme default)
- `comfortable`: more breathing space

When omitted, density is inherited from the theme.

### Radius

- `none` (sharp corners)
- `sm` (2px, default)
- `md` (8px)
- `lg` (pill)

Fields use their own radius scale: `md` maps to the 8px token and `lg`
renders as a pill, so `sm` and `md` stay visually distinct.

### Full width

`fullWidth` defaults to `true`. The input fills available width.

### Invalid manual

```html
<input solaris-input [invalid]="true" />
```

Manual invalid overrides automatic detection. When inside Form Field, error visibility follows the Form Field contract.

### Disabled

Preserves native `disabled` attribute. Inside Form Field, the shell also reflects disabled state when possible.

### Readonly

Preserves native `readonly` attribute. Readonly is visually distinct from disabled: better contrast, no disabled opacity, still readable.

### Required

Preserves native `required` attribute. Optional marker is a Form Field responsibility.

## CSS Variables

General component tokens available for advanced customization. These apply to the standalone input shell (inside Form Field, the shell is managed by Form Field):

| Token                                  | Purpose                |
| -------------------------------------- | ---------------------- |
| `--solaris-input-radius`               | Border radius          |
| `--solaris-input-height`               | Input height           |
| `--solaris-input-color`                | Text color             |
| `--solaris-input-padding-x`            | Horizontal padding     |
| `--solaris-input-padding-y`            | Vertical padding       |
| `--solaris-input-font-size`            | Font size              |
| `--solaris-input-line-height`          | Line height            |
| `--solaris-input-background`           | Background color       |
| `--solaris-input-border-color`         | Border color           |
| `--solaris-input-border-width`         | Border width           |
| `--solaris-input-placeholder-color`    | Placeholder text color |
| `--solaris-input-focus-ring-color`     | Focus ring color       |
| `--solaris-input-invalid-border-color` | Invalid border color   |
| `--solaris-input-disabled-opacity`     | Disabled opacity       |
| `--solaris-input-readonly-background`  | Readonly background    |

## Placeholder

Placeholder must not replace a label. Documented anti-pattern:

```html
<!-- Avoid -->
<input solaris-input placeholder="E-mail" />

<!-- Prefer -->
<solaris-form-field label="E-mail">
  <input solaris-input placeholder="nome@empresa.com" />
</solaris-form-field>
```

## Password

Input supports `type="password"` as a native field. No password toggle is built into Input v1.

For show/hide password, use Form Field composition:

```html
<solaris-form-field label="Senha">
  <input solaris-input type="password" />
  <button solaris-icon-button solaris-form-suffix aria-label="Mostrar senha">
    <solaris-icon name="eye" [decorative]="true" />
  </button>
</solaris-form-field>
```

## Search

Input supports `type="search"` as a native field. No automatic clear button is built into Input v1.

## Number / Date / Time

Input supports native number and date/time types. Native controls and affordances are preserved. Do not promise identical appearance across browsers.

## Angular Forms

Input does not create a custom `ControlValueAccessor`. Angular integrates with `<input>` natively. The directive reads `NgControl` for state detection and Form Field integration.

Compatible with:

- `formControl`
- `formControlName`
- `ngModel`
- Reactive Forms validators
- Disabled state via Angular Forms

## Autofill / Autocomplete

Input does not block autofill or autocomplete. CSS handles autofill states to keep text legible.

## Accessibility

- Native `<input>` semantics are preserved.
- `aria-invalid` is set when invalid.
- `aria-describedby` is orchestrated with Form Field.
- `focus-visible` is not removed.
- Disabled and readonly are real, not visual-only.
- Placeholder is not treated as a label.

## Examples

```html
<!-- Basic -->
<input solaris-input placeholder="Your name" />

<!-- Types -->
<input solaris-input type="email" placeholder="name@company.com" />
<input solaris-input type="password" />

<!-- Appearance variants -->
<input solaris-input appearance="outline" placeholder="Outline" />
<input solaris-input appearance="surface" placeholder="Surface" />
<input solaris-input appearance="filled" placeholder="Filled" />

<!-- Sizes and radius -->
<input solaris-input size="sm" radius="sm" placeholder="Small" />
<input solaris-input size="md" radius="md" placeholder="Medium" />
<input solaris-input size="lg" radius="lg" placeholder="Large" />

<!-- States -->
<input solaris-input [invalid]="true" placeholder="Invalid" />
<input solaris-input disabled placeholder="Disabled" />
<input solaris-input readonly value="Readonly" />

<!-- Form Field integration -->
<solaris-form-field label="Email">
  <input solaris-input type="email" formControlName="email" />
</solaris-form-field>

<!-- Reactive Forms and template-driven forms -->
<input solaris-input [formControl]="nameControl" placeholder="Name" />
<input solaris-input [(ngModel)]="search" placeholder="Search" />
```

## Limitations of Input v1

- Not a Textarea.
- Not a Select.
- Not a Datepicker.
- Not a File Input.
- No mask, formatter, or parser.
- No password toggle.
- No clear button.
- No currency/money input.
- Placeholder does not replace label.
- When inside Form Field, the shell is managed by Form Field.
- Standalone, Input has its own shell.
