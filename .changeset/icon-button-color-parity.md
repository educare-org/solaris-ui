---
'@educarehq/solaris-ui': patch
---

Align `solaris-icon-button` color scheme with `solaris-button`. The icon-button `:hover`/`:active` rules now apply the icon color (new `--solaris-icon-button-hover-color`/`--solaris-icon-button-active-color` vars), and every `color x appearance` block mirrors the button tokens: `outline` fills with the solid hover/active background and inverts the icon color (e.g. neutral outline now fills `surface-reverse` instead of `surface-muted`), `primary solid` uses `primary-on-solid` as the resting color, `ghost`/`tonal`/`surface` active states use the solid active background, and `custom` gains hover/active color overrides. Also adds the missing `surface` hover border-color rules and the `text-muted` disabled color. `chromeless` keeps its transparent background and preserves the glyph color on hover/active so the new hover colors never render an invisible icon.
