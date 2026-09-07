---
'@educarehq/solaris-ui': patch
---

Fix `solaris-select` and `solaris-multi-select` keeping the flat connected border after the popover closes. `data-connected-side` ownership moved to `SolarisPopoverTriggerDirective`, which now clears it on close, detach and overlay dispose, and keeps the panel data object in sync so the top/bottom flip is not reverted by change detection. The popover panel no longer renders a shadow when connected above a form field.
