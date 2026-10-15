---
'@educarehq/solaris-ui': minor
---

Redesign `variant="avatar"` of `solaris-file-upload` as a full-width dashed photo panel (2x the form-field control height, 1.5x preview circle): `user` placeholder with `camera` badge, photo headline/link (`avatarHeadline` / `avatarBrowse`, `solaris.file-upload.avatar.drop` / `.browse`), and a supports hint from `accept` + `maxSize` (`solaris.file-upload.avatar.supports`, `solaris.file-upload.avatar.images` for `image/*`). The file list stays hidden for `avatar` since the preview circle carries the single-file state. The component stays dialog-free: wire `filesChange` to `SolarisImageEditorComponent` in a dialog (`1:1`, `circle`) and `writeValue([edited])`, as shown in the new showcase avatar example (success toast without byte count). The showcase variant previews follow the shared size/density controls.
