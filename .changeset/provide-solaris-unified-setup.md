---
'@educarehq/solaris-ui': minor
---

Unify package setup behind a single `provideSolaris()` provider.

- Add `provideSolaris(config)` and the `SolarisSetupConfig` type to the public API.
- Remove the individual `provideSolarisTheme`, `provideSolarisTranslate`,
  `provideSolarisAccessibility`, `provideSolarisIcons`, `provideSolarisToast`,
  and `provideSolarisDialog` exports from the public API (they remain internal).
- Add an interactive `init` schematic that creates `src/styles/solaris.scss`,
  imports it from the global stylesheet, and adds `provideSolaris(...)` to the
  application config. `ng-add` now delegates to `init`.
- Compile schematics as CommonJS with a nested `schematics/package.json` so they
  load correctly in the ESM package.
