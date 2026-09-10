# Solaris Selection Card

## Purpose

Selection Card presents a selectable option using a card-sized target. It
supports two selection modes: `radio` (mutually exclusive, for use inside
`solaris-radio-group`) and `switch` (standalone boolean toggle with switch
styling). Use it when an option needs supporting content such as a title,
description, price, or icon.

## When to use

- Choosing one plan, package, preference, or configuration (radio mode).
- Toggling a single option on/off with a switch affordance (switch mode).
- Presenting options in a grid or list with more context than a standard
  radio label or switch label.

## When not to use

- Do not use radio mode for multiple selection; use Checkbox Group instead.
- Do not use switch mode inside `solaris-radio-group`; it is standalone only.
- Do not project buttons, links, or other interactive controls into a card.
- Do not use it as a general-purpose clickable Card.

## API

### SolarisSelectionCardComponent

**Selector:** `solaris-selection-card`

| Input               | Type                                                                                 | Default              | Description                                                 |
| ------------------- | ------------------------------------------------------------------------------------ | -------------------- | ----------------------------------------------------------- |
| `checked`           | `boolean`                                                                            | `false`              | Checked state for standalone use.                           |
| `value`             | `unknown`                                                                            | `undefined`          | Value managed by `SolarisRadioGroupComponent` (radio mode). |
| `name`              | `string`                                                                             | generated in a group | Native radio name (radio mode).                             |
| `selection`         | `'radio' \| 'switch'`                                                                | `'radio'`            | Selection control type.                                     |
| `selectionPosition` | `'start' \| 'end'`                                                                   | `'start'`            | Control side: before (`start`) or after (`end`) content.    |
| `mediaPosition`     | `'top' \| 'start'`                                                                   | `'top'`              | Media layout: full-width or side thumb.                     |
| `disabled`          | `boolean`                                                                            | `false`              | Prevents interaction.                                       |
| `readonly`          | `boolean`                                                                            | `false`              | Preserves the value and prevents changes.                   |
| `required`          | `boolean`                                                                            | `false`              | Sets the native required state.                             |
| `invalid`           | `boolean`                                                                            | `false`              | Applies invalid styling and `aria-invalid`.                 |
| `appearance`        | `'surface' \| 'outline' \| 'tonal' \| 'glass'`                                       | `'surface'`          | Controls the unselected card surface.                       |
| `color`             | `'neutral' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'custom'` | `'neutral'`          | Semantic selected-state color.                              |
| `size`              | `'sm' \| 'md' \| 'lg'`                                                               | `'md'`               | Controls padding and indicator size.                        |
| `radius`            | `'none' \| 'sm' \| 'lg' \| 'xl'`                                                     | `'lg'`               | Controls card radius.                                       |
| `density`           | `'compact' \| 'normal' \| 'comfortable'`                                             | inherited            | Controls spacing.                                           |
| `ariaLabel`         | `string`                                                                             | `undefined`          | Accessible label when projected content is not textual.     |
| `ariaLabelKey`      | `string`                                                                             | `undefined`          | Translation key for `ariaLabel`.                            |

> Selection Card v2 ships with zero spacing by default (`padding`, `gap` and
> section margins are `0`). `size` and `density` are the opt-in sources of
> spacing. Header and footer separators default to `true`; set
> `[separator]="false"` to remove them.

| Output          | Type      | Description                    |
| --------------- | --------- | ------------------------------ |
| `checkedChange` | `boolean` | Emits after user selection.    |
| `changeEvent`   | `Event`   | Emits the native change event. |

## Visual Variants

`size` adjusts padding and indicator dimensions. `density` inherits the theme
unless provided, and `radius` controls the card surface shape. `color` controls
the selected surface, border, indicator, and focus ring. The checked, disabled,
readonly, and invalid states use the same token-driven visual language in every
variant.

## Appearances

| Appearance | Use case                                       |
| ---------- | ---------------------------------------------- |
| `surface`  | Default card surface.                          |
| `outline`  | Low-emphasis option with a visible border.     |
| `tonal`    | Softly differentiated option.                  |
| `glass`    | Translucent option over a suitable background. |

## Structured Content

Selection Card supports the same content structure commonly used by Card while
preserving one selection target across the whole surface. Import the slot directives
alongside `SolarisSelectionCardComponent`.

| Directive                            | Purpose                                                                                       |
| ------------------------------------ | --------------------------------------------------------------------------------------------- |
| `solaris-selection-card-media`       | Media before the card body (`top`) or side thumb (`start`). The indicator overlays top media. |
| `solaris-selection-card-header`      | Groups the title and description. Separator defaults to `true` (border-bottom).               |
| `solaris-selection-card-content`     | Main card content.                                                                            |
| `solaris-selection-card-footer`      | Footer content. Separator defaults to `true` (border-top).                                    |
| `solaris-selection-card-title`       | Card title styling.                                                                           |
| `solaris-selection-card-description` | Card description styling.                                                                     |

In radio mode the indicator sits in the header row at header height.
`selectionPosition="end"` moves the radio control after the header. In switch
mode the switch is always rendered in the footer row: `selectionPosition="start"`
places it before the footer content, `selectionPosition="end"` after it.

Separators always span the full row width, including the control column: the
header separator renders as a full-width element below the header row, and the
footer separator is the top border of the footer row. Both share the same
subtle color through `--solaris-selection-card-header-border-color` and
`--solaris-selection-card-footer-border-color`.

```html
<solaris-selection-card value="express" color="primary">
  <figure solaris-selection-card-media>
    <img src="delivery.jpg" alt="Express delivery vehicle" />
  </figure>

  <div solaris-selection-card-header>
    <h3 solaris-selection-card-title>Express delivery</h3>
    <p solaris-selection-card-description>Delivery on the next business day.</p>
  </div>

  <div solaris-selection-card-content>Track the order from dispatch to delivery.</div>

  <div solaris-selection-card-footer>Additional fee applies</div>
</solaris-selection-card>
```

### Selection modes

```html
<!-- Radio at the end -->
<solaris-selection-card value="express" color="primary" selection="radio" selectionPosition="end">
  <div solaris-selection-card-header>
    <h3 solaris-selection-card-title>Express delivery</h3>
  </div>
</solaris-selection-card>

<!-- Switch (standalone boolean, always rendered in the footer) -->
<solaris-selection-card selection="switch" [checked]="autoRenew" (checkedChange)="autoRenew = $event">
  <div solaris-selection-card-header>
    <h3 solaris-selection-card-title>Auto-renew</h3>
  </div>
  <div solaris-selection-card-footer>Renews monthly</div>
</solaris-selection-card>

<!-- Side media -->
<solaris-selection-card value="analytics" mediaPosition="start">
  <figure solaris-selection-card-media>
    <img src="analytics.png" alt="Analytics icon" />
  </figure>
  <div solaris-selection-card-header>
    <h3 solaris-selection-card-title>Analytics</h3>
  </div>
</solaris-selection-card>
```

## Colors

| Color     | Use case                                      |
| --------- | --------------------------------------------- |
| `neutral` | Default selection without a semantic meaning. |
| `primary` | Main selection or recommended option.         |
| `success` | Positive or confirmed option.                 |
| `warning` | Option that requires attention.               |
| `danger`  | Destructive or high-impact option.            |
| `info`    | Informational option.                         |
| `custom`  | Custom through CSS variables.                 |

### Custom color

Custom is not an arbitrary input. Define the following variables on the card or
an ancestor when using `color="custom"`:

```css
.my-custom-selection-card {
  --solaris-selection-card-custom-focus-ring-color: #7c3aed;
  --solaris-selection-card-custom-indicator-dot-color: #7c3aed;
  --solaris-selection-card-custom-selected-background: #f3e8ff;
  --solaris-selection-card-custom-selected-border-color: #7c3aed;
  --solaris-selection-card-custom-indicator-border-color: #7c3aed;
}
```

```html
<solaris-selection-card color="custom" class="my-custom-selection-card">
  <h3>Custom option</h3>
</solaris-selection-card>
```

## Examples

### Radio Group Integration

Use Selection Card directly inside `solaris-radio-group`. The group owns the
single selected value, Angular Forms integration, validation, and comparison.

```html
<solaris-radio-group [formControl]="planControl" layout="grid" [columns]="2">
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

Standard `solaris-radio` and `solaris-selection-card` options can be mixed in
the same group.

### Standalone Use

Outside a Radio Group, the component is a boolean ControlValueAccessor.

```html
<solaris-selection-card [checked]="selectedPlan" (checkedChange)="selectedPlan = $event">
  <h3>Basic</h3>
  <p>For small teams getting started.</p>
</solaris-selection-card>
```

## Accessibility

- Radio mode uses a native `input[type='radio']`; Space and arrow-key behavior stay native.
- Switch mode uses a native `input[type='checkbox'][role='switch']`; Space toggles natively.
- The input covers the full visual card, providing a large pointer target.
- Media, headers, content, and footers are all inside this same radio target.
- Projected text is the accessible name by default. For non-text content, set
  `ariaLabel` or `ariaLabelKey`.
- Checked state is communicated by the native radio indicator in addition to
  selected border and surface styling.
- Disabled cards use a native disabled input. Readonly cards preserve their
  value and expose `aria-readonly="true"`.
- Projected interactive elements are forbidden because the card is one radio
  target.

## CSS Variables

| Token                                                    | Purpose                               |
| -------------------------------------------------------- | ------------------------------------- |
| `--solaris-selection-card-background`                    | Surface background.                   |
| `--solaris-selection-card-border-color`                  | Surface border color.                 |
| `--solaris-selection-card-radius`                        | Surface radius.                       |
| `--solaris-selection-card-padding`                       | Surface padding.                      |
| `--solaris-selection-card-gap`                           | Content and indicator gap.            |
| `--solaris-selection-card-header-border-color`           | Header separator border color.        |
| `--solaris-selection-card-footer-border-color`           | Footer separator border color.        |
| `--solaris-selection-card-media-size`                    | Side-media thumb size (`start` mode). |
| `--solaris-selection-card-switch-track-width`            | Switch track width.                   |
| `--solaris-selection-card-switch-track-height`           | Switch track height.                  |
| `--solaris-selection-card-switch-thumb-size`             | Switch thumb size.                    |
| `--solaris-selection-card-switch-track-background`       | Switch track background.              |
| `--solaris-selection-card-switch-thumb-background`       | Switch thumb background.              |
| `--solaris-selection-card-selected-background`           | Checked surface background.           |
| `--solaris-selection-card-selected-border-color`         | Checked border color.                 |
| `--solaris-selection-card-custom-focus-ring-color`       | Custom focus ring color.              |
| `--solaris-selection-card-custom-indicator-dot-color`    | Custom selected indicator color.      |
| `--solaris-selection-card-custom-selected-background`    | Custom checked surface background.    |
| `--solaris-selection-card-custom-selected-border-color`  | Custom checked border color.          |
| `--solaris-selection-card-custom-indicator-border-color` | Custom indicator border color.        |
