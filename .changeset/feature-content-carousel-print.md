---
'@educarehq/solaris-ui': patch
---

feature(content-carousel): print baseline with static first slide (F5)

New `@media print` baseline renders a static first slide: arrows, dots, and the play/pause toggle hide, the track transform resets, and only the first slide displays. Autoplay, hover, and motion do not run on paper. Print from any slide — the paper always shows slide one.
