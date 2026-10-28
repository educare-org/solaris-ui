---
'@educarehq/solaris-ui': patch
---

fix(forms): keep SSR and hydrated DOM identical for value-driven field chrome

The clear action (and value-driven trigger content in select/multi-select, strength meter in password-field) was gated by `@if` blocks depending on mutable form state (`internalValue`/`hasValue`/`canClear`). Any server/client value difference at first render broke hydration with NG0502 and left the input disconnected from its `ControlValueAccessor`. Value-driven DOM in `solaris-email-field`, `solaris-phone-field`, `solaris-password-field`, `solaris-date-picker`, `solaris-date-range-picker`, `solaris-select` and `solaris-multi-select` now renders only after hydration; visibility and validation logic are unchanged. `writeValue` in email-field and password-field also coerces `null`/`undefined` to `''` so fields bound to empty `FormControl`s cannot crash.
