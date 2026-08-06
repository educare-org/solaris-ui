---
'@educarehq/solaris-ui': patch
---

Fix a circular module dependency between `SolarisAccordionComponent` and `SolarisCollapsibleComponent` that crashed the published `fesm2022` bundle at module-evaluation time in JIT/unit-test environments (`ReferenceError: Cannot access 'SolarisCollapsibleComponent' before initialization`). The collapsible component now imports the `SOLARIS_ACCORDION` token directly from `model/accordion.tokens` instead of the accordion barrel, letting the bundler emit the classes in a deterministic order. Consumers can now import any symbol from the package barrel in Vitest/Karma/JIT without evaluation errors.
