---
'@educarehq/solaris-ui': minor
---

Migrate showcase dictionaries from TS consts to colocated nested JSON (`en-US`, `pt-BR`, `es-419`) with import-only `index.ts` per page and shell. Rename `translations/` folders to `translation/`, deep-merge page modules in the central aggregator, and add full `es-419` coverage plus a Services section with a live translate reference page (`/services/translate`).
