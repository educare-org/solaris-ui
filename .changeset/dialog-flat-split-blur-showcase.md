---
'@educarehq/solaris-ui': minor
---

feature(dialog): add flat appearance, split footer actions and backdrop blur

`appearance` accepts `'flat'`: bordered panel like `outline`, but header, footer and actions share the same background as the content (no bands) — forwarded from `appearance: 'flat'` to the chrome header and actions, or per-piece `[flat]` in manual composition. Actions accept `position: 'start'` to pin an action to the row start while the rest stays at the end (two-group `data-split` footer, e.g. Back | Help + Verify). The backdrop now blurs slightly by default (`--solaris-dialog-backdrop-filter: blur(2px)`, still overridable). Sheets always dock with straight edges (`radius` ignored on sheets). The dialog showcase was restructured: single-tab Examples and Behavior sections with the correct snippet per demo, variants section removed, density demo opens a component dialog with real content, flat-appearance and split-actions demos, richer nested/flow dialogs, and the validated flow rebuilt on form-field.
