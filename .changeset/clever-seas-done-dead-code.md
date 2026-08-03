---
'@educarehq/solaris-ui': minor
---

remove the unused `setChecked` method from `solaris-radio` (the radio group syncs checked state through `writeValue`, so the method was dead API) and the unused `isCheckSelection` computed from `solaris-option` (single-selection feedback is rendered by the trailing check indicator). Also narrow the `writeValue` parameter type in `solaris-radio-group` from `unknown | null` to `unknown`.
