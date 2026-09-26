---
'@educarehq/solaris-ui': patch
---

Segmented Control: the invalid visual state now follows the same rule as `aria-invalid` — manual `[invalid]` or `required` + touched + empty value. Invalid styling goes beyond a red outline: danger-tinted selection indicator and border, danger selected-item text, and danger focus ring.
