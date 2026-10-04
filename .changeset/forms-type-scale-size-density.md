---
'@educarehq/solaris-ui': minor
---

Scale form typography by `size` x `density` (D1): Form Field label, hint, error, optional, and counter now resolve in 9 explicit `[data-size][data-density]` blocks (sm/xs, md/sm, lg/md with comfortable +1 notch, capped at md), all with tokenized `line-height` and a single `message-row` margin. Checkbox and Switch gain `description` + `descriptionKey` inputs (radio parity, muted `xs`/`sm` by size); radio label `line-height` follows size instead of a fixed `none`; Date Range trigger and phone country blocks move to the 9-block matrix; standalone textarea `min-height` follows the control-height ladder per combination. Follow-ups: roving keyboard in the calendar grid (docs-only), email `mask` prop.
