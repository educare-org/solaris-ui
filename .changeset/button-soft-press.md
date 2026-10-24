---
'@educarehq/solaris-ui': patch
---

Soften the `:active`/`data-pressed` treatment of the low-emphasis appearances (`ghost`, `tonal`, `surface`) in `solaris-button` and `solaris-icon-button`. Pressing no longer flashes the solid fill with inverted text (which read as a visual bug on quick clicks); it now holds the hover treatment — same surface tint, same text/icon tone, stable border. Only `solid` and `outline` still commit to the solid `active` background on press. Docs updated (`Hover and active`, toggle `pressed` note, icon-button states).
