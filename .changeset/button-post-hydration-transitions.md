---
'@educarehq/solaris-ui': patch
---

fix(button): eliminate first-paint flash for `solaris-button` and `solaris-icon-button` across appearance, color, size, and density. Transitions now apply only after a browser-only `data-hydrated` marker is stamped in `afterNextRender` (never rendered on the server, so SSR hydration cannot diverge on it); pre-hydration paint uses `transition: none` over the neutral solid md/normal base. Adds `[data-size]:not([data-density)]` fallbacks assuming normal density so late density resolution (theme CSS, group context) lands without a geometry jump.
