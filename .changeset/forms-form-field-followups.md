---
'@educarehq/solaris-ui': minor
---

Form-field follow-ups: (1) required indicator in P3 parity — `*` marker next to inline labels plus `required` propagation to the native control with native-attribute auto-detection (`required` input is now `boolean | undefined` for manual/auto parity with disabled/readonly); (2) character counter also resolves `Validators.maxLength` from live `NgControl` errors (appears once exceeded); (3) projected `solaris-input`/`solaris-textarea` inherit `size`/`density` from the enclosing field via the new `SOLARIS_FORM_FIELD` parent token (own input wins, standalone keeps defaults; Lote A delegation specs updated to the inheritance contract); (4) full logical-property pass on field styles (counter, affix padding, loading reserve, textarea delegation) so RTL mirrors correctly — high-contrast stays token-driven. Showcase gains the required demo; docs updated.
