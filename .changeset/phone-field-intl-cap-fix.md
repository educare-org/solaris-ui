---
'@educarehq/solaris-ui': patch
---

Fix phone-field international input truncation: `onInput` now passes only the explicit `maxLength` override to the parser so each country uses its own metadata length. Previously the derived `effectiveMaxLength` (based on the current country, e.g. AF=9) capped international numbers that switch country (e.g. US=10), producing a truncated display and empty E.164. Also add `@angular/compiler` to `peerDependencies` to satisfy the dependency check for JIT test imports.
