---
'@educarehq/solaris-ui': patch
---

refactor(pie-chart): move FocusMark type to model and helpers to functions

`SolarisPieChartFocusMark` now lives in `model/chart-pie.types.ts` and `nextSolarisPieChartInstanceId`/`clampPercent` in `functions/pie-chart.utils.ts`, per the folder contract. No behavior change.
