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

| Input          | Type                                   | Default        | Description                                                  |
| -------------- | -------------------------------------- | -------------- | ------------------------------------------------------------ |
| orientation    | `'horizontal' \| 'vertical'`           | `'horizontal'` | Direction of the divider line                                |
| appearance     | `'subtle' \| 'strong'`                 | `'subtle'`     | Visual weight of the divider                                 |
| variant        | `'solid' \| 'dashed' \| 'dotted'`      | `'solid'`      | Line style of the divider                                    |
| spacing        | `'none' \| 'sm' \| 'md' \| 'lg'`       | `'md'`         | Margin around the divider                                    |
| inset          | `'none' \| 'start' \| 'end' \| 'both'` | `'none'`       | Indentation from edges                                       |
| decorative     | `boolean`                              | `true`         | Whether the divider is purely visual                         |
| width          | `string`                               | —              | Horizontal length (e.g. `'10rem'`, `'100%'`)                 |
| height         | `string`                               | —              | Vertical length (e.g. `'4rem'`)                              |
| label          | `string`                               | —              | Text rendered between the divider lines (horizontal only)    |
| labelKey       | `string`                               | —              | Translation key for the label                                |
| textPosition   | `'start' \| 'center' \| 'end'`         | `'center'`     | Alignment of the label (horizontal only)                     |
| ariaLabel      | `string`                               | —              | Accessible name for a semantic separator without visual text |
| ariaLabelKey   | `string`                               | —              | Translation key for the accessible name                      |
| ariaLabelledby | `string`                               | —              | Id of the element labelling a semantic separator             |

## Orientation

| Orientation  | Visual                                                         |
| ------------ | -------------------------------------------------------------- |
| `horizontal` | Horizontal line spanning the container width                   |
| `vertical`   | Vertical line spanning the container height, stretches in flex |

Default: `horizontal`

## Appearance

| Appearance | Visual                                                                          |
| ---------- | ------------------------------------------------------------------------------- |
| `subtle`   | Thin border (`--solaris-border-width-sm`) in `--solaris-neutral-border-default` |
| `strong`   | Thick border (`--solaris-border-width-lg`) in `--solaris-neutral-border-strong` |

Default: `subtle`

## Variant

| Variant  | Visual               |
| -------- | -------------------- |
| `solid`  | Continuous line      |
| `dashed` | Dashed line segments |
| `dotted` | Dotted line segments |

`variant` composes with `appearance`: `appearance` controls weight/color
(`subtle` vs `strong`), `variant` controls only the line style. Applies to
both orientations. Default: `solid`

```html
<solaris-divider variant="dashed" />
<solaris-divider variant="dotted" appearance="strong" />
<solaris-divider orientation="vertical" variant="dashed" />
```

## Spacing

| Spacing | Margin    |
| ------- | --------- |
| `none`  | `0`       |
| `sm`    | `0.5rem`  |
| `md`    | `0.75rem` |
| `lg`    | `1.25rem` |

Spacing is applied on the block axis for a horizontal divider and on the inline axis for a vertical divider. Default: `md`

## Inset

| Inset   | Effect                                           |
| ------- | ------------------------------------------------ |
| `none`  | No indentation                                   |
| `start` | Line is shortened and offset from the start edge |
| `end`   | Line is shortened from the end edge              |
| `both`  | Line is shortened from both edges                |

Default: `none`

## CSS Variables

| Token                              | Purpose                         |
| ---------------------------------- | ------------------------------- |
| `--solaris-divider-width`          | Horizontal length               |
| `--solaris-divider-height`         | Vertical length                 |
| `--solaris-divider-spacing-none`   | Margin when `spacing="none"`    |
| `--solaris-divider-spacing-sm`     | Margin when `spacing="sm"`      |
| `--solaris-divider-spacing-md`     | Margin when `spacing="md"`      |
| `--solaris-divider-spacing-lg`     | Margin when `spacing="lg"`      |
| `--solaris-divider-inset-start`    | Indentation from the start edge |
| `--solaris-divider-inset-end`      | Indentation from the end edge   |
| `--solaris-divider-text-gap`       | Gap between label and lines     |
| `--solaris-divider-text-color`     | Label text color                |
| `--solaris-divider-text-font-size` | Label font size                 |

## With label

`label` (or `labelKey` for i18n) renders text between two divider lines. The label is only supported on horizontal dividers; a vertical divider ignores it.

```html
<solaris-divider label="Section" /> <solaris-divider [labelKey]="'forms.section' | translate" />
```

`textPosition` controls the label alignment:

- `center` (default): both lines are equal
- `start`: a short leading line, then the label, then a line filling the rest
- `end`: a line filling the space, then the label, then a short trailing line

```html
<solaris-divider label="Center" textPosition="center" />
<solaris-divider label="Start" textPosition="start" />
<solaris-divider label="End" textPosition="end" />
```

When a label is present, the divider becomes semantic: `role="separator"` is applied and `aria-hidden` is removed regardless of the `decorative` input, so the label is announced to assistive technology.

## Length

`width` controls the length of a horizontal divider and `height` the length of a vertical divider. Both accept any CSS length (`'5rem'`, `'120px'`, `'100%'`). When unset, the divider stretches across its container along its main axis.

```html
<solaris-divider width="12rem" /> <solaris-divider orientation="vertical" height="4rem" />
```

`width` and `height` are set as component tokens (`--solaris-divider-width` / `--solaris-divider-height`), so they can also be overridden via CSS.

## Accessibility

- When `decorative` is `true`, `aria-hidden="true"` is applied and no `role` is exposed
- When `decorative` is `false`, `role="separator"` is applied
- Vertical dividers with `decorative=false` receive `aria-orientation="vertical"`
- A semantic separator without visible text should receive an accessible name
  via `ariaLabel` (or `ariaLabelKey` / `ariaLabelledby`):

```html
<solaris-divider [decorative]="false" ariaLabel="Section separator" />
```

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
