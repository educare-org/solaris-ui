---
'@educarehq/solaris-ui': minor
---

feature(feedback): add spinner stacked variant, progress layout, and rounded caps

Extends `solaris-spinner` with a `variant` input (`ring` | `stacked` | `progress`). `stacked` renders a classic radial spinner built from 12 independent rounded bars (30 degrees apart) that animate a clockwise fading trail through staggered opacity states; `progress` renders a determinate arc driven by `value` (0-100, clamped) with optional `showPercent` and `description`/`descriptionKey` lines, `role="progressbar"`, and `aria-valuenow`/`valuemin`/`valuemax`/`valuetext`. The progress percentage and label share a baseline with description lines aligned beneath. The indicator now renders as SVG with rounded stroke caps and real-pixel stroke widths (`vector-effect: non-scaling-stroke`), and the static track uses the indicator color at reduced opacity (`--solaris-spinner-track-color` defaults to `--solaris-spinner-color`, `--solaris-spinner-track-opacity` defaults to `--solaris-opacity-30`).
