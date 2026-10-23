---
'@educarehq/solaris-ui': patch
---

Fix inner vertical scroll in chart showcase previews: the `solaris-line-chart` screen-reader data table is now wrapped in the positioned `.solaris-line-chart__data` container (a bare `<table>` ignores the off-screen `0x0` sizing and leaked ~250px of scrollable overflow into `solaris-preview-code` surfaces), and the preview surface uses `overflow: auto clip` so page scroll owns the vertical axis. No visual or SR-tree changes. Also centers the `solaris-chart-shell` error state like the empty state.
