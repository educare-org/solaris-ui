---
'@educarehq/solaris-ui': minor
---

feature(forms): unify prefix/suffix as icon inputs across form fields

Adds `prefix` and `suffix` inputs (icon names) to `solaris-form-field`,
`solaris-email-field`, `solaris-password-field`, `solaris-select`, and
`solaris-multi-select`. When set, an icon is rendered in the field's affix
slot with the correct token color and density-based size, matching the layout
of directly projected affixes.

- `solaris-email-field` and `solaris-password-field`: `prefixIcon` /
  `suffixIcon` renamed to `prefix` / `suffix`.
- `solaris-select` and `solaris-multi-select`: `icon` renamed to `prefix`.
- Manual projection via `[solaris-form-prefix]` / `[solaris-form-suffix]`
  remains supported for text, buttons, or any custom content.

Affix icons now size with `--solaris-density-font-size` instead of a fixed
`--solaris-font-size-lg`, and inherit the affix color on hover consistently.
The password-field toggle gains density-based inline padding so it stays clear
of the field border in compact density.

Migration: replace `icon` with `prefix` on select/multi-select, and
`prefixIcon`/`suffixIcon` with `prefix`/`suffix` on email/password fields.
