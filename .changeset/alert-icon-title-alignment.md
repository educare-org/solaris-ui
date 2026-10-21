---
'@educarehq/solaris-ui': patch
---

Fix `solaris-alert` icon alignment when a title is projected. `--solaris-alert-icon-offset` was `0` (unitless) under `data-has-title`, which invalidated `inset-block-start: calc(0.5lh + var(--solaris-alert-icon-offset))` and dropped the icon's vertical centering to `0px` — leaving the icon ~12.6px above the title's center. It is now `0px`, restoring the icon/title/close-button centering on the title's first line.
