---
'@educarehq/solaris-ui': patch
---

fix(segmented-control): exact ladder heights, square radius, live indicator tracking

Outer height is pinned exactly to each size x density `control-height` token (content plus vertical padding always stays below the token so nothing clips; the `outline` border is compensated to stay on-token). Item horizontal padding keeps breathing room at or above the vertical padding in every combination, with vertical rhythm untouched. Width stays unconstrained: items only shrink below content in fixed-width (`fullWidth`/`equalWidth`) layouts, where long labels fall back to `nowrap + ellipsis` (projected content is clipped inside the item box, never painting outside the indicator). The host `font: .../1` shorthand is unified on `line-height-sm (1.4)`. The selection indicator re-measures on item resize (not just host resize) and once webfonts settle. Adds the square `radius="none"` (container, indicator and flush edges).
