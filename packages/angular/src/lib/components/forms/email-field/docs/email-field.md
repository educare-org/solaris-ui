# Solaris Email Field

## Purpose

Solaris Email Field is a form preset for email input. It encapsulates `solaris-form-field` + `input[solaris-input]` with opinionated defaults for email-specific behavior, validation, and accessibility.

## Component

```txt
selector: <solaris-email-field>
```

## Why preset, not primitive

Email Field is a **preset component**, not a primitive:

- **Preset**: `solaris-email-field` composes Form Field + Input with email-specific defaults and validation. It is ready to use in forms.
- **Primitive**: `input[solaris-input]` is a flexible directive that can be used with any input type.

Consumers can still compose manually:

```html
<solaris-form-field label="E-mail">
  <input solaris-input type="email" formControlName="email" />
</solaris-form-field>
```

The preset exists for the common case where you want email validation, proper autocomplete/inputmode, domain filtering, and error messages without manual composition.

## When to use

- Login/registration forms with email field.
- Contact forms.
- Any form that needs email input with validation.
- When you need domain whitelisting/blacklisting.

## When not to use

- When you need a non-email text input — use `input[solaris-input]` directly.
- When you need full control over Form Field composition — compose manually.
- When email validation should happen only on the backend.

## API

### Inputs

| Input                   | Type                                 | Default     | Description                                        |
| ----------------------- | ------------------------------------ | ----------- | -------------------------------------------------- |
| `label`                 | `string`                             | `''`        | Label text                                         |
| `labelKey`              | `string`                             | —           | Translation key for label                          |
| `hint`                  | `string`                             | `''`        | Hint text                                          |
| `hintKey`               | `string`                             | —           | Translation key for hint                           |
| `error`                 | `string`                             | `''`        | Manual error text                                  |
| `errorKey`              | `string`                             | —           | Translation key for manual error                   |
| `requiredError`         | `string`                             | —           | Custom required error text                         |
| `requiredErrorKey`      | `string`                             | —           | Translation key for required error                 |
| `invalidError`          | `string`                             | —           | Custom invalid email error text                    |
| `invalidErrorKey`       | `string`                             | —           | Translation key for invalid error                  |
| `allowedDomainError`    | `string`                             | —           | Custom allowed domain error text                   |
| `allowedDomainErrorKey` | `string`                             | —           | Translation key for allowed domain error           |
| `blockedDomainError`    | `string`                             | —           | Custom blocked domain error text                   |
| `blockedDomainErrorKey` | `string`                             | —           | Translation key for blocked domain error           |
| `placeholder`           | `string`                             | —           | Placeholder text (not a substitute for label)      |
| `placeholderKey`        | `string`                             | —           | Translation key for placeholder                    |
| `required`              | `boolean`                            | `false`     | Marks field as required                            |
| `optional`              | `boolean`                            | `false`     | Marks field as optional                            |
| `readonly`              | `boolean`                            | `false`     | Makes field read-only                              |
| `disabled`              | `boolean`                            | `false`     | Disables the field                                 |
| `appearance`            | `'outline' \| 'surface' \| 'filled'` | `'outline'` | Visual appearance                                  |
| `size`                  | `'sm' \| 'md' \| 'lg'`               | `'md'`      | Field size                                         |
| `density`               | `'compact' \| 'comfortable'`         | —           | Inherited from theme; fallback `comfortable`       |
| `radius`                | `'none' \| 'sm' \| 'md' \| 'lg'`     | `'md'`      | Border radius                                      |
| `autocomplete`          | `string`                             | `'email'`   | Autocomplete attribute                             |
| `name`                  | `string`                             | —           | Native name attribute                              |
| `id`                    | `string`                             | —           | Native id attribute                                |
| `trimOnBlur`            | `boolean`                            | `true`      | Trim whitespace on blur                            |
| `normalizeLowercase`    | `boolean`                            | `false`     | Convert to lowercase on blur                       |
| `allowedDomains`        | `string[]`                           | —           | Domain whitelist                                   |
| `blockedDomains`        | `string[]`                           | —           | Domain blacklist                                   |
| `validateDomain`        | `boolean`                            | —           | Auto-enabled when allowed/blocked domains provided |

### Internal input attributes

The embedded input uses these fixed attributes:

- `type="email"`
- `autocomplete="email"` (overridable via `autocomplete` input)
- `inputmode="email"`
- `autocapitalize="none"`
- `spellcheck="false"`

### Error priority

1. Manual error (`error` / `errorKey`)
2. Required (when `required=true` and value is empty)
3. Invalid email format
4. Allowed domain violation
5. Blocked domain violation

## Appearances

| Value     | Description                                                            |
| --------- | ---------------------------------------------------------------------- |
| `outline` | Clear border, neutral background. Default, good for traditional forms. |
| `surface` | Card/panel surface, subtle border.                                     |
| `filled`  | Subtle filled background, modern style.                                |

Default: `outline`

## Sizes

| Value | Height | Use                          |
| ----- | ------ | ---------------------------- |
| `sm`  | 2rem   | Compact forms, dense layouts |
| `md`  | 2.5rem | Standard forms, default      |
| `lg`  | 3rem   | Prominent inputs             |

Default: `md`

## Density

| Value         | Description                         |
| ------------- | ----------------------------------- |
| `compact`     | Reduced vertical spacing            |
| `comfortable` | Increased vertical spacing. Default |

When not provided, density is inherited from the theme.

## Radius

| Value  | Description              |
| ------ | ------------------------ |
| `none` | Sharp corners            |
| `sm`   | Small rounding           |
| `md`   | Medium rounding. Default |
| `lg`   | Large rounding           |

Default: `md`

## CSS Variables

Email Field declares no `--solaris-*` custom properties of its own. The visual shell and all styling tokens are delegated to the underlying `solaris-form-field` and `[solaris-input]` — see their CSS Variables sections for customization.

## CVA (ControlValueAccessor)

Email Field implements `ControlValueAccessor` for Angular Forms integration.

It supports:

- `writeValue` — set value from form control
- `registerOnChange` — propagate changes to form control
- `registerOnTouched` — mark as touched on blur
- `setDisabledState` — enable/disable from form control

### Reactive Forms

```typescript
const form = new FormGroup({
  email: new FormControl('', [Validators.required, solarisEmailValidator()]),
});
```

```html
<solaris-email-field formControlName="email" label="E-mail"></solaris-email-field>
```

### Template-driven forms

```html
<solaris-email-field [(ngModel)]="email" label="E-mail" name="email"></solaris-email-field>
```

## Trim on blur

By default (`trimOnBlur=true`), whitespace is removed from the beginning and end of the value when the field loses focus. The trimmed value is propagated to the form control.

## normalizeLowercase

By default (`normalizeLowercase=false`), the value is not converted to lowercase. Technically, the local part of an email address can be case-sensitive, though in practice most mail servers treat it case-insensitively.

When `normalizeLowercase=true`, the value is converted to lowercase on blur.

## required

When `required=true`, the component validates that the value is not empty after blur. The error message is configurable via `requiredError` / `requiredErrorKey`.

## allowedDomains

When provided, only email addresses whose domain is in the list are accepted. Comparison is case-insensitive.

## blockedDomains

When provided, email addresses whose domain is in the list are rejected. Comparison is case-insensitive.

If both `allowedDomains` and `blockedDomains` are provided:

- `allowedDomains` is evaluated first.
- If the domain is not in `allowedDomains`, the allowed domain error is shown.
- If the domain is in `allowedDomains` but also in `blockedDomains`, the blocked domain error is shown.

Using both simultaneously is rare and should be documented.

## Error messages

Default translation keys:

- `solaris.email-field.required` — "Email is required."
- `solaris.email-field.invalid` — "Enter a valid email address."
- `solaris.email-field.allowedDomain` — "Email domain is not allowed."
- `solaris.email-field.blockedDomain` — "Email domain is not allowed."

Each error can be overridden via `*Error` / `*ErrorKey` inputs.

## Form Field integration

Email Field delegates to `solaris-form-field`:

- Label, hint, error text
- Required/optional markers
- Appearance, size, density, radius
- Invalid state (border/outline)
- Disabled/readonly state
- `aria-describedby` management

## Readonly vs Disabled

- **readonly**: Value is visible, field is not interactive, but still focusable and selectable.
- **disabled**: Field is not interactive, not focusable, skipped in tab order.

## Accessibility

- Label is associated with input via `for`/`id`.
- Error messages are linked via `aria-describedby` through Form Field.
- Errors are not announced while the field is focused.
- Placeholder is not used as a substitute for label.
- Disabled state removes interaction.
- Readonly state preserves visual reading.

## Limitations (v1)

- Does not validate actual email existence.
- Does not validate MX/DNS records.
- Does not call any external API.
- Does not replace backend validation.
- Placeholder is decorative only; it must not replace label.
- `normalizeLowercase` converts the full value, not only the domain part.
- Domain comparison normalizes domain only, not the full email value, unless `normalizeLowercase` is enabled.

## Examples

### Basic

```html
<solaris-email-field label="E-mail"></solaris-email-field>
```

### Required

```html
<solaris-email-field label="E-mail" [required]="true"></solaris-email-field>
```

### With hint

```html
<solaris-email-field label="E-mail corporativo" hint="Use seu e-mail institucional."></solaris-email-field>
```

### With placeholder

```html
<solaris-email-field label="E-mail" placeholder="nome@empresa.com"></solaris-email-field>
```

> Placeholder is not a substitute for label.

### Allowed domains

```html
<solaris-email-field label="E-mail corporativo" [allowedDomains]="['empresa.com.br']"></solaris-email-field>
```

### Blocked domains

```html
<solaris-email-field label="E-mail" [blockedDomains]="['tempmail.com', 'mailinator.com']"></solaris-email-field>
```

### normalizeLowercase

```html
<solaris-email-field label="E-mail" [normalizeLowercase]="true"></solaris-email-field>
```

### Reactive Forms

```html
<form [formGroup]="form">
  <solaris-email-field formControlName="email" label="E-mail" [required]="true"></solaris-email-field>
</form>
```
