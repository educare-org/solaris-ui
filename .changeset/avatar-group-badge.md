---
'@educarehq/solaris-ui': minor
---

Add `solaris-avatar-group-badge`: a pill combining a mini overlapped member cluster with a text label. The `+N` overflow marker is static text (never a button), so the pill itself can render as a link (`href`) or a button (`actionAriaLabel`) with `badgeClick`, in any avatar `size`, without nesting interactives. It stays standalone on purpose — `solaris-badge` carries count/status semantics that don't fit an identity cluster — while every token comes from `--solaris-*`. The showcase gains a `group-badge` section with mirrored `en-US`/`pt-BR` strings.
