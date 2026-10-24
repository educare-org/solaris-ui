---
'@educarehq/solaris-ui': minor
---

Revamp the calendar shell chrome: view switcher becomes a labeled select, toolbar/mini-month titles use regular weight with capitalized month, mini-month label drops the "Calendar of" prefix, the time-zone control is a single labeled select with GMT offset hint, custom days only show for the custom view, and display options (weekends/holidays) move into a collapsible with a new `showHolidays` toggle. Month-view task chips can now be dragged to another day via the new `taskMove` output (forwarded by the shell).
