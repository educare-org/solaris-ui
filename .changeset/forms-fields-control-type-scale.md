---
'@educarehq/solaris-ui': patch
---

Step form-field control type down one notch on the type ramp in every field scenario (compact 16px to 14px, normal 18px to 16px, comfortable 20px to 18px): `solaris-input`/`solaris-textarea` text, select/multi-select trigger and chip text, affix icons, password toggle matrix, phone country/flag/chevron, otp boxes, and the date-range trigger. Select/multi trigger icons step from 24px to 20px. Placeholders keep `text-muted` but render at 70% opacity (`--solaris-opacity-70`) across inputs, textareas, and select search/trigger placeholders. The Form Field label now tracks the control type per density instead of staying fixed. OTP drops both outline rings (outer Form Field ring suppressed, box focus ring removed): the active box signals with a lighter neutral border (`--solaris-border-strong` via the new `--solaris-otp-input-box-active-border-color`). Control heights, line-heights, radius scale, and the loading overlay are untouched.
