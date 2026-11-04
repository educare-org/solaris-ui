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

| Input            | Type                                     | Default        | Description                        |
| ---------------- | ---------------------------------------- | -------------- | ---------------------------------- |
| `value`          | `unknown`                                | `undefined`    | Current selected value (two-way)   |
| `defaultValue`   | `unknown`                                | `undefined`    | Initial value when none is set     |
| `orientation`    | `'horizontal' \| 'vertical'`             | `'horizontal'` | Layout direction                   |
| `appearance`     | `'surface' \| 'outline'`                 | `'surface'`    | Visual style                       |
| `size`           | `'sm' \| 'md' \| 'lg'`                   | `'md'`         | Size variant                       |
| `density`        | `'compact' \| 'normal' \| 'comfortable'` | `'normal'`     | Spacing density                    |
| `radius`         | `'sm' \| 'md' \| 'lg' \| 'full'`         | `'md'`         | Border radius                      |
| `disabled`       | `boolean`                                | `false`        | Disables all interaction           |
| `readonly`       | `boolean`                                | `false`        | Allows focus but blocks changes    |
| `required`       | `boolean`                                | `false`        | Marks as required                  |
| `invalid`        | `boolean`                                | `false`        | Marks as invalid                   |
| `fullWidth`      | `boolean`                                | `false`        | Stretches to full container width  |
| `equalWidth`     | `boolean`                                | `false`        | Makes all items equal width        |
| `indicator`      | `boolean`                                | `true`         | Shows animated selection indicator |
| `compareWith`    | `(a, b) => boolean`                      | `Object.is`    | Custom comparison function         |
| `ariaLabel`      | `string \| undefined`                    | `undefined`    | ARIA label                         |
| `ariaLabelKey`   | `string \| undefined`                    | `undefined`    | Translation key for ARIA label     |
| `ariaLabelledby` | `string \| undefined`                    | `undefined`    | ARIA labelledby                    |

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
- `normal` — default spacing
- `comfortable` — increased spacing

## Height ladder (content + padding, pinned by a floor)

The outer height of a horizontal control is pinned to its `control-height`
token by `min-height` (`--solaris-segmented-item-height-override`, one token
per size x density combination, never an alias). Content (label
`font-size x line-height-sm 1.4`) plus vertical item padding always stays
below the token, so the floor only absorbs the slack and nothing clips; the
vertical container padding stays `0`. The override keeps working as a
consumer escape hatch (`auto` disables the floor, a length forces it).

| Size / density     | Font      | Content | Item `padding-y` / `padding-x` | Content + padding | Token |
| ------------------ | --------- | ------- | ------------------------------ | ----------------- | ----- |
| `sm`/`compact`     | `xs` 14px | 19.6    | 2px / 6px                      | 23.6 (slack 4.4)  | 28    |
| `md`/`compact`     | `xs` 14px | 19.6    | 4px / 6px                      | 27.6 (slack 4.4)  | 32    |
| `lg`/`compact`     | `sm` 16px | 22.4    | 6px / 8px                      | 34.4 (slack 1.6)  | 36    |
| `sm`/`normal`      | `sm` 16px | 22.4    | 6px / 8px                      | 34.4 (slack 1.6)  | 36    |
| `md`/`normal`      | `sm` 16px | 22.4    | 8px / 8px                      | 38.4 (slack 1.6)  | 40    |
| `lg`/`normal`      | `lg` 20px | 28.0    | 6px / 8px                      | 40.0 (slack 4.0)  | 44    |
| `sm`/`comfortable` | `lg` 20px | 28.0    | 6px / 8px                      | 40.0 (slack 4.0)  | 44    |
| `md`/`comfortable` | `lg` 20px | 28.0    | 8px / 12px                     | 44.0 (slack 4.0)  | 48    |
| `lg`/`comfortable` | `lg` 20px | 28.0    | 8px / 12px                     | 44.0 (slack 8.0)  | 52    |

Notes:

- Exactness comes from the floor (`box-sizing: border-box` counts padding
  inside `min-height`, so there is no double counting); the table proves the
  floor always binds instead of squeezing content.
- Item horizontal padding keeps breathing room at or above the vertical
  padding in every combination (owner decision on the current file values);
  the host and label both set `line-height-sm (1.4)` — the old `/1` host
  shorthand is gone.
- `appearance="outline"` compensates its own border: the floor drops by
  `2 x border-width`, so outer height stays exactly on-token here too.
- The selection indicator re-measures on item resize (not just host resize)
  and once webfonts settle, so it tracks the selected item in fixed-width
  (`fullWidth`/`equalWidth`) layouts where the host box never moves.
- `fullWidth`/`equalWidth` with long labels (e.g. translated `Mensal/Anual`
  strings) shrink through `min-width: 0` and fall back to `nowrap + ellipsis`
  on the label instead of wrapping or spilling; projected (non-`label`)
  content is clipped inside the item box by the inner wrapper, so long text
  never paints outside the selection indicator.

## Radius

- `none` — square corners everywhere (container, indicator, flush edges)
- `sm` — small rounded corners
- `md` — medium rounded corners (default)
- `lg` — large rounded corners (items and indicator follow the container)
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

With `size="sm"` and `density="compact"` the indicator sits flush with the
container. The first and last options then reuse the container radius
(`--solaris-segmented-radius`) on their outer corners, and the indicator
follows the selected edge (exposed as `data-selected-edge`: `first` | `last`
| `both`), so edge selections never render square against the rounded
container — regardless of how many options the control has.

## CSS Variables

The following CSS variables can be customized:

| Token                                        | Purpose                                                                                               |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `--solaris-segmented-item-height`            | Per-combination height floor (own `control-height` token; exact outer height, see Height ladder)      |
| `--solaris-segmented-item-height-override`   | Effective `min-height` floor; follows the hatch above (`auto` disables the floor, a length forces it) |
| `--solaris-segmented-gap`                    | Gap between items                                                                                     |
| `--solaris-segmented-radius`                 | Container border radius                                                                               |
| `--solaris-segmented-padding-x`              | Container horizontal padding                                                                          |
| `--solaris-segmented-padding-y`              | Container vertical padding                                                                            |
| `--solaris-segmented-item-color`             | Item text color                                                                                       |
| `--solaris-segmented-item-padding-y`         | Vertical item padding                                                                                 |
| `--solaris-segmented-item-padding-x`         | Horizontal item padding                                                                               |
| `--solaris-segmented-item-padding-x`         | Horizontal item padding                                                                               |
| `--solaris-segmented-background`             | Container background                                                                                  |
| `--solaris-segmented-indicator-shadow`       | Selection indicator shadow                                                                            |
| `--solaris-segmented-border-color`           | Container border color (outline)                                                                      |
| `--solaris-segmented-border-width`           | Container border width (outline)                                                                      |
| `--solaris-segmented-focus-ring-color`       | Focus ring color                                                                                      |
| `--solaris-segmented-item-selected-color`    | Selected item text color                                                                              |
| `--solaris-segmented-indicator-border-color` | Selection indicator border color                                                                      |
| `--solaris-segmented-indicator-background`   | Selection indicator background                                                                        |
| `--solaris-segmented-item-hover-background`  | Item hover background                                                                                 |

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

## Required and invalid

- `required` marks the group as mandatory (`aria-required`).
- The group becomes visually invalid when `[invalid]="true"` is set, or
  automatically when it is `required`, has been touched, and has no value
  (e.g. a form was submitted or reset without a selection).
- The invalid state is signaled with more than color alone: danger border and
  outline on the container, danger-tinted selection indicator, and a danger
  focus ring — never a red border by itself.

## Icon-only

When an item has only an icon with no label text, an accessible name is required via `ariaLabel` or `ariaLabelKey`.

## Examples

### Basic

```html
<solaris-segmented-control [(value)]="view" ariaLabel="View mode">
  <solaris-segmented-item value="list" label="List" />
  <solaris-segmented-item value="grid" label="Grid" />
  <solaris-segmented-item value="kanban" label="Kanban" />
</solaris-segmented-control>
```

### With icons

```html
<solaris-segmented-control [(value)]="theme" ariaLabel="Theme">
  <solaris-segmented-item value="light" icon="sun" />
  <solaris-segmented-item value="dark" icon="moon" />
  <solaris-segmented-item value="system" icon="monitor" />
</solaris-segmented-control>
```

### Orientation and appearance

```html
<solaris-segmented-control [(value)]="role" orientation="vertical" appearance="outline" ariaLabel="Role">
  <solaris-segmented-item value="student" label="Student" />
  <solaris-segmented-item value="teacher" label="Teacher" />
  <solaris-segmented-item value="admin" label="Admin" />
</solaris-segmented-control>
```

### Sizes and radius

```html
<solaris-segmented-control [(value)]="size" size="sm" radius="full" ariaLabel="Size">
  <solaris-segmented-item value="s" label="Small" />
  <solaris-segmented-item value="m" label="Medium" />
  <solaris-segmented-item value="l" label="Large" />
</solaris-segmented-control>
```

### Disabled item

```html
<solaris-segmented-control [(value)]="plan" ariaLabel="Plan">
  <solaris-segmented-item value="basic" label="Basic" />
  <solaris-segmented-item value="pro" label="Pro" />
  <solaris-segmented-item value="enterprise" label="Enterprise" disabled />
</solaris-segmented-control>
```

## Limitations (v1)

- Single selection only (no multi-select)
- No `ghost` or `glass` appearances
- No drag-and-drop reordering
- No scrollable items container
