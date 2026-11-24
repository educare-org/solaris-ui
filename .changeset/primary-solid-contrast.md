---
'@educarehq/solaris-ui': patch
---

Fix primary solid contrast: active/selected text now uses `--solaris-primary-on-solid` instead of `--solaris-primary-foreground` over `--solaris-primary-solid`. Affects stepper active indicator, badge primary solid, checkbox primary checked, date calendar selected day/month, and calendar today states (year/month/week/schedule/shell). Light theme active contrast goes from 1.95:1 to 5.79:1.
