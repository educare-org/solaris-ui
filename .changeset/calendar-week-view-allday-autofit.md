---
'@educarehq/solaris-ui': patch
---

Fix the `solaris-calendar-week-view` all-day row overflowing into a scrollbar instead of collapsing into the `+N` more button: visible chips now auto-fit the measured row budget (same pattern as the month view, `maxVisiblePerDay` stays the SSR/initial cap) and the last row is replaced by the overflow button whose popover keeps listing every item.
