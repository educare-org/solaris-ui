# Solaris Radio Group

## Purpose

Radio Group is a form control component that manages single selection within a set of mutually exclusive options. It wraps native `<input type="radio">` elements with group-level styling, accessibility, validation, and Angular Forms integration via ControlValueAccessor.

## Difference between Radio Group and Checkbox Group

| Aspect         | Radio Group                         | Checkbox Group                |
| -------------- | ----------------------------------- | ----------------------------- |
| Selection mode | Single choice only                  | Multiple choices              |
| Value          | Single value                        | Array of values               |
| Deselect       | Cannot deselect (always one active) | Can deselect individual items |
| Use case       | Mutually exclusive options          | Independent options           |

## When to use

- Mutually exclusive options where exactly one must be selected.
- Form controls like plan selection, preference choice, category picker.
- Replacing native `<select>` with one option per row when visual clarity is needed.

## When not to use

- Do not use Radio Group for multi-selection — use Checkbox Group instead.
- Do not use Radio Group as a Segmented Control — use Segmented Control for segmented navigation.
- Do not use Radio Group as a Toggle Group — use Toggle Group for button-like toggles.
- Do not use Radio Group for independent boolean options — use individual Checkboxes instead.

## API

```typescript
@Component({
  selector: 'solaris-radio-group',
  standalone: true,
})
class SolarisRadioGroupComponent {
  // State
  value: unknown;
  disabled: boolean; // false
  readonly: boolean; // false
  required: boolean; // false
  invalid: boolean; // false

  // Visual
  orientation: SolarisRadioGroupOrientation; // 'vertical' | 'horizontal'
  layout: SolarisRadioGroupLayout; // 'list' | 'grid'
  columns: SolarisRadioGroupColumns; // 1 | 2 | 3 | 4 | 'auto'
  size: SolarisRadioGroupSize; // 'sm' | 'md' | 'lg'
  density: SolarisRadioGroupDensity; // 'compact' | 'normal' | 'comfortable' (inherits when unset)

  // Label, hint, error (standalone)
  label: string;
  labelKey: string;
  hint: string;
  hintKey: string;
  error: string;
  errorKey: string;

  // Comparison
  compareWith: (a: unknown, b: unknown) => boolean;

  // Accessibility
  ariaLabel: string;
  ariaLabelKey: string;

  // Events
  valueChange: unknown;
  change: unknown;

  // ControlValueAccessor
  writeValue(value: unknown | null): void;
  registerOnChange(fn: (value: unknown) => void): void;
  registerOnTouched(fn: () => void): void;
  setDisabledState(isDisabled: boolean): void;
}
```

## Readonly

Readonly prevents user interaction while keeping the value visually clear.

```html
<solaris-radio-group [readonly]="true">
  <solaris-radio value="basic">Basic</solaris-radio>
</solaris-radio-group>
```

- Readonly does not call `onChange` or emit `valueChange` on user interaction.
- Readonly preserves value visibility.
- Readonly is visually distinct from disabled.
- Readonly propagates to all child radios.

## Disabled

Disabled prevents interaction and reduces visual weight.

```html
<solaris-radio-group [disabled]="true">
  <solaris-radio value="basic">Basic</solaris-radio>
</solaris-radio-group>
```

- Disabled propagates to all child radios.
- Individual radios can also be disabled independently.

## Required

Required reflects HTML required validation.

```html
<solaris-radio-group [required]="true"> ... </solaris-radio-group>
```

## Invalid

Invalid applies error styling. When used inside Form Field, the invalid state is managed by the form field.

```html
<solaris-radio-group [invalid]="true"> ... </solaris-radio-group>
```

## Orientation and Layout

### Vertical list (default)

```html
<solaris-radio-group orientation="vertical" layout="list">
  <solaris-radio value="a">A</solaris-radio>
  <solaris-radio value="b">B</solaris-radio>
</solaris-radio-group>
```

### Horizontal list

```html
<solaris-radio-group orientation="horizontal">
  <solaris-radio value="a">A</solaris-radio>
  <solaris-radio value="b">B</solaris-radio>
</solaris-radio-group>
```

### Grid layout

```html
<solaris-radio-group layout="grid" [columns]="2">
  <solaris-radio value="a">A</solaris-radio>
  <solaris-radio value="b">B</solaris-radio>
  <solaris-radio value="c">C</solaris-radio>
  <solaris-radio value="d">D</solaris-radio>
</solaris-radio-group>
```

### Columns

When `layout="grid"`, the `columns` input controls how many radios fit per row:

| Columns | Behavior                           |
| ------- | ---------------------------------- |
| `1`     | Single column (default)            |
| `2`     | Two columns                        |
| `3`     | Three columns                      |
| `4`     | Four columns                       |
| `auto`  | Auto-fill based on available width |

```html
<solaris-radio-group layout="grid" columns="auto">
  <solaris-radio value="a">A</solaris-radio>
  <solaris-radio value="b">B</solaris-radio>
</solaris-radio-group>
```

## Selection Cards

`SolarisSelectionCardComponent` is a radio option with a card-sized target. It
can be mixed with `solaris-radio` in the same group.

```html
<solaris-radio-group [formControl]="planControl" layout="grid" columns="auto">
  <solaris-selection-card value="basic">
    <h3>Basic</h3>
    <p>For small teams getting started.</p>
  </solaris-selection-card>
  <solaris-selection-card value="pro">
    <h3>Pro</h3>
    <p>For growing teams.</p>
  </solaris-selection-card>
</solaris-radio-group>
```

The group manages the selected value, validation, disabled state, readonly
state, and native radio name for every option.

## Sizes

Size propagates to all child radios through the `SOLARIS_RADIO_GROUP`
token — the same inheritance contract as `solaris-switch-group`. A child
radio keeps its own `size`/`density` when set explicitly.

```html
<solaris-radio-group size="sm"> ... </solaris-radio-group>
<solaris-radio-group size="md"> ... </solaris-radio-group>
<solaris-radio-group size="lg"> ... </solaris-radio-group>
```

The child resolves `size` as own input → group → `'md'`, and `density`
as own input → group → theme density. Both are exposed on the child
host as `data-size`/`data-density` with the effective values.

## Density

Density affects the control size and the gap between items, and
propagates to children like `size`.

## Unselected options

Inside a group, options that are not selected render faded: the label
text uses `--solaris-text-muted` and the control circle uses
`--solaris-radio-unselected-opacity`. The selected option keeps full
color, so the current choice stands out at a glance. Hovering an
unselected option restores its full color with a short transition.

```html
<solaris-radio-group density="compact"> ... </solaris-radio-group> <solaris-radio-group density="comfortable"> ... </solaris-radio-group>
```

## CSS Variables

Radio Group tokens can be customized on the host or a parent element:

| Token                                     | Purpose                          |
| ----------------------------------------- | -------------------------------- |
| `--solaris-radio-group-gap`               | Gap between items in list layout |
| `--solaris-radio-group-row-gap`           | Row gap in grid layout           |
| `--solaris-radio-group-column-gap`        | Column gap in grid layout        |
| `--solaris-radio-group-label-color`       | Group label color                |
| `--solaris-radio-group-label-font-size`   | Group label font size            |
| `--solaris-radio-group-label-line-height` | Group label line height          |
| `--solaris-radio-group-hint-color`        | Hint text color                  |
| `--solaris-radio-group-hint-font-size`    | Hint font size                   |
| `--solaris-radio-group-hint-line-height`  | Hint line height                 |
| `--solaris-radio-group-error-color`       | Error text color                 |
| `--solaris-radio-group-error-font-size`   | Error font size                  |
| `--solaris-radio-group-error-line-height` | Error line height                |

## CompareWith

For complex values (objects), provide a custom comparison function.

```typescript
comparePlan(a: unknown, b: unknown): boolean {
  return (a as Plan).id === (b as Plan).id;
}
```

```html
<solaris-radio-group [compareWith]="comparePlan" [formControl]="control">
  <solaris-radio [value]="basicPlan">Basic</solaris-radio>
  <solaris-radio [value]="proPlan">Pro</solaris-radio>
</solaris-radio-group>
```

## Standalone label/hint/error

```html
<solaris-radio-group label="Choose a plan" hint="Select the plan that fits your needs" error="Selection is required" [invalid]="true">
  <solaris-radio value="basic">Basic</solaris-radio>
  <solaris-radio value="pro">Pro</solaris-radio>
</solaris-radio-group>
```

## Form Field integration

```html
<solaris-form-field label="Plan" hint="Select one option" error="This field is required.">
  <solaris-radio-group formControlName="plan">
    <solaris-radio value="basic">Basic</solaris-radio>
    <solaris-radio value="pro">Pro</solaris-radio>
  </solaris-radio-group>
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
const control = new FormControl('basic');

// Reactive Forms
<solaris-radio-group [formControl]="control"> ... </solaris-radio-group>
<solaris-radio-group formControlName="plan"> ... </solaris-radio-group>

// Template-driven
<solaris-radio-group [(ngModel)]="selectedPlan"> ... </solaris-radio-group>
```

- `writeValue` updates the selected radio.
- `registerOnChange` is called on user selection.
- `registerOnTouched` is called on focusout.
- `setDisabledState` reflects form control disabled state.
- The CVA value is a single unknown value, not an array.

## Accessibility

- Uses `role="radiogroup"` on the group container.
- Uses native `<input type="radio">` for each option.
- The native input is visually hidden but remains accessible.
- `aria-label` and `aria-labelledby` are preserved.
- `aria-describedby` is set from hint/error or Form Field integration.
- `aria-invalid` is set when the group is invalid.
- `aria-required` is set when the group is required.
- The label is properly associated via `aria-labelledby`.
- Keyboard navigation follows native radio behavior (arrow keys).

## Examples

```html
<!-- Basic -->
<solaris-radio-group>
  <solaris-radio value="basic">Basic</solaris-radio>
  <solaris-radio value="pro">Pro</solaris-radio>
  <solaris-radio value="enterprise">Enterprise</solaris-radio>
</solaris-radio-group>

<!-- With form control -->
<solaris-radio-group [formControl]="planControl">
  <solaris-radio value="basic">Basic</solaris-radio>
  <solaris-radio value="pro">Pro</solaris-radio>
</solaris-radio-group>

<!-- Horizontal -->
<solaris-radio-group orientation="horizontal">
  <solaris-radio value="yes">Yes</solaris-radio>
  <solaris-radio value="no">No</solaris-radio>
</solaris-radio-group>

<!-- Disabled group -->
<solaris-radio-group [disabled]="true">
  <solaris-radio value="basic" [checked]="true">Basic</solaris-radio>
  <solaris-radio value="pro">Pro</solaris-radio>
</solaris-radio-group>
```

## Limitations (v1)

- Radio Group v1 does not support dynamic addition/removal of radios after initial render without re-syncing.
- Radio Group v1 is not a Segmented Control or Toggle Group.
- The checked state does not toggle off when clicking the already-selected radio (native radio behavior).
- Custom color is only available via CSS variables on individual radios, not arbitrary input props.
