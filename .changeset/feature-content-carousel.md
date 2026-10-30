---
'@educarehq/solaris-ui': minor
---

feature(content-carousel): projected content carousel with align/divider matrix (F4)

New `solaris-content-carousel` with `<ng-template solaris-carousel-slide>` projection (`contentChildren`, DOM order), reusing the shared carousel engine (arrows, dots/progress/none navigation, autoplay with play/pause, loop clamp, keyboard). New `align` (`start/end/center/top/bottom/none`) + `showDivider` matrix (`end→left`, `start→right`, `center→both`, `top→bottom`, `bottom→top`, `none→none`, opt-in default off) and a fixed-height contract (`height: 100%` of the parent, never self-measured).
