---
'@educarehq/solaris-ui': patch
---

Fix CSS custom properties (`--solaris-*`) not being published in the npm package

Token SCSS files defining all `--solaris-*` variables (colors, spacing, typography, density, radius, shadows, etc.) were located in an internal directory not included in the published package. External consumers saw errors like `--solaris-form-field-control-height não está definido`.

This fix:
- Moves token SCSS files to `src/styles/token/` so they ship with the package
- Adds `@use` for all token categories in the public `_theme.scss` mixin
- Ensures all design tokens are emitted on `:root` when consumers call `@include solaris.theme()`
