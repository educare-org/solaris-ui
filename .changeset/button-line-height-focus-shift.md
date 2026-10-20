---
'@educarehq/solaris-ui': patch
---

Fix label jumping up on focus/click in `solaris-button`. The text line box (`line-height-sm`) was taller than the button content box in the tighter size/density combinations, so the overflowing text got clipped upward when focused. Buttons now use `line-height-none`: single-line labels are still centered by flex, and the line box fits every fixed control height.
