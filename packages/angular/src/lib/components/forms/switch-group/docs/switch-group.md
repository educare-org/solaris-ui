# SolarisSwitchGroupComponent

## Purpose

`SolarisSwitchGroupComponent` groups related independent boolean settings. Each child switch represents a named boolean option, and the group value is a `Record<string, boolean>` object where the key is the child `value`.

## Conceptual difference

| Component             | Value                     | Usage                               |
| --------------------- | ------------------------- | ----------------------------------- |
| **Switch**            | `boolean`                 | Toggles a single setting on/off.    |
| **Switch Group**      | `Record<string, boolean>` | Set of related boolean settings.    |
| **Checkbox Group**    | `unknown[]` (array)       | Multiple selection in a collection. |
| **Radio Group**       | `unknown`                 | Single choice.                      |
| **Toggle Group**      | Active toggle value       | UI visual state control.            |
| **Segmented Control** | Active segment value      | Visual alternative to Radio Group.  |

## When to use

- Group independent boolean preferences or settings (e.g., notification channels, security preferences).
- Expose a set of switches as a single FormControl with a `Record<string, boolean>` value.

## When not to use

- For multiple selection in a list — use **Checkbox Group**.
- For single choice — use **Radio Group**.
- For visual UI state toggling — use **Toggle Group** or **Segmented Control**.
- For scenarios requiring a master switch/select-all — not implemented in v1.
- For loading/pending — not implemented in v1.
- For nested groups/tree — not implemented in v1.

## Value

The Switch Group value is `Record<string, boolean>`:

```typescript
{
  email: true,
  sms: false,
  push: true
}
```

Each key corresponds to the `value` of a child switch.

## API

### Inputs

| Input          | Type                                     | Default              | Description                                                               |
| -------------- | ---------------------------------------- | -------------------- | ------------------------------------------------------------------------- |
| `orientation`  | `'vertical' \| 'horizontal'`             | `'vertical'`         | Layout direction.                                                         |
| `layout`       | `'list' \| 'grid'`                       | `'list'`             | Layout type.                                                              |
| `columns`      | `1 \| 2 \| 3 \| 4 \| 'auto'`             | `1`                  | Columns in the grid layout.                                               |
| `density`      | `'compact' \| 'normal' \| 'comfortable'` | Inherited from theme | Visual density (inherited by children).                                   |
| `size`         | `'sm' \| 'md' \| 'lg'`                   | `'md'`               | Size of the switches (inherited by children unless a child sets its own). |
| `disabled`     | `boolean`                                | `false`              | Disables the group.                                                       |
| `readonly`     | `boolean`                                | `false`              | Readonly.                                                                 |
| `required`     | `boolean`                                | `false`              | Requires at least one switch to be on.                                    |
| `invalid`      | `boolean \| undefined`                   | `undefined`          | Manual invalid state.                                                     |
| `label`        | `string \| undefined`                    | `undefined`          | Group label.                                                              |
| `labelKey`     | `string \| undefined`                    | `undefined`          | Translation key for the label.                                            |
| `hint`         | `string \| undefined`                    | `undefined`          | Help text.                                                                |
| `hintKey`      | `string \| undefined`                    | `undefined`          | Translation key for the hint.                                             |
| `error`        | `string \| undefined`                    | `undefined`          | Error text.                                                               |
| `errorKey`     | `string \| undefined`                    | `undefined`          | Translation key for the error.                                            |
| `minEnabled`   | `number \| undefined`                    | `undefined`          | Minimum number of switches that must be on.                               |
| `maxEnabled`   | `number \| undefined`                    | `undefined`          | Maximum number of switches that can be on.                                |
| `ariaLabel`    | `string \| undefined`                    | `undefined`          | ARIA label.                                                               |
| `ariaLabelKey` | `string \| undefined`                    | `undefined`          | Translation key for the ARIA label.                                       |

### Outputs

| Output        | Type                      | Description                     |
| ------------- | ------------------------- | ------------------------------- |
| `valueChange` | `Record<string, boolean>` | Emitted when the value changes. |
| `changeEvent` | `Record<string, boolean>` | Emitted on every value change.  |

## CVA (ControlValueAccessor)

The component implements `ControlValueAccessor` for use with Angular Forms:

- `writeValue(value: Record<string, boolean> | null)`
- `registerOnChange(fn)`
- `registerOnTouched(fn)`
- `setDisabledState(isDisabled: boolean)`

## Child value as key

Each child switch must have a unique `value` within the group:

```html
<solaris-switch-group formControlName="notifications">
  <solaris-switch value="email">Email</solaris-switch>
  <solaris-switch value="sms">SMS</solaris-switch>
</solaris-switch-group>
```

- `value="email"` → `"email"` key in the object.
- If the group value is `{ email: true }`, the switch with `value="email"` is on.
- Children without a `value` emit a warning in development.
- Duplicate `value`s emit a warning in development.

## Validation

### minEnabled

Validates that at least N switches are on.

```html
<solaris-switch-group [minEnabled]="1" ...> </solaris-switch-group>
```

### maxEnabled

Validates that at most N switches are on.

**Note:** `maxEnabled` only validates in v1. It does not disable switches automatically.

### required

Equivalent to `minEnabled={1}`, unless `minEnabled` is greater.

```html
<solaris-switch-group required ...> </solaris-switch-group>
```

## Disabled

The group can be disabled as a whole, propagating to all children:

```html
<solaris-switch-group disabled>
  <solaris-switch value="email">Email</solaris-switch>
</solaris-switch-group>
```

Individual switches can have their own `disabled`, which takes precedence over the group when the group is enabled.

## Readonly

Similar to disabled, but keeps a readonly appearance:

```html
<solaris-switch-group readonly>
  <solaris-switch value="email">Email</solaris-switch>
</solaris-switch-group>
```

## Orientation, Layout, and Grid

```html
<!-- Vertical (default) -->
<solaris-switch-group orientation="vertical" layout="list"> ... </solaris-switch-group>

<!-- Horizontal -->
<solaris-switch-group orientation="horizontal" layout="list"> ... </solaris-switch-group>

<!-- Grid with 2 columns -->
<solaris-switch-group layout="grid" [columns]="2"> ... </solaris-switch-group>

<!-- Auto grid -->
<solaris-switch-group layout="grid" columns="auto"> ... </solaris-switch-group>
```

## CSS Variables

Switch Group tokens can be customized on the host or a parent element:

| Token                                      | Purpose                          |
| ------------------------------------------ | -------------------------------- |
| `--solaris-switch-group-gap`               | Gap between items in list layout |
| `--solaris-switch-group-row-gap`           | Row gap in grid layout           |
| `--solaris-switch-group-column-gap`        | Column gap in grid layout        |
| `--solaris-switch-group-label-color`       | Group label color                |
| `--solaris-switch-group-label-font-size`   | Group label font size            |
| `--solaris-switch-group-label-line-height` | Group label line height          |
| `--solaris-switch-group-hint-color`        | Hint text color                  |
| `--solaris-switch-group-hint-font-size`    | Hint font size                   |
| `--solaris-switch-group-hint-line-height`  | Hint line height                 |
| `--solaris-switch-group-error-color`       | Error text color                 |
| `--solaris-switch-group-error-font-size`   | Error font size                  |
| `--solaris-switch-group-error-line-height` | Error line height                |

## Label, Hint, and Error

```html
<solaris-switch-group label="Notifications" hint="Configure the notification channels." error="Select at least one channel." [invalid]="true">
  <solaris-switch value="email">Email</solaris-switch>
</solaris-switch-group>
```

## Form Field integration

```html
<solaris-form-field label="Preferences" hint="These options affect your account.">
  <solaris-switch-group formControlName="preferences">
    <solaris-switch value="twoFactor">Two-step authentication</solaris-switch>
    <solaris-switch value="marketing">Marketing communications</solaris-switch>
  </solaris-switch-group>
</solaris-form-field>
```

## Accessibility

- The group uses `role="group"`.
- It does not use `role="radiogroup"`.
- It does not use `role="switch"` on the group.
- Each child switch keeps `role="switch"`.
- `aria-label` and `aria-labelledby` are preserved.
- `aria-describedby` is applied when hint/error are present.
- The group does not capture the keyboard. Each child switch keeps its native behavior.
- Tab navigates between switches; Space toggles the focused switch.

## Limitations (v1)

- **No master switch/select-all.** Switch does not have an adequate native indeterminate state.
- **No loading/pending.**
- **No nested/tree.**
- **maxEnabled does not disable switches automatically.** It only validates.
- **No indeterminate state for Switch.**
- **No async/optimistic update/rollback.**

## Examples

### Basic

```html
<solaris-switch-group label="Notifications">
  <solaris-switch value="email">Email</solaris-switch>
  <solaris-switch value="sms">SMS</solaris-switch>
  <solaris-switch value="push">Push</solaris-switch>
</solaris-switch-group>
```

### Reactive Forms

```typescript
readonly notificationsControl = new FormControl({
  email: true,
  sms: false,
  push: true,
});
```

```html
<solaris-switch-group [formControl]="notificationsControl" label="Channels">
  <solaris-switch value="email">Email</solaris-switch>
  <solaris-switch value="sms">SMS</solaris-switch>
  <solaris-switch value="push">Push</solaris-switch>
</solaris-switch-group>
```
