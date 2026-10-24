---
'@educarehq/solaris-ui': minor
---

Refine `solaris-image-editor` toward the reference layout: softer translucent crop mask with no separator border and rule-of-thirds framing guides while dragging, discreet zoom/rotate/reset controls overlaid at the bottom of the photo (compact slider, single-arrow `rotate-ccw` action icon for rotation, text-only reset, drag-to-reposition hint), and fixed `aspect`/`shape` driven only by inputs or dialog data (toolbar pickers removed, `aspects` kept as a deprecated alias). The stage now fits the photo aspect (560×380 max, 320×240 floor, refit on rotation) so dialogs opened with `width: 'fit-content'` hug the image with no side gutters, and the scroll wheel zooms over the photo. Adds the `rotate-ccw` built-in icon and the `solaris.image-editor.reset` / `solaris.image-editor.drag-to-reposition` translation keys (`en-US`/`pt-BR`).
