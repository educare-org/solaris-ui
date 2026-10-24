---
'@educarehq/solaris-ui': minor
---

Popover: zero-spacing container by default (`solarisPopoverPadding` now defaults to `'none'`, like Card and Dialog), new `solarisPopoverMaxHeight` input (number treated as px, panel scrolls via `data-scrollable` instead of overflowing the viewport), and appearance alignment (removed unreachable `'filled'` option, explicit `surface` block, variant state moved to `solaris-popover-panel` host attributes). Internal consumers (Select, Multi-select, Datepicker, Date-range-picker, Phone-field) already pass explicit padding and are unaffected. Follow-ups: arrow/beak, modal focus trap, open/close animation, ARIA presets.
