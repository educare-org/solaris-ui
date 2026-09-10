---
'@educarehq/solaris-ui': major
---

BREAKING: card and selection-card ship with zero spacing by default and separators on by default.

- `solaris-card` and `solaris-selection-card` default to `padding: 0`, `gap: 0` and zero section margins in every `size` and `density`. `size` now only affects indicator, dot and side-media dimensions; spacing is freely configurable through the `--solaris-card-*` / `--solaris-selection-card-*` tokens.
- `solaris-card-header`, `solaris-card-footer`, `solaris-selection-card-header` and `solaris-selection-card-footer` now default `separator` to `true`. Set `[separator]="false"` where no divider is wanted.
- Selection-card separators always span the full row width, including the control column: the radio lives in the header row and the header separator renders as a full-width element below it; the switch lives in the footer row and the footer separator is the top border of that row. Header and footer share the same subtle color through `--solaris-selection-card-header-border-color` and the new `--solaris-selection-card-footer-border-color` (no longer following the selected card border color). The host exposes `data-header-separator` / `data-footer-separator`.
- `solaris-selection-card` adds `selection="radio" | "switch"` (default `radio`), `selectionPosition="start" | "end"` (default `start`) and `mediaPosition="top" | "start"` (default `top`). The radio indicator sits in the header row at header height; the switch is a standalone `checkbox[role="switch"]` with switch styling, always in the footer row (`start` before, `end` after the footer content, pushed to the row edge when there is no footer content), and must not be used inside `solaris-radio-group`.
- `solaris-card` adds `mediaPosition="top" | "start"`. `start` renders a fixed side thumb vertically centered next to the content.
