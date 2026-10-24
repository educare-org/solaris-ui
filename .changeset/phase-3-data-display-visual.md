---
'@educarehq/solaris-ui': patch
---

Phase 3 data-display visual: card glass `::before` warm-orange tint (`#ff6e185c`) replaced with neutral cool highlight (`#ffffff1f`, same family as the other two glass layers) per 07 §1 / G-09 and approved D-06 — no other visual change. Card `::ng-deep` ×22 kept as-is (projected consumer sections via directives; `:host ::slotted` needs Shadow DOM — filed as dedicated refactor follow-up, no `::ng-deep` added).
