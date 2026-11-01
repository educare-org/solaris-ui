---
'@educarehq/solaris-ui': patch
---

fix(pagination): align mobile layout and apply density modes

The pagination nav used `align-items: stretch` with `space-between` on narrow viewports, displacing the page-size select, range label and navigation buttons. It now keeps `align-items: center` with `flex-start` justification and wrapping row gaps. `compact`/`comfortable` densities now adjust gap, min-height and button size through `data-density` (previously contract-only).

fix(tooltip): match close button top spacing to text

The dismiss button carried an extra `margin-top` offset while the text sat flush on the container padding, so the `x` was lower than the first text line. The button top now aligns with the text top.

fix(code-block): wrap long lines and keep header actions on one row

Block/inline code forced `white-space: pre` with `min-inline-size: max-content`, cutting installation snippets (`pnpm add …`, `import { … }`) on narrow screens and letting the page pan sideways. Code now wraps (`pre-wrap` + `overflow-wrap: anywhere`) within `min-inline-size: 0` containers, the mobile header keeps the command selector and copy button on the same row, and the viewport contains horizontal overscroll chaining.
