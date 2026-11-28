---
'@educarehq/solaris-ui': patch
---

Raise the showcase production `initial` bundle error budget from 4.1 MB to 4.5 MB. The rich-text-editor feature legitimately grew the initial bundle to ~4.19 MB; the previous ceiling predates it. Warning budget and component-style budgets are unchanged.
