---
'@educarehq/solaris-ui': patch
---

Soften the press feedback of `solaris-button` and `solaris-icon-button`. The active scale goes from `0.99` to `0.97` (`--solaris-motion-scale-active`) so the press is perceptible, and the `transform` transition switches from the symmetric `standard` easing to `decelerate` — fast start with a soft landing instead of a mechanical snap. Durations are unchanged (`fast`, 150ms) and reduced-motion behavior is untouched.
