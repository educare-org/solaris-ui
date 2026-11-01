---
'@educarehq/solaris-ui': minor
---

feature(table): render cards by default on narrow viewports with responsive opt-out

`solaris-table` now renders the card layout on viewports of 720px and below (or anywhere with `layout="card"`) without requiring `expandable`. Without `expandable`, cards render every field plainly with no chevron; `expandable` keeps controlling row and cell accordions. The new `responsive` input (`'auto' | 'scroll'`, default `'auto'`) preserves the previous behavior: `responsive="scroll"` keeps the scrollable table in every viewport. Exposed as `data-responsive` alongside the existing `data-card-layout` hook.
