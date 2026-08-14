---
'@educarehq/solaris-ui': minor
---

feature(dialog): add placement option for bottom-anchored panels

Adds a `placement` option ('center' | 'bottom') to `SolarisDialogOptions` and
`SolarisDialogComponentConfig`. When set to 'bottom', the dialog panel anchors
to the bottom of the viewport, enabling bottom-sheet style previews without
occupying the full height.
