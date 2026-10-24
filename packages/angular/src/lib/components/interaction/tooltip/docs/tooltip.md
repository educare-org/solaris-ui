# Solaris Tooltip

## Purpose

Tooltip is a short, contextual informational layer used to explain or complement a UI element without permanently occupying space.

**Tooltip may explain. Popover may interact.**

---

## Difference between Tooltip and Popover

| Characteristic  | Tooltip                          | Popover               |
| --------------- | -------------------------------- | --------------------- |
| Purpose         | Inform                           | Interact              |
| Content         | Short text, icon, optional title | Any template          |
| Buttons         | Internal close only              | Custom buttons        |
| Focus           | Does not trap focus              | Can trap focus        |
| Primary trigger | Hover/focus                      | Click                 |
| Closing         | Mouse leave, blur, Escape        | Escape, outside click |

---

## When to use

- Help icons
- Icon-only buttons
- Truncated text
- Short field explanation
- Reason for a disabled item
- Keyboard shortcuts
- Badge/count detail
- Brief contextual information

## When not to use

- Action menu
- Form
- Selectable list
- Long content
- Destructive action confirmation
- Navigation
- Select
- Dropdown
- Custom actions
- Footer with buttons
- Action links
- Complex interactive content

If you need custom buttons like "View details", "Configure", "Apply", "Cancel", "Got it", or any arbitrary action, use **Solaris Popover**, not Tooltip.

---

## API

### Selectors

- `[solaris-tooltip]` — attribute with a direct textual value
- `[solarisTooltip]` — property binding
- `[solarisTooltipFor]` — template reference

### Inputs

| Input                                | Type                                  | Default     | Description                                               |
| ------------------------------------ | ------------------------------------- | ----------- | --------------------------------------------------------- |
| `solaris-tooltip` / `solarisTooltip` | `string \| undefined`                 | `undefined` | Tooltip text                                              |
| `solarisTooltipKey`                  | `string \| undefined`                 | `undefined` | Translation key for the text                              |
| `solarisTooltipFor`                  | `TemplateRef<unknown> \| undefined`   | `undefined` | Informational template                                    |
| `solarisTooltipTitle`                | `string \| undefined`                 | `undefined` | Optional title                                            |
| `solarisTooltipTitleKey`             | `string \| undefined`                 | `undefined` | Translation key for the title                             |
| `solarisTooltipIcon`                 | `string \| undefined`                 | `undefined` | Icon name (Solaris Icon Registry)                         |
| `solarisTooltipIconDecorative`       | `boolean`                             | `true`      | Whether the icon is decorative                            |
| `solarisTooltipTrigger`              | `'hover' \| 'click' \| 'manual'`      | `'hover'`   | Opening trigger                                           |
| `solarisTooltipPlacement`            | `SolarisTooltipPlacement`             | `'top'`     | Initial position                                          |
| `solarisTooltipOffset`               | `number \| string`                    | `0`         | Extra offset in px (added to arrow + 3px gap)             |
| `solarisTooltipDisabled`             | `boolean`                             | `false`     | Disables the tooltip                                      |
| `solarisTooltipCloseable`            | `boolean`                             | `false`     | Shows close button (click only)                           |
| `solarisTooltipCloseLabel`           | `string \| undefined`                 | `undefined` | Close button label                                        |
| `solarisTooltipCloseLabelKey`        | `string \| undefined`                 | `undefined` | Translation key for the label                             |
| `solarisTooltipShowDelay`            | `number`                              | `300`       | Delay to open (ms)                                        |
| `solarisTooltipHideDelay`            | `number`                              | `100`       | Delay to close (ms)                                       |
| `solarisTooltipSkipDelay`            | `number`                              | `300`       | Skip `showDelay` window after a close (ms, Radix pattern) |
| `solarisTooltipAppearance`           | `'outline' \| 'surface' \| 'inverse'` | `'outline'` | Appearance                                                |
| `solarisTooltipSize`                 | `'sm' \| 'md' \| 'lg'`                | `'sm'`      | Size                                                      |
| `solarisTooltipRadius`               | `'sm' \| 'md' \| 'lg'`                | `'md'`      | Border radius                                             |
| `solarisTooltipMaxWidth`             | `string \| number`                    | `'320px'`   | Maximum width                                             |
| `solarisTooltipArrow`                | `boolean`                             | `true`      | Shows arrow                                               |
| `solarisTooltipOpen`                 | `boolean \| undefined`                | `undefined` | Controlled state                                          |

### Outputs

| Output                     | Type      | Description             |
| -------------------------- | --------- | ----------------------- |
| `solarisTooltipOpened`     | `void`    | Emitted when it opens   |
| `solarisTooltipClosed`     | `void`    | Emitted when it closes  |
| `solarisTooltipOpenChange` | `boolean` | Emitted on state change |

### Public methods

- `open()` — Opens the tooltip
- `close()` — Closes the tooltip
- `toggle()` — Toggles state
- `reposition()` — Updates position

---

## Triggers

### Hover (default)

Opens on `mouseenter`/`focusin`. Closes on `mouseleave`/`focusout`/`Escape`. Uses `showDelay` and `hideDelay`. Does not render a close button. Applies `aria-describedby` on the trigger.

### Click

Opens on click. Stays open. Closes on Escape or outside click. Can show a close button when `closeable=true`. Restores focus to the trigger on close.

### Manual

Does not open on user interaction. Opens only via `open()` or the controlled input `solarisTooltipOpen`.

---

## Closeable

- Available only when `trigger="click"`.
- If `trigger="hover"` and `closeable=true`, the option is ignored.
- The close button has an accessible name via `aria-label`.
- Supports `closeLabel` and `closeLabelKey`.
- Default uses the translation key `solaris.tooltip.close`.

---

## Title and Icon

- `solarisTooltipTitle` / `solarisTooltipTitleKey`: optional title with greater visual weight.
- `solarisTooltipIcon`: optional icon on the left.
- With title: icon aligned with the title.
- Without title: icon aligned with the vertical center of the text.

---

## Appearances

### outline (default)

Surface background + border. Not transparent. Uses tokens `--solaris-neutral-default`, `--solaris-neutral-border-default`.

### surface

Surface background without strong border. Sufficient contrast in light/dark.

### inverse

High contrast. Dark background with light text in light theme; light background with dark text in dark theme.

---

## Arrow

- Default `true`.
- Can be turned off with `[solarisTooltipArrow]="false"`.
- The arrow follows the placement.
- Respects appearance, background, and border.
- Rendered as a rotated square (diamond) centered on the panel edge, with a
  border only on its two outer sides, so it continues the panel border
  without seam steps at any placement or viewport position.

---

## Placement

Supports 12 positions:

`top`, `top-start`, `top-end`, `bottom`, `bottom-start`, `bottom-end`, `right`, `right-start`, `right-end`, `left`, `left-start`, `left-end`

Default: `top`

Positioning is reactive via the CDK `FlexibleConnectedPositionStrategy` with automatic fallback.

When the trigger lives inside a nested scrollable container, that container
must opt in with `CdkScrollable` from `@angular/cdk/scrolling`, otherwise the
tooltip does not follow the trigger on scroll (same requirement as Popover).

---

## Size

| Size | Font        | Padding (block × inline) | Arrow |
| ---- | ----------- | ------------------------ | ----- |
| `sm` | 14px (`xs`) | 2px × 8px                | 8px   |
| `md` | 16px (`sm`) | 4px × 12px               | 10px  |
| `lg` | 18px (`md`) | 6px × 20px               | 12px  |

Size is the tooltip's typographic density: it scales font, padding, and
arrow together. There is no separate `density` input — overlays are exempt
from the `size × density` height ladder (see `docs/ai/refactor-component/CONTEXT.md`).
The arrow px values are mirrored in `SOLARIS_TOOLTIP_ARROW_SIZE_PX`
(`model/tooltip.types.ts`) so the CDK offset reserves exactly the rendered
arrow height. Keep both in sync.

## Skip delay

After a tooltip closes, reopening within `skipDelay` (default `300ms`)
skips `showDelay` and opens immediately — the Radix `skipDelayDuration`
pattern. Moving across a dense toolbar shows each tooltip without the
initial wait, while an isolated hover still waits `showDelay`. Set
`skipDelay="0"` to disable.

## Radius

`sm`, `md`, `lg`. Default: `md`.

## MaxWidth

Default: `320px`. Prevents a long tooltip on a single line. Text wraps correctly.

## Disabled triggers

A disabled button emits no mouse or focus events, so no tooltip library can
open on it directly (MUI, Radix, and Ant document the same limitation).
Wrap the trigger in a `span` that carries the tooltip instead:

```html
<span solaris-tooltip="Edit item">
  <button disabled>Edit</button>
</span>
```

The wrapper receives hover/focus and shows the tooltip; the inner button
stays disabled and keeps its semantics.

---

## CSS Variables

The following CSS variables can be customized:

| Token                              | Purpose                           |
| ---------------------------------- | --------------------------------- |
| `--solaris-tooltip-background`     | Panel background                  |
| `--solaris-tooltip-color`          | Text color                        |
| `--solaris-tooltip-border-color`   | Border color                      |
| `--solaris-tooltip-border-width`   | Border width                      |
| `--solaris-tooltip-radius`         | Panel border radius               |
| `--solaris-tooltip-shadow`         | Panel box shadow                  |
| `--solaris-tooltip-gap`            | Gap between icon, text, and close |
| `--solaris-tooltip-max-width`      | Maximum panel width               |
| `--solaris-tooltip-padding-block`  | Vertical padding                  |
| `--solaris-tooltip-padding-inline` | Horizontal padding                |
| `--solaris-tooltip-icon-size`      | Icon and close button size        |
| `--solaris-tooltip-arrow-size`     | Arrow size                        |
| `--solaris-tooltip-offset`         | Offset between icon and content   |

---

## Accessibility

### Hover/focus tooltip

- `role="tooltip"` on the panel.
- Trigger receives `aria-describedby` while open.
- Escape closes.
- Does not move focus automatically.
- Does not trap focus.

### Click closeable tooltip

- Does not force `role="tooltip"` when there is a close button (using non-modal `role="dialog"` would be semantically more honest, but we keep `role="tooltip"` because it is strictly informational).
- Escape closes.
- Outside click closes.
- Close button is keyboard accessible.

### Keyboard

- Escape always closes when open.
- Tab works naturally.
- Hover tooltip does not create focusable elements.
- Click closeable can have a focusable close button.
- No focus trap.

---

## Examples

### Basic hover

```html
<button solaris-tooltip="Edit item">
  <solaris-icon name="edit" decorative="true" />
</button>
```

### Property binding

```html
<button [solarisTooltip]="tooltipText">Help</button>
```

### Title and icon

```html
<button solaris-tooltip="Available after payment confirmation." solarisTooltipTitle="Pending access" solarisTooltipIcon="info">Status</button>
```

### Click closeable

```html
<button solaris-tooltip="This metric considers the last 30 days." solarisTooltipTrigger="click" [solarisTooltipCloseable]="true">?</button>
```

### Informational template

```html
<button [solarisTooltipFor]="paymentTooltip" solarisTooltipTrigger="click" [solarisTooltipCloseable]="true">Learn more</button>

<ng-template #paymentTooltip> Payment can take up to 48 hours to be confirmed. </ng-template>
```

---

## Anti-patterns

Tooltip must **not** contain:

- Custom buttons ("View details", "Configure", "Apply")
- Action links
- Forms
- Selectable lists
- Any interactive content beyond the close button

If you need interactive content, use **Solaris Popover**.

---

## Limitations (v1)

- No custom buttons (internal close only)
- No HTML string or innerHTML
- No async loading
- No focus trap
- No nested tooltip
- No complex animations (only simple CSS transitions)
- No `full` radius support
