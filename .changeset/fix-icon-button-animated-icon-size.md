---
'@educarehq/solaris-ui': patch
---

fix(icon-button): size projected animated icons at 1em like regular icons

`solaris-animated-icon` projected into `solaris-icon-button` was hardcoded to `spacing-5` (8px), rendering the menu/close morph unreadably small next to the 1em `solaris-icon` rule directly above it. Animated icons now inherit the button font size (`1em`), matching regular icons at every size and density.
