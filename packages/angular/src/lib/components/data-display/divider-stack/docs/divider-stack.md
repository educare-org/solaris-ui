# SolarisDividerStackComponent

## Purpose

Stacks projected content vertically and inserts a visual separator between
each item. Use it to group related content blocks with a consistent divider
rhythm.

## API

### Inputs

| Input     | Type                                   | Default  | Description                                 |
| --------- | -------------------------------------- | -------- | ------------------------------------------- |
| `spacing` | `'none' \| 'sm' \| 'md' \| 'lg'`       | `'md'`   | Vertical gap around each separator.         |
| `inset`   | `'none' \| 'start' \| 'end' \| 'both'` | `'none'` | Horizontal inset applied to the separators. |

### Outputs

None.

## Accessibility

- The stack is a presentational container; it does not add semantic roles.
- Projected content keeps its own accessibility semantics.
- Separators are purely visual and do not receive focus.

## Visual variants

- **Spacing**: `none`, `sm`, `md`, `lg` control the vertical rhythm.
- **Inset**: `start`, `end`, `both` inset the separator line horizontally.

## CSS Variables

| Variable                              | Default                     | Description                    |
| ------------------------------------- | --------------------------- | ------------------------------ |
| `--solaris-divider-stack-gap`         | spacing token per `spacing` | Vertical rhythm between items. |
| `--solaris-divider-stack-inset-start` | `--solaris-spacing-3`       | Inset from the start edge.     |
| `--solaris-divider-stack-inset-end`   | `--solaris-spacing-3`       | Inset from the end edge.       |

## Examples

### Basic

```html
<solaris-divider-stack>
  <p>First block</p>
  <p>Second block</p>
  <p>Third block</p>
</solaris-divider-stack>
```

### Compact with inset

```html
<solaris-divider-stack spacing="sm" inset="both">
  <p>First block</p>
  <p>Second block</p>
</solaris-divider-stack>
```
