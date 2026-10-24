---
'@educarehq/solaris-ui': patch
---

Align the mega menu trigger with the component standard: it now declares the system font by default (semibold `sm`/`1.5`/sans) instead of inheriting whatever the consumer context provides, the chevron grows from a fixed 6px to `1em` so it stays proportional to the text, and the text-chevron gap becomes `0.5em` (new `--solaris-mega-menu-trigger-gap` variable) — overriding `font-size` on the trigger scales text, chevron, and gap together. Also adds a visible `focus-ring` outline on trigger focus and scopes the host rule to its class. The showcase drops its trigger font override to rely on the library default.
