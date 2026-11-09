---
'@educarehq/solaris-ui': patch
---

Fix narrow-container overflow in multi-select, cap dropdown panel radius, and make outline appearance border-only. Remove automatic content-based min-width floor from multi-select trigger and panel (same fix as select): the panel follows `panelMatchTriggerWidth` and long content truncates with ellipsis; `panelMinWidth`/`panelMaxWidth` remain as explicit overrides. Cap the select and multi-select dropdown panel radius at `lg` when trigger radius is `xl`, so the panel never renders fully rounded, especially when connected to the trigger. Change `form-field[data-appearance='outline']` control background from `neutral-default` to transparent so outline renders border-only and matches the page background in every theme (dark page `#0a0a0a` no longer shows a lighter filled control).
