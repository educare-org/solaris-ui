---
'@educarehq/solaris-ui': patch
---

fix(gradebook): close the grade editor on blur

The internal grade editor now closes on `blur` (clicking or tabbing outside), matching the existing Escape behavior: close without committing. Explicit commits stay via `change`/`Enter`. Prevents the editor from staying stuck open when the user clicks away without editing.
