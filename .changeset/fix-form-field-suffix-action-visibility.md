---
'@educarehq/solaris-ui': patch
---

fix(forms): count suffix-action inputs in form-field suffix visibility

Include `hasSuffixActionInput` in `effectiveHasSuffix` so a projected suffix action keeps the suffix cell visible even when no plain suffix is present. A suffix action implies a suffix: `hasSuffixAction` already considered the input for the `action` variant, but the visibility gate did not, hiding single-attribute (`solaris-form-suffix-action`-only) actions re-projected through field presets. Adds an `email-field` regression test for the single-attribute case.
