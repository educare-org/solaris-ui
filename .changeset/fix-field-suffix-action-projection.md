---
'@educarehq/solaris-ui': patch
---

fix(forms): accept single suffix-action attribute in field presets

Change the suffix-action forwarding slot in `email-field`, `password-field`, `phone-field`, `select`, `multi-select`, `date-picker`, `date-range-picker` and `otp-input` from `select="[solaris-form-suffix][solaris-form-suffix-action]"` to `select="[solaris-form-suffix-action]"`, matching the `solaris-form-field` primitive. Consumer elements now only need `solaris-form-suffix-action`; carrying `solaris-form-suffix` alongside keeps working for backward compatibility. Also add the missing `SolarisFormPrefixDirective` import to `password-field` and the missing `SolarisFormSuffixDirective` import to `select`/`multi-select` for their internal affix icons.
