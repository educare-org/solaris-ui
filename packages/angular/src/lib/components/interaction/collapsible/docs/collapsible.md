# SolarisCollapsibleComponent

## Purpose

Collapsible is a disclosure component that toggles the visibility of a content
region. It provides an accessible trigger button with an expanding chevron and
a collapsible panel. It is the base primitive for Accordion.

## API

### Inputs

| Input          | Type                                                  | Default          | Description                                                                                                              |
| -------------- | ----------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `open`         | `boolean`                                             | `false`          | Two-way binding that controls the open state (standalone mode).                                                          |
| `value`        | `string \| number`                                    | —                | Unique identifier used when controlled by an Accordion.                                                                  |
| `appearance`   | `'boxed' \| 'lined' \| 'plain'`                       | `'boxed'`        | Visual mode. `boxed` is a bordered card; `lined` is a divider under the trigger; `plain` has no chrome.                  |
| `label`        | `string`                                              | —                | Visible trigger text.                                                                                                    |
| `labelKey`     | `string`                                              | —                | i18n key resolved for the trigger text.                                                                                  |
| `ariaLabel`    | `string`                                              | —                | Accessible name used when no visible label.                                                                              |
| `ariaLabelKey` | `string`                                              | —                | i18n key resolved for the accessible name.                                                                               |
| `disabled`     | `boolean`                                             | `false`          | Disables the trigger interaction.                                                                                        |
| `size`         | `'sm' \| 'md' \| 'lg'`                                | `'md'`           | Label, icon, and padding step. Combines with `density` into a 3×3 matrix.                                                |
| `density`      | `'compact' \| 'normal' \| 'comfortable' \| undefined` | `undefined`      | Spacing density. Standalone it falls back to the theme density; inside an accordion the container `density` always wins. |
| `icon`         | `string`                                              | `'chevron-down'` | Icon rendered at the end of the trigger.                                                                                 |
| `leadingIcon`  | `string`                                              | —                | Optional icon rendered at the start of the trigger, glued to the label.                                                  |

### Outputs

| Output       | Type      | Description                          |
| ------------ | --------- | ------------------------------------ |
| `openChange` | `boolean` | Emitted when the open state changes. |

## Controlled mode (Accordion)

When a `solaris-collapsible` is projected inside a `solaris-accordion`, it acts
as an accordion section: the open state is owned by the container, a heading is
rendered around the trigger, and `value` is used for identification. In that
mode `open`/`openChange` are ignored and the `appearance`, `size`, `density`,
`headingLevel`, and `expandIcon` are inherited from the container — per-item
`size`/`density` inputs never win over the container, so every section renders
with the same outer geometry.

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

- **Appearance**: `boxed` (bordered card), `lined` (divider under the
  trigger) or `plain` (no borders).
- **Size × density**: `size` selects the label/icon/padding step
  (`sm`: 16px label + 18px chevron, `md`: 18px + 20px, `lg`: 20px + 24px);
  the effective density resolves the padding/gap tier
  (`--solaris-density-padding-*` / `--solaris-density-gap-*`) and the
  trigger `min-height` always equals its
  `--solaris-control-height-<density>-<size>` ladder token
  (28→52px in 4px steps), so a default (`md`) trigger aligns with sibling
  controls. All 9 `size × density` combinations resolve distinctly.
  Standalone, density falls back to the theme density.

## Density

| Value         | Effect                                                        |
| ------------- | ------------------------------------------------------------- |
| `compact`     | Reduced padding, gap, and trigger height                      |
| `comfortable` | Increased padding, gap, and trigger height                    |
| `undefined`   | Inherits from the accordion container, then the theme density |

## CSS Variables

| Variable                                     | Default                                             | Description                                                                         |
| -------------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `--solaris-collapsible-trigger-min-height`   | `--solaris-control-height-normal-md`                | Trigger min-height (ladder token of the active combination).                        |
| `--solaris-collapsible-trigger-padding-y`    | spacing tokens                                      | Vertical padding of the trigger.                                                    |
| `--solaris-collapsible-trigger-padding-x`    | `--solaris-density-padding-md`                      | Horizontal padding of the trigger (and panel indent).                               |
| `--solaris-collapsible-trigger-gap`          | `--solaris-density-gap-md`                          | Gap between label and chevron.                                                      |
| `--solaris-collapsible-trigger-font-size`    | `--solaris-font-size-md`                            | Trigger label font size (driven by `size`).                                         |
| `--solaris-collapsible-trigger-color`        | `--solaris-neutral-text-secondary`                  | Trigger text color (body on hover).                                                 |
| `--solaris-collapsible-icon-size`            | `--solaris-font-size-lg`                            | Chevron and leading icon size (driven by `size`).                                   |
| `--solaris-collapsible-panel-font-size`      | `--solaris-font-size-sm`                            | Panel body font size (driven by `size`).                                            |
| `--solaris-collapsible-panel-padding-x`      | trigger horizontal padding                          | Panel horizontal indent (follows the trigger).                                      |
| `--solaris-collapsible-panel-padding-bottom` | `0` collapsed / `--solaris-density-padding-md` open | Panel bottom padding. Zero while collapsed so no content leaks from the zero track. |
| `--solaris-collapsible-radius`               | `--solaris-radius-md`                               | Border radius of the container.                                                     |
| `--solaris-collapsible-border-color`         | `--solaris-neutral-border-subtle`                   | Container border color.                                                             |

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
