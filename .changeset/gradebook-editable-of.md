---
'@educarehq/solaris-ui': minor
---

feature(gradebook): add per-cell `editableOf` permission

Add `editableOf: ((row, assignmentId) => boolean) | undefined` to `solaris-gradebook`. Returning `false` locks the cell to view-only (formatted text, no input, no `gradeCommit`), composing with the existing `readonly`/`disabled` and `excused` guards. Consumers can bind it to role checks (e.g. viewer vs editor) without forking the editor template.
