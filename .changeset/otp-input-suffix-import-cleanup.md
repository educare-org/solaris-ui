---
'@educarehq/solaris-ui': patch
---

Clean up `solaris-otp-input`: drop the unused `SolarisFormSuffixActionDirective` entry from the component `imports` (the directive is only read through a `contentChild` query) and simplify the focus fallback to `Math.max(index, 0)`. No behavior change.
