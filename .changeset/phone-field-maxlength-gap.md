---
'@educarehq/solaris-ui': patch
---

fix(phone-field): stop truncating formatted numbers and widen dial-code gap

- Derive the native input `maxlength` from the formatted number length instead of the national digit count, so full numbers (e.g. BR `(11) 99999-8888`) can be typed. Digit capping is still enforced on input.
- Fall back to the E.164 maximum when numbering-plan metadata has no lengths, so the field never becomes untypeable.
- Increase the gap between the dial-code prefix and the input via the new `--solaris-phone-field-dial-code-gap` token (default `var(--solaris-spacing-3)`).
