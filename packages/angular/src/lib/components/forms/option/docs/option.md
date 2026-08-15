# Solaris Option

## Purpose

`SolarisOptionComponent` is a primitive for selectable list items. It represents a single choice inside a parent selector component like **Select**, **Multi Select**, or **Autocomplete**.

## Difference from Radio and Checkbox

| Component    | Purpose                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------- |
| **Radio**    | Single choice directly in the form. Visible and interactive without opening a dropdown.           |
| **Checkbox** | Boolean or multiple choices directly in the form. Always visible.                                 |
| **Option**   | Item inside a selector component (Select, Multi Select, Autocomplete). Not a form control itself. |

## When to use

- Inside a `solaris-select`, `solaris-multi-select`, or a future `solaris-autocomplete`.
- When you need a structured list item with leading icon, label, description, meta text, and trailing content.
- When you need visual preparation for single or multi selection.

## When not to use

- As a standalone form control. Option is **not** a `ControlValueAccessor`.
- With `formControlName` or `formControl`. Use only inside parent selector components.
- For navigation items. Use navigation-specific components instead.
- For submenu or tree behavior. v1 does not implement nested options or submenus.

## Relation with Select/Multi Select/Autocomplete

Option and Option Group are building blocks.

```html
<solaris-select formControlName="role" label="Perfil">
  <solaris-option value="admin">Administrador</solaris-option>
  <solaris-option value="teacher">Professor</solaris-option>
</solaris-select>
```

Select controls choice. Option represents a choice.

## API

### Inputs

| Input                    | Type                                     | Default        | Description                                                 |
| ------------------------ | ---------------------------------------- | -------------- | ----------------------------------------------------------- |
| `value`                  | `unknown`                                | —              | The value this option represents                            |
| `label`                  | `string`                                 | —              | Direct label text                                           |
| `labelKey`               | `string`                                 | —              | i18n key for label                                          |
| `description`            | `string`                                 | —              | Direct description text                                     |
| `descriptionKey`         | `string`                                 | —              | i18n key for description                                    |
| `disabled`               | `boolean`                                | `false`        | Disables the option                                         |
| `selected`               | `boolean`                                | `false`        | Marks the option as selected                                |
| `active`                 | `boolean`                                | `false`        | Highlights the option as active (e.g., keyboard navigation) |
| `highlighted`            | `boolean`                                | `false`        | Contextual highlight (e.g., search match)                   |
| `selectionMode`          | `'none' \| 'single' \| 'multiple'`       | `'none'`       | Visual selection mode                                       |
| `showSelectionIndicator` | `boolean`                                | `false`        | Shows visual selection indicator                            |
| `size`                   | `'sm' \| 'md' \| 'lg'`                   | `'md'`         | Size variant                                                |
| `density`                | `'compact' \| 'normal' \| 'comfortable'` | inherited      | Density variant                                             |
| `id`                     | `string`                                 | auto-generated | Element ID                                                  |

### Outputs

Option does not emit outputs. Parent components control interaction via `@ContentChildren` and internal contracts.

## Slots / Anatomy

| Slot Selector                  | Area        | Description                                                         |
| ------------------------------ | ----------- | ------------------------------------------------------------------- |
| `[solaris-option-leading]`     | Leading     | Icon, flag, avatar, or visual indicator on the left                 |
| `[solaris-option-label]`       | Label       | Explicit label text (overrides projected content and `label` input) |
| default content                | Label       | Simple projected text becomes the label                             |
| `[solaris-option-description]` | Description | Secondary text below the label                                      |
| `[solaris-option-meta]`        | Meta        | Auxiliary text on the right side (e.g., "English", "Admin")         |
| `[solaris-option-trailing]`    | Trailing    | Badge, expansion icon, checkmark, shortcut, counter                 |

## Label and Description Priority

**Label:**

1. `[solaris-option-label]` slot (explicit label)
2. Projected content (simple text)
3. `label` input
4. `labelKey` translation

**Description:**

1. `[solaris-option-description]` slot
2. `description` input
3. `descriptionKey` translation

## Rich Content

Option allows rich projected content by composition:

- `solaris-icon` in leading or trailing
- `solaris-badge` in trailing
- Flag emoji or text in leading
- Custom elements in any slot

Do **not** create specific inputs like `icon`, `badge`, `badgeColor`. Use composition.

## Selected vs Active

- **Selected**: the option is currently chosen (persistent state).
- **Active**: the option is currently highlighted by mouse or keyboard navigation (transient state).

Example: User opens a Select. "Professor" is selected. User presses Arrow Down. "Aluno" becomes active. "Professor" remains selected.

## Visual Multi-Select Preparation

Option can show a checkbox-like visual indicator when:

```
selectionMode="multiple"
showSelectionIndicator="true"
```

This is **visual only**. Multi-select behavior (toggling, value array management) is the parent's responsibility.

## Option Group

```html
<solaris-option-group label="Academic">
  <solaris-option value="students">Students</solaris-option>
  <solaris-option value="classes">Classes</solaris-option>
</solaris-option-group>
```

See [option-group.md](../option-group/docs/option-group.md).

## Disabled

```html
<solaris-option value="unavailable" label="Unavailable" [disabled]="true" />
```

Disabled options have reduced opacity and `aria-disabled="true"`. They are not interactive.

## Size and Density

- `size`: `sm` (2rem min-height), `md` (2.5rem), `lg` (3rem)
- `density`: `compact` (tight), `normal` (default), `comfortable` (spacious)

Parent components can control these for all child options.

## CSS Variables

Option tokens can be customized on the host or a parent element:

| Token                                    | Purpose                                    |
| ---------------------------------------- | ------------------------------------------ |
| `--solaris-option-min-height`            | Minimum row height                         |
| `--solaris-option-background`            | Background color                           |
| `--solaris-option-gap`                   | Gap between leading, content, and trailing |
| `--solaris-option-radius`                | Border radius                              |
| `--solaris-option-padding-y`             | Vertical padding                           |
| `--solaris-option-padding-x`             | Horizontal padding                         |
| `--solaris-option-label-color`           | Label text color                           |
| `--solaris-option-description-color`     | Description text color                     |
| `--solaris-option-description-font-size` | Description font size                      |
| `--solaris-option-meta-color`            | Meta text color                            |
| `--solaris-option-meta-font-size`        | Meta font size                             |
| `--solaris-option-indicator-size`        | Selection indicator size                   |
| `--solaris-option-indicator-color`       | Selection indicator border/background      |
| `--solaris-option-selected-color`        | Selected text color                        |
| `--solaris-option-selected-background`   | Selected background color                  |
| `--solaris-option-hover-background`      | Hover background color                     |
| `--solaris-option-active-background`     | Active background color (mouse/keyboard)   |
| `--solaris-option-disabled-opacity`      | Disabled opacity                           |

## Accessibility

- `role="option"` on host
- `aria-selected` when `selectionMode !== 'none'` and `showSelectionIndicator` is true
- `aria-disabled` when disabled
- `id` is SSR-safe and auto-generated when not provided
- Leading/trailing decorative elements should use `aria-hidden="true"` or `decorative="true"` on icons
- Rich content does not remove accessible name

## Limitations (v1)

- Option is **not** a `ControlValueAccessor`
- Option **does not** use `formControlName`
- Option **does not** control selection alone
- Select and Multi Select control selection; Autocomplete is future
- Option can show visual multi-select indicator but **does not** implement multi-select behavior
- Option can show expansion icon in trailing but **does not** implement submenu
- Option Group is **not** collapsible in v1
- **No** nested option groups in v1
- **No** keyboard navigation implemented in Option v1 (parent responsibility)
- **No** `appearance` input in v1
- **No** `radius` input in v1

## Examples

```html
<!-- Simple -->
<solaris-option value="admin">Administrador</solaris-option>

<!-- With label input -->
<solaris-option value="admin" label="Administrador"></solaris-option>

<!-- With description -->
<solaris-option value="admin" label="Administrador" description="Full access"></solaris-option>

<!-- With flag and meta -->
<solaris-option value="pt-BR">
  <span solaris-option-leading>🇧🇷</span>
  <span solaris-option-label>Português</span>
  <span solaris-option-meta>Portuguese</span>
</solaris-option>

<!-- With badge -->
<solaris-option value="ai">
  <span solaris-option-label>AI</span>
  <span solaris-option-trailing>
    <solaris-badge color="primary" size="sm">New</solaris-badge>
  </span>
</solaris-option>

<!-- Multi-select visual -->
<solaris-option value="us" selectionMode="multiple" [showSelectionIndicator]="true" [selected]="true"> United States </solaris-option>
```
