---
'@educarehq/solaris-ui': minor
---

Upgrade to Angular 22 and fix the SSR form-suffix hydration crash. Peers move to `@angular/* ^22` with TypeScript `~6.0.3`; `model()`-owned change outputs (`viewChange`, `periodChange`, `displayModeChange`, `recordsChange`, `valueChange`, `activeIndexChange`) replace manually redeclared `output()` duplicates rejected by Angular 22 (NG1054). Projected form affix/suffix outlets are unconditional and re-projected first, fixing the prerender crash (`Cannot read properties of null (reading 'parentElement')` in `navigateBetween`) on pages composing `solaris-email-field` with a projected `solaris-form-suffix` action.
