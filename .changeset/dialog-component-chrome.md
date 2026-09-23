---
'@educarehq/solaris-ui': minor
---

`openComponent` now supports dialog chrome: `SolarisDialogComponentConfig` accepts `title`/`titleKey`, `description`/`descriptionKey`, `icon`/`iconDecorative`, `variant`, `actions` (+ `actionsAlign`/`actionsStack`/`actionsShape`/`actionsDensity`/`actionsRadius`) and ARIA fields (`ariaLabel`/`ariaLabelKey`/`ariaLabelledBy`/`ariaDescribedBy`). The container renders `solaris-dialog-header` and `solaris-dialog-actions` around the custom component with the header/footer separators and translated labels. Also adds `solaris-dialog-footer` (generic `ng-content` footer) and the `solaris-dialog-close` directive for closing with a result from a template.
