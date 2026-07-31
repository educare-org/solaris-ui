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

## Visual variants

### Appearance

Set on the trigger via `solarisDropdownMenuAppearance`.

| Appearance          | Description                                       |
| ------------------- | ------------------------------------------------- |
| `surface` (default) | Solid background with shadow, subtle or no border |
| `outline`           | Surface background with visible border            |

### Radius

Set on the trigger via `solarisDropdownMenuRadius`.

| Radius | Description             |
| ------ | ----------------------- |
| `none` | No border radius        |
| `sm`   | Small radius            |
| `md`   | Medium radius (default) |
| `lg`   | Large radius            |
| `xl`   | Extra large radius      |

### Size

Set on the menu via `size`.

| Size | Description  |
| ---- | ------------ |
| `sm` | Compact menu |
| `md` | Default menu |
| `lg` | Large menu   |

### Density

Set on the menu via `density`.

| Density       | Effect               |
| ------------- | -------------------- |
| `compact`     | Reduced item spacing |
| `comfortable` | Default item spacing |

### Item colors

Set on the item via `color`.

| Color     | Usage                |
| --------- | -------------------- |
| `neutral` | Default item color   |
| `primary` | Brand accent         |
| `success` | Positive action      |
| `warning` | Cautionary action    |
| `danger`  | Destructive action   |
| `info`    | Informational action |

## CSS Variables

The following CSS variables can be customized:

| Token                                            | Purpose                           |
| ------------------------------------------------ | --------------------------------- |
| `--solaris-dropdown-menu-min-width`              | Minimum menu width                |
| `--solaris-dropdown-menu-max-width`              | Maximum menu width                |
| `--solaris-dropdown-menu-gap`                    | Gap between menu items            |
| `--solaris-dropdown-menu-padding`                | Inner padding of the menu panel   |
| `--solaris-dropdown-menu-item-gap`               | Gap between icon, label, shortcut |
| `--solaris-dropdown-menu-item-radius`            | Item border radius                |
| `--solaris-dropdown-menu-item-padding-y`         | Vertical item padding             |
| `--solaris-dropdown-menu-item-padding-x`         | Horizontal item padding           |
| `--solaris-dropdown-menu-item-label-color`       | Item label color                  |
| `--solaris-dropdown-menu-item-danger-color`      | Text color for danger items       |
| `--solaris-dropdown-menu-item-shortcut-color`    | Shortcut hint color               |
| `--solaris-dropdown-menu-item-danger-hover`      | Hover background for danger items |
| `--solaris-dropdown-menu-item-description-color` | Description text color            |
| `--solaris-dropdown-menu-item-focus-ring-color`  | Focus ring color                  |
| `--solaris-dropdown-menu-item-hover-background`  | Item hover background             |
| `--solaris-dropdown-menu-item-focus-background`  | Item focus background             |

## Keyboard Navigation

| Key        | Action                                        |
| ---------- | --------------------------------------------- |
| ArrowDown  | Move to next enabled item                     |
| ArrowUp    | Move to previous enabled item                 |
| ArrowRight | Open submenu (on submenu trigger)             |
| ArrowLeft  | Close submenu, return focus to parent trigger |
| Home       | Move to first enabled item                    |
| End        | Move to last enabled item                     |
| Enter      | Activate focused item / open submenu          |
| Space      | Activate focused item / open submenu          |
| Escape     | Close submenu first, then close root menu     |
| Tab        | Close menu, move focus                        |
| Typeahead  | Type letters to focus matching item           |

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
- Submenu triggers have `aria-haspopup="menu"` and `aria-expanded`

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

### With Submenu

```html
<button solaris-button solaris-dropdown-menu-trigger [solarisDropdownMenuTriggerFor]="actionsMenu">Actions</button>
<solaris-dropdown-menu #actionsMenu>
  <solaris-dropdown-menu-item label="Rename" icon="edit" />
  <solaris-dropdown-submenu>
    <solaris-dropdown-submenu-trigger icon="download"> Export </solaris-dropdown-submenu-trigger>
    <solaris-dropdown-menu>
      <solaris-dropdown-menu-item label="PDF" />
      <solaris-dropdown-menu-item label="CSV" />
      <solaris-dropdown-menu-item label="XLSX" />
    </solaris-dropdown-menu>
  </solaris-dropdown-submenu>
  <solaris-divider />
  <solaris-dropdown-submenu>
    <solaris-dropdown-submenu-trigger icon="settings"> Advanced </solaris-dropdown-submenu-trigger>
    <solaris-dropdown-menu>
      <solaris-dropdown-menu-item label="Permissions" />
      <solaris-dropdown-menu-item label="Audit Log" />
    </solaris-dropdown-menu>
  </solaris-dropdown-submenu>
</solaris-dropdown-menu>
```

## Submenu

### Purpose

Dropdown Submenu extends Dropdown Menu with nested menu support. A submenu trigger renders as a menu item with a trailing chevron and opens a secondary menu beside the trigger.

### Usage

```html
<solaris-dropdown-submenu>
  <solaris-dropdown-submenu-trigger icon="download" label="Export" />
  <solaris-dropdown-menu>
    <solaris-dropdown-menu-item label="PDF" />
    <solaris-dropdown-menu-item label="CSV" />
  </solaris-dropdown-menu>
</solaris-dropdown-submenu>
```

### Submenu (`<solaris-dropdown-submenu>`)

| Input               | Type                                                                              | Default         | Description                          |
| ------------------- | --------------------------------------------------------------------------------- | --------------- | ------------------------------------ |
| `openMode`          | `'hover' \| 'click' \| 'hover-click'`                                             | `'hover-click'` | Interaction mode to open submenu     |
| `openDelay`         | `number`                                                                          | `120`           | Delay before opening on hover (ms)   |
| `closeDelay`        | `number`                                                                          | `160`           | Delay before closing on leave (ms)   |
| `disabled`          | `boolean`                                                                         | `false`         | Disable the submenu                  |
| `placement`         | `'right-start' \| 'right' \| 'right-end' \| 'left-start' \| 'left' \| 'left-end'` | `'right-start'` | Preferred placement of submenu panel |
| `matchTriggerWidth` | `boolean`                                                                         | `false`         | Match submenu width to trigger       |
| `minWidth`          | `string \| null`                                                                  | `null`          | Minimum submenu width                |
| `maxWidth`          | `string \| null`                                                                  | `null`          | Maximum submenu width                |

### Submenu Trigger (`<solaris-dropdown-submenu-trigger>`)

| Input      | Type                                                                     | Default     | Description            |
| ---------- | ------------------------------------------------------------------------ | ----------- | ---------------------- |
| `icon`     | `string \| undefined`                                                    | `undefined` | Leading icon name      |
| `label`    | `string \| undefined`                                                    | `undefined` | Trigger label text     |
| `labelKey` | `string \| undefined`                                                    | `undefined` | Translation key        |
| `disabled` | `boolean`                                                                | `false`     | Disable the trigger    |
| `color`    | `'neutral' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'neutral'` | Semantic color variant |

### Submenu Keyboard Navigation

| Key        | Action                                           |
| ---------- | ------------------------------------------------ |
| ArrowRight | Open submenu and focus first enabled item        |
| ArrowLeft  | Close submenu and return focus to parent trigger |
| Enter      | Open submenu                                     |
| Space      | Open submenu                                     |
| Escape     | Close deepest open submenu first                 |

### Submenu Touch/Click Behavior

- First tap on submenu trigger opens submenu.
- Tapping an actionable item inside submenu runs that item and closes the menu tree.
- Tapping outside closes the whole menu tree.

### Submenu Accessibility

- Submenu trigger has `role="menuitem"` and `aria-haspopup="menu"`
- `aria-expanded` reflects open/closed state
- `aria-controls` points to submenu panel
- `aria-disabled` on disabled triggers

### Submenu Depth

Recommended maximum: **2 submenu levels**. Deeper nesting may cause usability issues.

> Use submenus sparingly. If a menu requires more than two nested levels, prefer a Dialog, Command Palette, dedicated page, or clearer information architecture.

### Submenu and Divider

Dividers work correctly inside menus that contain submenus. Place `<solaris-divider />` between items and submenus as needed.

## Limitations (v1)

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

Architecture supports submenu nesting via additional components.
