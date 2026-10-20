---
'@educarehq/solaris-ui': patch
---

Calendar shell round 2: the shell host is now block-level full-width (it previously shrink-wrapped in some layouts), the year grid month minimum drops from 192px to 152px, and narrow shells (below 640px of their own width, e.g. docs) stack the side panel on top in year view — so months flow 3 → 2 → 1 through auto-fill in every implementation. Also: circular mini-month previous/next buttons, translated toolbar/side aria-labels, and the custom-days number input becomes a 1–7 select.
