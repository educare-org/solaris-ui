---
'@educarehq/solaris-ui': minor
---

Align the default `radius` to `'md'` on every form-field consumer (`select` already defaulted to `'md'` since H1; now `multi-select`, `email-field`, `date-picker`, `date-range-picker`, `password-field`, `phone-field`, `file-upload`, `otp-input`, plus the `solaris-input` and `solaris-textarea` directives), matching the `solaris-form-field` default so the wrapper and its control render the same corners without an explicit input. Docs tables and default-radius specs updated; explicit `radius="sm"` keeps working unchanged. `checkbox` keeps its own box radius (not a form-field consumer).
