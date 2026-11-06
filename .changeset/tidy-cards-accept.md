---
'@educarehq/solaris-ui': minor
---

Add `padding` input (`'none' | 'sm' | 'md' | 'lg'`) to `solaris-selection-card`, mirroring the `solaris-card` API. When unset the card keeps the legacy density-driven spacing; when set it overrides `gap` + `padding` (`sm` ≈ compact, `md` ≈ normal, `lg` ≈ comfortable, `none` zeroes both), enabling full-bleed layouts with `padding="none"`.
