---
'@educarehq/solaris-ui': patch
---

Phase 3 actions visual: primary/info solid + outline hover/active text now uses `on-solid` (white) instead of `foreground` — dark text on the blue `solid-hover` background measured 1.59:1 and now measures 7.08:1 (primary) and 6.70:1 (info) at rest/hover in light theme. The `[solaris-button]` / `[solaris-icon-button]` SCSS base radius default moves `sm` → `md` (4px), matching the directive `radius` input default (`md`) and the 13-visual-standard default. Icon-only buttons gain a transparent `::after` hit area expanding the effective target to 44px (`inset: calc((min(size, 44px) - 44px) / 2)`; no-op at ≥44px) with zero visual change — verified 32px box + −6px inset = 44px effective at 360px viewport.
