---
'@educarehq/solaris-ui': patch
---

Fix dialog initial focus: with `autoFocus: 'first-tabbable'` (default) the container now focuses the first enabled action button when actions are present, instead of the header close button that became first-tabbable after the header close refactor. Explicit `[data-autofocus]`, `autoFocus: 'panel'` and `autoFocus: false` behavior is unchanged.
