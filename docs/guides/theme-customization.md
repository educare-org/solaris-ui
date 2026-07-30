# Solaris UI — Theme Customization

## How theming works

Solaris uses CSS custom properties (tokens) for all visual properties. Themes are sets of token values applied via CSS selectors:

```scss
:root, [data-theme='light'] { /* light tokens */ }
[data-theme='dark'] { /* dark tokens */ }
[data-theme='high-contrast'], [data-high-contrast='true'] { /* high-contrast tokens */ }
```

The default theme is `light`. Changing `data-theme` on a parent element switches all children.

## Overriding individual tokens

Override any token in your own CSS:

```css
.my-component {
  --solaris-primary-base: #7c3aed;
  --solaris-primary-hover: #6d28d9;
  --solaris-primary-active: #5b21b6;
}
```

All children of `.my-component` will use the overridden colors.

### Common overridable tokens

| Category | Example tokens |
|---|---|
| Colors | `--solaris-primary-*`, `--solaris-surface-*`, `--solaris-text-*` |
| Spacing | `--solaris-spacing-1` through `--solaris-spacing-20` |
| Radius | `--solaris-radius-sm`, `--solaris-radius-md`, `--solaris-radius-lg` |
| Font | `--solaris-font-size-*`, `--solaris-font-weight-*`, `--solaris-font-family-*` |
| Shadow | `--solaris-shadow-sm`, `--solaris-shadow-md`, `--solaris-shadow-lg` |
| Opacity | `--solaris-opacity-*` |

## Creating a custom color scheme

### 1. Define your tokens

```css
[data-theme='brand'] {
  --solaris-bg-page: #fafafa;
  --solaris-surface-base: #ffffff;
  --solaris-surface-subtle: #f5f3ff;
  --solaris-surface-muted: #ede9fe;
  --solaris-text-strong: #1e1b4b;
  --solaris-text-default: #312e81;
  --solaris-primary-base: #7c3aed;
  --solaris-primary-hover: #6d28d9;
  --solaris-primary-active: #5b21b6;
  --solaris-primary-surface: #f5f3ff;
  --solaris-primary-text: #ffffff;
}
```

### 2. Apply to your app

```html
<html data-theme="brand">
```

Or toggle programmatically:

```typescript
document.documentElement.setAttribute('data-theme', 'brand');
```

### 3. For dark variant, create a media query

```css
@media (prefers-color-scheme: dark) {
  [data-theme='brand'] {
    --solaris-bg-page: #0f0a1a;
    --solaris-surface-base: #1a1025;
    --solaris-text-default: #ddd6fe;
    /* ... */
  }
}
```

## Creating a full dark theme

Copy the pattern from `packages/angular/src/styles/token/color/_dark.scss`:

```scss
@mixin my-dark-tokens {
  --solaris-bg-page: #0a0a0a;
  --solaris-surface-base: #141414;
  --solaris-surface-subtle: #1e1e1e;
  --solaris-text-strong: #f5f5f5;
  --solaris-text-default: #e0e0e0;
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
