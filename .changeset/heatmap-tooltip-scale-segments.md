---
'@educarehq/solaris-ui': patch
---

Fix `solaris-heatmap` edge tooltip clipping and segment the intensity scale: the tooltip now docks toward the grid center so first/last row and column cells keep the card inside the canvas instead of growing outward past the scrollport and preview surface (no extra scrollbar, full content always visible). `showScale` now renders five intensity buckets with six ticks (0, 20, 40, 60, 80, 100 at `max=100`) instead of a continuous gradient. Showcase scale matrix now includes values near 0 to exercise the lightest buckets.
