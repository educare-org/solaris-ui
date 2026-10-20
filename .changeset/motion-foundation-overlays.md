---
'@educarehq/solaris-ui': minor
---

Add institutional motion language (Phase 0 + Phase 1). New `--solaris-motion-duration-exit` and `--solaris-motion-translate-sm` tokens, shared `solaris-motion-*` keyframes emitted by `core()` with opt-in mixins (`styles/motion`), `slowest` covered by reduced-motion, and stylelint banning `transition: all` (existing usages made explicit). Overlays now animate enter and exit (`data-closing`, state/outputs stay synchronous, only CDK detach delayed 210ms = 150ms animation + 60ms buffer): popover, dropdown-menu (+submenu), tooltip, dialog (panel + backdrop + placement/sheet/fullscreen variants), mega-menu; select, multi-select, date-picker and date-range-picker share the 4px enter. Full `prefers-reduced-motion` + `data-reduced-motion` coverage. See `docs/standards/motion-standard.md`.
