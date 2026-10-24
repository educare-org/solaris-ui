---
'@educarehq/solaris-ui': minor
---

Rework `SolarisIconComponent`: new `variant` (`outline`/`solid`/`duotone`), `size`, `strokeWidth` and `absoluteStrokeWidth` inputs with global `SOLARIS_ICONS_CONFIG` defaults, `decorative` now defaults to `true`, and rounded-square knockout/duotone fallbacks for icons without dedicated solid art (`isFallback()`).
