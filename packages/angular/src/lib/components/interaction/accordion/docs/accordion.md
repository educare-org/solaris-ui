# SolarisAccordionComponent

## Purpose

Accordion is a vertically stacked set of expandable sections. Each section has a
heading that acts as a control to show or hide its content. It supports both
single-expand and multi-expand behavior following the WAI-ARIA APG Accordion
pattern.

The Accordion is built on the `solaris-collapsible` primitive: each section is a
`SolarisCollapsibleComponent` that becomes controlled by the container when
projected inside it.

## API

### `solaris-accordion` — container

#### Inputs

| Input          | Type                                                  | Default          | Description                                                                                                               |
| -------------- | ----------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `appearance`   | `'boxed' \| 'lined'`                                  | `'boxed'`        | Visual mode. `boxed` renders each item as a bordered card; `lined` renders a flat list with a divider under each trigger. |
| `type`         | `'single' \| 'multiple'`                              | `'single'`       | Whether one or many panels can be open at once.                                                                           |
| `value`        | `SolarisAccordionValue \| SolarisAccordionValue[]`    | —                | Two-way binding with the open value(s).                                                                                   |
| `disabled`     | `boolean`                                             | `false`          | Disables all items.                                                                                                       |
| `allowToggle`  | `boolean`                                             | `true`           | In `single` mode, whether the open panel can be collapsed. When `false`, the open trigger is `aria-disabled`.             |
| `size`         | `'sm' \| 'md' \| 'lg'`                                | `'md'`           | Label, icon, and padding step. Propagated to every item; wins over per-item `size`.                                       |
| `density`      | `'compact' \| 'normal' \| 'comfortable' \| undefined` | `undefined`      | Spacing density (falls back to theme density). Propagated to every item.                                                  |
| `headingLevel` | `number` (`2`–`6`)                                    | `3`              | Heading level (`h2`–`h6`) used for each item header.                                                                      |
| `expandIcon`   | `string`                                              | `'chevron-down'` | Icon rendered at the end of each trigger.                                                                                 |

#### Outputs

| Output        | Type                    | Description                            |
| ------------- | ----------------------- | -------------------------------------- |
| `valueChange` | `SolarisAccordionModel` | Emitted when the open value(s) change. |

### `solaris-collapsible` — section item

When used inside `solaris-accordion`, the collapsible becomes an accordion
section. It requires a unique `value` input. See the Collapsible documentation
for the full API; the relevant inputs are:

#### Inputs

| Input          | Type                                                  | Default     | Description                                                                   |
| -------------- | ----------------------------------------------------- | ----------- | ----------------------------------------------------------------------------- |
| `value`        | `string \| number`                                    | —           | Unique identifier for the section (required inside an accordion).             |
| `label`        | `string`                                              | —           | Visible heading text.                                                         |
| `labelKey`     | `string`                                              | —           | i18n key resolved for the heading text.                                       |
| `ariaLabel`    | `string`                                              | —           | Accessible name when no visible label.                                        |
| `ariaLabelKey` | `string`                                              | —           | i18n key resolved for the accessible name.                                    |
| `disabled`     | `boolean`                                             | `false`     | Disables this item.                                                           |
| `size`         | `'sm' \| 'md' \| 'lg'`                                | `'md'`      | Ignored inside an accordion — the container `size` wins (standalone only).    |
| `density`      | `'compact' \| 'normal' \| 'comfortable' \| undefined` | `undefined` | Ignored inside an accordion — the container `density` wins (standalone only). |
| `icon`         | `string`                                              | —           | Per-item icon override for the trigger.                                       |
| `leadingIcon`  | `string`                                              | —           | Optional icon rendered at the start of the trigger, glued to the label.       |

## Import rule

The accordion control token (`SOLARIS_ACCORDION`) lives in
`model/accordion.tokens.ts`. Any component that consumes the token (such as
`SolarisCollapsibleComponent`) must import it directly from that module, never
from the accordion barrel (`../../accordion`). The barrel re-exports
`SolarisAccordionComponent`, which imports the collapsible primitive, so
importing the barrel from collapsible would create a circular module dependency
that breaks JIT/unit-test consumers of the published bundle.

## Accessibility

- Each header is a native heading (`h2`–`h6`) whose only child is the trigger
  `button`, per the APG Accordion pattern. The heading level is controlled by
  the container.
- The trigger `button` has `aria-expanded` and `aria-controls` pointing to the
  panel.
- The panel has `role="region"` and `aria-labelledby` referencing the trigger.
- When collapsed, the panel is `aria-hidden` and `inert`, removing its content
  from the accessibility tree and the tab order.
- In `single` mode with `allowToggle=false`, the open trigger is
  `aria-disabled="true"` and cannot be collapsed.
- Keyboard: Enter and Space toggle the disclosure via the native button. Tab
  and Shift+Tab move through all focusable elements (no roving tabindex),
  matching the APG recommendation.

## Visual variants

- **Appearance**: `boxed` (each item is a bordered card) or `lined` (flat list
  with a divider under each trigger, except the last item).
- **Type**: `single` (one open at a time) or `multiple` (several open).
- **Size × density**: the container `size`/`density` propagate to every item
  (see Collapsible for the 9-combination matrix); the trigger `min-height`
  always equals its `--solaris-control-height-<density>-<size>` ladder token,
  and the section gap follows the density gap tier.

## CSS Variables

The item styling is provided by `solaris-collapsible`; see its documentation
for the full variable list. Container-specific spacing:

| Variable                  | Default                    | Description                          |
| ------------------------- | -------------------------- | ------------------------------------ |
| `--solaris-accordion-gap` | `--solaris-density-gap-md` | Gap between sections (density tier). |

## Examples

### Single expand (default)

```html
<solaris-accordion [(value)]="openValue">
  <solaris-collapsible value="a" label="Section A">
    <p>Content A.</p>
  </solaris-collapsible>
  <solaris-collapsible value="b" label="Section B">
    <p>Content B.</p>
  </solaris-collapsible>
</solaris-accordion>
```

### Multiple expand

```html
<solaris-accordion type="multiple" [(value)]="openValues">
  <solaris-collapsible value="a" label="Section A">
    <p>Content A.</p>
  </solaris-collapsible>
  <solaris-collapsible value="b" label="Section B">
    <p>Content B.</p>
  </solaris-collapsible>
</solaris-accordion>
```

### Lined appearance with locked single mode

```html
<solaris-accordion appearance="lined" [allowToggle]="false">
  <solaris-collapsible value="a" label="Section A">
    <p>Content A.</p>
  </solaris-collapsible>
  <solaris-collapsible value="b" label="Section B">
    <p>Content B.</p>
  </solaris-collapsible>
</solaris-accordion>
```
