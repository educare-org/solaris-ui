---
'@educarehq/solaris-ui': patch
---

Select, multi-select and popover seam follow-up. Panels with `matchTriggerWidth` now snap the matched width to whole device pixels (`Math.round(width * dpr) / dpr`, DPR read once per sizing in the trigger directive and passed into the pure `resolvePopoverSize`, defaulting to 1 for SSR/tests) instead of keeping the exact fractional trigger width. An exact fractional width keeps both seam edges on a subpixel boundary that the overlay layer antialiases differently than the in-flow trigger, which reads as a ~1px step on the right edge at 100% zoom in dark theme; rounding to nearest keeps the error under half a device pixel on either side and is stable across opens (no ratchet, explicit `panelMinWidth`/`panelMaxWidth` still win).
