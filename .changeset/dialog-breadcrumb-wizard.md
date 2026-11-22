---
'@educarehq/solaris-ui': minor
---

Add `solaris-dialog-breadcrumb`: a navigable wizard trail for multi-step dialogs (nav + ol/li, `aria-current="step"`, past steps clickable, linear by default, `disabled`/`error` states) plus the `buildDialogWizardActions` helper for the Back / Continue / Finish footer. Opt-in composition over `solaris-dialog-flow`; no changes to the dialog service or container.
