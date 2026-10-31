---
'@educarehq/solaris-ui': patch
---

fix(button): keep gradient ramps within the same hue family

The `gradient` appearance ramped `solid` into cross-hue partners (`danger` turned pink toward violet, `warning` turned green toward success, `info` clashed with orange toward accent, `neutral` barely shifted), and the same-hue fallback read as flat `solid` at button sizes. Each color now ramps into the deepest same-hue stop that keeps text contrast (`primary`/`success` keep their partner hues `violet`/`info`; `warning` goes to `solid-active`, `danger` to the new `solid-deep` token, `info` to `foreground`, `neutral` from `inverse` to `text-secondary`) across rest, hover, and active, with text, border, and focus-ring still mirroring `solid`. Shared `solaris-button-gradient` mixin, so `icon-button` inherits the same ramps.
