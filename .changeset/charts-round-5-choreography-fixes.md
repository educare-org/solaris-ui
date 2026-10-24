---
'@educarehq/solaris-ui': minor
---

Charts round 5 (bugfixes + choreography): `line-chart` transition is now sequential — the previous frame slides out to the right first and the new one enters from the left behind it (~60ms overlap), instead of coexisting; dashes are applied synchronously to avoid a full-stroke flash. `line-chart` no longer shows dots/areas before their line is drawn — rows start hidden and each series reveals its dots (fade) and area (slide-down + fade) when its line finishes drawing, with immediate reveal fallbacks and full reset on cancel/destroy; the slide-out snapshot is sanitized (no tabindex, pens, or partial dash) with a removal safety timer; the X axis always renders the last label. Showcase: fixed the untranslated `periodLabelAll` key, natural period labels via `availablePeriods`, and fluid list rows (fade-out before removal, fade-in on return, timer cleanup).
