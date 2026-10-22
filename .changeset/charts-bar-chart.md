---
'@educarehq/solaris-ui': minor
---

Add `solaris-bar-chart` (`data-display/charts`, phase H3): vertical/horizontal SVG bars in grouped, stacked and stacked-100 layouts with series-tinted gradients, the DS radius token, staggered enter choreography and layout-morph transitions, horizontal scroll for dense categories, auto-grown horizontal viewBox, category thinning, reference lines painted above the bars, tooltip with total, roving-tabindex keyboard marks emitting `pointSelect`, screen-reader data table and pure layout geometry (`buildBarChartFrame`, `resolveBarLabelEvery`, `truncateBarCategoryLabel`). Line overlays stay out by design — a future `combo-chart` will own second-axis overlays. Showcase gains `charts/` pages (shell, line, bar) with the shell projecting bars on the bar view. Follow-ups: H4 pie-chart.
