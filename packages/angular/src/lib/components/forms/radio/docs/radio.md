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

```typescript
@Component({
  selector: 'solaris-radio',
  standalone: true,
})
class SolarisRadioComponent {
  // State
  value: unknown;
  checked: boolean; // false
  disabled: boolean; // false
  readonly: boolean; // false
  required: boolean; // false
  invalid: boolean; // false

  // Visual
  appearance: SolarisRadioAppearance; // 'outline' | 'surface'
  color: SolarisRadioColor; // 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'custom'
  size: SolarisRadioSize; // 'sm' | 'md' | 'lg'
  density: SolarisRadioDensity; // 'compact' | 'comfortable' (inherits when unset)

  // Label
  label: string; // Direct text
  labelKey: string; // i18n translation key
  // Or use content projection:
  // <solaris-radio>Label text</solaris-radio>

  // Native attributes
  name: string;

  // Accessibility
  ariaLabel: string;
  ariaLabelKey: string;

  // Events
  checkedChange: boolean;
  change: Event;
}
```

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
