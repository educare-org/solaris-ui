---
'@educarehq/solaris-ui': patch
---

Reduce `solaris-selection-card` and `solaris-form-field` compiled styles below the per-component budget with no visual change. The selection-card 3x3 `size` x `density` matrix is split by axis (`gap`/`padding` vary only by density, `media`/`dot`/`switch` only by size; only `indicator-size` keeps both axes), and `form-field` drops an `appearance` block that duplicated the `:host` defaults plus a redundant `invalid+focused` border rule.
