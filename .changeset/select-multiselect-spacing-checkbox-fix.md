---
'@educarehq/solaris-ui': patch
---

Fix `solaris-select` and `solaris-multi-select` after form-field outline standardization: increase trigger/actions gaps so placeholder, value, clear (x) and chevron no longer look glued; hide chevron/clear while `loading` and reserve spinner space to prevent overlap; suppress form-field focus-ring when panel is connected (`data-connected-side`) so outline merges with the panel. Align multi-select select-all checkbox and option selection checkbox with the `solaris-checkbox` size x density matrix (9 combos) and make multi-select chip padding-y/x dynamic per size x density. Stabilize auto display ResizeObserver (outer trigger + subpixel guard + actions reserve) to fix clearable-mode flicker.
