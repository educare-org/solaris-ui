---
'@educarehq/solaris-ui': major
---

feature(styles): standardize units to px and colors to hex

Replaces rem-based design tokens with px so rendering is deterministic
regardless of the consumer's root font-size. A consumer that sets a custom
root font-size (e.g. 62.5%) will no longer silently rescale Solaris
components.

Token values changed:

- spacing, radius, typography, and density tokens now use px;
- translucent rgb()/rgba() values now use 8-digit hex (e.g. `#0000004d`);
- default public API sizes now use px (`panelMaxHeight` and
  `solarisTooltipMaxWidth` default to `320px`);
- `rem` is forbidden in component styles; relative units are allowed only
  where required (`vw`/`dvh`, `em` for letter-spacing).

Page zoom still satisfies WCAG 1.4.4 (Resize Text).
