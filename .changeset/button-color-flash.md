---
'@educarehq/solaris-ui': patch
---

fix(button): prevent color flash before hydration

The base `[solaris-button]` and `[solaris-icon-button]` styles used the
`primary` tokens as the default, while the components' actual default is
`color="neutral"`. During SSR/hydration (or any delayed attribute application),
buttons rendered with the primary color for a frame before switching to their
configured color.

The base styles now default to the neutral/solid tokens, matching the real
component default, so buttons with no explicit `color` render correctly on the
first paint without flashing.

Migration: none. Buttons without an explicit `color` input already behaved as
`neutral` at runtime; the initial paint now matches that instead of flashing
`primary` first.
