---
'@educarehq/solaris-ui': minor
---

Add four avatar improvements: roving `tabindex` with RTL-aware `ArrowLeft`/`ArrowRight`/`Home`/`End` navigation across member actions and the `+N` overflow in `solaris-avatar-group` (same for interactive `solaris-avatar-group-badge` members); per-member `tooltip`/`tooltipKey` on `SolarisAvatarGroupUser` reusing the Solaris tooltip without built-in overlays; `imageLoading` (default `lazy`) and `imageDecoding` (default `async`) inputs on `solaris-avatar` forwarded to the photo; and an overflow-measured `title` on the group-badge label that only appears when truncated, mirroring `solaris-avatar-profile`.
