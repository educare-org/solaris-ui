---
'@educarehq/solaris-ui': minor
---

feature(icon): add brand icons and button icon inputs

Adds built-in provider/brand icons to the icon registry: `google`,
`microsoft`, `apple`, `android`, and `github`. Multi-color brand icons keep
their official brand colors; monochrome brand icons (`apple`, `github`) use
`currentColor` so they adapt to the active theme.

Extends the SVG icon definition model so each element (path, rect, circle,
line, polyline, polygon) can carry its own `fill`/`stroke` attributes,
enabling multi-color icons.

`[solaris-button]` now accepts an `icon` input (a registered `SolarisIconName`)
rendered inside the button, plus `iconPosition` (`'start'` | `'end'`) to place
it before or after the text. The padding on the icon side is reduced so the
icon sits close to the button edge, matching social login button conventions.

Migration: none required — the `[solaris-button-icon]` projection directive
continues to work for custom inline SVGs and content.
