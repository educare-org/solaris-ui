---
'@educarehq/solaris-ui': minor
---

feature(gradebook): add institution-agnostic configuration

Add row-wise computed result columns (`computed: { from, by, weights? }` +
`scoresOf`, read-only, sortable, footer-aware) so schools declare the result
rule instead of typing it. Add scale bands (`scaleDef.bands`,
`passingScore`, `resolveGradeBand`, `isPassingGrade`, per-column `band`) and
configurable rounding (`rounding` input with `half-up` / `half-even` / `up` /
`down`). Document the minimal-friction onboarding (row shape, assignments,
result rule, scale, rounding, statuses) and specify the audit-trail and
draft-vs-published contracts without implementing them.
