# Solaris Radio

## Purpose

Radio is a form control component that represents a single option within a set of mutually exclusive choices. It wraps a native `<input type="radio">` with Solaris styling, accessibility, and integration with Radio Group.

## When to use

- Presenting a list of mutually exclusive options.
- As a child of Solaris Radio Group to manage single selection.

## When not to use

- Do not use Radio standalone for boolean choices — use Checkbox instead.
- Do not use Radio for multi-selection — use Checkbox Group instead.
- Do not use Radio to trigger immediate actions — use Button or Switch instead.

## API

### Inputs

| Input          | Type                                                                                 | Default     | Description                     |
| -------------- | ------------------------------------------------------------------------------------ | ----------- | ------------------------------- |
| `value`        | `unknown`                                                                            | —           | Value this radio represents     |
| `checked`      | `boolean`                                                                            | `false`     | Whether the radio is checked    |
| `disabled`     | `boolean`                                                                            | `false`     | Disables the radio              |
| `readonly`     | `boolean`                                                                            | `false`     | Readonly mode (value preserved) |
| `required`     | `boolean`                                                                            | `false`     | Required validation             |
| `invalid`      | `boolean \| undefined`                                                               | `undefined` | Invalid state                   |
| `appearance`   | `'outline' \| 'surface'`                                                             | `'outline'` | Visual appearance               |
| `color`        | `'neutral' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'custom'` | `'primary'` | Semantic color                  |
| `size`         | `'sm' \| 'md' \| 'lg'`                                                               | `'md'`      | Size variant                    |
| `density`      | `'compact' \| 'comfortable'`                                                         | inherited   | Density variant                 |
| `label`        | `string`                                                                             | —           | Direct label text               |
| `labelKey`     | `string`                                                                             | —           | i18n key for label              |
| `name`         | `string`                                                                             | —           | Native `name` attribute         |
| `ariaLabel`    | `string`                                                                             | —           | Accessible label                |
| `ariaLabelKey` | `string`                                                                             | —           | i18n key for accessible label   |

### Outputs

| Output          | Type      | Description                        |
| --------------- | --------- | ---------------------------------- |
| `checkedChange` | `boolean` | Emitted when checked state changes |
| `change`        | `Event`   | Native change event                |

Label can also be provided via content projection: `<solaris-radio>Label text</solaris-radio>`. Projected content wins over the `label` input.

## Checked

The `checked` property controls whether the radio is selected.

```html
<solaris-radio [checked]="true" />
```

When used inside a Radio Group, the group manages the checked state. The checked state follows single-selection rules: selecting one radio deselects others.

## Readonly

Readonly prevents user interaction while keeping the value visually clear.

```html
<solaris-radio [checked]="true" [readonly]="true" />
```

- Readonly does not call `onChange` or emit `checkedChange` on user interaction.
- Readonly preserves value visibility.
- Readonly is visually distinct from disabled.
- Readonly prevents interaction at the JavaScript level.

## Disabled

Disabled prevents interaction and reduces visual weight.

```html
<solaris-radio [disabled]="true" />
```

## Required

Required reflects HTML required validation.

```html
<solaris-radio [required]="true" />
```

## Invalid

Invalid applies error styling.

```html
<solaris-radio [invalid]="true" />
```

## Appearances

| Appearance | Visual                                           |
| ---------- | ------------------------------------------------ |
| `outline`  | Transparent background, visible border (default) |
| `surface`  | Subtle background, border when checked           |

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

| Size | Radio circle |
| ---- | ------------ |
| `sm` | 1rem         |
| `md` | 1.25rem      |
| `lg` | 1.5rem       |

## Density

| Density       | Effect                       |
| ------------- | ---------------------------- |
| `compact`     | Reduced gap between elements |
| `comfortable` | Increased gap (default)      |

## CSS Variables

Radio tokens can be customized on the host or a parent element. The `custom` color uses the `--solaris-radio-custom-*` tokens.

| Token                                    | Purpose                       |
| ---------------------------------------- | ----------------------------- |
| `--solaris-radio-size`                   | Control circle size           |
| `--solaris-radio-dot-size`               | Inner dot size                |
| `--solaris-radio-gap`                    | Gap between control and label |
| `--solaris-radio-background`             | Control background color      |
| `--solaris-radio-border-color`           | Control border color          |
| `--solaris-radio-ring-color`             | Checked ring color            |
| `--solaris-radio-ring-width`             | Control ring/border width     |
| `--solaris-radio-dot-color`              | Inner dot color               |
| `--solaris-radio-focus-ring-color`       | Focus ring color              |
| `--solaris-radio-disabled-opacity`       | Disabled opacity              |
| `--solaris-radio-readonly-background`    | Readonly control background   |
| `--solaris-radio-readonly-opacity`       | Readonly opacity              |
| `--solaris-radio-label-font-size`        | Label font size               |
| `--solaris-radio-label-line-height`      | Label line height             |
| `--solaris-radio-custom-surface`         | Custom color: control surface |
| `--solaris-radio-custom-border-color`    | Custom color: border          |
| `--solaris-radio-custom-ring-color`      | Custom color: checked ring    |
| `--solaris-radio-custom-indicator-color` | Custom color: checked dot     |

## Label by projection

```html
<solaris-radio value="basic">Basic</solaris-radio>
```

## Label by input

```html
<solaris-radio value="basic" label="Basic" />
```

Projected content wins over label input when both are provided.

## Aria-label

```html
<solaris-radio value="basic" ariaLabel="Basic plan" /> <solaris-radio value="pro" ariaLabelKey="plan.pro" />
```

## Accessibility

- Uses native `<input type="radio">` internally.
- The native input is visually hidden but remains accessible.
- The visual control and dot are `aria-hidden="true"`.
- The label is properly associated with the input via `for` attribute.
- Required is reflected on the native input.
- Focus-visible is visible and uses Solaris tokens.
- Invalid state is communicated via `aria-invalid`.
- `aria-describedby` is set from the Form Field integration.
- Checked state is communicated visually and semantically.

## Examples

```html
<!-- Basic -->
<solaris-radio value="basic">Basic</solaris-radio>
<solaris-radio [checked]="true" value="pro">Pro</solaris-radio>

<!-- Appearances -->
<solaris-radio appearance="outline">Outline</solaris-radio>
<solaris-radio appearance="surface">Surface</solaris-radio>

<!-- Colors -->
<solaris-radio color="neutral">Neutral</solaris-radio>
<solaris-radio color="primary">Primary</solaris-radio>
<solaris-radio color="success">Success</solaris-radio>
<solaris-radio color="warning">Warning</solaris-radio>
<solaris-radio color="danger">Danger</solaris-radio>
<solaris-radio color="info">Info</solaris-radio>

<!-- Sizes -->
<solaris-radio size="sm">Small</solaris-radio>
<solaris-radio size="md">Medium</solaris-radio>
<solaris-radio size="lg">Large</solaris-radio>

<!-- States -->
<solaris-radio [disabled]="true">Disabled</solaris-radio>
<solaris-radio [checked]="true" [disabled]="true">Disabled checked</solaris-radio>
<solaris-radio [readonly]="true">Readonly unchecked</solaris-radio>
<solaris-radio [checked]="true" [readonly]="true">Readonly checked</solaris-radio>
<solaris-radio [invalid]="true">Invalid</solaris-radio>
```

## Limitations (v1)

- Radio v1 is primarily designed as a child of Radio Group.
- Individual Radio CVA is available but not the recommended usage pattern.
- Readonly prevents interaction at the JavaScript level.
- Custom color is only available via CSS variables, not arbitrary input props.
- This is not a Segmented Control, Toggle Group, or Selection Card.
