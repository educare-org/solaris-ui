---
'@educarehq/solaris-ui': patch
---

Fix solaris-select overflowing narrow containers: remove automatic content-based min-width floor. Trigger no longer receives an estimated `min-width` and the panel no longer receives a content-based `solarisPopoverMinWidth` by default; the panel follows `panelMatchTriggerWidth`. Host is `min-width: 0; max-width: 100%`, trigger is `width: 100%; min-width: 0` with ellipsis. `triggerMinWidth`, `panelMinWidth`, `panelMaxWidth` and `panelMatchTriggerWidth` remain as explicit overrides.
