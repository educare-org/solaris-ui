# Solaris Switch

## Purpose

Switch is a form control component that represents a binary on/off configuration. It wraps a native `<input type="checkbox">` with `role="switch"` and provides Solaris styling, accessibility, and Angular Forms integration.

## Switch vs Checkbox

| Aspect             | Switch                         | Checkbox                   |
| ------------------ | ------------------------------ | -------------------------- |
| Purpose            | Toggle a setting on/off        | Select/deselect an option  |
| Visual             | Track + thumb                  | Box + checkmark            |
| Semantics          | `role="switch"`                | `role="checkbox"` (native) |
| Default appearance | `surface`                      | `outline`                  |
| Indeterminate      | Not available                  | Available                  |
| Effect             | Immediate or persistent config | Selection or acceptance    |

## When to use

- Activating/deactivating a feature.
- Toggling a setting on/off.
- Enabling/disabling behavior.
- Persistent preferences.
- Administrative flags.

## When not to use

- Do not use Switch for terms acceptance — use Checkbox.
- Do not use Switch for multi-selection — use Checkbox Group instead.
- Do not use Switch for mutually exclusive options — use Radio Group.
- Do not use Switch to trigger a non-toggle action — use Button.
- Do not use Switch inside a list item for selection — use Checkbox.

## API

### Inputs

| Input          | Type                                                                                 | Default     | Description                     |
| -------------- | ------------------------------------------------------------------------------------ | ----------- | ------------------------------- |
| `checked`      | `boolean`                                                                            | `false`     | Whether the switch is on        |
| `disabled`     | `boolean`                                                                            | `false`     | Disables the switch             |
| `readonly`     | `boolean`                                                                            | `false`     | Readonly mode (value preserved) |
| `required`     | `boolean`                                                                            | `false`     | Required validation             |
| `invalid`      | `boolean \| undefined`                                                               | `undefined` | Invalid state                   |
| `appearance`   | `'outline' \| 'surface'`                                                             | `'surface'` | Visual appearance               |
| `color`        | `'neutral' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'custom'` | `'primary'` | Semantic color                  |
| `size`         | `'sm' \| 'md' \| 'lg'`                                                               | `'md'`      | Size variant                    |
| `density`      | `'compact' \| 'normal' \| 'comfortable'`                                             | inherited   | Density variant                 |
| `label`        | `string`                                                                             | —           | Direct label text               |
| `labelKey`     | `string`                                                                             | —           | i18n key for label              |
| `name`         | `string`                                                                             | —           | Native `name` attribute         |
| `value`        | `string`                                                                             | —           | Value submitted to the form     |
| `ariaLabel`    | `string`                                                                             | —           | Accessible label                |
| `ariaLabelKey` | `string`                                                                             | —           | i18n key for accessible label   |

### Outputs

| Output          | Type      | Description                        |
| --------------- | --------- | ---------------------------------- |
| `checkedChange` | `boolean` | Emitted when checked state changes |
| `changeEvent`   | `Event`   | Native change event                |

Label can also be provided via content projection: `<solaris-switch>Label text</solaris-switch>`. Projected content wins over the `label` input.

Switch implements `ControlValueAccessor`, so it works with Reactive Forms (`[formControl]`, `formControlName`) and template-driven forms (`[(ngModel)]`).

## Checked

The `checked` property controls whether the switch is on.

```html
<solaris-switch [checked]="true" /> <solaris-switch [(checked)]="isEnabled" />
```

## Readonly

Readonly prevents user interaction while keeping the value visually clear. It does not reduce contrast as much as disabled.

```html
<solaris-switch [checked]="true" [readonly]="true" />
```

- Readonly does not call `onChange` or emit `checkedChange` on user interaction.
- Readonly preserves value visibility.
- Readonly is visually distinct from disabled.
- Readonly prevents interaction at the JavaScript level (the native checkbox does not support readonly).

## Disabled

Disabled prevents interaction and reduces visual weight.

```html
<solaris-switch [disabled]="true" />
```

## Required

Required reflects HTML required validation.

```html
<solaris-switch [required]="true" />
```

## Invalid

Invalid applies error styling. When used inside Form Field, the invalid state is managed by the form field.

```html
<solaris-switch [invalid]="true" />
```

## Appearances

| Appearance | Visual                                                |
| ---------- | ----------------------------------------------------- |
| `surface`  | Subtle background, no border when unchecked (default) |
| `outline`  | Track with visible border                             |

## Colors

| Color     | Usage                              |
| --------- | ---------------------------------- |
| `primary` | Default active state (default)     |
| `neutral` | Neutral configuration              |
| `success` | Positive state                     |
| `warning` | Cautious activation                |
| `danger`  | Critical/destructive toggle        |
| `info`    | Informational setting              |
| `custom`  | Consumer-defined via CSS variables |

## Sizes

| Size | Track dimensions                    |
| ---- | ----------------------------------- |
| `sm` | 1.5rem × 0.875rem, thumb 0.625rem   |
| `md` | 1.875rem × 1.0625rem, thumb 0.75rem |
| `lg` | 2.375rem × 1.3125rem, thumb 1rem    |

## Density

| Density       | Effect                       |
| ------------- | ---------------------------- |
| `compact`     | Reduced gap between elements |
| `comfortable` | Increased gap (default)      |

## Label by projection

```html
<solaris-switch> Receber notificacoes </solaris-switch>
```

## Label by input

```html
<solaris-switch label="Receber notificacoes" />
```

Projected content wins over label input when both are provided.

## Aria-label

```html
<solaris-switch ariaLabel="Receber notificacoes" /> <solaris-switch ariaLabelKey="notifications.label" />
```

When no visible label is present, an accessible label must be provided via `ariaLabel`, `ariaLabelKey`, or `aria-labelledby`.

## Form Field integration

```html
<solaris-form-field label="Preferencias" hint="Essas opcoes afetam sua conta.">
  <solaris-switch formControlName="notifications"> Receber notificacoes </solaris-switch>
</solaris-form-field>
```

The Form Field coordinates:

- focused state;
- disabled state;
- readonly state;
- required state;
- invalid state;
- `aria-describedby` IDs.

## Angular Forms / CVA

```typescript
const control = new FormControl(false);

// Reactive Forms
<solaris-switch [formControl]="control" />
<solaris-switch formControlName="notifications" />

// Template-driven
<solaris-switch [(ngModel)]="enabled" />
```

- `writeValue` updates the checked state.
- `registerOnChange` is called on user interaction.
- `registerOnTouched` is called on blur.
- `setDisabledState` reflects form control disabled state.
- The CVA value is `boolean`.

## Customization via CSS variables

For the `custom` color, set CSS variables on the host or a parent:

```css
.custom-switch {
  --solaris-switch-custom-track-background: #e5e7eb;
  --solaris-switch-custom-track-checked-background: #9333ea;
  --solaris-switch-custom-thumb-background: #ffffff;
  --solaris-switch-custom-border-color: #d1d5db;
}
```

Available custom tokens:

| Token                                              | Purpose                    |
| -------------------------------------------------- | -------------------------- |
| `--solaris-switch-custom-track-background`         | Unchecked track background |
| `--solaris-switch-custom-track-checked-background` | Checked track background   |
| `--solaris-switch-custom-thumb-background`         | Thumb (circle) background  |
| `--solaris-switch-custom-border-color`             | Track border color         |

## Accessibility

- Uses native `<input type="checkbox">` with `role="switch"` internally.
- The native input is visually hidden but remains accessible.
- The visual track and thumb are `aria-hidden="true"`.
- The label is properly associated with the input via `for` attribute.
- Required is reflected on the native input.
- Focus-visible is visible and uses Solaris tokens.
- Invalid state is communicated via `aria-invalid`.
- `aria-describedby` is set from the Form Field integration.
- `aria-label` and `aria-labelledby` are supported for custom accessible names.
- Checked state does not rely solely on color.
- Reduced motion is respected via `prefers-reduced-motion`.

## Examples

```html
<!-- Basic -->
<solaris-switch>Unchecked</solaris-switch>
<solaris-switch [checked]="true">Checked</solaris-switch>

<!-- Appearances -->
<solaris-switch appearance="surface">Surface</solaris-switch>
<solaris-switch appearance="outline">Outline</solaris-switch>

<!-- Colors -->
<solaris-switch color="neutral">Neutral</solaris-switch>
<solaris-switch color="primary">Primary</solaris-switch>
<solaris-switch color="success">Success</solaris-switch>
<solaris-switch color="warning">Warning</solaris-switch>
<solaris-switch color="danger">Danger</solaris-switch>
<solaris-switch color="info">Info</solaris-switch>

<!-- Sizes -->
<solaris-switch size="sm">Small</solaris-switch>
<solaris-switch size="md">Medium</solaris-switch>
<solaris-switch size="lg">Large</solaris-switch>

<!-- Density -->
<solaris-switch density="compact">Compact</solaris-switch>
<solaris-switch density="comfortable">Comfortable</solaris-switch>

<!-- States -->
<solaris-switch [disabled]="true">Disabled unchecked</solaris-switch>
<solaris-switch [checked]="true" [disabled]="true">Disabled checked</solaris-switch>
<solaris-switch [readonly]="true">Readonly unchecked</solaris-switch>
<solaris-switch [checked]="true" [readonly]="true">Readonly checked</solaris-switch>
<solaris-switch [invalid]="true">Invalid unchecked</solaris-switch>
<solaris-switch [checked]="true" [invalid]="true">Invalid checked</solaris-switch>

<!-- Form Field integration -->
<solaris-form-field label="Preferencias" error="Campo obrigatorio.">
  <solaris-switch formControlName="notifications">Receber notificacoes</solaris-switch>
</solaris-form-field>

<!-- Reactive Forms -->
<solaris-switch [formControl]="enableControl" />

<!-- Custom color -->
<div class="my-custom-switch">
  <solaris-switch color="custom">Custom</solaris-switch>
</div>
```

## Limitations (v1)

- Switch v1 is an individual component. Switch Group is not available.
- Switch v1 does NOT have loading/pending/async state.
- Switch v1 does NOT have text on/off inside the track.
- Switch v1 does NOT have icons inside the thumb/track.
- Switch v1 does NOT have optimistic update, rollback or beforeChange guard.
- Switch v1 does NOT have Segmented Control or Button Group behavior.
- Readonly is distinguished from disabled visually and behaviorally.
- Custom color is only available via CSS variables, not arbitrary input props.
- The CVA works with `boolean` checked value only.
