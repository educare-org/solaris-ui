---
'@educarehq/solaris-ui': patch
---

Collapse the duplicate separator when dialog actions or footer render directly below a header with separator. The components detect the adjacent `solaris-dialog-header[data-separator]` sibling and set `data-adjacent-header`, which removes their own top border.
