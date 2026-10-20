---
'@educarehq/solaris-ui': minor
---

Add `showAddAction` to `solaris-collapsible`: an add button before the chevron that opens `SolarisCollapsibleAddDialogComponent` (required title, required description, icon select with a `None` option) and emits `addSubmitted` with `{ label, description, leadingIcon }`.

Add `solaris-collapsible-input`: an interactive last row for `solaris-accordion` (FAQ-style). It freezes the submitted question as its label, receives `[loading]` from the consumer, announces the loading status via `aria-live`, emits `submitted`/`cancelled`, and renders the projected answer in its expansion like a regular section.
