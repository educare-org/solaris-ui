# Solaris Multi Select

## Purpose

Multi Select represents a multiple selection within a form. It controls an array of values.

## Difference between Select, Multi Select, and Checkbox Group

- **Select** = single choice.
- **Multi Select** = multiple choices in a compact field with dropdown.
- **Checkbox Group** = multiple choices explicit and always visible.

## When to use

- When users need to select multiple items from a list.
- When space is limited and a compact field is preferred.
- When search is helpful for finding options.

## When not to use

- For single selection — use Select.
- When all options should always be visible — use Checkbox Group.
- When options are few (3-5) and always visible works — consider Checkbox Group.

## API

### Inputs

| Input                   | Type                                        | Default     | Description                            |
| ----------------------- | ------------------------------------------- | ----------- | -------------------------------------- |
| `value`                 | `unknown[]`                                 | `[]`        | Current selection                      |
| `placeholder`           | `string \| undefined`                       | —           | Placeholder text                       |
| `placeholderKey`        | `string \| undefined`                       | —           | Translation key for placeholder        |
| `searchable`            | `boolean`                                   | `false`     | Enable local search                    |
| `searchPlaceholder`     | `string \| undefined`                       | —           | Search input placeholder               |
| `searchPlaceholderKey`  | `string \| undefined`                       | —           | Translation key for search placeholder |
| `clearable`             | `boolean`                                   | `false`     | Show clear button                      |
| `disabled`              | `boolean`                                   | `false`     | Disabled state                         |
| `readonly`              | `boolean`                                   | `false`     | Read-only state                        |
| `required`              | `boolean`                                   | `false`     | Required validation                    |
| `invalid`               | `boolean \| undefined`                      | —           | Manual invalid state                   |
| `loading`               | `boolean`                                   | `false`     | Loading state                          |
| `emptyText`             | `string \| undefined`                       | —           | Text when no options                   |
| `emptyTextKey`          | `string \| undefined`                       | —           | Translation key for empty text         |
| `loadingText`           | `string \| undefined`                       | —           | Text during loading                    |
| `loadingTextKey`        | `string \| undefined`                       | —           | Translation key for loading text       |
| `selectAll`             | `boolean`                                   | `false`     | Show select all option                 |
| `selectAllLabel`        | `string \| undefined`                       | —           | Label for select all                   |
| `selectAllLabelKey`     | `string \| undefined`                       | —           | Translation key for select all         |
| `minSelected`           | `number \| undefined`                       | —           | Minimum selection validation           |
| `maxSelected`           | `number \| undefined`                       | —           | Maximum selection validation           |
| `displayMode`           | `'auto' \| 'summary' \| 'chips' \| 'comma'` | `'auto'`    | How selection is displayed             |
| `maxVisibleChips`       | `number`                                    | `3`         | Max chips shown in chips mode          |
| `selectedCountLabel`    | `string \| undefined`                       | —           | Custom label for selected count        |
| `selectedCountLabelKey` | `string \| undefined`                       | —           | Translation key for selected count     |
| `overflowLabel`         | `string \| undefined`                       | —           | Custom label for overflow count        |
| `overflowLabelKey`      | `string \| undefined`                       | —           | Translation key for overflow           |
| `showSelectionTooltip`  | `boolean`                                   | `false`     | Show tooltip with selection info       |
| `noResultsText`         | `string \| undefined`                       | —           | Text when search returns no results    |
| `noResultsTextKey`      | `string \| undefined`                       | —           | Translation key for no results text    |
| `clearLabel`            | `string \| undefined`                       | —           | Custom aria-label for clear button     |
| `clearLabelKey`         | `string \| undefined`                       | —           | Translation key for clear button label |
| `removeChipLabel`       | `string \| undefined`                       | —           | Custom aria-label for chip remove      |
| `removeChipLabelKey`    | `string \| undefined`                       | —           | Translation key for chip remove label  |
| `compareWith`           | `(a, b) => boolean`                         | `Object.is` | Custom comparison function             |
| `displayWith`           | `(value) => string \| undefined`            | —           | Custom display function                |
| `appearance`            | `'outline' \| 'surface' \| 'filled'`        | `'outline'` | Visual appearance                      |
| `size`                  | `'sm' \| 'md' \| 'lg'`                      | `'md'`      | Size variant                           |
| `density`               | `'compact' \| 'comfortable' \| undefined`   | —           | Density                                |
| `radius`                | `'none' \| 'sm' \| 'md' \| 'lg'`            | `'md'`      | Border radius                          |
| `label`                 | `string \| undefined`                       | —           | Label text                             |
| `labelKey`              | `string \| undefined`                       | —           | Translation key for label              |
| `hint`                  | `string \| undefined`                       | —           | Hint text                              |
| `hintKey`               | `string \| undefined`                       | —           | Translation key for hint               |
| `error`                 | `string \| undefined`                       | —           | Error text                             |
| `errorKey`              | `string \| undefined`                       | —           | Translation key for error              |
| `panelMaxHeight`        | `string \| number`                          | `'20rem'`   | Max height of dropdown panel           |
| `panelWidth`            | `string \| number \| undefined`             | —           | Width of dropdown panel                |
| `name`                  | `string \| undefined`                       | —           | Native name attribute                  |
| `ariaLabel`             | `string \| undefined`                       | —           | ARIA label                             |
| `ariaLabelKey`          | `string \| undefined`                       | —           | Translation key for ARIA label         |
| `ariaLabelledby`        | `string \| undefined`                       | —           | ARIA labelledby                        |

### Outputs

| Output            | Type                     | Description               |
| ----------------- | ------------------------ | ------------------------- |
| `valueChange`     | `unknown[]`              | Emits new selection array |
| `selectionChange` | `SolarisOptionComponent` | Emits toggled option      |
| `opened`          | `void`                   | Panel opened              |
| `closed`          | `void`                   | Panel closed              |
| `openChange`      | `boolean`                | Panel open state change   |
| `searchChange`    | `string`                 | Search query change       |
| `cleared`         | `void`                   | Selection cleared         |

## Appearances

| Value     | Description                                                            |
| --------- | ---------------------------------------------------------------------- |
| `outline` | Clear border, neutral background. Default, good for traditional forms. |
| `surface` | Card/panel surface, subtle border.                                     |
| `filled`  | Subtle filled background, modern style.                                |

Default: `outline`

## Sizes

| Value | Height | Use                          |
| ----- | ------ | ---------------------------- |
| `sm`  | 2rem   | Compact forms, dense layouts |
| `md`  | 2.5rem | Standard forms, default      |
| `lg`  | 3rem   | Prominent inputs             |

Default: `md`

## Density

| Value         | Description                         |
| ------------- | ----------------------------------- |
| `compact`     | Reduced vertical spacing            |
| `comfortable` | Increased vertical spacing. Default |

When not provided, density is inherited from the theme.

## Radius

| Value  | Description              |
| ------ | ------------------------ |
| `none` | Sharp corners            |
| `sm`   | Small rounding           |
| `md`   | Medium rounding. Default |
| `lg`   | Large rounding           |

Default: `md`

## CSS Variables

General component tokens available for advanced customization:

| Token                                    | Purpose                                        |
| ---------------------------------------- | ---------------------------------------------- |
| `--solaris-multi-select-chip-gap`        | Gap between chips                              |
| `--solaris-multi-select-chip-radius`     | Chip border radius                             |
| `--solaris-multi-select-chip-color`      | Chip text color                                |
| `--solaris-multi-select-chip-font-size`  | Chip font size                                 |
| `--solaris-multi-select-chip-padding-x`  | Chip horizontal padding                        |
| `--solaris-multi-select-chip-padding-y`  | Chip vertical padding                          |
| `--solaris-multi-select-chip-background` | Chip background                                |
| `--solaris-multi-select-chip-remove-size` | Chip remove button size                       |
| `--solaris-multi-select-value-color`     | Value and search text color                    |
| `--solaris-multi-select-placeholder-color` | Placeholder text color                       |
| `--solaris-multi-select-font-size`       | Base font size                                 |
| `--solaris-multi-select-line-height`     | Base line height                               |
| `--solaris-multi-select-icon-color`      | Icon color (clear, dropdown, remove)           |
| `--solaris-multi-select-select-all-height` | Select-all row minimum height                |
| `--solaris-surface-hover`                | Hover background for chip remove and select-all |
| `--solaris-primary-muted`                | Partial select-all checkbox background         |
| `--solaris-on-primary`                   | Select-all checkbox check icon color           |

## ControlValueAccessor (CVA)

The component implements `ControlValueAccessor` with array value:

- `writeValue` normalizes `null`/`undefined` to `[]`.
- `registerOnChange` emits new array on selection change.
- `registerOnTouched` called on panel close.
- `setDisabledState` controls disabled state.

## compareWith

Custom comparison function for object values. Defaults to `Object.is`.

## displayWith

Custom function to display values. Useful for object values where `labelText` is not set.

## displayMode

Three display modes:

### summary (default)

Shows compact count: "3 selected", "1 selected". Best for many items.

### chips

Shows individual chips with remove button. Respects `maxVisibleChips`. Overflow shows +N.

### comma

Shows comma-separated list of selected labels.

## searchable

Local search over projected options. Filters by label text, description, and projected content. Does not call external APIs. Selection is preserved even when options are filtered out.

## clearable

Shows clear button when selection exists. Clears all selections. Button has accessible label. Not shown in disabled/readonly state.

## selectAll

Optional select all toggle at top of dropdown:

- Unchecked: no items selected.
- Checked: all enabled/visible items selected.
- Partial/indeterminate: some items selected.

When search is active, select all acts on currently filtered visible options.

## minSelected / maxSelected

- `minSelected`: minimum required selection count.
- `maxSelected`: maximum allowed selection count.
- Both validate on touch, not on the fly.
- `maxSelected` does NOT block selection of additional options by default (consistent with Checkbox Group).

## readonly

- Does not allow opening the dropdown.
- Does not allow changing selection.
- Maintains normal contrast.
- Clear button and chip remove buttons are not available.

## disabled

- Blocks all interaction.
- Reduces opacity.
- Different visual from readonly.

## loading

Visual loading state inside the dropdown panel. Does not implement internal fetching.

## empty

Shown when no options are available or when search returns no results.

## Option / Option Group integration

Uses `<solaris-option>` and `<solaris-option-group>`:

- Options with `selectionMode='multiple'` and `showSelectionIndicator` show checkbox indicators.
- Disabled options are not selectable.
- Disabled option groups disable all child options.
- Option active vs selected states are controlled by the Multi Select.

## Tooltip integration

Optional. When `showSelectionTooltip=true` and Tooltip is available, the overflow or summary can display a tooltip with the full list of selected items. Tooltip is informational only.

## Form Field integration

Works inside `<solaris-form-field>`:

- Cooperates with label/hint/error.
- Receives describedBy IDs.
- Exposes states: focused, disabled, readonly, required, invalid.
- Hides own label/hint/error when inside Form Field.

## Accessibility

- Role `combobox` on trigger.
- Role `listbox` with `aria-multiselectable="true"` on panel.
- `aria-expanded`, `aria-controls`, `aria-activedescendant`.
- Options have `role="option"` and `aria-selected`.
- Disabled options have `aria-disabled`.
- Clear button has accessible name.
- Chip remove buttons have accessible name.
- Keyboard navigation: Enter/Space to toggle, Arrow keys to navigate, Escape to close, Tab to close and continue.

## Keyboard navigation

| Key           | Action                               |
| ------------- | ------------------------------------ |
| Enter / Space | Open dropdown / select active option |
| ArrowDown     | Open dropdown / move active down     |
| ArrowUp       | Open dropdown / move active up       |
| Escape        | Close dropdown                       |
| Tab           | Close dropdown and move focus        |
| Home          | First option                         |
| End           | Last option                          |

## Examples

### Basic

```html
<solaris-multi-select formControlName="countries" label="Países" placeholder="Selecione países">
  <solaris-option value="br">Brasil</solaris-option>
  <solaris-option value="us">Estados Unidos</solaris-option>
  <solaris-option value="pt">Portugal</solaris-option>
</solaris-multi-select>
```

### With groups

```html
<solaris-multi-select formControlName="permissions" label="Permissões" searchable selectAll>
  <solaris-option-group label="Acadêmico">
    <solaris-option value="students">Alunos</solaris-option>
    <solaris-option value="classes">Turmas</solaris-option>
  </solaris-option-group>
  <solaris-option-group label="Financeiro">
    <solaris-option value="billing">Cobrança</solaris-option>
    <solaris-option value="payments">Pagamentos</solaris-option>
  </solaris-option-group>
</solaris-multi-select>
```

### Form Field integration

```html
<solaris-form-field label="Módulos" hint="Selecione um ou mais módulos">
  <solaris-multi-select formControlName="modules" searchable clearable>
    <solaris-option value="academic">Acadêmico</solaris-option>
    <solaris-option value="financial">Financeiro</solaris-option>
  </solaris-multi-select>
</solaris-form-field>
```

## Limitations v1

- No virtual scroll.
- No async remote fetching.
- No creatable options.
- No nested option groups / submenu / cascader / tree select.
- `maxSelected` validates but does not automatically block remaining options.
- No bulk actions beyond select all.
- `showSelectionTooltip` is informational only; for selection actions, use Popover pattern.
