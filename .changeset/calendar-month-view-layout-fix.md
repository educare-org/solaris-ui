---
'@educarehq/solaris-ui': patch
---

Fix `solaris-calendar-month-view` layout: keep square cells with `border-box` sizing and clipped overflow, full-width chips with truncated text, true-circle day numbers with fixed size and zero padding, and auto-fit visible rows via `ResizeObserver` so the more button only appears when markings exceed what fits in the cell (the last row is replaced by it). The more button now occupies a full chip-sized row. `maxVisiblePerDay` remains as the initial/SSR cap and still governs the compact (<=480px) layout where square cells are disabled.
