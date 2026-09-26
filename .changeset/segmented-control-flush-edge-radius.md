---
'@educarehq/solaris-ui': patch
---

Fix the flush (`sm` + `compact`) `solaris-segmented-control` rendering square outer corners on edge segments: the first and last `solaris-segmented-item` now carry the container radius (`--solaris-segmented-radius`) on their outer corners, and the flush indicator follows the selected edge via the new `data-selected-edge` host attribute (`first` | `last` | `both`, derived from the selected item index, so it supports any number of options). Both orientations are covered with logical properties.
