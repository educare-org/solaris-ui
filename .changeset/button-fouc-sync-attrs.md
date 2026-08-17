---
'@educarehq/solaris-ui': patch
---

fix(button): apply variant attributes synchronously to avoid FOUC

The `[solaris-button]` and `[solaris-icon-button]` directives rely on
`data-appearance`, `data-color`, `data-radius`, and `data-shape` attributes to
select the correct visual. These were applied only during Angular's first
change detection, so on first paint (especially with SSR/hydration or deferred
hydration) the element briefly showed the base style before switching to the
configured variant — a visible color flash.

The directives now set these attributes synchronously in the constructor, so
the element carries the correct variant from the moment it exists in the DOM.
Host bindings remain in place to keep them in sync when inputs change at
runtime.

Migration: none.
