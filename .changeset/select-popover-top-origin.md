---
'@educarehq/solaris-ui': patch
---

Fix `solaris-select` and `solaris-multi-select` popover opening above the label when there is no space below. The CDK origin is now the `.solaris-form-field__control-wrapper` (input box) when `solarisPopoverTopConnected` is set, so the `top` fallback covers the label and stays connected to the field.
