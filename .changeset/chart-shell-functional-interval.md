---
'@educarehq/solaris-ui': minor
---

feature(charts): chart shell interval trigger with motion-safe hover (color + underline fade via motion tokens). The picker opens in a popover anchored below the filters, aligned to the calendar option at the right edge, without shifting the chart (toggled by the interval trigger or the calendar option; clicking either while open closes it). The panel lists every period with a computable range as a preset (fixed durations anchored at the current start, plus the calendar year); applying a range matches it back to a period and falls back to a new `custom` period (`solaris.chart.intervalPlaceholder` while empty, `solaris.chart.periodCustom` label) otherwise. Both picker sides stay editable, even on closed periods; segment switches still re-anchor the end. The period filter gains a permanent icon-only calendar option in interactive mode (toggles the same popover without selecting; stays active while the period is `custom`). `SolarisChartShellPeriodOption` accepts an `icon` for custom icon-only segments.

feature(date-range-picker): inline panel mode (`inline` renders the calendars/inputs/actions without the field trigger or popover, for hosts that own the trigger) plus per-side `startDisabled`/`endDisabled` and `startReadonly`/`endReadonly` locks and a `cancelled` output.
