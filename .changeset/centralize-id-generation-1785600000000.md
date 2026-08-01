---
'@educarehq/solaris-ui': minor
---

refactor(core): centralize component id generation

Adds `nextIdFor` and `resolveElementId` utilities in `lib/core/utils` and
migrates all components away from per-module `let nextId` + `generateId()`
boilerplate.
