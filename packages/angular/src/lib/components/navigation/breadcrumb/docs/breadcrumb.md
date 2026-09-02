# SolarisBreadcrumbComponent

## Purpose

Breadcrumb communicates the user's current location in a hierarchy and provides
links back to parent levels. It supports text-only, icon-only, and icon + text
items, optional overflow, separator variants, and optional previous/next pager
buttons.

## API

### Inputs

| Input              | Type                                     | Default    | Description                                      |
| ------------------ | ---------------------------------------- | ---------- | ------------------------------------------------ |
| `items`            | `SolarisBreadcrumbItem[]`                | required   | Ordered breadcrumb trail.                        |
| `size`             | `'sm' \| 'md' \| 'lg'`                   | `'md'`     | Component size.                                  |
| `separator`        | `'slash' \| 'chevron' \| 'dot'`          | `'slash'`  | Icon separator rendered between visible items.   |
| `maxVisibleItems`  | `number \| null`                         | `null`     | Maximum visible crumb items before overflow.     |
| `overflowPosition` | `'none' \| 'start' \| 'middle' \| 'end'` | `'none'`   | Hidden segment position when overflow is active. |
| `showNavigation`   | `boolean`                                | `false`    | Shows optional previous/next chevron buttons.    |
| `ariaLabel`        | `string`                                 | translated | Accessible label for the breadcrumb navigation.  |
| `ariaLabelKey`     | `string`                                 | —          | Translation key for the navigation label.        |

### Item model

```ts
interface SolarisBreadcrumbItem {
  label?: string;
  labelKey?: string;
  icon?: string;
  href?: string;
  value?: string | number;
  current?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  ariaLabelKey?: string;
}
```

- Items with `href` render as native links unless they are disabled or current.
- Items without `href` render as plain text.
- The current item renders as text with `aria-current="page"`.
- Icon-only items must provide `ariaLabel` or `ariaLabelKey`.

### Outputs

| Output     | Type                             | Description                                     |
| ---------- | -------------------------------- | ----------------------------------------------- |
| `navigate` | `SolarisBreadcrumbNavigateEvent` | Emitted when a link or overflow item is chosen. |
| `previous` | `void`                           | Emitted by the optional previous pager button.  |
| `next`     | `void`                           | Emitted by the optional next pager button.      |

## Overflow

Overflow is disabled by default. Set both `maxVisibleItems` and
`overflowPosition` to collapse part of the trail behind an ellipsis menu.

- `start`: hides the beginning and shows the tail.
- `middle`: keeps the first and last items visible and hides the middle.
- `end`: keeps the beginning and current item visible and hides the end segment.

The current item is always visible. The ellipsis trigger opens a dropdown menu
with the hidden items in their original order.

## Size and Separator Variants

Use `size` to scale the breadcrumb's text, icons, separators, and pager
controls together.

| Size | Use case                         |
| ---- | -------------------------------- |
| `sm` | Compact navigation and toolbars. |
| `md` | Default page navigation.         |
| `lg` | Prominent hierarchical context.  |

Use `separator` to match the hierarchy's visual language:

| Separator | Appearance     |
| --------- | -------------- |
| `slash`   | `/`            |
| `chevron` | Right chevron. |
| `dot`     | Centered dot.  |

## Accessibility

- Renders `nav` with an accessible label and an ordered list (`ol`).
- Separators are decorative and use `aria-hidden="true"`.
- The current page uses `aria-current="page"` and is not rendered as a link.
- Links are native anchors when `href` is provided.
- The overflow trigger is a native button and uses dropdown-menu keyboard
  behavior.
- Previous/next pager buttons are native buttons with accessible labels and are
  disabled at the trail boundaries.

## CSS Variables

| Variable                              | Default                  | Description                     |
| ------------------------------------- | ------------------------ | ------------------------------- |
| `--solaris-breadcrumb-font-size`      | `--solaris-font-size-md` | Text size.                      |
| `--solaris-breadcrumb-link-color`     | `--solaris-primary-base` | Link color.                     |
| `--solaris-breadcrumb-text-color`     | `--solaris-text-default` | Text/current item color.        |
| `--solaris-breadcrumb-muted-color`    | `--solaris-text-muted`   | Separator and muted icon color. |
| `--solaris-breadcrumb-icon-size`      | `--solaris-spacing-4`    | Item icon size.                 |
| `--solaris-breadcrumb-separator-size` | `--solaris-spacing-3`    | Separator icon size.            |
| `--solaris-breadcrumb-gap`            | `--solaris-spacing-1`    | Gap between inline parts.       |
| `--solaris-breadcrumb-pager-size`     | `--solaris-spacing-5`    | Optional pager button size.     |

## Examples

### Basic

```html
<solaris-breadcrumb [items]="items" />
```

```ts
items = [
  { label: 'Home', icon: 'home', href: '/' },
  { label: 'Settings', href: '/settings' },
  { label: 'Profile', current: true },
];
```

### Overflow

```html
<solaris-breadcrumb [items]="items" [maxVisibleItems]="3" overflowPosition="middle" />
```

### Optional Pager

```html
<solaris-breadcrumb [items]="items" [showNavigation]="true" (previous)="goBack()" (next)="goForward()" />
```
