---
'@educarehq/solaris-ui': patch
---

Fix `pnpm verify` failures: move the sliced-translation aggregation out of `services/translation` into the `lib/i18n` layer (services must not import components), break the switch/switch-group and accordion/collapsible barrel import cycles that crashed bundle evaluation with a temporal-dead-zone error, and align the form-field radius docs and spec with the `md` default.
