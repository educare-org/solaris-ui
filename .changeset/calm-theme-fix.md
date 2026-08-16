---
'@educarehq/solaris-ui': patch
---

fix(theme): connect SCSS theme config to runtime density and color scheme

Two fixes for consumers who configure Solaris exclusively through the SCSS
`@include solaris.theme(...)` setup:

- **Density now applies.** `SolarisThemeService.density` falls back to the
  `--solaris-density-default` CSS custom property emitted by the `theme()`
  mixin when no `density` is set in `provideSolaris`. Previously the CSS
  variable was written but never read, so components always resolved to
  `normal` even when the SCSS set `density: compact`.

- **Forced color schemes now apply to all components.** The `theme()` mixin
  now emits the light or dark color tokens directly on
  `:root:not([data-theme])` when `color-scheme: light` or `dark` is set, so
  the explicit choice overrides `@media (prefers-color-scheme: dark)`.
  Previously `color-scheme: light` only set the CSS property while component
  tokens (buttons, form fields, etc.) still followed the OS preference.
  `color-scheme: system` keeps the previous auto behavior.

The `solaris-light-tokens` and `solaris-dark-tokens` SCSS mixins are now
exported so the theme mixin can reuse them.
