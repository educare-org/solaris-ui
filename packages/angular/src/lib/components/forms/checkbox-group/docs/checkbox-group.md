# Solaris Checkbox Group

## Purpose

Checkbox Group is a form control component that manages multiple `<solaris-checkbox>` children as a group. It resolves multi-selection of related options using an array value.

## Checkbox vs Checkbox Group

| Feature     | Checkbox      | Checkbox Group                |
| ----------- | ------------- | ----------------------------- |
| Value type  | `boolean`     | `unknown[]`                   |
| Selection   | Single toggle | Multiple options              |
| Children    | None          | `<solaris-checkbox>` elements |
| Select-all  | Manual        | Built-in optional             |
| Validation  | Required      | min/max selected              |
| Orientation | N/A           | vertical/horizontal           |
| Layout      | N/A           | list/grid                     |

## When to use

- Users need to select multiple items from a list of options.
- Options are related and belong to a single category.
- A checkbox group with a visible label improves context.
- Select-all behavior is desired.

## When not to use

- **Single selection only** — use Radio Group instead.
- **Hierarchical selection** (parent/child with expand/collapse) — use Checkbox Tree (future component).
- **Nested groups** — Checkbox Group v1 does not support nesting.
- **Boolean toggle** — use a single Checkbox.
- **On/off action** — use Switch.

## API

```typescript
@Component({
  selector: 'solaris-checkbox-group',
  standalone: true,
})
class SolarisCheckboxGroupComponent {
  // Layout
  orientation: 'vertical' | 'horizontal'; // vertical
  layout: 'list' | 'grid'; // list
  columns: 1 | 2 | 3 | 4 | 'auto'; // 1

  // Visual
  density: 'compact' | 'normal' | 'comfortable'; // inherited from theme
  size: 'sm' | 'md' | 'lg'; // md (inherited by children unless a child sets its own)

  // State
  disabled: boolean; // false
  readonly: boolean; // false
  required: boolean; // false
  invalid: boolean | undefined; // undefined

  // Standalone label/hint/error
  label: string;
  labelKey: string;
  hint: string;
  hintKey: string;
  error: string;
  errorKey: string;

  // Selection bounds
  minSelected: number;
  maxSelected: number;

  // Comparison
  compareWith: (a: unknown, b: unknown) => boolean; // Object.is

  // Select-all
  selectAll: boolean; // false
  selectAllLabel: string;
  selectAllLabelKey: string;

  // Accessibility
  ariaLabel: string;
  ariaLabelKey: string;

  // Events
  valueChange: unknown[];
  change: unknown[];

  // ControlValueAccessor
  writeValue(value: unknown[] | null): void;
  registerOnChange(fn: (value: unknown[]) => void): void;
  registerOnTouched(fn: () => void): void;
  setDisabledState(isDisabled: boolean): void;
}
```

## Value (array)

The group value is an array of selected child values.

```html
<solaris-checkbox-group formControlName="interests">
  <solaris-checkbox value="sports">Esportes</solaris-checkbox>
  <solaris-checkbox value="finance">Finanças</solaris-checkbox>
  <solaris-checkbox value="technology">Tecnologia</solaris-checkbox>
</solaris-checkbox-group>
```

Value: `['sports', 'finance']`

## compareWith

By default, values are compared using `Object.is`. For complex objects, provide a custom comparator:

```typescript
compareUser(a: User, b: User): boolean {
  return a.id === b.id;
}
```

```html
<solaris-checkbox-group [formControl]="usersControl" [compareWith]="compareUser">
  <solaris-checkbox [value]="userA">User A</solaris-checkbox>
  <solaris-checkbox [value]="userB">User B</solaris-checkbox>
</solaris-checkbox-group>
```

## Children

Children must be `<solaris-checkbox>` elements with a `value` attribute.

```html
<solaris-checkbox-group formControlName="permissions">
  <solaris-checkbox value="read">Read</solaris-checkbox>
  <solaris-checkbox value="write">Write</solaris-checkbox>
  <solaris-checkbox value="delete">Delete</solaris-checkbox>
</solaris-checkbox-group>
```

## Orientation

Controls the direction of options when `layout="list"`.

```html
<solaris-checkbox-group orientation="vertical"> ... </solaris-checkbox-group> <solaris-checkbox-group orientation="horizontal"> ... </solaris-checkbox-group>
```

## Layout

- `list` (default) — options flow in a single column/row based on orientation.
- `grid` — options are arranged in a CSS grid based on `columns`.

```html
<solaris-checkbox-group layout="grid" [columns]="2"> ... </solaris-checkbox-group>
```

## Columns

Only applies when `layout="grid"`. Supported values: `1`, `2`, `3`, `4`, `'auto'`.

- `'auto'` uses `auto-fill` with a minimum column width.

## Sizes

| Size | Effect                 |
| ---- | ---------------------- |
| `sm` | Compact option sizing  |
| `md` | Standard option sizing |
| `lg` | Large option sizing    |

Default: `md`

Size is exposed on the group host via `data-size` and propagates to all
child checkboxes through the `SOLARIS_CHECKBOX_GROUP` token — the same
inheritance contract as `solaris-switch-group`. A child checkbox keeps its
own `size`/`density` when set explicitly.

```html
<solaris-checkbox-group size="lg" density="compact">
  <!-- inherits lg + compact -->
  <solaris-checkbox value="a">A</solaris-checkbox>
  <!-- own size wins over the group -->
  <solaris-checkbox value="b" size="sm">B</solaris-checkbox>
</solaris-checkbox-group>
```

The child resolves `size` as own input → group → `'md'`, and `density`
as own input → group → theme density. Both are exposed on the child
host as `data-size`/`data-density` with the effective values.

## Density

| Density       | List gap | Grid row/column gaps |
| ------------- | -------- | -------------------- |
| `compact`     | 6px      | 2px                  |
| `normal`      | 8px      | 4px                  |
| `comfortable` | 12px     | 6px                  |

Default: inherited from the theme.

When not provided, the group falls back to the theme density, and children
without their own `density` inherit the group value.

## CSS Variables

General component tokens available for advanced customization:

| Token                                        | Purpose                   |
| -------------------------------------------- | ------------------------- |
| `--solaris-checkbox-group-gap`               | Gap between options       |
| `--solaris-checkbox-group-row-gap`           | Row gap in grid layout    |
| `--solaris-checkbox-group-column-gap`        | Column gap in grid layout |
| `--solaris-checkbox-group-select-all-gap`    | Margin below select-all   |
| `--solaris-checkbox-group-label-color`       | Label text color          |
| `--solaris-checkbox-group-label-font-size`   | Label font size           |
| `--solaris-checkbox-group-label-line-height` | Label line height         |
| `--solaris-checkbox-group-hint-color`        | Hint text color           |
| `--solaris-checkbox-group-hint-font-size`    | Hint font size            |
| `--solaris-checkbox-group-hint-line-height`  | Hint line height          |
| `--solaris-checkbox-group-error-color`       | Error text color          |
| `--solaris-checkbox-group-error-font-size`   | Error font size           |
| `--solaris-checkbox-group-error-line-height` | Error line height         |

## selectAll

When `true`, renders a "Select all" checkbox above the options.

States:

- **no children selected** — unchecked.
- **some children selected** — indeterminate.
- **all enabled children selected** — checked.

Click behavior:

- **unchecked** → selects all enabled, non-readonly children.
- **indeterminate** → selects all enabled, non-readonly children.
- **checked** → deselects all enabled, non-readonly children.

```html
<solaris-checkbox-group [selectAll]="true" selectAllLabel="Select all"> ... </solaris-checkbox-group>
```

## minSelected

When set, the group becomes invalid if fewer than the minimum are selected.

```html
<solaris-checkbox-group [minSelected]="1" label="Required at least 1"> ... </solaris-checkbox-group>
```

## maxSelected

When set, the group becomes invalid if more than the maximum are selected.

> v1 limitation: maxSelected only validates. It does not automatically disable remaining options or block selection.

```html
<solaris-checkbox-group [maxSelected]="2" label="Maximum 2"> ... </solaris-checkbox-group>
```

## Disabled

Disabling the group propagates to all children and prevents interaction.

```html
<solaris-checkbox-group [disabled]="true"> ... </solaris-checkbox-group>
```

Individual child disabled is preserved:

- `disabled` on a child checkbox is not overridden by the group.
- select-all does not affect disabled children.

## Readonly

Readonly prevents value changes while keeping the display legible.

```html
<solaris-checkbox-group [readonly]="true"> ... </solaris-checkbox-group>
```

- Visual appearance differs from disabled (no opacity reduction).
- select-all does not affect readonly children.
- Individual child readonly is preserved.

## Standalone label/hint/error

The group supports its own label, hint, and error for standalone use.

```html
<solaris-checkbox-group label="Interests" hint="Select at least one option" error="Please select at least one option" [minSelected]="1"> ... </solaris-checkbox-group>
```

i18n keys are also supported:

```html
<solaris-checkbox-group labelKey="interests.label" hintKey="interests.hint" errorKey="interests.error"> ... </solaris-checkbox-group>
```

## Form Field integration

```html
<solaris-form-field label="Interests" hint="Select at least one option" error="Selection is required">
  <solaris-checkbox-group formControlName="interests">
    <solaris-checkbox value="sports">Esportes</solaris-checkbox>
    <solaris-checkbox value="finance">Finanças</solaris-checkbox>
  </solaris-checkbox-group>
</solaris-form-field>
```

The Form Field coordinates:

- focused state.
- disabled state.
- readonly state.
- required state.
- invalid state.
- `aria-describedby` IDs.

When using Form Field, leave label/hint/error on the group unset to avoid duplication.

## Accessibility

- Uses `role="group"` on the host.
- Standalone label is linked via `aria-labelledby`.
- Hint and error are linked via `aria-describedby`.
- `aria-label` and `aria-labelledby` are preserved when provided by the consumer.
- Form Field `aria-describedby` IDs are forwarded.
- Invalid state is reflected via `aria-invalid`.
- Required state is reflected via `aria-required`.
- A required group renders a `*` marker next to the group label.
- Select-all checkbox has an accessible name.
- Children maintain their natural tab order.
- Focus tracking uses `focusin`/`focusout` events.
- No `role="radiogroup"`, `role="grid"`, or `role="tree"`.
- No roving tabindex or keyboard capture.

## Examples

```html
<!-- Basic vertical -->
<solaris-checkbox-group formControlName="interests">
  <solaris-checkbox value="sports">Esportes</solaris-checkbox>
  <solaris-checkbox value="finance">Finanças</solaris-checkbox>
  <solaris-checkbox value="technology">Tecnologia</solaris-checkbox>
</solaris-checkbox-group>

<!-- Horizontal -->
<solaris-checkbox-group formControlName="filter" orientation="horizontal">
  <solaris-checkbox value="active">Ativo</solaris-checkbox>
  <solaris-checkbox value="pending">Pendente</solaris-checkbox>
</solaris-checkbox-group>

<!-- Grid -->
<solaris-checkbox-group formControlName="modules" layout="grid" [columns]="2">
  <solaris-checkbox value="academic">Acadêmico</solaris-checkbox>
  <solaris-checkbox value="finance">Financeiro</solaris-checkbox>
  <solaris-checkbox value="reports">Relatórios</solaris-checkbox>
  <solaris-checkbox value="content">Conteúdo</solaris-checkbox>
</solaris-checkbox-group>

<!-- Select all -->
<solaris-checkbox-group formControlName="permissions" [selectAll]="true">
  <solaris-checkbox value="read">Ler</solaris-checkbox>
  <solaris-checkbox value="write">Editar</solaris-checkbox>
  <solaris-checkbox value="delete">Excluir</solaris-checkbox>
</solaris-checkbox-group>

<!-- Min selected -->
<solaris-form-field label="Pick at least one" error="Min 1 required">
  <solaris-checkbox-group formControlName="options" [minSelected]="1">
    <solaris-checkbox value="a">Option A</solaris-checkbox>
    <solaris-checkbox value="b">Option B</solaris-checkbox>
  </solaris-checkbox-group>
</solaris-form-field>

<!-- Max selected -->
<solaris-form-field label="Pick up to 2" error="Max 2 allowed">
  <solaris-checkbox-group formControlName="options" [maxSelected]="2">
    <solaris-checkbox value="a">Option A</solaris-checkbox>
    <solaris-checkbox value="b">Option B</solaris-checkbox>
    <solaris-checkbox value="c">Option C</solaris-checkbox>
  </solaris-checkbox-group>
</solaris-form-field>

<!-- Disabled group -->
<solaris-checkbox-group [disabled]="true">
  <solaris-checkbox value="read" [checked]="true">Read</solaris-checkbox>
  <solaris-checkbox value="write">Write</solaris-checkbox>
</solaris-checkbox-group>

<!-- Readonly group -->
<solaris-checkbox-group [readonly]="true">
  <solaris-checkbox value="read" [checked]="true">Read</solaris-checkbox>
  <solaris-checkbox value="write">Write</solaris-checkbox>
</solaris-checkbox-group>

<!-- Standalone label/hint/error -->
<solaris-checkbox-group label="Newsletter preferences" hint="Choose which newsletters you want to receive." error="Select at least one." [minSelected]="1">
  <solaris-checkbox value="weekly">Weekly digest</solaris-checkbox>
  <solaris-checkbox value="promotions">Promotions</solaris-checkbox>
</solaris-checkbox-group>

<!-- Form Field integration -->
<solaris-form-field label="Permissions" hint="Select the permissions for this role." error="At least one permission is required.">
  <solaris-checkbox-group formControlName="permissions" [minSelected]="1">
    <solaris-checkbox value="read">Read</solaris-checkbox>
    <solaris-checkbox value="write">Write</solaris-checkbox>
    <solaris-checkbox value="delete">Delete</solaris-checkbox>
  </solaris-checkbox-group>
</solaris-form-field>

<!-- Complex values -->
<solaris-checkbox-group [formControl]="users" [compareWith]="compareUser">
  <solaris-checkbox [value]="userA">User A</solaris-checkbox>
  <solaris-checkbox [value]="userB">User B</solaris-checkbox>
</solaris-checkbox-group>
```

## Limitations (v1)

- **maxSelected only validates** — does not disable remaining options or block selection.
- **No nested checkbox group** — hierarchical/parent-child selection is not supported.
- **No checkbox tree** — expand/collapse nodes are future work.
- **No search/filter** — inline filtering is not included.
- **No virtual scroll** — not optimized for large datasets.
- **Columns are not responsive** — use static column values or `'auto'`.
- **No enforceMaxSelection** — max validation does not block further selection.

## Checkbox Tree (future evolution)

Checkbox Tree with nested hierarchy, parent/child propagation, expand/collapse, and search/filter will be a separate component in a future release.
