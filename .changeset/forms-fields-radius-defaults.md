---
'@educarehq/solaris-ui': minor
---

Standardize the fields radius family: every text-like field now defaults to `sm` (`solaris-form-field`, `solaris-input`, `solaris-textarea`, `solaris-email-field`, `solaris-password-field`, `solaris-phone-field`, `solaris-select`, `solaris-multi-select`, `solaris-date-picker`, `solaris-date-range-picker`, `solaris-otp-input`) and follows the fields radius scale (`md` maps to the 8px token, `lg` renders as a pill; global tokens untouched). Selects, dates, email, password and phone inherit the scale through the inner Form Field; OTP's previously dead `radius` input is now wired to the boxes. Also replaces all file-level `SECURITY_EXCEPTION_FILE` blankets in forms components with precise line-level justifications at the actual flagged uses (3 files had blankets with no matching pattern at all and were simply cleaned). Docs and Lote A showcases updated (radius notes carry the fields scale; new default-`sm` specs, including OTP host reflection).
