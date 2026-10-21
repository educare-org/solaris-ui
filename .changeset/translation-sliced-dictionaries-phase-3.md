---
'@educarehq/solaris-ui': minor
---

Slice translation dictionaries per component: 32 `translation/` packages with nested `en-US`/`pt-BR`/`es-419` JSON plus import-only `index.ts`. The central defaults now import every package and deep-merge per locale before load-time flattening, with identical keys (372) and no duplication.
