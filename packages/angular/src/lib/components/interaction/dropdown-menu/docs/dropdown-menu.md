# Solaris Dropdown Menu

## Purpose

Dropdown Menu displays a list of actions or commands in an overlay triggered by a button or other interactive element.

## Conceptual difference

| Component     | Purpose                                     |
| ------------- | ------------------------------------------- |
| Dropdown Menu | Actions and commands                        |
| Select        | Value selection in forms                    |
| Popover       | General-purpose overlay with custom content |
| Dialog        | Modal or modeless dialog with focus trap    |

**Dropdown Menu is for actions/comands.**
**Select is for value selection in forms.**
**Popover is overlay infrastructure.**
**Dialog is for focused interactions.**

## Usage

```html
<button solaris-button solaris-dropdown-menu-trigger [solarisDropdownMenuTriggerFor]="myMenu">Actions</button>

<solaris-dropdown-menu #myMenu>
  <solaris-dropdown-menu-item label="Edit" icon="edit" />
  <solaris-dropdown-menu-item label="Duplicate" icon="copy" />
  <solaris-divider />
  <solaris-dropdown-menu-item label="Delete" color="danger" />
</solaris-dropdown-menu>
```

## API

### Dropdown Menu Trigger (`[solaris-dropdown-menu-trigger]`)

| Input                                    | Type                                     | Default     | Description                       |
| ---------------------------------------- | ---------------------------------------- | ----------- | --------------------------------- |
| `solarisDropdownMenuTriggerFor`          | `SolarisDropdownMenuComponent`           | required    | Reference to the dropdown menu    |
| `solarisDropdownMenuPlacement`           | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'`  | Preferred placement               |
| `solarisDropdownMenuAlign`               | `'start' \| 'center' \| 'end'`           | `'start'`   | Alignment relative to trigger     |
| `solarisDropdownMenuOffset`              | `number`                                 | `8`         | Offset from trigger in pixels     |
| `solarisDropdownMenuAppearance`          | `'surface' \| 'outline'`                 | `'surface'` | Panel appearance                  |
| `solarisDropdownMenuRadius`              | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'`      | Panel border radius               |
| `solarisDropdownMenuCloseOnSelect`       | `boolean`                                | `true`      | Close menu on item selection      |
| `solarisDropdownMenuCloseOnEscape`       | `boolean`                                | `true`      | Close menu on Escape key          |
| `solarisDropdownMenuCloseOnOutsideClick` | `boolean`                                | `true`      | Close menu on outside click       |
| `solarisDropdownMenuMatchTriggerWidth`   | `boolean`                                | `false`     | Match menu width to trigger       |
| `solarisDropdownMenuMinWidth`            | `string \| number \| undefined`          | `undefined` | Minimum menu width                |
| `solarisDropdownMenuMaxWidth`            | `string \| number \| undefined`          | `undefined` | Maximum menu width                |
| `solarisDropdownMenuDisabled`            | `boolean`                                | `false`     | Disable the trigger               |
| `solarisDropdownMenuRestoreFocus`        | `boolean`                                | `true`      | Restore focus to trigger on close |

| Output       | Description                     |
| ------------ | ------------------------------- |
| `menuOpened` | Emitted when menu opens         |
| `menuClosed` | Emitted when menu closes        |
| `openChange` | Emitted when open state changes |

### Dropdown Menu (`<solaris-dropdown-menu>`)

| Input     | Type                         | Default         | Description  |
| --------- | ---------------------------- | --------------- | ------------ |
| `size`    | `'sm' \| 'md' \| 'lg'`       | `'md'`          | Menu size    |
| `density` | `'compact' \| 'comfortable'` | `'comfortable'` | Menu density |

### Menu Item (`<solaris-dropdown-menu-item>`)

| Input            | Type                                                                     | Default     | Description                     |
| ---------------- | ------------------------------------------------------------------------ | ----------- | ------------------------------- |
| `label`          | `string \| undefined`                                                    | `undefined` | Item label text                 |
| `labelKey`       | `string \| undefined`                                                    | `undefined` | Translation key for label       |
| `description`    | `string \| undefined`                                                    | `undefined` | Secondary description text      |
| `descriptionKey` | `string \| undefined`                                                    | `undefined` | Translation key for description |
| `icon`           | `string \| undefined`                                                    | `undefined` | Icon name                       |
| `iconDecorative` | `boolean`                                                                | `false`     | Whether icon is decorative      |
| `shortcut`       | `string \| undefined`                                                    | `undefined` | Keyboard shortcut hint text     |
| `disabled`       | `boolean`                                                                | `false`     | Disable the item                |
| `color`          | `'neutral' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'neutral'` | Semantic color                  |
| `type`           | `'item' \| 'checkbox' \| 'radio'`                                        | `'item'`    | Item type                       |
| `checked`        | `boolean \| undefined`                                                   | `undefined` | Checked state (checkbox/radio)  |
| `value`          | `unknown`                                                                | `undefined` | Associated value                |
| `closeOnSelect`  | `boolean \| undefined`                                                   | `undefined` | Override menu closeOnSelect     |

| Output         | Description                   |
| -------------- | ----------------------------- |
| `itemSelected` | Emitted when item is selected |

### Group (`<solaris-dropdown-menu-group>`)

Groups menu items together. When a `<solaris-dropdown-menu-label>` is present, applies `role="group"` with `aria-labelledby`.

### Label (`<solaris-dropdown-menu-label>`)

Non-interactive label text for menu groups.

| Input   | Type     | Default  | Description |
| ------- | -------- | -------- | ----------- |
| `label` | `string` | required | Label text  |

## Keyboard Navigation

| Key       | Action                              |
| --------- | ----------------------------------- |
| ArrowDown | Move to next enabled item           |
| ArrowUp   | Move to previous enabled item       |
| Home      | Move to first enabled item          |
| End       | Move to last enabled item           |
| Enter     | Activate focused item               |
| Space     | Activate focused item               |
| Escape    | Close menu, return focus to trigger |
| Tab       | Close menu, move focus              |
| Typeahead | Type letters to focus matching item |

## Accessibility

- Menu panel has `role="menu"`
- Items have correct `role` (`menuitem`, `menuitemcheckbox`, `menuitemradio`)
- `aria-disabled` for disabled items
- `aria-checked` for checkbox/radio items
- `aria-haspopup="menu"` on trigger
- `aria-expanded` on trigger reflects menu state
- `aria-controls` on trigger points to menu
- Groups use `aria-labelledby` when label present
- Focus returns to trigger on close

## Examples

### Basic Dropdown Menu

```html
<button solaris-button solaris-dropdown-menu-trigger [solarisDropdownMenuTriggerFor]="basicMenu">Open</button>
<solaris-dropdown-menu #basicMenu>
  <solaris-dropdown-menu-item label="Edit" />
  <solaris-dropdown-menu-item label="Duplicate" />
  <solaris-dropdown-menu-item label="Delete" />
</solaris-dropdown-menu>
```

### With Icons

```html
<solaris-dropdown-menu #iconMenu>
  <solaris-dropdown-menu-item label="Edit" icon="edit" />
  <solaris-dropdown-menu-item label="Copy" icon="copy" />
  <solaris-dropdown-menu-item label="Trash" icon="trash" />
</solaris-dropdown-menu>
```

### With Divider

```html
<solaris-dropdown-menu #dividerMenu>
  <solaris-dropdown-menu-item label="Edit" />
  <solaris-dropdown-menu-item label="Duplicate" />
  <solaris-divider />
  <solaris-dropdown-menu-item label="Delete" color="danger" />
</solaris-dropdown-menu>
```

### With Groups and Labels

```html
<solaris-dropdown-menu #groupMenu>
  <solaris-dropdown-menu-group>
    <solaris-dropdown-menu-label label="View" />
    <solaris-dropdown-menu-item label="Zoom In" />
    <solaris-dropdown-menu-item label="Zoom Out" />
  </solaris-dropdown-menu-group>
  <solaris-dropdown-menu-group>
    <solaris-dropdown-menu-label label="Edit" />
    <solaris-dropdown-menu-item label="Cut" />
    <solaris-dropdown-menu-item label="Copy" />
  </solaris-dropdown-menu-group>
</solaris-dropdown-menu>
```

## Limitations (v1)

- No submenu/nested menu
- No menu bar
- No context menu via right-click
- No command palette
- No select/combobox behavior
- No virtual scroll
- No async loading
- No drag reorder
- No forms inside menu
- No focus trap
- No complex widgets inside menu
- No navigation dropdown with automatic routing

## Future

Architecture is compatible with future submenu support via additional components.
