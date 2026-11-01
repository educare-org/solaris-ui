---
'@educarehq/solaris-ui': minor
---

feature(slider): add showMinMax static scale bounds to solaris-slider and solaris-range-slider

New `showMinMax` input (default `false`) on both sliders renders the static scale bounds — minimum at the start, maximum at the end — as `aria-hidden` decoration, formatted through the existing `formatValue`/`unit` pipeline. Horizontal places them on either side of the track; vertical stacks them above and below. No new i18n keys, no new CSS variables, no motion; values print as-is.
