# Solaris Tabs

## Purpose

Tabs organize related content into separate panels, allowing users to switch between them without navigating to a different page. Tabs represent navigation between content panels at the same hierarchical level.

## When to use

- Switching between sections of a page
- Toggling between configuration panels
- Alternating between content categories (e.g., Code, Issues, Pull requests, Actions)
- Composing screens without requiring routing

## When not to use

- Do not use Tabs for compact state choices — use Segmented Control instead.
- Do not use Tabs for sequential workflows — use Stepper instead.
- Do not use Tabs for action menus — use Dropdown Menu instead.
- Do not use Tabs for vertical disclosure — use Accordion instead.
- Do not use Tabs for user preference persistence — the application is responsible for that.

## Difference between Tabs, Segmented Control, Stepper and Accordion

| Component         | Purpose                                                   |
| ----------------- | --------------------------------------------------------- |
| Tabs              | Switch between related panels at the same level           |
| Segmented Control | Compact selection between a few mutually exclusive states |
| Stepper           | Sequential multi-step flow with progress indication       |
| Accordion         | Vertical disclosure of content sections                   |

## Components

### SolarisTabsComponent

Selector: `solaris-tabs`

The container component that manages the active tab value and coordinates tabs and panels.

### SolarisTabComponent

Selector: `solaris-tab`

The tab trigger element. Each tab represents a single selectable item in the tablist.

### SolarisTabPanelComponent

Selector: `solaris-tab-panel`

The content panel associated with a tab. Only the active panel is visible.

## API

### SolarisTabsComponent

| Input               | Type                                     | Default        | Description                             |
| ------------------- | ---------------------------------------- | -------------- | --------------------------------------- |
| `value`             | `string \| number \| undefined`          | —              | Active tab value (two-way binding)      |
| `defaultValue`      | `string \| number \| undefined`          | —              | Initial value when value is not set     |
| `orientation`       | `'horizontal' \| 'vertical'`             | `'horizontal'` | Layout orientation                      |
| `appearance`        | `'underline' \| 'pills' \| 'enclosed'`   | `'underline'`  | Visual style                            |
| `size`              | `'sm' \| 'md' \| 'lg'`                   | `'md'`         | Tab size (height and typography)        |
| `color`             | `'primary' \| 'neutral'`                 | `'primary'`    | Accent color for active tab             |
| `density`           | `'compact' \| 'normal' \| 'comfortable'` | `'normal'`     | Spacing, padding, and typography scale  |
| `shape`             | `'normal' \| 'wide'`                     | `'normal'`     | Tab proportions                         |
| `activationMode`    | `'automatic' \| 'manual'`                | `'automatic'`  | Keyboard activation behavior            |
| `contentTransition` | `'none' \| 'fade' \| 'slide'`            | `'fade'`       | Panel transition animation              |
| `fullWidth`         | `boolean`                                | `false`        | Distribute tabs to fill available width |
| `fitContent`        | `boolean`                                | `true`         | Tabs occupy content width               |
| `scrollable`        | `boolean`                                | `true`         | Allow horizontal overflow scrolling     |
| `showIndicator`     | `boolean`                                | `true`         | Show active tab indicator               |
| `disabled`          | `boolean`                                | `false`        | Disable all tabs                        |
| `ariaLabel`         | `string \| undefined`                    | —              | Accessible label for the tablist        |
| `ariaLabelKey`      | `string \| undefined`                    | —              | Translation key for accessible label    |

| Output        | Type                            | Description                             |
| ------------- | ------------------------------- | --------------------------------------- |
| `valueChange` | `string \| number \| undefined` | Emitted when active value changes       |
| `tabChange`   | `SolarisTabsChangeEvent`        | Emitted with previous and current value |
| `tabClick`    | `SolarisTabClickEvent`          | Emitted when a tab is clicked           |

### SolarisTabComponent

| Input            | Type                            | Default  | Description                          |
| ---------------- | ------------------------------- | -------- | ------------------------------------ |
| `value`          | `string \| number`              | required | Unique value identifying this tab    |
| `label`          | `string \| undefined`           | —        | Tab label text                       |
| `labelKey`       | `string \| undefined`           | —        | Translation key for label            |
| `icon`           | `string \| undefined`           | —        | Icon name from the icon registry     |
| `iconDecorative` | `boolean`                       | `true`   | Whether icon is decorative           |
| `badge`          | `string \| number \| undefined` | —        | Badge/count value                    |
| `badgeLabel`     | `string \| undefined`           | —        | Accessible label for badge           |
| `badgeLabelKey`  | `string \| undefined`           | —        | Translation key for badge label      |
| `disabled`       | `boolean`                       | `false`  | Disable this tab                     |
| `ariaLabel`      | `string \| undefined`           | —        | Accessible label for the tab         |
| `ariaLabelKey`   | `string \| undefined`           | —        | Translation key for accessible label |

### SolarisTabPanelComponent

| Input   | Type               | Default  | Description                               |
| ------- | ------------------ | -------- | ----------------------------------------- |
| `value` | `string \| number` | required | Value matching the associated tab         |
| `lazy`  | `boolean`          | `false`  | Lazily render content on first activation |

## Usage

### Basic tabs without panels

```html
<solaris-tabs [(value)]="activeTab">
  <solaris-tab value="overview">Overview</solaris-tab>
  <solaris-tab value="settings">Settings</solaris-tab>
</solaris-tabs>
```

### Tabs with panels

```html
<solaris-tabs [(value)]="activeTab">
  <solaris-tab value="code" icon="code">Code</solaris-tab>
  <solaris-tab value="issues" icon="circle-nodes" [badge]="30">Issues</solaris-tab>
  <solaris-tab value="pull-requests" icon="git-pull-request">Pull requests</solaris-tab>
  <solaris-tab value="actions" icon="play-circle">Actions</solaris-tab>

  <solaris-tab-panel value="code">Code content</solaris-tab-panel>
  <solaris-tab-panel value="issues">Issues content</solaris-tab-panel>
  <solaris-tab-panel value="pull-requests">Pull requests content</solaris-tab-panel>
  <solaris-tab-panel value="actions">Actions content</solaris-tab-panel>
</solaris-tabs>
```

### Orientation

Use `orientation` to switch between horizontal and vertical layouts.

```html
<solaris-tabs orientation="vertical" [(value)]="activeTab">
  <solaris-tab value="general">General</solaris-tab>
  <solaris-tab value="security">Security</solaris-tab>
  <solaris-tab value="notifications">Notifications</solaris-tab>
</solaris-tabs>
```

### Appearances

```html
<solaris-tabs appearance="underline">...</solaris-tabs>
<solaris-tabs appearance="pills">...</solaris-tabs>
<solaris-tabs appearance="enclosed">...</solaris-tabs>
```

| Appearance  | Visual                                    |
| ----------- | ----------------------------------------- |
| `underline` | Active tab has a colored bottom border    |
| `pills`     | Active tab has a rounded background       |
| `enclosed`  | Active tab connects visually to the panel |

### Sizes and density

`size` and `density` work together as a 3×3 matrix, mirroring Segmented
Control. `size` sets the height ladder (via `--solaris-control-height-*`
tokens) and the typography (`sm` → `xs`, `md` → `sm`, `lg` → `md`), while
`density` scales padding, gap, and icon size (`compact` < `normal` <
`comfortable`). When `density` is not set, the theme density is used.

```html
<solaris-tabs size="sm" density="compact">...</solaris-tabs>
<solaris-tabs size="md">...</solaris-tabs>
<solaris-tabs size="lg" density="comfortable">...</solaris-tabs>
```

| Size | Font size | Example height (`normal` density) |
| ---- | --------- | --------------------------------- |
| `sm` | `xs`      | `36px`                            |
| `md` | `sm`      | `40px`                            |
| `lg` | `md`      | `44px`                            |

### Colors

```html
<solaris-tabs color="primary">...</solaris-tabs> <solaris-tabs color="neutral">...</solaris-tabs>
```

| Color     | Description                                                                 |
| --------- | --------------------------------------------------------------------------- |
| `primary` | Brand accent for the indicator and active tab. Default                      |
| `neutral` | Muted accent for dense docs/headers and `enclosed` tabs over `surface-base` |

`color` only swaps the indicator, the active tab text, and the active tab
background. Focus rings always use the primary color.

### Shapes

```html
<solaris-tabs shape="wide">...</solaris-tabs>
```

| Shape    | Description                                          |
| -------- | ---------------------------------------------------- |
| `normal` | Standard tab padding. Default                        |
| `wide`   | Horizontally elongated tab padding (wider than tall) |

`shape="wide"` scales its horizontal padding with density, so the elongation
is proportional in `compact`, `normal`, and `comfortable` modes.

### Activation modes

```html
<solaris-tabs activationMode="automatic" [(value)]="activeTab">...</solaris-tabs> <solaris-tabs activationMode="manual" [(value)]="activeTab">...</solaris-tabs>
```

- `automatic`: Arrow keys activate the tab automatically (default).
- `manual`: Arrow keys move focus only; Enter/Space activates the tab.

### Content transitions

```html
<solaris-tabs contentTransition="fade">...</solaris-tabs>
<solaris-tabs contentTransition="slide">...</solaris-tabs>
<solaris-tabs contentTransition="none">...</solaris-tabs>
```

Transitions respect `prefers-reduced-motion`.

### Icon and badge

```html
<solaris-tab value="issues" icon="circle-nodes" [badge]="30">Issues</solaris-tab>
```

Icons use the Solaris Icon component. Badges use the Solaris Badge component with `variant="count"`.

### Disabled tab

```html
<solaris-tab value="coming-soon" disabled>Coming Soon</solaris-tab>
```

Disabled tabs are skipped during keyboard navigation and ignored on click.

### Lazy panels

```html
<solaris-tab-panel value="settings" [lazy]="true">
  <!-- Content is rendered only when this tab is activated -->
</solaris-tab-panel>
```

## Accessibility

### ARIA

Tabs implement the WAI-ARIA Tabs pattern:

- `role="tablist"` on the tabs container
- `role="tab"` on each tab trigger
- `role="tabpanel"` on each content panel
- `aria-selected="true/false"` on tabs
- `aria-disabled="true"` on disabled tabs and on the tablist when the group is disabled
- `aria-controls` on tab pointing to the associated panel
- `aria-labelledby` on panel pointing to the associated tab
- `aria-orientation` reflecting horizontal/vertical
- `tabindex="0"` on active tab, `"-1"` on inactive tabs

### Keyboard navigation

Keyboard navigation wraps around at the ends (including RTL mirroring of
`ArrowLeft`/`ArrowRight`) and skips disabled tabs:

| Key           | Action                                    |
| ------------- | ----------------------------------------- |
| ArrowRight    | Next tab (horizontal; flipped in RTL)     |
| ArrowLeft     | Previous tab (horizontal; flipped in RTL) |
| ArrowDown     | Next tab (vertical)                       |
| ArrowUp       | Previous tab (vertical)                   |
| Home          | First tab                                 |
| End           | Last tab                                  |
| Enter / Space | Activate tab (manual mode)                |

Disabled tabs are skipped during keyboard navigation.

### Reduced motion

All animations respect `prefers-reduced-motion` and the `[data-reduced-motion]` attribute.

## Preparation for Editable Tabs

Editable Tabs will be implemented after the Dropdown Menu component. The current architecture prepares for:

- Stable tab values and metadata
- Tab icon, badge, and disabled support
- Future tab actions area
- Future "..." button on hover/focus
- Future Dropdown Menu for actions
- Future close, rename, move, and set default functionality

Not yet implemented:

- Closeable tabs
- Tab reordering
- Tab rename
- "..." action menu
- Drag and drop
- Default tab persistence

## Examples

### Basic tabs

```html
<solaris-tabs [(value)]="activeTab">
  <solaris-tab value="overview">Overview</solaris-tab>
  <solaris-tab value="settings">Settings</solaris-tab>
</solaris-tabs>
```

### With panels, icons, and badges

```html
<solaris-tabs [(value)]="activeTab">
  <solaris-tab value="code" icon="code">Code</solaris-tab>
  <solaris-tab value="issues" icon="circle-nodes" [badge]="30">Issues</solaris-tab>
  <solaris-tab value="pull-requests" icon="git-pull-request">Pull requests</solaris-tab>

  <solaris-tab-panel value="code">Code content</solaris-tab-panel>
  <solaris-tab-panel value="issues">Issues content</solaris-tab-panel>
  <solaris-tab-panel value="pull-requests">Pull requests content</solaris-tab-panel>
</solaris-tabs>
```

### Vertical orientation

```html
<solaris-tabs orientation="vertical" [(value)]="activeTab">
  <solaris-tab value="general">General</solaris-tab>
  <solaris-tab value="security">Security</solaris-tab>
  <solaris-tab value="notifications">Notifications</solaris-tab>
</solaris-tabs>
```

### Disabled and lazy

```html
<solaris-tabs [(value)]="activeTab">
  <solaris-tab value="profile">Profile</solaris-tab>
  <solaris-tab value="billing">Billing</solaris-tab>
  <solaris-tab value="coming-soon" disabled>Coming Soon</solaris-tab>
</solaris-tabs>

<solaris-tab-panel value="billing" [lazy]="true">
  <!-- Rendered only when this tab is activated -->
</solaris-tab-panel>
```

## Limitations

- This component does not persist the default tab. The application is responsible for persistence via localStorage, backend, query parameters, or routes.
- Editable Tabs (close, rename, reorder) is not implemented in this version.

## CSS Custom Properties

Container (`solaris-tabs`) tokens:

| Token                            | Default                          | Description                                      |
| -------------------------------- | -------------------------------- | ------------------------------------------------ |
| `--solaris-tabs-gap`             | `0`                              | Gap between tabs                                 |
| `--solaris-tabs-border-color`    | `var(--solaris-border-subtle)`   | Tablist border color                             |
| `--solaris-tabs-indicator-color` | `var(--solaris-primary-base)`    | Active indicator color                           |
| `--solaris-tabs-indicator-size`  | `var(--solaris-border-width-md)` | Active indicator thickness                       |
| `--solaris-tabs-separator-gap`   | `var(--solaris-spacing-3)`       | Gap between vertical tabs and the separator line |
| `--solaris-tabs-panel-padding`   | `var(--solaris-spacing-4)`       | Panel padding                                    |

Tab (`solaris-tab`) tokens:

| Token                             | Default                          | Description            |
| --------------------------------- | -------------------------------- | ---------------------- |
| `--solaris-tab-color`             | `var(--solaris-text-default)`    | Tab text color         |
| `--solaris-tab-active-color`      | `var(--solaris-primary-text)`    | Active tab text color  |
| `--solaris-tab-hover-background`  | `var(--solaris-surface-subtle)`  | Tab hover background   |
| `--solaris-tab-active-background` | `var(--solaris-primary-surface)` | Active tab background  |
| `--solaris-tab-border-color`      | `var(--solaris-border-subtle)`   | Enclosed border color  |
| `--solaris-tab-height`            | driven by `size` × `density`     | Tab minimum height     |
| `--solaris-tab-padding-x`         | driven by `size` × `density`     | Tab horizontal padding |
| `--solaris-tab-padding-y`         | driven by `size` × `density`     | Tab vertical padding   |
| `--solaris-tab-gap`               | driven by `size` × `density`     | Gap inside tab         |
| `--solaris-tab-font-size`         | driven by `size`                 | Tab font size          |
| `--solaris-tab-icon-size`         | driven by `size` × `density`     | Tab icon size          |

With `color="neutral"`, `--solaris-tabs-indicator-color` becomes
`var(--solaris-text-strong)`, `--solaris-tab-active-color` becomes
`var(--solaris-text-strong)`, and `--solaris-tab-active-background` becomes
`var(--solaris-surface-muted)`.
