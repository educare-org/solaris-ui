---
'@educarehq/solaris-ui': patch
---

fix(button): pre-stamp data-\* variant attributes in ngOnInit so ghost/outline buttons never flash from the solid base style on first paint. Host bindings remain the source of truth afterwards. Applies to `solaris-button`, `solaris-icon-button` and `solaris-button-group`.
