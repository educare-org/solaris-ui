---
'@educarehq/solaris-ui': minor
---

Add `solaris-chart-shell` (`data-display/charts`, phase H1): generic card wrapper with title, hero KPI, interval label, view switcher (line/bar/pie select), period segmented filter, loading/empty/error states, clickable legend with `aria-pressed`, and an actions menu emitting `actionRequest`. Two-way `view`/`period` models; emits `seriesToggle`/`retry`. The shell never fetches and never mutates the consumer `series`. Follow-ups: H2 line+sparkline.
