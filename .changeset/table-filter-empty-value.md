---
'@educarehq/solaris-ui': patch
---

fix(table-filter): conditions with operators that require a value but have none (e.g. an empty number field) no longer filter rows — they are treated as no-ops, consistent with the existing empty `in`/`between` behavior. Also hides the number input spinners inside the filter panel.
