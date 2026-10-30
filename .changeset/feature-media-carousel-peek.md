---
'@educarehq/solaris-ui': minor
---

feature(media-carousel): peek visible count with side scale/dim and print baseline (F5)

New `visibleCount="peek"` centers the active slide at 80% of the viewport with a gap gutter so both neighbors peek at the edges (first/last positions show a gutter without clones — the v1 limit). Side slides render at `scale(0.92)` + 70% opacity and glide on the shared `normal` + `standard` track transition with the doubled reduced-motion guard. New `@media print` baseline renders a static first slide: arrows, dots, preview strip, and the play/pause toggle hide, the track transform resets, and only the first slide displays.
