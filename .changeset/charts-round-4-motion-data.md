---
'@educarehq/solaris-ui': minor
---

Charts round 4: richer motion and coherent mocks. `line-chart` draws each line from 0 to 100% (dashoffset) with a series-colored "pen" dot traveling the tip via `getPointAtLength`, staggered per series; on data changes the previous frame slides out to the right while the new one enters from the left behind it (snapshot overlay, sanitized and `aria-hidden`), with dots/areas fading in — all WAAPI with SSR, `prefers-reduced-motion` and missing-`animate` guards plus full cleanup on destroy/retrigger. X axis always renders the last label and thins long months. Showcase: coherent datasets (7-day week ending on the 4th, full 30-day April with per-day subtitles), natural consumer-owned period labels ("1 dia", "7 dias", "1 mês"…) via `availablePeriods`, and fluid list rows (fade enter, fade-out before removal, timer cleanup).
