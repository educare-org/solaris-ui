---
'@educarehq/solaris-ui': patch
---

fix(table): use neutral selection wash on cards and expand priority columns in card layout

Selected cards now use the neutral hover background instead of the primary tint so field dividers keep contrast, and `expandable` tables collapse `priority`/`detailTemplateId` columns into a per-card details toggle in card layout. Card checkboxes align with the select-all bar (same leading gutter, first-row offset), per-field detail accordions render full-bleed without gaps, long values truncate instead of widening cards, and the row-expansion toggle sits flush with the card edge. Also stacks the filter sheet sections full-width on narrow viewports so views, the save-view form, conditions, columns, and leading/trailing actions read as separate blocks. Showcase gains a toolbar + multiple-selection card example.
