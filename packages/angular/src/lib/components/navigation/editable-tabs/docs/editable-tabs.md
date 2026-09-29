# Solaris Editable Tabs

## Purpose

Editable Tabs extends the existing Solaris Tabs component with tab management capabilities: rename, remove, reorder, set as default, and custom actions through a per-tab Dropdown Menu.

## Conceptual differences

| Component         | Purpose                                           |
| ----------------- | ------------------------------------------------- |
| **Tabs**          | Base navigation and tab panels                    |
| **Editable Tabs** | Tab management layer over the base Tabs component |
| **Dropdown Menu** | Per-tab actions (rename, move, remove, etc.)      |

Editable Tabs does **not** duplicate the base Tabs visual system, selection logic, keyboard model, or content transition behavior. It reuses `solaris-tabs`, `solaris-tab`, and `solaris-tab-panel` internally.

## No internal persistence

Editable Tabs **does not persist state internally**. It emits user intent through typed events and lets the consumer decide how to persist:

- localStorage
- Backend / user profile
- Tenant settings
- Route / query params
- Application state

This applies to all operations: rename, remove, move, and set as default.

## Supported actions

Built-in actions (when enabled):

1. **Rename** — inline input replaces the tab label
2. **Set as default** — emits `defaultTabChange` event
3. **Move left** — emits `tabMove` event with direction
4. **Move right** — emits `tabMove` event with direction
5. **Remove** — emits `tabRemove` event (danger-styled)

Custom actions can be added through `SolarisEditableTabAction[]`.

## Rename behavior

- Triggered from the Dropdown Menu action
- Tab label becomes an inline text input
- **Enter** confirms rename
- **Escape** cancels rename
- **Blur** follows `renameOnBlur` setting (`'confirm'` or `'cancel'`)
- Empty/whitespace labels are rejected
- Unchanged labels do not emit rename events
- Tab selection remains stable during rename

## Remove behavior

- Locked tabs cannot be removed
- Disabled tabs cannot be removed (unless explicitly enabled)
- `minTabs` and `allowEmpty` are respected
- Removing the active tab selects the next available tab
- Emits `tabRemoveRequested` (for optional consumer confirmation) and `tabRemove`

## Move behavior

- Menu-based "Move left" and "Move right"
- Opt-in drag and drop reordering via `[dragToReorder]="true"` (default `false`)
- Drag and drop emits the same `tabMoveRequested`/`tabMove` events as the menu
- Drop indicator shows the insertion point; orientation-aware (horizontal/vertical)
- Drag is disabled for locked, disabled, renaming, or non-movable tabs
- Drag does not start from buttons, inputs, or editable content
- Menu move remains as the keyboard-accessible fallback
- Locked positions are respected for menu moves
- Actions are disabled at boundaries
- Active selection is preserved after move

## Default tab

- "Set as default" emits `defaultTabChange`
- The component tracks default value temporarily in memory
- Consumers must handle persistence

## Accessibility

- All base Tabs ARIA roles are preserved (`tablist`, `tab`, `tabpanel`)
- The action trigger (ellipses icon) has an accessible name
- The rename input has an associated accessible label
- Keyboard access is available for all actions
- Reduced motion is respected

## Keyboard behavior

| Key           | Context        | Action                |
| ------------- | -------------- | --------------------- |
| Arrow keys    | Tablist        | Navigate between tabs |
| Home/End      | Tablist        | First/last tab        |
| Enter/Space   | Action trigger | Open Dropdown Menu    |
| Enter         | Rename input   | Confirm rename        |
| Escape        | Rename input   | Cancel rename         |
| Arrow Down/Up | Dropdown Menu  | Navigate menu items   |
| Escape        | Dropdown Menu  | Close menu            |

## CSS Variables

Editable Tabs inherits all base Tabs styling tokens. Additional component-level CSS variables:

| Variable                                            | Default                      | Description                                                |
| --------------------------------------------------- | ---------------------------- | ---------------------------------------------------------- |
| `--solaris-editable-tabs-action-size`               | `--solaris-spacing-5`        | Action trigger size                                        |
| `--solaris-editable-tabs-action-radius`             | `--solaris-radius-sm`        | Action trigger border radius                               |
| `--solaris-editable-tabs-action-color`              | `--solaris-text-muted`       | Action trigger icon color                                  |
| `--solaris-editable-tabs-action-hover-color`        | `--solaris-text-default`     | Action trigger hover color                                 |
| `--solaris-editable-tabs-action-hover-background`   | `--solaris-surface-subtle`   | Action trigger hover background                            |
| `--solaris-editable-tabs-rename-input-min-width`    | `--solaris-spacing-16`       | Rename input minimum width                                 |
| `--solaris-editable-tabs-rename-input-padding`      | `--solaris-spacing-1`        | Rename input padding                                       |
| `--solaris-editable-tabs-rename-input-radius`       | `--solaris-radius-sm`        | Rename input border radius                                 |
| `--solaris-editable-tabs-rename-input-font-size`    | `inherit`                    | Rename input font size                                     |
| `--solaris-editable-tabs-rename-input-border-color` | `--solaris-primary-base`     | Rename input border color                                  |
| `--solaris-editable-tabs-rename-input-background`   | `--solaris-surface-base`     | Rename input background                                    |
| `--solaris-editable-tabs-rename-input-height`       | driven by `size` × `density` | Rename input height (follows `--solaris-control-height-*`) |
| `--solaris-editable-tabs-drop-indicator-z-index`    | `--solaris-z-index-content`  | Drop indicator stacking order during drag reorder          |

## Examples

### Basic editable tabs

```html
<solaris-editable-tabs [tabs]="tabs" [(value)]="activeTab" (tabRename)="onRename($event)" (tabRemove)="onRemove($event)" (tabMove)="onMove($event)" />
```

### Locked tab

```html
<solaris-editable-tabs [tabs]="tabs" [(value)]="activeTab" />
```

With tab data:

```typescript
const tabs = [
  { value: 'general', label: 'General', locked: true },
  { value: 'security', label: 'Security' },
];
```

### Custom actions

```html
<solaris-editable-tabs [tabs]="tabs" [(value)]="activeTab" (tabAction)="onAction($event)" />
```

With custom actions:

```typescript
const customActions = [
  { id: 'duplicate', label: 'Duplicate', icon: 'copy' },
  { id: 'export', label: 'Export', icon: 'export' },
];

const tabs = [{ value: 'tab1', label: 'Tab 1', customActions }];
```

## API

### SolarisEditableTabsComponent

| Input               | Type                                     | Default         | Description                                                                                                                                                       |
| ------------------- | ---------------------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tabs`              | `SolarisEditableTabData[]`               | required        | Tab definitions                                                                                                                                                   |
| `value`             | `unknown`                                | `undefined`     | Active tab value (two-way)                                                                                                                                        |
| `defaultValue`      | `unknown`                                | `undefined`     | Initial active value                                                                                                                                              |
| `orientation`       | `'horizontal' \| 'vertical'`             | `'horizontal'`  | Tablist orientation                                                                                                                                               |
| `appearance`        | `'underline' \| 'pills' \| 'enclosed'`   | `'underline'`   | Visual appearance                                                                                                                                                 |
| `size`              | `'sm' \| 'md' \| 'lg'`                   | `'md'`          | Tab size (height and typography)                                                                                                                                  |
| `color`             | `'primary' \| 'neutral'`                 | `'primary'`     | Accent color for active tab                                                                                                                                       |
| `density`           | `'compact' \| 'normal' \| 'comfortable'` | `'normal'`      | Spacing, padding, and typography scale                                                                                                                            |
| `shape`             | `'normal' \| 'wide'`                     | `'normal'`      | Tab proportions                                                                                                                                                   |
| `activationMode`    | `'automatic' \| 'manual'`                | `'automatic'`   | Tab activation mode                                                                                                                                               |
| `contentTransition` | `'none' \| 'fade' \| 'slide'`            | `'slide'`       | Panel content transition                                                                                                                                          |
| `editable`          | `boolean`                                | `true`          | Enable editing                                                                                                                                                    |
| `renamable`         | `boolean`                                | `true`          | Enable rename                                                                                                                                                     |
| `removable`         | `boolean`                                | `true`          | Enable remove                                                                                                                                                     |
| `movable`           | `boolean`                                | `true`          | Enable move                                                                                                                                                       |
| `dragToReorder`     | `boolean`                                | `false`         | Enable drag-and-drop reorder (requires `movable`; accepts static `dragToReorder`). Disabled tabs render `draggable="false"` with no grab cursor or drop indicator |
| `defaultable`       | `boolean`                                | `true`          | Enable set as default                                                                                                                                             |
| `showActions`       | `'hover' \| 'always' \| 'focus-hover'`   | `'focus-hover'` | When to show action trigger                                                                                                                                       |
| `renameOnBlur`      | `'confirm' \| 'cancel'`                  | `'confirm'`     | Behavior on rename input blur                                                                                                                                     |
| `minTabs`           | `number`                                 | `1`             | Minimum tabs before blocking                                                                                                                                      |
| `allowEmpty`        | `boolean`                                | `false`         | Allow removing all tabs                                                                                                                                           |
| `ariaLabel`         | `string \| undefined`                    | `undefined`     | Direct ARIA label                                                                                                                                                 |
| `ariaLabelKey`      | `string \| undefined`                    | `undefined`     | Translation key for ARIA label                                                                                                                                    |

| Output               | Type                                   | Description                      |
| -------------------- | -------------------------------------- | -------------------------------- |
| `valueChange`        | `unknown`                              | Active tab value changed         |
| `tabRenameRequested` | `SolarisEditableTabRenameEvent`        | Before rename (consumer confirm) |
| `tabRename`          | `SolarisEditableTabRenameEvent`        | Rename confirmed                 |
| `tabRemoveRequested` | `SolarisEditableTabRemoveEvent`        | Before remove (consumer confirm) |
| `tabRemove`          | `SolarisEditableTabRemoveEvent`        | Remove confirmed                 |
| `tabMoveRequested`   | `SolarisEditableTabMoveEvent`          | Before move (consumer confirm)   |
| `tabMove`            | `SolarisEditableTabMoveEvent`          | Move confirmed                   |
| `defaultTabChange`   | `SolarisEditableTabDefaultChangeEvent` | Default tab changed              |
| `tabAction`          | `SolarisEditableTabActionEvent`        | Custom action triggered          |

### SolarisEditableTabData

```typescript
interface SolarisEditableTabData<TValue = unknown> {
  value: TValue;
  label?: string;
  labelKey?: string;
  icon?: string;
  badge?: string | number;
  disabled?: boolean;
  locked?: boolean;
  renamable?: boolean;
  removable?: boolean;
  movable?: boolean;
  defaultable?: boolean;
  customActions?: SolarisEditableTabAction[];
  content?: TemplateRef<void>;
}
```

### SolarisEditableTabAction

```typescript
interface SolarisEditableTabAction {
  id: string;
  label?: string;
  labelKey?: string;
  icon?: string;
  color?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  disabled?: boolean;
}
```

## Appearances

| Appearance  | Visual                                    |
| ----------- | ----------------------------------------- |
| `underline` | Active tab has a colored bottom border    |
| `pills`     | Active tab has a rounded background       |
| `enclosed`  | Active tab connects visually to the panel |

Default: `underline`

## Icon action swap

Tabs with an `icon` replace the icon with the action trigger on hover,
focus-within, menu-open, or when `showActions="always"`. The swap uses the
same cross-fade + scale pattern as Code Block (`clipboard` ↔ `check`):
both layers stay mounted and stacked, animating `opacity` and `transform`
(`scale(0.72)` → `scale(1)`) with `--solaris-motion-duration-normal` and
`--solaris-motion-easing-standard`. Reduced motion disables the transition.

## Non-goals (v1)

- Persistence (localStorage, backend, route params)
- Router integration
- Nested editable tabs
- Submenu actions
- Dialog-based rename
- Internal remove confirmation dialog
- Multiple active tabs
- Async remote tab loading
- Tab virtualization
