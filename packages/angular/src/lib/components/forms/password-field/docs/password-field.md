# SolarisPasswordField

## Purpose

`SolarisPasswordField` is an official Form Field preset for passwords. It composes `solaris-form-field` + `solaris-input` + common password behavior.

## Why a preset component

Password fields appear in nearly every product and tend to produce code repetition, visual inconsistency, and misaligned validations.

Password Field does not replace Form Field + Input. It is an official convenience for the common password case.

## Difference between Password Field and Form Field + Input

| Aspect             | Password Field | Form Field + Input manual |
| ------------------ | -------------- | ------------------------- |
| Visibility toggle  | Included       | Must be implemented       |
| Policy/validation  | Integrated     | Validator must be applied |
| Requirements list  | Optional       | Must be implemented       |
| Strength indicator | Optional       | Must be implemented       |
| CVA                | Implemented    | Must be implemented       |
| Visual consistency | Guaranteed     | Manual                    |

## When to use

- Login
- Registration
- Password change
- Any form that needs a password field

## When not to use

- When password confirmation is needed (use two separate fields)
- When validation with external verification is needed (leak checks, API)
- When a highly customized password field that the component does not support is needed

## API

### Inputs

| Input                | Type                                                  | Default     | Description                                          |
| -------------------- | ----------------------------------------------------- | ----------- | ---------------------------------------------------- |
| `value`              | `string`                                              | `''`        | Initial value                                        |
| `label`              | `string \| undefined`                                 | `''`        | Field label                                          |
| `labelKey`           | `string \| undefined`                                 | -           | Translation key for label                            |
| `hint`               | `string \| undefined`                                 | `''`        | Help text                                            |
| `hintKey`            | `string \| undefined`                                 | -           | Translation key for hint                             |
| `error`              | `string \| undefined`                                 | `''`        | Error text                                           |
| `errorKey`           | `string \| undefined`                                 | -           | Translation key for error                            |
| `placeholder`        | `string \| undefined`                                 | -           | Input placeholder                                    |
| `placeholderKey`     | `string \| undefined`                                 | -           | Translation key for placeholder                      |
| `autocomplete`       | `string \| undefined`                                 | -           | Value of the autocomplete attribute                  |
| `name`               | `string \| undefined`                                 | -           | `name` attribute of the input                        |
| `id`                 | `string \| undefined`                                 | -           | `id` attribute of the input                          |
| `required`           | `boolean`                                             | `false`     | Required field                                       |
| `optional`           | `boolean`                                             | `false`     | Optional field                                       |
| `disabled`           | `boolean`                                             | `false`     | Disabled field                                       |
| `readonly`           | `boolean`                                             | `false`     | Readonly field                                       |
| `invalid`            | `boolean \| undefined`                                | -           | Manual invalid state (overrides automatic detection) |
| `appearance`         | `'outline' \| 'surface' \| 'filled'`                  | `'outline'` | Appearance                                           |
| `density`            | `'compact' \| 'normal' \| 'comfortable' \| undefined` | -           | Density (inherited from theme)                       |
| `radius`             | `'none' \| 'sm' \| 'md' \| 'lg'`                      | `'md'`      | Border radius                                        |
| `fullWidth`          | `boolean`                                             | `true`      | Full width                                           |
| `showToggle`         | `boolean`                                             | `true`      | Show toggle button                                   |
| `visible`            | `boolean`                                             | `false`     | Password visible                                     |
| `showRequirements`   | `boolean`                                             | `false`     | Show requirements list                               |
| `showStrength`       | `boolean`                                             | `false`     | Show strength indicator                              |
| `policy`             | `SolarisPasswordPolicy \| undefined`                  | -           | Password policy                                      |
| `validatePolicy`     | `boolean`                                             | `true`      | Validate against policy                              |
| `toggleShowLabel`    | `string \| undefined`                                 | -           | Toggle "show" label                                  |
| `toggleShowLabelKey` | `string \| undefined`                                 | -           | Translation key                                      |
| `toggleHideLabel`    | `string \| undefined`                                 | -           | Toggle "hide" label                                  |
| `toggleHideLabelKey` | `string \| undefined`                                 | -           | Translation key                                      |

### Outputs

| Output          | Type      | Description                     |
| --------------- | --------- | ------------------------------- |
| `valueChange`   | `string`  | Emitted when the value changes  |
| `visibleChange` | `boolean` | Emitted when visibility toggles |

## Appearances

| Appearance | Visual                                         |
| ---------- | ---------------------------------------------- |
| `outline`  | Visible border and field background (default)  |
| `surface`  | Lighter, for cards and panels                  |
| `filled`   | Subtle filled background, less dominant border |

## Density

| Density       | Effect                            |
| ------------- | --------------------------------- |
| `compact`     | Reduced padding and line-height   |
| `normal`      | Balanced spacing. Default         |
| `comfortable` | Increased padding and line-height |

When not provided, Password Field inherits density from the theme system.

## Radius

| Radius | Effect                         |
| ------ | ------------------------------ |
| `none` | No border radius               |
| `sm`   | Small border radius            |
| `md`   | Medium border radius (default) |
| `lg`   | Large border radius            |

## CSS Variables

The strength indicator and requirements list are customizable:

| Token                                              | Purpose                              |
| -------------------------------------------------- | ------------------------------------ |
| `--solaris-password-field-strength-height`         | Strength bar height                  |
| `--solaris-password-field-strength-gap`            | Gap between strength bar and label   |
| `--solaris-password-field-strength-radius`         | Strength segment border radius       |
| `--solaris-password-field-strength-bar-bg`         | Inactive strength segment background |
| `--solaris-password-field-strength-weak-color`     | Weak level color                     |
| `--solaris-password-field-strength-medium-color`   | Medium level color                   |
| `--solaris-password-field-strength-strong-color`   | Strong level color                   |
| `--solaris-password-field-requirement-gap`         | Gap between requirement items        |
| `--solaris-password-field-requirement-color`       | Requirement text color               |
| `--solaris-password-field-requirement-met-color`   | Met requirement color                |
| `--solaris-password-field-requirement-unmet-color` | Unmet requirement color              |

## CVA / Angular Forms

Password Field implements `ControlValueAccessor` and works with Reactive Forms.

```html
<form [formGroup]="form">
  <solaris-password-field formControlName="password" label="Password" autocomplete="new-password"></solaris-password-field>
</form>
```

## Policy

`SolarisPasswordPolicy` defines the validation rules:

```typescript
interface SolarisPasswordPolicy {
  minLength?: number;
  maxLength?: number;
  requireLowercase?: boolean;
  requireUppercase?: boolean;
  requireNumber?: boolean;
  requireSymbol?: boolean;
  disallowWhitespace?: boolean;
  forbiddenValues?: string[];
}
```

## Reusable validator

`SolarisPasswordValidator(policy)` is a `ValidatorFn` that can be used on any FormControl:

```typescript
const policy = { minLength: 12, requireLowercase: true, requireUppercase: true, requireNumber: true, requireSymbol: true };
password: new FormControl('', [Validators.required, solarisPasswordValidator(policy)]);
```

Error names:

- `solarisPasswordMinLength`
- `solarisPasswordMaxLength`
- `solarisPasswordLowercase`
- `solarisPasswordUppercase`
- `solarisPasswordNumber`
- `solarisPasswordSymbol`
- `solarisPasswordWhitespace`
- `solarisPasswordForbiddenValue`

## Show / Hide password

Built-in visibility toggle. Use `[showToggle]="false"` to hide it.

## Requirements list

Enable with `[showRequirements]="true"` and provide `[policy]`. The list shows each requirement and its state.

## Strength indicator

Enable with `[showStrength]="true"`. The indicator uses a simple heuristic based on length and diversity.

States: `empty | weak | medium | strong`

**Warning:** The strength indicator is heuristic and does not replace a cryptographic meter.

## Autocomplete

| Context             | Recommended value  |
| ------------------- | ------------------ |
| Login               | `current-password` |
| Registration/change | `new-password`     |
| One-time code       | `one-time-code`    |

## Required / Optional

Use `[required]="true"` or `[optional]="true"`.

## Disabled / Readonly

- `disabled`: non-interactive field, does not submit a value
- `readonly`: value visible, not editable

## Error behavior

Error is visible when:

```
control.invalid && (control.touched || control.dirty) && !control.focused
```

An explicit manual error via `[invalid]="true"` overrides automatic detection.

## Security

- The password is never logged
- The password is never persisted to storage
- The password is never sent to external services
- Visibility only toggles the input `type`
- The value does not appear as text outside the input

## Accessibility

- Label connected to the input via `for`/`id`
- Hint/error in `aria-describedby`
- The toggle button has an accessible name
- The requirements list does not rely on color alone
- Strength does not rely on color alone
- Support for `prefers-reduced-motion`

## Examples

```html
<!-- Basic -->
<solaris-password-field label="Password" autocomplete="current-password" />

<!-- Reactive Forms -->
<solaris-password-field formControlName="password" label="Password" autocomplete="new-password" />

<!-- Template-driven -->
<solaris-password-field [(ngModel)]="password" label="Password" />

<!-- With requirements list -->
<solaris-password-field label="New password" autocomplete="new-password" [showRequirements]="true" [policy]="passwordPolicy" />

<!-- With strength indicator -->
<solaris-password-field label="New password" autocomplete="new-password" [showStrength]="true" />

<!-- Disabled -->
<solaris-password-field label="Password" [disabled]="true" />
```

## Limitations v1

- Does not replace authentication
- Does not validate password leaks
- Does not make external calls
- Does not provide a Password Confirm Field
- The strength indicator is heuristic
- Requirement labels without native i18n (currently hardcoded in Portuguese)
