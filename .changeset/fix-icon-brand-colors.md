---
'@educarehq/solaris-ui': patch
---

fix(icon): preserve brand colors and add inheritColor input

Multi-color brand icons (`google`, `microsoft`, `android`) and monochrome brand
icons (`apple`, `github`) carry their own fills. Previously the SVG root forced
`stroke="currentColor"` on every element, so these icons gained an inherited
outline in the surrounding text color, washing out their brand colors.

`solaris-icon` now detects icons that define their own element fills and omits
the inherited stroke (`stroke="none"`). A new `inheritColor` input (`true` by
default) gives explicit control: set `[inheritColor]="false"` to render a
line-based icon without an inherited stroke.
