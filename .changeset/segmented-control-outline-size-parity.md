---
'@educarehq/solaris-ui': patch
---

Fix `solaris-segmented-control` outer-size parity between `surface` and `outline` appearances. The outline container owns a real 1px border (kept for forced-colors safety), so its thickness is now subtracted from the inner spacing: container side padding is reduced by `--solaris-segmented-border-width` (horizontal) or on all sides (vertical), and item `min-height` is reduced by twice the border width in horizontal mode where vertical padding is zero. A 32px control no longer renders as 34px in outline mode, and the vertical indicator inset follows the compensated padding.
