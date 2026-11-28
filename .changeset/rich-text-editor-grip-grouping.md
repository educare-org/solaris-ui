---
'@educarehq/solaris-ui': patch
---

Fix `rich-text-editor` block-grip spacing and grouping: the grip gutter is now a constant `spacing-7` (no more caret jump between empty and filled states), quotes get a left margin so the grip clears the border, code blocks get a single detached grip in the editor gutter instead of none, plain `Enter` exits quote groups to a new paragraph while `Shift+Enter` stays in the same group, and code blocks exit on `Enter` in an empty last line.
