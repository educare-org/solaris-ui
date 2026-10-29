---
'@educarehq/solaris-ui': patch
---

fix(media-carousel): dots spacing, outside position, play/pause toggle, and longer active pill

Dots no longer reserve the expanded width before activation: buttons hug their content with a symmetric hit padding, so the active pill displaces its neighbors, and the resting layout is identical after every navigation. The directional growth (left-to-right forward, right-to-left back) now comes from a row slide-in animation (`data-direction` + `data-pulse`) instead of a persistent offset. `dotsPosition="outside"` renders the dots after the viewport so clipping no longer hides them. The play/pause toggle shares the arrow inset from the edge and swaps visible text labels with a crossfade instead of swapping CSS-drawn icons. The active dot pill grows from 32px to 48px (`--solaris-spacing-13`).
