---
'@educarehq/solaris-ui': minor
---

Add editable mode to `SolarisCodeBlockComponent` (`solaris-code-block`, block layout only). With `[editable]="true"`, an edit icon-button appears next to copy; while editing it morphs into a save button emitting `codeChange` (plus `editingChange` for enter/leave), with a cancel button, `Escape` to discard, and `Ctrl`/`Cmd`+`Enter` to save. New inputs: `editable`, `editLabel`/`editLabelKey`, `saveLabel`/`saveLabelKey`, `cancelLabel`/`cancelLabelKey`.
