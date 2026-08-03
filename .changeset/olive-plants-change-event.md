---
'@educarehq/solaris-ui': minor
---

rename `change` output to `changeEvent` in `solaris-switch`, `solaris-checkbox`, `solaris-radio` and the `solaris-switch-group`, `solaris-checkbox-group`, `solaris-radio-group` components. The old name collided with the native DOM `change` event and was flagged by `@angular-eslint/no-output-native`. Consumers should bind `(changeEvent)` instead of `(change)`.
