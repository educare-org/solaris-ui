---
'@educarehq/solaris-ui': minor
---

Add calendar drag interactions (phase C6) to the month and week views: pointer-based drag-create (empty slots/days with snap step), drag-move (chips and blocks), edge-resize on time-grid blocks, Escape/pointer-cancel, touch pointers, and keyboard equivalents (arrows move/resize, Enter commits) with live announcements and reduced-motion support. Drag emits proposals only (`eventCreate`/`eventMove`/`eventResize` with `occurrenceScope: single | occurrence` for series — recurring occurrences move as single instances); the lib never mutates the consumer array. Shared `calendar-drag` proposal builders, per-locale `solaris.calendar.*` fallback strings (`en`/`pt-BR`/`es`), and civil date helpers are now shared model modules, and the month/week/year/schedule views no longer embed translations or helpers in their components. Year and schedule views stay click + keyboard only by design.
