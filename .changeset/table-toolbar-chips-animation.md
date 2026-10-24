---
'@educarehq/solaris-ui': patch
---

feature(table-filter): animate the active-filter chips row open/closed with the same grid expand pattern used by table detail rows (double-rAF open, timed collapse, reduced-motion support), including a subtle chip fade-in. Clearing filters now keeps a snapshot of the chips rendered during the collapse so they fade together with "Clear all" instead of vanishing first. The Filters button count badge pops in with a scale/fade animation to soften the pressed-state transition.
