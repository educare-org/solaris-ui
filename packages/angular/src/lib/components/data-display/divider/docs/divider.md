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
