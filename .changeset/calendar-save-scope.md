---
'@educarehq/solaris-ui': minor
---

Add occurrence-aware save to the calendar: `resolveSolarisEventSave(source, occurrenceStart, draft, scope, timeZone)` splits scoped occurrence edits immutably (`this` appends an exDate and returns a detached single event; `following` truncates via `until` and returns the following part; `all`/non-recurring returns the draft as-is; invalid returns `null`). The event editor shows the scope radios for edited occurrences and emits `{ event, scope, occurrenceStart }` with save; the shell forwards the scope to `eventSave` and the showcase applies the util on save.
