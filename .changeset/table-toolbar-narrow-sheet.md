---
'@educarehq/solaris-ui': minor
---

feature(table-filter): collapse the toolbar into a dialog on narrow viewports

`solaris-table-toolbar` now collapses at 720px and below to one row of a larger search plus icon-only `solaris-icon-button` filter and export buttons; saved views, view creation, column management and the `leading`/`trailing` slots move into a centered modal dialog opened by the filter button, with `Customize columns` in a second tall bottom sheet. The host exposes `data-narrow` while the bar collapses. Sheet content follows the standard dialog content padding. Card-layout table toolbar/footer slots regain lateral padding, and pagination keeps `space-between` at 720px and below. Desktop popovers and dropdowns are unchanged.
