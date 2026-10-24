---
'@educarehq/solaris-ui': minor
---

Recalibrate `solaris-checkbox` label typography one step down across the 3x3 `size` x `density` matrix (`sm` now `xs`, `md` now `sm`, `lg` now `md`, default now `sm`) with matching line-heights. Make label and description text selectable (`user-select: text`, control box keeps `user-select: none`) so the text can be copied. Default label color is now muted (`--solaris-neutral-text-secondary`) and returns to the current text color (`inherit`) on hover or when `data-checked`/`data-indeterminate`, with a `color` transition on `--solaris-motion-duration-normal`.
