---
'@educarehq/solaris-ui': minor
---

Stabilize the `solaris-file-upload` dropzone panel and drive it from the `size` x `density` matrix (same pattern as Form Field): new `--solaris-file-upload-dropzone-min-height` (144–208px across the 9 combinations, always fitting the full idle content) and `--solaris-file-upload-dropzone-icon-size`, with padding and headline/hint/browse typography per combo. Fix the actual width shrink: the projected `.solaris-file-upload__body` is a flex item in the row-direction `solaris-form-field__control` slot, so its width resolved from content (235px idle → 138px dragging, measured in the showcase). It is now `width: 100%` with `min-width: 0` (same as `input`/`textarea` controls), and the host is `width: 100%` as well.
