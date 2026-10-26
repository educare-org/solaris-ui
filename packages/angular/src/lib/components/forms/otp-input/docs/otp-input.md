# Solaris OTP Input

## Purpose

`SolarisOtpInputComponent` (`solaris-otp-input`) is a preset form control for one-time
passwords (OTP) and verification codes. It renders a row of single-character boxes with
automatic focus advancement, keyboard navigation, paste support, optional masking and visual
grouping.

The number of boxes is driven by `maxLength` (default 12), and the value is valid when its
length is between `minLength` (default 1) and `maxLength`.

## Why preset, not primitive

The component wraps `solaris-form-field` for label, hint, error, required and visual
variants — but registers itself as the form control (like `solaris-select`), so it does not
use the prefix/suffix slots. The OTP boxes live inside the control area.

## Component

```html
<solaris-otp-input label="Verification code" [maxLength]="6" [minLength]="4"></solaris-otp-input>
```

## When to use

- Login and recovery flows that require a one-time code.
- When the code length varies per context and needs min/max limits.

## When not to use

- For general single-line text input.
- When the expected code always has a fixed length and no partial states.

## API

### Inputs

| Input                                | Type                        | Default                                                | Description                                |
| ------------------------------------ | --------------------------- | ------------------------------------------------------ | ------------------------------------------ |
| `value`                              | `string`                    | `''`                                                   | One-way concatenated value.                |
| `label` / `labelKey`                 | `string` / `string`         | `''`                                                   | Field label.                               |
| `hint` / `hintKey`                   | `string` / `string`         | `''`                                                   | Helper text.                               |
| `error` / `errorKey`                 | `string` / `string`         | `''`                                                   | Manual error message.                      |
| `requiredError` / `requiredErrorKey` | `string` / `string`         | —                                                      | Required error override.                   |
| `invalidError` / `invalidErrorKey`   | `string` / `string`         | —                                                      | Invalid length error override.             |
| `required`                           | `boolean`                   | `false`                                                | Marks required and validates empty.        |
| `optional`                           | `boolean`                   | `false`                                                | Shows the optional marker.                 |
| `disabled`                           | `boolean`                   | `false`                                                | Disables the field.                        |
| `readonly`                           | `boolean`                   | `false`                                                | Read-only field.                           |
| `invalid`                            | `boolean \| undefined`      | —                                                      | Manual invalid override.                   |
| `maxLength`                          | `number`                    | `12`                                                   | Number of boxes / max code length.         |
| `minLength`                          | `number`                    | `1`                                                    | Minimum accepted code length.              |
| `charType`                           | `SolarisOtpInputCharType`   | `'numeric'`                                            | `'numeric'` or `'alphanumeric'`.           |
| `masked`                             | `boolean`                   | `false`                                                | Show `•` for filled boxes.                 |
| `separatorEvery`                     |
| `number`                             | `0`                         | Inserts a `-` separator after every N boxes (0 = off). |
| `autoFocus`                          | `boolean`                   | `false`                                                | Focus the first box on init.               |
| `appearance`                         | `SolarisOtpInputAppearance` | `'outline'`                                            | `outline` / `surface` / `filled`.          |
| `size`                               | `SolarisOtpInputSize`       | `'md'`                                                 | `sm` / `md` / `lg`.                        |
| `density`                            | `SolarisOtpInputDensity`    | —                                                      | `compact` / `normal` / `comfortable`.      |
| `radius`                             | `SolarisOtpInputRadius`     | `'md'`                                                 | `none` / `sm` / `md` / `lg` / `xl` (pill). |

### Outputs

| Output        | Type     | Description                               |
| ------------- | -------- | ----------------------------------------- |
| `valueChange` | `string` | Emits the concatenated value on change.   |
| `completed`   | `void`   | Emits when the value reaches `maxLength`. |

## CVA (ControlValueAccessor)

The component implements `ControlValueAccessor` and the `SolarisFormControl` contract, so it
works with reactive and template-driven forms.

```ts
code = new FormControl('', [Validators.required, solarisOtpValidator(4, 6)]);
```

```html
<solaris-otp-input formControlName="code" [maxLength]="6"></solaris-otp-input>
```

## Behavior

- **Typing** fills the current box and advances focus to the next one.
- **Backspace** clears the current box; on an empty box it moves back and clears the previous.
- **Arrows / Home / End** move focus between boxes.
- **Paste** distributes the text across boxes starting at the focused box.
- **Masked** displays `•` for filled boxes while the value keeps the real characters.
- **Separator** inserts a `-` between every `separatorEvery` boxes (decorative, hidden from
  assistive technology).
- `completed` is emitted when the value reaches `maxLength` (useful for auto-submit).

## Error behavior

Errors follow the `control.invalid && (touched || dirty) && !focused` convention:

1. Manual `error` / `errorKey`.
2. `required` + empty → required error.
3. Non-empty but shorter than `minLength` → invalid error.

Default messages use `solaris.otp-input.*` translation keys.

## Reusable validator

```ts
import { solarisOtpValidator } from '@educarehq/solaris-ui';

code = new FormControl('', solarisOtpValidator(4, 6));
```

Returns `{ solarisOtpLength: { requiredLength, actualLength } }` when the value length is
outside `[minLength, maxLength]`; `null` otherwise (empty values pass).

## Accessibility

- The boxes are grouped with `role="group"` labelled by the field label.
- Each box has an `aria-label` (`Digit N of M`), `inputmode` (numeric/text) and
  `autocomplete="one-time-code"`.
- Hint/error ids are applied to the boxes via `aria-describedby`.
- The active box is marked with `data-active`.

## Suffix actions

Extra suffix actions (e.g. a resend-code button) compose beside the boxes and
are detected via `projectedSuffixAction` (`hasSuffixAction` on Form Field):

```html
<solaris-otp-input label="Code" [maxLength]="6">
  <button type="button" solaris-form-suffix-action aria-label="Resend code" (click)="resend()">Resend</button>
</solaris-otp-input>
```

## CSS Variables

`SolarisOtpInputComponent` defines the following tokens:

| Token                                         | Default                                          | Description                          |
| --------------------------------------------- | ------------------------------------------------ | ------------------------------------ |
| `--solaris-otp-input-gap`                     | `var(--solaris-spacing-2)`                       | Gap between boxes.                   |
| `--solaris-otp-input-separator-color`         | `var(--solaris-neutral-text-secondary)`          | Separator `-` color.                 |
| `--solaris-otp-input-box-radius`              | `var(--solaris-radius-sm)`                       | Box radius.                          |
| `--solaris-otp-input-box-border-color`        | `var(--solaris-neutral-border-subtle)`           | Box border.                          |
| `--solaris-otp-input-box-border-width`        | `var(--solaris-border-width-sm)`                 | Box border width.                    |
| `--solaris-otp-input-box-background`          | `transparent`                                    | Box background.                      |
| `--solaris-otp-input-box-color`               | `var(--solaris-neutral-text-body)`               | Box text color.                      |
| `--solaris-otp-input-box-active-border-color` | `var(--solaris-neutral-border-strong)`           | Active box border (no outline ring). |
| `--solaris-otp-input-box-error-border-color`  | `var(--solaris-danger-solid)`                    | Invalid border.                      |
| `--solaris-otp-input-box-width`               | `calc(var(--solaris-density-min-height) * 0.90)` | Box width.                           |
| `--solaris-otp-input-box-height`              | `calc(var(--solaris-density-min-height) * 1.15)` | Box height.                          |

Box font follows the field type scale (`xs`/`sm`/`md` per density); the width and height
make each box a subtle vertical rectangle (slightly taller than wide). The focused
box signals with a lighter neutral border instead of an outline ring, and the outer
Form Field focus ring is suppressed for OTP.

## Visual variants

The boxes carry the appearance themselves and the `solaris-form-field` control wrapper
stays clean (no border or background):

- `outline` — boxes have a border only (transparent background).
- `surface` — boxes have the surface background, no border.
- `filled` — boxes have the surface background and a border.

`density` (`compact` / `normal` / `comfortable`) and `radius` (`none` / `sm` / `md` / `lg` / `xl` (pill))
apply to the boxes as well.

## Size, density, radius, and appearance repasse

`size` (default `'md'`), `density` (default: inherited theme density),
`radius` (default `'md'`), and `appearance` (default `'outline'`) are
repassed together to the inner `solaris-form-field` and scale the boxes
through the shared Form Field contract. The host exposes `data-size`,
`data-density`, `data-appearance`, and `data-radius`.

There is deliberately **no** `loading` input: OTP boxes render immediately
and never wait on async date/option resolution, so a skeleton state does not
apply.

## Examples

```html
<solaris-otp-input label="Verification code" [maxLength]="6"></solaris-otp-input>

<solaris-otp-input label="Recovery code" [maxLength]="8" [minLength]="6" [separatorEvery]="4"></solaris-otp-input>

<solaris-otp-input label="Banking code" [maxLength]="6" [masked]="true" (completed)="onCompleted()"></solaris-otp-input>
```

## Limitations (v1)

- The label click focuses the first box through the `SolarisFormControl.focus()` contract;
  native label-to-box association is not used.
- `charType` filtering applies to user input and paste; an externally provided `value` is
  distributed left-aligned and truncated to `maxLength`.
