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

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `label` | `string` | — | Group label text |
| `labelKey` | `string` | — | i18n key for group label |
| `disabled` | `boolean` | `false` | Disables the group and propagates to child options |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant |
| `density` | `'compact' \| 'comfortable'` | inherited | Density variant |
| `id` | `string` | auto-generated | Element ID |

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

## Limitations (v1)

- **Not** collapsible
- **No** "Select All" behavior
- **No** nested groups
- **No** group count
- **No** search
- **No** virtual scroll
- **No** tree behavior
