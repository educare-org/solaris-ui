---
'@educarehq/solaris-ui': patch
---

Refine `solaris-file-list-item` density: larger file-type icon (`--solaris-file-list-item-icon-size` default `2xl`, centered across name+meta lines) and smaller text (`name: xs`, `meta: 2xs`). Document the supported rejection-feedback pattern with `SolarisToastService` via `fileRejected` instead of coupling `forms -> feedback`.
