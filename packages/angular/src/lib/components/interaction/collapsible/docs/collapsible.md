# SolarisCollapsibleComponent

## Purpose

Collapsible is a disclosure component that toggles the visibility of a content
region. It provides an accessible trigger button with an expanding chevron and
a collapsible panel. It is the base primitive for Accordion.

## API

### Inputs

| Input          | Type                   | Default | Description                                   |
| -------------- | ---------------------- | ------- | --------------------------------------------- |
| `open`         | `boolean`              | `false` | Two-way binding that controls the open state. |
| `label`        | `string`               | —       | Visible trigger text.                         |
| `labelKey`     | `string`               | —       | i18n key resolved for the trigger text.       |
| `ariaLabel`    | `string`               | —       | Accessible name used when no visible label.   |
| `ariaLabelKey` | `string`               | —       | i18n key resolved for the accessible name.    |
| `disabled`     | `boolean`              | `false` | Disables the trigger interaction.             |
| `size`         | `'sm' \| 'md' \| 'lg'` | `'md'`  | Reserved for density variants.                |

### Outputs

| Output       | Type      | Description                          |
| ------------ | --------- | ------------------------------------ |
| `openChange` | `boolean` | Emitted when the open state changes. |

## Accessibility

- The trigger is a native `button` with `aria-expanded` and `aria-controls`
  pointing to the panel.
- The panel has `role="region"` and `aria-labelledby` referencing the trigger.
- When collapsed, the panel is `aria-hidden` and `inert`, removing its content
  from the accessibility tree and the tab order.
- Keyboard: Enter and Space toggle the disclosure via the native button.

## Visual variants

- **Size**: `sm`, `md`, `lg` control the reserved density of the component.

## CSS Variables

| Variable                                         | Default                    | Description                     |
| ------------------------------------------------ | -------------------------- | ------------------------------- |
| `--solaris-collapsible-trigger-padding`          | spacing tokens             | Padding of the trigger.         |
| `--solaris-collapsible-trigger-gap`              | `--solaris-spacing-2`      | Gap between label and chevron.  |
| `--solaris-collapsible-trigger-color`            | `--solaris-text-default`   | Trigger text color.             |
| `--solaris-collapsible-trigger-hover-background` | `--solaris-surface-subtle` | Trigger hover background.       |
| `--solaris-collapsible-icon-size`                | `--solaris-spacing-4`      | Chevron icon size.              |
| `--solaris-collapsible-panel-padding`            | `--solaris-spacing-3`      | Inner padding of the panel.     |
| `--solaris-collapsible-radius`                   | `--solaris-radius-sm`      | Border radius of the container. |
| `--solaris-collapsible-border-color`             | `--solaris-border-subtle`  | Container border color.         |

## Examples

### Basic

```html
<solaris-collapsible label="Details">
  <p>Hidden content.</p>
</solaris-collapsible>
```

### Controlled open state

```html
<solaris-collapsible [(open)]="isOpen" label="Details">
  <p>Hidden content.</p>
</solaris-collapsible>
```

### Disabled

```html
<solaris-collapsible label="Details" disabled>
  <p>Hidden content.</p>
</solaris-collapsible>
```
