# Solaris$Name$Component

## Purpose

Brief description of what this component does.

## API

### Inputs

| Input      | Type                   | Default | Description                       |
| ---------- | ---------------------- | ------- | --------------------------------- |
| `value`    | `string`               | —       | The current value                 |
| `size`     | `'sm' \| 'md' \| 'lg'` | `'md'`  | Component size                    |
| `disabled` | `boolean`              | `false` | Whether the component is disabled |

### Outputs

| Output        | Type     | Description                    |
| ------------- | -------- | ------------------------------ |
| `valueChange` | `string` | Emitted when the value changes |

## Accessibility

Describe ARIA attributes and keyboard interactions.

## Visual variants

Describe each visual variant this component exposes (`appearance`, `size`, `density`, `radius`, `color`, `orientation`). Remove this section if the component has no variant inputs.

## CSS Variables

| Variable                   | Default                  | Description      |
| -------------------------- | ------------------------ | ---------------- |
| `--solaris-$name$-color`   | `--solaris-text-default` | Text color       |
| `--solaris-$name$-bg`      | `--solaris-surface-base` | Background color |
| `--solaris-$name$-radius`  | `--solaris-radius-md`    | Border radius    |
| `--solaris-$name$-padding` | `--solaris-spacing-3`    | Inner padding    |

Remove this section if the component defines no `--solaris-*` tokens.

## Examples

### Basic

```html
<solaris-$name$ />
```

