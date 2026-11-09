---
'@educarehq/solaris-ui': patch
---

Select, multi-select and popover seam follow-up: the min-width floor now also lifts the trigger itself onto the shared device-pixel grid (`ceil` to device pixels, at most one device pixel of growth, never capped by the narrow-container cap which only bounds content-driven growth). Snapping only the panel (round to nearest) still left the trigger fractional, so the seam drifted ±half a device pixel either way depending on width and DPR — outward on some sizes, inward on others, most visible on narrow triggers. With both sides on the same device pixels the seam edges coincide exactly; the floor only grows, so sizing still converges instead of ratcheting.
