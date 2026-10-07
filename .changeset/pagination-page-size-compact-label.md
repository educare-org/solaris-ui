---
'@educarehq/solaris-ui': patch
---

Fix the pagination page-size selector sizing and the mobile label. `solaris-select` gains a `triggerMinWidth` input that overrides the widest-option `contentMinWidth` floor (`0` removes it); the pagination page-size selector now passes `triggerMinWidth="0"` and `panelMinWidth="0"`, so the trigger and the dropdown panel shrink to the compact value + chevron (the previous ~69px inline floor was the remaining "large" space), the value reserves `3ch` for up to 3 digits with a slightly larger trigger gap, and the projected options use compact padding. The "rows per page" label is now also hidden by CSS inside card/mobile table footers (`solaris-table[data-card-layout]` / `solaris-table[data-mobile]`), covering card layouts forced on wide viewports such as the `layout="card"` showcase tab, where the viewport query never matches.
