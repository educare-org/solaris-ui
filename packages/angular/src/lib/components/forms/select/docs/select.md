# Solaris Select

## Purpose

SolarisSelectComponent is a single-selection form control that opens a dropdown panel with a list of options.

It is the institutional select for Solaris UI: accessible, keyboard-navigable, searchable, clearable, and fully integrated with Angular Reactive Forms and Form Field.

## When to use

- Single choice from a predefined list (e.g., role, country, category).
- The list is small enough to not require virtual scroll (v1 limitation).
- The user needs to search/filter options locally.
- The user needs to clear the selection visibly.
- Integration with Form Field is desired.

## When not to use

- Multiple selection — use `solaris-multi-select`.
- Boolean choices — use Checkbox or Switch.
- Few options visible without opening (2–5 items) — use Radio Group.
- Free-form text input — use Input (Autocomplete not available in v1).
- Async/remote search — not supported in v1.
- Creatable options — not supported in v1.
- Hierarchical/tree selection — not supported in v1.
- Cascading selects — not supported in v1.

## Difference between Select, Radio Group, and Autocomplete

| Component        | Purpose                                                |
| ---------------- | ------------------------------------------------------ |
| **Select**       | Single choice from a dropdown list. Can be searchable. |
| **Radio Group**  | Few visible options. No dropdown.                      |
| **Autocomplete** | Text input with suggestions. Not available in v1.      |

## Single Select v1

Select v1 is strictly single-select. It implements `ControlValueAccessor` and manages a single value.

Select v1 does not implement:

- Multi-select
- Chips
- Virtual scroll
- Async data source
- Creatable options
- Nested options / submenus / tree
- Cascader

## API

### Inputs

| Input                        | Type                                      | Default     | Description                                   |
| ---------------------------- | ----------------------------------------- | ----------- | --------------------------------------------- |
| `value`                      | `unknown`                                 | —           | The selected value                            |
| `placeholder`                | `string`                                  | —           | Placeholder text                              |
| `placeholderKey`             | `string`                                  | —           | i18n key for placeholder                      |
| `searchable`                 | `boolean`                                 | `false`     | Enables local search input                    |
| `searchPlaceholder`          | `string`                                  | —           | Search input placeholder                      |
| `searchPlaceholderKey`       | `string`                                  | —           | i18n key for search placeholder               |
| `clearable`                  | `boolean`                                 | `false`     | Shows clear button when value is set          |
| `disabled`                   | `boolean`                                 | `false`     | Disables the select                           |
| `readonly`                   | `boolean`                                 | `false`     | Readonly mode (value preserved, not editable) |
| `invalid`                    | `boolean \| undefined`                    | `undefined` | Manual invalid state                          |
| `loading`                    | `boolean`                                 | `false`     | Shows loading state in panel                  |
| `loadingText`                | `string`                                  | —           | Loading text                                  |
| `loadingTextKey`             | `string`                                  | —           | i18n key for loading text                     |
| `emptyText`                  | `string`                                  | —           | Text when no options available                |
| `emptyTextKey`               | `string`                                  | —           | i18n key for empty text                       |
| `clearLabel`                 | `string`                                  | —           | Custom aria-label for clear button            |
| `clearLabelKey`              | `string`                                  | —           | i18n key for clear button label               |
| `noResultsText`              | `string`                                  | —           | Text when search returns no results           |
| `noResultsTextKey`           | `string`                                  | —           | i18n key for no results text                  |
| `compareWith`                | `(a: unknown, b: unknown) => boolean`     | `Object.is` | Custom comparison function for object values  |
| `displayWith`                | `(value: unknown) => string \| undefined` | —           | Custom display function for trigger text      |
| `appearance`                 | `'outline' \| 'surface' \| 'filled'`      | `'outline'` | Visual appearance                             |
| `size`                       | `'sm' \| 'md' \| 'lg'`                    | `'md'`      | Size variant                                  |
| `density`                    | `'compact' \| 'comfortable'`              | inherited   | Density variant                               |
| `radius`                     | `'none' \| 'sm' \| 'md' \| 'lg'`          | `'md'`      | Border radius                                 |
| `label` / `labelKey`         | `string`                                  | —           | Label text (used standalone)                  |
| `hint` / `hintKey`           | `string`                                  | —           | Hint text (used standalone)                   |
| `error` / `errorKey`         | `string`                                  | —           | Error text (used standalone)                  |
| `panelMaxHeight`             | `string \| number`                        | `'20rem'`   | Max height of the dropdown panel              |
| `panelMinWidth`              | `string \| number`                        | —           | Min width of the dropdown panel               |
| `panelMaxWidth`              | `string \| number`                        | —           | Max width of the dropdown panel               |
| `panelMatchTriggerWidth`     | `boolean`                                 | `true`      | Match panel width to trigger width            |
| `ariaLabel` / `ariaLabelKey` | `string`                                  | —           | Accessible label                              |
| `ariaLabelledby`             | `string`                                  | —           | ID of labelling element                       |

### Outputs

| Output            | Type                                  | Description                        |
| ----------------- | ------------------------------------- | ---------------------------------- |
| `valueChange`     | `unknown`                             | Emitted when value changes         |
| `opened`          | `void`                                | Emitted when panel opens           |
| `closed`          | `void`                                | Emitted when panel closes          |
| `openChange`      | `boolean`                             | Emitted when open state changes    |
| `searchChange`    | `string`                              | Emitted when search text changes   |
| `cleared`         | `void`                                | Emitted when value is cleared      |
| `selectionChange` | `SolarisOptionComponent \| undefined` | Emitted when an option is selected |

## Appearances

| Appearance | Visual                                         |
| ---------- | ---------------------------------------------- |
| `outline`  | Visible border and field background (default)  |
| `surface`  | Lighter surface, for cards and panels          |
| `filled`   | Subtle filled background, less dominant border |

## Sizes

| Size | Effect                    |
| ---- | ------------------------- |
| `sm` | Compact trigger and text  |
| `md` | Standard (default)        |
| `lg` | Spacious trigger and text |

## Density

| Density       | Effect                    |
| ------------- | ------------------------- |
| `compact`     | Reduced padding and gap   |
| `comfortable` | Increased padding and gap |

When not provided, Select inherits density from the theme system.

## Radius

| Radius | Effect                         |
| ------ | ------------------------------ |
| `none` | No border radius               |
| `sm`   | Small border radius            |
| `md`   | Medium border radius (default) |
| `lg`   | Large border radius            |

## CSS Variables

Select tokens can be customized on the host or a parent element:

| Token                                | Purpose                       |
| ------------------------------------ | ----------------------------- |
| `--solaris-select-value-color`       | Selected value text color     |
| `--solaris-select-font-size`         | Font size                     |
| `--solaris-select-line-height`       | Line height                   |
| `--solaris-select-placeholder-color` | Placeholder text color        |
| `--solaris-select-icon-color`        | Dropdown and clear icon color |

## Searchable

When `searchable` is `true`, a search input appears at the top of the dropdown panel.

- Search is local and synchronous (v1).
- Filters options by label, description, and text content.
- Case and accent insensitive (uses NFD normalization).
- `searchChange` emits the current query.
- When the panel closes, the search query is cleared.
- When the panel opens with an existing value, the selected option is active.
- If search returns no results, `noResultsText` is shown.
- Escape with a non-empty search query clears the search first; Escape with an empty query closes the panel.

## Clearable

When `clearable` is `true` and a value is selected, a clear button appears in the trigger.

- Clicking clear sets the value to `null`.
- `valueChange(null)` and `cleared` are emitted.
- `onChange(null)` is called.
- The select is marked as touched.
- The clear button does not open the dropdown.
- Clear is hidden when the select is disabled or readonly.

## Loading

When `loading` is `true`, the dropdown panel shows a loading state.

- Loading is visual only (v1). It does not manage async data sources.
- Backend integration is the consumer's responsibility.
- `loadingText` is translatable.

## Empty / No Results

- When there are no projected options, `emptyText` is shown.
- When search yields no results, `noResultsText` is shown.
- Both are translatable.

## Option / Option Group

Select receives options via content projection:

```html
<solaris-select>
  <solaris-option value="admin">Administrador</solaris-option>
  <solaris-option value="teacher">Professor</solaris-option>
</solaris-select>
```

Groups:

```html
<solaris-select>
  <solaris-option-group label="Academic">
    <solaris-option value="students">Students</solaris-option>
  </solaris-option-group>
</solaris-select>
```

See [option.md](../../option/docs/option.md) and [option-group.md](../../option-group/docs/option-group.md).

## Rich Options

Options support leading icons, labels, descriptions, meta text, and trailing content:

```html
<solaris-select>
  <solaris-option value="pt-BR" label="Português" description="Portuguese">
    <span solaris-option-leading>🇧🇷</span>
    <span solaris-option-trailing>
      <solaris-badge color="primary" size="sm">New</solaris-badge>
    </span>
  </solaris-option>
</solaris-select>
```

## compareWith / displayWith

For object values, provide `compareWith` to match values and `displayWith` to render text:

```html
<solaris-select [compareWith]="comparePlan" [displayWith]="displayPlan">
  <solaris-option [value]="basicPlan" label="Basic"></solaris-option>
</solaris-select>
```

Without `displayWith`, Select warns in development if it cannot display the value.

## Form Field Integration

Select integrates with Form Field via the `SolarisFormControl` abstract class.

Inside Form Field:

```html
<solaris-form-field label="Role" hint="Select a role">
  <solaris-select>
    <solaris-option value="admin">Administrador</solaris-option>
  </solaris-select>
</solaris-form-field>
```

Form Field manages label, hint, error, focus ring, and shell. Select becomes transparent and borderless inside Form Field.

Standalone, Select has its own shell and accepts `label`, `hint`, and `error` inputs.

## Accessibility

Select follows the combobox pattern (WAI-ARIA):

- `role="combobox"` on the trigger
- `role="listbox"` on the panel
- `role="option"` on each option (provided by Option component)
- `aria-expanded`, `aria-haspopup`, `aria-controls` on the trigger
- `aria-activedescendant` pointing to the active option
- `aria-selected` on the selected option
- `aria-disabled` on disabled options
- `aria-invalid` when invalid
- `aria-describedby` connected to hint/error via Form Field
- Search input has `role="searchbox"`
- Ids are SSR-safe

## Keyboard Behavior

### When closed

| Key         | Action                                 |
| ----------- | -------------------------------------- |
| `Enter`     | Opens the panel                        |
| `Space`     | Opens the panel                        |
| `ArrowDown` | Opens the panel and activates next     |
| `ArrowUp`   | Opens the panel and activates previous |
| `Escape`    | No visible action                      |

### When open

| Key         | Action                                             |
| ----------- | -------------------------------------------------- |
| `Enter`     | Selects the active option, closes panel            |
| `Space`     | Selects the active option (if not in search input) |
| `ArrowDown` | Moves active to next enabled option                |
| `ArrowUp`   | Moves active to previous enabled option            |
| `Home`      | Moves active to first enabled option               |
| `End`       | Moves active to last enabled option                |
| `Escape`    | Closes the panel                                   |
| `Tab`       | Closes the panel and moves focus                   |

### Search input keys

| Key         | Action                                  |
| ----------- | --------------------------------------- |
| `ArrowDown` | Moves active to next option             |
| `ArrowUp`   | Moves active to previous option         |
| `Enter`     | Selects the active option               |
| `Escape`    | Clears search, or closes panel if empty |
| `Tab`       | Closes the panel                        |

## States

### Trigger

- Default
- Hover
- Focus-visible
- Open
- Disabled
- Readonly
- Invalid
- Filled (with value)
- Placeholder
- Loading

### Panel

- Default
- Loading
- Empty
- No results
- Option active (keyboard)
- Option selected
- Option disabled
- Group label

## Examples

### Basic

```html
<solaris-select placeholder="Select a role">
  <solaris-option value="admin">Administrator</solaris-option>
  <solaris-option value="teacher">Teacher</solaris-option>
</solaris-select>
```

### Searchable

```html
<solaris-select searchable placeholder="Select a country" searchPlaceholder="Search country...">
  <solaris-option value="br">Brazil</solaris-option>
  <solaris-option value="us">United States</solaris-option>
</solaris-select>
```

### Clearable

```html
<solaris-select clearable placeholder="Select a status">
  <solaris-option value="active">Active</solaris-option>
  <solaris-option value="inactive">Inactive</solaris-option>
</solaris-select>
```

### With Form Field

```html
<solaris-form-field label="Role" hint="Select user role">
  <solaris-select placeholder="Select">
    <solaris-option value="admin">Administrator</solaris-option>
  </solaris-select>
</solaris-form-field>
```

## Limitations of v1

- **Single select only.** Use `solaris-multi-select` for multiple selection.
- **Local search only.** No async/remote search.
- **Visual loading only.** No built-in async data source management.
- **No virtual scroll.** Large lists may have performance issues.
- **No creatable options.**
- **No nested options, submenus, or tree.**
- **No cascading selects.**
- **No custom option template** (use Option's slot directives).
- **Harness not yet available** — may be added in a future iteration.
