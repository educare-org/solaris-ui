---
'@educarehq/solaris-ui': patch
---

fix(table-filter): resetting the column manager now restores the draft order and visibility to the column defaults (previously only the applied filter was cleared, so saving after reset restored the modified layout). The reset button is disabled while the drafts already match the defaults, and the save button is disabled while the drafts match the applied state.
