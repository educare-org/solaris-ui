---
'@educarehq/solaris-ui': patch
---

Event editor: allow removing all reminders so an event can have zero notifications. The per-row remove button is no longer disabled on the last row, and an empty reminder list hydrates and saves as `reminders: []`.
