---
'@educarehq/solaris-ui': patch
---

feature(button): subtler press scale and fluid width for loader, badge and label swaps

Press feedback on `button` and `icon-button` used the global `--solaris-motion-scale-active` (`0.97`), which reads as a hard shrink on small buttons. They now use dedicated `--solaris-button-scale-active` / `--solaris-icon-button-scale-active` tokens (`0.99`). Width-affecting content changes (loading spinner insert, badge slot, label swap) jumped instantly because CSS `transition: width` never fires when the computed `width` stays `auto` — the shared `SolarisButtonHostBase` now animates them fluidly with FLIP (`MutationObserver` + `ResizeObserver` + WAAPI, `motion-normal` / `standard` easing from the tokens). Container-driven changes only re-sync the baseline, `fullWidth` buttons are skipped, and the loading spinner enters with `solaris-motion-pop-in`. Reduced motion disables the width animation, spinner animation, and press scale.
