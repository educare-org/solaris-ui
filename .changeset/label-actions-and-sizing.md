---
'@educarehq/solaris-ui': minor
---

feature(forms): larger field labels, larger password toggle, label actions

- Field labels now use `--solaris-font-size-md` for every density (one step
  above the previous `sm`), improving readability across compact, normal, and
  comfortable densities.
- The password-field visibility toggle icon is now sized one typography step
  above the density font size for every density (`compact` → `lg`, `normal` →
  `xl`, `comfortable` → `2xl`), keeping it proportionally larger than the text.
  The password-field host now exposes `data-density`.
- New `[solaris-form-label-action]` slot renders content (e.g. a "Forgot
  password?" link) on the same row as the label, aligned to the opposite side.
  It is forwarded by `solaris-email-field`, `solaris-password-field`,
  `solaris-select`, and `solaris-multi-select`.
- Fixed multi-level content projection for projected affixes: `[solaris-form-prefix]`
  and `[solaris-form-suffix]` declared inside the preset fields now render in the
  affix slots (previously they fell into the control wrapper). The preset fields
  re-project these slots with `ngProjectAs`, and the new label action slot uses
  the same mechanism.

Migration: none required. All changes are additive; existing labels and toggle
icons simply render slightly larger.
