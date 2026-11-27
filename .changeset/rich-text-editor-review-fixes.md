---
'@educarehq/solaris-ui': patch
---

fix(rich-text-editor): review sweep corrections for editing flows

Tables and lists inserted mid-paragraph now split the block instead of nesting illegally. The Aa toggle preserves plain-mode edits instead of restoring a stale snapshot. Over-limit typing reverts the DOM to the committed value so model and view never diverge. Invalid link URLs close the panel instead of trapping focus, and local blob URLs are revoked on image remove and destroy.
