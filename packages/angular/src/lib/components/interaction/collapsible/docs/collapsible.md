# SolarisCollapsibleComponent

## Purpose

Collapsible is a disclosure component that toggles the visibility of a content
region. It provides an accessible trigger button with an expanding chevron and
a collapsible panel. It is the base primitive for Accordion.

## API

### Inputs

| Input          | Type                   | Default          | Description                                                                      |
| -------------- | ---------------------- | ---------------- | -------------------------------------------------------------------------------- |
| `open`         | `boolean`              | `false`          | Two-way binding that controls the open state (standalone mode).                  |
| `value`        | `string \| number`     | —                | Unique identifier used when controlled by an Accordion.                          |
| `appearance`   | `'boxed' \| 'lined'`   | `'boxed'`        | Visual mode. `boxed` is a bordered card; `lined` is a divider under the trigger. |
| `label`        | `string`               | —                | Visible trigger text.                                                            |
| `labelKey`     | `string`               | —                | i18n key resolved for the trigger text.                                          |
| `ariaLabel`    | `string`               | —                | Accessible name used when no visible label.                                      |
| `ariaLabelKey` | `string`               | —                | i18n key resolved for the accessible name.                                       |
| `disabled`     | `boolean`              | `false`          | Disables the trigger interaction.                                                |
| `size`         | `'sm' \| 'md' \| 'lg'` | `'md'`           | Reserved for density variants.                                                   |
| `icon`         | `string`               | `'chevron-down'` | Icon rendered at the end of the trigger.                                         |
| `leadingIcon`  | `string`               | —                | Optional icon rendered at the start of the trigger, glued to the label.          |

### Outputs

| Output       | Type      | Description                          |
| ------------ | --------- | ------------------------------------ |
| `openChange` | `boolean` | Emitted when the open state changes. |

## Controlled mode (Accordion)

When a `solaris-collapsible` is projected inside a `solaris-accordion`, it acts
as an accordion section: the open state is owned by the container, a heading is
rendered around the trigger, and `value` is used for identification. In that
mode `open`/`openChange` are ignored and the `appearance`, `headingLevel`, and
`expandIcon` are inherited from the container.

## Import rule

When resolving the accordion control token (`SOLARIS_ACCORDION`), import it
directly from the token module
(`../../accordion/model/accordion.tokens`), never from the accordion barrel.
The barrel re-exports `SolarisAccordionComponent`, which imports this component,
so importing the barrel would create a circular module dependency that breaks
JIT/unit-test consumers of the published bundle.

## Accessibility

- The trigger is a native `button` with `aria-expanded` and `aria-controls`
  pointing to the panel.
- The panel has `role="region"` and `aria-labelledby` referencing the trigger.
- When collapsed, the panel is `aria-hidden` and `inert`, removing its content
  from the accessibility tree and the tab order.
- In Accordion mode, the trigger is wrapped in a heading (`h2`–`h6`) per the APG
  Accordion pattern.
- Keyboard: Enter and Space toggle the disclosure via the native button.

## Visual variants

- **Appearance**: `boxed` (bordered card) or `lined` (divider under the
  trigger, except the last sibling).
- **Size**: `sm`, `md`, `lg` control the reserved density of the component.

## CSS Variables

| Variable                                         | Default                           | Description                     |
| ------------------------------------------------ | --------------------------------- | ------------------------------- |
| `--solaris-collapsible-trigger-padding`          | spacing tokens                    | Padding of the trigger.         |
| `--solaris-collapsible-trigger-gap`              | `--solaris-spacing-2`             | Gap between label and chevron.  |
| `--solaris-collapsible-trigger-color`            | `--solaris-neutral-text-body`     | Trigger text color.             |
| `--solaris-collapsible-trigger-hover-background` | `--solaris-neutral-subtle`        | Trigger hover background.       |
| `--solaris-collapsible-icon-size`                | `--solaris-spacing-4`             | Chevron icon size.              |
| `--solaris-collapsible-panel-padding`            | `--solaris-spacing-3`             | Inner padding of the panel.     |
| `--solaris-collapsible-radius`                   | `--solaris-radius-sm`             | Border radius of the container. |
| `--solaris-collapsible-border-color`             | `--solaris-neutral-border-subtle` | Container border color.         |

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

### Leading icon

```html
<solaris-collapsible label="Profile" leadingIcon="user">
  <p>Hidden content.</p>
</solaris-collapsible>
```
