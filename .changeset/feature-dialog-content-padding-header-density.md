---
'@educarehq/solaris-ui': minor
---

feature(dialog): add content padding variable and density-scaled header

`solaris-dialog-content` exposes `--solaris-dialog-content-padding` (`spacing-0/2/4/6` for default/compact/normal/comfortable, consumer-overridable without `::ng-deep`, default identical to before). `solaris-dialog-header` accepts `density` (input > theme > `normal`, forwarded by the container chrome and by `solaris-dialog` in simple mode) and pairs icon with title per density (`md/md`, `lg/lg`, `xl/xl` with `media-size` `spacing-7/8/9`), correcting the previous `2xl` icon vs `lg` title mismatch.
