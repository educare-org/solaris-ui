---
'@educarehq/solaris-ui': minor
---

feature(data-display): add record-grid component

Add `solaris-record-grid`, an attendance/launch sheet composing the
`solaris-table` contracts without copying its types, state, tokens, or
density. It ships sections with row groups and per-group footers, merged body
cells (`rowspan` + `colspan` with continuous `aria-rowindex`/`aria-colindex`),
controlled editing with draft, validation, and internal commit emitting an
audit-ready `recordCommit` diff, and a reactive formula engine (`computed`
columns resolved in topological order with cycle detection).

Follow-ups: virtualization, column drag/reorder, inline `showAddRow`,
server-side datasource, and sheet printing.
