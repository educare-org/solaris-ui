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

- `sm`: 2rem height
- `md` (default): 2.5rem height
- `lg`: 3rem height

Controls height, padding, font-size, and line-height.

### Density

- `compact`: reduced height and padding
- `comfortable` (fallback default): more breathing space

### Radius

- `none`
- `sm`
- `md` (default)
- `lg`

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
