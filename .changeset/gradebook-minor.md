---
'@educarehq/solaris-ui': minor
---

feature(data-display): add gradebook component

Add `solaris-gradebook`, a grade-matrix component composing `solaris-table`
without copying its types, state, tokens, or density. It ships score-10,
score-100, concept, and custom scales, per-cell status (`missing`, `late`,
`excused`, `graded`), grouped semester headers, footer totals, a `SITUAÇÃO`
badge cell, identity column with sticky first column, grid appearance by
default, inline grade editing with `gradeCommit`, and server data sources.
