# Solaris Button Group

## Purpose

Button Group is a visual and structural grouping component for related actions.

It wraps `[solaris-button]` and `[solaris-icon-button]` elements into a cohesive cluster, handling orientation, visual union (attached/separated), density, and full-width layout.

## When to use

- Grouping related actions such as editor controls (Edit, Duplicate, Delete).
- Creating visual clusters of icon-only actions.
- Building compact action toolbars without toolbar semantics.
- Providing visual structure for primary + secondary action compositions.

## When not to use

- Do not use Button Group for selecting one option among many — use `solaris-segmented-control`.
- Do not use Button Group for toggle state — Toggle Group (not available in v1).
- Do not use Button Group for tab navigation — use `solaris-tabs`.
- Do not use Button Group for menu/dropdown behavior — Dropdown Button (not available in v1).
- Do not use Button Group for split button behavior — Split Button (not available in v1).

## Difference from similar patterns

| Pattern               | Purpose                                           |
| --------------------- | ------------------------------------------------- |
| **Button Group**      | Groups related actions visually and structurally. |
| **Segmented Control** | Selects one option from a small set.              |
| **Toggle Group**      | Controls on/off or selected state.                |
| **Tabs**              | Switches between content sections.                |
| **Split Button**      | Combines primary action with a dropdown menu.     |
| **Dropdown Button**   | Opens a menu of actions.                          |

## API

```typescript
@Component({
  selector: 'solaris-button-group',
  standalone: true,
})
class SolarisButtonGroupComponent {
  orientation: SolarisButtonGroupOrientation; // 'horizontal' | 'vertical'
  attached: boolean; // true | false
  density: SolarisButtonGroupDensity; // 'compact' | 'comfortable' | undefined
  fullWidth: boolean; // true | false
}
```

### `orientation`

| Value                    | Behavior                                                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `'horizontal'` (default) | Items laid out side by side. First and last items get outer border-radius; middle items have no inner radius. |
| `'vertical'`             | Items stacked vertically. Top and bottom items get outer border-radius; middle items have no inner radius.    |

### `attached`

| Value            | Behavior                                                                   |
| ---------------- | -------------------------------------------------------------------------- |
| `true` (default) | Items are visually united — no gap, shared borders, inner corners removed. |
| `false`          | Items are separated by a gap. Each item keeps its own border-radius.       |

### `fullWidth`

| Value             | Behavior                                                                            |
| ----------------- | ----------------------------------------------------------------------------------- |
| `true`            | The group fills the available width. Child buttons grow to distribute space evenly. |
| `false` (default) | The group shrinks to fit its content.                                               |

### `density`

| Value                              | Effect                             |
| ---------------------------------- | ---------------------------------- |
| `'compact'`                        | Tighter gap and spacing.           |
| `'comfortable'` (default fallback) | More breathing room between items. |

When not provided, density is inherited from the theme system when available, falling back to comfortable.

## Compatibility with Button

Button Group works with `[solaris-button]` on `<button>` and `<a>` elements:

```html
<solaris-button-group aria-label="Editor actions">
  <button solaris-button>Edit</button>
  <button solaris-button disabled>Delete</button>
</solaris-button-group>

<solaris-button-group aria-label="Links">
  <a solaris-button href="/edit">Edit</a>
  <a solaris-button href="/delete">Delete</a>
</solaris-button-group>
```

## Compatibility with Icon Button

Button Group works with `[solaris-icon-button]` on `<button>` and `<a>` elements:

```html
<solaris-button-group orientation="vertical" aria-label="Mood">
  <button solaris-icon-button aria-label="Happy">
    <solaris-icon name="success" decorative="true" />
  </button>
  <button solaris-icon-button aria-label="Neutral">
    <solaris-icon name="info" decorative="true" />
  </button>
  <button solaris-icon-button aria-label="Sad">
    <solaris-icon name="danger" decorative="true" />
  </button>
</solaris-button-group>
```

## Badges

Badges can be composed inside Button or Icon Button within the group:

```html
<solaris-button-group aria-label="Save actions">
  <button solaris-button>
    Save
    <solaris-badge variant="count" color="primary">36</solaris-badge>
  </button>
  <button solaris-icon-button aria-label="More save actions">
    <solaris-icon name="chevron-down" decorative="true" />
  </button>
</solaris-button-group>
```

## Disabled and loading

Disabled and loading state belong to each child. The group only ensures correct visual layout when children are disabled or loading:

```html
<solaris-button-group aria-label="Actions">
  <button solaris-button>Save</button>
  <button solaris-button disabled>Delete</button>
  <button solaris-button [loading]="true">Saving</button>
</solaris-button-group>
```

## Accessibility

- The group applies `role="group"` by default.
- Consumers must provide `aria-label` or `aria-labelledby` when there is no visible label.
- The group does not create `role="toolbar"`, `role="radiogroup"`, or `role="tablist"`.
- The group does not capture keyboard events.
- The group does not alter tab order of children.
- Each child is responsible for its own accessible name, disabled state, and loading state.

## Examples

### Basic horizontal

```html
<solaris-button-group aria-label="Editor actions">
  <button solaris-button>Edit</button>
  <button solaris-button>Duplicate</button>
  <button solaris-button>Delete</button>
</solaris-button-group>
```

### Horizontal with disabled

```html
<solaris-button-group aria-label="Editor actions">
  <button solaris-button>Edit</button>
  <button solaris-button>Duplicate</button>
  <button solaris-button disabled>Delete</button>
</solaris-button-group>
```

### Vertical icon group

```html
<solaris-button-group orientation="vertical" aria-label="Mood">
  <button solaris-icon-button aria-label="Happy">
    <solaris-icon name="success" decorative="true" />
  </button>
  <button solaris-icon-button aria-label="Neutral">
    <solaris-icon name="info" decorative="true" />
  </button>
  <button solaris-icon-button aria-label="Sad">
    <solaris-icon name="danger" decorative="true" />
  </button>
</solaris-button-group>
```

### Mixed group (button + icon button)

```html
<solaris-button-group aria-label="Save actions">
  <button solaris-button>Save</button>
  <button solaris-icon-button aria-label="More save actions">
    <solaris-icon name="chevron-down" decorative="true" />
  </button>
</solaris-button-group>
```

> Note: This is visual grouping only. Split button/dropdown behavior will be a separate component in the future.

### Badge composition

```html
<solaris-button-group aria-label="Actions with counts">
  <button solaris-button>
    Save
    <solaris-badge variant="count" color="primary">36</solaris-badge>
  </button>
  <button solaris-icon-button aria-label="Notifications">
    <solaris-icon name="bell" decorative="true" />
    <solaris-badge solaris-icon-button-badge variant="count" color="danger">3</solaris-badge>
  </button>
</solaris-button-group>
```

### Separated (attached=false)

```html
<solaris-button-group aria-label="Actions" [attached]="false">
  <button solaris-button>Edit</button>
  <button solaris-button>Duplicate</button>
  <button solaris-button disabled>Delete</button>
</solaris-button-group>
```

### Full width

```html
<solaris-button-group aria-label="Form actions" [fullWidth]="true">
  <button solaris-button>Cancel</button>
  <button solaris-button color="primary">Submit</button>
</solaris-button-group>
```

### Anchor support

```html
<solaris-button-group aria-label="Links">
  <a solaris-button href="/edit">Edit</a>
  <a solaris-icon-button href="/delete" aria-label="Delete">
    <solaris-icon name="danger" decorative="true" />
  </a>
</solaris-button-group>
```

## Limitations (v1)

- Button Group v1 does not control selection.
- Button Group v1 does not control active/pressed state.
- Button Group v1 does not implement dropdown behavior.
- Button Group v1 does not implement split button behavior.
- Button Group v1 does not implement roving tabindex.
- Button Group v1 does not propagate appearance, color, size, or radius to children.
- Each child controls its own appearance, color, size, radius, disabled, and loading state.
- The group controls layout and visual union only.

## Related patterns

- Segmented Control — implemented as `solaris-segmented-control` (option selection)
- Tabs — implemented as `solaris-tabs` (content switching)
- Toggle Group — future (state control)
- Split Button — future (primary action + menu)
- Dropdown Button — future (menu opening)
- Toolbar — future (keyboard navigation)
- Selected/pressed state management — future
- Roving tabindex for toolbar-like groups — future

## CSS Variables

| Token                                    | Purpose                                        |
| ---------------------------------------- | ---------------------------------------------- |
| `--solaris-button-group-gap`             | Gap between separated items                    |
| `--solaris-button-group-radius`          | Outer border-radius for the attached group     |
| `--solaris-button-group-border-color`    | Outer border color for the attached group      |
| `--solaris-button-group-separator-color` | Internal border color between attached items   |
| `--solaris-button-disabled-opacity`      | Disabled opacity applied to child buttons      |
