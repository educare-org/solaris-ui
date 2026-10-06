# Solaris UI — Theme Customization

## How theming works

Solaris uses CSS custom properties (tokens) for all visual properties. Themes are sets of token values applied via CSS selectors:

```scss
:root,
[data-theme='light'] {
  /* light tokens */
}
[data-theme='dark'] {
  /* dark tokens */
}
[data-theme='high-contrast'],
[data-theme='high-contrast-dark'],
[data-high-contrast='true'] {
  /* high-contrast tokens */
}
```

The default theme is `light`. Changing `data-theme` on a parent element switches all children.

## Overriding individual tokens

Override any token in your own CSS:

```css
.my-component {
  --solaris-primary-solid: #7c3aed;
  --solaris-primary-solid-hover: #6d28d9;
  --solaris-primary-solid-active: #5b21b6;
}
```

All children of `.my-component` will use the overridden colors.

### Common overridable tokens

| Category | Example tokens                                                                                                                                                                   |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Colors   | `--solaris-primary-*`, `--solaris-neutral-*`, `--solaris-success-*`, `--solaris-warning-*`, `--solaris-danger-*`, `--solaris-info-*`, `--solaris-accent-*`, `--solaris-violet-*` |
| Spacing  | `--solaris-spacing-0` through `--solaris-spacing-18`                                                                                                                             |
| Radius   | `--solaris-radius-sm`, `--solaris-radius-md`, `--solaris-radius-lg`                                                                                                              |
| Font     | `--solaris-font-size-*`, `--solaris-font-weight-*`, `--solaris-font-family-*`                                                                                                    |
| Shadow   | `--solaris-shadow-sm`, `--solaris-shadow-md`, `--solaris-shadow-lg`                                                                                                              |
| Opacity  | `--solaris-opacity-*`                                                                                                                                                            |

## Creating a custom color scheme

### 1. Define your tokens

```css
[data-theme='brand'] {
  --solaris-neutral-page: #fafafa;
  --solaris-neutral-default: #ffffff;
  --solaris-neutral-subtle: #f5f3ff;
  --solaris-neutral-sunken: #ede9fe;
  --solaris-neutral-text-heading: #1e1b4b;
  --solaris-neutral-text-body: #312e81;
  --solaris-primary-solid: #7c3aed;
  --solaris-primary-solid-hover: #6d28d9;
  --solaris-primary-solid-active: #5b21b6;
  --solaris-primary-soft: #f5f3ff;
  --solaris-primary-foreground: #ffffff;
}
```

### 2. Apply to your app

```html
<html data-theme="brand"></html>
```

Or toggle programmatically:

```typescript
document.documentElement.setAttribute('data-theme', 'brand');
```

### 3. For dark variant, create a media query

```css
@media (prefers-color-scheme: dark) {
  [data-theme='brand'] {
    --solaris-neutral-page: #0f0a1a;
    --solaris-neutral-default: #1a1025;
    --solaris-neutral-text-body: #ddd6fe;
    /* ... */
  }
}
```

## Creating a full dark theme

Copy the pattern from `packages/angular/src/styles/token/color/_dark.scss`:

```scss
@mixin my-dark-tokens {
  --solaris-neutral-page: #0a0a0a;
  --solaris-neutral-default: #141414;
  --solaris-neutral-subtle: #1e1e1e;
  --solaris-neutral-text-heading: #f5f5f5;
  --solaris-neutral-text-body: #e0e0e0;
  /* ... override all tokens */
}

[data-theme='my-dark'] {
  @include my-dark-tokens;
}
```

## Adding new tokens

1. Add the token to the theme files in `packages/angular/src/styles/token/color/`
2. Add the token to any component SCSS that uses it
3. Update the component's docs to list the new token
4. If the token is a new category, add it to `token-rules.json`

## Best practices

- Override at the highest level possible (usually `:root` or `[data-theme]`)
- Never override component-level tokens directly — they derive from global tokens
- Use the browser DevTools to inspect which token a component is using
- Test your theme with all components that use the overridden tokens
- Keep token names consistent with the existing naming pattern
