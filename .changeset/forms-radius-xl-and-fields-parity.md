---
'@educarehq/solaris-ui': minor
---

Align field radius to the global scale and add `xl` pill (D2): `SolarisFormFieldRadius` (and input, textarea, select, multi-select, date-picker, date-range, email, password, phone, otp aliases) is now `none`/`sm`/`md`/`lg`/`xl` where `md` maps to 4px, `lg` to 8px, and `xl` renders as a pill; checkbox accepts `xl` with `full` kept as an alias. Previous `lg` pill users should move to `xl` (minor visual breaking change for `md`/`lg` consumers). Parity: standalone input/textarea focus rings use `--focus-ring-width`, appearances mirror Form Field, Switch exposes `aria-checked` (`mixed` when indeterminate), checkbox-group inner keeps a single `role=group`, groups gain `cvaReadonly`, email/phone/password extend `SolarisFormControl` with `[control]` forwarding, phone counter uses `effectiveMaxLength`, password `fullWidth` is honored, and OTP gains `loading` plus density-based gap.
