---
'@educarehq/solaris-ui': patch
---

fix(media-carousel): sequence slide and dot animations without shifting the dots row

The slide track and the dots animated concurrently, producing broken mid-transition states. The dot pill expansion is now delayed until the track finishes (phase one: slide, phase two: dots), and the row itself never moves — only the pill grows and displaces its neighbors. The play/pause toggle lives outside the dots group, so it stays put during navigation.
