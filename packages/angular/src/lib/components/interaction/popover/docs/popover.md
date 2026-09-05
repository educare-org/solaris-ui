# Solaris Popover

## Purpose

Popover is a non-modal floating content foundation connected to a trigger element. It serves as the base for interactive floating panels such as Select, Autocomplete, Dropdown, Menu, and Datepicker.

## Conceptual difference: Tooltip vs Popover

| Aspect        | Tooltip         | Popover                               |
| ------------- | --------------- | ------------------------------------- |
| Content       | Short text only | Structured content                    |
| Interactivity | Non-interactive | Can contain buttons, fields, lists    |
| Trigger       | Hover/focus     | Click                                 |
| Behavior      | Informational   | Can be opened/closed programmatically |

**Popover is not Tooltip.** Tooltip informs. Popover can contain interaction.

**Popover is not Dialog.** Popover is non-modal. It does not block the screen, apply dark backdrop, or trap focus by default.

**Popover is not Menu by itself.** Popover provides the overlay foundation. Menu, Select, Autocomplete add their own keyboard patterns and ARIA roles on top of Popover.

## When to use

- You need a floating panel connected to a trigger
- The panel can contain interactive content
- You want non-modal behavior
- You are building Select, Autocomplete, Dropdown, Menu, or similar

## When not to use

- You need short non-interactive text only → use Tooltip
- You need a modal blocking dialog → use Dialog
- You need a persistent navigation menu → use proper navigation

## Why CDK Overlay

Popover uses Angular CDK Overlay internally because:

- Robust position strategy with fallback support
- Scroll and resize reactivity
- Overlay lifecycle management
- SSR-safe abstractions
- No need to reimplement viewport-based positioning

CDK Overlay is an implementation detail. The public API exposes only Solaris concepts.

## API

### Selectors

| Selector                       | Type      | Description                             |
| ------------------------------ | --------- | --------------------------------------- |
| `ng-template[solaris-popover]` | Directive | Defines popover content template        |
| `[solaris-popover-trigger]`    | Directive | Attaches popover behavior to an element |

### Trigger inputs

| Input                               | Type                                     | Default        | Description                       |
| ----------------------------------- | ---------------------------------------- | -------------- | --------------------------------- |
| `solarisPopoverTriggerFor`          | `SolarisPopoverDirective`                | required       | Reference to the popover template |
| `solarisPopoverOpen`                | `boolean \| undefined`                   | `undefined`    | Programmatic open state           |
| `solarisPopoverDisabled`            | `boolean`                                | `false`        | Prevents opening                  |
| `solarisPopoverPlacement`           | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'`     | Preferred placement side          |
| `solarisPopoverAlign`               | `'start' \| 'center' \| 'end'`           | `'start'`      | Alignment relative to trigger     |
| `solarisPopoverOffset`              | `number`                                 | `8`            | Offset in pixels from trigger     |
| `solarisPopoverMatchTriggerWidth`   | `boolean`                                | `false`        | Matches panel width to trigger    |
| `solarisPopoverFitContent`          | `boolean`                                | `false`        | Sizes panel to its content        |
| `solarisPopoverMinWidth`            | `string \| number \| undefined`          | `undefined`    | Minimum panel width               |
| `solarisPopoverMaxWidth`            | `string \| number \| undefined`          | `undefined`    | Maximum panel width               |
| `solarisPopoverCloseOnOutsideClick` | `boolean`                                | `true`         | Close when clicking outside       |
| `solarisPopoverCloseOnEscape`       | `boolean`                                | `true`         | Close on Escape key               |
| `solarisPopoverRestoreFocus`        | `boolean`                                | `true`         | Restore focus to trigger on close |
| `solarisPopoverAutoFocus`           | `false \| 'panel' \| 'first-tabbable'`   | `false`        | Auto-focus behavior on open       |
| `solarisPopoverScrollStrategy`      | `'reposition' \| 'close' \| 'block'`     | `'reposition'` | Behavior during scroll            |
| `solarisPopoverPanelRole`           | `string \| undefined`                    | `undefined`    | ARIA role for the panel           |
| `solarisPopoverAriaHasPopup`        | `string \| boolean \| undefined`         | `undefined`    | aria-haspopup value               |
| `solarisPopoverAppearance`          | `'surface' \| 'outline'`                 | `'surface'`    | Panel visual style                |
| `solarisPopoverPadding`             | `'none' \| 'sm' \| 'md' \| 'lg'`         | `'md'`         | Panel padding                     |
| `solarisPopoverRadius`              | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'`         | Panel border radius               |

### Trigger outputs

| Output                     | Type      | Description               |
| -------------------------- | --------- | ------------------------- |
| `solarisPopoverOpened`     | `void`    | Emits when popover opens  |
| `solarisPopoverClosed`     | `void`    | Emits when popover closes |
| `solarisPopoverOpenChange` | `boolean` | Emits open state changes  |

### Trigger methods

| Method             | Description              |
| ------------------ | ------------------------ |
| `open()`           | Opens the popover        |
| `close()`          | Closes the popover       |
| `toggle()`         | Toggles open/close state |
| `updatePosition()` | Recalculates position    |

## Positioning

Popover separates placement and align for fine-grained control.

### Placement

Defines the main side where the panel appears relative to the trigger.

- `top` — above
- `right` — to the right
- `bottom` — below (default)
- `left` — to the left

### Align

Defines alignment along the placement axis.

- `start` — aligned to the start edge (left for horizontal, top for vertical)
- `center` — centered (default for right/left)
- `end` — aligned to the end edge (right for horizontal, bottom for vertical)

### Examples

| Placement | Align    | Behavior                                |
| --------- | -------- | --------------------------------------- |
| `bottom`  | `start`  | Opens below, left edge aligned          |
| `bottom`  | `center` | Opens below, centered                   |
| `bottom`  | `end`    | Opens below, right edge aligned         |
| `top`     | `start`  | Opens above, left edge aligned          |
| `right`   | `center` | Opens to the right, vertically centered |

### Fallback

When the preferred position does not fit in the viewport, Popover automatically tries fallback positions. The search order is:

1. Opposite side, same align
2. Same side, shifted align
3. Opposite side, shifted align
4. Same side, centered
5. Opposite side, centered

## Reactive positioning

Popover uses `FlexibleConnectedPositionStrategy` from CDK, which reacts to:

- Viewport resize
- Scroll changes (with `reposition` strategy)
- Element position changes

The default `scrollStrategy` is `reposition`, which automatically updates the panel position without closing.

## Offset

Controls the gap between trigger and panel in pixels. Default is `8px` (equivalent to `0.5rem` at `16px` base font size).

## Width constraints

- `matchTriggerWidth`: sets `minWidth` to the trigger's `offsetWidth`
- `minWidth`: accepts `number` (treated as `px`) or CSS `string` (e.g. `'10rem'`, `'200px'`)
- `maxWidth`: same format as `minWidth`

## Close behavior

- `closeOnOutsideClick` (default `true`): closes when user clicks outside both trigger and panel
- `closeOnEscape` (default `true`): closes on Escape key press

## Focus

- `autoFocus` (default `false`): when `'panel'`, focuses the panel element; when `'first-tabbable'`, focuses the first tabbable element inside the panel
- `restoreFocus` (default `true`): on close, returns focus to the trigger element (safe if trigger is removed from DOM)

For Select/Autocomplete usage, `autoFocus` should be `false` so the component controls focus internally.

## Scroll strategy

| Strategy               | Behavior                                                 |
| ---------------------- | -------------------------------------------------------- |
| `reposition` (default) | Repositions during scroll/resize, allows position change |
| `close`                | Closes on scroll                                         |
| `block`                | Blocks page scroll while open                            |

## Appearance

| Appearance          | Description                                       |
| ------------------- | ------------------------------------------------- |
| `surface` (default) | Solid background with shadow, subtle or no border |
| `outline`           | Surface background with visible border            |

**Important:** `appearance="outline"` uses surface/overlay background with a visible border. It does NOT use transparent background.

## Padding

| Value          | Token                           |
| -------------- | ------------------------------- |
| `none`         | `0`                             |
| `sm`           | `--solaris-spacing-2` (0.5rem)  |
| `md` (default) | `--solaris-spacing-3` (0.75rem) |
| `lg`           | `--solaris-spacing-4` (1rem)    |

## Radius

| Value          | Token                           |
| -------------- | ------------------------------- |
| `none`         | `--solaris-radius-none` (0)     |
| `sm`           | `--solaris-radius-sm` (0.25rem) |
| `md` (default) | `--solaris-radius-md` (0.5rem)  |
| `lg`           | `--solaris-radius-lg` (0.75rem) |
| `xl`           | `--solaris-radius-xl` (1rem)    |

## Styling tokens

Popover uses CSS custom properties for visual customization:

| Token                            | Default                    | Description         |
| -------------------------------- | -------------------------- | ------------------- |
| `--solaris-popover-background`   | `--solaris-surface-raised` | Panel background    |
| `--solaris-popover-color`        | `--solaris-text-default`   | Text color          |
| `--solaris-popover-border-color` | `transparent`              | Border color        |
| `--solaris-popover-border-width` | `0`                        | Border width        |
| `--solaris-popover-radius`       | `--solaris-radius-md`      | Border radius       |
| `--solaris-popover-padding`      | `--solaris-spacing-3`      | Inner padding       |
| `--solaris-popover-shadow`       | `--solaris-shadow-lg`      | Box shadow          |
| `--solaris-popover-min-width`    | `auto`                     | Minimum panel width |
| `--solaris-popover-max-width`    | `none`                     | Maximum panel width |

## Accessibility

Popover does not impose a fixed role by default.

- `panelRole` is `undefined` by default. Set it when the popover represents a specific widget (e.g. `'dialog'`, `'menu'`, `'listbox'`)
- `ariaHasPopup` is `undefined` by default. Set it to inform assistive technology (e.g. `'listbox'` for Select, `'menu'` for Menu)
- `aria-expanded` is automatically managed on the trigger
- `aria-controls` is set when the popover is open
- Role is not forced on the panel element when `panelRole` is `undefined`

## Examples

### Basic popover

```html
<button solaris-popover-trigger [solarisPopoverTriggerFor]="helpPopover">Help</button>

<ng-template #helpPopover solaris-popover>
  <p>This panel can contain structured, interactive content.</p>
</ng-template>
```

### Placement and appearance

```html
<button solaris-popover-trigger [solarisPopoverTriggerFor]="profilePopover" solarisPopoverPlacement="bottom" solarisPopoverAlign="end" solarisPopoverAppearance="outline" solarisPopoverRadius="lg">
  <solaris-icon name="user" decorative="true" />
  Profile
</button>

<ng-template #profilePopover solaris-popover>
  <p>Signed in as developer@example.com</p>
</ng-template>
```

### With interactive content

```html
<button solaris-popover-trigger [solarisPopoverTriggerFor]="actionsPopover">Filters</button>

<ng-template #actionsPopover solaris-popover>
  <button solaris-button size="sm" fullWidth>Apply</button>
  <button solaris-button size="sm" appearance="ghost" fullWidth>Clear</button>
</ng-template>
```

## Limitations (v1)

- No arrow
- No nested popovers
- No focus trap (non-modal by design)
- No keyboard navigation patterns (listbox, menu, typeahead)
- No backdrop
- No animations (can be added via CSS)
- Panel role and aria-haspopup must be configured manually

## Future relationship

Popover provides the overlay foundation for:

- **Select** — uses popover with `panelRole="listbox"`, `ariaHasPopup="listbox"`, keyboard navigation
- **Autocomplete** — uses popover with search input, filtered list, keyboard navigation
- **Dropdown** — uses popover with menu-like content
- **Menu** — uses popover with `panelRole="menu"`, `ariaHasPopup="menu"`, roving tabindex
- **Datepicker** — uses popover with calendar widget
- **Command Palette** — uses popover with search, filtering, keyboard navigation
- **Tooltip** — implemented; built on overlay with hover/focus triggers

Each component adds its own ARIA pattern, keyboard handling, focus management, and visual design on top of Popover's overlay foundation.
