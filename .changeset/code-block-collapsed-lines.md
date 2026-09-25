---
'@educarehq/solaris-ui': patch
---

Fix `SolarisCodeBlockComponent` collapsed height so `collapsedLines` is honored (the previous `max-height` calc combined a unitless `line-height` token and was ignored by browsers, showing the full content while collapsed). The collapsed viewport now measures lines with `1lh` (with an `em`-based fallback), and expand/collapse animates smoothly by interpolating the viewport between measured pixel heights in JS (with a CSS `max-height` transition as fallback), disabled under reduced motion.
