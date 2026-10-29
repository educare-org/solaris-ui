---
'@educarehq/solaris-ui': minor
---

feature(media-carousel): autoplay with progress dots, play/pause toggle, and always-visible arrows (F2)

Arrows are now always legible: a larger chevron over a translucent backdrop disc on every image. Dots grow slightly, the active dot stretches into a pill, and with `autoplay` it fills over `duration` (linear), pausing in sync with hover/focus/hidden-tab/offscreen/reduced-motion pauses. New `autoplay`/`duration`/`showPlayPause`/`pauseOnHover`/`playLabel`/`pauseLabel` (+Key) inputs, `autoplayChange` output, `carousel.play`/`carousel.pause` strings (`en-US`/`pt-BR`/`es-419`), and keyboard support (arrows/Home/End) when focus is inside the carousel.
