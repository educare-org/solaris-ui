# Solaris Divider

## Purpose

Divider visually separates groups of content, actions, or sections.

## When to use

- To separate menu items in a dropdown menu
- To divide content sections in cards, dialogs, or layouts
- To create visual separation in toolbars or action groups
- As a semantic separator when `decorative` is `false`

## When not to use

- Do not use Divider as a visual-only element without considering accessibility
- Do not use Divider when spacing alone (padding/margin) is sufficient
- Do not use Divider inside a heading or inline text

## API

| Input       | Type                                   | Default        | Description                          |
| ----------- | -------------------------------------- | -------------- | ------------------------------------ |
| orientation | `'horizontal' \| 'vertical'`           | `'horizontal'` | Direction of the divider line        |
| appearance  | `'subtle' \| 'strong'`                 | `'subtle'`     | Visual weight of the divider         |
| spacing     | `'none' \| 'sm' \| 'md' \| 'lg'`       | `'md'`         | Margin around the divider            |
| inset       | `'none' \| 'start' \| 'end' \| 'both'` | `'none'`       | Indentation from edges               |
| decorative  | `boolean`                              | `true`         | Whether the divider is purely visual |
| width       | `string`                               | `''`           | Horizontal length (e.g. `'10rem'`, `'100%'`) |
| height      | `string`                               | `''`           | Vertical length (e.g. `'4rem'`)            |

## Orientation

| Orientation   | Visual                                                           |
| ------------- | ---------------------------------------------------------------- |
| `horizontal`  | Horizontal line spanning the container width                     |
| `vertical`    | Vertical line spanning the container height, stretches in flex   |

Default: `horizontal`

## Appearance

| Appearance | Visual                                                                  |
| ---------- | ----------------------------------------------------------------------- |
| `subtle`   | Thin border (`--solaris-border-width-sm`) in `--solaris-border-default` |
| `strong`   | Thick border (`--solaris-border-width-lg`) in `--solaris-border-strong` |

Default: `subtle`

## Spacing

| Spacing | Margin  |
| ------- | ------- |
| `none`  | `0`     |
| `sm`    | `0.5rem` |
| `md`    | `0.75rem` |
| `lg`    | `1.25rem` |

Spacing is applied on the block axis for a horizontal divider and on the inline axis for a vertical divider. Default: `md`

## Inset

| Inset   | Effect                                                   |
| ------- | -------------------------------------------------------- |
| `none`  | No indentation                                           |
| `start` | Line is shortened and offset from the start edge         |
| `end`   | Line is shortened from the end edge                      |
| `both`  | Line is shortened from both edges                        |

Default: `none`

## CSS Variables

| Token                             | Purpose                          |
| --------------------------------- | -------------------------------- |
| `--solaris-divider-width`         | Horizontal length                |
| `--solaris-divider-height`        | Vertical length                  |
| `--solaris-divider-spacing-none`  | Margin when `spacing="none"`     |
| `--solaris-divider-spacing-sm`    | Margin when `spacing="sm"`       |
| `--solaris-divider-spacing-md`    | Margin when `spacing="md"`       |
| `--solaris-divider-spacing-lg`    | Margin when `spacing="lg"`       |
| `--solaris-divider-inset-start`   | Indentation from the start edge  |
| `--solaris-divider-inset-end`     | Indentation from the end edge    |

## Length

`width` controls the length of a horizontal divider and `height` the length of a vertical divider. Both accept any CSS length (`'5rem'`, `'120px'`, `'100%'`). When unset, the divider stretches across its container along its main axis.

```html
<solaris-divider width="12rem" />
<solaris-divider orientation="vertical" height="4rem" />
```

`width` and `height` are set as component tokens (`--solaris-divider-width` / `--solaris-divider-height`), so they can also be overridden via CSS.

## Accessibility

- When `decorative` is `true`, `aria-hidden="true"` is applied and no `role` is exposed
- When `decorative` is `false`, `role="separator"` is applied
- Vertical dividers with `decorative=false` receive `aria-orientation="vertical"`

## Examples

### Horizontal subtle (default)

```html
<solaris-divider />
```

### Horizontal strong

```html
<solaris-divider appearance="strong" />
```

### Vertical

```html
<div style="display: flex; height: 100px">
  <span>Item 1</span>
  <solaris-divider orientation="vertical" />
  <span>Item 2</span>
</div>
```

### With spacing

```html
<solaris-divider spacing="lg" /> <solaris-divider spacing="none" />
```

### With inset

```html
<solaris-divider inset="start" /> <solaris-divider inset="both" />
```

### Semantic separator

```html
<solaris-divider [decorative]="false" />
```

### Within Dropdown Menu

```html
<solaris-dropdown-menu>
  <solaris-dropdown-menu-item>Edit</solaris-dropdown-menu-item>
  <solaris-dropdown-menu-item>Duplicate</solaris-dropdown-menu-item>
  <solaris-divider />
  <solaris-dropdown-menu-item color="danger">Delete</solaris-dropdown-menu-item>
</solaris-dropdown-menu>
```
