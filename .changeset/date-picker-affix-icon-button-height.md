---
'@educarehq/solaris-ui': patch
---

Fix `solaris-date-picker` (and `solaris-date-range-picker`) rendering 2px taller than a plain `solaris-form-field` at the same size: the calendar trigger (`solaris-icon-button` in the suffix affix) kept the full control-height token because the icon-button size x density matrix outranks the form-field affix override, overflowing the wrapper content box by twice the border width. The form-field override now outranks the matrix and pins affix icon-buttons to the affix box (control height minus borders), and neutralizes the 44px `::after` hit-area expansion inside affixes (the field surface is already the trigger target, so the expansion is redundant and would spill over the input); the calendar triggers also inherit the field `size`/`density` so the glyph scales with the field.
