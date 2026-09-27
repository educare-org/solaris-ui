---
'@educarehq/solaris-ui': minor
---

`SolarisEditableTabsComponent`: icon tabs now swap the icon for the action trigger with the same cross-fade + scale pattern as `SolarisCodeBlockComponent` (`clipboard` ↔ `check`) instead of an instant `display` toggle, and tabs can be reordered by opt-in drag and drop via the new `[dragToReorder]` input (default `false`, requires `movable`). Drag and drop emits the same `tabMoveRequested`/`tabMove` events as the action-menu move, shows an orientation-aware drop indicator, and keeps the menu move as the keyboard-accessible fallback. When reorder is disabled, tabs render an explicit `draggable="false"` (no grab cursor, no drop indicator, dragstart cancelled), and `dragToReorder` coerces static attribute usage (`dragToReorder`) via `booleanAttribute`. The showcase page now follows the `tabs` docs pattern (`docs-page-layout` + `preview/code`).
