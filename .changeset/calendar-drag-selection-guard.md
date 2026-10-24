---
'@educarehq/solaris-ui': patch
---

Fix the native text-selection highlight painting over the drag ghost when creating all-day ranges in the week and month views: the grid disables user selection while a drag session is active and any pending native selection is cleared when the session activates.
