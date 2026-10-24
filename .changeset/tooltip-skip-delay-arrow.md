---
'@educarehq/solaris-ui': minor
---

Tooltip: new `solarisTooltipSkipDelay` input (default 300ms, Radix pattern — reopening within the window after a close skips `showDelay`), proportional arrow sizes (sm 8px, md 10px, lg 12px, shared with `SOLARIS_TOOLTIP_ARROW_SIZE_PX` so the CDK offset stays exact), and arrow rewrite as a rotated square centered on the panel edge (border only on the two outer sides), fixing 1px seam steps on every side with the `outline` appearance. Docs: corrected `offset` default (0), `maxWidth` default (320px), size table in px, plus `showOnDisabled` wrapper guidance. Follow-ups: touch long-press, `followCursor`, `maxLines`.
