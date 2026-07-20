# Segmented Control

## Purpose

Segmented Control provides a way to quickly switch between a small number of related options on the same axis. It is ideal for filtering, view switching, preference selection, and categorical choices.

## Relationship to other components

| Component             | Purpose                                     |
| --------------------- | ------------------------------------------- |
| **Segmented Control** | Selects one option among few related values |
| **Tabs**              | Organizes content into switchable panels    |
| **Button Group**      | Groups related actions                      |
| **Radio Group**       | Selects one option in a form context        |

### Conceptual rule

- **Tabs** organize content and panels.
- **Segmented Control** alters an option/state.
- **Button Group** groups actions.
- **Radio Group** selects one option in a long form.

## When to use

- Filtering a list: `All \| Active \| Inactive`
- Switching view mode: `List \| Grid \| Kanban`
- Selecting preference: `Monthly \| Yearly`
- Choosing theme: `Light \| Dark \| System`
- Selecting role: `Student \| Teacher \| Admin`
- Switching difficulty: `Simple \| Advanced`

## When not to use

- Navigation between complex pages (use **Tabs**)
- Many items (use **Radio Group** or **Select**)
- Content with long panels (use **Tabs**)
- Action menu (use **Button Group** or **Dropdown Menu**)
- Options with long descriptions (use **Radio Group**)
- Multiple selection (not supported in v1)

## API

### SolarisSegmentedControlComponent

Selector: `solaris-segmented-control`

| Input            | Type                             | Default         | Description                        |
| ---------------- | -------------------------------- | --------------- | ---------------------------------- |
| `value`          | `unknown`                        | `undefined`     | Current selected value (two-way)   |
| `defaultValue`   | `unknown`                        | `undefined`     | Initial value when none is set     |
| `orientation`    | `'horizontal' \| 'vertical'`     | `'horizontal'`  | Layout direction                   |
| `appearance`     | `'surface' \| 'outline'`         | `'surface'`     | Visual style                       |
| `size`           | `'sm' \| 'md' \| 'lg'`           | `'md'`          | Size variant                       |
| `density`        | `'compact' \| 'comfortable'`     | `'comfortable'` | Spacing density                    |
| `radius`         | `'sm' \| 'md' \| 'lg' \| 'full'` | `'md'`          | Border radius                      |
| `disabled`       | `boolean`                        | `false`         | Disables all interaction           |
| `readonly`       | `boolean`                        | `false`         | Allows focus but blocks changes    |
| `required`       | `boolean`                        | `false`         | Marks as required                  |
| `invalid`        | `boolean`                        | `false`         | Marks as invalid                   |
| `fullWidth`      | `boolean`                        | `false`         | Stretches to full container width  |
| `equalWidth`     | `boolean`                        | `false`         | Makes all items equal width        |
| `indicator`      | `boolean`                        | `true`          | Shows animated selection indicator |
| `compareWith`    | `(a, b) => boolean`              | `Object.is`     | Custom comparison function         |
| `ariaLabel`      | `string \| undefined`            | `undefined`     | ARIA label                         |
| `ariaLabelKey`   | `string \| undefined`            | `undefined`     | Translation key for ARIA label     |
| `ariaLabelledby` | `string \| undefined`            | `undefined`     | ARIA labelledby                    |

| Output        | Type                                 | Description                    |
| ------------- | ------------------------------------ | ------------------------------ |
| `valueChange` | `unknown`                            | Emits when value changes       |
| `change`      | `SolarisSegmentedControlChangeEvent` | Emits value and previous value |

### ControlValueAccessor

Implements `ControlValueAccessor` for Angular Forms:

- `writeValue` — sets value programmatically
- `registerOnChange` — registers change callback
- `registerOnTouched` — registers touch callback
- `setDisabledState` — enables/disables control

### SolarisSegmentedItemComponent

Selector: `solaris-segmented-item`

| Input          | Type                  | Default     | Description                    |
| -------------- | --------------------- | ----------- | ------------------------------ |
| `value`        | `unknown`             | required    | Item value                     |
| `label`        | `string \| undefined` | `undefined` | Item text                      |
| `labelKey`     | `string \| undefined` | `undefined` | Translation key                |
| `icon`         | `string \| undefined` | `undefined` | Icon name                      |
| `disabled`     | `boolean`             | `false`     | Disables this item             |
| `ariaLabel`    | `string \| undefined` | `undefined` | ARIA label                     |
| `ariaLabelKey` | `string \| undefined` | `undefined` | Translation key for ARIA label |

Segmented Item does **not** implement CVA. The CVA belongs to Segmented Control.

## Appearances

### Surface (default)

Container with a subtle background. Selected item has an elevated indicator.

### Outline

Container with surface background and a visible border. Never fully transparent.

## Sizes

- `sm` — compact items, smaller font and icon
- `md` — default size
- `lg` — larger items, bigger font and icon

## Density

- `compact` — reduced spacing
- `comfortable` — default spacing

## Radius

- `sm` — small rounded corners
- `md` — medium rounded corners (default)
- `lg` — large rounded corners
- `full` — fully rounded (pill shape)

## Orientation

### Horizontal (default)

Items are laid out in a row. ArrowLeft/ArrowRight navigate.

### Vertical

Items are laid out in a column. ArrowUp/ArrowDown navigate.

## Animated Indicator

By default, Segmented Control renders an animated selection indicator that:

- Measures position and size of the selected item
- Moves via CSS transform
- Resizes when the selected item changes
- Updates on resize and content changes
- Respects `prefers-reduced-motion`
- Can be disabled via `[indicator]="false"`

## Accessibility

Semantics follow radio group pattern:

- Container: `role="radiogroup"`
- Items: `role="radio"`, `aria-checked`
- Roving tabindex on items
- `aria-required`, `aria-invalid`, `aria-disabled` on container
- `aria-disabled` on disabled items

## Keyboard Navigation

| Key        | Horizontal            | Vertical              |
| ---------- | --------------------- | --------------------- |
| ArrowRight | Next enabled item     | —                     |
| ArrowLeft  | Previous enabled item | —                     |
| ArrowDown  | —                     | Next enabled item     |
| ArrowUp    | —                     | Previous enabled item |
| Home       | First enabled item    | First enabled item    |
| End        | Last enabled item     | Last enabled item     |
| Space      | Select focused item   | Select focused item   |
| Enter      | Select focused item   | Select focused item   |

Disabled items are skipped during keyboard navigation.

## Readonly

- Allows focus and reading
- Blocks value changes
- Does not appear visually disabled
- Maintains contrast

## Icon-only

When an item has only an icon with no label text, an accessible name is required via `ariaLabel` or `ariaLabelKey`.

## Limitations (v1)

- Single selection only (no multi-select)
- No `ghost` or `glass` appearances
- No drag-and-drop reordering
- No scrollable items container
