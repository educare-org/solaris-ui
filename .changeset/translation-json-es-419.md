---
'@educarehq/solaris-ui': minor
---

Migrate translation dictionaries from TS consts to nested JSON (`en-US`, `pt-BR`, `es-419`) with load-time flattening. Adds full `es-419` coverage (372 keys) and removes the legacy `es` locale key. Breaking: `SOLARIS_TRANSLATE_EN_US/PT_BR/ES` consts removed, `solaris.file-upload.avatar` renamed to `solaris.file-upload.avatar.label`.
