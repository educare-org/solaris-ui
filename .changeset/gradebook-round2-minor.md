---
'@educarehq/solaris-ui': minor
---

feature(gradebook): add sticky last column, aggregates, bulk editing and status dots

Add `stickyLastColumn` to `solaris-table` and `solaris-gradebook` so result
columns stay visible in wide matrices. Add optional per-column `aggregate`
(`average`, `sum`, `min`, `max`, `median`, `weighted`) with `aggregateGradeValues`
helpers; explicit `footerValueOf` still wins. Add `bulkEnabled` with
`gradeBulkCommit`, `enablePaste` with TSV paste (`gradePasteError`), clamped
editor parsing, subtle `missing`/`late`/`excused` cell dots with screen-reader
labels, `withMaxColumns` helper, and a single-source grid divider fix for
grouped headers so inter-group borders keep the subtle pattern.
