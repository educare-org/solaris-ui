---
'@educarehq/solaris-ui': minor
---

Charts polish round 2: smoother interactions and showcase depth. `line-chart` crossfades the series group (WAAPI, `prefers-reduced-motion` aware) when the dataset changes, dots transition fill/stroke, and the selection guide fades in; axis/reference labels drop to `--solaris-font-size-2xs` and left padding grows to 56 so Y ticks like "1,5 mil" no longer clip. `chart-shell` legend buttons gain hover/focus background transitions, the empty state centers its text, and `isChartDisplayMode` is exported. Showcase: every period (1D/7D/1M/3M/YTD/all) now has its own dataset, reference average and x labels; Timeline/List swaps the chart for a totals list; the maximize button actually toggles fullscreen on the demo via the Fullscreen API (the lib still only emits `actionRequest`).
