---
'@educarehq/solaris-ui': patch
---

`line-chart` transition overlay fix: imperatively created nodes (slide-out overlay, pen dot) never receive Angular's emulated-encapsulation attribute, so the component SCSS never matched them — the overlay rendered as an in-flow block duplicating the chart below. Positioning is now applied inline with an explanatory comment (dead SCSS rules removed, pen also ignores pointer events), and the draw/pen animation is slower (1000ms mount, 650ms updates).
