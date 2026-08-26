---
'@educarehq/solaris-ui': minor
---

Add the `solaris-otp-input` preset form control and fix phone-field density.

- **otp-input**: a row of single-character boxes driven by `maxLength` (default 12) with
  `minLength` validation, automatic focus advancement, keyboard navigation, paste support,
  configurable char type, optional masking and visual grouping. Ships a reusable
  `solarisOtpValidator` and a showcase page (`/forms/otp-input`).
- **phone-field**: prefix sizes (flag, chevron, font, padding) now scale with the field
  density.
