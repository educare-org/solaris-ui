---
'@educarehq/solaris-ui': patch
---

Fix `solaris-bar-chart` stacked rounding, hover and tooltip modes: bars now render as paths with selective outer rounding (baseline edges stay square), bar hover shows a single-series tooltip and dims the rest with no background guide while main-axis hover keeps the full category tooltip with total. The whole-column guide is narrowed with side gaps, aligned exactly to the plot edges, and grows/shrinks in height only from the zero baseline with `--solaris-motion-duration-normal` (pre-positioned while hidden so it never slides in from 0,0), and the active category tick promotes to `--solaris-neutral-text-body`. Showcase weekdays and locale are now fully translated (`bar-chart-view.examples.days.*` + dynamic `[locale]`).
