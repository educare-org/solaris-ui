---
'@educarehq/solaris-ui': minor
---

feature(data-display): add label support to divider

`solaris-divider` now renders text between its lines via `label` or `labelKey`
(translated with the Solaris i18n system). `textPosition` (`'center'`,
`'start'`, `'end'`) controls the label alignment on horizontal dividers.

- When a label is present, the divider becomes semantic: `role="separator"` is
  applied and `aria-hidden` is removed, regardless of the `decorative` input,
  so the label is announced to assistive technology.
- Labels are ignored on vertical dividers.
- New CSS tokens: `--solaris-divider-text-gap`, `--solaris-divider-text-color`,
  `--solaris-divider-text-font-size`.
