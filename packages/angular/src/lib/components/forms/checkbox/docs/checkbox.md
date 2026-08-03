# Solaris Checkbox

## Purpose

Checkbox is a form control component that allows users to select or deselect an option. It wraps a native `<input type="checkbox">` with Solaris styling, accessibility, and Angular Forms integration.

## When to use

- Toggling a single boolean option.
- Selecting/deselecting an item.
- Presenting a list of independent choices (with Checkbox Group).

## When not to use

- Do not use Checkbox for mutually exclusive options — use Radio Group instead.
- Do not use Checkbox to trigger an immediate action — use Button or Switch instead.
- Do not use Checkbox for "select all" logic without managing indeterminate state externally.

## API

### Inputs

| Input           | Type                                                                                 | Default     | Description                             |
| --------------- | ------------------------------------------------------------------------------------ | ----------- | --------------------------------------- |
| `checked`       | `boolean`                                                                            | `false`     | Whether the checkbox is checked         |
| `indeterminate` | `boolean`                                                                            | `false`     | Visual indeterminate state (controlled) |
| `disabled`      | `boolean`                                                                            | `false`     | Disables the checkbox                   |
| `readonly`      | `boolean`                                                                            | `false`     | Readonly mode (value preserved)         |
| `required`      | `boolean`                                                                            | `false`     | Required validation                     |
| `invalid`       | `boolean \| undefined`                                                               | `undefined` | Invalid state                           |
| `appearance`    | `'outline' \| 'surface'`                                                             | `'outline'` | Visual appearance                       |
| `color`         | `'neutral' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'custom'` | `'primary'` | Semantic color                          |
| `size`          | `'sm' \| 'md' \| 'lg'`                                                               | `'md'`      | Size variant                            |
| `density`       | `'compact' \| 'comfortable'`                                                         | inherited   | Density variant                         |
| `radius`        | `'none' \| 'sm' \| 'md' \| 'lg'`                                                     | `'sm'`      | Border radius of the control box        |
| `label`         | `string`                                                                             | —           | Direct label text                       |
| `labelKey`      | `string`                                                                             | —           | i18n key for label                      |
| `name`          | `string`                                                                             | —           | Native `name` attribute                 |
| `value`         | `unknown`                                                                            | —           | Value submitted to the form             |
| `ariaLabel`     | `string`                                                                             | —           | Accessible label                        |
| `ariaLabelKey`  | `string`                                                                             | —           | i18n key for accessible label           |

### Outputs

| Output                | Type      | Description                              |
| --------------------- | --------- | ---------------------------------------- |
| `checkedChange`       | `boolean` | Emitted when checked state changes       |
| `indeterminateChange` | `boolean` | Emitted when indeterminate state changes |
| `changeEvent`         | `Event`   | Native change event                      |

Label can also be provided via content projection: `<solaris-checkbox>Label text</solaris-checkbox>`. Projected content wins over the `label` input.

Checkbox implements `ControlValueAccessor`, so it works with Reactive Forms (`[formControl]`, `formControlName`) and template-driven forms (`[(ngModel)]`).

## Checked

The `checked` property controls whether the checkbox is checked.

```html
<solaris-checkbox [checked]="true" /> <solaris-checkbox [(checked)]="isSelected" />
```

## Indeterminate

Indeterminate is a visual state independent of checked. It is controlled externally by the consumer.

```html
<solaris-checkbox [checked]="allSelected" [indeterminate]="someSelected"> Select all </solaris-checkbox>
```

When the user interacts with an indeterminate checkbox, the component:

- clears the visual indeterminate state;
- sets checked to `true`;
- emits `checkedChange` and `indeterminateChange`.

The consumer must update the `indeterminate` binding after interaction.

> **Important v1 limitation:** Indeterminate is a visual/controlled state, not the primary CVA value. The CVA works with boolean `checked` only.

## Readonly

Readonly prevents user interaction while keeping the value visually clear. It does not reduce contrast like disabled.

```html
<solaris-checkbox [checked]="true" [readonly]="true" />
```

- Readonly does not call `onChange` or emit `checkedChange` on user interaction.
- Readonly preserves value visibility.
- Readonly is visually distinct from disabled.
- Readonly prevents interaction at the JavaScript level (the native checkbox does not support readonly).

## Disabled

Disabled prevents interaction and reduces visual weight.

```html
<solaris-checkbox [disabled]="true" />
```

## Required

Required reflects HTML required validation.

```html
<solaris-checkbox [required]="true" />
```

## Invalid

Invalid applies error styling. When used inside Form Field, the invalid state is managed by the form field.

```html
<solaris-checkbox [invalid]="true" />
```

## Appearances

| Appearance | Visual                                           |
| ---------- | ------------------------------------------------ |
| `outline`  | Transparent background, visible border (default) |
| `surface`  | Subtle background, no border when unchecked      |

## Colors

| Color     | Usage                          |
| --------- | ------------------------------ |
| `primary` | Default selection (default)    |
| `neutral` | Neutral selection              |
| `success` | Positive confirmation          |
| `warning` | Cautious selection             |
| `danger`  | Critical/destructive selection |
| `info`    | Informational selection        |
| `custom`  | Consumer-defined via CSS vars  |

## Sizes

| Size | Checkbox box |
| ---- | ------------ |
| `sm` | 1rem         |
| `md` | 1.25rem      |
| `lg` | 1.5rem       |

## Density

| Density       | Effect                       |
| ------------- | ---------------------------- |
| `compact`     | Reduced gap between elements |
| `comfortable` | Increased gap (default)      |

## Label by projection

```html
<solaris-checkbox> Accept terms </solaris-checkbox>
```

## Label by input

```html
<solaris-checkbox label="Accept terms" />
```

Projected content wins over label input when both are provided.

## Aria-label

```html
<solaris-checkbox ariaLabel="Accept terms" /> <solaris-checkbox ariaLabelKey="terms.accept" />
```

When no visible label is present, an accessible label must be provided via `ariaLabel`, `ariaLabelKey`, or `aria-labelledby`.

## Form Field integration

```html
<solaris-form-field label="Terms" hint="You must accept the terms" error="Acceptance is required">
  <solaris-checkbox formControlName="terms"> Accept terms of use </solaris-checkbox>
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
<solaris-checkbox [formControl]="control" />
<solaris-checkbox formControlName="terms" />

// Template-driven
<solaris-checkbox [(ngModel)]="accepted" />
```

- `writeValue` updates the checked state.
- `registerOnChange` is called on user interaction.
- `registerOnTouched` is called on blur.
- `setDisabledState` reflects form control disabled state.
- The CVA value is `boolean` (checked state), not tri-state.

## Customization via CSS variables

For the `custom` color, set CSS variables on the host or a parent:

```css
.custom-checkbox {
  --solaris-checkbox-custom-control-background: #9333ea;
  --solaris-checkbox-custom-control-color: #ffffff;
  --solaris-checkbox-custom-control-border-color: #9333ea;
  --solaris-checkbox-custom-control-hover-background: #7e22ce;
}
```

Available custom tokens:

| Token                                                | Purpose          |
| ---------------------------------------------------- | ---------------- |
| `--solaris-checkbox-custom-control-background`       | Background color |
| `--solaris-checkbox-custom-control-color`            | Icon color       |
| `--solaris-checkbox-custom-control-border-color`     | Border color     |
| `--solaris-checkbox-custom-control-hover-background` | Hover background |

General component tokens available for advanced customization:

| Token                                     | Purpose                   |
| ----------------------------------------- | ------------------------- |
| `--solaris-checkbox-size`                 | Checkbox box size         |
| `--solaris-checkbox-icon-size`            | Check/indeterminate size  |
| `--solaris-checkbox-gap`                  | Gap between control/label |
| `--solaris-checkbox-border-color`         | Border color              |
| `--solaris-checkbox-border-width`         | Border width              |
| `--solaris-checkbox-background`           | Background color          |
| `--solaris-checkbox-color`                | Icon color                |
| `--solaris-checkbox-focus-ring-color`     | Focus ring color          |
| `--solaris-checkbox-disabled-opacity`     | Disabled opacity          |
| `--solaris-checkbox-readonly-background`  | Readonly background       |
| `--solaris-checkbox-invalid-border-color` | Invalid border color      |
| `--solaris-checkbox-label-font-size`      | Label font size           |
| `--solaris-checkbox-label-line-height`    | Label line height         |

## Accessibility

- Uses native `<input type="checkbox">` internally.
- The native input is visually hidden but remains accessible.
- The visual control box and icons are `aria-hidden="true"`.
- The label is properly associated with the input via `for` attribute.
- Required is reflected on the native input.
- Focus-visible is visible and uses Solaris tokens.
- Invalid state is communicated via `aria-invalid`.
- `aria-describedby` is set from the Form Field integration.
- `aria-label` and `aria-labelledby` are supported for custom accessible names.
- Checked and indeterminate states do not rely solely on color.

## Examples

```html
<!-- Basic -->
<solaris-checkbox>Unchecked</solaris-checkbox>
<solaris-checkbox [checked]="true">Checked</solaris-checkbox>

<!-- Indeterminate -->
<solaris-checkbox [indeterminate]="true">Indeterminate</solaris-checkbox>

<!-- Appearances -->
<solaris-checkbox appearance="outline">Outline</solaris-checkbox>
<solaris-checkbox appearance="surface">Surface</solaris-checkbox>

<!-- Colors -->
<solaris-checkbox color="neutral">Neutral</solaris-checkbox>
<solaris-checkbox color="primary">Primary</solaris-checkbox>
<solaris-checkbox color="success">Success</solaris-checkbox>
<solaris-checkbox color="warning">Warning</solaris-checkbox>
<solaris-checkbox color="danger">Danger</solaris-checkbox>
<solaris-checkbox color="info">Info</solaris-checkbox>

<!-- Sizes -->
<solaris-checkbox size="sm">Small</solaris-checkbox>
<solaris-checkbox size="md">Medium</solaris-checkbox>
<solaris-checkbox size="lg">Large</solaris-checkbox>

<!-- Density -->
<solaris-checkbox density="compact">Compact</solaris-checkbox>
<solaris-checkbox density="comfortable">Comfortable</solaris-checkbox>

<!-- States -->
<solaris-checkbox [disabled]="true">Disabled unchecked</solaris-checkbox>
<solaris-checkbox [checked]="true" [disabled]="true">Disabled checked</solaris-checkbox>
<solaris-checkbox [indeterminate]="true" [disabled]="true">Disabled indeterminate</solaris-checkbox>
<solaris-checkbox [readonly]="true">Readonly unchecked</solaris-checkbox>
<solaris-checkbox [checked]="true" [readonly]="true">Readonly checked</solaris-checkbox>
<solaris-checkbox [invalid]="true">Invalid unchecked</solaris-checkbox>
<solaris-checkbox [checked]="true" [invalid]="true">Invalid checked</solaris-checkbox>

<!-- Form Field integration -->
<solaris-form-field label="Terms" error="This field is required.">
  <solaris-checkbox formControlName="terms">Accept terms</solaris-checkbox>
</solaris-form-field>

<!-- Reactive Forms -->
<solaris-checkbox [formControl]="acceptControl" />

<!-- Custom color -->
<div class="my-custom-checkbox">
  <solaris-checkbox color="custom">Custom</solaris-checkbox>
</div>
```

## Limitations (v1)

- Checkbox v1 is an individual component.
- Checkbox v1 is NOT a Checkbox Group.
- Checkbox v1 does not implement select-all manager.
- Checkbox v1 does not implement tree selection.
- Checkbox v1 is not a Switch.
- Indeterminate is a visual/controlled state, not the primary CVA value.
- The CVA works with `boolean` checked value only — no tri-state value.
- Readonly prevents interaction at the JavaScript level but the native checkbox does not support the `readonly` attribute.
- Custom color is only available via CSS variables, not arbitrary input props.

## Checkbox Group

Use `solaris-checkbox-group` to present multiple related checkboxes:

```html
<solaris-checkbox-group label="Notifications">
  <solaris-checkbox>Email</solaris-checkbox>
  <solaris-checkbox>Push</solaris-checkbox>
  <solaris-checkbox>SMS</solaris-checkbox>
</solaris-checkbox-group>
```

Checkbox Group handles multiple values, group label/hint/error, and validation. Checkbox remains the individual building block.
