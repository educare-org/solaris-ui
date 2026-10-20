---
'@educarehq/solaris-ui': patch
---

Calendar shell no longer depends on the translate pipe: chrome strings resolve through the component locale fallback, so the shell renders without the translate service. The translate pipe itself returns the key instead of crashing when the service is absent.
