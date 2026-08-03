# Solaris Textarea

## Purpose

Textarea is a styling and integration directive for native `<textarea>` elements.

## Why a directive

Textarea is a directive, not a component, because:

- `<textarea>` is a native element with built-in form integration, selection, keyboard behavior, resize, and accessibility;
- a component wrapper would create unnecessary DOM;
- native semantics, focus, value, and form behavior are preserved;
- Angular Forms integration works naturally via the native `ControlValueAccessor`.

## Host selector

```
[solaris-textarea]
```

## Host restriction

`[solaris-textarea]` must be used on `<textarea>` elements only.

Applying it to other elements generates a development warning and is unsupported.

## Standalone usage

```html
<textarea solaris-textarea placeholder="Descrição"></textarea>

<textarea solaris-textarea rows="4" placeholder="Observações"></textarea>

<textarea solaris-textarea placeholder="Descrição" [invalid]="true"></textarea>
```

When standalone, the textarea has its own visual shell: border, background, padding, radius, focus ring, disabled state, readonly state, and manual invalid state.

## Recommended usage with Form Field

```html
<solaris-form-field label="Descrição" hint="Informe uma descrição objetiva.">
  <textarea solaris-textarea></textarea>
</solaris-form-field>
```

When inside Form Field, the visual shell is managed by Form Field. The textarea keeps text, caret, selection, placeholder, and native behavior. Avoid double border and focus ring by letting Form Field control the shell.

## Form Field integration

Textarea extends `SolarisFormControl` and registers with Form Field when projected inside it.

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

- `sm`: compact padding and font-size
- `md` (default): comfortable padding and font-size
- `lg`: spacious padding and font-size

Controls padding, font-size, line-height, and min-height.

### Density

- `compact`: reduced padding and line-height
- `comfortable` (fallback default): more breathing space

### Radius

- `none`
- `sm`
- `md` (default)
- `lg`

`xl` and `full` are excluded in v1 for textual fields.

### Resize

- `none`
- `vertical` (default)
- `horizontal`
- `both`

### Full width

`fullWidth` defaults to `true`. The textarea fills available width.

### Invalid manual

```html
<textarea solaris-textarea [invalid]="true"></textarea>
```

Manual invalid overrides automatic detection. When inside Form Field, error visibility follows the Form Field contract.

### Disabled

Preserves native `disabled` attribute. Inside Form Field, the shell also reflects disabled state when possible.

### Readonly

Preserves native `readonly` attribute. Readonly is visually distinct from disabled: better contrast, no disabled opacity, still readable, text selectable.

### Required

Preserves native `required` attribute. Optional marker is a Form Field responsibility.

### Rows

Textarea respects the native `rows` attribute:

```html
<textarea solaris-textarea rows="4"></textarea>
```

If `rows` is not specified, a visual min-height is applied based on size and density.

## CSS Variables

Textarea tokens can be customized on the textarea element or a parent:

| Token                                     | Purpose                   |
| ----------------------------------------- | ------------------------- |
| `--solaris-textarea-radius`               | Border radius             |
| `--solaris-textarea-color`                | Text color                |
| `--solaris-textarea-background`           | Background color          |
| `--solaris-textarea-border-color`         | Border color              |
| `--solaris-textarea-border-width`         | Border width              |
| `--solaris-textarea-padding-x`            | Horizontal padding        |
| `--solaris-textarea-padding-y`            | Vertical padding          |
| `--solaris-textarea-font-size`            | Font size                 |
| `--solaris-textarea-line-height`          | Line height               |
| `--solaris-textarea-min-height`           | Minimum height            |
| `--solaris-textarea-placeholder-color`    | Placeholder text color    |
| `--solaris-textarea-focus-ring-color`     | Focus ring color          |
| `--solaris-textarea-invalid-border-color` | Invalid border color      |
| `--solaris-textarea-disabled-opacity`     | Disabled opacity          |
| `--solaris-textarea-readonly-background`  | Readonly background color |

## Placeholder

Placeholder must not replace a label. Documented anti-pattern:

```html
<!-- Avoid: placeholder used as label -->
<textarea solaris-textarea placeholder="Descrição"></textarea>

<!-- Prefer: label via Form Field, placeholder as example -->
<solaris-form-field label="Descrição">
  <textarea solaris-textarea placeholder="Ex.: Observações para a equipe"></textarea>
</solaris-form-field>
```

## Angular Forms

Textarea does not create a custom `ControlValueAccessor`. Angular integrates with `<textarea>` natively. The directive reads `NgControl` for state detection and Form Field integration.

Compatible with:

- `formControl`
- `formControlName`
- `ngModel`
- Reactive Forms validators
- Disabled state via Angular Forms

## Autofill / Autocomplete / Spellcheck

Textarea preserves native behavior. Autocomplete, spellcheck, text selection, copy/paste, and native keyboard behavior are preserved.

## Accessibility

- Native `<textarea>` semantics are preserved.
- `aria-invalid` is set when invalid.
- `aria-describedby` is orchestrated with Form Field.
- `focus-visible` is not removed.
- Disabled and readonly are real, not visual-only.
- Placeholder is not treated as a label.
- No additional `role` is added (native textarea role is already correct).
- Readonly and disabled are visually distinguishable.

## Examples

```html
<!-- Standalone -->
<textarea solaris-textarea placeholder="Description"></textarea>

<!-- With rows -->
<textarea solaris-textarea rows="4" placeholder="Notes"></textarea>

<!-- Appearances -->
<textarea solaris-textarea appearance="surface" placeholder="Surface"></textarea>
<textarea solaris-textarea appearance="filled" placeholder="Filled"></textarea>

<!-- Resize -->
<textarea solaris-textarea resize="none" placeholder="Not resizable"></textarea>
<textarea solaris-textarea resize="both" placeholder="Resizable in both directions"></textarea>

<!-- States -->
<textarea solaris-textarea [invalid]="true" placeholder="Invalid"></textarea>
<textarea solaris-textarea disabled></textarea>

<!-- Form Field integration -->
<solaris-form-field label="Description" hint="Provide a concise description.">
  <textarea solaris-textarea></textarea>
</solaris-form-field>

<!-- Reactive Forms -->
<textarea solaris-textarea formControlName="description"></textarea>
```

## Limitations of Textarea v1

- Not a Rich Text Editor (RTE is a future component).
- Not a Markdown Editor.
- No autogrow/autosize (planned for v2 or as a separate extension directive).
- No custom `ControlValueAccessor` (native integration is sufficient).
- No minRows/maxRows (native `rows` attribute is used).
- Placeholder does not replace label.
- When inside Form Field, the shell is managed by Form Field.
- Standalone, Textarea has its own shell.

## Difference from Rich Text Editor

Textarea v1 is a native-style multiline text input. It supports plain text only.

Rich Text Editor will be a separate component in a future release, providing:

- formatted text (bold, italic, lists);
- contenteditable-based editing;
- toolbar integration;
- complex keyboard shortcuts.

Textarea v1 does not attempt to solve Rich Text or Markdown editing.
