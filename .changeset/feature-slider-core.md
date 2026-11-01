---
'@educarehq/solaris-ui': minor
---

feature(slider): add solaris-slider single-thumb form control

New `solaris-slider` with `value` model, `min/max/step/pageStep`, horizontal and vertical orientation, `valueDisplay` inline/tooltip/thumb/none, `formatValue/valueText/unit` formatting, `startIcon/endIcon/thumbIcon`, `showTicks/tickStep`, full WAI-APG keyboard (arrows, Home/End, PageUp/Down), `ControlValueAccessor` with `valueCommit` on pointer-up and blur-after-key, triple-locale dictionaries, harness, stories, showcase page, and token-driven styling with doubled reduced-motion guards. Pure math ships in `forms/slider/functions` and is shared with the upcoming range slider.
