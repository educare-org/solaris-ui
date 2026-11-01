---
'@educarehq/solaris-ui': minor
---

feature(range-slider): add solaris-range-slider multi-thumb form control

New `solaris-range-slider` with `values` model (ordered 2..N, v1 cap of 5 with dev warning), `minThumbs/maxThumbs/minStepsBetweenThumbs`, per-thumb WAI-APG keyboard with neighbor collision clamp (crossing is structurally impossible), `thumbFocus` emit, per-thumb `aria-valuemin/max/now/text` with translated min/max/positional names, inter-thumb fill via transform-only positioning, `thumb`-default value display with tooltip opt-in, vertical orientation, shared ticks, and `ControlValueAccessor` over the array with `valueCommit`. Reuses the F0 pure-math foundation, shares the `--solaris-slider-*` token language, ships harness, stories, showcase page, and triple-locale coverage.
