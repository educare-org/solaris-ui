---
'@educarehq/solaris-ui': minor
---

feature(button): add appearance="gradient" for button and icon-button

New `gradient` appearance crosses with every color: `linear-gradient(135deg, solid, solid-active)` with text, border, and focus-ring mirroring `solid`, hover darkening the first stop, and press holding the darkest pair. Custom gradients via `--solaris-button-gradient-from/to` and `--solaris-icon-button-gradient-from/to` (+ hover/active pairs); without them, gradient + custom falls back to the flat custom solid. Shared `solaris-button-gradient` SCSS mixin keeps button and icon-button in parity, including attached group press behavior.
