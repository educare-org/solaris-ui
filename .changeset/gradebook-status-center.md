---
'@educarehq/solaris-ui': patch
---

fix(gradebook): center status columns by default

Columns with `status: true` now default to `align: 'center'`, matching the documented badge convention (`SITUAÇÃO` badges were rendering start-aligned unless consumers set it manually). Explicit `align` still wins.
