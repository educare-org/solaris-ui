---
'@educarehq/solaris-ui': patch
---

fix(pagination, slider): document glyph-relative numeric widths as token exceptions

The `3ch`/`4ch` minimum widths on tabular numeric readouts are intentional: they track digit glyphs so values never reflow across densities. Marked with `SOLARIS_TOKEN_EXCEPTION`. No visual change.
