---
'@educarehq/solaris-ui': minor
---

Add `scale`, `tickValues`, `zones` and `distribution` inputs to `solaris-slider`: non-linear positioning (log/pow/time/custom) with value-space keyboard and snapping, explicit tick positions, value-driven fill color and a decorative density strip.

Add the same four inputs to `solaris-range-slider`: per-thumb positioning through `thumbRatios`, inter-thumb fill through the active scale, explicit ticks, host `data-color` resolved from the first thumb (per-thumb colors stay a non-goal) and a decorative density strip. Keyboard, snapping and `minStepsBetweenThumbs` gaps stay in value space.

Zone switches on both components play an overlay fade: the previous color lingers on an `aria-hidden` layer that fades out (`opacity`, `normal + standard`) over the new color — no muddy midpoint; instant under reduced motion, hidden in print.
