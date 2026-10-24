# Solaris Option Group

## Purpose

`SolarisOptionGroupComponent` groups related options inside a selector component. It provides a visual label and can propagate disabled state to child options.

## When to use

- To categorize options inside Select, Multi Select, or Autocomplete.
- When options belong to logical sections (e.g., "Academic", "Financial").
- When a set of options should be disabled together.

## When not to use

- As a standalone component without options.
- For collapsible sections. v1 does not support collapsible groups.
- For nested groups. v1 does not support nested option groups.

## API

### Inputs

| Input      | Type                                     | Default            | Description                                                       |
| ---------- | ---------------------------------------- | ------------------ | ----------------------------------------------------------------- |
| `label`    | `string`                                 | —                  | Group label text                                                  |
| `labelKey` | `string`                                 | —                  | i18n key for group label                                          |
| `disabled` | `boolean`                                | `false`            | Disables the group and propagates to child options                |
| `size`     | `'sm' \| 'md' \| 'lg'`                   | parent / `'md'`    | Size variant (own input wins, else outer selector)                |
| `density`  | `'compact' \| 'normal' \| 'comfortable'` | parent / inherited | Density variant (own input wins, else outer selector, else theme) |
| `id`       | `string`                                 | auto-generated     | Element ID                                                        |

## Sizes

| Size | Label typography                    |
| ---- | ----------------------------------- |
| `sm` | Uppercase, `xs` font size           |
| `md` | Uppercase, `sm` font size (default) |
| `lg` | Uppercase, `md` font size           |

## Density

| Density       | Effect                    |
| ------------- | ------------------------- |
| `compact`     | No gap between items      |
| `normal`      | `spacing-1` gap (default) |
| `comfortable` | `spacing-2` gap           |

### Size and density inheritance

Like Option, the group is a standalone list wrapper with **no** control
height. Its 9 explicit `[data-size][data-density]` combinations adjust label
typography (`sm → xs`, `md → sm`, `lg → md`) and gaps only. The host exposes
effective `data-size` and `data-density`: an explicit input wins, otherwise the
group forwards the outer `solaris-select` / `solaris-multi-select` values (via
`SOLARIS_OPTION_PARENT` with `skipSelf`), falling back to `'md'` and the theme
density. Child options always resolve through the group, so rows match the
group label scale.

## CSS Variables

Option Group tokens can be customized on the host or a parent element:

| Token                                | Purpose                       |
| ------------------------------------ | ----------------------------- |
| `--solaris-option-group-padding-x`   | Horizontal padding            |
| `--solaris-option-group-padding-y`   | Vertical padding              |
| `--solaris-option-group-gap`         | Gap between label and options |
| `--solaris-option-group-label-color` | Group label color             |

## Disabled Propagation

When an Option Group is disabled, it propagates the disabled state to all child `solaris-option` components. Individual option `disabled` continues to have priority.

```html
<solaris-option-group label="Maintenance" [disabled]="true">
  <solaris-option value="item1">Item 1</solaris-option>
  <solaris-option value="item2">Item 2</solaris-option>
</solaris-option-group>
```

## Accessibility

- `role="group"` on host
- `aria-label` or `aria-labelledby` based on the label
- Group label is rendered as a visual heading inside the group

## Examples

```html
<!-- Basic group -->
<solaris-option-group label="Academic">
  <solaris-option value="students">Students</solaris-option>
  <solaris-option value="classes">Classes</solaris-option>
</solaris-option-group>

<!-- Inside a select -->
<solaris-select formControlName="role" label="Role">
  <solaris-option-group label="Academic">
    <solaris-option value="students">Students</solaris-option>
  </solaris-option-group>
  <solaris-option-group label="Financial">
    <solaris-option value="tuition">Tuition</solaris-option>
  </solaris-option-group>
</solaris-select>

<!-- Disabled group -->
<solaris-option-group label="Maintenance" [disabled]="true">
  <solaris-option value="item1">Item 1</solaris-option>
  <solaris-option value="item2">Item 2</solaris-option>
</solaris-option-group>

<!-- Size -->
<solaris-option-group label="Academic" size="sm">
  <solaris-option value="students">Students</solaris-option>
</solaris-option-group>
```

## Limitations (v1)

- **Not** collapsible
- **No** "Select All" behavior
- **No** nested groups
- **No** group count
- **No** search
- **No** virtual scroll
- **No** tree behavior
