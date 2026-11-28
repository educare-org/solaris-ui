---
'@educarehq/solaris-ui': patch
---

Restyle `rich-text-editor` quotes Claude-style: serif italic in tertiary with a 3px tertiary bar, shifted further right of the drag-grip lane. The closing mark is a managed span hugging the last content line, so it never sits alone on a fresh empty line while typing. Exiting a quote at the end of its text always leaves a visible paragraph (the extracted remainder can no longer be mark-only). Explicit user colors and link colors still win over the tertiary default.
