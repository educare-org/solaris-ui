---
'@educarehq/solaris-ui': minor
---

feature(media-carousel): preview navigation with video badge and slideActivate (F3)

New `navigation="preview"` overlay strip with the current slide plus the next two thumbnails (wrapping with `loop`, truncated when clamped, never more thumbs than slides). Thumbs are buttons named `carousel.goToSlide` with `aria-current` on the active one; video thumbs carry a centered semi-transparent Play badge. New `previewCount` (clamped 1–3) and `previewPosition` (v1 overlay only) inputs plus the `slideActivate` output emitting the clicked slide — the consumer owns the player, the lib never plays video.
