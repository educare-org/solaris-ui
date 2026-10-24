---
'@educarehq/solaris-ui': patch
---

`line-chart` sequential axes: on data change the new grid/ticks/reference stay hidden (inline) while the old snapshot layer fades out, and only fade in after it completes — old and new axis labels never overlap ("encavalado"). Snapshot sanitization now also resets axis opacity; cancel/destroy resets axes too. Verified with scripted screenshots at 150ms/400ms post-change.
