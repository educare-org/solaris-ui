---
'@educarehq/solaris-ui': minor
---

Add the `solaris-phone-field` preset form control.

- Wraps `solaris-form-field` with a `tel` input and as-you-type formatting via `libphonenumber-js`.
- Exposes a searchable country selector in the prefix (flag + calling code) backed by a popover listbox.
- Stores a single E.164 value through a `ControlValueAccessor` and ships a reusable `solarisPhoneValidator`.
- Adds `libphonenumber-js` and `country-flag-icons` as runtime dependencies.
- Adds a showcase page (`/forms/phone-field`) demonstrating the field.
