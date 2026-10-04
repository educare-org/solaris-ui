---
'@educarehq/solaris-ui': minor
---

Finish P4 B/C parity for dates, email, and phone: `clearable` + `clearLabel`/`clearLabelKey` + `cleared` on date-picker, date-range-picker, email-field, and phone-field (same `canClear` gate as selects: clearable, has value, not disabled/readonly). Dates gain `weekStartsOn` (default: locale first day, Sunday fallback), `disablePast`/`disableFuture`, `dateFormat` (`2-digit`/`numeric`), `prefix`/`suffix` icon inputs, and `Escape` semantics (dirty query resets to the committed value, pristine closes); select/multi-select gain a `suffix` icon input and OTP accepts suffix-action projection. Follow-ups: roving `ArrowUp`/`ArrowDown`/`Home`/`End` in the calendar grid and a configurable email `mask` (documented as v1 limitations).
